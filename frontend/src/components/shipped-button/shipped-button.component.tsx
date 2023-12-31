import axios from "axios";

import { MACHINE_IP } from "@/utils/machine-ip";

import styles from "./shipped-button.module.css";

const ShippedButton = ({itemID, itemData, setItemData}) => {
    const handleShippedButton = () => {
        axios.post(MACHINE_IP + ":5000" + "/api/shipItem/" + itemID).then((res) => {
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