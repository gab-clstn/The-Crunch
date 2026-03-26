import { auth, db } from "./firebase";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Admin verification code - stored in localStorage for updates
let ADMIN_VERIFICATION_CODE = localStorage.getItem("adminPasscode") || "CRUNCH2024ADMIN";

export { ADMIN_VERIFICATION_CODE };

export const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

export const register = async (name, email, password, role = "customer", adminCode = "") => {
    // Verify admin code if trying to register as admin
    if (role === "admin") {
        const currentPasscode = localStorage.getItem("adminPasscode") || "CRUNCH2024ADMIN";
        if (!adminCode || adminCode !== currentPasscode) {
            throw new Error("Invalid admin verification code. Contact management for access.");
        }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Based on your 'users' collection screenshot:
    await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role, // Use the provided role (customer or admin)
        createdAt: serverTimestamp()
    });
    return user;
};

export const logout = () => signOut(auth);

export const updateAdminPasscode = async (newPasscode) => {
    // Validate new passcode
    if (!newPasscode || newPasscode.length < 6) {
        throw new Error("Passcode must be at least 6 characters");
    }

    // Store in localStorage
    localStorage.setItem("adminPasscode", newPasscode);
    ADMIN_VERIFICATION_CODE = newPasscode;

    return { success: true, message: "Admin passcode updated successfully" };
};