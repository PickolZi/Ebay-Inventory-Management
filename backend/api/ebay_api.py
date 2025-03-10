# Anything that calls the ebay API will be held in this file.
# getAllEbayItemIDs() => list[int] => returns all user's ebay item ids.
# getEbayItem(id) => json => returns all data retaining an ebay item.
# areSoldItems(total_ebay_ids) => dict => returns key, value pair of ebay id, boolean if sold.
# generateAccessToken() => String => returns access token. Called by every function that needs the access token.
# generateRefreshToken(user_code) => String => returns refresh token, given user_code from url from consent page.

import sys
import os
import base64
import json
import requests
from urllib.parse import unquote

from xmlToJson import xmlToJsonParser


ACCESS_TOKEN = ""
SECRET_FILEPATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "SECRETS.json")
)
# Load ebay API keys from SECRETS.json
with open(SECRET_FILEPATH, "r") as f:
    cred = json.load(f)


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

        numOfPages = int(
            json_data["GetMyeBaySellingResponse"]["ActiveList"]["PaginationResult"][
                "TotalNumberOfPages"
            ]
        )

        ebay_items = json_data["GetMyeBaySellingResponse"]["ActiveList"]["ItemArray"][
            "Item"
        ]
        for item in ebay_items:
            item_id = item["ItemID"]
            all_item_ids.append(int(item_id))

        if page == numOfPages:
            break
        page += 1

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
    headers["X-EBAY-API-CALL-NAME"] = "GetMyeBaySelling"
    entriesPerPage = 100
    body = f"""
        <?xml version="1.0" encoding="utf-8"?>
        <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
            <ErrorLanguage>en_US</ErrorLanguage>
            <WarningLevel>High</WarningLevel>
        <SoldList>
            <Pagination>
            <EntriesPerPage>{entriesPerPage}</EntriesPerPage>
            <PageNumber>1</PageNumber>
            </Pagination>
        </SoldList>
        </GetMyeBaySellingRequest>
    """
    response = requests.post(EBAY_GET_ITEMS_ENDPOINT, headers=headers, data=body)
    json_data = xmlToJsonParser(response.text)
    confirmed_sold_items = set()

    order_transactions = None
    try:
        order_transactions = json_data["GetMyeBaySellingResponse"]["SoldList"][
            "OrderTransactionArray"
        ]["OrderTransaction"]
    except:
        print("An error occured when trying to parse through recently sold.")

    try:
        for order in order_transactions:
            sold_item_id = order["Transaction"]["Item"]["ItemID"]
            confirmed_sold_items.add(int(sold_item_id))
    except:
        print(
            "A problem occured with trying to parse through one of the recently sold items."
        )

    print(f"Fetching past 100 sold items to see which ones are recently sold....")

    for ebay_id in total_ebay_ids:
        if ebay_id in confirmed_sold_items:
            results[ebay_id] = True
        else:
            results[ebay_id] = False

    print(confirmed_sold_items)
    print(results)

    return results


def generateAccessToken():
    # Using the refreshToken from environment variables. Generate a new access token before each use.
    authorization = cred["appid"] + ":" + cred["certid"]
    authorization_bytes = authorization.encode("ascii")
    base64_bytes = base64.b64encode(authorization_bytes)
    base64_string = base64_bytes.decode("ascii")

    EBAY_TOKEN_ENDPOINT = "https://api.ebay.com/identity/v1/oauth2/token"
    TOKEN_HEADERS = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + base64_string,
    }
    TOKEN_BODY = {
        "grant_type": "refresh_token",
        "refresh_token": cred["refreshToken"],
        "redirect_uri": cred["redirecturi"],
    }

    response = requests.post(
        EBAY_TOKEN_ENDPOINT, headers=TOKEN_HEADERS, data=TOKEN_BODY
    )

    if response.status_code == 200:
        print("Access token retrieved successfully...")
        return response.json()["access_token"]
    elif response.status_code == 400:
        print("Failed to retrieve Access Token.")
        return False
    else:
        print("Something went wrong when trying to retrieve access token.")
        print(reponse.json())
        return False


def generateRefreshToken(user_code):
    # Given user_code, decode the user_code provided from the User Consent Page and call ebay endpoint to generate a new refresh token.
    # Ideally this function should only be manually called once every 1.5 years because that's when the refresh token expires.

    """URL FOR USER CONSENT PAGE.
    https://auth.ebay.com/oauth2/authorize?client_id=JohSan-helloWor-PRD-1fcc2d46c-6fde8886&response_type=code&redirect_uri=Joh_San-JohSan-helloWor-irvlccp&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly
    """
    decoded_user_code = unquote(user_code)

    authorization = cred["appid"] + ":" + cred["certid"]
    authorization_bytes = authorization.encode("ascii")
    base64_bytes = base64.b64encode(authorization_bytes)
    base64_string = base64_bytes.decode("ascii")

    EBAY_TOKEN_ENDPOINT = "https://api.ebay.com/identity/v1/oauth2/token"
    TOKEN_HEADERS = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + base64_string,
    }
    TOKEN_BODY = {
        "grant_type": "authorization_code",
        "code": decoded_user_code,
        "redirect_uri": cred["redirecturi"],
    }

    response = requests.post(
        EBAY_TOKEN_ENDPOINT, headers=TOKEN_HEADERS, data=TOKEN_BODY
    )

    if response.status_code == 400:
        print("User code failed. Please try another user code.")
        return
    elif response.status_code == 200:
        print("Successfully generated User Refresh token.")
        refresh_token = response.json()["refresh_token"]
        print(f"refresh token: {refresh_token}")
    else:
        print("Something unexpected happen. Investigate further.")


ACCESS_TOKEN = generateAccessToken()

if not ACCESS_TOKEN:
    print("Terminating ebay api program....")
    sys.exit()

EBAY_GET_ITEMS_ENDPOINT = "https://api.ebay.com/ws/api.dll"
headers = {
    "X-EBAY-API-SITEID": "0",
    "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
    "X-EBAY-API-CALL-NAME": None,
    "X-EBAY-API-IAF-TOKEN": ACCESS_TOKEN,
}


if __name__ == "__main__":
    # total = getAllEbayItemIDs()
    # print(f"List of all IDs: {total}, total: {len(total)}")
    # print(f"Set of all IDs: {set(total)}, total: {len(set(total))}")
    # print(areSoldItems([297085378299, 296921764363]))
    # pretty_print_json(getEbayItem(295673492242))
    # total = getAllEbayItemIDs()
    # pretty_print_json(total)
    # generateValidEbayToken()
    # generateAccessToken()
    # generateRefreshToken(r"refresh_token")
    # print(cred)
    # print(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "SECRETS.json")))
    pass
