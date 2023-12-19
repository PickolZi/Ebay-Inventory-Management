import axios from "axios";

import styles from "./shipped-button.module.css";
import { useState } from "react";

const ShippedButton = ({itemID, MACHINE_IP, itemData, setItemData}) => {
    const [shippedButtonHighlight, setShippedButtonHighlight] = useState(true);

    const handleShippedButton = () => {
        axios.get(MACHINE_IP + "/api/shipItem/" + itemID).then((res) => {
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
        <button className={`${styles.shipped_button} ${itemData["status"] == "Completed" && styles.show_button}`} onClick={handleShippedButton}>Mark as Shipped!</button>
    )
}

export default ShippedButton