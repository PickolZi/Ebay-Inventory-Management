import Link from "next/link";

import { signOutUser } from "@/utils/firebase";

import styles from "./user-auth-button.module.css";


const UserAuthButton = ({ buttonStatus }) => {
    return (
        <div className={styles.button_container}>
            {
                buttonStatus == "signin" && 
                <Link href="/signin">
                    <button 
                        className={`${styles.button__user_auth_button} ${styles.button__signin}`}
                        >Sign In
                    </button>
                </Link>
            }
            {
                buttonStatus == "signout" && 
                <button 
                    className={`${styles.button__user_auth_button} ${styles.button__signout}`} 
                    onClick={signOutUser}
                    >Sign Out
                </button>
            }
        </div>
    )
}

export default UserAuthButton;