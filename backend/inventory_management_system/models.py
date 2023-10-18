from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, Float
from . import db


class Item(db.Model):
    # All this data will be provided by the Ebay API.
    # And then all of this data will be displayed on the frontend.
    id = Column("id", Integer, primary_key=True)
    title = Column("title", Integer)
    price = Column("price", Float)
    status = Column("status", String)
    listed_date = Column("listed_date", db.DateTime)
    ebay_url = Column("ebay_url", String)

    # Will be given default values
    location = Column("location", String, default="")
    last_updated_date = Column("last_updated_date", db.DateTime, default=datetime.utcnow)
    length = Column("length", Float, default=0)
    width = Column("width", Float, default=0)
    height = Column("height", Float, default=0)
    weight = Column("weight", Float, default=0)
    
    # Column from Url table
    image_url = db.relationship("Url", backref="item")


    def __init__(self, id, title, price, status, listed_date, ebay_url):
        self.id = id
        self.title = title
        self.price = price
        self.status = status
        self.listed_date = listed_date
        self.ebay_url = ebay_url

    def __repr__(self):
        return f"{self.id}: {self.title} - {self.price}"

class Url(db.Model):
    # Holds a many to one relationship with the item. Many images will be linked to one item.
    id = Column("id", Integer, primary_key=True)
    image_url = Column("image_url", String)
    item_id = Column("item", Integer, db.ForeignKey('item.id'))


    def __repr__(self):
        return f"Url: {self.image_url}"

    