import ItemsList from "@/components/items-list/items-list.component";


const NotPaid = () => {
    return (
        <ItemsList status="NotPaid" sortKeyword="last_checked_on_ebay_date"/>
    )
}

export default NotPaid;