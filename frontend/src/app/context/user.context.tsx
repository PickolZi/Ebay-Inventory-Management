'use client'
import { useState } from "react";
import { createContext, useEffect } from "react";

import axios from "axios";

import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { MACHINE_IP } from "@/utils/machine-ip";


export const UserAuthContext = createContext({
    userAuth: null,
    setUserAuth: () => {},
    userJWTToken: null,
    setUserJWTToken: () => {}
});

const initalUserInfo = {
    uid: "",
    email: "",
    role: ""
}

export const UserAuthProvider = ({children}) => {
    const [userAuth, setUserAuth] = useState("");
    const [userJWTToken, setUserJWTToken ] = useState("")
    const [userInfo, setUserInfo] = useState(initalUserInfo)
    const value = {userAuth, setUserAuth, userJWTToken, setUserJWTToken, userInfo}

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            // Observor that updates userAuth state variable whenever the user logs in or out.
            if (user) {
                setUserAuth(user);
                setUserJWTToken(await user.getIdToken());
                
                // Grabs user's role from database because we can't store that information in firebase with the JWT.
                axios.post(MACHINE_IP + ":5000" + "/api/firebase/getCurrentUser", {uid: user.uid}).then((userData) => {
                    setUserInfo(userData.data);
                }).catch((err) => {
                    console.log("Error occured when setting user information from database using firebase uid.", err)
                })
            } else {
                setUserAuth(null);
                setUserJWTToken("");
            }
        });
    }, [])

    return (
        <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
    )
}