
import styles from "./bulk-print-button.module.css";

import dayjs from "dayjs";

const BulkPrintButton = ({ebayIndexesToPrint, ebayItems}) => {

    const generateLabelDataForIndividualEbayItem = (index, itemData, labelPrintingWindow) => {

        // Item info
        const date_string = dayjs().subtract(8, "hours");
        const day = date_string.date();
        const month = date_string.month()+1;
        const year = date_string.year();
        const title = itemData["title"]
        const stockNumber = "A_____"
        const location = itemData["location"] ? itemData["location"] : "___"
        const eBayItemNumber = itemData["id"]
        const length = itemData["length"] && itemData["length"] != "0" ? itemData["length"] : "___"
        const width = itemData["width"] && itemData["width"] != "0" ? itemData["width"] : "___"
        const height = itemData["height"] && itemData["height"] != "0" ? itemData["height"] : "___"
        const weight = itemData["weight"] && itemData["weight"] != "0" ? itemData["weight"] : "___"
        const listerInitial = itemData["sku"] ? itemData["sku"][1] : "___"

        const allanSKU = `SKU[${listerInitial}][${month}/${day}/${year}][___][${stockNumber}]`

        labelPrintingWindow.document.write(`
                <style>
                    .labelQRCode {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                </style>
            `)
            labelPrintingWindow.document.write(`
                <div>
                    <h1>${title}</h1>
                    <h1>${stockNumber} [${location}] #${eBayItemNumber}</h1>
                    <h1>[${length}x${width}x${height}] ${weight} LBS</h1>
                    <h1>${allanSKU}</h1>
                    <div class="labelQRCode">
                        ${document.getElementById("labelQRCode_"+index).innerHTML}
                        ${document.getElementById("labelQRCode_"+index).innerHTML}
                        ${document.getElementById("labelQRCode_"+index).innerHTML}
                        ${document.getElementById("labelQRCode_"+index).innerHTML}
                    </div>
                </div>
            `)

    }

    const handlePrint = () => {
        // Window Settings
        // const labelWidth = 567;
        // const labelHeight = 378;
        const labelWidth = 567*2;
        const labelHeight = 378*2;
        const left = (screen.width/2)-(labelWidth/2);
        const top = (screen.height/2)-(labelHeight/2);
        const labelDimension = `width=${labelWidth}, height=${labelHeight}, left=${left}, top=${top}`
                
        let labelPrintingWindow = window.open("", "", labelDimension);
        if (labelPrintingWindow) {
            labelPrintingWindow.document.open()

            ebayIndexesToPrint.map((ebayBoolean, index) => {
                if (ebayBoolean) {
                    generateLabelDataForIndividualEbayItem(index, ebayItems[index], labelPrintingWindow)
                }
            })

            labelPrintingWindow.document.close()
            labelPrintingWindow.print();
        }
    }

    return (
        <button className={styles.bulk_print_button} onClick={handlePrint}>Bulk Print Labels</button>
    )
}

export default BulkPrintButton;