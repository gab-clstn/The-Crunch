import { auth, db } from "./firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { handleFirebaseError } from "./firebase/errorHandler";

// Admin verification code — stored in localStorage for runtime updates
let ADMIN_VERIFICATION_CODE = localStorage.getItem("adminPasscode") || "CRUNCH2024ADMIN";

export { ADMIN_VERIFICATION_CODE };

export const login = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error(handleFirebaseError(error));
    }
};

export const register = async (name, email, password, role = "customer", adminCode = "") => {
    try {
        // Verify admin code if trying to register as admin
        if (role === "admin") {
            const currentPasscode = localStorage.getItem("adminPasscode") || "CRUNCH2024ADMIN";
            if (!adminCode || adminCode !== currentPasscode) {
                throw new Error("Invalid admin verification code. Contact management for access.");
            }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            role,
            createdAt: serverTimestamp(),
        });

        return user;
    } catch (error) {
        // Re-throw our own custom messages (admin code, etc.) as-is
        if (error.message && !error.code) throw error;
        throw new Error(handleFirebaseError(error));
    }
};

export const logout = async () => {
    try {
        return await signOut(auth);
    } catch (error) {
        throw new Error(handleFirebaseError(error));
    }
};

export const updateAdminPasscode = (newPasscode) => {
    if (!newPasscode || newPasscode.length < 6) {
        throw new Error("Passcode must be at least 6 characters.");
    }
    localStorage.setItem("adminPasscode", newPasscode);
    ADMIN_VERIFICATION_CODE = newPasscode;
    return { success: true, message: "Admin passcode updated successfully." };
};