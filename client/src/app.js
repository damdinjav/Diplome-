import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/user-dashboard" element={
          <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute role="user"><ProductDetail /></ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;