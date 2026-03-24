import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth_Context";
import { CartProvider } from "./Cart_Context";
import Navbar from "./Nav_Bar";
import Home from "./Home";
import Menu from "./Menu";
import MyOrders from "./MyOrders";
import Auth from "./Auth";
import Cart from "./Cart";
import AdminPanel from "./Admin_Panel";
import OrderSuccess from "./OrderSuccess";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div style={{ marginTop: "80px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;