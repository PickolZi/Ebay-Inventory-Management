# Holds all of ebay api functionality
# getAllEbayItemIDs() => list[int] => returns all user's ebay item ids.
# getEbayItem(id) => json => returns all data retaining an ebay item.
import requests
import json

from xmlToJson import xmlToJsonParser


# Load ebay API keys from SECRETS.json
with open("../SECRETS.json", "r") as f:
    cred = json.load(f)

all_item_ids = []
EBAY_GET_ITEMS_ENDPOINT = "https://api.ebay.com/ws/api.dll"  # Returns in XML format because using old trading API.
headers = {
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-CALL-NAME": None,
        "X-EBAY-API-IAF-TOKEN": cred['userToken']
    }

def pretty_print_json(json_data):
    print(json.dumps(json_data, indent=1))


def getAllEbayItemIDs(page=1):
    # Calls ebay's tradional inventory api to get the user's items from inventory
    # Doesn't get all the item's info, so I am using this call just to gather all the item's ids.
    # Returns list[int] => item ids
    headers["X-EBAY-API-CALL-NAME"] = "GetMyeBaySelling"

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

    if page == 1:
        all_item_ids = []

    ebay_items = json_data["GetMyeBaySellingResponse"]["ActiveList"]["ItemArray"]["Item"]
    for item in ebay_items:
        item_id = item["ItemID"]
        all_item_ids.append(int(item_id))
        
    numOfPages = int(json_data["GetMyeBaySellingResponse"]["ActiveList"]["PaginationResult"]["TotalNumberOfPages"])
    if numOfPages > page:
        getAllEbayItemIDs(page=page+1)

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

if __name__ == "__main__":
    # print(getAllEbayItemIDs())
    pretty_print_json(getEbayItem(364532113079))
