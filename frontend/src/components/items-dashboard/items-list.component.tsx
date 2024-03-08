import { Box, Typography, TextField, Stack, Pagination } from '@mui/material';

import Item from './item.component';
import ItemsListSelectBox from './items-list-select-box/items-list-select-box.component';
import BulkPrintButton from './bulk-print-button.component';
import LabelQRCode from '../global/label-qr-code.component';

import { getSidebarSettings } from '@/app/context/sidebar.context';


const ItemsList = ({
    items,
    totalItems,
    searchBarInput, 
    ebayIndexesToPrint, 
    setEbayIndexesToPrint, 
    masterIndex, 
    setMasterIndex,
    handleSubmit,
    pageNum,
    setPageNum,
    itemsPerPage,
    setItemsPerPage,
    totalPages
}) => {
    const {mobileView} = getSidebarSettings();

    return (
        <Box 
            sx={{
                width: mobileView ? '100%' : 'calc(80% - 400px)',
                position: 'absolute',
                left: mobileView ? undefined : '400px',
                ml: mobileView ? undefined : '1rem',
                pb: '80px'
            }}
        >
            <TextField 
                inputRef={searchBarInput}
                onKeyDown={(event) => {event.key === 'Enter' && handleSubmit(event)}}
                variant="filled"
                color={items.length == 0 ? "warning" : "success"}
                autoComplete='off'
                fullWidth 
                label="Search by item title..."
                sx={{mt: mobileView ? undefined : '16px'}} 
            />
            <Typography sx={{textAlign: 'end'}}>{totalItems} items found...</Typography>

            <Box>
                {   
                    !mobileView &&
                    <Box sx={{display: 'flex', gap: '1rem', mb: '0.5rem'}}>
                        <ItemsListSelectBox 
                            role="master" 
                            ebayIndexesToPrint={ebayIndexesToPrint} 
                            setEbayIndexesToPrint={setEbayIndexesToPrint}
                            masterIndex={masterIndex}
                            setMasterIndex={setMasterIndex}
                            index="N/A" 
                        />
                        {/* <Typography>Select All</Typography> */}
                        <BulkPrintButton ebayIndexesToPrint={ebayIndexesToPrint} ebayItems={items} />
                    </Box>
                }
                <Box 
                    sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap:'0.25rem',
                    }}>
                    {items ? items.map((item, index) => {
                        return (
                            <Box key={item["id"]} sx={{display: 'flex', gap: '1rem'}}>
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

            <Stack spacing={2}>
                <Pagination 
                    count={totalPages}
                    color="primary"
                    onChange={(event, newPageNum) => {setPageNum(newPageNum)}}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: '16px'
                    }}
                />
            </Stack>

        </Box>
    )
}

export default ItemsList;