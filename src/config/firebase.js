import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBnsZvXmN5OZZME1IMhVTTmVnpoD8M1Lr4",
    authDomain: "sstool-fde3b.firebaseapp.com",
    databaseURL: "https://sstool-fde3b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sstool-fde3b",
    storageBucket: "sstool-fde3b.appspot.com",
    messagingSenderId: "239680562483",
    appId: "1:239680562483:web:393f31510ed9feb6408a46"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);