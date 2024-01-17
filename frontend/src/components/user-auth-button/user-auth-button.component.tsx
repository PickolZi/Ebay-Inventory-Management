
import { signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword } from "../../utils/firebase";

import styles from "./user-auth-button.module.css";

const UserAuthButton = ({ buttonStatus }) => {
    const email = "pickol876@gmail.com";
    const password = "tEstpAsswOrd123!@#";
    
    // signUpUserWithEmailAndPassword(email, password);
    // signInUserWithEmailAndPassword(email, password);

    return (
        <div className={styles.button_container}>
            {
                buttonStatus == "signin" && 
                <button className={`${styles.button__user_auth_button} ${styles.button__signin}`}>Sign In</button>
            }
            {
                buttonStatus == "signout" && 
                <button className={`${styles.button__user_auth_button} ${styles.button__signout}`}>Sign Out</button>
            }
        </div>
    )
}

export default UserAuthButton;