import axios from 'axios';
import { useEffect, useState } from "react";
import { getSidebarSettings } from '@/app/context/sidebar.context';

import { 
    Box, 
    TextField, 
    Typography, 
    FormControl, 
    FormLabel, 
    FormGroup, 
    FormControlLabel, 
    Checkbox, 
    SwipeableDrawer,
} from "@mui/material";

import { MACHINE_IP } from "@/utils/machine-ip";


const FilterSideBar = ({
    excludeBarInput, 
    setExcludeBarInput, 
    chosenLocations, 
    setChosenLocations, 
    ebayIDBarInput, 
    setEbayIDBarInput
}) => {
    const {mobileView, isSidebarOpen, setIsSidebarOpen} = getSidebarSettings();
    const [locations, setLocations] = useState([])

    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/getAllLocations").then((res) => {
            setLocations(res.data["locations"]);
        })
    }, []);

    const locationHandler = (event, index) => {
        // If checkbox is checked, include location in chosenLocations[]
        // Else, remove location from chosenLocations[].
        let chosenLocation = locations[index];
        let checked = event.target.checked

        let tmpLocations = [...chosenLocations]
        if (checked && !tmpLocations.includes(chosenLocation)) {
            tmpLocations.push(chosenLocation)
        } else if (!checked && tmpLocations.includes(chosenLocation)) {
            tmpLocations.splice(tmpLocations.indexOf(chosenLocation), 1)
        } else {return}

        setChosenLocations(tmpLocations)
    }

    return (
        <SwipeableDrawer 
            onOpen={() => {setIsSidebarOpen(true)}}
            onClose={() => {setIsSidebarOpen(false)}}
            open={isSidebarOpen}
            variant={mobileView ? "temporary" : "permanent"}
            swipeAreaWidth={50}
        >
            <Box
                sx={{
                    display: 'flex', 
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    pt: mobileView ? '48px' : '56px',
                    px: '1rem',
                    height: '95vh',
                    width: mobileView ? '280px' : '400px',
                }}
            >
                <Typography mt='24px'>Filters:</Typography>
                <TextField
                    label="Exclude keywords"
                    size="small"
                    value={excludeBarInput}
                    sx={{mt:'8px'}}
                    onChange={(event) => setExcludeBarInput(event.target.value.toLowerCase())}
                />

                <TextField
                    label="Search by Ebay ID"
                    type="number"
                    size="small"
                    value={ebayIDBarInput}
                    sx={{mt:'8px'}}
                    onChange={(event) => setEbayIDBarInput(event.target.value)}
                />

                <Box mt='8px' width="100%" height="calc(100% - 164px)">  {/* 104px is the height of the text + 2 textfields above. */}
                    <FormControl sx={{width: '100%', height: '100%'}}>  
                        <FormLabel>Locations:</FormLabel>
                        <FormGroup
                            sx={{
                                height: '100%', 
                                overflow: 'hidden', 
                                overflowY: 'scroll', 
                                display: 'flex', 
                                flexFlow: 'column nowrap',
                                gap: 0,
                                
                            }}
                        >
                            {locations.map((location, index) => {
                                return (
                                    <FormControlLabel
                                        key={location}
                                        label={location != "" ? location : "N/A"}
                                        control={
                                            <Checkbox
                                                onChange={(event) => locationHandler(event, index)}
                                            />
                                        }
                                    />
                                )
                            })}
                        </FormGroup>
                    </FormControl>
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}

export default FilterSideBar;