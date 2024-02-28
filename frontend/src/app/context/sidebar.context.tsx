'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

const SidebarContext = createContext(true);

export const SidebarProvider = ({children}) => {
    const mobileView = !useMediaQuery('(min-width: 1024px)')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

    const value = {mobileView, isSidebarOpen, setIsSidebarOpen, toggleSidebar}
    return (
        <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
    )
}

export const getSidebarSettings = () =>{
    return useContext(SidebarContext);
}