# Anything that calls the ebay API will be held in this file.
# getAllEbayItemIDs() => list[int] => returns all user's ebay item ids.
# getEbayItem(id) => json => returns all data retaining an ebay item.
# areSoldItems(total_ebay_ids) => dict => returns key, value pair of ebay id, boolean if sold.
import requests
import json

from xmlToJson import xmlToJsonParser


# Load ebay API keys from SECRETS.json
with open("../SECRETS.json", "r") as f:
    cred = json.load(f)

EBAY_GET_ITEMS_ENDPOINT = "https://api.ebay.com/ws/api.dll"
EBAY_SHOPPING_GET_ITEMS_ENDPOINT = "https://open.api.ebay.com/shopping" 
headers = {
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-CALL-NAME": None,
        "X-EBAY-API-IAF-TOKEN": cred['userToken']
    }

def pretty_print_json(json_data):
    print(json.dumps(json_data, indent=5))


def getAllEbayItemIDs():
    # Calls ebay's tradional inventory api to get the user's items from inventory
    # Doesn't get all the item's info, so I am using this call just to gather all the item's ids.
    # Returns list[int] => item ids

    headers["X-EBAY-API-CALL-NAME"] = "GetMyeBaySelling"

    page = 1

    all_item_ids = []
    while True:
        print(f"Getting 100 items, page: {page}")
        body = f"""
            <?xml version="1.0" encoding="utf-8"?>
            <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
                <ErrorLanguage>en_US</ErrorLanguage>
                <WarningLevel>High</WarningLevel>
            <ActiveList>
                <Sort>TimeLeft</Sort>
                <Pagination>
                <EntriesPerPage>100</EntriesPerPage>
                <PageNumber>{page}</PageNumber>
                </Pagination>
            </ActiveList>
        </GetMyeBaySellingRequest>
        """
        response = requests.post(EBAY_GET_ITEMS_ENDPOINT, headers=headers, data=body)
        json_data = xmlToJsonParser(response.text)

        if "Errors" in json_data["GetMyeBaySellingResponse"].keys():
            return None
        
        numOfPages = int(json_data["GetMyeBaySellingResponse"]["ActiveList"]["PaginationResult"]["TotalNumberOfPages"])

        ebay_items = json_data["GetMyeBaySellingResponse"]["ActiveList"]["ItemArray"]["Item"]
        for item in ebay_items:
            item_id = item["ItemID"]
            all_item_ids.append(int(item_id))
        
        if page == numOfPages:
            break
        page+= 1


    return all_item_ids


def getEbayItem(id):
    # Gets ebay item data by calling getItem api
    # params: id => ebay item id number
    # Returns json of ebay item data
    headers["X-EBAY-API-CALL-NAME"] = "GetItem"

    body = f"""
    <?xml version="1.0" encoding="utf-8"?>
        <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
            <ErrorLanguage>en_US</ErrorLanguage>
            <WarningLevel>High</WarningLevel>
            <!--Enter an ItemID-->
        <ItemID>{id}</ItemID>
    </GetItemRequest>
    """

    response = requests.post(EBAY_GET_ITEMS_ENDPOINT, headers=headers, data=body)
    json_data = xmlToJsonParser(response.text)

    return json_data


def areSoldItems(total_ebay_ids):
    # Given the ebay item ids, return if the item has been sold/completed.
    # params: ebay_id => [int]
    # returns: dictionary with the key being the ids and values being booleans.
    results = {}

    # API request
    headers["X-EBAY-API-IAF-TOKEN"] = f"Bearer {cred['userToken']}"
    headers["X-EBAY-API-SITE-ID"] = "0"
    headers["X-EBAY-API-CALL-NAME"] = "GetItemStatus"
    headers["X-EBAY-API-VERSION"] = "863"
    headers["X-EBAY-API-REQUEST-ENCODING"] = "xml"

    quotient = len(total_ebay_ids) // 20
    remainder = len(total_ebay_ids) % 20
    print(f"Calling API {quotient+1} times to see which items need to be removed...")
    for i in range(quotient+1):
        ebay_ids = total_ebay_ids[i*20:(i+1)*20]  # Can only do API calls in batches of 20
        if i == quotient:
            ebay_ids = total_ebay_ids[i*20:]

        body = f"""<?xml version="1.0" encoding="utf-8"?>
        <GetItemStatusRequest xmlns="urn:ebay:apis:eBLBaseComponents">"""

        for ebay_id in ebay_ids:
            body+= f"<ItemID>{ebay_id}</ItemID>"

        body += "</GetItemStatusRequest>"

        response = requests.post(EBAY_SHOPPING_GET_ITEMS_ENDPOINT, data=body, headers=headers)
        json_data = xmlToJsonParser(response.text)["GetItemStatusResponse"]
        # Handling Errors
        RESPONSE_CODES = ["Success", "PartialFailure", "Failure"]
        SERVER_RESPONSE_CODE = json_data["Ack"]

        if SERVER_RESPONSE_CODE == RESPONSE_CODES[2]:
            print("Failed to retrieve any sold ebay items.")
            return None
        elif SERVER_RESPONSE_CODE == RESPONSE_CODES[1]:
            error_items = json_data["Errors"]["ErrorParameters"]["Value"].split(",")
            results["Failures"] = error_items
            print("Error when trying to find these ebay items:", error_items)

        ebay_items = json_data["Item"]
        if type(ebay_items) == dict:
            ebay_items = [ebay_items]

        # Key, Value: ebay id, boolean
        for ebay_item in ebay_items:
            item_id = ebay_item['ItemID']
            status = ebay_item['ListingStatus']

            results[item_id] = (status != "Active")

    return results

if __name__ == "__main__":
    # total = getAllEbayItemIDs()
    # print(f"List of all IDs: {total}, total: {len(total)}")
    # print(f"Set of all IDs: {set(total)}, total: {len(set(total))}")
    # print(areSoldItems([295673492242, 295760342089]))
    # pretty_print_json(getEbayItem(295673492242))
    # total = getAllEbayItemIDs()
    # pretty_print_json(total)
    pass
