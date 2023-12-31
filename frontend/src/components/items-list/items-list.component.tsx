'use client'
import dayjs from 'dayjs';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';

import Item from '../item/item.component';
import SearchBar from '../search-bar/search-bar.component';
import FilterSideBar from '../filter-sidebar/filter-sidebar.component';
import ItemsListSelectBox from '../items-list-select-box/items-list-select-box.component';
import BulkPrintButton from '../bulk-print-button/bulk-print-button.component';
import LabelQRCode from '../label-qr-code/label-qr-code.component';

import { MACHINE_IP } from '@/utils/machine-ip';

import styles from './items-list.module.css';

const ItemsList = ({status, sortKeyword}) => {
    const [items, setItems] = useState();

    const [filteredItems, setFilteredItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);

    const [searchBarInput, setSearchBarInput] = useState("");
    const [excludeBarInput, setExcludeBarInput] = useState("");
    const [locationBarInput, setLocationBarInput] = useState([]);
    const [ebayIDBarInput, setEbayIDBarInput] = useState("");
    const [isMobileFilterBar, setMobileFilterBar] = useState(false);

    const [ebayIndexesToPrint, setEbayIndexesToPrint] = useState([]);
    const [masterIndex, setMasterIndex] = useState(false);

    useEffect(() => {
        const ebayItemsEndPoints = {
            Active: "getAllActiveItems",
            Completed: "getAllSoldItems",
            Shipped: "getAllShippedItems",
            Deleted: "getAllDeletedItems"
        }
        
        axios.get(MACHINE_IP + ":5000" + "/api/" + ebayItemsEndPoints[status]).then((res) => {
            setItems(res.data["items"]);
        })
    }, []);

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

    useEffect(() => {
        // Filter items depending on search field(s).
        setTempItems(filteredItems.filter((item) => {
            const itemTitle = item["title"].toLowerCase();
            const itemLocation = item["location"];

            // Search bar filter.
            if (searchBarInput != "") {
                const searchBarKeywords = searchBarInput.split(" ");
                for (let i=0; i< searchBarKeywords.length; i++) {
                    if (!itemTitle.includes(searchBarKeywords[i])) {
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
            if (itemLocation == null && locationBarInput.includes("")) {
            }
            else if (locationBarInput.length > 0 && !locationBarInput.includes(itemLocation)) {
                return false;
            }

            // Ebay ID bar filter.
            if (ebayIDBarInput != "" && !item["id"].toString().includes(ebayIDBarInput)) {
                return false;
            }

            return true;
        }))
    }, [searchBarInput, excludeBarInput, locationBarInput, ebayIDBarInput]);

    useEffect(() => {
        // Sets all the checkboxes to false whenever tempItems is changed.
        setEbayIndexesToPrint(tempItems.map(() => { return false }))
        setMasterIndex(false);
    }, [tempItems])

    return (
        <div className={styles.items_list_container}>
            <FilterSideBar 
                excludeBarInput={excludeBarInput} 
                setExcludeBarInput={setExcludeBarInput} 
                locationBarInput={locationBarInput} 
                setLocationBarInput={setLocationBarInput} 
                isMobileFilterBar={isMobileFilterBar} 
                setMobileFilterBar={setMobileFilterBar} 
                ebayIDBarInput={ebayIDBarInput} 
                setEbayIDBarInput={setEbayIDBarInput}
            />

            <div className={styles.items_list_wrapper}>
                <div className={styles.items_search_container}>
                    <SearchBar 
                        searchbarInput={searchBarInput} 
                        setSearchBarInput={setSearchBarInput} 
                        isMobileFilterBar={isMobileFilterBar} 
                        setMobileFilterBar={setMobileFilterBar} 
                    />
                    <p>
                        {tempItems ? tempItems.length : 0} results...
                    </p>
                </div>

                <div className={styles.items_list}>
                    <div className={styles.item_container}>
                        <ItemsListSelectBox 
                            role="master" 
                            ebayIndexesToPrint={ebayIndexesToPrint} 
                            setEbayIndexesToPrint={setEbayIndexesToPrint}
                            masterIndex={masterIndex}
                            setMasterIndex={setMasterIndex}
                            index="N/A" />
                        <h1 className={styles.bulk_print_text}>Select All</h1>
                        <BulkPrintButton ebayIndexesToPrint={ebayIndexesToPrint} ebayItems={tempItems}/>
                    </div>
                    {tempItems ? tempItems.map((item, index) => {
                        return (
                            <div key={item["id"]} className={styles.item_container}>
                                <ItemsListSelectBox 
                                    role="basic" 
                                    ebayIndexesToPrint={ebayIndexesToPrint} 
                                    setEbayIndexesToPrint={setEbayIndexesToPrint}
                                    masterIndex={masterIndex}
                                    setMasterIndex={setMasterIndex}
                                    index={index} />

                                <Item item={item} />

                                {/* Invisible QR code is needed for printing qr codes with label. */}
                                {
                                    ebayIndexesToPrint[index] &&
                                    <div id={`labelQRCode_${index}`} style={{display: 'none'}}>
                                        <LabelQRCode itemID={item["id"]}/>
                                    </div>
                                }
                            </div>
                        )
                    }) :
                        <h1>Loading items...</h1>
                    }
                </div>
            </div>
        </div>
    )
}

export default ItemsList;