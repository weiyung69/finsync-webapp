import React from "react";
import { Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

function ProtectedRoute({ children }) {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;