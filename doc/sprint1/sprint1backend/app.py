### IMPORTS #######################################################################################
import os, sqlalchemy, warnings
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker, relationship
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine, String, Integer, Boolean, ForeignKey, insert, delete, select, exc
from sqlalchemy.dialects.postgresql import ARRAY
from dotenv import load_dotenv
warnings.simplefilter("default")
warnings.simplefilter("ignore", category=exc.LegacyAPIWarning)

### LOAD ENVIRONMENT VARIABLES FROM .ENV ##########################################################
load_dotenv()
DATABASE_URI = os.getenv("DATABASE_URI")

class Base(DeclarativeBase):
    pass

### INITIALIZE DATABSE & FLASK APPLICATION ########################################################
db = SQLAlchemy(model_class = Base)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
db.init_app(app)

### CREATE ENGINE #################################################################################
engine = create_engine(DATABASE_URI)
try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")

### TABLE INITIALIZATION ##########################################################################
class User(db.Model):
    __tablename__ = "USER"
    email = mapped_column(String, primary_key = True)
    password = mapped_column(String, nullable = False)
    firstName = mapped_column(String, nullable = False)
    lastName = mapped_column(String, nullable = False)

class Genres(db.Model):
    __tablename__ = "GENRES"
    email = mapped_column(String, ForeignKey("USER.email"), primary_key = True)
    genreOne = mapped_column(String)
    genreTwo = mapped_column(String)
    genreThree = mapped_column(String)

class Preferences(db.Model):
    __tablename__ = "PREFERENCES"
    email = mapped_column(String, ForeignKey("USER.email"), primary_key = True)
    textSize = mapped_column(sqlalchemy.Integer)
    quoteDelay = mapped_column(sqlalchemy.Integer)
    lightMode = mapped_column(sqlalchemy.Boolean, nullable = False)
    doAnimation = mapped_column(sqlalchemy.Boolean, nullable = False)

class Favorites(db.Model):
    __tablename__ = "FAVORITES"
    email = mapped_column(String, ForeignKey("USER.email"), primary_key = True)
    quote = mapped_column(ARRAY(String))

## CREATE TABLES (IF NEEDED) #####################################################################
with app.app_context():
    db.create_all()

### ROUTES & FUNCTIONS ############################################################################
@app.route("/add-user")
def addUser():
    email = "abc@yahoo.ca"
    password = "myPassword"
    firstName = "myFirstName"
    lastName = "myLastName"

    Session = sessionmaker(bind = engine)
    session = Session()
    newUser = User(email = email, password = password, firstName = firstName, lastName = lastName)
    session.add(newUser)
    
    try:
        session.commit()
    except IntegrityError:
        print("[/add-user] User Already Exists in Database")

@app.route("/add-genres")
def addGenres():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()
    newGenres = Genres(email = email)
    session.add(newGenres)

    try:
        session.commit()
    except IntegrityError:
        print("[/add-genres] Referencing Email Already Exists in Database")

@app.route("/add-preferences")
def addPreferences():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()
    newPreferences = Preferences(email = email, lightMode = True, doAnimation = True)
    session.add(newPreferences)

    session.commit()

@app.route("/add-favorites")
def addFavorites():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()
    newFavorites = Favorites(email = email)
    session.add(newFavorites)

    try:
        session.commit()
    except IntegrityError:
        print("[/add-favorites] Referencing Email Already Exists in Database")

@app.route("/remove-user")
def removeUser():
    email = "abc@yahoo.ca"
    
    Session = sessionmaker(bind = engine)
    session = Session()
    deleteUser = session.query(User).get(email)
    if deleteUser != None:
        session.delete(deleteUser)
        session.commit()
    else:
        print("[/remove-user] User Does not Exist in Database")

#addUser()
#addGenres()
#addPreferences()
#addFavorites()
#removeUser()