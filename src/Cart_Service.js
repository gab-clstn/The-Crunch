import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { handleFirebaseError, withRetry } from "./firebase/errorHandler";

export const submitOrder = async (userId, cartItems, totalAmount) => {
    try {
        if (!cartItems || cartItems.length === 0) {
            throw new Error(handleFirebaseError("CART_EMPTY"));
        }

        const orderData = {
            items: cartItems.map(item => item.name),
            paymentMethod: "Cash on Delivery",
            status: "Pending",
            totalAmount,
            userId: `/users/${userId}`,
            CreatedAt: serverTimestamp(),
        };

        // withRetry handles transient Firebase errors (unavailable, deadline-exceeded)
        const docRef = await withRetry(() =>
            addDoc(collection(db, "orders"), orderData)
        );

        return docRef.id;
    } catch (error) {
        // Re-throw our own messages (CART_EMPTY, etc.) as-is
        if (error.message && !error.code) throw error;
        throw new Error(handleFirebaseError(error));
    }
};