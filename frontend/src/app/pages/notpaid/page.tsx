import ItemsDashboard from "@/components/items-dashboard/items-dashboard.component";

const NotPaid = () => {
    return (
        <ItemsDashboard status="notpaid" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default NotPaid;