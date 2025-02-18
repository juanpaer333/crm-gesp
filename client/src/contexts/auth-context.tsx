import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  admin: boolean;
  email: string;
  name: string;
  paid: boolean;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user?.email);
      setUser(user);

      if (user) {
        // Fetch additional user data from Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          console.log("Fetching user data for:", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            console.log("User data loaded:", { 
              admin: data.admin, 
              email: data.email,
              paid: data.paid 
            });
            setUserData(data);
          } else {
            console.log("No user document found for:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Create a default user document if it doesn't exist
          const defaultUserData: UserData = {
            admin: false,
            email: user.email || '',
            name: user.displayName || '',
            paid: false,
            uid: user.uid
          };
          setUserData(defaultUserData);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}