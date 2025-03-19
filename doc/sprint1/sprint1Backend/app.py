### IMPORTS #######################################################################################
import os, sqlalchemy, warnings, requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker, relationship
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine, String, Integer, Boolean, ForeignKey, insert, delete, select, exc
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import exists
from dotenv import load_dotenv
warnings.simplefilter("default")
warnings.simplefilter("ignore", category=exc.LegacyAPIWarning)

### LOAD ENVIRONMENT VARIABLES FROM .ENV ##########################################################
load_dotenv()
DATABASE_URI = os.getenv("DATABASE_URI")
api_key = os.getenv("API_KEY")

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
    userName = mapped_column(String, nullable = False)

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
    userName = "myUsername"

    Session = sessionmaker(bind = engine)
    session = Session()
    
    if(session.query(User.email).filter_by(email=email).first() is None):
        newUser = User(email = email, password = password, userName = userName)
        session.add(newUser)
        session.commit()
        return"[/add-user] User successfully added"
    else:
        return "[/add-user] A user with this email already exists"

@app.route("/add-genres")
def addGenres():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Genres.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'GENRES'
            newGenres = Genres(email = email)
            session.add(newGenres)
            session.commit()
            return"[/add-genres] Successfully added genres"
        else:
            return "[/add-genres] Referencing email already exists in 'GENRES'"
    else:
        return "[/add-genres] No user with this email exists in the database"

@app.route("/add-preferences")
def addPreferences():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None):
        if(session.query(Preferences.email).filter_by(email=email).first() is None):
            newPreferences = Preferences(email = email, textSize = 50, quoteDelay = 60, lightMode = True, doAnimation = True)
            session.add(newPreferences)
            session.commit()
            return"[/add-preferences] Successfully added preferences"
        else:
            return "[/add-preferences] Referencing email already has an entry in 'PREFERENCES'"
    else:
        return "[/add-preferences] No user with this email exists in the database"

@app.route("/add-favorites")
def addFavorites():
    email = "abc@yahoo.ca"

    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None):
        if(session.query(Favorites.email).filter_by(email=email).first() is None):
            newFavorites = Favorites(email = email)
            session.add(newFavorites)
            session.commit()
            return"[/add-favorites] Successfully added favorites"
        else:
            return "[/add-favorites] Referencing email already has an entry in 'FAVORITES'"
    else:
        return "[/add-favorites] No user with this email exists in the database"

@app.route("/remove-user")
def removeUser():
    email = "abc@yahoo.ca"
    
    Session = sessionmaker(bind = engine)
    session = Session()

    deleteUser = session.query(User).get(email)
    if deleteUser != None:
        session.delete(deleteUser)
        session.commit()
        return "[/remove-user] Successfully removed user"
    else:
        return "[/remove-user] User does not exist in database"

@app.route("/user-quote/<email>", methods = ["GET"])
def getQuote(email):
    Session = sessionmaker(bind = engine)
    session = Session()

    userGenres = session.query(Genres).filter_by(email = email).first()
    if not userGenres:
        print("User is not found")
    
    genre = userGenres.genreOne or userGenres.genreTwo or userGenres.genreThree
    if not genre:
        print("No genres selected")

    api_url = 'https://api.api-ninjas.com/v1/quotes'
    response = requests.get(api_url, headers={'X-Api-Key' : api_key})

    if response.status_code == requests.codes.ok:
        print(response.text)
    else:
        print("Error:", response.status_code, response.text)

print(addUser())
print(addGenres())
print(addPreferences())
print(addFavorites())
# print(removeUser())
# print(getQuote("abc@yahoo.ca"))