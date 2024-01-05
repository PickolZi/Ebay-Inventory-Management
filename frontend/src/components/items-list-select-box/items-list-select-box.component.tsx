
import styles from "./items-list-selet-box.module.css"

const ItemsListSelectBox = ({role, ebayIndexesToPrint, setEbayIndexesToPrint, masterIndex, setMasterIndex, index}) => {

    const handleCheckBox = () => {
        let tmpIndexes = [...ebayIndexesToPrint];
        if (role == "master") {
            const masterBoolean = !masterIndex;
            setMasterIndex(masterBoolean);
            setEbayIndexesToPrint(ebayIndexesToPrint.map(() => {return masterBoolean }));

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
                <input type="checkbox" onChange={handleCheckBox} checked={masterIndex || false }/> 
                : 
                <input type="checkbox" onChange={handleCheckBox} checked={ebayIndexesToPrint[index] || false }/> 
            }
        </div>
    )
}

export default ItemsListSelectBox;