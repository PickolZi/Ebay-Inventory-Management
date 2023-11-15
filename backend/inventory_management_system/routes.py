from datetime import datetime

from flask_cors import cross_origin
from flask import Flask, render_template, request, Blueprint, request, redirect, url_for, jsonify
from .models import Item, Url
from . import db

main = Blueprint('main', __name__)

# Flask temporary frontend routes
@main.route("/")
def index():
    items = Item.query.all()

    return render_template('temp_home.html', items=items)

@main.route("/item/<int:id>")
def item(id):
    message = request.args.get('message')
    item = Item.query.get_or_404(id)

    return render_template('temp_item.html', item=item, message=message)


# Endpoints for React frontend
@main.route("/api/getAllItemIDs")
@cross_origin()
def getAllItems():
    # Returns the ids off all ebay items
    items = Item.query.all()
    return jsonify({
            'ids': [item.id for item in items], 
            'total': len(items)
        })

@main.route("/api/getAllItems")
def getAllItemsAndData():
    # Returns the json of every single ebay item from the database including all of its attributes.
    items = Item.query.all()
    output = []
    for item in items:
        image_urls = [image_url.image_url for image_url in item.image_url]
        output.append(
            {
                'id': item.id,
                'title': item.title,
                'price': item.price,
                'status': item.status,
                'sku': item.sku,
                'listed_date': item.listed_date,
                'ebay_url': item.ebay_url,
                'location': item.location,
                'last_updated_date': item.last_updated_date,
                'last_checked_on_ebay_date': item.last_checked_on_ebay_date,
                'length': item.length,
                'width': item.width,
                'height': item.height,
                'weight': item.weight,
                'image_urls': image_urls,
            }
        )

    return jsonify({'items': output, 'total': len(output)})


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
        'sku': item.sku,
        'listed_date': item.listed_date,
        'ebay_url': item.ebay_url,
        'location': item.location,
        'last_updated_date': item.last_updated_date,
        'last_checked_on_ebay_date': item.last_checked_on_ebay_date,
        'length': item.length,
        'width': item.width,
        'height': item.height,
        'weight': item.weight,
        'image_urls': image_urls,
    })

@main.route('/api/editItem/<int:id>', methods=["POST"])
def editItem(id):
    # TODO: Given the ebay item id as well as a JSON data payload through a POST method. Update the info in the database.
    # The only info that SHOULD be updated are: location, last_updated_date, length, width, height, and weight.
    # id, title, price, status, listed_date, and ebay_url SHOULD NOT BE UPDATED THROUGH FLASK, SHOULD BE UPDATED FROM EBAY API.

    item = Item.query.get_or_404(id)

    # API POST DATA built temporarily for flask. Will need to change to take in JSON for react frontend.
    location = request.form.get('item__form-location-data', "")
    length = request.form.get('item__form-length-data', "")
    width = request.form.get('item__form-width-data', "")
    height = request.form.get('item__form-height-data', "")
    weight = request.form.get('item__form-weight-data', "")

    item.location = location
    item.length = length
    item.width = width
    item.height = height
    item.weight = weight
    item.last_updated_date = datetime.utcnow()

    db.session.commit()

    return redirect(url_for('main.item', id=id, message="Successfully edited item!"))