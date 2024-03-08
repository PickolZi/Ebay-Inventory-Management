import ItemsDashboard from "@/components/items-dashboard/items-dashboard.component";


const Shipped = () => {
    return (
        <ItemsDashboard status="shipped" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default Shipped;