// app/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getDatabase } from 'firebase/database'; 

import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEANSUREMENT_ID
  
};
// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Realtime Database
const rtdb = getDatabase(app); // Add this line to initialize Realtime Database

export { db, storage, rtdb,  auth, signInWithEmailAndPassword, signInWithPopup,  createUserWithEmailAndPassword, GoogleAuthProvider};
/*
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
*/
