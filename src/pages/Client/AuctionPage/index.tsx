/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  Gavel,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Calendar,
  ArrowRight,
  Timer,
  Award,
} from "lucide-react";
// import { useGetAuctions } from "src/queries/useAuction";

const AuctionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  //   const statusMap = ["active", "pending", "completed"];
  //   const currentStatus = statusMap[activeTab];

  //   const { data, isLoading, isError } = useGetAuctions({
  //     status: currentStatus,
  //   });

  const isLoading = false;
  const isError = false;

  const mockAuctions = [
    {
      id: 1,
      listingId: 101,
      startingPrice: 15000000,
      currentPrice: 18500000,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      status: "active",
      listing: {
        id: 101,
        title: "Pin Lithium 72V 40Ah - Chính hãng Samsung",
        categoryName: "Pin xe điện",
        brand: "Samsung",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      },
    },
    {
      id: 2,
      listingId: 102,
      startingPrice: 25000000,
      currentPrice: 32000000,
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: "active",
      listing: {
        id: 102,
        title: "Xe đạp điện Giant E+ Pro - Như mới 98%",
        categoryName: "Xe đạp điện",
        brand: "Giant",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800",
      },
    },
    {
      id: 3,
      listingId: 103,
      startingPrice: 8500000,
      currentPrice: 9200000,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      status: "active",
      listing: {
        id: 103,
        title: "Bộ pin 48V 20Ah cho xe đạp điện - LG cells",
        categoryName: "Pin xe điện",
        brand: "LG",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      },
    },
    {
      id: 4,
      listingId: 104,
      startingPrice: 18000000,
      currentPrice: null,
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      listing: {
        id: 104,
        title: "Xe điện Yadea V7 Pro - Bản cao cấp 2024",
        categoryName: "Xe đạp điện",
        brand: "Yadea",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      },
    },
    {
      id: 5,
      listingId: 105,
      startingPrice: 12000000,
      currentPrice: null,
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      listing: {
        id: 105,
        title: "Pin Tesla Powerwall 60V 50Ah",
        categoryName: "Pin xe điện",
        brand: "Tesla",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      },
    },
    {
      id: 6,
      listingId: 106,
      startingPrice: 22000000,
      currentPrice: 28500000,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      listing: {
        id: 106,
        title: "Xe điện Vinfast Klara S - Đã qua sử dụng 6 tháng",
        categoryName: "Xe đạp điện",
        brand: "Vinfast",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      },
    },
    {
      id: 7,
      listingId: 107,
      startingPrice: 6500000,
      currentPrice: 7800000,
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      listing: {
        id: 107,
        title: "Pin Panasonic 36V 15Ah - Còn 90% dung lượng",
        categoryName: "Pin xe điện",
        brand: "Panasonic",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      },
    },
    {
      id: 8,
      listingId: 108,
      startingPrice: 32000000,
      currentPrice: 35000000,
      startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      status: "active",
      listing: {
        id: 108,
        title: "Xe đạp điện Specialized Turbo Vado 5.0",
        categoryName: "Xe đạp điện",
        brand: "Specialized",
        primaryImageUrl:
          "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800",
      },
    },
  ];

  const auctions = mockAuctions;

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  const getTimeProgress = (startDate: string, endDate: string) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Chip
            label="Đang diễn ra"
            size="small"
            className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-semibold"
            icon={<Zap size={14} className="!text-white" />}
          />
        );
      case "pending":
        return (
          <Chip
            label="Sắp diễn ra"
            size="small"
            className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !font-semibold"
            icon={<Clock size={14} className="!text-white" />}
          />
        );
      case "completed":
        return (
          <Chip
            label="Đã kết thúc"
            size="small"
            className="!bg-slate-400 !text-white !font-semibold"
            icon={<Award size={14} className="!text-white" />}
          />
        );
      default:
        return null;
    }
  };

  const filteredAuctions = auctions.filter((auction: any) =>
    auction.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-blue-50/30 !to-emerald-50/30">
      <Box className="!bg-gradient-to-r !from-emerald-500 !via-blue-500 !to-emerald-600 !text-white !py-16">
        <Container maxWidth="xl">
          <Box className="!text-center">
            <Box className="!flex !items-center !justify-center !gap-3 !mb-4">
              <Gavel size={48} className="!animate-bounce" />
              <Typography variant="h2" className="!font-bold">
                Đấu Giá Trực Tuyến
              </Typography>
            </Box>
            <Typography variant="h6" className="!mb-6 !opacity-90">
              Tham gia đấu giá để sở hữu những sản phẩm độc đáo với giá tốt nhất
            </Typography>

            <Box className="!max-w-2xl !mx-auto">
              <TextField
                fullWidth
                placeholder="Tìm kiếm buổi đấu giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!bg-white !rounded-full"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={24} className="!text-slate-400" />
                    </InputAdornment>
                  ),
                  className: "!rounded-full",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="!py-8">
        <Grid container spacing={3} className="!mb-8">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !bg-gradient-to-br !from-emerald-500 !to-emerald-600 !text-white">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold !mb-1">
                    {
                      mockAuctions.filter((a: any) => a.status === "active")
                        .length
                    }
                  </Typography>
                  <Typography variant="body2" className="!opacity-90">
                    Đang diễn ra
                  </Typography>
                </Box>
                <Zap size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold !mb-1">
                    {
                      mockAuctions.filter((a: any) => a.status === "pending")
                        .length
                    }
                  </Typography>
                  <Typography variant="body2" className="!opacity-90">
                    Sắp diễn ra
                  </Typography>
                </Box>
                <Clock size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold !mb-1">
                    {mockAuctions.length}
                  </Typography>
                  <Typography variant="body2" className="!opacity-90">
                    Tổng buổi đấu giá
                  </Typography>
                </Box>
                <Gavel size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !bg-gradient-to-br !from-orange-500 !to-orange-600 !text-white">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold !mb-1">
                    1.2K+
                  </Typography>
                  <Typography variant="body2" className="!opacity-90">
                    Người tham gia
                  </Typography>
                </Box>
                <Users size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper className="!mb-6 !rounded-2xl !shadow-lg">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            className="!px-4"
          >
            <Tab
              label={
                <Box className="!flex !items-center !gap-2">
                  <Zap size={18} />
                  <Typography className="!font-semibold">
                    Đang diễn ra
                  </Typography>
                </Box>
              }
            />
            <Tab
              label={
                <Box className="!flex !items-center !gap-2">
                  <Clock size={18} />
                  <Typography className="!font-semibold">
                    Sắp diễn ra
                  </Typography>
                </Box>
              }
            />
            <Tab
              label={
                <Box className="!flex !items-center !gap-2">
                  <Award size={18} />
                  <Typography className="!font-semibold">
                    Đã kết thúc
                  </Typography>
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {isLoading && (
          <Box className="!text-center !py-12">
            <CircularProgress size={60} className="!text-emerald-500" />
            <Typography variant="h6" className="!mt-4 !text-slate-600">
              Đang tải danh sách đấu giá...
            </Typography>
          </Box>
        )}

        {isError && (
          <Alert severity="error" className="!rounded-xl">
            <Typography variant="h6" className="!font-bold !mb-2">
              Không thể tải danh sách đấu giá
            </Typography>
            <Typography variant="body2">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </Typography>
          </Alert>
        )}

        {!isLoading && !isError && (
          <>
            {filteredAuctions.length === 0 ? (
              <Paper className="!p-12 !rounded-2xl !shadow-lg !text-center">
                <Gavel size={64} className="!mx-auto !mb-4 !text-slate-300" />
                <Typography variant="h5" className="!font-bold !mb-2">
                  Không có buổi đấu giá nào
                </Typography>
                <Typography variant="body1" className="!text-slate-600">
                  {searchQuery
                    ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm"
                    : "Hiện tại chưa có buổi đấu giá nào trong danh mục này"}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={4}>
                {filteredAuctions.map((auction: any) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={auction.id}>
                    <Card className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 !h-full !flex !flex-col">
                      <CardActionArea
                        onClick={() => navigate(`/auctions/${auction.id}`)}
                        className="!flex-1 !flex !flex-col !items-stretch"
                      >
                        <Box className="!relative">
                          <CardMedia
                            component="img"
                            image={
                              auction.listing?.primaryImageUrl ||
                              auction.listing?.imageUrls?.[0] ||
                              "https://via.placeholder.com/400x300"
                            }
                            alt={auction.listing?.title}
                            className="!h-64 !object-cover"
                          />
                          <Box className="!absolute !top-4 !left-4 !right-4 !flex !justify-between !items-start">
                            {getStatusBadge(auction.status)}
                            {auction.status === "active" && (
                              <Chip
                                label={
                                  <Box className="!flex !items-center !gap-1">
                                    <TrendingUp size={14} />
                                    <Typography
                                      variant="caption"
                                      className="!font-bold"
                                    >
                                      HOT
                                    </Typography>
                                  </Box>
                                }
                                size="small"
                                className="!bg-red-500 !text-white !font-semibold"
                              />
                            )}
                          </Box>
                        </Box>

                        <CardContent className="!flex-1 !flex !flex-col">
                          <Typography
                            variant="h6"
                            className="!font-bold !mb-2 !line-clamp-2"
                          >
                            {auction.listing?.title || "Chưa có tiêu đề"}
                          </Typography>

                          <Box className="!flex !items-center !gap-2 !mb-3">
                            <Chip
                              label={auction.listing?.categoryName || "Khác"}
                              size="small"
                              variant="outlined"
                            />
                            {auction.listing?.brand && (
                              <Chip
                                label={auction.listing.brand}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>

                          <Box className="!mb-3">
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Giá khởi điểm
                            </Typography>
                            <Typography
                              variant="h5"
                              className="!font-bold !bg-gradient-to-r !from-emerald-600 !to-blue-600 !bg-clip-text !text-transparent"
                            >
                              {auction.startingPrice?.toLocaleString() || "0"} ₫
                            </Typography>
                            {auction.currentPrice &&
                              auction.currentPrice > auction.startingPrice && (
                                <>
                                  <Typography
                                    variant="caption"
                                    className="!text-slate-600 !mt-2 !block"
                                  >
                                    Giá hiện tại
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    className="!font-bold !text-orange-600"
                                  >
                                    {auction.currentPrice.toLocaleString()} ₫
                                  </Typography>
                                </>
                              )}
                          </Box>

                          {auction.status === "active" && (
                            <Box className="!mb-3">
                              <Box className="!flex !items-center !justify-between !mb-1">
                                <Box className="!flex !items-center !gap-1">
                                  <Timer size={16} className="!text-red-500" />
                                  <Typography
                                    variant="caption"
                                    className="!font-semibold !text-red-500"
                                  >
                                    Còn lại: {getTimeRemaining(auction.endDate)}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  className="!text-slate-600"
                                >
                                  {Math.round(
                                    getTimeProgress(
                                      auction.startDate,
                                      auction.endDate
                                    )
                                  )}
                                  %
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={getTimeProgress(
                                  auction.startDate,
                                  auction.endDate
                                )}
                                className="!h-2 !rounded-full !bg-slate-200"
                                sx={{
                                  "& .MuiLinearProgress-bar": {
                                    background:
                                      "linear-gradient(to right, #10b981, #3b82f6)",
                                  },
                                }}
                              />
                            </Box>
                          )}

                          {auction.status === "pending" && (
                            <Box className="!mb-3 !p-3 !bg-blue-50 !rounded-xl">
                              <Box className="!flex !items-center !gap-2 !mb-1">
                                <Calendar
                                  size={16}
                                  className="!text-blue-600"
                                />
                                <Typography
                                  variant="caption"
                                  className="!font-semibold !text-blue-600"
                                >
                                  Bắt đầu
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                className="!font-bold !text-blue-700"
                              >
                                {formatDate(auction.startDate)}
                              </Typography>
                            </Box>
                          )}

                          {auction.status === "completed" && (
                            <Box className="!mb-3 !p-3 !bg-slate-100 !rounded-xl">
                              <Box className="!flex !items-center !gap-2 !mb-1">
                                <Award size={16} className="!text-slate-600" />
                                <Typography
                                  variant="caption"
                                  className="!font-semibold !text-slate-600"
                                >
                                  Kết thúc
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                className="!font-bold"
                              >
                                {formatDate(auction.endDate)}
                              </Typography>
                            </Box>
                          )}

                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowRight size={18} />}
                            className={`!mt-auto !py-2.5 !rounded-xl !font-semibold ${
                              auction.status === "active"
                                ? "!bg-gradient-to-r !from-emerald-500 !to-blue-600"
                                : "!bg-gradient-to-r !from-slate-400 !to-slate-500"
                            }`}
                          >
                            {auction.status === "active"
                              ? "Tham gia đấu giá"
                              : auction.status === "pending"
                              ? "Xem chi tiết"
                              : "Xem kết quả"}
                          </Button>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AuctionsPage;
