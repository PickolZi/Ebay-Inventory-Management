from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os, json
from flask_cors import CORS


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    with open("SECRETS.json", "r") as file:
        SECRETS = json.load(file)

    app.config["SECRET_KEY"] = SECRETS.get('FLASK_SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    return app
