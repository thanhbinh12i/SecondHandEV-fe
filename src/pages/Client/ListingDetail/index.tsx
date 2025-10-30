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
import { ListingDto } from "src/types/listing.type";

const ListingDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Mock data - replace with actual API call
  const mockListing: ListingDto = {
    listingId: 1,
    memberId: 1,
    categoryId: 2, // E-bike
    categoryName: "Xe điện",
    title: "VinFast Impes 1500W Premium Scooter - Như mới 95%",
    description:
      "Xe máy điện VinFast Impes cao cấp, sử dụng 6 tháng. Pin rời tiện lợi, sạc đầy chỉ 4 giờ. Xe còn rất mới, bảo dưỡng định kỳ tại VinFast. Có đầy đủ giấy tờ, bảo hành chính hãng còn 18 tháng. Lý do bán: nâng cấp lên dòng cao cấp hơn.",
    year: 2024,
    price: 52000000,
    listingType: "buy_now",
    listingStatus: "active",
    createdAt: "2025-10-28T14:30:00",
    sellerDisplayName: "Nguyễn Văn An",
    sellerEmail: "nguyenvana@email.com",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=1200&h=800",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&h=800",
      "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=1200&h=800",
    ],
    brand: "VinFast",
    model: "Impes",
    ebike: {
      motorPowerW: 1500,
      batteryVoltage: 60,
      rangeKm: 80,
      frameSize: "M",
      condition: "Như mới",
      mileageKm: 850,
      weightKg: 85,
      yearOfManufacture: 2024,
    },
  };

  // Mock battery listing for demo
  const mockBatteryListing: ListingDto = {
    listingId: 2,
    memberId: 2,
    categoryId: 1, // Battery
    categoryName: "Pin xe điện",
    title: "Pin Lithium Samsung 60V 30Ah - Chính hãng mới 100%",
    description:
      "Pin Samsung chính hãng, mới 100%, chưa qua sử dụng. Bảo hành 24 tháng. Pin có BMS bảo vệ thông minh, chống quá sạc, quá phóng. Phù hợp cho xe điện công suất 1000-2000W.",
    year: 2024,
    price: 15000000,
    listingType: "buy_now",
    listingStatus: "active",
    createdAt: "2025-10-27T10:15:00",
    sellerDisplayName: "Trần Thị Hoa",
    sellerEmail: "tranthihoa@email.com",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&h=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&h=800",
      "https://images.unsplash.com/photo-1609262772830-c1e7b6a48d6c?w=1200&h=800",
      "https://images.unsplash.com/photo-1608454027542-f43b1e1ec7f0?w=1200&h=800",
    ],
    brand: "Samsung",
    model: "SDI 30Ah",
    battery: {
      voltage: 60,
      capacityWh: 1800,
      weightKg: 18.0,
      condition: "Mới",
      ageYears: 0,
    },
  };

  // Use battery listing if categoryId is 1
  const listing = listingId === "2" ? mockBatteryListing : mockListing;
  const isBattery = listing.categoryId === 1;

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? listing.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === listing.imageUrls.length - 1 ? 0 : prev + 1
    );
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

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="xl" className="!py-6">
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          className="!mb-4 !text-slate-600"
        >
          Quay lại
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper className="!rounded-2xl !overflow-hidden !shadow-xl">
              {/* Main Image */}
              <Box className="!relative">
                <img
                  src={listing.imageUrls[selectedImageIndex]}
                  alt={listing.title}
                  className="!w-full !h-[500px] !object-cover !cursor-pointer"
                  onClick={() => setImageDialogOpen(true)}
                />
                {listing.imageUrls.length > 1 && (
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
                    label={listing.categoryName}
                    className="!bg-white/90 !font-semibold"
                  />
                </Box>
              </Box>

              {/* Thumbnail Images */}
              {listing.imageUrls.length > 1 && (
                <Box className="!p-4 !flex !gap-2 !overflow-x-auto">
                  {listing.imageUrls.map((url, index) => (
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

            {/* Description */}
            <Paper className="!mt-4 !p-6 !rounded-2xl !shadow-lg">
              <Typography variant="h6" className="!font-bold !mb-3">
                Mô tả chi tiết
              </Typography>
              <Typography className="!text-slate-700 !leading-relaxed !whitespace-pre-line">
                {listing.description}
              </Typography>
            </Paper>

            {/* Seller Info */}
            <Paper className="!p-6 !rounded-2xl !shadow-xl !mt-3">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin người bán
              </Typography>
              <Box className="!flex !items-center !gap-4 !mb-4">
                <Avatar className="!w-16 !h-16 !bg-gradient-to-br !from-blue-500 !to-cyan-600">
                  {listing.sellerDisplayName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" className="!font-bold">
                    {listing.sellerDisplayName}
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

          {/* Right Column - Details */}
          <Grid size={{ xs: 12, md: 5 }}>
            {/* Title & Price */}
            <Paper className="!p-6 !rounded-2xl !shadow-xl !mb-4">
              <Typography variant="h4" className="!font-bold !mb-3">
                {listing.title}
              </Typography>

              <Box className="!flex !items-center !gap-2 !mb-4">
                <Chip
                  label={
                    isBattery
                      ? listing.battery?.condition
                      : listing.ebike?.condition
                  }
                  className={`${getConditionColor(
                    isBattery
                      ? listing.battery?.condition
                      : listing.ebike?.condition
                  )} !font-semibold`}
                />
                <Chip
                  label={`${listing.brand} ${listing.model}`}
                  variant="outlined"
                  className="!font-semibold"
                />
              </Box>

              <Typography
                variant="h3"
                className="!font-bold !text-emerald-600 !mb-4"
              >
                {listing.price?.toLocaleString()} ₫
              </Typography>

              <Divider className="!my-4" />

              {/* Quick Info */}
              <Box className="!space-y-3">
                <Box className="!flex !items-center !gap-3">
                  <Calendar size={20} className="!text-slate-500" />
                  <Typography variant="body2" className="!text-slate-600">
                    Năm sản xuất: <strong>{listing.year}</strong>
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-3">
                  <Package size={20} className="!text-slate-500" />
                  <Typography variant="body2" className="!text-slate-600">
                    Loại tin:{" "}
                    <strong>
                      {listing.listingType === "buy_now"
                        ? "Mua ngay"
                        : "Có thể thương lượng"}
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

              {/* Action Buttons */}
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

            {/* Technical Specifications */}
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
                ) : (
                  <>
                    <Zap className="!text-blue-500" size={24} />
                    Thông số kỹ thuật Xe
                  </>
                )}
              </Typography>

              {isBattery ? (
                // Battery Specifications
                <Grid container spacing={3}>
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
                        {listing.battery?.voltage}V
                      </Typography>
                    </Box>
                  </Grid>
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
                        {listing.battery?.capacityWh}Wh
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Trọng lượng
                      </Typography>
                      <Typography variant="h6" className="!font-bold">
                        {listing.battery?.weightKg}kg
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Tuổi pin
                      </Typography>
                      <Typography variant="h6" className="!font-bold">
                        {listing.battery?.ageYears} năm
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Hãng sản xuất
                      </Typography>
                      <Typography variant="body1" className="!font-bold">
                        {listing.brand} - {listing.model}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                // E-Bike Specifications
                <Grid container spacing={3}>
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
                        {listing.ebike?.motorPowerW}W
                      </Typography>
                    </Box>
                  </Grid>
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
                        {listing.ebike?.batteryVoltage}V
                      </Typography>
                    </Box>
                  </Grid>
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
                        {listing.ebike?.rangeKm}km
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Khung xe
                      </Typography>
                      <Typography variant="h6" className="!font-bold">
                        {listing.ebike?.frameSize}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Số km đã đi
                      </Typography>
                      <Typography variant="h6" className="!font-bold">
                        {listing.ebike?.mileageKm?.toLocaleString()}km
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Trọng lượng
                      </Typography>
                      <Typography variant="h6" className="!font-bold">
                        {listing.ebike?.weightKg}kg
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Hãng sản xuất
                      </Typography>
                      <Typography variant="body1" className="!font-bold">
                        {listing.brand} - {listing.model}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box className="!p-3 !bg-slate-50 !rounded-xl">
                      <Typography variant="caption" className="!text-slate-600">
                        Năm sản xuất
                      </Typography>
                      <Typography variant="body1" className="!font-bold">
                        {listing.ebike?.yearOfManufacture}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Image Viewer Dialog */}
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
            <img
              src={listing.imageUrls[selectedImageIndex]}
              alt={listing.title}
              className="!w-full !h-auto"
            />
            {listing.imageUrls.length > 1 && (
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
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
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
