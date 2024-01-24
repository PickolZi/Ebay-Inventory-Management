// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZl3gGUEcz8nwNgLqyicO_sC-Z7BG__fo",
  authDomain: "itemiz-basset.firebaseapp.com",
  projectId: "itemiz-basset",
  storageBucket: "itemiz-basset.appspot.com",
  messagingSenderId: "922922757846",
  appId: "1:922922757846:web:c7aec3cfc8b5e992a46377"
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