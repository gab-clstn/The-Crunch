// src/Cart_Context.jsx
// Exports ONLY the CartProvider component — satisfies Vite Fast Refresh.
// CartContext lives in CartContext.js; the useCart hook lives in useCart.js.
import React, { useState } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const existing = safePrev.find((item) => item.id === product.id);
            if (existing) {
                return safePrev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...safePrev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, newQty) => {
        if (newQty <= 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
        } else {
            setCartItems(prev => prev.map(item =>
                item.id === id ? { ...item, qty: newQty } : item
            ));
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};