'use client'
import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { MACHINE_IP } from "../utils/machine-ip";

export const ItemsContext = createContext({
    items: [],
    setItems: () => {return null}
})

export const ItemsProvider = ({children}) => {
    const [items, setItems] = useState();
    const value = {items, setItems};

    const callBackendToSetItems = () => {
        axios.get(MACHINE_IP + ":5000" + "/api/getAllItems").then((res) => {
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