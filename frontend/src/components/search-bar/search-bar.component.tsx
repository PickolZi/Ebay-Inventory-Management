import Image from "next/image";

import styles from "./search-bar.module.css";

import filterBarSVG from "../../../public/assets/svg/filter.svg"

const SearchBar = ({searchBarInput, setSearchBarInput, isMobileFilterBar, setMobileFilterBar}) => {

    const mobileFilterBarHandler = () => {
        setMobileFilterBar(!isMobileFilterBar);
    }

    const searchBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const searchBarText = event.target.value.toLowerCase();
            setSearchBarInput(searchBarText);
        }
    }

    return (
        <div className={styles.search_bar_container}>
            
            <Image src={filterBarSVG} alt="filter bar when mobile view is active" className={styles.filter_icon} onClick={mobileFilterBarHandler} />

            <input type="search" className={styles.items_search_bar} name="items-search-bar" placeholder="Search items by title..." onKeyDown={searchBarEventHandler}/>
        </div>
    )
}

export default SearchBar;