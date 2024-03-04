import { Box, Typography } from '@mui/material';
import {TextField} from '@mui/material';

import Item from './item.component';
import ItemsListSelectBox from './items-list-select-box/items-list-select-box.component';
import BulkPrintButton from './bulk-print-button/bulk-print-button.component';
import LabelQRCode from './label-qr-code/label-qr-code.component';

import { getSidebarSettings } from '@/app/context/sidebar.context';


const ItemsList = ({
    items, 
    searchBarInput, 
    setSearchBarInput, 
    ebayIndexesToPrint, 
    setEbayIndexesToPrint, 
    masterIndex, 
    setMasterIndex
}) => {
    const {mobileView} = getSidebarSettings();

    return (
        <Box 
            sx={{
                width: mobileView ? '100%' : 'calc(80% - 400px)',
                position: 'absolute',
                left: mobileView ? undefined : '400px',
                ml: mobileView ? undefined : '1rem',
                pb: '64px'
            }}
        >
            <TextField 
                value={searchBarInput}
                onChange={(event) => {setSearchBarInput(event.target.value)}}
                variant="filled"
                color={items.length == 0 ? "warning" : "success"}
                autoComplete='off'
                fullWidth 
                label="Search by item title..."
                sx={{mt: mobileView ? undefined : '16px'}} 
            />
            <Typography sx={{textAlign: 'end'}}>{items.length} items found...</Typography>

            <Box>
                <Box sx={{display: 'flex', gap: '1rem'}}>
                    <ItemsListSelectBox 
                        role="master" 
                        ebayIndexesToPrint={ebayIndexesToPrint} 
                        setEbayIndexesToPrint={setEbayIndexesToPrint}
                        masterIndex={masterIndex}
                        setMasterIndex={setMasterIndex}
                        index="N/A" 
                    />
                    <Typography>Select All</Typography>
                    <BulkPrintButton ebayIndexesToPrint={ebayIndexesToPrint} ebayItems={items}/>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap:'8px'}}>
                    {items ? items.map((item, index) => {
                        return (
                            <Box key={item["id"]} sx={{display: 'flex'}}>
                                <ItemsListSelectBox 
                                    role="basic" 
                                    ebayIndexesToPrint={ebayIndexesToPrint} 
                                    setEbayIndexesToPrint={setEbayIndexesToPrint}
                                    masterIndex={masterIndex}
                                    setMasterIndex={setMasterIndex}
                                    index={index} 
                                />
                                <Item item={item} />

                                {/* Invisible QR code is needed for printing qr codes with label. */}
                                {
                                    ebayIndexesToPrint[index] &&
                                    <div id={`labelQRCode_${index}`} style={{display: 'none'}}>
                                        <LabelQRCode itemID={item["id"]}/>
                                    </div>
                                }
                            </Box>
                        )
                    }) :
                        <Typography>Loading items...</Typography>
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default ItemsList;