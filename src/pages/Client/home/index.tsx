import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Zap,
  Shield,
  TrendingUp,
  Star,
  ChevronRight,
  Battery,
  Car,
  CheckCircle,
  MessageCircle,
  MapPin,
  Calendar,
  Gauge,
} from "lucide-react";

const HomePage: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const featuredListings = [
    {
      id: 1,
      type: "ev",
      title: "Tesla Model 3 Long Range",
      year: 2022,
      price: "850,000,000",
      battery: 95,
      km: 25000,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format",
      location: "TP. Hồ Chí Minh",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      type: "battery",
      title: "Pin LFP 60kWh - VinFast VF8",
      capacity: "60kWh",
      health: 92,
      price: "180,000,000",
      cycles: 450,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop&auto=format",
      location: "Hà Nội",
      verified: true,
    },
    {
      id: 3,
      type: "ev",
      title: "VinFast VF e34",
      year: 2023,
      price: "450,000,000",
      battery: 88,
      km: 12000,
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format",
      location: "Đà Nẵng",
      verified: true,
    },
    {
      id: 4,
      type: "ev",
      title: "Hyundai Kona Electric",
      year: 2021,
      price: "620,000,000",
      battery: 90,
      km: 35000,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format",
      location: "TP. Hồ Chí Minh",
      verified: false,
    },
  ];

  const stats = [
    { icon: Car, value: "2,500+", label: "Xe điện đang bán" },
    { icon: Battery, value: "850+", label: "Pin có sẵn" },
    { icon: CheckCircle, value: "1,200+", label: "Giao dịch thành công" },
    { icon: Star, value: "4.8/5", label: "Đánh giá trung bình" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Kiểm định chất lượng",
      description:
        "Mọi xe và pin đều được kiểm tra kỹ thuật trước khi đăng bán",
    },
    {
      icon: TrendingUp,
      title: "AI định giá thông minh",
      description: "Hệ thống AI gợi ý giá dựa trên dữ liệu thị trường thực tế",
    },
    {
      icon: Zap,
      title: "Giao dịch nhanh chóng",
      description: "Thanh toán an toàn, ký hợp đồng số hóa trong vài phút",
    },
    {
      icon: MessageCircle,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc",
    },
  ];

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-blue-50 !to-emerald-50">
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

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-on-scroll {
            opacity: 0;
            transition: all 0.6s ease-out;
          }

          .animate-on-scroll.visible {
            opacity: 1;
          }

          .slide-up.visible {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .slide-left.visible {
            animation: fadeInLeft 0.8s ease-out forwards;
          }

          .slide-right.visible {
            animation: fadeInRight 0.8s ease-out forwards;
          }

          .scale-in.visible {
            animation: scaleIn 0.8s ease-out forwards;
          }
        `}
      </style>

      <Box className="!relative !overflow-hidden !pt-20 !pb-20">
        <Container maxWidth="lg">
          <Box
            className="!text-center !mb-12"
            sx={{ animation: "fadeInDown 0.8s ease-out" }}
          >
            <Typography
              variant="h3"
              className="!text-5xl md:!text-6xl !font-bold !mb-6 !bg-gradient-to-r !from-slate-900 !via-emerald-700 !to-blue-700 !bg-clip-text !text-transparent"
            >
              Nền tảng giao dịch
              <br />
              Xe điện & Pin hàng đầu
            </Typography>
            <Typography
              variant="h6"
              className="!text-slate-600 !max-w-2xl !mx-auto !text-center"
            >
              Mua bán xe điện và pin đã qua sử dụng an toàn, nhanh chóng với
              công nghệ AI định giá thông minh
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box
        id="stats"
        data-animate
        className={`!py-12 !bg-white/50 !backdrop-blur-sm animate-on-scroll slide-up ${
          visibleSections["stats"] ? "visible" : ""
        }`}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  className="!text-center"
                  sx={{
                    animation: visibleSections["stats"]
                      ? `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      : "none",
                  }}
                >
                  <Box className="!inline-flex !items-center !justify-center !w-16 !h-16 !bg-gradient-to-br !from-emerald-500 !to-blue-600 !rounded-2xl !mb-4 !shadow-lg hover:!scale-110 !transition-transform">
                    <stat.icon className="!text-white" size={28} />
                  </Box>
                  <Typography
                    variant="h4"
                    className="!font-bold !text-slate-900 !mb-1"
                  >
                    {stat.value}
                  </Typography>
                  <Typography className="!text-slate-600">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="listings" data-animate className="!py-20">
        <Container maxWidth="lg">
          <Box
            className={`!flex !justify-between !items-center !mb-12 animate-on-scroll slide-up ${
              visibleSections["listings"] ? "visible" : ""
            }`}
          >
            <Box>
              <Typography
                variant="h3"
                className="!font-bold !text-slate-900 !mb-2"
              >
                Tin đăng nổi bật
              </Typography>
              <Typography className="!text-slate-600">
                Các xe và pin được quan tâm nhiều nhất
              </Typography>
            </Box>
            <Button
              endIcon={<ChevronRight size={20} />}
              className="!px-6 !py-3 !border !border-slate-300 !rounded-xl hover:!border-emerald-500 hover:!text-emerald-600"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                },
                transition: "all 0.3s",
              }}
            >
              Xem tất cả
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredListings.map((listing, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={listing.id}>
                <Card
                  className={`group !rounded-2xl !shadow-lg hover:!shadow-2xl !border !border-slate-200 animate-on-scroll ${
                    index % 2 === 0 ? "slide-left" : "slide-right"
                  } ${visibleSections["listings"] ? "visible" : ""}`}
                  sx={{
                    animationDelay: `${index * 0.1}s`,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <Box className="!relative !overflow-hidden">
                    <CardMedia
                      component="img"
                      height="192"
                      image={listing.image}
                      alt={listing.title}
                      className="!transition-transform !duration-500 group-hover:!scale-110"
                      sx={{ height: 192 }}
                    />
                    {listing.featured && (
                      <Chip
                        label="⭐ Nổi bật"
                        size="small"
                        className="!absolute !top-3 !left-3 !bg-gradient-to-r !from-amber-400 !to-orange-500 !text-white !font-bold !animate-pulse"
                      />
                    )}
                    {listing.verified && (
                      <Box className="!absolute !top-3 !right-3 !w-8 !h-8 !bg-emerald-500 !rounded-full !flex !items-center !justify-center !shadow-lg">
                        <CheckCircle className="!text-white" size={18} />
                      </Box>
                    )}
                  </Box>

                  <CardContent className="!p-4">
                    <Typography className="!text-base !font-bold !text-slate-900 !mb-2 group-hover:!text-emerald-600 !transition-colors">
                      {listing.title}
                    </Typography>

                    <Box className="!flex !flex-wrap !gap-2 !mb-3">
                      {listing.type === "ev" ? (
                        <>
                          <Chip
                            icon={<Calendar size={12} />}
                            label={listing.year}
                            size="small"
                            className="!bg-slate-100 !text-slate-600"
                          />
                          <Chip
                            icon={<Gauge size={12} />}
                            label={`${listing.km?.toLocaleString()} km`}
                            size="small"
                            className="!bg-slate-100 !text-slate-600"
                          />
                          <Chip
                            icon={<Battery size={12} />}
                            label={`${listing.battery}%`}
                            size="small"
                            className="!bg-emerald-100 !text-emerald-700 !font-medium"
                          />
                        </>
                      ) : (
                        <>
                          <Chip
                            icon={<Zap size={12} />}
                            label={listing.capacity}
                            size="small"
                            className="!bg-slate-100 !text-slate-600"
                          />
                          <Chip
                            icon={<Battery size={12} />}
                            label={`${listing.health}% health`}
                            size="small"
                            className="!bg-emerald-100 !text-emerald-700 !font-medium"
                          />
                        </>
                      )}
                    </Box>

                    <Box className="!flex !items-center !gap-1 !text-sm !text-slate-500 !mb-3">
                      <MapPin size={14} />
                      <Typography variant="body2">
                        {listing.location}
                      </Typography>
                    </Box>

                    <Box className="!flex !justify-between !items-center !pt-3 !border-t !border-slate-200">
                      <Typography
                        variant="h6"
                        className="!font-bold !text-emerald-600"
                      >
                        {listing.price}
                        <Typography component="span" variant="body2">
                          đ
                        </Typography>
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        className="!rounded-lg"
                        sx={{
                          background:
                            "linear-gradient(to right, #10b981, #3b82f6)",
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                          },
                          transition: "all 0.3s",
                        }}
                      >
                        Chi tiết
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        id="features"
        data-animate
        className="!py-20 !bg-gradient-to-br !from-slate-900 !to-slate-800 !text-white"
      >
        <Container maxWidth="lg">
          <Box
            className={`!text-center !mb-16 animate-on-scroll slide-up ${
              visibleSections["features"] ? "visible" : ""
            }`}
          >
            <Typography variant="h3" className="!font-bold !mb-4 !text-white">
              Tại sao chọn EVMarket?
            </Typography>
            <Typography variant="h6" className="!text-slate-300">
              Những lợi ích vượt trội khi sử dụng nền tảng của chúng tôi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  className={`!bg-white/10 !backdrop-blur-lg !rounded-2xl !border !border-white/20 hover:!bg-white/20 animate-on-scroll scale-in ${
                    visibleSections["features"] ? "visible" : ""
                  }`}
                  sx={{
                    height: 230,
                    animationDelay: `${index * 0.15}s`,
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <CardContent className="!p-6">
                    <Box className="!w-14 !h-14 !bg-gradient-to-br !from-emerald-400 !to-blue-500 !rounded-xl !flex !items-center !justify-center !mb-4 !shadow-lg hover:!rotate-12 !transition-transform">
                      <feature.icon size={28} className="!text-white" />
                    </Box>
                    <Typography className="!text-md !font-bold !mb-3 !text-white">
                      {feature.title}
                    </Typography>
                    <Typography className="!text-slate-300">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        id="cta"
        data-animate
        className={`!py-20 !bg-gradient-to-r !from-emerald-500 !to-blue-600 animate-on-scroll scale-in ${
          visibleSections["cta"] ? "visible" : ""
        }`}
      >
        <Container maxWidth="md">
          <Box className="!text-center">
            <Typography variant="h3" className="!font-bold !text-white !mb-6">
              Sẵn sàng bắt đầu giao dịch?
            </Typography>
            <Typography variant="h6" className="!text-white/90 !mb-8">
              Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho người dùng mới
            </Typography>
            <Box className="!flex !flex-col sm:!flex-row !gap-4 !justify-center">
              <Button
                variant="contained"
                className="!px-8 !py-4 !rounded-xl"
                sx={{
                  background: "white",
                  color: "#10b981",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    transform: "scale(1.1) translateY(-4px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                    background: "white",
                  },
                  transition: "all 0.3s",
                }}
              >
                Đăng ký miễn phí
              </Button>
              <Button
                variant="outlined"
                className="!px-8 !py-4 !rounded-xl"
                sx={{
                  borderColor: "white",
                  borderWidth: 2,
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    transform: "scale(1.1) translateY(-4px)",
                    background: "white",
                    color: "#10b981",
                    borderColor: "white",
                  },
                  transition: "all 0.3s",
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
