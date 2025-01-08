import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Agregar Storage

const firebaseConfig = {
  apiKey: "AIzaSyDISJI-4GyaKXa7gQv7cDeQ1mtVNZWZWow",
  authDomain: "siach-78ffb.firebaseapp.com",
  projectId: "siach-78ffb",
  storageBucket: "siach-78ffb.firebasestorage.app",
  messagingSenderId: "1014581207927",
  appId: "1:1014581207927:web:3e56cee81c052f5adb3772"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializa Storage

export { auth, db, storage };
