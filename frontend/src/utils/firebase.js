// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signUpUserWithEmailAndPassword = (email, password) => {
  const user = createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    return userCredential.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}`);
    console.log(`Error Message: ${errorMessage}`);
    return null;
  })
  return user;
}

export const signInUserWithEmailAndPassword = async (email, password) => {
  const user = signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    return userCredential.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}`);
    console.log(`Error Message: ${errorMessage}`);
    return null;
  })
  return user;
}

export const signOutUser = async () => {
  signOut(auth).then(() =>{
    console.log("signed out.")
    return true;
  }).catch(() => {
    return false;
  })
}

export const getUserAuthToken = async () => {
  return await auth.currentUser.getIdToken();
}

// Moved logic for authUser state to user.context.tsx