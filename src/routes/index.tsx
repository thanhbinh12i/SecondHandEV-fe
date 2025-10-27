import { useRoutes } from "react-router-dom";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/Client/home";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import AuthLayout from "src/layouts/AuthLayout";
import AdminLayout from "src/layouts/AdminLayout";

const RouteElements: React.FC = () => {
  const routeElements = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
    {
      path: "auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "admin",
      element: <AdminLayout />,
      children: [],
    },
  ]);
  return routeElements;
};

export default RouteElements;
