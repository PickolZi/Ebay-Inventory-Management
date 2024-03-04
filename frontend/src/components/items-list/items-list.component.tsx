'use client'
import dayjs from 'dayjs';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';

import { Box, Typography } from '@mui/material';
import {TextField} from '@mui/material';

import Item from '../item/item.component';
import FilterSideBar from '../filter-sidebar/filter-sidebar.component';
import ItemsListSelectBox from '../items-list-select-box/items-list-select-box.component';
import BulkPrintButton from '../bulk-print-button/bulk-print-button.component';
import LabelQRCode from '../label-qr-code/label-qr-code.component';

import { getSidebarSettings } from '@/app/context/sidebar.context';

import { MACHINE_IP } from '@/utils/machine-ip';

import styles from './items-list.module.css';

const ItemsList = ({status, sortKeyword}) => {
    const [items, setItems] = useState();

    const [filteredItems, setFilteredItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);

    const [searchBarInput, setSearchBarInput] = useState("");
    const [excludeBarInput, setExcludeBarInput] = useState("");
    const [ebayIDBarInput, setEbayIDBarInput] = useState("");
    const [chosenLocations, setChosenLocations] = useState([]);

    const [ebayIndexesToPrint, setEbayIndexesToPrint] = useState([]);
    const [masterIndex, setMasterIndex] = useState(false);

    const { mobileView } = getSidebarSettings();

    // Gets item based on page status.
    useEffect(() => {
        const ebayItemsEndPoints = {
            Active: "getAllActiveItems",
            Completed: "getAllSoldItems",
            NotPaid: "getAllNotPaidItems",
            Found: "getAllFoundItems",
            Shipped: "getAllShippedItems",
            Deleted: "getAllDeletedItems"
        }
        
        axios.get(MACHINE_IP + ":5000" + "/api/" + ebayItemsEndPoints[status]).then((res) => {
            setItems(res.data["items"]);
        })
    }, []);

    // Sorts items by date.
    useEffect(() => {
        if (!items) return;

        // Sorts filtered items by listed_date or date_sold.
        items.sort((a,b) => {
            const dateAinSec = dayjs(a[sortKeyword]).unix();
            const dateBinSec = dayjs(b[sortKeyword]).unix();
            if (dateAinSec < dateBinSec) {
                return 1;
            } else if (dateAinSec > dateBinSec) {
                return -1;
            } else {
                return 0;
            }
        })
        setFilteredItems(items);
    },[items])

    useEffect(() => {
        setTempItems(filteredItems);
    },[filteredItems])

    // Filters item based on user input.
    useEffect(() => {
        // Filter items depending on search field(s).
        setTempItems(filteredItems.filter((item) => {
            const itemTitle = item["title"].toLowerCase();
            const itemLocation = item["location"];

            // Search bar filter.
            if (searchBarInput != "") {
                const searchBarKeywords = searchBarInput.split(" ");
                for (let i=0; i< searchBarKeywords.length; i++) {
                    if (!itemTitle.includes(searchBarKeywords[i].toLowerCase())) {
                        return false;
                    }
                }
            }

            // Exclude bar filter.
            if (excludeBarInput != "") {
                const excludeBarKeywords = excludeBarInput.split(" ");
                for (let i=0; i< excludeBarKeywords.length; i++) {
                    if (itemTitle.includes(excludeBarKeywords[i])) {
                        return false;
                    }
                }
            }

            // Location checkbox filter. 
            if (itemLocation == null && chosenLocations.includes("")) {
            }
            else if (chosenLocations.length > 0 && !chosenLocations.includes(itemLocation)) {
                return false;
            }

            // Ebay ID bar filter.
            if (ebayIDBarInput != "" && !item["id"].toString().includes(ebayIDBarInput)) {
                return false;
            }

            return true;
        }))
    }, [searchBarInput, excludeBarInput, chosenLocations, ebayIDBarInput]);

    // Resets checkboxes 
    useEffect(() => {
        // Sets all the checkboxes to false whenever tempItems is changed.
        setEbayIndexesToPrint(tempItems.map(() => { return false }))
        setMasterIndex(false);
    }, [tempItems])

    return (
        <Box sx={{width: '100%', display: 'flex', justifyContent:'center'}}>  {/* Items-dashboard */}
            <FilterSideBar 
                excludeBarInput={excludeBarInput} 
                setExcludeBarInput={setExcludeBarInput} 
                chosenLocations={chosenLocations} 
                setChosenLocations={setChosenLocations} 
                ebayIDBarInput={ebayIDBarInput} 
                setEbayIDBarInput={setEbayIDBarInput}
            />

            <Box width={mobileView ? "100%" : undefined}>  {/* Items-list-searchbar__container */}
                <TextField 
                    value={searchBarInput}
                    onChange={(event) => {setSearchBarInput(event.target.value)}}
                    variant="filled"
                    color={tempItems.length == 0 ? "warning" : "success"}
                    autoComplete='off'
                    fullWidth 
                    label="Search by item title..."
                    sx={{mt: mobileView ? undefined : '16px'}} 
                />
                <Typography sx={{textAlign: 'end'}}>{tempItems.length} items found...</Typography>

                <Box>  {/* Items-list__container */}
                    <Box sx={{display: 'flex', gap: '1rem'}}>
                        <ItemsListSelectBox 
                            role="master" 
                            ebayIndexesToPrint={ebayIndexesToPrint} 
                            setEbayIndexesToPrint={setEbayIndexesToPrint}
                            masterIndex={masterIndex}
                            setMasterIndex={setMasterIndex}
                            index="N/A" 
                        />
                        <Typography>Select All</Typography>
                        <BulkPrintButton ebayIndexesToPrint={ebayIndexesToPrint} ebayItems={tempItems}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap:'8px'}}>
                        {tempItems ? tempItems.map((item, index) => {
                            return (
                                <Box key={item["id"]} sx={{display: 'flex'}}>
                                    <ItemsListSelectBox 
                                        role="basic" 
                                        ebayIndexesToPrint={ebayIndexesToPrint} 
                                        setEbayIndexesToPrint={setEbayIndexesToPrint}
                                        masterIndex={masterIndex}
                                        setMasterIndex={setMasterIndex}
                                        index={index} 
                                    />
                                    <Item item={item} />

                                    {/* Invisible QR code is needed for printing qr codes with label. */}
                                    {
                                        ebayIndexesToPrint[index] &&
                                        <div id={`labelQRCode_${index}`} style={{display: 'none'}}>
                                            <LabelQRCode itemID={item["id"]}/>
                                        </div>
                                    }
                                </Box>
                            )
                        }) :
                            <Typography>Loading items...</Typography>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ItemsList;