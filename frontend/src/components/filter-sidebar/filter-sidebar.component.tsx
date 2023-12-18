
import styles from "./filter-sidebar.module.css";

const FilterSideBar = ({excludeBarInput, setExcludeBarInput, locationBarInput, setLocationBarInput, isMobileFilterBar}) => {

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

    return (
        <div className={`${styles.filter_container} ${isMobileFilterBar && styles.mobile_filter_container }`}>
            {/* <label htmlFor="items-exclude-bar">Exclude: </label> */}
            <input type="search" name="items-exclude-bar" placeholder="Excluded words here..." onKeyDown={excludeBarEventHandler}/>
            <input type="search" name="items-location-bar" placeholder="Location here..." onKeyDown={locationBarEventHandler}/>
        </div>
    )
}

export default FilterSideBar;