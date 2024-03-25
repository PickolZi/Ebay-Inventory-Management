'use client'
import { useEffect, useState, useContext } from "react";
import { redirect } from "next/navigation";
import axios from "axios";

import Image from "next/image";
import Link from "next/link";

import bassetLogo from "../../../public/assets/bassetLogo.jpg"

import { UserAuthContext } from "../context/user.context";

import { signUpUserWithEmailAndPassword } from "@/utils/firebase";

import { Box, TextField, Typography, Button } from "@mui/material";

import { MACHINE_IP } from "@/utils/machine-ip";

import { UserAuthInterface } from "@/components/interfaces";
import { User as FirebaseUser } from "firebase/auth";


const SignUp = () => {
    const userAuthContext:UserAuthInterface|null = useContext(UserAuthContext);
    const userAuth = userAuthContext ? userAuthContext.userAuth : null; 


    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleSignUp = async (event:React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        if (!email.match(/^\S+@\S+\.\S+$/)) {
            console.log("email is not valid.")
            return;
        }
        if (password != confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            console.log("Password is too short. Must be atleast 8 characters long.")
            return;
        }

        signUpUserWithEmailAndPassword(email, password).then(async (user) => {
            if (!user) {
                console.log("Email already in use, try logging in or trying a different email.");
                return;
            } else {
                console.log("User created successfully.");
            }
        });
    }

    useEffect(() => {
        // If user is logged in, redirect them to home page.
        if (userAuth) {
            const getUserJWT = async (userAuth:FirebaseUser) => {
                return await userAuth.getIdToken();
            }

            // Adds user to database.
            getUserJWT(userAuth).then((JWT_TOKEN) => {
                axios.post(MACHINE_IP + "/api/firebase/addUser", {
                    JWT_TOKEN: JWT_TOKEN
                });
            });

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
                autoComplete='off'
                onChange={(e) => {setEmail(e.target.value)}}
            />

            <TextField
                required
                type="password"
                label="Password"
                value={password}
                autoComplete='off'
                onChange={(e) => {setPassword(e.target.value)}}
            />

            <TextField
                required
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                autoComplete='off'
                onChange={(e) => {setConfirmPassword(e.target.value)}}
            />

            <Link href="/signin">Have an account?</Link>

            <Button variant="contained" onClick={handleSignUp}>Sign up</Button>

        </Box>
    )
}

export default SignUp;