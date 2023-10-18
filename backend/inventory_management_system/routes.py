from flask import Flask, render_template, request, Blueprint, request, redirect, url_for, jsonify
from .models import Item, Url
from . import db

main = Blueprint('main', __name__)

@main.route("/")
def index():
    return "Nyhallo world!"

@main.route("/api/getAllItems")
def getAllItems():
    # Returns the ids off all ebay items
    items = Item.query.all()
    return jsonify({'ids': [item.id for item in items]})

@main.route("/api/getItem/<int:id>")
def getItem(id):
    # Use id from API endpoint, to know which ebay item information to grab from the database
    # Returns all JSON item for given ebay item id.
    item = Item.query.get_or_404(id)
    image_urls = [image_url.image_url for image_url in item.image_url]

    return jsonify({
        'id': item.id,
        'title': item.title,
        'price': item.price,
        'status': item.status,
        'listed_date': item.listed_date,
        'ebay_url': item.ebay_url,
        'location': item.location,
        'last_updated_date': item.last_updated_date,
        'length': item.length,
        'width': item.width,
        'height': item.height,
        'weight': item.weight,
        'image_urls': image_urls,
    })

@main.route('/api/editItem/<int:id>')
def editItem(id):
    # TODO: Given the ebay item id as well as a JSON data payload through a POST method. Update the info in the database.
    # The only info that SHOULD be updated are: location, last_updated_date, length, width, height, and weight.
    # id, title, price, status, listed_date, and ebay_url SHOULD NOT BE UPDATED THROUGH FLASK, SHOULD BE PULLED FROM EBAY API.

    return f"editing item: {id}"