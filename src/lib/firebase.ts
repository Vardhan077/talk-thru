import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2IBbPwMHJl7B3Bykq3p6pdG0aJdjhvDM",
  authDomain: "dddd-5d456.firebaseapp.com",
  projectId: "dddd-5d456",
  storageBucket: "dddd-5d456.firebasestorage.app",
  messagingSenderId: "619987653854",
  appId: "1:619987653854:web:d635a7476d8c72dc2a9e4f",
  measurementId: "G-SM4VHS0CEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Export all the necessary functions directly
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};