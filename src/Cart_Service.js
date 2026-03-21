import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const submitOrder = async (userId, cartItems, totalAmount) => {
    try {
        const orderData = {
            // Matches your 'items' array in the screenshot
            items: cartItems.map(item => item.name), 
            
            // Matches 'paymentMethod'
            paymentMethod: "Cash on Delivery", 
            
            // Matches 'status'
            status: "Pending", 
            
            // Matches 'totalAmount'
            totalAmount: totalAmount, 
            
            // Matches your '/users/userId' format
            userId: `/users/${userId}`, 
            
            // Matches 'CreatedAt'
            CreatedAt: serverTimestamp() 
        };

        const docRef = await addDoc(collection(db, "orders"), orderData);
        return docRef.id;
    } catch (error) {
        console.error("Error saving order: ", error);
        throw error;
    }
};