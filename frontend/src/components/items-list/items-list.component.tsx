'use client'
import dayjs from 'dayjs';
import { useEffect, useState, useContext } from 'react';

import { ItemsContext } from '@/context/items.context';

import Item from '../item/item.component';
import SearchBar from '../search-bar/search-bar.component';
import FilterSideBar from '../filter-sidebar/filter-sidebar.component';

import styles from './items-list.module.css';
import Link from 'next/link';


const ItemsList = ({status, sortKeyword}) => {
    const {items, setItems} = useContext(ItemsContext);
    const [filteredItems, setFilteredItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [searchBarInput, setSearchBarInput] = useState("");
    const [excludeBarInput, setExcludeBarInput] = useState("");
    const [locationBarInput, setLocationBarInput] = useState("");
    const [ebayIDBarInput, setEbayIDBarInput] = useState("");
    const [isMobileFilterBar, setMobileFilterBar] = useState(false);

    useEffect(() => {
        // Filters items into Active, Sold, Shipped.
        // Sorts filtered items by listed_date or date_sold.
        if (!items) return;
        
        let tmpItems = items.filter((item) => {return item["status"] == status});
        tmpItems.sort((a,b) => {
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
        setFilteredItems(tmpItems);
    }, [items]);

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

            // Location bar filter.
            if (locationBarInput == "n/a") {
                if (itemLocation != null) {
                    return false;
                }
            } else if (locationBarInput != "") {
                if (itemLocation == null) {
                    return false
                }

                if (locationBarInput.trim() != itemLocation.toLowerCase().trim()) {
                    return false
                }
            }

            if (ebayIDBarInput != "" && !item["id"].toString().includes(ebayIDBarInput)) {
                return false;
            }

            return true;

        }))
    }, [searchBarInput, excludeBarInput, locationBarInput, ebayIDBarInput]);

    return (
        <div className={styles.items_container}>
            <FilterSideBar excludeBarInput={excludeBarInput} setExcludeBarInput={setExcludeBarInput} locationBarInput={locationBarInput} setLocationBarInput={setLocationBarInput} isMobileFilterBar={isMobileFilterBar} setMobileFilterBar={setMobileFilterBar} ebayIDBarInput={ebayIDBarInput} setEbayIDBarInput={setEbayIDBarInput}/>

            <div className={styles.items_list_wrapper}>
                <div className={styles.items_search_container}>
                    <SearchBar searchbarInput={searchBarInput} setSearchBarInput={setSearchBarInput} isMobileFilterBar={isMobileFilterBar} setMobileFilterBar={setMobileFilterBar} />
                    <p>
                        {tempItems ? tempItems.length : 0} results...
                    </p>
                </div>

                <div className={styles.items_list}>
                    {tempItems ? tempItems.map((item) => {
                        return (
                            <Link key={item["id"]} href={`/pages/items/${item["id"]}`} target="_blank">
                                <Item item={item}/>
                            </Link>
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