'use client'
import { useEffect, useState, useContext } from "react";
import { redirect } from "next/navigation";

import { UserAuthContext } from "../context/user.context";

import axios from "axios";

import { signUpUserWithEmailAndPassword, signOutUser } from "@/utils/firebase";

import styles from "./signup.module.css";
import { MACHINE_IP } from "@/utils/machine-ip";


const SignUp = () => {
    const { userAuth } = useContext(UserAuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async (event) => {
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
            const getUserJWT = async (userAuth) => {
                return await userAuth.getIdToken();
            }

            // Adds user to database.
            getUserJWT(userAuth).then((JWT_TOKEN) => {
                axios.post(MACHINE_IP + ":5000" + "/api/firebase/addUser", {
                    JWT_TOKEN: JWT_TOKEN
                });
            });

            redirect("/pages/active");
        }
    }, [userAuth])

    return (
        <div className={styles.form__container}>        
            <form className={styles.form}>
                <div className={styles.form__heading}>
                    <h1>Itemiz</h1>
                    <p>Please Sign up to have full access to Itemiz's features.</p>
                </div>

                <div className={styles.form__email}>
                    <label htmlFor="email_signin">Email: </label>
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        className={styles.form__input_field}
                        id="email_signin"/>
                </div>

                <div className={styles.form__password}>
                    <label htmlFor="password_signin">Password: </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        className={styles.form__input_field} 
                        id="password_signin" />
                </div>

                <div className={styles.form__confirm_password}>
                    <label htmlFor="confirm_password_signin">Confirm password: </label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value)}}
                        className={styles.form__input_field} 
                        id="confirm_password_signin" />
                </div>

                <input 
                    type="submit" 
                    onClick={handleSignUp}
                    className={styles.signup_button} />
            </form>
        </div>
    )
}

export default SignUp;