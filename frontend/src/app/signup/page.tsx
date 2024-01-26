'use client'
import { useEffect, useState, useContext } from "react";

import { signUpUserWithEmailAndPassword, signOutUser } from "@/utils/firebase";

import styles from "./signup.module.css";

import { UserAuthContext } from "../context/user.context";

const SignUp = () => {
    const { userAuth, setUserAuth } = useContext(UserAuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        // TODO: Use regex to verify that email formatting is correct.
        // TODO: Have a password requirement validation.
        if (password != confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }
        signUpUserWithEmailAndPassword(email, password);
        // TODO: Redirect to homepage after a successful login.
    }

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
                    onClick={handleSubmit}
                    className={styles.submit_signin} />
            </form>
            <h1>{
                    userAuth ? `User is signed in ${userAuth["email"]}` : "User is not signed in"
                }</h1>
            <button onClick={signOutUser}>Sign out</button>
        </div>
    )
}

export default SignUp;