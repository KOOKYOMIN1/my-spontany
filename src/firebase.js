// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-spontany.firebaseapp.com",
  projectId: "my-spontany",
  storageBucket: "my-spontany.appspot.com",
  messagingSenderId: "18373225769",
  appId: "1:18373225769:web:3b2847313c304f8a54db38"
  // measurementId: "G-XXXXX" // 안 써도 됨
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);