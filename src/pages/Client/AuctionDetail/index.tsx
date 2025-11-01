import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  ArrowLeft,
  Gavel,
  Timer,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  Zap,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Battery,
} from "lucide-react";

interface AuctionData {
  id: number;
  listingId: number;
  title: string;
  description: string;
  startingPrice: number;
  listingType: string;
  startDate: string;
  endDate: string;
  sellerId: number;
  categoryName?: string;
  brand?: string;
  model?: string;
  year?: number;
  primaryImageUrl?: string;
  imageUrls?: string[];
  sellerDisplayName?: string;
  battery?: {
    voltage?: number;
    capacityWh?: number;
    weightKg?: number;
    condition?: string;
  };
}

interface BidData {
  bidId: number;
  auctionId: number;
  bidderId: number;
  bidderName: string;
  amount: number;
  createdAt: string;
}

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  console.log(id);

  const mockAuction: AuctionData = {
    id: 1,
    listingId: 101,
    title: "Pin Lithium 72V 40Ah - Chính hãng Samsung",
    description:
      "Pin lithium chính hãng Samsung với dung lượng 40Ah, điện áp 72V. Sản phẩm mới 100%, chưa qua sử dụng, bảo hành 24 tháng. Phù hợp cho xe đạp điện, xe máy điện cao cấp.\n\nĐặc điểm nổi bật:\n- Dung lượng cao 40Ah\n- Điện áp ổn định 72V\n- Tuổi thọ pin lên đến 2000 chu kỳ sạc\n- An toàn với hệ thống BMS bảo vệ\n- Trọng lượng nhẹ, dễ lắp đặt",
    startingPrice: 15000000,
    listingType: "auction",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    sellerId: 1,
    categoryName: "Pin xe điện",
    brand: "Samsung",
    model: "INR21700-40T",
    year: 2024,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
    ],
    sellerDisplayName: "Nguyễn Văn A",
    battery: {
      voltage: 72,
      capacityWh: 2880,
      weightKg: 12.5,
      condition: "Mới",
    },
  };

  const mockBids: BidData[] = [
    {
      bidId: 1,
      auctionId: 1,
      bidderId: 101,
      bidderName: "Trần Thị B",
      amount: 18500000,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      bidId: 2,
      auctionId: 1,
      bidderId: 102,
      bidderName: "Lê Văn C",
      amount: 18000000,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      bidId: 3,
      auctionId: 1,
      bidderId: 103,
      bidderName: "Phạm Thị D",
      amount: 17500000,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      bidId: 4,
      auctionId: 1,
      bidderId: 104,
      bidderName: "Hoàng Văn E",
      amount: 17000000,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      bidId: 5,
      auctionId: 1,
      bidderId: 105,
      bidderName: "Vũ Thị F",
      amount: 16500000,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ];

  const auction: AuctionData = mockAuction;
  const bids: BidData[] = mockBids;

  const currentPrice = bids.length > 0 ? bids[0].amount : auction.startingPrice;

  const totalBids = bids.length;
  const participants = new Set(bids.map((bid) => bid.bidderId)).size;

  const now = new Date().getTime();
  const startTime = new Date(auction.startDate).getTime();
  const endTime = new Date(auction.endDate).getTime();

  let auctionStatus: "pending" | "active" | "completed" = "active";
  if (now < startTime) {
    auctionStatus = "pending";
  } else if (now > endTime) {
    auctionStatus = "completed";
  }

  const imageUrls =
    auction.imageUrls ||
    (auction.primaryImageUrl ? [auction.primaryImageUrl] : []);
  const minBidIncrement = 100000;
  const minBidAmount = currentPrice + minBidIncrement;

  useEffect(() => {
    if (!auction?.endDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Đã kết thúc");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days} ngày ${hours} giờ ${minutes} phút`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours} giờ ${minutes} phút ${seconds} giây`);
      } else {
        setTimeRemaining(`${minutes} phút ${seconds} giây`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction?.endDate]);

  const getTimeProgress = () => {
    if (!auction?.startDate || !auction?.endDate) return 0;
    const now = new Date().getTime();
    const start = new Date(auction.startDate).getTime();
    const end = new Date(auction.endDate).getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (amount < minBidAmount) {
      alert(`Giá đấu tối thiểu là ${minBidAmount.toLocaleString()}₫`);
      return;
    }
    alert(`Đấu giá thành công với giá ${amount.toLocaleString()}₫`);
    setBidAmount("");
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return "Vừa xong";
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  if (!auction) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Box className="!text-center">
          <CircularProgress size={60} className="!text-emerald-500" />
          <Typography variant="h6" className="!mt-4 !text-slate-600">
            Đang tải thông tin đấu giá...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-blue-50/30 !to-emerald-50/30">
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
            <Paper className="!p-6 !rounded-2xl !shadow-xl !mb-4 !bg-gradient-to-br !from-white !to-emerald-50/30">
              <Box className="!flex !items-start !justify-between !mb-4">
                <Box>
                  <Typography variant="h4" className="!font-bold !mb-2">
                    {auction.title}
                  </Typography>
                  <Box className="!flex !items-center !gap-2">
                    <Chip
                      label={auction.categoryName || "Khác"}
                      className="!font-semibold"
                    />
                    {auction.brand && (
                      <Chip
                        label={auction.brand}
                        variant="outlined"
                        className="!font-semibold"
                      />
                    )}
                  </Box>
                </Box>
                {auctionStatus === "active" ? (
                  <Chip
                    label="Đang diễn ra"
                    className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-semibold !text-base !px-4 !py-6"
                    icon={<Zap size={18} className="!text-white" />}
                  />
                ) : auctionStatus === "pending" ? (
                  <Chip
                    label="Sắp diễn ra"
                    className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !font-semibold !text-base !px-4 !py-6"
                    icon={<Timer size={18} className="!text-white" />}
                  />
                ) : (
                  <Chip
                    label="Đã kết thúc"
                    className="!bg-slate-400 !text-white !font-semibold !text-base !px-4 !py-6"
                    icon={<Award size={18} className="!text-white" />}
                  />
                )}
              </Box>

              {auctionStatus === "active" && (
                <Box className="!mb-6 !p-6 !bg-gradient-to-r !from-red-50 !via-orange-50 !to-red-50 !rounded-2xl !border-2 !border-red-300 !shadow-lg">
                  <Box className="!flex !items-center !justify-between !mb-3">
                    <Box className="!flex !items-center !gap-3">
                      <Timer
                        size={32}
                        className="!text-red-500 !animate-pulse"
                      />
                      <Typography
                        variant="h5"
                        className="!font-bold !text-red-600"
                      >
                        Thời gian còn lại
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      className="!font-bold !text-slate-700 !bg-white !px-3 !py-1 !rounded-full"
                    >
                      {Math.round(getTimeProgress())}%
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    className="!font-bold !text-red-600 !mb-3"
                  >
                    {timeRemaining}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getTimeProgress()}
                    className="!h-3 !rounded-full !bg-slate-200"
                    sx={{
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(to right, #ef4444, #f97316)",
                      },
                    }}
                  />
                </Box>
              )}

              <Divider className="!my-6" />

              <Box className="!mb-6 !p-6 !bg-gradient-to-br !from-emerald-50 !to-blue-50 !rounded-2xl !border-2 !border-emerald-200">
                <Box className="!flex !items-end !justify-between !mb-3">
                  <Box>
                    <Typography
                      variant="body2"
                      className="!text-slate-600 !mb-1"
                    >
                      Giá khởi điểm
                    </Typography>
                    <Typography
                      variant="h6"
                      className="!font-bold !text-slate-500 !line-through"
                    >
                      {auction.startingPrice.toLocaleString()} ₫
                    </Typography>
                  </Box>
                  <TrendingUp size={48} className="!text-emerald-500" />
                </Box>
                <Typography
                  variant="h6"
                  className="!text-slate-600 !mb-1 !font-semibold"
                >
                  Giá hiện tại
                </Typography>
                <Typography
                  variant="h2"
                  className="!font-black !bg-gradient-to-r !from-emerald-600 !via-blue-600 !to-emerald-600 !bg-clip-text !text-transparent"
                >
                  {currentPrice.toLocaleString()} ₫
                </Typography>
              </Box>

              {/* Stats */}
              <Grid container spacing={3} className="!mb-6">
                <Grid size={{ xs: 4 }}>
                  <Box className="!p-4 !bg-blue-50 !rounded-2xl !text-center !border-2 !border-blue-200">
                    <Gavel
                      size={32}
                      className="!text-blue-600 !mx-auto !mb-2"
                    />
                    <Typography
                      variant="h4"
                      className="!font-bold !text-blue-600 !mb-1"
                    >
                      {totalBids}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="!text-slate-600 !font-semibold"
                    >
                      Lượt đấu giá
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box className="!p-4 !bg-emerald-50 !rounded-2xl !text-center !border-2 !border-emerald-200">
                    <Users
                      size={32}
                      className="!text-emerald-600 !mx-auto !mb-2"
                    />
                    <Typography
                      variant="h4"
                      className="!font-bold !text-emerald-600 !mb-1"
                    >
                      {participants}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="!text-slate-600 !font-semibold"
                    >
                      Người tham gia
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box className="!p-4 !bg-purple-50 !rounded-2xl !text-center !border-2 !border-purple-200">
                    <Award
                      size={32}
                      className="!text-purple-600 !mx-auto !mb-2"
                    />
                    <Typography
                      variant="h4"
                      className="!font-bold !text-purple-600 !mb-1"
                    >
                      #{auction.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="!text-slate-600 !font-semibold"
                    >
                      Mã phiên
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {auctionStatus === "active" && (
                <>
                  <Box className="!mb-4 !p-4 !bg-slate-50 !rounded-xl !border-2 !border-slate-200">
                    <Typography
                      variant="h6"
                      className="!font-bold !mb-3 !flex !items-center !gap-2"
                    >
                      <DollarSign size={24} className="!text-emerald-600" />
                      Đặt giá đấu của bạn
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder={`Tối thiểu ${minBidAmount.toLocaleString()}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DollarSign
                              size={24}
                              className="!text-emerald-600"
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className="!text-xl !font-bold"
                          >
                            ₫
                          </InputAdornment>
                        ),
                        className: "!text-2xl !font-bold",
                      }}
                    />
                    <Typography
                      variant="body2"
                      className="!text-slate-600 !mt-2 !font-semibold"
                    >
                      💡 Bước giá tối thiểu: {minBidIncrement.toLocaleString()}₫
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Gavel size={24} />}
                    className="!bg-gradient-to-r !from-emerald-500 !via-green-500 !to-emerald-600 !text-white !py-4 !text-xl !font-bold !shadow-lg !mb-3"
                    onClick={handlePlaceBid}
                  >
                    Đặt giá đấu ngay
                  </Button>
                </>
              )}

              {auctionStatus === "pending" && (
                <Alert
                  severity="info"
                  className="!mb-3 !rounded-xl"
                  icon={<Timer size={24} />}
                >
                  <Typography variant="h6" className="!font-bold !mb-1">
                    Buổi đấu giá chưa bắt đầu
                  </Typography>
                  <Typography variant="body2">
                    Bắt đầu vào:{" "}
                    {new Date(auction.startDate).toLocaleString("vi-VN")}
                  </Typography>
                </Alert>
              )}

              {auctionStatus === "completed" && (
                <Alert
                  severity="success"
                  className="!mb-3 !rounded-xl"
                  icon={<Award size={24} />}
                >
                  <Typography variant="h6" className="!font-bold !mb-1">
                    Buổi đấu giá đã kết thúc
                  </Typography>
                  <Typography variant="body2">
                    Giá cuối: {currentPrice.toLocaleString()}₫
                  </Typography>
                </Alert>
              )}
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-xl !bg-gradient-to-br !from-white !to-blue-50/30">
              <Typography
                variant="h5"
                className="!font-bold !mb-4 !flex !items-center !gap-3"
              >
                <TrendingUp size={28} className="!text-emerald-500" />
                Lịch sử đấu giá
              </Typography>

              {bids.length > 0 ? (
                <List className="!space-y-2">
                  {bids.map((bid, index) => (
                    <ListItem
                      key={bid.bidId}
                      className={`!rounded-2xl !p-4 !shadow-md ${
                        index === 0
                          ? "!bg-gradient-to-r !from-emerald-100 !via-green-50 !to-blue-100 !border-3 !border-emerald-400 !shadow-lg"
                          : "!bg-slate-50 !border-2 !border-slate-200"
                      }`}
                    >
                      <ListItemAvatar>
                        <Avatar
                          className={`!w-14 !h-14 ${
                            index === 0
                              ? "!bg-gradient-to-br !from-emerald-500 !to-blue-600 !shadow-lg"
                              : "!bg-slate-400"
                          }`}
                        >
                          {index === 0 ? (
                            <Award size={28} />
                          ) : (
                            <Typography variant="h6">
                              {bid.bidderName[0]}
                            </Typography>
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box className="!flex !items-center !justify-between !mb-1">
                            <Typography variant="h6" className="!font-bold">
                              {bid.bidderName}
                            </Typography>
                            {index === 0 && (
                              <Chip
                                label="🏆 CAO NHẤT"
                                size="small"
                                className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-bold !px-2"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box className="!flex !items-center !justify-between !mt-2">
                            <Typography
                              variant="h5"
                              className={`!font-black ${
                                index === 0
                                  ? "!text-emerald-600"
                                  : "!text-slate-700"
                              }`}
                            >
                              {bid.amount.toLocaleString()} ₫
                            </Typography>
                            <Typography
                              variant="body2"
                              className="!text-slate-600 !font-semibold"
                            >
                              {formatTimeAgo(bid.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box className="!text-center !py-12 !bg-slate-50 !rounded-2xl">
                  <Gavel size={64} className="!mx-auto !mb-4 !text-slate-300" />
                  <Typography
                    variant="h6"
                    className="!text-slate-600 !font-bold"
                  >
                    Chưa có lượt đấu giá nào
                  </Typography>
                  <Typography variant="body2" className="!text-slate-500">
                    Hãy là người đầu tiên đặt giá!
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper className="!rounded-2xl !overflow-hidden !shadow-xl !mb-4 !top-6">
              <Typography variant="h6" className="!font-bold !p-4 !bg-slate-50">
                📦 Thông tin sản phẩm
              </Typography>
              {imageUrls.length > 0 && (
                <Box className="!relative">
                  <img
                    src={imageUrls[selectedImageIndex]}
                    alt={auction.title}
                    className="!w-full !h-[400px] !object-cover !cursor-pointer"
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
                </Box>
              )}

              {imageUrls.length > 1 && (
                <Box className="!p-3 !flex !gap-2 !overflow-x-auto !bg-slate-50">
                  {imageUrls.map((url, index) => (
                    <Card
                      key={index}
                      className={`!cursor-pointer !flex-shrink-0 ${
                        selectedImageIndex === index
                          ? "!ring-4 !ring-emerald-500"
                          : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        image={url}
                        className="!w-20 !h-20 !object-cover"
                      />
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
              <Typography variant="h6" className="!font-bold !mb-3">
                📝 Mô tả chi tiết
              </Typography>
              <Typography className="!text-slate-700 !leading-relaxed !whitespace-pre-line">
                {auction.description || "Chưa có mô tả"}
              </Typography>
            </Paper>

            {auction.battery && (
              <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
                <Typography
                  variant="h6"
                  className="!font-bold !mb-4 !flex !items-center !gap-2"
                >
                  <Battery className="!text-orange-500" size={24} />
                  Thông số kỹ thuật
                </Typography>
                <Grid container spacing={3}>
                  {auction.battery.voltage && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-orange-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Điện áp
                        </Typography>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-orange-600"
                        >
                          {auction.battery.voltage}V
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {auction.battery.capacityWh && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-blue-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Dung lượng
                        </Typography>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-blue-600"
                        >
                          {auction.battery.capacityWh}Wh
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {auction.battery.weightKg && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-slate-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Trọng lượng
                        </Typography>
                        <Typography variant="h6" className="!font-bold">
                          {auction.battery.weightKg}kg
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {auction.battery.condition && (
                    <Grid size={{ xs: 6 }}>
                      <Box className="!p-3 !bg-emerald-50 !rounded-xl">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Tình trạng
                        </Typography>
                        <Typography
                          variant="h6"
                          className="!font-bold !text-emerald-600"
                        >
                          {auction.battery.condition}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            <Paper className="!p-6 !rounded-2xl !shadow-lg">
              <Typography variant="h6" className="!font-bold !mb-4">
                👤 Thông tin người bán
              </Typography>
              <Box className="!flex !items-center !gap-4 !mb-4">
                <Avatar className="!w-16 !h-16 !bg-gradient-to-br !from-emerald-500 !to-blue-600">
                  {auction.sellerDisplayName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Typography variant="h6" className="!font-bold">
                    {auction.sellerDisplayName || "Người bán"}
                  </Typography>
                  <Box className="!flex !items-center !gap-1 !text-slate-600">
                    <CheckCircle size={16} className="!text-emerald-500" />
                    <Typography variant="body2">Đã xác thực</Typography>
                  </Box>
                </Box>
              </Box>
              <Alert severity="info">
                <Typography variant="body2">
                  Liên hệ qua hệ thống để đảm bảo an toàn giao dịch
                </Typography>
              </Alert>
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
                  alt={auction.title}
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
      </Container>
    </Box>
  );
};

export default AuctionDetailPage;
