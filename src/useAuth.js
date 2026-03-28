// src/useAuth.js
// Custom hook extracted from Auth_Context.jsx to satisfy Fast Refresh
// (a file must export only components OR only non-component exports).
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => useContext(AuthContext);