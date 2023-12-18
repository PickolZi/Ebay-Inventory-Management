
import styles from "./search-bar.module.css";

const SearchBar = ({searchBarInput, setSearchBarInput, isMobileFilterBar, setMobileFilterBar}) => {

    const mobileFilterBarHandler = () => {
        setMobileFilterBar(!isMobileFilterBar);
        console.log("mobile: " + isMobileFilterBar)
    }

    const searchBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const searchBarText = event.target.value.toLowerCase();
            setSearchBarInput(searchBarText);
        }
    }

    return (
        <div>
            <button onClick={mobileFilterBarHandler}>mobile</button>
            <input type="search" className={styles.items_search_bar} name="items-search-bar" placeholder="Search items by title..." onKeyDown={searchBarEventHandler}/>
        </div>
    )
}

export default SearchBar;