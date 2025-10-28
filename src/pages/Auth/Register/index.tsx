/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Calendar,
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
  Grid,
} from "@mui/material";
import { RegisterRequest } from "src/types/auth.type";
import { useRegisterMutation } from "src/queries/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: { main: "#10b981" },
    secondary: { main: "#2563eb" },
  },
});

interface FormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    phone: "",
    fullName: "",
    address: "",
    dateOfBirth: "",
    role: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (registerMutation.isPending) return;
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !registerData.email ||
      !registerData.password ||
      !registerData.displayName
    ) {
      setError(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Email, Mật khẩu, Tên hiển thị)"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (registerData.phone) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;
      if (!phoneRegex.test(registerData.phone)) {
        setError("Số điện thoại không hợp lệ (VD: 0901234567)");
        return;
      }
    }

    const { confirmPassword, ...apiData } = registerData;

    try {
      const registerResponse = await registerMutation.mutateAsync(apiData);
      if (registerResponse?.data) {
        toast.success("Đăng ký thành công!!!", {
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#4BB543",
            color: "#fff",
            fontWeight: "500",
          },
        });
        setSuccess("Đăng ký thành công! Chuyển đến trang đăng nhập...");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
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
            className="!flex !rounded-3xl !overflow-hidden !min-h-[700px] !bg-white/98 !backdrop-blur-lg"
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

            <Box className="!flex-1 !p-6 md:!p-8 !flex !flex-col !justify-center !max-h-screen !overflow-y-auto">
              <Box className="!flex md:!hidden !items-center !justify-center !mb-6">
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
                Tạo tài khoản mới
              </Typography>

              <Typography
                variant="body2"
                className="!mb-6 !text-slate-600 !text-center"
              >
                Đăng ký để bắt đầu giao dịch
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  className="!mb-4"
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  className="!mb-4"
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Tên hiển thị"
                      name="displayName"
                      value={registerData.displayName}
                      onChange={handleChange}
                      placeholder="VD: iEm Bình Nè"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={registerData.fullName}
                      onChange={handleChange}
                      placeholder="VD: Nguyễn Văn A"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={registerData.address}
                      onChange={handleChange}
                      placeholder="VD: 123 Đường ABC, Quận XYZ"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapPin size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      name="dateOfBirth"
                      type="date"
                      value={registerData.dateOfBirth}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Calendar size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Mật khẩu"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 6 ký tự"
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
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} className="!text-slate-500" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={registerMutation.isPending}
                  endIcon={<ArrowRight size={20} />}
                  className="!mt-6 !bg-gradient-to-r !from-emerald-500 !to-blue-600 !py-3 !text-base !font-semibold !normal-case !shadow-xl hover:!shadow-2xl hover:!-translate-y-0.5 !transition-all !duration-300"
                >
                  {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                </Button>

                <Divider className="!my-6">
                  <Typography variant="body2" className="!text-slate-500">
                    HOẶC
                  </Typography>
                </Divider>

                <Box className="!text-center">
                  <Typography variant="body2" className="!text-slate-600">
                    Đã có tài khoản?{" "}
                    <MuiLink
                      href="/auth/login"
                      className="!text-emerald-600 !font-semibold !no-underline hover:!underline"
                    >
                      Đăng nhập
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

export default RegisterPage;
