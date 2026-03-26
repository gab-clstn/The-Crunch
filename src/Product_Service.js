import { db } from "./firebase";
import {
    collection, getDocs, addDoc, updateDoc,
    deleteDoc, doc, serverTimestamp, onSnapshot, query, orderBy
} from "firebase/firestore";

// READ (one-time)
export const getProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// REAL-TIME LISTENER
export const subscribeToProducts = (callback) => {
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(data);
    });
};

// CREATE
export const addProduct = async (productData) => {
    return await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: serverTimestamp()
    });
};

// UPDATE
export const updateProduct = async (productId, productData) => {
    const ref = doc(db, "products", productId);
    return await updateDoc(ref, productData);
};

// DELETE
export const deleteProduct = async (productId) => {
    const ref = doc(db, "products", productId);
    return await deleteDoc(ref);
};