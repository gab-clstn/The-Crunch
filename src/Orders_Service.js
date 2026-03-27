import { db } from "./firebase";
import {
    collection, addDoc, query, where,
    orderBy, onSnapshot, serverTimestamp, doc, updateDoc
} from "firebase/firestore";
import { handleFirebaseError, withRetry } from "./firebase/errorHandler";

// Save a new order
export const placeOrder = async (userId, orderData) => {
    try {
        const docRef = await withRetry(() =>
            addDoc(collection(db, "orders"), {
                ...orderData,
                userId,
                status: "Pending",
                createdAt: serverTimestamp(),
            })
        );
        return docRef;
    } catch (error) {
        throw new Error(handleFirebaseError(error));
    }
};

// Real-time listener for a user's orders
export const subscribeToUserOrders = (userId, callback, onError) => {
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
            const message = handleFirebaseError(error);
            console.error("subscribeToUserOrders error:", message);
            if (onError) onError(message);
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
            const message = handleFirebaseError(error);
            console.error("subscribeToAllOrders error:", message);
            if (onError) onError(message);
        }
    );
};

// Update order status (admin use)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const ref = doc(db, "orders", orderId);
        return await withRetry(() => updateDoc(ref, { status }));
    } catch (error) {
        throw new Error(handleFirebaseError(error));
    }
};