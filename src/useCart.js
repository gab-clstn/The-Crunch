// src/useCart.js
// Custom hook extracted from Cart_Context.jsx to satisfy Fast Refresh
// (a file must export only components OR only non-component exports).
import { useContext } from "react";
import { CartContext } from "./CartContext";

export const useCart = () => useContext(CartContext);