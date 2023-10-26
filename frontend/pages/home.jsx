import fetchFromFlaskAPIUsingGet from "../utils/fetch-from-flask-api";
import { useState, useEffect } from "react";

const Home = () => {
    const [ebayItems, setEbayItems] = useState({});

    useEffect(() => {
        const getEbayItems = async () => {
            const response = await fetchFromFlaskAPIUsingGet("/api/getAllItemsAndData");
            setEbayItems(response)
        }
        getEbayItems();
    },[]);

    return (
        <div className="ebay-items-list">
            {
                ebayItems.items && ebayItems.items.map((ebayItem) => {
                    console.log(ebayItem);
                    return (
                        <div className="ebay-item">
                            {/* Each ebay item and it's description will go in here. */}
                            {ebayItem.title}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Home;