'use client'
import Link from "next/link";

import { useState, useEffect, useContext } from "react";
import { UserAuthContext } from "@/app/context/user.context";


import UserAuthButton from "../../user-auth-button/user-auth-button.component";

import styles from "./header.module.css"


const Header = () => {    
    const { userAuth } = useContext(UserAuthContext);

    return (
        <nav className={styles.navbar}>
            <div className={styles.left_nav}></div>
            <div className={styles.mid_nav}>
                
            </div>
            <div className={styles.right_nav}>
                { !userAuth ? 
                    <UserAuthButton buttonStatus="signin"/> :
                    <UserAuthButton buttonStatus="signout"/>
                 }
            </div>
        </nav>
    )
}

export default Header;