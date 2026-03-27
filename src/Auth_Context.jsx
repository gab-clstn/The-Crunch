// Auth_Context.jsx — exports ONLY the AuthProvider component.
// FIX: useAuth hook has been moved to useAuth.js so this file exports
// only a component, satisfying Vite's fast-refresh constraint.
import { createContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};
                    setCurrentUser({ ...user, name: userData?.name || "" });
                    setIsAdmin(userData?.role === "admin");
                } catch (error) {
                    console.error("Failed to fetch user doc:", error.message);
                    setCurrentUser({ ...user, name: "" });
                    setIsAdmin(false);
                }
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};