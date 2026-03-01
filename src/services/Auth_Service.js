import { auth, db } from "./firebase";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

export const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Based on your 'users' collection screenshot:
    await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: "customer", // Default role
        createdAt: serverTimestamp()
    });
    return user;
};

export const logout = () => signOut(auth);