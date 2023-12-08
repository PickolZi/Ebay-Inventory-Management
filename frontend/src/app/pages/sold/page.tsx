import ItemsList from "@/components/items-list/items-list.component";


const Sold = () => {
    return (
        <ItemsList status="Completed" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default Sold;