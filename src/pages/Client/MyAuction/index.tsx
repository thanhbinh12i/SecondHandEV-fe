import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Plus,
  Gavel,
  Timer,
  TrendingUp,
  Zap,
  Award,
  Clock,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuctionResponse } from "src/types/auction.type";
import { useGetMyAuctions } from "src/queries/useAuction";

const MyAuctionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAuction, setSelectedAuction] =
    useState<AuctionResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading } = useGetMyAuctions();

  const auctions = data?.data.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "!bg-emerald-100 !text-emerald-700";
      case "upcoming":
        return "!bg-blue-100 !text-blue-700";
      case "completed":
        return "!bg-slate-100 !text-slate-700";
      case "cancelled":
        return "!bg-red-100 !text-red-700";
      default:
        return "!bg-slate-100 !text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

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

  const filteredAuctions = auctions?.filter((auction) => {
    const matchesSearch =
      auction.listing.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) || false;

    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && auction.status === "Active") ||
      (tabValue === 2 && auction.status === "Upcoming") ||
      (tabValue === 3 && auction.status === "Ended");

    return matchesSearch && matchesTab;
  });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    auction: AuctionResponse
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAuction(auction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/auctions/edit/${selectedAuction?.id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      console.log("Delete auction:", selectedAuction?.id);
      setDeleteDialogOpen(false);
      setSelectedAuction(null);
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  const handleToggleStatus = () => {
    console.log("Toggle status:", selectedAuction?.id);
    handleMenuClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box className="!min-h-screen !flex !items-center !justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !to-slate-100 !py-8">
      <Container maxWidth="xl">
        <Box className="!mb-8">
          <Typography variant="h4" className="!font-bold !text-slate-900 !mb-2">
            Đấu giá của tôi
          </Typography>
          <Typography className="!text-slate-600">
            Quản lý các buổi đấu giá bạn đã tạo
          </Typography>
        </Box>

        <Grid container spacing={3} className="!mb-8">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white !rounded-2xl">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="body2" className="!mb-2 !opacity-90">
                    Tổng đấu giá
                  </Typography>
                  <Typography variant="h3" className="!font-bold">
                    {auctions?.length}
                  </Typography>
                </Box>
                <Gavel size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-emerald-500 !to-emerald-600 !text-white !rounded-2xl">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="body2" className="!mb-2 !opacity-90">
                    Đang diễn ra
                  </Typography>
                  <Typography variant="h3" className="!font-bold">
                    {auctions?.filter((a) => a.status === "active").length}
                  </Typography>
                </Box>
                <Zap size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !rounded-2xl">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="body2" className="!mb-2 !opacity-90">
                    Sắp diễn ra
                  </Typography>
                  <Typography variant="h3" className="!font-bold">
                    {auctions?.filter((a) => a.status === "upcoming").length}
                  </Typography>
                </Box>
                <Clock size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-slate-500 !to-slate-600 !text-white !rounded-2xl">
              <Box className="!flex !items-center !justify-between">
                <Box>
                  <Typography variant="body2" className="!mb-2 !opacity-90">
                    Đã kết thúc
                  </Typography>
                  <Typography variant="h3" className="!font-bold">
                    {auctions?.filter((a) => a.status === "completed").length}
                  </Typography>
                </Box>
                <Award size={48} className="!opacity-80" />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper className="!p-4 !mb-6 !rounded-2xl">
          <Box className="!flex !flex-col md:!flex-row !gap-4 !justify-between !items-center">
            <TextField
              placeholder="Tìm kiếm đấu giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              className="!w-full md:!w-96"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} className="!text-slate-400" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate("/auctions/create")}
              className="!bg-gradient-to-r !from-purple-500 !to-pink-600 !font-semibold !px-6 !rounded-xl !whitespace-nowrap"
            >
              Tạo đấu giá mới
            </Button>
          </Box>
        </Paper>

        <Paper className="!mb-6 !rounded-2xl">
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            className="!px-4"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            <Tab label="Tất cả" />
            <Tab label="Đang diễn ra" />
            <Tab label="Sắp diễn ra" />
            <Tab label="Đã kết thúc" />
          </Tabs>
        </Paper>

        {filteredAuctions?.length === 0 ? (
          <Paper className="!p-12 !text-center !rounded-2xl">
            <Typography variant="h6" className="!text-slate-600 !mb-4">
              {searchQuery
                ? "Không tìm thấy đấu giá nào"
                : "Bạn chưa có đấu giá nào"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate("/auctions/create")}
              className="!bg-gradient-to-r !from-purple-500 !to-pink-600"
            >
              Tạo đấu giá đầu tiên
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredAuctions?.map((auction) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={auction.id}>
                <Card className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-105">
                  <Box className="!relative">
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        auction.listing.primaryImageURL ||
                        "https://via.placeholder.com/800x600?text=No+Image"
                      }
                      alt={auction.listing.title}
                      className="!h-48 !object-cover"
                    />
                    <Chip
                      label={getStatusLabel(auction.status!)}
                      size="small"
                      className={`!absolute !top-3 !left-3 ${getStatusColor(
                        auction.status!
                      )} !font-semibold`}
                    />
                    {auction.status === "active" && (
                      <Chip
                        label="HOT"
                        size="small"
                        className="!absolute !top-3 !right-12 !bg-gradient-to-r !from-red-500 !to-orange-500 !text-white !font-semibold"
                        icon={<TrendingUp size={14} className="!text-white" />}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, auction)}
                      className="!absolute !top-3 !right-3 !bg-white !shadow-lg hover:!bg-slate-100"
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </Box>

                  <CardContent className="!p-4">
                    <Typography
                      variant="h6"
                      className="!font-bold !text-slate-900 !mb-2 !line-clamp-2"
                    >
                      {auction.listing.title}
                    </Typography>

                    {auction.listing.description && (
                      <Typography
                        variant="body2"
                        className="!text-slate-600 !mb-3 !line-clamp-2"
                      >
                        {auction.listing.description}
                      </Typography>
                    )}
                    <Box className="!mb-3 !space-y-2">
                      <Box className="!p-2 !bg-slate-50 !rounded-lg">
                        <Typography
                          variant="caption"
                          className="!text-slate-600 !block !mb-1"
                        >
                          Giá khởi điểm
                        </Typography>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-slate-900"
                        >
                          {auction.startingPrice.toLocaleString()} ₫
                        </Typography>
                      </Box>

                      {auction.currentPrice &&
                        auction.currentPrice > auction.startingPrice && (
                          <Box className="!p-2 !bg-gradient-to-r !from-emerald-50 !to-blue-50 !rounded-lg !border !border-emerald-200">
                            <Box className="!flex !items-center !justify-between !mb-1">
                              <Typography
                                variant="caption"
                                className="!text-slate-600"
                              >
                                Giá hiện tại
                              </Typography>
                              {auction.totalBids && (
                                <Chip
                                  label={`${auction.totalBids} lượt`}
                                  size="small"
                                  className="!bg-emerald-100 !text-emerald-700 !font-semibold !h-5"
                                  icon={
                                    <Users
                                      size={12}
                                      className="!text-emerald-700"
                                    />
                                  }
                                />
                              )}
                            </Box>
                            <Typography
                              variant="h5"
                              className="!font-bold !bg-gradient-to-r !from-emerald-600 !to-blue-600 !bg-clip-text !text-transparent"
                            >
                              {auction.currentPrice.toLocaleString()} ₫
                            </Typography>
                          </Box>
                        )}
                    </Box>

                    {auction.status === "active" && (
                      <Box className="!mb-3 !p-3 !bg-red-50 !rounded-xl !border !border-red-200">
                        <Box className="!flex !items-center !justify-between !mb-2">
                          <Box className="!flex !items-center !gap-1">
                            <Timer size={16} className="!text-red-600" />
                            <Typography
                              variant="caption"
                              className="!font-semibold !text-red-600"
                            >
                              Còn lại
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            className="!font-bold !text-red-700"
                          >
                            {getTimeRemaining(auction.endDate)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getTimeProgress(
                            auction.startDate,
                            auction.endDate
                          )}
                          className="!h-2 !rounded-full"
                          sx={{
                            backgroundColor: "#fee2e2",
                            "& .MuiLinearProgress-bar": {
                              background:
                                "linear-gradient(to right, #ef4444, #f97316)",
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* Pending Auction Info */}
                    {auction.status === "upcoming" && (
                      <Box className="!mb-3 !p-3 !bg-blue-50 !rounded-xl !border !border-blue-200">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Calendar size={16} className="!text-blue-600" />
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
                          className="!font-bold !text-slate-700"
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

                    <Box className="!pt-3 !border-t !border-slate-200">
                      <Box className="!flex !justify-between !items-center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/auctions/${auction.id}`)}
                          className="!border-purple-500 !text-purple-600 hover:!bg-purple-50 !rounded-lg"
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit size={18} className="!mr-2" />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedAuction?.status === "active" ? (
            <>
              <EyeOff size={18} className="!mr-2" />
              Tạm dừng
            </>
          ) : (
            <>
              <Eye size={18} className="!mr-2" />
              Kích hoạt
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} className="!text-red-600">
          <Trash2 size={18} className="!mr-2" />
          Hủy đấu giá
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle className="!font-bold">Xác nhận hủy</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy đấu giá "{selectedAuction?.listing.title}
            "? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions className="!p-4">
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAuctionsPage;
