// When fetching data from our backend flask API, we have to specify the address each time and write duplicate code each time. 
// Until we have a domain for the api, we will have to hardcode our machine's address in here.

const machineIP = "http://192.168.0.108:5000";

const fetchFromFlaskAPIUsingGet = async (endPoint) => {
    // url: Flask API endpoint we're trying to get data from.
    return await fetch(machineIP + endPoint, {method: "GET"})
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        return res;
    })
};

export default fetchFromFlaskAPIUsingGet;