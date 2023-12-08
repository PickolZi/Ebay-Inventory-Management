
import styles from "./item.module.css";

const Item = ({item}) => {
    return (
        <div className={styles.item}>
            <img className={styles.item__img} src={item["image_urls"][0]} alt={`${item["title"]} image`} />
            <div className="items__text">
                <p className={styles.item__title}>Title: {item["title"]}</p>
                <p className={styles.item__status}>Status: {item["status"]}</p>
                <p className={styles.item__price}>Price: {item["price"]}</p>
                <p className={styles.item__listed_date}>Listed Date: {item["listed_date"]}</p>
                {item["status"] == "Completed" &&  
                <p className={styles.item__date_sold}>Date sold: {item["last_checked_on_ebay_date"]}</p>
                }
                <p className={styles.item__location}>Location: {item["location"]}</p>
                <p className={styles.item__sku}>SKU: {item["sku"]}</p>
                <p className={styles.item__id}>Ebay ID: {item["id"]}</p>
            </div>
        </div>
    )
}

export default Item;