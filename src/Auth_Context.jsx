// src/Auth_Context.jsx
// Exports ONLY the AuthProvider component — satisfies Vite Fast Refresh.
// AuthContext lives in AuthContext.js; the useAuth hook lives in useAuth.js.
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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