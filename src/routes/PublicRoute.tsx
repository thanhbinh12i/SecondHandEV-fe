import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, profile } = useContext(AppContext);
  const role = profile?.role;

  if (isAuthenticated) {
    if (role === "Admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
