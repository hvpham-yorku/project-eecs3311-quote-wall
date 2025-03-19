### IMPORTS #######################################################################################
import os, sqlalchemy, warnings, requests, random
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker, relationship
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine, String, Integer, Boolean, ForeignKey, insert, delete, exc
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import exists, select
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
    genres = mapped_column(ARRAY(String))

class Preferences(db.Model):
    __tablename__ = "PREFERENCES"
    email = mapped_column(String, ForeignKey("USER.email"), primary_key = True)
    textSize = mapped_column(sqlalchemy.Integer, nullable = False)
    quoteDelay = mapped_column(sqlalchemy.Integer, nullable = False)
    lightMode = mapped_column(sqlalchemy.Boolean, nullable = False)
    doAnimation = mapped_column(sqlalchemy.Boolean, nullable = False)

class Favorites(db.Model):
    __tablename__ = "FAVORITES"
    email = mapped_column(String, ForeignKey("USER.email"), primary_key = True)
    quotes = mapped_column(ARRAY(String))

## CREATE TABLES (IF NEEDED) #####################################################################
with app.app_context():
    db.create_all()

### CUSTOM EXCEPTION CLASS ########################################################################
class UserCreationException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

### ROUTES & FUNCTIONS ############################################################################
@app.route("/create-user")
def createUser(email, password, userName):
    genres = [None, None, None]
    quotes = [None, None, None, None, None, None, None, None, None, None]
    try:
        addUser(email, password, userName)
        addPreferences(email)
        addFavorites(email, quotes)
        addGenres(email, genres)
        return "[/create-user] Successfully created user"
    except UserCreationException as e:
        return "[/create-user] An error occurred while trying to create the user:\n{}".format(e)

def addUser(email, password, userName):
    Session = sessionmaker(bind = engine)
    session = Session()
    
    if(session.query(User.email).filter_by(email=email).first() is None): #Check if this email does not exist as a user in the database
        newUser = User(email = email, password = password, userName = userName)
        session.add(newUser)
        session.commit()
        return"[addUser] User successfully added"
    else:
        raise UserCreationException("[addUser] A user with this email already exists")

def addGenres(email, genres):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Genres.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'GENRES'
            newGenres = Genres(email = email, genres = genres)
            session.add(newGenres)
            session.commit()
            return"[addGenres] Successfully added genres"
        else:
            raise UserCreationException("[addGenres] Referencing email already exists in 'GENRES'")
    else:
        raise UserCreationException("[addGenres] No user with this email exists in the database")

def addPreferences(email):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Preferences.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'PREFERENCES'
            newPreferences = Preferences(email = email, textSize = 50, quoteDelay = 60, lightMode = True, doAnimation = True)
            session.add(newPreferences)
            session.commit()
            return"[addPreferences] Successfully added preferences"
        else:
            raise UserCreationException("[addPreferences] Referencing email already has an entry in 'PREFERENCES'")
    else:
        raise UserCreationException("[addPreferences] No user with this email exists in the database")

def addFavorites(email, quotes):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Favorites.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'FAVORITES'
            newFavorites = Favorites(email = email, quotes = quotes)
            session.add(newFavorites)
            session.commit()
            return"[addFavorites] Successfully added favorites"
        else:
            raise UserCreationException("[addFavorites] Referencing email already has an entry in 'FAVORITES'")
    else:
        raise UserCreationException("[addFavorites] No user with this email exists in the database")

@app.route("/remove-user")
def removeUser(email):
    Session = sessionmaker(bind = engine)
    session = Session()

    deleteUser = session.query(User).get(email) #Check if the user has an entry in 'USER'
    if deleteUser != None:
        session.delete(deleteUser)
        session.commit()
        return "[/remove-user] Successfully removed user"
    else:
        return "[/remove-user] User does not exist in database"

@app.route("/user-update-genres")
def updateGenres(email, genres):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Genres.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'GENRES'
            session.query(Genres).filter(Genres.email == email).update({Genres.genres: genres})
            session.commit()
            return"[/user-update-genres] Successfully updated genres"
        else:
            return "[/user-update-genres] Referencing email already has no entry in 'GENRES'"
    else:
        return "[/user-update-genres] No user with this email exists in the database"

@app.route("/user-update-textSize")
def updateTextSize(email, newTextSize):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Preferences.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            session.query(Preferences).filter(Preferences.email == email).update({Preferences.textSize: newTextSize})
            session.commit()
            return"[/user-update-textSize] Successfully updated text size"
        else:
            return "[/user-update-textSize] Referencing email already has no entry in 'PREFERENCES'"
    else:
        return "[/user-update-textSize] No user with this email exists in the database"

@app.route("/user-update-quoteDelay")
def updateQuoteDelay(email, newQuoteDelay):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Preferences.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            session.query(Preferences).filter(Preferences.email == email).update({Preferences.quoteDelay: newQuoteDelay})
            session.commit()
            return"[/user-update-quoteDelay] Successfully updated text size"
        else:
            return "[/user-update-quoteDelay] Referencing email already has no entry in 'PREFERENCES'"
    else:
        return "[/user-update-quoteDelay] No user with this email exists in the database"
    
@app.route("/user-toggle-lightMode")
def toggleLightMode(email):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            inverse = False if (session.query(Preferences.lightMode).filter_by(email = email).first()[0] == True) else True
            session.query(Preferences).filter(Preferences.email == email).update({Preferences.lightMode: inverse})
            session.commit()
            return"[/user-toggle-lightMode] Successfully toggled light mode"
        else:
            return "[/user-toggle-lightMode] Referencing email already has no entry in 'PREFERENCES'"
    else:
        return "[/user-toggle-lightMode] No user with this email exists in the database"

@app.route("/user-toggle-animations")
def toggleAnimations(email):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            inverse = False if (session.query(Preferences.doAnimation).filter_by(email = email).first()[0] == True) else True
            session.query(Preferences).filter(Preferences.email == email).update({Preferences.doAnimation: inverse})
            session.commit()
            return"[/user-toggle-animations] Successfully toggled animations"
        else:
            return "[/user-toggle-animations] Referencing email already has no entry in 'PREFERENCES'"
    else:
        return "[/user-toggle-animations] No user with this email exists in the database"
    
@app.route("/user-update-favorites")
def updateFavorites(email, quotes):
    Session = sessionmaker(bind = engine)
    session = Session()

    if(session.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(session.query(Favorites.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'FAVORITES'
            session.query(Favorites).filter(Favorites.email == email).update({Favorites.quotes: quotes})
            session.commit()
            return"[/user-update-favorites] Successfully updated genres"
        else:
            return "[/user-update-favorites] Referencing email already has no entry in 'FAVORITES'"
    else:
        return "[/user-update-favorites] No user with this email exists in the database"
    
@app.route("/user-quote/<email>", methods = ["GET"])
def getQuote(email):
    Session = sessionmaker(bind=engine)
    session = Session()

    userGenres = session.query(Genres).filter_by(email=email).first()
    if not userGenres or not userGenres.genres:
        print("User is not found")
    
    valid = [i for i in userGenres.genres if i]
    genre = random.choice(valid) if valid else None
    if not genre:
        print("No genres selected")

    api_url = 'https://api.api-ninjas.com/v1/quotes?category={genre}'
    response = requests.get(api_url, headers={'X-Api-Key' : api_key})

    if response.status_code == requests.codes.ok:
        print(response.text)
    else:
        print("Error:", response.status_code, response.text)


email = "abc@yahoo.ca"
userName = "myUserName"
password = "myPassword"

print(createUser(email, password, userName))
#print(removeUser(email))
# print(getQuote("abc@yahoo.ca"))
# print(updateGenres())
# print(updateTextSize())
# print(toggleLightMode())
# print (toggleAnimations())
# print(updateFavorites())