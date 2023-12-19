'use client'
import { createContext, useState, useEffect } from "react";
import axios from 'axios';


const MACHINE_IP = "http://68.190.242.157:5000/";

export const ItemsContext = createContext({
    items: [],
    setItems: () => {return null}
})

export const ItemsProvider = ({children}) => {
    const [items, setItems] = useState();
    const value = {items, setItems};

    const callBackendToSetItems = () => {
        axios.get(MACHINE_IP + "/api/getAllItems").then((res) => {
            setItems(res.data["items"]);
        })
    }

    useEffect(() => {
        callBackendToSetItems();
    }, []);

    return (
        <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
    )
}