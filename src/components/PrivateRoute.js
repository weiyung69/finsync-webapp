import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // 如果没有登入，跳转到 login 页面，并保存当前路径
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
