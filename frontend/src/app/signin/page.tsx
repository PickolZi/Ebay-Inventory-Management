'use client'
import { useEffect, useState, useContext } from "react";

import { signInUserWithEmailAndPassword } from "@/utils/firebase";

import styles from "./signin.module.css";

import { UserAuthContext } from "../context/user.context";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

const SignIn = () => {
    const { userAuth, setUserAuth } = useContext(UserAuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        signInUserWithEmailAndPassword(email, password);
    }

    const userSignOut = async () => {
        await signOut(auth).then(() => {
            console.log("User signed out")
        })
    }

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                setUserAuth(user);
            } else {
                setUserAuth(null)
            }
        })

        return () => {
            listen();
        }

    }, [])

    return (
        <div className={styles.form__container}>        
            <form className={styles.form}>
                <div className={styles.form__heading}>
                    <h1>Itemiz</h1>
                    <p>Please Sign in to have full access to Itemiz's features.</p>
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
                    onClick={handleSubmit}
                    className={styles.submit_signin} />
            </form>
            <h1>{
                    userAuth ? `User is signed in ${userAuth["email"]}` : "User is not signed in"
                }</h1>
            <button onClick={userSignOut}>Sign out</button>
        </div>
    )
}

export default SignIn;