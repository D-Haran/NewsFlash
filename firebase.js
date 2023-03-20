// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAkAE1mco-3NI1z9V6p34Rhx2vVl4Eew7A",
    authDomain: "newsflash-15006.firebaseapp.com",
    projectId: "newsflash-15006",
    storageBucket: "newsflash-15006.appspot.com",
    messagingSenderId: "642363322842",
    appId: "1:642363322842:web:96960a43aa22c1435e90e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);