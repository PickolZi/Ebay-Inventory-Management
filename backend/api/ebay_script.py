# This script will be ran whenever we want to update the sqlite database with the ebay api data
import sqlite3
import os
from ebay_api import getAllEbayItemIDs, getEbayItem, areSoldItems, pretty_print_json
from datetime import datetime, timedelta

DB_LOCATION = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "instance/db.sqlite3"))

def updateDatabaseActiveAndSoldEbayItems():
    # Function ran every 30 minutes, getting newly listed/sold items from ebay and updating to database.
    # 1) Gets list of ebay ids from ebay api
    # 2) For each ebay id in list of ebay items, update last_checked_on_ebay_date. 
    # 3) Only call getEbayItem() for newly listed items not in database to get more info. Then add to database.
    # 4) For ebay items that weren't just updated, check if item has sold. If so, change status to Sold
   
    from db_commands import getAllEbayItemIDsFromDatabase
    # Step 1:
    ebay_ids_from_ebay = []
    ebay_ids_from_ebay = getAllEbayItemIDs()
    if not ebay_ids_from_ebay:
        print("Error has occured when getting ebay items from ebay api: check ebay user token and then try again.")
        return None
    

    # Connecting to database
    con = sqlite3.connect(DB_LOCATION)
    cur = con.cursor()

    # Step 2:
    ebay_ids_in_database = getAllEbayItemIDsFromDatabase()
    ebay_ids_not_in_database = []
    cur_time = datetime.now() - timedelta(minutes=2)
    for ebay_id in ebay_ids_from_ebay:
        if ebay_id in ebay_ids_in_database:
            con.execute(f"""
                UPDATE item 
                SET last_checked_on_ebay_date="{datetime.now()}"
                WHERE id = {ebay_id};
            """)
        else:
            ebay_ids_not_in_database.append(ebay_id)
    con.commit()

    # Step 3:
    for ebay_index, ebay_id in enumerate(ebay_ids_not_in_database):
        ebay_json_data = getEbayItem(ebay_id)

        id = ebay_id
        title = ebay_json_data["GetItemResponse"]["Item"]["Title"]
        price = ebay_json_data["GetItemResponse"]["Item"]["StartPrice"]["#text"]
        status = ebay_json_data["GetItemResponse"]["Item"]["SellingStatus"]["ListingStatus"]
        sku = ebay_json_data["GetItemResponse"]["Item"]["SKU"] if "SKU" in ebay_json_data["GetItemResponse"]["Item"] else ""
        listed_date = ebay_json_data["GetItemResponse"]["Item"]["ListingDetails"]["StartTime"]
        ebay_url = ebay_json_data["GetItemResponse"]["Item"]["ListingDetails"]["ViewItemURL"]
        ebay_image_urls = ebay_json_data["GetItemResponse"]["Item"]["PictureDetails"]["PictureURL"]
        if type(ebay_image_urls) == str:
            ebay_image_urls = [ebay_image_urls]

        # Adds item to database
        try:
            cur.execute(f"""
                INSERT INTO item 
                (id, title, price, status, sku, listed_date, ebay_url, last_updated_date, last_checked_on_ebay_date) VALUES 
                ({id}, "{title}", {price}, "{status}", "{sku}", "{listed_date}", "{ebay_url}", "{datetime.now()}", "{datetime.now()}")
            """)
            print(f"Item added... {id}: {ebay_index+1}/{len(ebay_ids_not_in_database)}")
        except sqlite3.IntegrityError:
            print(f"Item ID: {ebay_id} already in database... skipping")
            continue

        # Adds images to database
        for image_index, image_url in enumerate(ebay_image_urls):
            cur.execute(f"""
                INSERT INTO url 
                (image_url, item) VALUES 
                ("{image_url}", {id})
            """)
            print(f"Image added... {image_index+1}/{len(ebay_image_urls)}")
        

    con.commit()
    print(f"Finished committing {len(ebay_ids_not_in_database)} items to database...")
    
    # Step 4:
    try:
        from db_commands import getEbayItemIDsWhereDateIsBefore
        ebay_ids_to_check_if_sold = getEbayItemIDsWhereDateIsBefore(cur_time)
        sold_ebay_ids = areSoldItems(ebay_ids_to_check_if_sold)
        for ebay_id, isSold in sold_ebay_ids.items():
            if isSold:
                con.execute(f"""
                    UPDATE item 
                    SET status="Completed"
                    WHERE id = {ebay_id};
                """)
                print(f"Setting Ebay ID: {ebay_id} set to Completed...")
        con.commit()
    except:
        print("No items were sold....")

    con.close()  


if __name__ == "__main__":
    # Should still be executing when executed by cronjobs.
    updateDatabaseActiveAndSoldEbayItems()
