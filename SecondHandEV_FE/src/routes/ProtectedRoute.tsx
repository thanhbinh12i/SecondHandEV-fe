import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = "/auth/login",
}) => {
  const { isAuthenticated, profile } = useContext(AppContext);
  const role = profile?.role;

  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập !!!");
    return <Navigate to={redirectPath} replace />;
  }

  if (profile && !allowedRoles.includes(role!)) {
    redirectPath = role === "Admin" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
