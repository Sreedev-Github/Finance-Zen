import React, { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from '../store/authSlice';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("ProtectedRoute rendered. User state:", user);
    if (user) {
      dispatch(authLogin(user));
      console.log("User found in protected route");
    }
  }, [user, dispatch]);

  if (loading) {
    return <div>Loading...</div>; // or any loading spinner/component
  }

  if (!user) {
    console.log("User not found in protected route");
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, alertMessage: "Please login to your account" }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
