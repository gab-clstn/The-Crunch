// useAuth.js — custom hook only (no component exports).
// Import from here instead of Auth_Context.jsx wherever you need useAuth().
import { useContext } from "react";
import { AuthContext } from "./Auth_Context";

export const useAuth = () => useContext(AuthContext);