'use client'
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

import bassetLogo from "../../../public/assets/bassetLogo.jpg"

import { UserAuthContext } from "../context/user.context";

import { signInUserWithEmailAndPassword } from "@/utils/firebase";

import { Box, TextField, Typography, Button } from "@mui/material";


const SignIn = () => {
    const { userAuth } = useContext(UserAuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        await signInUserWithEmailAndPassword(email, password).then((user) => {
            console.log("user signed in successfully!")
            console.log(user);
        });
    }
    
    useEffect(() => {
        if (userAuth) {
            redirect("/pages/active");
        }
    }, [userAuth])

    return (
        <Box
            component="form"
            sx={{
                display: 'flex', 
                flexDirection: 'column', 
                maxWidth: 'sm',
                mx: 'auto',
                mt: '8rem', 
                gap: '1rem'
            }}
        >        
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Image 
                    alt="Basset Auto Wreckers Logo"
                    width={64}
                    height={64}
                    src={bassetLogo}
                    style={{borderRadius: '50%'}}  
                />
                <Typography component='h3'>Sign in</Typography>
            </Box>

            <TextField
                required
                label="Email Address"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
            />

            <TextField
                required
                type="password"
                label="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
            />

            <Link href="/signup">Create an account?</Link>

            <Button variant="contained" onClick={handleLogin}>Login</Button>

        </Box>
    )
}

export default SignIn;