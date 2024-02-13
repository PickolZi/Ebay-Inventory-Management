import os
from datetime import datetime

from sqlalchemy import select
from flask_cors import cross_origin
from flask import Flask, render_template, request, Blueprint, request, redirect, url_for, jsonify
from .models import Item, Url, Users
from . import db

import firebase_admin
from firebase_admin import auth, credentials


# Had to move outside of endpoint because a new firebase app kept being created..
dir_path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
cred = credentials.Certificate(dir_path + "/firebase_secret.json")
default_app = firebase_admin.initialize_app(cred)
auth = firebase_admin.auth

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

@main.route("/api/getAllNotPaidItems")
def getAllNotPaidItemsAndData():
    # Returns the json of every single SOLD BUT NOT PAID ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Not Paid").all()
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

@main.route("/api/getAllFoundItems")
def getAllFoundItemsAndData():
    # Returns the json of every single SOLD AND FOUND ebay item from the database including all of its attributes.
    items = Item.query.filter(Item.status == "Found").all()
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
    JWT_TOKEN = post_data['JWT_TOKEN']
    print(JWT_TOKEN)

    try:
        decoded_token = auth.verify_id_token(JWT_TOKEN)
        uid = decoded_token['uid']

    except (firebase_admin.auth.InvalidIdTokenError, ValueError):
        return "Bad JWT Token!", 400

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

@main.route('/api/updateItemStatus/<int:id>', methods=["POST"])
def updateItemStatus(id):
    # Given ebay item id and status to change the ebay item to. Update ebay item status.
    # Ebay items with status "active" can not be changed. Only one of the possible ebay statuses below can be changed to the other.
    # Else return a 404.

    new_item_status = request.json["status"]

    possible_statuses = ["completed", "not paid", "found", "shipped", "deleted"]
    # Completed means sold.

    item = Item.query.get_or_404(id)

    if item.status.lower() == "active":
        return f"Itemiz ERROR) Status 300: Item #{id}, Title: '{item.title}' status is marked as active and therefore status can not be changed unless item is removed or sold from the ebay platform. You can not forcefully take down this item otherwise."  
    elif item.status.lower() in possible_statuses and new_item_status.lower() in possible_statuses:
        item.status = new_item_status
        db.session.commit()
        return f"Itemiz) Status 200: Item #{id}, Title: '{item.title}' status has been updated to {new_item_status}"
    else:
        return f"Itemiz ERROR) Status 300: Unexpected error. Item #{id}, Title: '{item.title}' status could not be updated. No json post data sent or the status the item is trying to be updated to does not exist."


# Endpoints for firebase to add new users to the database.
@main.route("/api/firebase/addUser", methods=["POST"])
def firebaseAddUser():
    users = list(db.session.execute(db.select(Users)).scalars())
    users_uids = [user.uid for user in users]

    JWT_TOKEN = ""

    if "JWT_TOKEN" in request.json:
        JWT_TOKEN = request.json["JWT_TOKEN"]
    
    try:
        decoded_token = auth.verify_id_token(JWT_TOKEN)
        uid = decoded_token['uid']
        email = decoded_token['email']
    except firebase_admin.auth.InvalidIdTokenError:
        return "Bad JWT Token!", 400

    if uid in users_uids:
        return "User is already in database!", 400

    db.session.add(Users(uid=uid, email=email, role="user"))
    db.session.commit()
    print(list(users))
    print(f"UID: {uid}, email: {email}")
    return "Adding user", 200

