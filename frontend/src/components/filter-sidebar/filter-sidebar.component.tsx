
import styles from "./filter-sidebar.module.css";

const FilterSideBar = ({excludeBarInput, setExcludeBarInput, locationBarInput, setLocationBarInput}) => {

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
        <div className={styles.filter_container}>
            <input type="items-exclude-bar" name="items-exclude-bar" placeholder="Excluded words here..." onKeyDown={excludeBarEventHandler}/>
            <input type="items-location-bar" name="items-location-bar" placeholder="Location here..." onKeyDown={locationBarEventHandler}/>
        </div>
    )
}

export default FilterSideBar;