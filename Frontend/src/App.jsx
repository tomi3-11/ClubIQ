"use client";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MemberDashboard from "./pages/MemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";
import { useAuthContext } from "./AuthContext";
import getUserRole from "./util";

function App() {
  const { isAuthenticated, logout } = useAuthContext();

  const { userRole } = getUserRole();

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/member-dashboard'
          element={
            isAuthenticated && userRole === "member" ? (
              <MemberDashboard />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route
          path='/admin-dashboard'
          element={
            isAuthenticated && userRole === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;
