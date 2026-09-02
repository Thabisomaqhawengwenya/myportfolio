import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBei5aslY7nT-1VocO_o-Cd1wTyWRjfaPU",
  authDomain: "myportfolio-14192.firebaseapp.com",
  projectId: "myportfolio-14192",
  storageBucket: "myportfolio-14192.firebasestorage.app",
  messagingSenderId: "416417956465",
  appId: "1:416417956465:web:9feabc434f71f9f31691d0",
  measurementId: "G-VGYN8LC2D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
