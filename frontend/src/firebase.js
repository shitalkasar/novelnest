import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8gPN40iFLhXKyT1DJgcFjA47xStSbstY",
  authDomain: "novelnest-ea788.firebaseapp.com",
  projectId: "novelnest-ea788",
  storageBucket: "novelnest-ea788.firebasestorage.app",
  messagingSenderId: "719868179829",
  appId: "1:719868179829:web:486f483537e1c47a35cf3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
