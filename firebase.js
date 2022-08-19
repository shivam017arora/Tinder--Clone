// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmPc-WyesrOfFDFeJFqhyFuhaYaJKdVW8",
  authDomain: "tinder-web3-b7c8f.firebaseapp.com",
  projectId: "tinder-web3-b7c8f",
  storageBucket: "tinder-web3-b7c8f.appspot.com",
  messagingSenderId: "131816244749",
  appId: "1:131816244749:web:cebf09f01caec174bd3744",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

export { auth, db };
