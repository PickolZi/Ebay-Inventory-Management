
# [Ebay-Inventory-Management](https://github.com/PickolZi/Ebay-Inventory-Management#ebay-inventory-management)
# Purpose
TODO
# How to run
This application consists of a React-native mobile frontend, Flask backend, as well as using Ebay's developer API. Therefore you will need to run both React-native and Flask environments as well as gather your secret keys for Flask and Ebay's API.

Below are the steps in order to successfully run this application

**Setting up secret keys and Ebay API**
1. First, head over to the [Ebay Developer Sign up](https://developer.ebay.com/signin?tab=register) and create an account.
2. Next, you will have to create a Production keyset and then sign-in to your main ebay account through OAuth to get your user **OAuth token**.
3. Lastly, after cloning the git repository, rename `SECRETS-sample.json` to `SECRETS.json`and fill in all keys.

**Setting up the Backend**
 1. You will need to download [Anaconda](https://www.anaconda.com/download/) or any other Python package manager in order to run the virtual environment.
 2. Create/Run the virtual environment /backend/

&nbsp;&nbsp;&nbsp;`conda create --name ebayInventorySystem python=3.11.4`

&nbsp;&nbsp;&nbsp;`pip install -r requirements.txt`

&nbsp;&nbsp;&nbsp;`conda activate ebayInventorySystem`

 4. Run the flask application by typing in  /backend/

&nbsp;&nbsp;&nbsp;`python run.py`

**Setting up the Frontend**
1. First you will need to install the react dependencies in /frontend/

&nbsp;&nbsp;&nbsp;`npm install`

3. Then hopefully temporarily, you have to set the API endpoint to your local machine, it should be your iPv4 address. Navigate to /frontend/src/fetch-from-flask-api.js and set 

&nbsp;&nbsp;&nbsp;`const machineIP = "YOUR IPV4 ADDRESS:5000";`

4. Lastly, you have to run the react-native application /frontend/

&nbsp;&nbsp;&nbsp;`npm start`

**Connecting to your mobile app**
1. First download [Expo Go](https://expo.dev/client) onto your mobile device
2. Make sure you're connected to the same network as the host of your frontend/backend application. Then use your phone's camera to scan the barcode on your react-native terminal. 

# Resources:
TODO
