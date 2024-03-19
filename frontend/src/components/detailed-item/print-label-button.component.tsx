import dayjs from "dayjs";

import LabelQRCode from "../global/label-qr-code.component";

import { Box, Button } from "@mui/material";

import { ItemInterface } from "../interfaces";


const PrintLabelButton:React.FC<{itemData: ItemInterface}> = ({itemData}) => {
    const handlePrint = () => {
        // Window Settings
        // const labelWidth = 567;
        // const labelHeight = 378;
        const labelWidth = 567*2;
        const labelHeight = 378*2;
        const left = (screen.width/2)-(labelWidth/2);
        const top = (screen.height/2)-(labelHeight/2);
        const labelDimension = `width=${labelWidth}, height=${labelHeight}, left=${left}, top=${top}`
        
        // Item info
        const date_string = dayjs().subtract(8, "hours");
        const day = date_string.date();
        const month = date_string.month()+1;
        const year = date_string.year();
        const title = itemData["title"]
        const stockNumber = "A_____"
        const location = itemData["location"] ? itemData["location"] : "___"
        const eBayItemNumber = itemData["id"]
        const length = itemData["length"] ? itemData["length"] : "___"
        const width = itemData["width"] ? itemData["width"] : "___"
        const height = itemData["height"] ? itemData["height"] : "___"
        const weight = itemData["weight"] ? itemData["weight"] : "___"
        const listerInitial = itemData["sku"] ? itemData["sku"][1] : "___"

        const allanSKU = `SKU[${listerInitial}][${month}/${day}/${year}][___][${stockNumber}]`
        
        let labelPrintingWindow = window.open("", "", labelDimension);
        if (labelPrintingWindow) {
            labelPrintingWindow.document.open()
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
                        ${document?.getElementById("labelQRCode")?.innerHTML}
                        ${document?.getElementById("labelQRCode")?.innerHTML}
                        ${document?.getElementById("labelQRCode")?.innerHTML}
                        ${document?.getElementById("labelQRCode")?.innerHTML}
                    </div>
                </div>
            `)
            labelPrintingWindow.document.close()

            labelPrintingWindow.print();
        }
    }


    return (
        <Box sx={{mt: '8px'}}>
            <Button variant="contained" onClick={handlePrint}>Print Label</Button>
            
            <Box id="labelQRCode" style={{display: 'none'}}>
                <LabelQRCode itemID={itemData["id"]} />
            </Box>
        </Box>
    )
}

export default PrintLabelButton;