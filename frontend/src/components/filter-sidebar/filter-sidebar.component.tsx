
import styles from "./filter-sidebar.module.css";

const FilterSideBar = ({excludeBarInput, setExcludeBarInput}) => {

    const excludeBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const excludeBarText = event.target.value.toLowerCase();
            setExcludeBarInput(excludeBarText);
        }
    }

    return (
        <div className={styles.filter_container}>
            <input type="items-exclude-bar" name="items-exclude-bar" placeholder="Excluded words here..." onKeyDown={excludeBarEventHandler}/>
        </div>
    )
}

export default FilterSideBar;