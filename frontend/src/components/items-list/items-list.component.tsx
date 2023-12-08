'use client'
import dayjs from 'dayjs';
import { useEffect, useState, useContext } from 'react';

import { ItemsContext } from '@/context/items.context';

import Item from '../item/item.component';
import SearchBar from '../search-bar/search-bar.component';

import styles from './items-list.module.css';
import Link from 'next/link';


const ItemsList = ({status, sortKeyword}) => {
    const {items, setItems} = useContext(ItemsContext);
    const [filteredItems, setFilteredItems] = useState([]);
    const [tempItems, setTempItems] = useState();
    const [searchBarInput, setSearchBarInput] = useState();

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
        // Filter items depending on search field.
        if (searchBarInput == "") {
            setTempItems(filteredItems);
        } else {
            setTempItems(filteredItems.filter((item) => {
                const itemTitle = item["title"].toLowerCase();
                const searchBarKeyWords = searchBarInput.split(" ");
                for (let i=0; i<searchBarKeyWords.length; i++) {
                    if (!itemTitle.includes(searchBarKeyWords[i])) {
                        return false;
                    }
                }
                return true;
            }))
        }
    }, [searchBarInput]);

    return (
        <div className="items-list">
            <SearchBar searchbarInput={searchBarInput} setSearchBarInput={setSearchBarInput}/>
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
    )
}

export default ItemsList;