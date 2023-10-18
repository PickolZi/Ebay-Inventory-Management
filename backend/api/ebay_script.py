# This script will be ran whenever we want to update the sqlite database with the ebay api data
import sqlite3
from ebay_api import getAllEbayItemIDs, getEbayItem, pretty_print_json
from datetime import datetime


def firstTimeRunFillDatabase():
    # PLEASE ONLY RUN WHEN DATABASE IS EMPTY AND WANTING TO FILL DATABASE WITH EACH AND EVERY ITEM FROM EBAY API.
    # 1) Gets all ebay ids
    # 2) Loops through each id and calls ebay id to get json data for each item.
    # 3) Each iteration will grab only the data I need and then update the database.
   
    ebay_ids = getAllEbayItemIDs()
    if not ebay_ids:
        print("Error has occured: check ebay user token and then try again.")
        return None

    # Connecting to database
    con = sqlite3.connect("../instance/db.sqlite3")
    cur = con.cursor()

    for ebay_index, ebay_id in enumerate(ebay_ids):
        ebay_json_data = getEbayItem(ebay_id)

        id = ebay_id
        title = ebay_json_data["GetItemResponse"]["Item"]["Title"]
        price = ebay_json_data["GetItemResponse"]["Item"]["StartPrice"]["#text"]
        status = ebay_json_data["GetItemResponse"]["Item"]["SellingStatus"]["ListingStatus"]
        listed_date = ebay_json_data["GetItemResponse"]["Item"]["ListingDetails"]["StartTime"]
        ebay_url = ebay_json_data["GetItemResponse"]["Item"]["ListingDetails"]["ViewItemURL"]
        ebay_image_urls = ebay_json_data["GetItemResponse"]["Item"]["PictureDetails"]["PictureURL"]
        if type(ebay_image_urls) == str:
            ebay_image_urls = [ebay_image_urls]

        # Adds item to database
        cur.execute(f"""
            INSERT INTO item 
            (id, title, price, status, listed_date, ebay_url, last_updated_date) VALUES 
            ({id}, "{title}", {price}, "{status}", "{listed_date}", "{ebay_url}", "{datetime.now()}")
        """)
        print(f"Item added... {ebay_index+1}/{len(ebay_ids)}")

        # Adds images to database
        for image_index, image_url in enumerate(ebay_image_urls):
            cur.execute(f"""
                INSERT INTO url 
                (image_url, item) VALUES 
                ("{image_url}", {id})
            """)
            print(f"Image added... {image_index+1}/{len(ebay_image_urls)}")
        

    con.commit()
    print(f"Finished committing {len(ebay_ids)} items to database...")
    
    con.close()  



def updateDatabase(ebayItemID, data):
    # TODO: Given ebay item id and json data from ebay api, update the item's data in the database
    # The only data that SHOULD be updated could be title, desc, price, and status.
    # All other data for each item in the database should only be edited by the react front-end or through the SQL command line.
    pass

if __name__ == "__main__":
    firstTimeRunFillDatabase()