import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { AuthProvider } from "./context/Auth_Context";
import { CartProvider } from "./context/Cart_Context";
import Navbar from "./components/common/Nav_Bar";
import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Auth from "./pages/customer/Auth";
import Cart from "./pages/customer/Cart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router> 
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;