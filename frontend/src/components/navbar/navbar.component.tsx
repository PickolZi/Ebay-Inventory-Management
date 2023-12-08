import Link from "next/link";

import styles from "./navbar.module.css"

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link href="/">Itemiz</Link>
            <Link href="/pages/active">Active</Link>
            <Link href="/pages/sold">Sold</Link>
            <Link href="/pages/shipped">Shipped</Link>
            <Link href="/pages/map">Map</Link>
        </nav>
    )
}

export default Navbar;