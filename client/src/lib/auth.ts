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

    // After successful Google sign-in, create/update user document
    const userRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create new user document
      const userData = {
        email: result.user.email,
        name: result.user.displayName,
        admin: result.user.email === "juanpabbloer@gmail.com", // Make this specific email admin
        paid: false,
        uid: result.user.uid
      };
      await setDoc(userRef, userData);
      console.log("Created new user document for:", result.user.email, "with admin:", userData.admin);
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