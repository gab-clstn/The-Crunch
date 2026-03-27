// useCart.js — custom hook only (no component exports).
// Import from here instead of Cart_Context.jsx wherever you need useCart().
import { useContext } from "react";
import { CartContext } from "./Cart_Context";

export const useCart = () => useContext(CartContext);