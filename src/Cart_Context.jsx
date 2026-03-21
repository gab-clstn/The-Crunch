import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        console.log("Adding to cart:", product); // Check your console!
        
        setCartItems((prev) => {
            // Force prev to be an array if it's not
            const safePrev = Array.isArray(prev) ? prev : [];
            
            const existingItem = safePrev.find((item) => item.id === product.id);
            
            if (existingItem) {
                return safePrev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...safePrev, { ...product, qty: 1 }];
        });
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);