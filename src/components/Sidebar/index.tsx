import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  IconButton,
  Badge,
} from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Car,
  Battery,
  ShoppingCart,
  Settings,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Zap,
  Search,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: MenuItem[];
}

const AdminSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      id: "users",
      label: "Quản lý người dùng",
      icon: <Users size={20} />,
      path: "/admin/users",
      children: [
        {
          id: "all-users",
          label: "Tất cả người dùng",
          icon: <Users size={18} />,
          path: "/admin/users/all",
        },
        {
          id: "members",
          label: "Thành viên",
          icon: <Users size={18} />,
          path: "/admin/users/members",
        },
        {
          id: "sellers",
          label: "Người bán",
          icon: <Users size={18} />,
          path: "/admin/users/sellers",
        },
      ],
    },
    {
      id: "vehicles",
      label: "Quản lý xe điện",
      icon: <Car size={20} />,
      path: "/admin/vehicles",
      children: [
        {
          id: "all-vehicles",
          label: "Tất cả xe",
          icon: <Car size={18} />,
          path: "/admin/vehicles/all",
        },
        {
          id: "pending",
          label: "Chờ duyệt",
          icon: <Car size={18} />,
          path: "/admin/vehicles/pending",
          badge: 8,
        },
        {
          id: "approved",
          label: "Đã duyệt",
          icon: <Car size={18} />,
          path: "/admin/vehicles/approved",
        },
      ],
    },
    {
      id: "batteries",
      label: "Quản lý pin",
      icon: <Battery size={20} />,
      path: "/admin/batteries",
      children: [
        {
          id: "all-batteries",
          label: "Tất cả pin",
          icon: <Battery size={18} />,
          path: "/admin/batteries/all",
        },
        {
          id: "battery-pending",
          label: "Chờ duyệt",
          icon: <Battery size={18} />,
          path: "/admin/batteries/pending",
          badge: 3,
        },
      ],
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: <ShoppingCart size={20} />,
      path: "/admin/orders",
      badge: 23,
    },
    {
      id: "reports",
      label: "Báo cáo thống kê",
      icon: <BarChart3 size={20} />,
      path: "/admin/reports",
      children: [
        {
          id: "revenue",
          label: "Doanh thu",
          icon: <BarChart3 size={18} />,
          path: "/admin/reports/revenue",
        },
        {
          id: "transactions",
          label: "Giao dịch",
          icon: <FileText size={18} />,
          path: "/admin/reports/transactions",
        },
      ],
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  const handleItemClick = (id: string, hasChildren: boolean) => {
    setActiveItem(id);

    if (hasChildren) {
      setExpandedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const isExpanded = (id: string) => expandedItems.includes(id);
  const isActive = (id: string) => activeItem === id;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <Typography className="text-white font-bold text-lg">
                EVMarket
              </Typography>
              <Typography className="text-emerald-400 text-xs">
                Admin Panel
              </Typography>
            </div>
          </div>
          <IconButton
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white"
            sx={{ color: "white" }}
          >
            <X size={20} />
          </IconButton>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <List sx={{ py: 0 }}>
          {menuItems.map((item) => (
            <div key={item.id}>
              <ListItemButton
                onClick={() => handleItemClick(item.id, !!item.children)}
                className={`
                  rounded-xl mb-1 transition-all duration-200
                  ${
                    isActive(item.id)
                      ? "bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg"
                      : "hover:bg-slate-800"
                  }
                `}
                sx={{
                  px: 2,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: isActive(item.id)
                      ? undefined
                      : "rgba(30, 41, 59, 0.8)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.id) ? "white" : "#94a3b8",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.875rem",
                      fontWeight: isActive(item.id) ? 600 : 500,
                      color: isActive(item.id) ? "white" : "#cbd5e1",
                    },
                  }}
                />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: isActive(item.id)
                          ? "white"
                          : "#10b981",
                        color: isActive(item.id) ? "#10b981" : "white",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        minWidth: 20,
                        height: 20,
                      },
                    }}
                  />
                )}
                {item.children &&
                  (isExpanded(item.id) ? (
                    <ChevronDown
                      size={18}
                      className={
                        isActive(item.id) ? "text-white" : "text-slate-400"
                      }
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className={
                        isActive(item.id) ? "text-white" : "text-slate-400"
                      }
                    />
                  ))}
              </ListItemButton>

              {item.children && (
                <Collapse in={isExpanded(item.id)} timeout="auto" unmountOnExit>
                  <List sx={{ py: 0, pl: 2 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.id}
                        onClick={() => setActiveItem(child.id)}
                        className={`
                          rounded-lg mb-1 ml-4 transition-all duration-200
                          ${
                            isActive(child.id)
                              ? "bg-emerald-500/20 border-l-4 border-emerald-500"
                              : "hover:bg-slate-800 border-l-4 border-transparent"
                          }
                        `}
                        sx={{
                          px: 2,
                          py: 1,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: isActive(child.id) ? "#10b981" : "#94a3b8",
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: "0.8125rem",
                              fontWeight: isActive(child.id) ? 600 : 400,
                              color: isActive(child.id) ? "#10b981" : "#cbd5e1",
                            },
                          }}
                        />
                        {child.badge && (
                          <Badge
                            badgeContent={child.badge}
                            sx={{
                              "& .MuiBadge-badge": {
                                backgroundColor: "#10b981",
                                color: "white",
                                fontSize: "0.625rem",
                                fontWeight: 700,
                                minWidth: 18,
                                height: 18,
                              },
                            }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              fontWeight: 700,
            }}
          >
            A
          </Avatar>
          <div className="flex-1 min-w-0">
            <Typography className="text-white font-semibold text-sm truncate">
              Admin User
            </Typography>
            <Typography className="text-slate-400 text-xs truncate">
              admin@evmarket.com
            </Typography>
          </div>
          <IconButton size="small" sx={{ color: "#94a3b8" }}>
            <Settings size={18} />
          </IconButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <IconButton
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50"
        sx={{
          display: { lg: "none" },
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          color: "white",
          width: 48,
          height: 48,
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
            boxShadow: "0 6px 16px rgba(16, 185, 129, 0.5)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <Menu size={24} />
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

export default AdminSidebar;
