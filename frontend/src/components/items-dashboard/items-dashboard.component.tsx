'use client'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { Box, Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import FilterSideBar from './filter-sidebar.component';
import ItemsList from './items-list.component';

import { MACHINE_IP } from '@/utils/machine-ip';

import { ItemInterface } from '../interfaces';


const ItemsDashboard:React.FC<{ status: string }> = ({status}) => {
    const [items, setItems] = useState<ItemInterface[]>([]);
    const [totalItems, setTotalItems] = useState<number>(-1);

    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(50);

    const searchBarInput = useRef<HTMLInputElement>();
    const excludeBarInput = useRef<HTMLInputElement>();
    const ebayIDBarInput = useRef<HTMLInputElement>();
    const [chosenLocations, setChosenLocations] = useState<string[]>([]);

    const [ebayIndexesToPrint, setEbayIndexesToPrint] = useState<boolean[]>([]);
    const [masterIndex, setMasterIndex] = useState<boolean>(false);

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
                "Search-Include": searchBarInput?.current?.value,
                "Search-Exclude": excludeBarInput?.current?.value,
                "ebayID-Include": ebayIDBarInput?.current?.value,
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
        // Sets all the checkboxes to false whenever search filters are updated.
        setEbayIndexesToPrint(items.map(() => { return false }))
        setMasterIndex(false);
    }, [items])
    
    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>
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

            <Fab color="primary"
                sx={{position: 'fixed', right: '2rem', bottom: 'calc(2rem + 56px)', zIndex: 9999}}
                onClick={() => {window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                  })}}
            >
                <ArrowUpwardIcon />
            </Fab>

        </Box>
    );
}

export default ItemsDashboard;