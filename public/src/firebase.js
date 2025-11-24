// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNqJiC6oFVL4cyPlpmVCNoDogeZCANdMk",
  authDomain: "tm-accounts-space.firebaseapp.com",
  projectId: "tm-accounts-space",
  storageBucket: "tm-accounts-space.firebasestorage.app",
  messagingSenderId: "926881338176",
  appId: "1:926881338176:web:9718a46504908da72260a5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
