// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBr3YCZT4vAUMPi_bgkTGyALx0rZzt5wYA",
  authDomain: "siach-36698.firebaseapp.com",
  projectId: "siach-36698",
  storageBucket: "siach-36698.appspot.com",
  messagingSenderId: "595971594609",
  appId: "1:595971594609:web:1b6ec05a09913555d2fed0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
