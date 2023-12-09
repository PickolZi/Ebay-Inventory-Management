
import styles from "./label-button.module.css";

const LabelButton = ({itemData}) => {

    const handlePrint = () => {

    // const formattedTitle = breakTitle(title);
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${month}${day}23`;
    const title = itemData["title"]
    const stockNumber = "_____"
    const location = itemData["location"]
    const locationGap = "_____"
    const eBayItemNumber = itemData["id"]
    const length = itemData["length"] && itemData["length"] != "0" ? itemData["length"] : "___"
    const width = itemData["width"] && itemData["width"] != "0" ? itemData["width"] : "___"
    const height = itemData["height"] && itemData["height"] != "0" ? itemData["height"] : "___"
    const weight = itemData["weight"] && itemData["weight"] != "0" ? itemData["weight"] : "___"
    const listerInitial = itemData["sku"] ? itemData["sku"][1] : "___"
    const Counter = "___"

    const AllanFeature = `SKU${listerInitial}${formattedDate}${Counter}${stockNumber}`;


    const labelText = `${title}<br>${stockNumber} [${
      location || locationGap
    }] ${eBayItemNumber}<br>[${length} x ${width} x ${height}]<br>Weight (in Pounds): ${weight}<br>${AllanFeature}`;

    const printWindow = window.open("", "", "width=600,height=600");
    
    if (printWindow) {
      printWindow.document.open();

      printWindow.document.write(
        '<link rel="stylesheet" type="text/css" href="print.css">'
      );

      printWindow.document.write('<div class="label-container">');

      printWindow.document.write(`
        <style>
          .label-text {
            font-size: 2.3em; 
          }
        </style>
      `);

      printWindow.document.write(`
        <div class="label-preview"> 
          <div class="label-box"> 
            <div class="label-text" style="white-space: pre-line;">${labelText}</div>
          </div>
        </div>
      `);

      printWindow.document.write("</div>");
      printWindow.document.close();

      printWindow.print();
    }
    }

    return (
        <button className={styles.label_button} onClick={handlePrint}>Print Label</button>
    )
}

export default LabelButton;