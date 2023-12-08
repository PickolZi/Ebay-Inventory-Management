import ItemsList from "@/components/items-list/items-list.component";

const Shipped = () => {
    return (
        <div>
            <h1>Shipped page!</h1>
            <ItemsList status="Completed" sortKeyword="last_checked_on_ebay_date"/>
        </div>
    )
}

export default Shipped;