# File will be used for calling SQL statements from database.
import sqlite3
from datetime import datetime, timedelta
from ebay_script import DB_LOCATION


def getAllEbayItemIDsFromDatabase():
    # Connecting to database
    con = sqlite3.connect(DB_LOCATION)
    cur = con.cursor()

    cur.execute("""
        SELECT id
        FROM item
    """)
    res = cur.fetchall()
    res = [value[0] for value in res]

    con.close()
    return res

def getEbayItemIDsWhereDateIsBefore(date):
    con = sqlite3.connect(DB_LOCATION)
    cur = con.cursor()

    cur.execute(f"""
        SELECT id
        FROM item
        WHERE last_checked_on_ebay_date < "{date}" and status="Active"
    """)
    res = cur.fetchall()
    res = [value[0] for value in res]

    con.close()
    return res

if __name__ == "__main__":
    # print(getAllEbayItemIDsFromDatabase())
    # print(getEbayItemIDsWhereDateIsBefore(datetime.now()))
    # for res in getAllEbayItemIDsFromDatabase():
    #     print(res)
    pass