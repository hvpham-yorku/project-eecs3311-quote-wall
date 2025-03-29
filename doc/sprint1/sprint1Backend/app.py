### IMPORTS #######################################################################################
import os, sqlalchemy, warnings, random, requests
from flask import Flask, request, jsonify, Response, session
from flask_cors import CORS, cross_origin
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
SECRET_KEY = os.getenv("SECRET_KEY")
api_key = os.getenv("API_KEY")

class Base(DeclarativeBase):
    pass

### INITIALIZE DATABSE & FLASK APPLICATION ########################################################
db = SQLAlchemy(model_class = Base)
app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
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
class UserDataException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

### USER FUNCTIONS ################################################################################
@app.route("/create-user", methods = ["POST"])
@cross_origin()  
def createUser():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    userName = data["userName"]

    genres = [None, None, None]
    quotes = [None, None, None, None, None, None, None, None, None, None]
    try:
        addUser(email, password, userName)
        addPreferences(email)
        addFavorites(email, quotes)
        addGenres(email, genres)
        return jsonify("[/create-user] Successfully created user")
    except UserDataException as e:
        return jsonify("[/create-user] An error occurred while trying to create the user:{}".format(e)), 400

def addUser(email, password, userName):
    Session = sessionmaker(bind = engine)
    mySession = Session()
    
    if(mySession.query(User.email).filter_by(email=email).first() is None): #Check if this email does not exist as a user in the database
        newUser = User(email = email, password = password, userName = userName)
        mySession.add(newUser)
        mySession.commit()
        return"[addUser] User successfully added"
    else:
        raise UserDataException("[addUser] A user with this email already exists")

def addGenres(email, genres):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Genres.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'GENRES'
            newGenres = Genres(email = email, genres = genres)
            mySession.add(newGenres)
            mySession.commit()
            return"[addGenres] Successfully added genres"
        else:
            raise UserDataException("[addGenres] Referencing email already exists in 'GENRES'")
    else:
        raise UserDataException("[addGenres] No user with this email exists in the database")

def addPreferences(email):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'PREFERENCES'
            newPreferences = Preferences(email = email, textSize = 50, quoteDelay = 60, lightMode = True, doAnimation = True)
            mySession.add(newPreferences)
            mySession.commit()
            return"[addPreferences] Successfully added preferences"
        else:
            raise UserDataException("[addPreferences] Referencing email already has an entry in 'PREFERENCES'")
    else:
        raise UserDataException("[addPreferences] No user with this email exists in the database")

def addFavorites(email, quotes):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Favorites.email).filter_by(email=email).first() is None): #Check if the user has an entry in 'FAVORITES'
            newFavorites = Favorites(email = email, quotes = quotes)
            mySession.add(newFavorites)
            mySession.commit()
            return"[addFavorites] Successfully added favorites"
        else:
            raise UserDataException("[addFavorites] Referencing email already has an entry in 'FAVORITES'")
    else:
        raise UserDataException("[addFavorites] No user with this email exists in the database")

@app.route("/remove-user", methods = ["POST"])
@cross_origin()
def removeUser():
    data = request.get_json()
    email = data["email"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    deleteUser = mySession.query(User).get(email) #Check if the user has an entry in 'USER'
    if deleteUser != None:
        mySession.delete(deleteUser)
        mySession.commit()
        return jsonify("[/remove-user] Successfully removed user")
    else:
        return jsonify("[/remove-user] User does not exist in database"), 404

### GENRES FUNCTIONS ##############################################################################
@app.route("/user-update-genres", methods = ["POST"])
@cross_origin()
def updateGenres():
    data = request.get_json()
    email = data["email"]
    genres = data["genres"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Genres.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'GENRES'
            mySession.query(Genres).filter(Genres.email == email).update({Genres.genres: genres})
            mySession.commit()
            return jsonify("[/user-update-genres] Successfully updated genres")
        else:
            return jsonify("[/user-update-genres] Referencing email already has no entry in 'GENRES'"), 404
    else:
        return jsonify("[/user-update-genres] No user with this email exists in the database"), 404

### PREFERENCES FUNCTIONS #########################################################################
@app.route("/user-update-preferences", methods = ["POST"])
@cross_origin()
def updatePreferences():
    data = request.get_json()
    email = data["email"]
    textSize = data["textSize"]
    quoteDelay = data["quoteDelay"]
    lightMode = data["lightMode"]
    doAnimation = data["doAnimation"]

    try:
        updateTextSize(email, textSize)
        updateQuoteDelay(email, quoteDelay)
        toggleLightMode(email)
        toggleAnimation(email)
        return jsonify("[/user-update-preferences] Successfully updated user preferences")
    except UserDataException as e:
        return jsonify("[/user-update-preferences] An error occurred while trying to update preferences:{}".format(e)), 400
    
def updateTextSize(email, newTextSize):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            mySession.query(Preferences).filter(Preferences.email == email).update({Preferences.textSize: newTextSize})
            mySession.commit()
            return"[/user-update-textSize] Successfully updated text size"
        else:
            raise UserDataException("/user-update-textSize] Referencing email already has no entry in 'PREFERENCES'")
    else:
        raise UserDataException("[/user-update-textSize] No user with this email exists in the database")

def updateQuoteDelay(email, newQuoteDelay):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            mySession.query(Preferences).filter(Preferences.email == email).update({Preferences.quoteDelay: newQuoteDelay})
            mySession.commit()
            return"[/user-update-quoteDelay] Successfully updated text size"
        else:
            raise UserDataException("[/user-update-quoteDelay] Referencing email already has no entry in 'PREFERENCES'")
    else:
        raise UserDataException("[/user-update-quoteDelay] No user with this email exists in the database")
    
def toggleLightMode(email):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            inverse = False if (mySession.query(Preferences.lightMode).filter_by(email = email).first()[0] == True) else True
            mySession.query(Preferences).filter(Preferences.email == email).update({Preferences.lightMode: inverse})
            mySession.commit()
            return"[/user-toggle-lightMode] Successfully toggled light mode"
        else:
            raise UserDataException("[/user-toggle-lightMode] Referencing email already has no entry in 'PREFERENCES'")
    else:
        raise UserDataException("[/user-toggle-lightMode] No user with this email exists in the database")

def toggleAnimation(email):
    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            inverse = False if (mySession.query(Preferences.doAnimation).filter_by(email = email).first()[0] == True) else True
            mySession.query(Preferences).filter(Preferences.email == email).update({Preferences.doAnimation: inverse})
            mySession.commit()
            return"[/user-toggle-animation] Successfully toggled animations"
        else:
            raise UserDataException("[/user-toggle-animation] Referencing email already has no entry in 'PREFERENCES'")
    else:
        raise UserDataException("[/user-toggle-animation] No user with this email exists in the database")

### PREFERENCES GETTER FUNCTIONS ##################################################################
@app.route("/user-get-text-size", methods = ["POST"])
@cross_origin()
def getTextSize():
    data = request.get_json()
    email = data["email"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            textSize = mySession.query(Preferences.textSize).filter_by(email = email).first()[0]
            return jsonify({'textSize' : textSize})
        else:
            return jsonify("[/user-get-text-size] Referencing email already has no entry in 'PREFERENCES"), 400
    else:
        return jsonify("[/user-get-text-size] No user with this email exists in the database"), 400

@app.route("/user-get-quote-delay", methods = ["POST"])
@cross_origin()
def getQuoteDelay():
    data = request.get_json()
    email = data["email"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            quoteDelay = mySession.query(Preferences.quoteDelay).filter_by(email = email).first()[0]
            return jsonify({'quoteDelay' : quoteDelay})
        else:
            return jsonify("[/user-get-quote-delay] Referencing email already has no entry in 'PREFERENCES"), 400
    else:
        return jsonify("[/user-get-quote-delay] No user with this email exists in the database"), 400

@app.route("/user-get-light-mode", methods = ["POST"])
@cross_origin()
def getLightMode():
    data = request.get_json()
    email = data["email"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            lightMode = mySession.query(Preferences.lightMode).filter_by(email = email).first()[0]
            return jsonify({'lightMode' : lightMode})
        else:
            return jsonify("[/user-get-light-mode] Referencing email already has no entry in 'PREFERENCES"), 400
    else:
        return jsonify("[/user-get-light-mode] No user with this email exists in the database"), 400

@app.route("/user-get-do-animation", methods = ["POST"])
@cross_origin()
def getDoAnimation():
    data = request.get_json()
    email = data["email"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Preferences.email).filter_by(email = email).first() is not None): #Check if the user has an entry in 'PREFERENCES'
            doAnimation = mySession.query(Preferences.doAnimation).filter_by(email = email).first()[0]
            return jsonify({'doAnimation' : doAnimation})
        else:
            return jsonify("[/user-get-do-animation] Referencing email already has no entry in 'PREFERENCES"), 400
    else:
        return jsonify("[/user-get-do-animation] No user with this email exists in the database"), 400

### FAVORITES FUNCTIONS ###########################################################################
@app.route("/user-update-favorites", methods = ["POST"])
@cross_origin()
def updateFavorites():
    data = request.get_json()
    email = data["email"]
    quotes = data["quotes"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'USER'
        if(mySession.query(Favorites.email).filter_by(email=email).first() is not None): #Check if the user has an entry in 'FAVORITES'
            mySession.query(Favorites).filter(Favorites.email == email).update({Favorites.quotes: quotes})
            mySession.commit()
            return jsonify("[/user-update-favorites] Successfully updated genres")
        else:
            return jsonify("[/user-update-favorites] Referencing email already has no entry in 'FAVORITES'"), 400
    else:
        return jsonify("[/user-update-favorites] No user with this email exists in the database"), 404

### SESSION FUNCTIONS #############################################################################
@app.route("/validate-user", methods = ["POST"])
@cross_origin()
def validateUser():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    Session = sessionmaker(bind = engine)
    mySession = Session()

    if(mySession.query(User.email).filter_by(email=email).first() is not None):
        if(mySession.query(User.email).filter_by(email=email).first() is not None):
            session["email"] = email
            return jsonify("[validate-user] Successfully logged in")
        else:
            return jsonify("[/validate-user] Password is incorrect"), 401
    else:
        return jsonify("[/validate-user] No user with this email exists"), 401

@app.route("/session-get-data", methods = ["GET"])
def getSessionData():
    if "email" in session:
        return session["email"]
    else:
        return jsonify("No email in session"), 404
    
### QUOTES FUNCTIONS ##############################################################################
@app.route("/user-quote/<email>", methods = ["GET"])
def getQuote(email):
    Session = sessionmaker(bind=engine)
    mySession = Session()

    userGenres = mySession.query(Genres).filter_by(email=email).first()
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
        