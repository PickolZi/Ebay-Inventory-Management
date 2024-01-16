

# [Itemiz](https://github.com/PickolZi/Ebay-Inventory-Management#ebay-inventory-management)
# Purpose
Do you have sell on ebay and have a massive inventory? If so then this web app is for you! Itemiz tracks your ebay inventory and automatically updates its database every hour while also checking for any sold or taken down items. Using our dashboard, you can view active, sold, and shipped items as well as edit their details to provide data about their measurements and location. 

Itemiz makes it easy for ebay sellers to track their inventory by allowing users to create infinite locations and tags to stick onto your items. Itemiz also comes with a search feature to search for specific items as well as a filter system to exclude certain keywords, search by ebay id, or most importantly, search by inventory locations.
# How to run
This application consists of a React frontend, Flask backend, as well as using Ebay's developer API. Therefore you will need to run both React and Flask environments as well as your secret keys for Flask and Ebay's API.

Below are the steps in order to successfully run this application

**Setting up secret keys and Ebay API**
1. First, head over to the [Ebay Developer Sign up](https://developer.ebay.com/signin?tab=register) and create an account.
2. Next, you will have to create a Production keyset and then sign-in to your main ebay account through OAuth to get your user **OAuth token**.
3. Lastly, after cloning the git repository, rename `SECRETS-sample.json` to `SECRETS.json`and fill in all keys.

**Setting up Server IP Address**
- Before you run the web app, you have to set the server ip of your machine (frontend and backend should be running on the same machine). Navigate to `\frontend\src\utils\machine-ip.js` and insert in your machine's ip address.
- `export  const  MACHINE_IP  =  "http://YOURMACHINEIPADDRESS";`

**Running Itemiz**
- Through the use of Docker, I was able to containerize the frontend and backend together to make the web application as easy as running the  `docker-compose up` command in the home directory.
