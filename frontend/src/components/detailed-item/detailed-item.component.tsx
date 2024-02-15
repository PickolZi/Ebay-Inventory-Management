'use client'
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import ImageGallery from "react-image-gallery";
import DetailedItemForm from "../detailed-item-form/detailed-item-form.component";
import PrintLabelButton from "../print-label-button/print-label-button.component";

import { MACHINE_IP } from "../../utils/machine-ip";
import styles from "./detailed-item.module.css"
import ItemStatusUpdateButton from "../item-status-update-button/item-status-update-button.component";


const dateFormatter = (date) => {
    const date_string = dayjs(date).subtract(8, "hours").toString();
    let date_array = date_string.split(" ")
    let temp = date_array[1]
    date_array[1] = date_array[2]
    date_array[2] = temp + ","
    date_array.pop();

    const date_format = date_array.join(" ");
    return date_format;
}

const getLowerResEbayImage = (ebay_url) => {
    // Given original ebay image url, format it to request the smaller formatted ebay image.
    let ebay_url_pieces = ebay_url.split("/")
    let ebay_special_code = ebay_url_pieces[7]
    let res = `https://i.ebayimg.com/images/g/${ebay_special_code}/s-l100.jpg`
    return res;
}

const DetailedItems = ({params}) => {
    const [itemsID, setItemsID] = useState(params.itemsID);
    const [itemData, setItemData] = useState();
    const [itemImages, setItemImages] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    // Calls backend API to retrieve Item information given the item id.
    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/getItem/" + itemsID).then((res) => {
            setItemData(res.data);
        })
    }, [itemsID]);

    // Sets all the item images.
    useEffect(() => {
        if (!itemData) return;
        setItemImages(itemData["image_urls"].map((imageURL) => {
            return {
                original: imageURL,
                thumbnail: getLowerResEbayImage(imageURL)
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
                    {
                        itemData["status"] != "Active" && 
                        <div className={styles.item_status_buttons}>
                            {
                                itemData["status"] != "Completed" &&
                                <ItemStatusUpdateButton 
                                    itemID={itemData["id"]} 
                                    itemData={itemData} 
                                    setItemData={setItemData}
                                    setErrorMessage={setErrorMessage} 
                                    status="Completed" 
                                    buttonText="Mark as Sold!"
                                    backgroundColor="#00d5ff"
                                    />
                            }
                            {
                                itemData["status"] != "Not Paid" &&
                                <ItemStatusUpdateButton 
                                    itemID={itemData["id"]} 
                                    itemData={itemData} 
                                    setItemData={setItemData}
                                    setErrorMessage={setErrorMessage} 
                                    status="Not Paid" 
                                    buttonText="Mark as Not Paid!"
                                    backgroundColor="#8800ff"
                                    />
                            }
                            {
                                itemData["status"] != "Found" &&
                                <ItemStatusUpdateButton 
                                    itemID={itemData["id"]} 
                                    itemData={itemData} 
                                    setItemData={setItemData}
                                    setErrorMessage={setErrorMessage} 
                                    status="Found" 
                                    buttonText="Mark as Found!"
                                    backgroundColor="#ff8800"
                                    />
                            }
                            {
                                itemData["status"] != "Shipped" &&
                                <ItemStatusUpdateButton 
                                    itemID={itemData["id"]} 
                                    itemData={itemData} 
                                    setItemData={setItemData}
                                    setErrorMessage={setErrorMessage} 
                                    status="Shipped" 
                                    buttonText="Mark as Shipped!"
                                    backgroundColor="#00ff5e"
                                    />
                            }
                            {
                                itemData["status"] != "Deleted" &&
                                <ItemStatusUpdateButton 
                                    itemID={itemData["id"]} 
                                    itemData={itemData} 
                                    setItemData={setItemData}
                                    setErrorMessage={setErrorMessage} 
                                    status="Deleted" 
                                    buttonText="Mark as Deleted!"
                                    backgroundColor="#ff4400"
                                    />
                            }
                            
                        </div>
                    }
                    

                    <div>
                        <h1 className={styles.detailed_items__title}>Title: {itemData["title"]}</h1>
                        <h2 className={styles.detailed_items__status}>Status: {itemData["status"]}</h2>
                        <h2 className={styles.detailed_items__price}>Price: {itemData["price"]}</h2>
                        <h2 className={styles.detailed_items__listed_date}>Listed Date: {dateFormatter(itemData["listed_date"])}</h2>
                        {
                            itemData["status"] != "Active" &&
                            <h2 className={styles.detailed_items__listed_date}>Date Sold: {dateFormatter(itemData["last_checked_on_ebay_date"])}</h2>
                        }
                        <h2 className={styles.detailed_items__sku}>SKU: {itemData["sku"]}</h2>
                        <h2 className={styles.detailed_items__id}>Ebay ID: {itemData["id"]}</h2>
                        <a href={itemData["ebay_url"]} className={styles.detailed_items__ebay_url} target="_blank">Ebay item page</a>
                    </div>

                    <DetailedItemForm 
                        itemsID={itemsID} 
                        itemData={itemData} 
                        setItemData={setItemData} 
                        setErrorMessage={setErrorMessage} />

                    { 
                        errorMessage && <p>{errorMessage}</p>
                    }

                    <PrintLabelButton itemData={itemData} />

                </div> :
                <h1>Item not available....</h1>
            }
        </div>
    )
}

export default DetailedItems;