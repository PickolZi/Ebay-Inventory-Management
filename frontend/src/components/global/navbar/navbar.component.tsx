'use client'
import Link from "next/link";
import axios from "axios";

import { MACHINE_IP } from "@/utils/machine-ip";

import { useEffect, useState } from "react";

import { BottomNavigation } from "@mui/material";
import { BottomNavigationAction } from "@mui/material";
import { Badge } from "@mui/material";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import MoneyOffCsredOutlinedIcon from '@mui/icons-material/MoneyOffCsredOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BackHandIcon from '@mui/icons-material/BackHand';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MapIcon from '@mui/icons-material/Map';


type PathRef = {
    [key:string]: number
}

type NumOfItems = {
    "Active"?: number,
    "Completed"?: number,
    "Not Paid"?: number,
    "Shipped"?: number
    "Deleted"?: number,
    "Found"?: number,
    "Map"?: number,    
}

const Navbar = () => {    
    const [pageNum, setPageNum] = useState<number>(999)
    const [numOfItemsPerStatus, setNumOfItemsPerStatus] = useState<NumOfItems | undefined>()

    // Fixes bug where the bottom navbar icon would always reset to Active when the page is refreshed.
    useEffect(() => {
        let path:string = window.location.pathname;
        let pathRef:PathRef = {
            "/pages/active": 0,
            "/pages/sold": 1,
            "/pages/notpaid": 2,
            "/pages/found": 3,
            "/pages/shipped": 4,
            "/pages/map": 5,
        }

        if (path in pathRef) {
            setPageNum(pathRef[path])
        } else {
            setPageNum(999)
        }

    },[])

    useEffect(() => {
        axios.get(MACHINE_IP + "/api/getNumberOfItemsPerStatus").then((data) => {
            setNumOfItemsPerStatus(data.data)
        }).catch((err) => {
            console.log("Error when catching number of objects per status window.")
        })
    }, [])

    return (
    <>
        <BottomNavigation 
            showLabels
            value={pageNum}
            onChange={(event, newValue) => {setPageNum(newValue)}}
            sx={{position: 'fixed', zIndex: 1999, bottom: 0, width: "100%"}}
        >
            <BottomNavigationAction 
                component={Link}
                href="/pages/active"
                label="Active" 
                icon={pageNum == 0 ? <HomeIcon /> : <HomeOutlinedIcon />}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/sold"
                label="Sold" 
                icon={<Badge color="primary" badgeContent={numOfItemsPerStatus ? numOfItemsPerStatus["Completed"] : 0}>{pageNum == 1 ? <PaidIcon /> : <PaidOutlinedIcon />}</Badge>}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/notpaid"
                label="Not Paid"
                 icon={<Badge color="primary" badgeContent={numOfItemsPerStatus ? numOfItemsPerStatus["Not Paid"] : 0}>{<MoneyOffCsredOutlinedIcon />}</Badge>}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/found"
                label="Found" 
                icon={<Badge color="primary" badgeContent={numOfItemsPerStatus ? numOfItemsPerStatus["Found"] : 0}>{pageNum == 3 ? <BackHandIcon /> : <BackHandOutlinedIcon />}</Badge>}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/shipped"
                label="Shipped" 
                icon={pageNum == 4 ? <LocalShippingIcon /> : <LocalShippingOutlinedIcon />}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/map"
                label="Map" 
                icon={pageNum == 5 ? <MapIcon /> : <MapOutlinedIcon />}
            />
        </BottomNavigation>
    </>
    )
}

export default Navbar;
