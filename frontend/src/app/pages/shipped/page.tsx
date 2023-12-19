import ItemsList from "@/components/items-list/items-list.component";

const Shipped = () => {
    return (
        <ItemsList status="Shipped" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default Shipped;