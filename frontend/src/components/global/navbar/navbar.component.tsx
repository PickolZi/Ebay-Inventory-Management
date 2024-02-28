'use client'
import Link from "next/link";

import { useEffect, useState } from "react";

import { BottomNavigation } from "@mui/material";
import { BottomNavigationAction } from "@mui/material";

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


const Navbar = () => {    
    const [pageNum, setPageNum] = useState(999)

    // Fixes bug where the bottom navbar icon would always reset to Active when the page is refreshed.
    useEffect(() => {
        let path = window.location.pathname;
        let pathRef = {
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

    return (
    <>
        <BottomNavigation 
            showLabels
            value={pageNum}
            onChange={(event, newValue) => {setPageNum(newValue)}}
            sx={{position: 'fixed', zIndex: 999, bottom: 0, width: "100%"}}
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
                icon={pageNum == 1 ? <PaidIcon /> : <PaidOutlinedIcon />}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/notpaid"
                label="Not Paid"
                 icon={<MoneyOffCsredOutlinedIcon />}
            />
            <BottomNavigationAction 
                component={Link}
                href="/pages/found"
                label="Found" 
                icon={pageNum == 3 ? <BackHandIcon /> : <BackHandOutlinedIcon />}
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