import { useRoutes } from "react-router-dom";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/home";

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
  ]);
  return routeElements;
};

export default RouteElements;
