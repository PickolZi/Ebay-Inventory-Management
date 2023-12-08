'use client'
import axios from "axios";
import { useState, useEffect } from "react";

import ImageGallery from "react-image-gallery"
import LabelButton from "../label-button/label-button.component";

import styles from "./detailed-item.module.css"

const MACHINE_IP = "http://68.190.242.157/";

const DetailedItems = ({params}) => {
    const [itemsID, setItemsID] = useState(params.itemsID);
    const [itemData, setItemData] = useState();
    const [itemImages, setItemImages] = useState();

    // Calls backend API to retrieve Item information given the item id.
    useEffect(() => {
        axios.get(MACHINE_IP + "/api/getItem/" + itemsID).then((res) => {  // For development on local machine.
        // axios.get("/api/getItem/" + itemsID).then((res) => {
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
    }, [itemData])

    return (
        <div className={styles.detailed_items}>
            {itemImages && 
                <div className={styles.detailed_items__img}>
                    <ImageGallery items={itemImages} />
                </div>
            }

            {itemData ? 
                <div className={styles.detailed_items__text_content}>
                    <div>
                        <h1 className={styles.detailed_items__title}>Title: {itemData["title"]}</h1>
                        <h2 className={styles.detailed_items__status}>Status: {itemData["status"]}</h2>
                        <h2 className={styles.detailed_items__price}>Price: {itemData["price"]}</h2>
                        <h2 className={styles.detailed_items__listed_date}>Listed Date: {itemData["listed_date"]}</h2>
                        <h2 className={styles.detailed_items__sku}>SKU: {itemData["sku"]}</h2>
                        <h2 className={styles.detailed_items__id}>Ebay ID: {itemData["id"]}</h2>
                    </div>

                    <form className={styles.detailed_items__form}>
                        <div className={styles.detailed_items__length}>
                            <label>length: {itemData["length"]}</label>
                            <input type="text" />
                        </div>

                        <div className={styles.detailed_items__width}>
                            <label>width: {itemData["width"]}</label>
                            <input type="text" />
                        </div>

                        <div className={styles.detailed_items__height}>
                            <label>height: {itemData["height"]}</label>
                            <input type="text" />
                        </div>

                        <div className={styles.detailed_items__weight}>
                            <label>weight: {itemData["weight"]}</label>
                            <input type="text" />
                        </div>

                        <div className={styles.detailed_items__location}>
                            <label>Location: {itemData["location"]}</label>
                            <input type="text" />
                        </div>


                        <button className={styles.detailed_items__save_button}>Save data</button>
                    </form>

                    <LabelButton itemData={itemData}/>
                </div> :
                <h1>Item not available....</h1>
            }

        </div>
    )
}

export default DetailedItems;