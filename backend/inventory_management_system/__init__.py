from flask import Flask, render_template
from .routes import main
import os, json


def create_app():
    app = Flask(__name__)

    # with open("SECRETS.json", "r") as file:
    #     SECRETS = json.load(file)

    # app.config["SECRET_KEY"] = SECRETS.get('FLASK_SECRET_KEY')
    app.config["SECRET_KEY"] = "7be1e1e0ae42c0e74724e2cf"


    app.register_blueprint(main)

    return app


from inventory_management_system import routes 