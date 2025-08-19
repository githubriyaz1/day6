// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// PASTE YOUR CONFIG KEYS FROM THE FIREBASE WEBSITE HERE
const firebaseConfig = {
  apiKey: "AIzaSyDVvkZfcM885n5AgS_HXexDUXyigawZJKM",
  authDomain: "employee-directory-app-5b71a.firebaseapp.com",
  projectId: "employee-directory-app-5b71a",
  storageBucket: "employee-directory-app-5b71a.firebasestorage.app",
  messagingSenderId: "960069479557",
  appId: "1:960069479557:web:5fd5b938397823a7af4dec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and export it
export const db = getFirestore(app);