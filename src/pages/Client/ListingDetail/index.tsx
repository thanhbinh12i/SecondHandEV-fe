import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  Zap,
  Battery,
  Gauge,
  Package,
  Info,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetListingById } from "src/queries/useListing";

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data, isLoading, isError } = useGetListingById({
    id: Number(id),
    enabled: !!id,
  });

  const listing = data?.data;

  if (isLoading) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Box className="!text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="!mt-4 !text-slate-600">
            Đang tải thông tin sản phẩm...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !listing) {
    return (
      <Box className="!min-h-screen !bg-slate-50">
        <Container maxWidth="xl" className="!py-6">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!mb-4 !text-slate-600"
          >
            Quay lại
          </Button>
          <Alert severity="error" className="!mb-4">
            <Typography variant="h6" className="!font-bold !mb-2">
              Không thể tải thông tin sản phẩm
            </Typography>
            <Typography variant="body2">
              Sản phẩm không tồn tại hoặc đã bị xóa. Vui lòng thử lại sau.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  const isBattery = listing.categoryId === 1;
  const isEBike = listing.categoryId === 2;

  const imageUrls =
    listing.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls
      : listing.primaryImageUrl
      ? [listing.primaryImageUrl]
      : [];

  const handlePreviousImage = () => {
    if (imageUrls.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (imageUrls.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleContact = () => {
    setSnackbar({
      open: true,
      message: "Đã gửi yêu cầu liên hệ đến người bán!",
      severity: "success",
    });
  };

  const handleFavorite = () => {
    setSnackbar({
      open: true,
      message: "Đã thêm vào danh sách yêu thích!",
      severity: "success",
    });
  };

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "Mới":
        return "!bg-blue-100 !text-blue-700";
      case "Như mới":
        return "!bg-cyan-100 !text-cyan-700";
      case "Đã sử dụng":
        return "!bg-orange-100 !text-orange-700";
      default:
        return "!bg-slate-100 !text-slate-700";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const condition = isBattery
    ? listing.battery?.condition
    : isEBike
    ? listing.ebike?.condition
    : undefined;

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="xl" className="!py-6">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          className="!mb-4 !text-slate-600"
        >
          Quay lại
        </Button>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper className="!rounded-2xl !overflow-hidden !shadow-xl">
              {imageUrls.length > 0 && (
                <Box className="!relative">
                  <img
                    src={imageUrls[selectedImageIndex]}
                    alt={listing.title || "Product image"}
                    className="!w-full !h-[500px] !object-cover !cursor-pointer"
                    onClick={() => setImageDialogOpen(true)}
                  />
                  {imageUrls.length > 1 && (
                    <>
                      <IconButton
                        className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft />
                      </IconButton>
                      <IconButton
                        className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                        onClick={handleNextImage}
                      >
                        <ChevronRight />
                      </IconButton>
                    </>
                  )}
                  <Box className="!absolute !top-4 !left-4">
                    <Chip
                      label={listing.categoryName || "Chưa phân loại"}
                      className="!bg-white/90 !font-semibold"
                    />
                  </Box>
                </Box>
              )}

              {imageUrls.length > 1 && (
                <Box className="!p-4 !flex !gap-2 !overflow-x-auto">
                  {imageUrls.map((url, index) => (
                    <Card
                      key={index}
                      className={`!cursor-pointer !flex-shrink-0 ${
                        selectedImageIndex === index
                          ? "!ring-4 !ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        image={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="!w-24 !h-24 !object-cover"
                      />
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>

            <Paper className="!mt-4 !p-6 !rounded-2xl !shadow-lg">
              <Typography variant="h6" className="!font-bold !mb-3">
                Mô tả chi tiết
              </Typography>
              <Typography className="!text-slate-700 !leading-relaxed !whitespace-pre-line">
                {listing.description || "Chưa có mô tả"}
              </Typography>
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-xl !mt-3">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin người bán
              </Typography>
              <Box className="!flex !items-center !gap-4 !mb-4">
                <Avatar className="!w-16 !h-16 !bg-gradient-to-br !from-blue-500 !to-cyan-600">
                  {listing.sellerDisplayName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Typography variant="h6" className="!font-bold">
                    {listing.sellerDisplayName || "Người bán"}
                  </Typography>
                  <Box className="!flex !items-center !gap-1 !text-slate-600">
                    <CheckCircle size={16} className="!text-emerald-500" />
                    <Typography variant="body2">Đã xác thực</Typography>
                  </Box>
                </Box>
              </Box>
              <Alert severity="info" className="!mb-3">
                <Typography variant="body2">
                  Liên hệ qua hệ thống để đảm bảo an toàn giao dịch
                </Typography>
              </Alert>
              <Box className="!flex !items-center !gap-2 !text-slate-600">
                <MapPin size={18} />
                <Typography variant="body2">Thành phố Hồ Chí Minh</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-xl !mb-4">
              <Typography variant="h4" className="!font-bold !mb-3">
                {listing.title || "Chưa có tiêu đề"}
              </Typography>

              <Box className="!flex !items-center !gap-2 !mb-4">
                {condition && (
                  <Chip
                    label={condition}
                    className={`${getConditionColor(condition)} !font-semibold`}
                  />
                )}
                {(listing.brand || listing.model) && (
                  <Chip
                    label={`${listing.brand || ""} ${
                      listing.model || ""
                    }`.trim()}
                    variant="outlined"
                    className="!font-semibold"
                  />
                )}
              </Box>

              <Typography
                variant="h3"
                className="!font-bold !text-emerald-600 !mb-4"
              >
                {listing.price?.toLocaleString() || "0"} ₫
              </Typography>

              <Divider className="!my-4" />

              <Box className="!space-y-3">
                {listing.year && (
                  <Box className="!flex !items-center !gap-3">
                    <Calendar size={20} className="!text-slate-500" />
                    <Typography variant="body2" className="!text-slate-600">
                      Năm sản xuất: <strong>{listing.year}</strong>
                    </Typography>
                  </Box>
                )}
                <Box className="!flex !items-center !gap-3">
                  <Package size={20} className="!text-slate-500" />
                  <Typography variant="body2" className="!text-slate-600">
                    Loại tin:{" "}
                    <strong>
                      {listing.listingType === "fixed" ? "Mua ngay" : "Đấu giá"}
                    </strong>
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-3">
                  <Info size={20} className="!text-slate-500" />
                  <Typography variant="body2" className="!text-slate-600">
                    Đăng ngày: <strong>{formatDate(listing.createdAt)}</strong>
                  </Typography>
                </Box>
              </Box>

              <Divider className="!my-4" />

              <Box className="!space-y-2">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<MessageCircle size={20} />}
                  className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !py-3"
                  onClick={handleContact}
                >
                  Liên hệ người bán
                </Button>
                <Box className="!flex !gap-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Heart size={20} />}
                    onClick={handleFavorite}
                  >
                    Yêu thích
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Share2 size={20} />}
                  >
                    Chia sẻ
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-xl !mb-4">
              <Typography
                variant="h6"
                className="!font-bold !mb-4 !flex !items-center !gap-2"
              >
                {isBattery ? (
                  <>
                    <Battery className="!text-orange-500" size={24} />
                    Thông số kỹ thuật Pin
                  </>
                ) : isEBike ? (
                  <>
                    <Zap className="!text-blue-500" size={24} />
                    Thông số kỹ thuật Xe
                  </>
                ) : (
                  <>
                    <Info className="!text-slate-500" size={24} />
                    Thông số kỹ thuật
                  </>
                )}
              </Typography>

              {isBattery && listing.battery ? (
                <Grid container spacing={3}>
                  {listing.battery.voltage && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-orange-50 !rounded-xl">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Zap size={16} className="!text-orange-500" />
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Điện áp
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-orange-600"
                        >
                          {listing.battery.voltage}V
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.battery.capacityWh && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-blue-50 !rounded-xl">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Battery size={16} className="!text-blue-500" />
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Dung lượng
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-blue-600"
                        >
                          {listing.battery.capacityWh}Wh
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.battery.weightKg && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Trọng lượng
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {listing.battery.weightKg}kg
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.battery.ageYears !== undefined && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Tuổi pin
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {listing.battery.ageYears} năm
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {(listing.brand || listing.model) && (
                    <Grid size={{ xs: 12 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Hãng sản xuất
                        </Typography>
                        <Typography variant="body1" className="!font-bold">
                          {listing.brand || ""}{" "}
                          {listing.model ? `- ${listing.model}` : ""}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : isEBike && listing.ebike ? (
                <Grid container spacing={3}>
                  {listing.ebike.motorPowerW && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-orange-50 !rounded-xl">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Zap size={16} className="!text-orange-500" />
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Động cơ
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-orange-600"
                        >
                          {listing.ebike.motorPowerW}W
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.batteryVoltage && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-purple-50 !rounded-xl">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Battery size={16} className="!text-purple-500" />
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Pin
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-purple-600"
                        >
                          {listing.ebike.batteryVoltage}V
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.rangeKm && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-blue-50 !rounded-xl">
                        <Box className="!flex !items-center !gap-2 !mb-1">
                          <Gauge size={16} className="!text-blue-500" />
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Quãng đường
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-blue-600"
                        >
                          {listing.ebike.rangeKm}km
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.frameSize && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Khung xe
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {listing.ebike.frameSize}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.mileageKm !== undefined && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Số km đã đi
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {listing.ebike.mileageKm.toLocaleString()}km
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.weightKg && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Trọng lượng
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {listing.ebike.weightKg}kg
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {(listing.brand || listing.model) && (
                    <Grid size={{ xs: 12 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Hãng sản xuất
                        </Typography>
                        <Typography variant="body1" className="!font-bold">
                          {listing.brand || ""}{" "}
                          {listing.model ? `- ${listing.model}` : ""}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {listing.ebike.yearOfManufacture && (
                    <Grid size={{ xs: 12 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Năm sản xuất
                        </Typography>
                        <Typography variant="body1" className="!font-bold">
                          {listing.ebike.yearOfManufacture}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Alert severity="info">
                  Chưa có thông số kỹ thuật chi tiết
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <IconButton
            className="!absolute !top-4 !right-4 !z-10 !bg-white/80 hover:!bg-white"
            onClick={() => setImageDialogOpen(false)}
          >
            <X />
          </IconButton>
          <DialogContent className="!p-0 !relative">
            {imageUrls.length > 0 && (
              <>
                <img
                  src={imageUrls[selectedImageIndex]}
                  alt={listing.title || "Product image"}
                  className="!w-full !h-auto"
                />
                {imageUrls.length > 1 && (
                  <>
                    <IconButton
                      className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                      onClick={handlePreviousImage}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                      onClick={handleNextImage}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ListingDetailPage;
