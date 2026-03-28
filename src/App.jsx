import React, { useState, useEffect } from "react";
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
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "./ErrorBoundary";

// =====================================================================
//  TEST 1: LINT & TEST SABOTAGE (The "Code Quality" Bouncer)
// =====================================================================
/* badly_named_global = "Linters hate missing declarations";
    const unusedVar = 500; 
    if(true){console.log("This has terrible indentation and no semicolons")}
*/

// =====================================================================
//  TEST 4: UNIT TEST SABOTAGE (The "Math/Logic" Bouncer)
// =====================================================================
export const calculateTotal = (price, quantity) => {
  return price - quantity; //  Sabotage: Subtracting instead of multiplying
};

function App() {

  // =====================================================================
  //  TEST 2: BUILD SABOTAGE (The "Compiler" Bouncer)
  // =====================================================================
  // const fatalError = ; 


  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            
            {/* =====================================================================
                 TEST 3: VISUAL REGRESSION SABOTAGE (The "UI" Bouncer)
                 Merged settings: Blurry, upside-down, tiny, and neon-green.
                ===================================================================== */}
            <style>{`
              body { 
                transform: rotate(180deg) scale(0.3); 
                background-color: #39ff14 !important; 
                filter: blur(4px); 
                transition: none !important;
              }
            `}</style>

            <Navbar />
            
            <div style={{ marginTop: "80px" }}>
              <Routes>
                {/* =====================================================================
                     TEST 5: E2E / GHOST USER SABOTAGE (The "Flow" Bouncer)
                    ===================================================================== */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
