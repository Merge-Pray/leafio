import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzHG09p5PFhb8-Lbe3YugarlG63VqGB7M",
  authDomain: "leafio-6f128.firebaseapp.com",
  projectId: "leafio-6f128",
  storageBucket: "leafio-6f128.firebasestorage.app",
  messagingSenderId: "570702013490",
  appId: "1:570702013490:web:9728ca28abef62a0f8482b",
  measurementId: "G-D5MCK7M35L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
