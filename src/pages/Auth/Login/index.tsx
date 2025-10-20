import React, { useContext, useState } from "react";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Car,
  Battery,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link as MuiLink,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { LoginRequest } from "src/types/auth.type";
import { useLoginMutation } from "src/queries/useAuth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981",
    },
    secondary: {
      main: "#2563eb",
    },
  },
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (loginMutation.isPending) return;
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.email || !loginData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      const result = await loginMutation.mutateAsync(loginData);
      if (result?.data) {
        setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
        setIsAuthenticated(true);
        setProfile(result?.data?.member ?? null);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Tài khoản và mật khẩu không đúng!");
      }
    } catch (error) {
      console.log(error);
      setError("Đăng nhập thất bại!");
    }

    console.log("Login data:", loginData);
  };

  const features = [
    { icon: Car, text: "Hàng ngàn xe điện chất lượng" },
    { icon: Battery, text: "Pin được kiểm định kỹ càng" },
    { icon: Shield, text: "Giao dịch an toàn bảo mật" },
    { icon: CheckCircle, text: "Hỗ trợ 24/7" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
          display: "flex",
          alignItems: "center",
          py: 4,
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={24}
            sx={{
              display: "flex",
              borderRadius: 4,
              overflow: "hidden",
              minHeight: "600px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #10b981 0%, #2563eb 100%)",
                p: 6,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "center",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  animation: "float 20s ease-in-out infinite",
                },
                "@keyframes float": {
                  "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
                  "50%": { transform: "translate(-20px, 20px) rotate(180deg)" },
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.2)",
                      p: 2,
                      borderRadius: 3,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Zap size={40} />
                  </Box>
                  <Typography variant="h4" sx={{ ml: 2, fontWeight: 700 }}>
                    EVMarket
                  </Typography>
                </Box>

                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Nền tảng giao dịch xe điện & pin hàng đầu
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.8 }}
                >
                  Tham gia cùng hàng ngàn người dùng đã tin tưởng EVMarket để
                  mua bán xe điện và pin một cách an toàn, nhanh chóng.
                </Typography>

                <Box sx={{ mt: 6 }}>
                  {features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        animation: `slideInLeft 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                        "@keyframes slideInLeft": {
                          from: {
                            opacity: 0,
                            transform: "translateX(-30px)",
                          },
                          to: {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background: "rgba(255, 255, 255, 0.2)",
                          p: 1.5,
                          borderRadius: 2,
                          display: "flex",
                          mr: 2,
                        }}
                      >
                        <feature.icon size={24} />
                      </Box>
                      <Typography>{feature.text}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 6,
                    p: 3,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    2,500+ xe điện
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Được giao dịch thành công mỗi tháng
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #2563eb 100%)",
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Zap color="white" size={32} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    ml: 2,
                    fontWeight: 700,
                    background: "linear-gradient(to right, #10b981, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  EVMarket
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  color: "#1e293b",
                  textAlign: "center",
                }}
              >
                Chào mừng trở lại
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  color: "#64748b",
                  textAlign: "center",
                }}
              >
                Đăng nhập để tiếp tục sử dụng dịch vụ
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 3 }}
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color="#64748b" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#64748b" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}
                >
                  <MuiLink
                    href="#"
                    underline="hover"
                    sx={{
                      color: "#10b981",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Quên mật khẩu?
                  </MuiLink>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    background: "linear-gradient(to right, #10b981, #2563eb)",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                    "&:hover": {
                      boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Đăng nhập
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    HOẶC
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có tài khoản?{" "}
                    <MuiLink
                      href="/auth/register"
                      sx={{
                        color: "#10b981",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Đăng ký ngay
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 4,
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            © 2025 EVMarket. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
