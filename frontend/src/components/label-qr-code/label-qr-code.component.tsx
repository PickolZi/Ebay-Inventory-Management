import QRCode from "react-qr-code";

const LabelQRCode = ({machineIP, itemID}) => {
    const websiteURL = `${machineIP}/pages/items/${itemID}`

    return (
        <QRCode value={websiteURL} style={{ height: "100px", width: "100px" }}/>
    )
}

export default LabelQRCode