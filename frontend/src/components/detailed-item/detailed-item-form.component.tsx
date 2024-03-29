import axios from "axios";

import { useEffect, useState, useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";

import { MACHINE_IP } from "@/utils/machine-ip";

import { Box, TextField, Button } from "@mui/material";

import { ItemInterface, UserAuthInterface } from "../interfaces";

const DetailedItemForm:React.FC<{
    itemsID: string
    itemData: ItemInterface
    setItemData: React.Dispatch<React.SetStateAction<ItemInterface | null>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}> = ({
    itemsID, 
    itemData, 
    setItemData, 
    setErrorMessage
}) => {
    const [length, setLength] = useState<number>();
    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [weight, setWeight] = useState<number>();
    const [location, setLocation] = useState<string>();
    const [itemChange, setItemChange] = useState<boolean>(false);

    const userAuthContext:UserAuthInterface|null = useContext(UserAuthContext);
    const userJWTToken = userAuthContext ? userAuthContext.userJWTToken : null; 

    useEffect(() => {
        setLength(itemData["length"]);
        setWidth(itemData["width"]);
        setHeight(itemData["height"]);
        setWeight(itemData["weight"]);
        setLocation(itemData["location"]);
    }, [itemData])

    const handleFormSubmit = (event:React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setItemChange(false);
        
        const body = {
            "item__form-location-data": location,
            "item__form-length-data": length,
            "item__form-width-data": width,
            "item__form-height-data": height,
            "item__form-weight-data": weight,
            "JWT_TOKEN": userJWTToken
        }

        const endpoint = MACHINE_IP + "/api/editItem/" + itemsID;
        axios.post(endpoint, body).then(() => {
            setItemData({
                ...itemData,   
                location: location,
                length: length,
                width: width,
                height: height,
                weight: weight
            });            
        }).catch((err) => {
            setErrorMessage("Failed to update item. Please sign in to an administrative user.");
            setItemChange(true);
        });
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '8px', mt:'16px'}}>
            <TextField 
                autoComplete="off" 
                label="length (in.)" 
                type="number" value={length} 
                onChange={(e) => {setItemChange(true); setLength(parseInt(e.target.value))}} 
            />
            <TextField 
                autoComplete="off" 
                label="width (in.)" 
                type="number" value={width} 
                onChange={(e) => {setItemChange(true); setWidth(parseInt(e.target.value))}} 
            />
            <TextField 
                autoComplete="off" 
                label="height (in.)" 
                type="number" value={height} 
                onChange={(e) => {setItemChange(true); setHeight(parseInt(e.target.value))}} 
            />
            <TextField 
                autoComplete="off" 
                label="weight (lb.)" 
                type="number" value={weight} 
                onChange={(e) => {setItemChange(true); setWeight(parseInt(e.target.value))}} 
            />
            <TextField 
                autoComplete="off" 
                label="location" 
                type="text" value={location} 
                onChange={(e) => {setItemChange(true); setLocation(e.target.value)}} 
            />

            { itemChange && <Button variant="contained" onClick={handleFormSubmit}>Save Changes</Button> }
        </Box>
    )
}

export default DetailedItemForm;