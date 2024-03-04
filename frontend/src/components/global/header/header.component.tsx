'use client'
import { useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";
import { getSidebarSettings } from "@/app/context/sidebar.context";

import { 
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton
} from "@mui/material";

import SignInOutButton from "./sign-in-out-button.component";
import Avatar from "./avatar.component";

import MenuIcon from '@mui/icons-material/Menu';


const Header = () => {    
    const { userAuth, userInfo } = useContext(UserAuthContext);
    const { mobileView, toggleSidebar } = getSidebarSettings();


    return (
        <AppBar 
            sx={{position: 'fixed', zIndex: 9999, width: '100%', top:0, left: 0}}
        >
            <Toolbar 
                disableGutters
                sx={{ display: 'flex', justifyContent: 'center'}}
            >
                <IconButton 
                    onClick={() => toggleSidebar()}
                    sx={{position: 'absolute', left: 0, display: mobileView ? undefined : 'none'}}
                >
                    <MenuIcon sx={{color: 'white'}} />
                </IconButton>

                <Typography
                    variant="h5"
                    component="a"
                    href="/"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                    }}
                >
                ITEMIZ
                </Typography>

                <Box sx={{position: 'absolute', right: '8px'}}>
                    {
                        userAuth ? 
                        <Avatar userInfo={userInfo} /> :
                        <SignInOutButton buttonType="signin"/>
                    }
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}

export default Header;