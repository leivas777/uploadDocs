import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAKKhM2GZLE_hf7SyXRgjDwfwVN-3psD0Y",
  authDomain: "uploaddocslel.firebaseapp.com",
  projectId: "uploaddocslel",
  storageBucket: "uploaddocslel.firebasestorage.app",
  messagingSenderId: "446639035503",
  appId: "1:446639035503:web:738c8a61e72f0f5f28299a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

export {db, auth, storage}