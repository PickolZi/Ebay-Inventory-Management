import React from "react";

import styles from "./items-list-selet-box.module.css"

const ItemsListSelectBox:React.FC<{
    role: string,
    ebayIndexesToPrint: boolean[],
    setEbayIndexesToPrint: React.Dispatch<React.SetStateAction<boolean[]>>,
    masterIndex: boolean,
    setMasterIndex: React.Dispatch<React.SetStateAction<boolean>>,
    index: number,
}> = ({
    role, 
    ebayIndexesToPrint, 
    setEbayIndexesToPrint, 
    masterIndex, 
    setMasterIndex, 
    index
}) => {

    const handleCheckBox = () => {
        let tmpIndexes = [...ebayIndexesToPrint];
        if (role == "master") {
            const masterBoolean = !masterIndex;
            setMasterIndex(masterBoolean);
            setEbayIndexesToPrint(ebayIndexesToPrint.map(() => {return masterBoolean}));
        } else {
            tmpIndexes[index] = !tmpIndexes[index];
            setEbayIndexesToPrint(tmpIndexes);

            if (tmpIndexes[index] == false) {
                setMasterIndex(false);
            }
        }
    }

    return (
        <div className={styles.items_list_check_box}>
            { role == "master" ? 
                <input 
                    type="checkbox" 
                    onChange={handleCheckBox} 
                    checked={masterIndex}
                /> 
                : 
                <input 
                    type="checkbox" 
                    onChange={handleCheckBox} 
                    checked={ebayIndexesToPrint[index]}
                /> 
            }
        </div>
    )
}

export default ItemsListSelectBox;