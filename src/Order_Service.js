import { db } from "./firebase";
import {
    collection, addDoc, query, where,
    orderBy, onSnapshot, serverTimestamp, doc, updateDoc
} from "firebase/firestore";

// Save a new order
export const placeOrder = async (userId, orderData) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            userId,
            status: "Pending",
            createdAt: serverTimestamp(),
        });
        return docRef;
    } catch (error) {
        console.error("placeOrder error:", error);
        throw error;
    }
};

// Real-time listener for a user's orders
export const subscribeToUserOrders = (userId, callback) => {
    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(
        q,
        (snapshot) => {
            const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(orders);
        },
        (error) => {
            // This will log the Firebase console URL to create the required composite index.
            // Open that URL to create the index — it only takes one click.
            console.error("subscribeToUserOrders error:", error);
        }
    );
};

// Real-time listener for ALL orders (admin use)
export const subscribeToAllOrders = (callback, onError) => {
    const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(
        q,
        (snapshot) => {
            const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(orders);
        },
        (error) => {
            console.error("subscribeToAllOrders error:", error);
            if (onError) onError(error);
        }
    );
};

// Update order status (for admin use)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const ref = doc(db, "orders", orderId);
        return await updateDoc(ref, { status });
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        throw error;
    }
};