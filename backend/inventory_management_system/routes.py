from flask import Flask, render_template, request, Blueprint, request, redirect, url_for

main = Blueprint('main', __name__)

@main.route("/")
def index():
    return "Nyhallo world!"

@main.route("/api/getAllItems")
def getAllItems():
    return {"id": [154423432,432565,4365,6376,4354234,124235,4324]}

@main.route("/api/getItem/<int:SKU>")
def getItem(SKU):
    # Use SKU from API endpoint, to know which ebay item information to grab from the database
    # Code to grab ebay item from sku through sqlite database.
    return f'Your item is: {SKU}'