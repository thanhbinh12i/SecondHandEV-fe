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
  const menuItems = [
    { label: "Mua xe", path: "/e-bikes" },
    { label: "Mua pin", path: "/batteries" },
    { label: "Về chúng tôi", path: "/" },
    { label: "Liên hệ", path: "/" },
  ];
  const { isAuthenticated } = useContext(AppContext);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="sticky"
          elevation={trigger ? 4 : 1}
          className={`!backdrop-blur-xl !transition-all !duration-300 !border-b !border-slate-200/50 ${
            trigger ? "!bg-white/98" : "!bg-white/85"
          }`}
        >
          <Container maxWidth="xl">
            <Toolbar className="!justify-between !px-0">
              <Box
                onClick={() => handleNavigate("/")}
                className="!flex !items-center !gap-2 !cursor-pointer hover:!scale-105 !transition-transform !duration-300"
              >
                <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-3 !rounded-xl !flex !shadow-lg">
                  <Zap className="!text-white" size={24} />
                </Box>
                <Typography
                  variant="h6"
                  className="!font-bold !bg-gradient-to-r !from-emerald-600 !to-blue-600 !bg-clip-text !text-transparent"
                >
                  SecondHandEV
                </Typography>
              </Box>

              <Box className="!hidden md:!flex !gap-8">
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className="!text-slate-700 !font-medium !relative hover:!text-emerald-600 hover:!bg-transparent hover:!-translate-y-0.5 !transition-all !duration-300 after:!content-[''] after:!absolute after:!bottom-0 after:!left-1/2 after:!-translate-x-1/2 after:!w-0 after:!h-0.5 after:!bg-emerald-600 after:!transition-all after:!duration-300 hover:after:!w-4/5"
                    sx={{
                      animation: `fadeInDown 0.5s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box className="!hidden md:!flex !items-center !gap-3">
                {isAuthenticated ? (
                  <>
                    <UserDropdown />
                    <Button
                      onClick={() => handleNavigate("/post")}
                      variant="contained"
                      className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !font-semibold !px-6 !py-2 !rounded-xl !relative !overflow-hidden hover:!shadow-xl hover:!-translate-y-0.5 !transition-all !duration-300"
                      sx={{
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(to right, #2563eb, #10b981)",
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
                  </>
                ) : (
                  <Button
                    onClick={() => handleNavigate("/auth/login")}
                    variant="contained"
                    className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !font-semibold !px-6 !py-2 !rounded-xl !relative !overflow-hidden hover:!shadow-xl hover:!-translate-y-0.5 !transition-all !duration-300"
                    sx={{
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(to right, #2563eb, #10b981)",
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
                    <span>Đăng nhập</span>
                  </Button>
                )}
              </Box>

              {/* Mobile Menu Button */}
              <IconButton
                className="!block md:!hidden !text-slate-700 hover:!rotate-90 hover:!text-emerald-600 !transition-all !duration-300"
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
        PaperProps={{
          className: "!w-80",
        }}
      >
        <Box className="!p-4">
          <Box className="!flex !justify-between !items-center !mb-4">
            <Typography variant="h6" className="!font-bold !text-emerald-600">
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileOpen(false)}
              className="!text-slate-700 hover:!rotate-90 hover:!text-emerald-600 !transition-all !duration-300"
            >
              <X size={24} />
            </IconButton>
          </Box>

          <Divider className="!mb-4" />

          <List className="!space-y-2">
            {menuItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  handleNavigate(item.path);
                  setMobileOpen(false);
                }}
                className="!rounded-xl !mb-2 hover:!bg-emerald-50 hover:!translate-x-2 !transition-all !duration-300"
                sx={{
                  animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    className: "!font-medium !text-slate-700",
                  }}
                />
              </ListItemButton>
            ))}

            <Divider className="!my-4" />

            {isAuthenticated ? (
              <>
                <Box className="!mb-3">
                  <UserDropdown />
                </Box>
                <ListItemButton
                  onClick={() => handleNavigate("/post")}
                  className="!rounded-xl !bg-emerald-50 hover:!bg-emerald-100 hover:!translate-x-2 !transition-all !duration-300 !mt-4"
                >
                  <ListItemText
                    primary="Đăng tin"
                    primaryTypographyProps={{
                      className: "!font-semibold !text-emerald-600",
                    }}
                  />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                onClick={() => handleNavigate("/auth/login")}
                className="!rounded-xl !bg-emerald-50 hover:!bg-emerald-100 hover:!translate-x-2 !transition-all !duration-300"
              >
                <ListItemText
                  primary="Đăng nhập"
                  primaryTypographyProps={{
                    className: "!font-semibold !text-emerald-600",
                  }}
                />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
