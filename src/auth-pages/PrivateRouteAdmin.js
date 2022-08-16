import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRouteAdmin({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser.admin) {
    return <Navigate to="/login-admin"></Navigate>;
  }

  return children;
}
