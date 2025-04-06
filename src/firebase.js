import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBI7WQQfqEJutzIs6YSWni1SM1mexGkAkk",
  authDomain: "mil-patitas-felices.firebaseapp.com",
  projectId: "mil-patitas-felices",
  storageBucket: "mil-patitas-felices.firebasestorage.app",
  messagingSenderId: "67622767198",
  appId: "1:67622767198:web:d2695bf4e228b8c63842cf",
  measurementId: "G-QF5EJ8V3L8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

