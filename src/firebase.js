    // firebase.js
    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';


    const firebaseConfig = {
        apiKey: "AIzaSyBYqInVt7UjKxKmELfMnW_BkTJr0erKf7o",
        authDomain: "siach-df969.firebaseapp.com",
        projectId: "siach-df969",
        storageBucket: "siach-df969.appspot.com",
        messagingSenderId: "506973198690",
        appId: "1:506973198690:web:e603297d7df67362c3f43b"
    };

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    export { db };
