'use client'
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const UserAuthContext = createContext({
    userAuth: null,
    setUserAuth: () => {}
});

export const UserAuthProvider = ({children}) => {
    const [userAuth, setUserAuth] = useState("");
    const value = {userAuth, setUserAuth}

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            // Observor that updates userAuth state variable whenever the user logs in or out.
            if (user) {
                setUserAuth(user);
            } else {
                setUserAuth(null);
            }
        });
    }, [])

    return (
        <UserAuthContext.Provider 
            value={value}>{children}</UserAuthContext.Provider>
    )
}