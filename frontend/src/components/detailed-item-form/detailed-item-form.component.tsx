import axios from "axios";

import { useEffect, useState } from "react";
import { useContext } from "react";

import { ItemsContext } from "@/context/items.context";

import styles from "./detailed-item-form.module.css";

const MACHINE_IP = "http://68.190.242.157:5000/";
// const MACHINE_IP = "http://127.0.0.1:5000/";

const DetailedItemForm = ({itemsID, itemData, setItemData}) => {
    const {items, setItems} = useContext(ItemsContext);

    const [length, setLength] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [location, setLocation] = useState();
    const [itemChange, setItemChange] = useState(false);

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
                <label>length (in.): </label>
                <input type="text" value={length} onChange={inputHandler} name="input_length"/>
            </div>

            <div className={styles.detailed_items__width}>
                <label>width (in.): </label>
                <input type="text" value={width} onChange={inputHandler} name="input_width"/>
            </div>

            <div className={styles.detailed_items__height}>
                <label>height (in.): </label>
                <input type="text" value={height} onChange={inputHandler} name="input_height"/>
            </div>

            <div className={styles.detailed_items__weight}>
                <label>weight (lb): </label>
                <input type="text" value={weight} onChange={inputHandler} name="input_weight"/>
            </div>

            <div className={styles.detailed_items__location}>
                <label>Location: </label>
                <input type="text" value={location} onChange={inputHandler} name="input_location"/>
            </div>

            { itemChange &&
                <input type="submit" className={styles.detailed_items__save_button} value="save data" onClick=  {handleFormSubmit} />
            }
        </form>
    )
}

export default DetailedItemForm;