import Image from "next/image";

import styles from "./filter-sidebar.module.css";

import closeButtonSVG from "../../../public/assets/svg/close_button.svg";

const FilterSideBar = ({excludeBarInput, setExcludeBarInput, locationBarInput, setLocationBarInput, isMobileFilterBar, setMobileFilterBar, ebayIDBarInput, setEbayIDBarInput}) => {

    const excludeBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const excludeBarText = event.target.value.toLowerCase();
            setExcludeBarInput(excludeBarText);
        }
    }

    const locationBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const locationBarText = event.target.value.toLowerCase();
            setLocationBarInput(locationBarText);
        }
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
                <input type="search" id="items_exclude_bar" name="items_exclude_bar" placeholder="Excluded words here..." onKeyDown={excludeBarEventHandler}/>
            </div>

            <div className={styles.filter__input_container}>
                <label htmlFor="location_search_bar">Location: </label>
                <input type="search" id="location_search_bar" name="location_search_bar" placeholder="Location here..." onKeyDown={locationBarEventHandler}/>
            </div>

            <div className={styles.filter__input_container}>
                <label htmlFor="ebay_id_search_bar">Ebay ID: </label>
                <input type="number" id="ebay_id_search_bar" name="ebay_id_search_bar" placeholder="Search by ebay ID..." onKeyDown={ebayIDBarEventHandler}/>
            </div>

        </div>
    )
}

export default FilterSideBar;