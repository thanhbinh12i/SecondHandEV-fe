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
  Fab,
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
  Plus,
  Sparkles,
} from "lucide-react";
import { useGetAuctionList } from "src/queries/useAuction";

const AuctionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetAuctionList({ page: 1, pageSize: 20 });

  const auctions = apiResponse?.data.data || [];

  const getTimeRemaining = (endDate: string): string => {
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

  const getTimeProgress = (startDate: string, endDate: string): number => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "Active":
        return (
          <Chip
            label="Đang diễn ra"
            size="small"
            className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-semibold"
            icon={<Zap size={14} className="!text-white" />}
          />
        );
      case "Upcoming":
        return (
          <Chip
            label="Sắp diễn ra"
            size="small"
            className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !font-semibold"
            icon={<Clock size={14} className="!text-white" />}
          />
        );
      case "Ended":
        return (
          <Chip
            label="Đã kết thúc"
            size="small"
            className="!bg-slate-400 !text-white !font-semibold"
            icon={<Award size={14} className="!text-white" />}
          />
        );
    }
  };

  const statusMap = ["Active", "Upcoming", "Ended"] as const;
  const currentStatus = statusMap[activeTab];

  const filteredByTab = auctions.filter(
    (auction) => auction.status === currentStatus
  );

  const filteredAuctions = filteredByTab.filter((auction) =>
    auction.listing.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = auctions.filter((a) => a.status === "Active").length;
  const upcomingCount = auctions.filter((a) => a.status === "Upcoming").length;
  const endedCount = auctions.filter((a) => a.status === "Ended").length;

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-blue-50/30 !to-emerald-50/30">
      <Box className="!bg-gradient-to-r !from-emerald-500 !via-blue-500 !to-emerald-600 !text-white !py-16 !relative !overflow-hidden">
        <Box className="!absolute !inset-0 !opacity-10">
          <Box className="!absolute !top-10 !left-10 !w-72 !h-72 !bg-white !rounded-full !blur-3xl" />
          <Box className="!absolute !bottom-10 !right-10 !w-96 !h-96 !bg-blue-300 !rounded-full !blur-3xl" />
        </Box>
        <Container maxWidth="xl" className="!relative">
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

            <Box className="!max-w-2xl !mx-auto !mb-6">
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

            <Button
              variant="contained"
              size="large"
              startIcon={<Sparkles size={24} />}
              onClick={() => navigate("/auctions/create")}
              className="!bg-white !text-emerald-600 hover:!bg-emerald-50 !font-bold !px-8 !py-3 !rounded-full !shadow-xl hover:!shadow-2xl !transition-all"
            >
              Tạo buổi đấu giá mới
            </Button>
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
                    {activeCount}
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
                    {upcomingCount}
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
                    {auctions.length}
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
                    1K+
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
                  <Chip label={activeCount} size="small" />
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
                  <Chip label={upcomingCount} size="small" />
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
                  <Chip label={endedCount} size="small" />
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
                <Typography variant="body1" className="!text-slate-600 !mb-6">
                  {searchQuery
                    ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm"
                    : "Hiện tại chưa có buổi đấu giá nào trong danh mục này"}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Plus size={20} />}
                  onClick={() => navigate("/auctions/create")}
                  className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !font-bold !px-6"
                >
                  Tạo buổi đấu giá đầu tiên
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={4}>
                {filteredAuctions.map((auction, index) => {
                  const status = auction.status;

                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 !h-full !flex !flex-col">
                        <CardActionArea
                          onClick={() => navigate(`/auctions/${auction.id}`)}
                          className="!flex-1 !flex !flex-col !items-stretch"
                        >
                          <Box className="!relative">
                            <CardMedia
                              component="img"
                              image={
                                auction.listing.primaryImageURL ??
                                "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800"
                              }
                              alt={auction.listing.title}
                              className="!h-64 !object-cover"
                            />
                            <Box className="!absolute !top-4 !left-4 !right-4 !flex !justify-between !items-start">
                              {getStatusBadge(status)}
                              {status === "active" && (
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
                              {auction.listing.title || "Chưa có tiêu đề"}
                            </Typography>

                            <Box className="!flex !items-center !gap-2 !mb-3">
                              {auction.seller.displayName && (
                                <Chip
                                  label={`👤 ${auction.seller.displayName}`}
                                  size="small"
                                  variant="outlined"
                                  className="!border-emerald-500 !text-emerald-600 hover:!border-emerald-600 hover:!text-emerald-700 !font-bold"
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
                                {auction.startingPrice.toLocaleString()} ₫
                              </Typography>
                              {auction.currentPrice &&
                                auction.currentPrice >
                                  auction.startingPrice && (
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

                            {status === "active" && (
                              <Box className="!mb-3">
                                <Box className="!flex !items-center !justify-between !mb-1">
                                  <Box className="!flex !items-center !gap-1">
                                    <Timer
                                      size={16}
                                      className="!text-red-500"
                                    />
                                    <Typography
                                      variant="caption"
                                      className="!font-semibold !text-red-500"
                                    >
                                      Còn lại:{" "}
                                      {getTimeRemaining(auction.endDate)}
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
                                {auction.totalBids && (
                                  <Typography
                                    variant="caption"
                                    className="!text-slate-600 !mt-1 !block"
                                  >
                                    🔥 {auction.totalBids} lượt đấu giá
                                  </Typography>
                                )}
                              </Box>
                            )}

                            {status === "upcoming" && (
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

                            {status === "ended" && (
                              <Box className="!mb-3 !p-3 !bg-slate-100 !rounded-xl">
                                <Box className="!flex !items-center !gap-2 !mb-1">
                                  <Award
                                    size={16}
                                    className="!text-slate-600"
                                  />
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
                                {auction.totalBids && (
                                  <Typography
                                    variant="caption"
                                    className="!text-slate-600 !mt-1 !block"
                                  >
                                    {auction.totalBids} lượt đấu giá
                                  </Typography>
                                )}
                              </Box>
                            )}

                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={<ArrowRight size={18} />}
                              className={`!mt-auto !py-2.5 !rounded-xl !font-semibold ${
                                status === "active"
                                  ? "!bg-gradient-to-r !from-emerald-500 !to-blue-600"
                                  : "!bg-gradient-to-r !from-slate-400 !to-slate-500"
                              }`}
                            >
                              {status === "Active"
                                ? "Tham gia đấu giá"
                                : status === "Upcoming"
                                ? "Xem chi tiết"
                                : "Xem kết quả"}
                            </Button>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Container>

      <Fab
        color="primary"
        aria-label="create auction"
        onClick={() => navigate("/auctions/create")}
        className="!fixed !bottom-8 !right-8 !bg-gradient-to-r !from-emerald-500 !to-blue-600 !shadow-2xl hover:!shadow-3xl !w-16 !h-16"
        sx={{
          "& .MuiFab-label": {
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          },
        }}
      >
        <Plus size={28} />
      </Fab>
    </Box>
  );
};

export default AuctionsPage;
