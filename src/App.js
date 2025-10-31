import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import OrderSuccessPage from './pages/OrderSuccessPage'; // 👈 1. NEW IMPORT

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      
      {/* Main E-Commerce Flow */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      
      
      <Route path="/order-success" element={<OrderSuccessPage />} /> 
    </Routes>
  );
}

export default App;