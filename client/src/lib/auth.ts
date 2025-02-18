import { auth, googleProvider, db } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // After successful Google sign-in, check existing user document
    const userRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(userRef);

    // We don't create a new document if it exists, as it should be managed in Firebase Console
    if (!docSnap.exists()) {
      console.log("Warning: No user document found in Firestore for:", result.user.email);
    } else {
      console.log("Found existing user document with admin status:", docSnap.data().admin);
    }

    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}