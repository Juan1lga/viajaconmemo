import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children, redirectPath = "/admin-login" }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  try {
    const decoded = jwtDecode(token);
    const user = decoded.user || decoded;
    if (!user || !user.isAdmin) {
      return <Navigate to={redirectPath} replace />;
    }
  } catch (error) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default AdminRoute;