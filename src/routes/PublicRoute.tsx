import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";

interface JwtPayloadWithRole extends JwtPayload {
  Role?: string;
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const decodeToken = jwtDecode<JwtPayloadWithRole>(token!);
  const role = decodeToken.Role!;

  if (isAuthenticated) {
    if (role === "Admin") return <Navigate to="/admin/users" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
