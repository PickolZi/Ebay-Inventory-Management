import Link from "next/link";

import styles from "./navbar.module.css"
import UserAuthButton from "../user-auth-button/user-auth-button.component";

const Navbar = () => {    
    return (
        <nav className={styles.navbar}>
            <div className={styles.left_nav}></div>
            <div className={styles.mid_nav}>
                {/* <Link href="/">Itemiz</Link> */}
                <Link href="/pages/active">Active</Link>
                <Link href="/pages/sold">Sold</Link>
                <Link href="/pages/notpaid">Not Paid</Link>
                <Link href="/pages/found">Found</Link>
                <Link href="/pages/shipped">Shipped</Link>
                <Link href="/pages/map">Map</Link>
            </div>
            <div className={styles.right_nav}>
                {/* <UserAuthButton buttonStatus="signin"/> */}
            </div>
        </nav>
    )
}

export default Navbar;