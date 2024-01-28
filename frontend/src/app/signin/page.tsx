'use client'
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserAuthContext } from "../context/user.context";

import { signInUserWithEmailAndPassword, signOutUser } from "@/utils/firebase";

import styles from "./signin.module.css";


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
        <div className={styles.form__container}>        
            <form className={styles.form}>
                <div className={styles.form__heading}>
                    <h1>Itemiz</h1>
                    <p>Please sign in to have full access to Itemiz's features.</p>
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

                <Link href="/signup">Create an account?</Link>

                <input 
                    type="submit"
                    value="Login" 
                    onClick={handleLogin}
                    className={styles.login_button} />
            </form>
        </div>
    )
}

export default SignIn;