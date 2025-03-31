import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOhBwMQazzgoRHhxlVyShJZ3rDJVexl3Q",
    authDomain: "scoremaster-14cfa.firebaseapp.com",
    projectId: "scoremaster-14cfa",
    storageBucket: "scoremaster-14cfa.firebasestorage.app",
    messagingSenderId: "198231148528",
    appId: "1:198231148528:web:22ba8def78089eed3d7f35",
    measurementId: "G-CZYFHMTXVT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
