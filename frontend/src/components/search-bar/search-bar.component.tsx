
import "./search-bar.module.css";

const SearchBar = ({searchBarInput, setSearchBarInput}) => {

    const searchBarEventHandler = (event) => {
        if (event.key === "Enter") {
            const searchBarText = event.target.value.toLowerCase();
            setSearchBarInput(searchBarText);
        }
    }

    return (
        <input type="items-search-bar" name="items-search-bar" placeholder="Search here..." onKeyDown={searchBarEventHandler}/>
    )
}

export default SearchBar;