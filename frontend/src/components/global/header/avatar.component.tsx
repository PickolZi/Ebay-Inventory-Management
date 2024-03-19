import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Box, Popper, Paper, Typography, ClickAwayListener } from "@mui/material"
import {Avatar as MUIAvatar} from "@mui/material";

import SignInOutButton from "./sign-in-out-button.component";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BassetLogo from "../../../../public/assets/bassetLogo.jpg";

import { UserInterface } from "@/components/interfaces";


const AvatarDropdown:React.FC<{
    anchor: HTMLElement | null,
    setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
    email: string,
    role: string,
}> = ({
    anchor, 
    setAnchor, 
    email, 
    role
}) => {
    return (
        <Popper
            sx={{ width: '240px', zIndex: 1200 }}
            open={Boolean(anchor)}
            anchorEl={anchor}
            placement="bottom-end"
        >
            <Paper sx={{py: '16px', display: 'flex', gap:'8px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Typography>{role.toUpperCase()}</Typography>
                {                        
                    role == "admin" ?
                    <SupervisedUserCircleIcon sx={{width: '96px', height: '96px'}} />
                : role == "owner" ? 
                    // <AccountCircleIcon sx={{width: '96px', height: '96px'}} />
                    <Image width={96} height={96} alt="Basset Owner Role" src={BassetLogo} />    
                : 
                    <AccountCircleIcon sx={{width: '96px', height: '96px'}} />
                }

                <Typography>Hello, {email}</Typography>
                
                {
                    (role == "admin" || role == "owner") &&
                    <Link href="/admin">Admin Dashboard</Link>
                }

                <SignInOutButton buttonType="signout" />
            </Paper>
        </Popper>
    )
}

const Avatar:React.FC<{userInfo:UserInterface|null}> = ({userInfo}) => {
    const uid = userInfo ? userInfo["uid"] : "";
    const email = userInfo ? userInfo["email"] : "GUEST";
    const role = userInfo ? userInfo["role"] : "USER";

    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const handleClick = (event:React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null : event.currentTarget);
    }

    return (
        <ClickAwayListener
            onClickAway={() => {setAnchor(null)}}
        >
            <Box>
                <MUIAvatar
                    onClick={handleClick}
                    alt="User Avatar"
                    sx={{cursor: 'pointer'}}
                >
                    {                        
                      role == "admin" ?
                        <SupervisedUserCircleIcon sx={{width: '100%', height: '100%', backgroundColor: 'red'}} />
                    : role == "owner" ?
                        <Image alt="Basset Owner Role" src={BassetLogo} fill={true} />    
                    : 
                        <AccountCircleIcon sx={{width: '100%', height: '100%'}} />
                    }   
                    
                </MUIAvatar>
                <AvatarDropdown 
                    anchor={anchor} 
                    setAnchor={setAnchor} 
                    email={email} 
                    role={role} 
                />
            </Box>
        </ClickAwayListener>
    )
}

export default Avatar;