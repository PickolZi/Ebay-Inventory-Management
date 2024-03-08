import ItemsDashboard from "@/components/items-dashboard/items-dashboard.component";


const Sold = () => {
    return (
        <ItemsDashboard status="completed" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default Sold;