import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    try {
      console.log('Setting up auth state listener...');
      let unsubscribe: () => void;

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? `User logged in with UID: ${user.uid}` : 'No user');
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
          console.log('User authenticated:', {
            uid: user.uid,
            email: user.email
          });
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('No authenticated user');
        }
        setLoading(false);
        setAuthInitialized(true);
      }, (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
        setAuthInitialized(true);
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
      setAuthInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(result.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      if ((error as AuthError).code === 'auth/configuration-not-found') {
        throw new Error('Firebase Authentication is not properly configured. Please check your Firebase Console settings.');
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(user, { displayName: name });
      
      // Store user data in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        name: name
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
    } catch (error) {
      console.error('Registration error:', error);
      if ((error as AuthError).code === 'auth/configuration-not-found') {
        throw new Error('Firebase Authentication is not properly configured. Please enable Email/Password authentication in your Firebase Console.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    isAuthenticated,
    login,
    logout,
    register,
    loading
  };

  if (!authInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Initializing authentication...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
