import axios from "axios";

import styles from "./shipped-button.module.css";

const ShippedButton = ({itemID, MACHINE_IP, itemData, setItemData}) => {
    const handleShippedButton = () => {
        axios.post(MACHINE_IP + "/api/shipItem/" + itemID).then((res) => {
            console.log(res.data)
            if (res.data.includes("Status 200")) {
                setItemData({...itemData, status: "Shipped"})
                console.log("Successfully updated status to shipped")
            } else (
                console.log("Did not successfully update status to shipped.")
            )
        });
    }

    return (
        <button className={styles.shipped_button} onClick={handleShippedButton}>Mark as Shipped!</button>
    )
}

export default ShippedButton