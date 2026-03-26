// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDvsppvc7diomW206gVezO3Udn-wM_5SZs",
    authDomain: "the-crunch-4735e.firebaseapp.com",
    projectId: "the-crunch-4735e",
    storageBucket: "the-crunch-4735e.firebasestorage.app",
    messagingSenderId: "533787752209",
    appId: "1:533787752209:web:73bdce3fb11051a95cbeb0",
    measurementId: "G-K8Q2MMK65N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
