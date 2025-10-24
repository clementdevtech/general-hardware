import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVRIN8tiIvGI48E3m-0pS1YJJjwm9SCSg",
  authDomain: "reject-mabati.firebaseapp.com",
  projectId: "reject-mabati",
  storageBucket: "reject-mabati.firebasestorage.app",
  messagingSenderId: "1034159345666",
  appId: "1:1034159345666:web:085f1a38869ee58ff6171b",
  measurementId: "G-6XJ58BLK6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
