import Link from 'next/link';
import { getSidebarSettings } from '@/app/context/sidebar.context';
import { ItemInterface, SideBarContextInterface } from '../interfaces';

import { Box, Typography, Paper } from '@mui/material';

import dayjs from "dayjs";

const dateFormatter = (date:string):string => {
    const date_string = dayjs(date).subtract(8, "hours").toString();
    const date_array = date_string.split(" ")
    const date_format = date_array[2] + " " + date_array[1] + ", " + date_array[3]
    return date_format;
}

const getLowerResEbayImage = (ebay_url:string | string[]):string => {
    // Given original ebay image url, format it to request the smaller formatted ebay image.
    if (ebay_url instanceof Array) {
        ebay_url = ebay_url[0]
    }

    let ebay_url_pieces = ebay_url.split("/")
    let ebay_special_code = ebay_url_pieces[7]
    let res = `https://i.ebayimg.com/images/g/${ebay_special_code}/s-l400.jpg`
    return res;
}

const Item:React.FC<{
    item: ItemInterface
}> = ({item}) => {
    const sideBarContextValue:SideBarContextInterface|null = getSidebarSettings();
    const mobileView = sideBarContextValue !== null ? sideBarContextValue.mobileView : true;

    return (
        <Box sx={{width: '100%'}}>
            <Paper elevation={8} sx={{width: '100%', display: 'flex', position: 'relative'}}>
                <Box 
                    component="img" 
                    src={getLowerResEbayImage(item["image_urls"])} 
                    alt={`${item["title"]} image`}
                    sx={{
                        width: 200,
                        height: 200
                    }}
                >
                </Box>
                <Box sx={{width: '100%', p: '8px'}}>
                        <Link 
                            href={`/pages/items/${item["id"]}`} 
                            target="_blank"
                        >
                            <Typography style={{ lineHeight: "16px" }} sx={{wordWrap: 'wrap', wordBreak: 'break-word'}}>{item["title"]}</Typography>
                        </Link>
                        <Typography><b>ID:</b> {item["id"]}</Typography>
                        <Typography><b>Listed:</b> {dateFormatter(item["listed_date"])}</Typography>
                        {
                            item["status"] != "Active" &&  
                            <Typography><b>Sold:</b> {dateFormatter(item["last_checked_on_ebay_date"])}</Typography>
                        }
                        <Typography sx={{width: '100%', wordWrap: 'wrap', wordBreak: 'break-word'}}><b>SKU:</b> {item["sku"]}</Typography>
                        <Typography><b>Price: </b>${item["price"]}</Typography>
                </Box>
                <Box 
                    sx={{ 
                        position: 'absolute',  
                        right: mobileView ? 0 : '1rem',
                        bottom: mobileView ? 0 : undefined,
                        top: mobileView ? undefined : '50%',
                        translate: mobileView ? undefined : '0 -50%'
                    }}
                >
                    <Paper 
                        elevation={24} 
                        sx={{
                            backgroundColor: item["location"] ? "#828ce5" : "red", 
                            p: mobileView ? '8px' : '16px', 
                            m: '8px', 
                            border: '1px solid black'
                        }}
                    >
                        <Typography>{ item["location"] ? item["location"] : "N/A" }</Typography>
                    </Paper>
                </Box>
            </Paper>

        </Box>
    )
}

export default Item;