from flask import Flask
from config import Config
from app.database.db_mysql import init_db
from flask_sqlalchemy import SQLAlchemy
from app.endpoints import register_blueprints
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    init_db(app)

    jwt = JWTManager(app)

    CORS(app)

    register_blueprints(app)

    return app
