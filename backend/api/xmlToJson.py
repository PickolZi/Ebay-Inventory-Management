import json
import xmltodict


def xmlToJsonParser(xml):
    # Given the xml data from calling the ebay api. Turn it into JSON format.
    json_data = xmltodict.parse(xml)

    return json_data
