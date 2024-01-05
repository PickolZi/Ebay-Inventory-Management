from datetime import datetime

from sqlalchemy import select
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

@main.route("/api/getAllLocations")
def getAllLocations():
    # Returns all the different locations
    locations = db.session.query(Item.location).distinct().all()
    locations = [location[0] for location in locations]
    locations.remove(None)
    locations.sort()

    return jsonify({
        "locations": locations
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

@main.route("/api/getAllActiveItems")
def getAllActiveItemsAndData():
    # Returns the json of every single ACTIVE ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Active").all()
    output = []
    for item in items:
        image_urls = [image_url.image_url for image_url in item.image_url]
        image_urls = item.image_url[0].image_url if len(item.image_url) >= 1 else []
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
                'image_urls': image_urls,
            }
        )

    return jsonify({'items': output, 'total': len(output)})

@main.route("/api/getAllSoldItems")
def getAllSoldItemsAndData():
    # Returns the json of every single SOLD ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Completed").all()
    output = []
    for item in items:
        image_urls = [image_url.image_url for image_url in item.image_url]
        image_urls = item.image_url[0].image_url if len(item.image_url) >= 1 else []
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
                'image_urls': image_urls,
            }
        )

    return jsonify({'items': output, 'total': len(output)})

@main.route("/api/getAllShippedItems")
def getAllShippedItemsAndData():
    # Returns the json of every single SHIPPED ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Shipped").all()
    output = []
    for item in items:
        image_urls = [image_url.image_url for image_url in item.image_url]
        image_urls = item.image_url[0].image_url if len(item.image_url) >= 1 else []
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
                'image_urls': image_urls,
            }
        )

    return jsonify({'items': output, 'total': len(output)})

@main.route("/api/getAllDeletedItems")
def getAllDeletedItemsAndData():
    # Returns the json of every single Deleted ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Deleted").all()
    output = []
    for item in items:
        image_urls = [image_url.image_url for image_url in item.image_url]
        image_urls = item.image_url[0].image_url if len(item.image_url) >= 1 else []
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
    # The only info that SHOULD be updated are: location, last_updated_date, length, width, height, and weight.
    # id, title, price, status, listed_date, and ebay_url SHOULD NOT BE UPDATED THROUGH FLASK, SHOULD BE UPDATED FROM EBAY API.

    item = Item.query.get_or_404(id)

    post_data = request.json
    location = post_data['item__form-location-data']
    length = post_data['item__form-length-data']
    width = post_data['item__form-width-data']
    height = post_data['item__form-height-data']
    weight = post_data['item__form-weight-data']

    item.location = location 
    item.length = length if length != "" else 0
    item.width = width if width != "" else 0
    item.height = height if height != "" else 0
    item.weight = weight if weight != "" else 0
    item.last_updated_date = datetime.now()

    db.session.commit()

    if post_data:
        return "Itemiz) Status 200: Item updated into database."
    else:
        return "Itemiz) Status 300: Failed to update item into database. No post data given to API endpoint."
    # return redirect(url_for('main.item', id=id, message="Successfully edited item!"))

@main.route('/api/shipItem/<int:id>', methods=["POST"])
def shipItem(id):
    # Given ebay item id. If the item's status is a "Completed" or "sold" item. Change the status to shipped.
    # Else return a 404.

    item = Item.query.get_or_404(id)

    if item.status.lower() == "completed":
        item.status = "Shipped"
        db.session.commit()

        return f"Itemiz) Status 200: Item #{id}, Title: '{item.title}' status has been updated to Shipped"
    elif item.status.lower() == "shipped":
        return f"Itemiz ERROR) Status 300: Item #{id}, Title: '{item.title}' status is already marked as shipped"
    else:
        return f"Itemiz ERROR) Status 300: Item #{id}, Title: '{item.title}' status could not be updated likely due to item being still active or deleted."

@main.route('/api/deleteItem/<int:id>', methods=["POST"])
def deleteItem(id):
    # Given ebay item id. If the item's status is a "Completed" or "sold" item. Change the status to deleted.
    # Else return a 404.

    item = Item.query.get_or_404(id)

    if item.status.lower() == "completed":
        item.status = "Deleted"
        db.session.commit()

        return f"Itemiz) Status 200: Item #{id}, Title: '{item.title}' status has been updated to Deleted"
    elif item.status.lower() == "deleted":
        return f"Itemiz ERROR) Status 300: Item #{id}, Title: '{item.title}' status is already marked as deleted"
    else:
        return f"Itemiz ERROR) Status 300: Item #{id}, Title: '{item.title}' status could not be updated likely due to item being still active or shipped."