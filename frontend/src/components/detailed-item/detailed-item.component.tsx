'use client'
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import Link from "next/link";

import ImageGallery from "react-image-gallery";
import DetailedItemForm from "../detailed-item-form.component";
import PrintLabelButton from "../print-label-button/print-label-button.component";

import { MACHINE_IP } from "../../utils/machine-ip";
import styles from "./detailed-item.module.css"
import ItemStatusUpdateButton from "../item-status-update-button/item-status-update-button.component";
import { Box, Typography, CircularProgress  } from "@mui/material";

import { getSidebarSettings } from "@/app/context/sidebar.context";

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


const DetailedItemsChangeStatusButtons = ({itemData, setItemData, setErrorMessage}) => {
    return (
        <Box>
            {
                itemData["status"] != "Active" && 
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
                    
                </Box>
            }
        </Box>
    )
}

const DetailedItems = ({params}) => {
    const [itemsID, setItemsID] = useState(params.itemsID);
    const [loading, setLoading] = useState(true);
    const [itemData, setItemData] = useState();
    const [itemImages, setItemImages] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    const {mobileView} = getSidebarSettings();

    // Calls backend API to retrieve Item information given the item id.
    useEffect(() => {
        setLoading(true);
        axios.get(MACHINE_IP + ":5000" + "/api/getItem/" + itemsID).then((res) => {
            setItemData(res.data);
        }).catch((err) => {
            console.log("Error retrieving Item from database.", err)
            setItemData(null);
        }).finally(() => {
            setLoading(false);
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
        <Box sx={{display: 'flex', flexDirection: mobileView ? 'column' : undefined}}>
            {loading && <CircularProgress size={'5rem'}/>}
            
            {itemImages && 
                <Box sx={{width: mobileView ? '100%' :'50%'}}>
                    <ImageGallery items={itemImages} />
                </Box>
            }

            {itemData && 
                <Box sx={{width: mobileView ? '100%' : '50%', px: '1rem', boxSizing: 'border-box'}}>
                    <DetailedItemsChangeStatusButtons 
                        itemData={itemData}
                        setItemData={setItemData}
                        setErrorMessage={setErrorMessage}
                    />                   

                    <Box>
                        <Typography>Title: {itemData["title"]}</Typography>
                        <Typography>Status: {itemData["status"]}</Typography>
                        <Typography>Price: {itemData["price"]}</Typography>
                        <Typography>Listed Date: {dateFormatter(itemData["listed_date"])}</Typography>
                        {
                            itemData["status"] != "Active" &&
                            <Typography>Date Sold: {dateFormatter(itemData["last_checked_on_ebay_date"])}</Typography>
                        }
                        <Typography>SKU: {itemData["sku"]}</Typography>
                        <Typography>Ebay ID: {itemData["id"]}</Typography>
                        <Link href={itemData["ebay_url"]} target="_blank">Ebay item page</Link>
                    </Box>

                    <DetailedItemForm 
                        itemsID={itemsID} 
                        itemData={itemData} 
                        setItemData={setItemData} 
                        setErrorMessage={setErrorMessage} 
                    />

                    { errorMessage && <p>{errorMessage}</p> }

                    { !mobileView && <PrintLabelButton itemData={itemData} /> }
                    

                </Box>
            }

            { (!itemData && !loading) && <h1>no item data</h1> }

        </Box>
    )
}

export default DetailedItems;