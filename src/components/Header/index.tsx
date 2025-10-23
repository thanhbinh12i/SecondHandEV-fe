import React, { useContext, useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Typography,
  Divider,
  useScrollTrigger,
  Slide,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";
import UserDropdown from "../UserDropdown";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger();
  const navigate = useNavigate();
  const menuItems = ["Mua xe", "Mua pin", "Về chúng tôi", "Liên hệ"];
  const { isAuthenticated } = useContext(AppContext);

  console.log(isAuthenticated);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };
  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="sticky"
          elevation={trigger ? 4 : 1}
          sx={{
            bgcolor: trigger
              ? "rgba(255, 255, 255, 0.98)"
              : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            transition: "all 0.3s ease-in-out",
            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #2563eb 100%)",
                    p: 1.5,
                    borderRadius: 2,
                    display: "flex",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Zap color="white" size={24} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(to right, #059669, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  SecondHandEV
                </Typography>
              </Box>

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                {menuItems.map((item, index) => (
                  <Button
                    key={item}
                    sx={{
                      color: "#334155",
                      fontWeight: 500,
                      position: "relative",
                      animation: `fadeInDown 0.5s ease-out ${
                        index * 0.1
                      }s both`,
                      "&:hover": {
                        color: "#059669",
                        bgcolor: "transparent",
                        transform: "translateY(-2px)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: "2px",
                        bgcolor: "#059669",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "80%",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>

              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {isAuthenticated ? (
                  <>
                    <UserDropdown />
                  </>
                ) : (
                  <Button
                    onClick={() => handleNavigate("/auth/login")}
                    sx={{
                      color: "#334155",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#059669",
                        bgcolor: "transparent",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #10b981, #2563eb)",
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                      transform: "translateY(-1px)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(to right, #2563eb, #10b981)",
                      transition: "left 0.5s ease",
                    },
                    "&:hover::before": {
                      left: 0,
                    },
                    "& > span": {
                      position: "relative",
                      zIndex: 1,
                    },
                  }}
                >
                  <span>Đăng tin</span>
                </Button>
              </Box>

              <IconButton
                sx={{
                  display: { md: "none" },
                  color: "#334155",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "rotate(90deg)",
                    color: "#059669",
                  },
                }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={24} />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#059669" }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "#334155" }}
            >
              <X size={24} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItemButton
                key={item}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
                  "&:hover": {
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    transform: "translateX(8px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 2 }} />
            {isAuthenticated ? (
              <>
                <UserDropdown />
              </>
            ) : (
              <>
                <ListItemButton
                  onClick={() => handleNavigate("/auth/login")}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      transform: "translateX(8px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <ListItemText primary="Đăng nhập" />
                </ListItemButton>
              </>
            )}

            <ListItemButton
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(16, 185, 129, 0.1)",
                "&:hover": {
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  transform: "translateX(8px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <ListItemText primary="Đăng tin" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
