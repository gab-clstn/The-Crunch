// src/AuthContext.js
// Isolated context so Auth_Context.jsx exports ONLY a component (Fast Refresh requirement).
import { createContext } from "react";

export const AuthContext = createContext();