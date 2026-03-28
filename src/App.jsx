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
// 🚨 TEST 1: LINT & TEST SABOTAGE (The "Code Quality" Bouncer)
// Purpose: Fails the "Lint" step by using messy, non-standard code.
// =====================================================================
/* badly_named_global = "Linters hate missing declarations";
    const unusedVar = 500; 
    if(true){console.log("This has terrible indentation and no semicolons")}
*/

// =====================================================================
// 🚨 TEST 4: UNIT TEST SABOTAGE (The "Math/Logic" Bouncer)
// Purpose: The code looks fine and runs, but the MATH is wrong. 
// If you have a test file checking cart totals, this will fail it.
// =====================================================================
/*
export const calculateTotal = (price, quantity) => {
  return price - quantity; // ❌ Sabotage: Subtracting instead of multiplying
};
*/

function App() {

  // =====================================================================
  // 🚨 TEST 2: BUILD SABOTAGE (The "Compiler" Bouncer)
  // Purpose: This is invalid JavaScript. Vite/Webpack will CRASH here.
  // =====================================================================
  // const fatalError = ; 


  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            
            {/* =====================================================================
                🚨 TEST 3: VISUAL REGRESSION SABOTAGE (The "UI" Bouncer)
                Purpose: Passes Lint and Build, but flips the UI upside down.
                The automated screenshot comparison will fail immediately.
                ===================================================================== */}
           <style>{`body { transform: rotate(180deg); filter: invert(100%); background: black !important; }`}</style>

            <Navbar />
            
            <div style={{ marginTop: "80px" }}>
              <Routes>
                {/* =====================================================================
                    🚨 TEST 5: E2E / GHOST USER SABOTAGE (The "Flow" Bouncer)
                    Purpose: If you change a Path or an ID, the automated bot
                    (Cypress/Playwright) won't find the page, causing a failure.
                    ===================================================================== */}
                {/* <Route path="/broken-link-test" element={<Home />} /> */}

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
