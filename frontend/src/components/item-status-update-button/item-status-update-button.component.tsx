import axios from "axios";

import { MACHINE_IP } from "@/utils/machine-ip";

import styles from "./item-status-update-button.module.css";

const ItemStatusUpdateButton = ({itemID, itemData, setItemData, status, buttonText, backgroundColor}) => {
    const handleItemStatusButton = () => {
        const data = {
            status
        }

        axios.post(MACHINE_IP + ":5000" + "/api/updateItemStatus/" + itemID, data).then((res) => {
            console.log(res.data)
            if (res.data.includes("Status 200")) {
                setItemData({...itemData, status})
                console.log("Successfully updated status to " + status)
            } else (
                console.log("Did not successfully update status to " + status)
            )
        });
    }

    return (
        <button 
            className={styles.deleted_button} 
            onClick={handleItemStatusButton} 
            style={{backgroundColor}}>
                {buttonText}
        </button>
    )
}

export default ItemStatusUpdateButton;