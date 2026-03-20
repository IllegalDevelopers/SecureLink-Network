import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBsIa4fnnfObijK3y8SUPpWW0SdHA7sJQ",
  authDomain: "shortner-46902.firebaseapp.com",
  projectId: "shortner-46902",
  storageBucket: "shortner-46902.firebasestorage.app",
  messagingSenderId: "602301648822",
  appId: "1:602301648822:web:d596507b6fd3c05d63fb17",
  measurementId: "G-F06NLWZWHX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);