'use client'
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";

import { UserInfoInterface, UserAuthInterface } from "../interfaces";

import ImageGallery from "react-image-gallery";
import DetailedItemForm from "./detailed-item-form.component";
import PrintLabelButton from "./print-label-button.component";

import { MACHINE_IP } from "../../utils/machine-ip";

import ItemStatusUpdateButton from "./item-status-update-button.component";
import { Paper, Box, Typography, CircularProgress  } from "@mui/material";

import { getSidebarSettings } from "@/app/context/sidebar.context";

import { ItemInterface, SideBarContextInterface } from "../interfaces";


interface ItemImageInterface {
    original: string,
    thumbnail: string
}

const dateFormatter = (date:string) => {
    const date_string = dayjs(date).subtract(8, "hours").toString();
    let date_array = date_string.split(" ")
    let temp = date_array[1]
    date_array[1] = date_array[2]
    date_array[2] = temp + ","
    date_array.pop();

    const date_format = date_array.join(" ");
    return date_format;
}

const getLowerResEbayImage = (ebay_url:string) => {
    // Given original ebay image url, format it to request the smaller formatted ebay image.
    let ebay_url_pieces = ebay_url.split("/")
    let ebay_special_code = ebay_url_pieces[7]
    let res = `https://i.ebayimg.com/images/g/${ebay_special_code}/s-l100.jpg`
    return res;
}

const DetailedItemsChangeStatusButtons:React.FC<{
    itemData: ItemInterface
    setItemData: React.Dispatch<React.SetStateAction<ItemInterface | null>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}> = ({
    itemData, 
    setItemData, 
    setErrorMessage
}) => {
    return (
        <Box sx={{my: '1rem'}}>
            {
                itemData["status"] != "Active" && 
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
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

interface SidebarSettings {
    mobileView: boolean;
}

const DetailedItems:React.FC<{params:{itemsID:string}}> = ({params}) => {
    const [itemsID, setItemsID] = useState(params.itemsID);
    const [loading, setLoading] = useState(true);
    const [itemData, setItemData] = useState<ItemInterface | null>(null);
    const [itemImages, setItemImages] = useState<ItemImageInterface[]>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const userAuthContext:UserAuthInterface|null = useContext(UserAuthContext);
    const userInfo:UserInfoInterface|null|undefined = userAuthContext?.userInfo;

    const sideBarContextValue:SideBarContextInterface|null = getSidebarSettings();
    const mobileView = sideBarContextValue !== null ? sideBarContextValue.mobileView : true;
    // const {mobileView} = useContext(SidebarContext)!;

    // Calls backend API to retrieve Item information given the item id.
    useEffect(() => {
        setLoading(true);
        axios.get(MACHINE_IP + "/api/getItem/" + itemsID).then((res) => {
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

        if (itemData["image_urls"] instanceof Array) {
            setItemImages(itemData["image_urls"].map((imageURL:string) => {
                return {
                    original: imageURL,
                    thumbnail: getLowerResEbayImage(imageURL)
                }
            }))
        }

    }, [itemData])

    useEffect(() => {
        console.log("user info: ", userInfo?.role);
    }, [userAuthContext])

    return (
        <>
            { !userAuthContext?.userInfo?.role ? 
                <Typography>User is not signed in.</Typography> 
                    : 
                <Paper elevation={4} 
                    sx={{
                        display: 'flex', 
                        flexDirection: mobileView ? 'column' : undefined,
                        pb: '6rem'
                    }}
                >
                    {loading && <CircularProgress size={'5rem'}/>}
                    
                    {itemImages && 
                        <Box 
                            sx={{
                                width: mobileView ? '100%' :'50%', 
                                my: mobileView ? '-0.5rem' : '1rem',
                                ml: mobileView ? '' : '0.5rem'
                            }}>
                            <ImageGallery items={itemImages} />
                        </Box>
                    }

                    {itemData && 
                        <Box sx={{width: mobileView ? '100%' : '50%', px: '0.5rem', boxSizing: 'border-box'}}>
                            <DetailedItemsChangeStatusButtons 
                                itemData={itemData}
                                setItemData={setItemData}
                                setErrorMessage={setErrorMessage}
                            />                   

                            <Box>
                                <Typography><b>Title:</b> {itemData["title"]}</Typography>
                                <Typography><b>Status:</b> {itemData["status"]}</Typography>
                                <Typography><b>Price:</b> {itemData["price"]}</Typography>
                                <Typography><b>Listed Date:</b> {dateFormatter(itemData["listed_date"])}</Typography>
                                {
                                    itemData["status"] != "Active" &&
                                    <Typography><b>Date Sold:</b> {dateFormatter(itemData["last_checked_on_ebay_date"])}</Typography>
                                }
                                <Typography><b>SKU:</b> {itemData["sku"]}</Typography>
                                <Typography><b>Ebay ID:</b> {itemData["id"]}</Typography>
                                <Link href={itemData["ebay_url"]} target="_blank">Ebay item page</Link>
                            </Box>

                            <DetailedItemForm 
                                itemsID={itemsID} 
                                itemData={itemData} 
                                setItemData={setItemData} 
                                setErrorMessage={setErrorMessage} 
                            />

                            { errorMessage && <Typography>{errorMessage}</Typography> }

                            { !mobileView && <PrintLabelButton itemData={itemData} /> }
                            
                        </Box>
                    }

                    { (!itemData && !loading) && <h1>No item data exists for this ebay ID.</h1> }

                </Paper>
            }
        </>
    )
}

export default DetailedItems;