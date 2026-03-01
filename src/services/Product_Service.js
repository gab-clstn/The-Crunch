import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";

const productRef = collection(db, "products");

export const getProducts = async () => {
    const snapshot = await getDocs(productRef);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const addProduct = async (product) => {
    return await addDoc(productRef, product);
};

export const updateProduct = async (id, updatedData) => {
    const productDoc = doc(db, "products", id);
    return await updateDoc(productDoc, updatedData);
};

export const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    return await deleteDoc(productDoc);
};
