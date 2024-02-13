'use client'
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const UserAuthContext = createContext({
    userAuth: null,
    setUserAuth: () => {},
    userJWTToken: null,
    setUserJWTToken: () => {}
});

export const UserAuthProvider = ({children}) => {
    const [userAuth, setUserAuth] = useState("");
    const [userJWTToken, setUserJWTToken ] = useState("")
    const value = {userAuth, setUserAuth, userJWTToken, setUserJWTToken}

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            // Observor that updates userAuth state variable whenever the user logs in or out.
            if (user) {
                setUserAuth(user);
                setUserJWTToken(await user.getIdToken());
                console.log("User signed in");
            } else {
                setUserAuth(null);
                setUserJWTToken("");
            }
        });
    }, [])

    return (
        <UserAuthContext.Provider 
            value={value}>{children}</UserAuthContext.Provider>
    )
}