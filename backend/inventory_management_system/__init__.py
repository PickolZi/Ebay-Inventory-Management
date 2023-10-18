from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os, json


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # with open("SECRETS.json", "r") as file:
    #     SECRETS = json.load(file)

    # app.config["SECRET_KEY"] = SECRETS.get('FLASK_SECRET_KEY')
    app.config["SECRET_KEY"] = "7be1e1e0ae42c0e74724e2cf"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    return app
