import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSidebar from "src/components/Sidebar";

const AdminLayout: React.FC = () => {
  return (
    <Box className="min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <Box
        component="main"
        className="p-6 overflow-auto"
        sx={{
          ml: { xs: 0, lg: "300px" },
          minHeight: "100vh",
          pt: { xs: "80px", lg: "24px" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
