import React from "react";
import QRCode from "react-qr-code";

import { MACHINE_IP } from "@/utils/machine-ip";

const LabelQRCode:React.FC<{itemID:number}> = ({itemID}) => {
    const websiteURL = `${MACHINE_IP}/pages/items/${itemID}`

    return (
        <QRCode value={websiteURL} style={{ height: "100px", width: "100px" }}/>
    )
}

export default LabelQRCode