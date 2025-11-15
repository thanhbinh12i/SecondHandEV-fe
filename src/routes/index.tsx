import { useRoutes } from "react-router-dom";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/Client/home";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import AuthLayout from "src/layouts/AuthLayout";
import AdminLayout from "src/layouts/AdminLayout";
import UserManagement from "src/pages/Admin/User";
import CreateListingPage from "src/pages/Client/postListing";
import MyListingsPage from "src/pages/Client/myListing";
import BatteryListingsPage from "src/pages/Client/BatteryPage";
import EBikeListingsPage from "src/pages/Client/EbikePage";
import EBikeAllPage from "src/pages/Admin/Ebike";
import BatteryAllPage from "src/pages/Admin/Battery";
import Dashboard from "src/pages/Admin/Dashboard";
import ListingDetailPage from "src/pages/Client/ListingDetail";
import AuctionManagementPage from "src/pages/Admin/Auction";
import AuctionsPage from "src/pages/Client/AuctionPage";
import AuctionDetailPage from "src/pages/Client/AuctionDetail";
import CreateAuctionPage from "src/pages/Client/CreateAution";
import MyAuctionsPage from "src/pages/Client/MyAuction";
import OrderPage from "src/pages/Client/OrderPage";
import PaymentResult from "src/pages/Client/PaymentResult";
import MyFavoritesPage from "src/pages/Client/MyFavorite";
import MyOrders from "src/pages/Client/MyOrder";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

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
        {
          path: "post",
          element: <CreateListingPage />,
        },
        {
          path: "batteries",
          element: <BatteryListingsPage />,
        },
        {
          path: "e-bikes",
          element: <EBikeListingsPage />,
        },
        {
          path: "listing/:id",
          element: <ListingDetailPage />,
        },
        {
          path: "auctions",
          element: <AuctionsPage />,
        },
        {
          path: "auctions/:id",
          element: <AuctionDetailPage />,
        },
        {
          element: <ProtectedRoute allowedRoles={["User"]} />,
          children: [
            {
              path: "auctions/create/:id",
              element: <CreateAuctionPage />,
            },
            {
              path: "auctions/create",
              element: <CreateAuctionPage />,
            },
            {
              path: "my-auctions",
              element: <MyAuctionsPage />,
            },
            {
              path: "order/:id",
              element: <OrderPage />,
            },
            {
              path: "payment-result",
              element: <PaymentResult />,
            },
            {
              path: "my-listings",
              element: <MyListingsPage />,
            },
            {
              path: "my-favorites",
              element: <MyFavoritesPage />,
            },
            {
              path: "my-orders",
              element: <MyOrders />,
            },
          ],
        },
      ],
    },
    {
      path: "auth",
      element: (
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      ),
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
      element: <ProtectedRoute allowedRoles={["Admin"]} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "users",
              element: <UserManagement />,
            },
            {
              path: "e-bikes",
              element: <EBikeAllPage />,
            },
            {
              path: "batteries",
              element: <BatteryAllPage />,
            },
            {
              path: "auctions",
              element: <AuctionManagementPage />,
            },
          ],
        },
      ],
    },
  ]);
  return routeElements;
};

export default RouteElements;
