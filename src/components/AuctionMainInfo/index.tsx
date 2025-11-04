import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Divider,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Gavel,
  Timer,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  Zap,
} from "lucide-react";
import { AuctionResponse } from "src/types/auction.type";
import { BidResponse } from "src/types/bid.type";

interface AuctionMainInfoProps {
  auction: AuctionResponse;
  bids: BidResponse[];
  onPlaceBid: (amount: number) => void;
}

const AuctionMainInfo: React.FC<AuctionMainInfoProps> = ({
  auction,
  bids,
  onPlaceBid,
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const currentPrice = bids.length > 0 ? bids[0].amount : auction.startingPrice;
  const totalBids = bids.length;
  const participants = new Set(bids.map((bid) => bid.bidderId)).size;

  const minBidIncrement = 100000;
  const minBidAmount = currentPrice + minBidIncrement;

  const getAuctionStatus = (): "pending" | "active" | "completed" => {
    const now = new Date().getTime();
    const startTime = new Date(auction.startDate).getTime();
    const endTime = new Date(auction.endDate).getTime();

    if (now < startTime) return "pending";
    if (now > endTime) return "completed";
    return "active";
  };

  const auctionStatus = getAuctionStatus();

  useEffect(() => {
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
  }, [auction.endDate]);

  const getTimeProgress = (): number => {
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
    onPlaceBid(amount);
    setBidAmount("");
  };

  return (
    <Paper className="!p-6 !rounded-2xl !shadow-xl !bg-gradient-to-br !from-white !to-emerald-50/30">
      <Box className="!flex !items-start !justify-between !mb-4">
        <Box>
          <Typography variant="h6" className="!font-bold !mb-2">
            {auction.listing.title}
          </Typography>
        </Box>
        {auctionStatus === "active" ? (
          <Chip
            label="Đang diễn ra"
            className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-semibold !text-base !px-4 !py-4"
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
              <Timer size={32} className="!text-red-500 !animate-pulse" />
              <Typography variant="h6" className="!font-bold !text-red-600">
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
          <Typography variant="h5" className="!font-bold !text-red-600 !mb-3">
            {timeRemaining}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getTimeProgress()}
            className="!h-3 !rounded-full !bg-slate-200"
            sx={{
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(to right, #ef4444, #f97316)",
              },
            }}
          />
        </Box>
      )}

      <Divider className="!my-6" />

      <Box className="!mb-6 !p-6 !bg-gradient-to-br !from-emerald-50 !to-blue-50 !rounded-2xl !border-2 !border-emerald-200">
        <Box className="!flex !items-end !justify-between !mb-3">
          <Box>
            <Typography variant="body2" className="!text-slate-600 !mb-1">
              Giá khởi điểm
            </Typography>
            <Typography
              variant="h6"
              className="!font-bold !text-slate-500 !line-through"
            >
              {auction.startingPrice.toLocaleString()} ₫
            </Typography>
          </Box>
          <TrendingUp size={40} className="!text-emerald-500" />
        </Box>
        <Typography
          variant="h6"
          className="!text-slate-600 !mb-1 !font-semibold"
        >
          Giá hiện tại
        </Typography>
        <Typography
          variant="h3"
          className="!font-black !bg-gradient-to-r !from-emerald-600 !via-blue-600 !to-emerald-600 !bg-clip-text !text-transparent"
        >
          {currentPrice.toLocaleString()} ₫
        </Typography>
      </Box>

      <Grid container spacing={3} className="!mb-6">
        <Grid size={{ xs: 4 }}>
          <Box className="!p-4 !bg-blue-50 !rounded-2xl !text-center !border-2 !border-blue-200">
            <Gavel size={32} className="!text-blue-600 !mx-auto !mb-2" />
            <Typography
              variant="h5"
              className="!font-bold !text-blue-600 !mb-1"
            >
              {totalBids}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box className="!p-4 !bg-emerald-50 !rounded-2xl !text-center !border-2 !border-emerald-200">
            <Users size={32} className="!text-emerald-600 !mx-auto !mb-2" />
            <Typography
              variant="h5"
              className="!font-bold !text-emerald-600 !mb-1"
            >
              {participants}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box className="!p-4 !bg-purple-50 !rounded-2xl !text-center !border-2 !border-purple-200">
            <Award size={32} className="!text-purple-600 !mx-auto !mb-2" />
            <Typography
              variant="h5"
              className="!font-bold !text-purple-600 !mb-1"
            >
              #{auction.id}
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
                    <DollarSign size={24} className="!text-emerald-600" />
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
            className="!bg-gradient-to-r !from-emerald-500 !via-green-500 !to-emerald-600 !text-white !py-4 !text-xl !font-bold !shadow-lg"
            onClick={handlePlaceBid}
          >
            Đặt giá đấu ngay
          </Button>
        </>
      )}

      {auctionStatus === "pending" && (
        <Alert
          severity="info"
          className="!mt-4 !rounded-xl"
          icon={<Timer size={24} />}
        >
          <Typography variant="h6" className="!font-bold !mb-1">
            Buổi đấu giá chưa bắt đầu
          </Typography>
          <Typography variant="body2">
            Bắt đầu vào: {new Date(auction.startDate).toLocaleString("vi-VN")}
          </Typography>
        </Alert>
      )}

      {auctionStatus === "completed" && (
        <Alert
          severity="success"
          className="!mt-4 !rounded-xl"
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
  );
};

export default AuctionMainInfo;
