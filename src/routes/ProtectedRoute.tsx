import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";

interface JwtPayloadWithRole extends JwtPayload {
  Role?: string;
}

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = "/auth/login",
}) => {
  const { isAuthenticated, profile } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const decodeToken = jwtDecode<JwtPayloadWithRole>(token!);
  const role = decodeToken.Role!;

  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập !!!");
    return <Navigate to={redirectPath} replace />;
  }

  if (profile && !allowedRoles.includes(role)) {
    redirectPath = role === "Admin" ? "/admin/users" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
