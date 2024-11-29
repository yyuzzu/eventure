// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrud-qCxeOCIfXF1ieAj34zWah7hkR3CI",
  authDomain: "eventure-9b6a9.firebaseapp.com",
  projectId: "eventure-9b6a9",
  storageBucket: "eventure-9b6a9.firebasestorage.app",
  messagingSenderId: "443636159964",
  appId: "1:443636159964:web:6b97fcb46b627879e7ab19",
  measurementId: "G-X03EN1XR01",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
