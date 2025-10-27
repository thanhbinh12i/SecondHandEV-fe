import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSidebar from "src/components/Sidebar";

const AdminLayout: React.FC = () => {
  return (
    <Box className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <Box
        component="main"
        className="flex-1 p-6 overflow-auto"
        sx={{
          width: { lg: "calc(100% - 280px)" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
