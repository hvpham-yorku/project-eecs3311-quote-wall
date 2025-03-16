import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column
from sqlalchemy import Integer, String
from dotenv import load_dotenv

load_dotenv()
DATABASE_URI = os.getenv("DATABASE_URI")

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class = Base)
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
db.init_app(app)

class User(db.Model):
    email = mapped_column(String, primary_key = True)

with app.app_context():
    db.create_all()