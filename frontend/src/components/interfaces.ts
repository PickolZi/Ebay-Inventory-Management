import { User as FirebaseUser } from "firebase/auth";

export interface ItemInterface {
    ebay_url: string,
    id: number,
    image_urls: string | string[], 
    last_checked_on_ebay_date: string,
    last_updated_date: string,
    listed_date: string,
    location: string | undefined,
    price: number,
    sku: string,
    status: string,
    title: string,
    length?: number,
    width?: number,
    height?: number,
    weight?: number,
}

export interface UserInterface {
    email: string,
    role: string,
    updated?: boolean
    uid?: string,
    id?: string,
}

export interface UserAuthInterface {
    userAuth: FirebaseUser | null,
    setUserAuth: React.Dispatch<React.SetStateAction<FirebaseUser | null>>,
    userJWTToken: string | null,
    setUserJWTToken: React.Dispatch<React.SetStateAction<string | null>>,
    userInfo: UserInfoInterface | null
}

export interface UserInfoInterface {
    uid: string,
    email: string,
    role: string
}

export interface SideBarContextInterface {
    mobileView: boolean,
    isSidebarOpen: boolean,
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    toggleSidebar: () => void
}