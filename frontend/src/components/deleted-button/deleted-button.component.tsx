import axios from "axios";

import { MACHINE_IP } from "@/utils/machine-ip";

import styles from "./deleted-button.module.css";

const DeletedButton = ({itemID, itemData, setItemData}) => {
    const handleDeletedButton = () => {
        axios.post(MACHINE_IP + ":5000" + "/api/deleteItem/" + itemID).then((res) => {
            console.log(res.data)
            if (res.data.includes("Status 200")) {
                setItemData({...itemData, status: "Deleted"})
                console.log("Successfully updated status to deleted")
            } else (
                console.log("Did not successfully update status to deleted.")
            )
        });
    }

    return (
        <button className={styles.deleted_button} onClick={handleDeletedButton}>Mark as Deleted!</button>
    )
}

export default DeletedButton