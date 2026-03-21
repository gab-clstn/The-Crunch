import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { AuthProvider } from "./Auth_Context";  
import { CartProvider } from "./Cart_Context";  
import Navbar from "./Nav_Bar";                 
import Home from "./Home";                      
import Menu from "./Menu";                      
import Auth from "./Auth";                      
import Cart from "./Cart";                      

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