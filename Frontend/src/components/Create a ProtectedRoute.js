import React from 'react';
import { Navigate } from 'react-router-dom';

// Higher-order component to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('tokenExpiry');
  
  if (!token) {
    // If no token found, redirect to login
    return <Navigate to="/" replace />;
  }

  // If token exists, allow access to the protected route
  return children;
};

export default ProtectedRoute;
