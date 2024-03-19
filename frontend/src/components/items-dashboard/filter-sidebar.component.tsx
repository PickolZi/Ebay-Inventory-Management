import axios from 'axios';
import React, { useEffect, useState } from "react";
import { getSidebarSettings } from '@/app/context/sidebar.context';
import { SideBarContextInterface } from '../interfaces';

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


const FilterSideBar:React.FC<{
    excludeBarInput: React.MutableRefObject<HTMLInputElement | undefined>, 
    chosenLocations: string[],
    setChosenLocations: React.Dispatch<React.SetStateAction<string[]>>,
    ebayIDBarInput: React.MutableRefObject<HTMLInputElement | undefined>,
    handleSubmit: () => void,
}> = ({
    excludeBarInput,  
    chosenLocations, 
    setChosenLocations, 
    ebayIDBarInput, 
    handleSubmit
}) => {
    const sideBarContextValue:SideBarContextInterface|null = getSidebarSettings();
    const mobileView = sideBarContextValue !== null ? sideBarContextValue.mobileView : true;
    const isSidebarOpen = sideBarContextValue !== null ? sideBarContextValue.isSidebarOpen : true;
    const setIsSidebarOpen = sideBarContextValue !== null ? sideBarContextValue.setIsSidebarOpen : () => {};

    const [locations, setLocations] = useState<string[]>([])

    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/getAllLocations").then((res) => {
            setLocations(res.data["locations"]);
        })
    }, []);

    const locationHandler = (event:React.ChangeEvent<HTMLInputElement>, index:number) => {
        // If checkbox is checked, include location in chosenLocations[]
        // Else, remove location from chosenLocations[].
        let chosenLocation:string = locations[index];
        let checked = event.target.checked

        if (chosenLocation == "") {
            chosenLocation = "N/A";
        }

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
                    sx={{mt:'8px'}}
                    inputRef={excludeBarInput}
                    onKeyDown={(event) => {event.key === 'Enter' && handleSubmit()}}
                />

                <TextField
                    label="Search by Ebay ID"
                    type="number"
                    size="small"
                    sx={{mt:'8px'}}
                    onKeyDown={(event) => {event.key === 'Enter' && handleSubmit()}}
                    inputRef={ebayIDBarInput}
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