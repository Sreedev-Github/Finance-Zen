import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth() || {}; // Ensure a default object if useAuth() returns null or undefined
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location, alertMessage: 'Please login to your account' }} />;
  }

  return children;
};

export default ProtectedRoute;
