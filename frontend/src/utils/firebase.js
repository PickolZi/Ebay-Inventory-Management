// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
  createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    console.log("Creating User")
    const user = userCredential.user;
    console.log(`User: ${user}`);
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}`);
    console.log(`Error Message: ${errorMessage}`);
  })
}

export const signInUserWithEmailAndPassword = async (email, password) => {
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    console.log("User signed in...")
    console.log(user);
    return user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}`);
    console.log(`Error Message: ${errorMessage}`);
    return false;
  })
}