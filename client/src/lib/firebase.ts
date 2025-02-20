// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV9r3G7sWsafEG-Cud03G6AZOXKig7XGA",
  authDomain: "crm-ge-11727.firebaseapp.com",
  projectId: "crm-ge-11727",
  storageBucket: "crm-ge-11727.appspot.com",
  messagingSenderId: "448116957305",
  appId: "1:448116957305:web:50e692248b628fd9cfb4a8",
  region: "us-central1"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  console.log('Initializing Firebase...');
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  
  // Set persistence to local
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase Auth persistence set to local');
    })
    .catch((error) => {
      console.error('Error setting persistence:', error);
    });
  
  // Initialize Cloud Firestore
  db = getFirestore(app);
  console.log('Firestore initialized');

  // Test Firebase connection
  auth.onAuthStateChanged((user) => {
    console.log('Firebase connection test - Auth state:', user ? 'User logged in' : 'No user');
  }, (error) => {
    console.error('Firebase connection test - Auth error:', error);
  });

} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;
