import axios from "axios";
import { useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";
import { MACHINE_IP } from "@/utils/machine-ip";

import { Button } from "@mui/material";


const ItemStatusUpdateButton = ({itemID, itemData, setItemData, setErrorMessage, status, buttonText, backgroundColor}) => {
    const { userJWTToken } = useContext(UserAuthContext);

    const handleItemStatusButton = () => {
        const data = {
            status,
            "JWT_TOKEN": userJWTToken
        }

        axios.post(MACHINE_IP + ":5000" + "/api/updateItemStatus/" + itemID, data).then((res) => {
            if (res.data.includes("Status 200")) {
                setItemData({...itemData, status})
            } 
        }).catch((err) => {
            setErrorMessage("Failed to update item status. Please sign in to an administrative user.")
        });
    }

    return (
        <Button variant="outlined" onClick={handleItemStatusButton} sx={{backgroundColor: backgroundColor, color: 'black'}}>
            {buttonText}
        </Button>
    )
}

export default ItemStatusUpdateButton;