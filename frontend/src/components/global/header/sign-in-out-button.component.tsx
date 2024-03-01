'use client'
import { Box, Button } from "@mui/material"
import Link from "next/link";

import { signOutUser } from "@/utils/firebase";

const SignInOutButton = ({buttonType}) => {
    return (
        <Box>
            {
                buttonType == "signin" ?
                    <Link href="/signin">
                        <Button variant="contained">Sign In</Button>
                    </Link> 
                :
                    <Button variant="contained" onClick={signOutUser}>Sign Out</Button>
            }
        </Box>
    )
}


export default SignInOutButton;