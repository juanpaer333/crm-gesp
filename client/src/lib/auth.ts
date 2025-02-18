import { auth, googleProvider } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
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
