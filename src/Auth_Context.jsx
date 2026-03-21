import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Auth changes (Login/Logout)
        // Inside Auth_Context.jsx
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // This matches your screenshot: /users/userId
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setCurrentUser({
                        uid: user.uid,
                        email: userData.email, // "john@example.com"
                        name: userData.name,   // "John Doe"
                        role: userData.role    // "customer"
                    });
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe; // Cleanup listener
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);