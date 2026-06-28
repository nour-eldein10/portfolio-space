import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBv2wD-6C8gWAylPsuxp4VtAn4urWfSIo",
  authDomain: "portfolio-e7c66.firebaseapp.com",
  projectId: "portfolio-e7c66",
  storageBucket: "portfolio-e7c66.firebasestorage.app",
  messagingSenderId: "740362124020",
  appId: "1:740362124020:web:81577e088e388c291c7ca1",
  measurementId: "G-KTKWS634Y9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
