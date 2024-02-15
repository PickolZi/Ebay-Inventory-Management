import axios from "axios";

import { useEffect, useState, useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";

import { MACHINE_IP } from "@/utils/machine-ip";

import styles from "./detailed-item-form.module.css";

const DetailedItemForm = ({itemsID, itemData, setItemData, setErrorMessage}) => {
    const [length, setLength] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [location, setLocation] = useState();
    const [itemChange, setItemChange] = useState(false);

    const { userJWTToken } = useContext(UserAuthContext);

    useEffect(() => {
        setLength(itemData["length"]);
        setWidth(itemData["width"]);
        setHeight(itemData["height"]);
        setWeight(itemData["weight"]);
        setLocation(itemData["location"]);
    }, [itemData])

    const handleFormSubmit = (event) => {
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

        const endpoint = MACHINE_IP + ":5000" + "/api/editItem/" + itemsID;
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
            setErrorMessage("Failed to update item. Please sign in to an administrative user.")
        });
    }

    const inputHandler = (event) => {       
        const inputName = event.target.name;
        const inputText = event.target.value;

        setItemChange(true);

        if (inputName == "input_length") {
            setLength(inputText);
        } else if (inputName == "input_width") {
            setWidth(inputText);
        } else if (inputName == "input_height") {
            setHeight(inputText);
        } else if (inputName == "input_weight") {
            setWeight(inputText);
        } else if (inputName == "input_location") {
            setLocation(inputText);
        } 
    }

    return (
        <form className={styles.detailed_items__form}>
            <div className={styles.detailed_items__length}>
                <label htmlFor="input_length">Length (in.): </label>
                <input id="input_length" type="text" value={length} onChange={inputHandler} name="input_length"/>
            </div>

            <div className={styles.detailed_items__width}>
                <label htmlFor="input_width">Width (in.): </label>
                <input id="input_width" type="text" value={width} onChange={inputHandler} name="input_width"/>
            </div>

            <div className={styles.detailed_items__height}>
                <label htmlFor="input_height">Height (in.): </label>
                <input id="input_height" type="text" value={height} onChange={inputHandler} name="input_height"/>
            </div>

            <div className={styles.detailed_items__weight}>
                <label htmlFor="input_weight">Weight (lb): </label>
                <input id="input_weight" type="text" value={weight} onChange={inputHandler} name="input_weight"/>
            </div>

            <div className={styles.detailed_items__location}>
                <label htmlFor="input_location">Location: </label>
                <input id="input_location" type="text" value={location} onChange={inputHandler} name="input_location"/>
            </div>

            { itemChange &&
                <input type="submit" className={styles.detailed_items__save_button} value="Save Changes" onClick=  {handleFormSubmit} />
            }
        </form>
    )
}

export default DetailedItemForm;