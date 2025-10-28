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
        localStorage.setItem("token", result.data.token ?? "");
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
  };

  const features = [
    { icon: Car, text: "Hàng ngàn xe điện chất lượng" },
    { icon: Battery, text: "Pin được kiểm định kỹ càng" },
    { icon: Shield, text: "Giao dịch an toàn bảo mật" },
    { icon: CheckCircle, text: "Hỗ trợ 24/7" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-20px, 20px) rotate(180deg); }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <Box
        className="!min-h-screen !flex !items-center !py-8"
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={24}
            className="!flex !rounded-3xl !overflow-hidden !min-h-[600px] !bg-white/98 !backdrop-blur-lg"
          >
            <Box
              className="!flex-1 !bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-12 !hidden md:!flex !flex-col !justify-center !text-white !relative !overflow-hidden"
              sx={{
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
              }}
            >
              <Box className="!relative !z-10">
                <Box className="!flex !items-center !mb-8">
                  <Box className="!bg-white/20 !p-4 !rounded-2xl !backdrop-blur-lg">
                    <Zap size={40} />
                  </Box>
                  <Typography variant="h4" className="!ml-4 !font-bold">
                    SecondHandEV
                  </Typography>
                </Box>

                <Typography variant="h5" className="!mb-6 !font-semibold">
                  Nền tảng giao dịch xe điện & pin hàng đầu
                </Typography>

                <Typography
                  variant="body1"
                  className="!mb-8 !opacity-90 !leading-relaxed"
                >
                  Tham gia cùng hàng ngàn người dùng đã tin tưởng EVMarket để
                  mua bán xe điện và pin một cách an toàn, nhanh chóng.
                </Typography>

                {/* Features List */}
                <Box className="!mt-12">
                  {features.map((feature, index) => (
                    <Box
                      key={index}
                      className="!flex !items-center !mb-6"
                      sx={{
                        animation: `slideInLeft 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <Box className="!bg-white/20 !p-3 !rounded-xl !flex !mr-4">
                        <feature.icon size={24} />
                      </Box>
                      <Typography className="!text-base">
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box className="!mt-12 !p-6 !bg-white/10 !rounded-xl !backdrop-blur-lg !border !border-white/20">
                  <Typography variant="h6" className="!mb-2 !font-bold">
                    2,500+ xe điện
                  </Typography>
                  <Typography variant="body2" className="!opacity-90">
                    Được giao dịch thành công mỗi tháng
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="!flex-1 !p-8 md:!p-12 !flex !flex-col !justify-center">
              <Box className="!flex md:!hidden !items-center !justify-center !mb-8">
                <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-3 !rounded-xl">
                  <Zap className="!text-white" size={32} />
                </Box>
                <Typography
                  variant="h5"
                  className="!ml-4 !font-bold !bg-gradient-to-r !from-emerald-500 !to-blue-600 !bg-clip-text !text-transparent"
                >
                  SecondHandEV
                </Typography>
              </Box>

              <Typography
                variant="h4"
                className="!mb-2 !font-bold !text-slate-900 !text-center"
              >
                Chào mừng trở lại
              </Typography>

              <Typography
                variant="body2"
                className="!mb-8 !text-slate-600 !text-center"
              >
                Đăng nhập để tiếp tục sử dụng dịch vụ
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  className="!mb-6"
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  className="!mb-6"
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
                  className="!mb-6"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} className="!text-slate-500" />
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
                  className="!mb-4"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} className="!text-slate-500" />
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

                <Box className="!flex !justify-end !mb-6">
                  <MuiLink
                    href="#"
                    underline="hover"
                    className="!text-emerald-600 !text-sm !font-medium"
                  >
                    Quên mật khẩu?
                  </MuiLink>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loginMutation.isPending}
                  endIcon={<ArrowRight size={20} />}
                  className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !py-3 !text-base !font-semibold !normal-case !shadow-xl hover:!shadow-2xl hover:!-translate-y-0.5 !transition-all !duration-300"
                >
                  {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <Divider className="!my-6">
                  <Typography variant="body2" className="!text-slate-500">
                    HOẶC
                  </Typography>
                </Divider>

                <Box className="!text-center">
                  <Typography variant="body2" className="!text-slate-600">
                    Chưa có tài khoản?{" "}
                    <MuiLink
                      href="/auth/register"
                      className="!text-emerald-600 !font-semibold !no-underline hover:!underline"
                    >
                      Đăng ký ngay
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
