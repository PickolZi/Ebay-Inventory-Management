import ItemsDashboard from "@/components/items-dashboard.component";


const Shipped = () => {
    return (
        <ItemsDashboard status="Shipped" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default Shipped;