'use client'
import { useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";
import { getSidebarSettings } from "@/app/context/sidebar.context";

import { 
    Typography,
    AppBar,
    Toolbar,
    IconButton
} from "@mui/material";

import UserAuthButton from "../../user-auth-button/user-auth-button.component";

import MenuIcon from '@mui/icons-material/Menu';


const Header = () => {    
    const { userAuth } = useContext(UserAuthContext);
    const { toggleSidebar } = getSidebarSettings();

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
                    sx={{position: 'absolute', left: 0}}
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

                {
                    userAuth ? 
                    <UserAuthButton buttonStatus="signout"/> :
                    <UserAuthButton buttonStatus="signin"/>
                }

            </Toolbar>
        </AppBar>
    )
}

export default Header;