import { auth, db, googleProvider } from "./firebase";
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

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        isAdmin: false, // Default to non-admin
        createdAt: new Date()
      });
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

    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      name: email.split('@')[0], // Basic name from email
      isAdmin: false, // Default to non-admin
      createdAt: new Date()
    });

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

// New function to check if a user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.isAdmin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// New function to set admin status (should be called from your admin panel)
export async function setUserAdminStatus(userId: string, isAdmin: boolean) {
  try {
    await setDoc(doc(db, 'users', userId), { isAdmin }, { merge: true });
  } catch (error) {
    console.error("Error setting admin status:", error);
    throw error;
  }
}