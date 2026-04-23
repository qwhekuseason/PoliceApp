import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuinB9SSH2bqemXHb_iKVI6mgpKIJEwVI",
  authDomain: "policeapp-b303e.firebaseapp.com",
  projectId: "policeapp-b303e",
  storageBucket: "policeapp-b303e.firebasestorage.app",
  messagingSenderId: "866651656733",
  appId: "1:866651656733:web:2b43745d6a475c5da86cf4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
