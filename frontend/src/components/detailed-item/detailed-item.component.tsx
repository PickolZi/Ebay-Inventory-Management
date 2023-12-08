'use client'
import axios from "axios";
import { useState, useEffect } from "react";

import ImageGallery from "react-image-gallery"
import LabelButton from "../label-button/label-button.component";

const MACHINE_IP = "http://68.190.242.157/";

const DetailedItems = ({params}) => {
    const [itemsID, setItemsID] = useState(params.itemsID);
    const [itemData, setItemData] = useState();
    const [itemImages, setItemImages] = useState();

    // Calls backend API to retrieve Item information given the item id.
    useEffect(() => {
        axios.get(MACHINE_IP + "/api/getItem/" + itemsID).then((res) => {
            setItemData(res.data);
        })
    }, [itemsID]);

    // Sets all the item images.
    useEffect(() => {
        if (!itemData) return;
        setItemImages(itemData["image_urls"].map((imageURL) => {
            return {
                original: imageURL,
                thumbnail: imageURL
            }
        }))

        console.log(itemData)
    }, [itemData])

    return (
        <div>
            {itemImages && 
                <ImageGallery items={itemImages} />
            }

            {itemData ? 
                <div className="detailed-items__text-content">
                    <h1>Title: {itemData["title"]}</h1>
                    <h2>Status: {itemData["status"]}</h2>
                    <h2>Price: {itemData["price"]}</h2>
                    <h2>Listed Date: {itemData["listed_date"]}</h2>
                    <h2>Location: {itemData["location"]}</h2>
                    <h2>SKU: {itemData["sku"]}</h2>
                    <h2>Ebay ID: {itemData["id"]}</h2>

                    <LabelButton itemData={itemData}/>
                </div> :
                <h1>Item not available....</h1>
            }

        </div>
    )
}

export default DetailedItems;