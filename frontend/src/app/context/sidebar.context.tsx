'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

import React from 'react';

import { SideBarContextInterface } from "@/components/interfaces";


export const SidebarContext = createContext<SideBarContextInterface | null>(null);

export const SidebarProvider:React.FC<{children: React.ReactNode}> = ({children}) => {
    const mobileView = !useMediaQuery<boolean>('(min-width: 1024px)')
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        if (mobileView) {
            setIsSidebarOpen(false)
        } else {
            setIsSidebarOpen(true)
        }
    }, [mobileView])

    const toggleSidebar =() => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const value:SideBarContextInterface = {mobileView, isSidebarOpen, setIsSidebarOpen, toggleSidebar}

    return (
        <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
    )
}

export const getSidebarSettings = () =>{
    return useContext(SidebarContext);
}