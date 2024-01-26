'use client'
import { useEffect, useState, useContext } from "react";

import { signInUserWithEmailAndPassword, signOutUser } from "@/utils/firebase";

import styles from "./signin.module.css";

import { UserAuthContext } from "../context/user.context";

const SignIn = () => {
    const { userAuth, setUserAuth } = useContext(UserAuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        await signInUserWithEmailAndPassword(email, password).then((user) => {
            console.log("user signed in successfully!")
            console.log(user);
        });
        // TODO: Redirect to homepage after a successful login.
    }

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

                <input 
                    type="submit"
                    value="Login" 
                    onClick={handleLogin}
                    className={styles.login_button} />
            </form>
            <h1>{
                    userAuth ? `User is signed in ${userAuth["email"]}` : "User is not signed in"
                }</h1>
            <button onClick={signOutUser}>Sign out</button>
        </div>
    )
}

export default SignIn;