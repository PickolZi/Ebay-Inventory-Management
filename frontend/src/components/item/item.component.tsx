import Link from 'next/link';

import styles from "./item.module.css";

import dayjs from "dayjs";

const dateFormatter = (date) => {
    const date_string = dayjs(date).subtract(8, "hours").toString();
    const date_array = date_string.split(" ")
    const date_format = date_array[2] + " " + date_array[1] + ", " + date_array[3]
    return date_format;
}

const getLowerResEbayImage = (ebay_url) => {
    // Given original ebay image url, format it to request the smaller formatted ebay image.
    let ebay_url_pieces = ebay_url.split("/")
    let ebay_special_code = ebay_url_pieces[7]
    let res = `https://i.ebayimg.com/images/g/${ebay_special_code}/s-l400.jpg`
    return res;
}

const Item = ({item}) => {
    return (
        <div className={styles.item}>
            <div className={styles.item__sub_container}>
                <img className={styles.item__img} src={getLowerResEbayImage(item["image_urls"])} alt={`${item["title"]} image`} />
                <div className={styles.items__text}>
                    <div className={styles.items__text_top}>
                        <Link 
                            href={`/pages/items/${item["id"]}`} 
                            target="_blank">
                            <p className={styles.item__title}>{item["title"]}</p>
                        </Link>
                        {/* <p className={styles.item__title}>{item["title"]}</p> */}
                        {/* <p className={styles.item__status}>Status: {item["status"]}</p> */}
                        <p className={styles.item__price}>${item["price"]}</p>
                    </div>

                    <div className={styles.items__text_bottom}>
                        <p className={styles.item__sku}>SKU: {item["sku"]}</p>
                        <p className={styles.item__listed_date}>Listed: {dateFormatter(item["listed_date"])}</p>
                        {item["status"] != "Active" &&  
                        <p className={styles.item__date_sold}>Sold: {dateFormatter(item["last_checked_on_ebay_date"])}</p>
                        }
                        <p className={styles.item__id}>Ebay ID: {item["id"]}</p>
                    </div>
                </div>
            </div>

            <div 
                className=
                    {`${styles.item__location_container} 
                      ${!item["location"] && styles.item__location_na}` 
                    }>
                <p className={styles.item__location}>
                    {item["location"] ? item["location"] : "N/A"}
                </p>
            </div>
        </div>
    )
}

export default Item;