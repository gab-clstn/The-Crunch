// Cart_Context.jsx — exports ONLY the CartProvider component.
// FIX: useCart hook has been moved to useCart.js so this file exports
// only a component, satisfying Vite's fast-refresh constraint.
import React, { createContext, useState } from "react";

export const CartContext = createContext();

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

export const useCart = () => {
    return useContext(CartContext);
};