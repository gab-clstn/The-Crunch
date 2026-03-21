import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";

// --- YOUR EXISTING CODE ---
export const placeOrder = async (currentUser, cartItems, totalAmount) => {
    try {
        const itemNames = cartItems.map(item => item.name);

        const orderData = {
            items: itemNames,
            totalAmount: totalAmount,
            status: "Pending",
            paymentMethod: "Cash on Delivery",
            userId: `/users/${currentUser.uid}`,
            CreatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "orders"), orderData);
        return docRef.id;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

// --- NEW CODE: Fetching Orders ---
export const getUserOrders = async (userId) => {
    try {
        const ordersRef = collection(db, "orders");
        
        // This query looks for the specific userId string you saved earlier
        const q = query(
            ordersRef, 
            where("userId", "==", `/users/${userId}`),
            orderBy("CreatedAt", "desc") // Shows newest orders first
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};