import Image from "next/image";
import axios from 'axios';
import { useEffect, useState } from "react";

import { MACHINE_IP } from "@/utils/machine-ip";

import styles from "./filter-sidebar.module.css";
import closeButtonSVG from "../../../public/assets/svg/close_button.svg";


const FilterSideBar = ({excludeBarInput, setExcludeBarInput, locationBarInput, setLocationBarInput, isMobileFilterBar, setMobileFilterBar, ebayIDBarInput, setEbayIDBarInput}) => {
    const [locations, setLocations] = useState([])
    const [locationBooleanValues, setLocationBooleanValues] = useState([]);

    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/getAllLocations").then((res) => {
            setLocations(res.data["locations"]);

            setLocationBooleanValues(res.data["locations"].map(() => {return false}))
        })
    }, []);

    const excludeBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const excludeBarText = event.target.value.toLowerCase();
            setExcludeBarInput(excludeBarText);
        }
    }

    const locationCheckBoxHandler = (event) => {
        const index = event.target.getAttribute("data-index")
        
        let tmpLocationBooleans = [...locationBooleanValues];
        tmpLocationBooleans[index] = !tmpLocationBooleans[index];
        setLocationBooleanValues(tmpLocationBooleans);

        let tmpLocationBarInput = [...locationBarInput];
        if (tmpLocationBooleans[index]) {
            tmpLocationBarInput.push(locations[index]);
        } else {
            tmpLocationBarInput.splice(tmpLocationBarInput.indexOf(locations[index]), 1);
        }
        setLocationBarInput(tmpLocationBarInput);
    }

    const ebayIDBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const ebayIDBarText = event.target.value.toLowerCase();
            setEbayIDBarInput(ebayIDBarText);
        }
    }

    const toggleMobileFilterBar = () => {
        setMobileFilterBar(!isMobileFilterBar);
    }

    return (
        <div className={`${styles.filter_container} ${isMobileFilterBar && styles.mobile_filter_container }`}>

            <Image src={closeButtonSVG} alt="close button" className={styles.close_button_svg} onClick={toggleMobileFilterBar}/>

            <h1 className={styles.filter__title}>Filters: </h1>

            <div className={styles.filter__input_container}>
                <label htmlFor="items_exclude_bar">Exclude: </label>
                <input 
                    type="search" 
                    id="items_exclude_bar" 
                    name="items_exclude_bar" 
                    placeholder="Excluded words here..." 
                    onKeyDown={excludeBarEventHandler}
                />
            </div>

            <div className={styles.filter__input_container}>
                <label htmlFor="ebay_id_search_bar">Ebay ID: </label>
                <input 
                    type="number" 
                    id="ebay_id_search_bar" 
                    name="ebay_id_search_bar" 
                    placeholder="Search by ebay ID..." 
                    onKeyDown={ebayIDBarEventHandler}
                />
            </div>

            <div className={`${styles.filter__input_container} ${styles.filter__location_container}`}>
                <h2>Locations:</h2>
                {locations.map((location, index) => {
                    return (
                        <div key={location} className={styles.filter__location_checkbox}>
                            <input 
                                onClick={locationCheckBoxHandler} 
                                id={`styles.location_${location}`} 
                                type="checkbox" 
                                data-index={index} 
                                value={locationBooleanValues[index]}
                                />
                            <label 
                                htmlFor={`styles.location_${location}`}
                                data-index={index} 
                                >
                                    {location != "" ? location : "N/A"}
                            </label>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default FilterSideBar;