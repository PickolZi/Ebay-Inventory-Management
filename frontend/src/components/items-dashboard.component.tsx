'use client'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import FilterSideBar from './filter-sidebar.component';
import ItemsList from './items-list.component';

import { getSidebarSettings } from '@/app/context/sidebar.context';

import { MACHINE_IP } from '@/utils/machine-ip';


const ItemsDashboard = ({status, sortKeyword}) => {
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(-1);

    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const searchBarInput = useRef("");
    const excludeBarInput = useRef("");
    const ebayIDBarInput = useRef("");
    const [chosenLocations, setChosenLocations] = useState([]);

    const [ebayIndexesToPrint, setEbayIndexesToPrint] = useState([]);
    const [masterIndex, setMasterIndex] = useState(false);

    const { mobileView } = getSidebarSettings();

    // Gets item based on page status.
    useEffect(() => {
        fetchItemsFromDatabase();
    }, [pageNum, itemsPerPage, chosenLocations]);

    const fetchItemsFromDatabase = () => {
        const ebayStatusEndpoints = ["active", "completed", "notpaid", "found", "shipped", "deleted"]

        if (!ebayStatusEndpoints.includes(status.toLowerCase())) {
            return;
        }

        let config = {
            headers: {
                "Search-Include": searchBarInput.current.value,
                "Search-Exclude": excludeBarInput.current.value,
                "ebayID-Include": ebayIDBarInput.current.value,
                "Locations": chosenLocations
            }
        } 

        let itemsAndDataURL = `${MACHINE_IP}:5000/api/getItemsAndData/${status}/${pageNum}?per_page=${itemsPerPage}`
        axios.get(itemsAndDataURL, config).then((res) => {
            setItems(res.data["items"]);
            setTotalItems(res.data["total"]);
            setTotalPages(res.data["total_pages"])
        })
    }

    // Resets checkboxes 
    useEffect(() => {
        // Sets all the checkboxes to false whenever tempItems is changed.
        setEbayIndexesToPrint(items.map(() => { return false }))
        setMasterIndex(false);
    }, [items])
    
    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>  {/* Items-dashboard */}
            <FilterSideBar 
                excludeBarInput={excludeBarInput} 
                chosenLocations={chosenLocations} 
                setChosenLocations={setChosenLocations} 
                ebayIDBarInput={ebayIDBarInput} 
                handleSubmit={fetchItemsFromDatabase}
            />

            <ItemsList 
                items={items}
                totalItems={totalItems}
                searchBarInput={searchBarInput} 
                // setSearchBarInput={setSearchBarInput} 
                ebayIndexesToPrint={ebayIndexesToPrint} 
                setEbayIndexesToPrint={setEbayIndexesToPrint} 
                masterIndex={masterIndex} 
                setMasterIndex={setMasterIndex}
                handleSubmit={fetchItemsFromDatabase}
                pageNum={pageNum}
                setPageNum={setPageNum}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
            />
        </Box>
    );
}

export default ItemsDashboard;