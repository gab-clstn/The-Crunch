// src/CartContext.js
// Isolated context so Cart_Context.jsx exports ONLY a component (Fast Refresh requirement).
import { createContext } from "react";

export const CartContext = createContext();