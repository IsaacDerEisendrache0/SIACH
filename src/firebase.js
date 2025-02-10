// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDISJI-4GyaKXa7gQv7cDeQ1mtVNZWZWow",
  authDomain: "siach-78ffb.firebaseapp.com",
  projectId: "siach-78ffb",
  storageBucket: "siach-78ffb.firebasestorage.app",
  messagingSenderId: "1014581207927",
  appId: "1:1014581207927:web:3e56cee81c052f5adb3772",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
