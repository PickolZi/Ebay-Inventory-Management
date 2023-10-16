import requests
import json

EBAY_GET_ITEMS_ENDPOINT = "https://api.ebay.com/ws/api.dll"  # Returns in XML format because using old trading API.

# Load ebay API keys from SECRETS.json
with open("../SECRETS.json", "r") as f:
    cred = json.load(f)


headers = {
    "X-EBAY-API-SITEID": "0",
    "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
    "X-EBAY-API-CALL-NAME": "GetMyeBaySelling",
    "X-EBAY-API-IAF-TOKEN": cred['userToken']
}

body = """
    <?xml version="1.0" encoding="utf-8"?>
<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
	<ErrorLanguage>en_US</ErrorLanguage>
	<WarningLevel>High</WarningLevel>
  <ActiveList>
    <Sort>TimeLeft</Sort>
    <Pagination>
      <EntriesPerPage>3</EntriesPerPage>
      <PageNumber>1</PageNumber>
    </Pagination>
  </ActiveList>
</GetMyeBaySellingRequest>
"""

response = requests.post(EBAY_GET_ITEMS_ENDPOINT, headers=headers, data=body)
print(response.text)


if __name__ == "__main__":
    with open('sample-ebay-items.xml', 'w') as f:
        f.write(response.text)