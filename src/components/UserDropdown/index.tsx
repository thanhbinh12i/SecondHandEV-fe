import React, { useState, useContext } from "react";
import {
  Settings,
  LogOut,
  ShoppingBag,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import {
  Box,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Badge,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AppContext } from "src/contexts/app.context";
import { useNavigate } from "react-router-dom";

const UserDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { profile, reset } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      reset();
      handleClose();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      icon: <UserCircle className="w-5 h-5" />,
      label: "Hồ sơ của tôi",
      onClick: () => {
        handleClose();
        //   navigate("/profile");
      },
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Đơn hàng",
      onClick: () => {
        handleClose();
        //   navigate("/orders");
      },
      badge: 3,
    },
    { divider: true },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Cài đặt",
      onClick: () => {
        handleClose();
      },
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: "Đăng xuất",
      onClick: handleLogout,
      danger: true,
    },
  ];

  if (!profile) {
    return null;
  }

  const userName = profile.displayName || "BinhNe";
  const userInitial = getInitials(userName);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-3 px-4 py-1 rounded-xl
          bg-white border-2 border-slate-200
          hover:border-emerald-500 hover:shadow-lg
          transition-all duration-300 ease-in-out cursor-pointer
          ${open ? "border-emerald-500 shadow-lg" : ""}
        `}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#10b981",
              color: "#10b981",
              boxShadow: "0 0 0 2px white",
              width: 12,
              height: 12,
              borderRadius: "50%",
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: '""',
              },
            },
            "@keyframes ripple": {
              "0%": {
                transform: "scale(.8)",
                opacity: 1,
              },
              "100%": {
                transform: "scale(2.4)",
                opacity: 0,
              },
            },
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {userInitial}
          </Avatar>
        </Badge>

        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-cyan-800 truncate max-w-[120px]">
            {userName}
          </span>
          <span className="text-xs text-slate-500">Thành viên</span>
        </div>

        <ChevronDown
          className={`
            w-4 h-4 text-slate-500 transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 280,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            boxShadow: "0 5px 40px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              border: "1px solid #e2e8f0",
              borderBottom: "none",
              borderRight: "none",
              zIndex: 0,
            },
          },
        }}
      >
        <Box className="px-4 py-3 bg-gradient-to-br from-emerald-200 to-blue-100">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "rgba(16, 185, 129, 0.2)",
                color: "#10b981",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              {userInitial}
            </Avatar>
            <div className="flex-1 min-w-0">
              <Typography className="font-bold text-slate-800 truncate">
                {userName}
              </Typography>
              <Typography className="text-xs text-slate-600 truncate">
                {profile.email}
              </Typography>
            </div>
          </div>
        </Box>

        <Divider />

        {menuItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={index} className="my-1" />;
          }

          return (
            <MenuItem
              key={index}
              onClick={item.onClick}
              className={`
                mx-2 my-1 rounded-lg
                ${
                  item.danger
                    ? "hover:bg-emerald-300 text-red-600"
                    : "hover:bg-emerald-300 hover:text-emerald-700"
                }
              `}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                className={item.danger ? "text-red-600" : "text-slate-600"}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium">{item.label}</span>
              </ListItemText>
              {item.badge && (
                <Badge
                  badgeContent={item.badge}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#10b981",
                      color: "white",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      minWidth: 20,
                      height: 20,
                      borderRadius: "10px",
                    },
                  }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default UserDropdown;
