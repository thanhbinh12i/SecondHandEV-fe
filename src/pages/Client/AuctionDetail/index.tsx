/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Bell,
} from "lucide-react";
import AuctionMainInfo from "src/components/AuctionMainInfo";
import { useGetBidList, usePostBidMutation } from "src/queries/useBid";
import BidHistory from "src/components/BidHistory";
import { useGetAuctionById } from "src/queries/useAuction";
import { AppContext } from "src/contexts/app.context";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);

  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  const [newBidNotification, setNewBidNotification] = useState<{
    show: boolean;
    bidderName: string;
    amount: number;
  }>({ show: false, bidderName: "", amount: 0 });

  const previousBidCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef(true);

  const {
    data: auctionData,
    isLoading,
    refetch: refetchAuction,
  } = useGetAuctionById({
    id: Number(id),
    enabled: !!id,
  });

  const auction = auctionData?.data.data;

  const { data: bidData, refetch: refetchBids } = useGetBidList({
    id: Number(id),
    enabled: !!id && auction?.status === "Active",
    refetchInterval: auction?.status === "Active" ? 5000 : false,
    refetchIntervalInBackground: false,
  });

  const bids = bidData?.data.data;

  const postBidMutation = usePostBidMutation();

  useEffect(() => {
    if (!bids || bids.length === 0) return;

    const currentBidCount = bids.length;

    if (isFirstLoadRef.current) {
      previousBidCountRef.current = currentBidCount;
      isFirstLoadRef.current = false;
      return;
    }

    if (currentBidCount > previousBidCountRef.current) {
      const latestBid = bids[0];

      if (latestBid.bidderId !== profile?.memberId) {
        setNewBidNotification({
          show: true,
          bidderName: latestBid.bidderName,
          amount: latestBid.amount,
        });
      }

      previousBidCountRef.current = currentBidCount;
    }
  }, [bids, profile?.memberId]);

  useEffect(() => {
    if (!auction || auction.status !== "Active") return;

    const checkInterval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auction.endDate).getTime();
      const timeLeft = end - now;

      if (timeLeft <= 60000 || timeLeft <= 0) {
        refetchAuction();

        if (timeLeft <= 0) {
          setAlertDialog({
            open: true,
            type: "info",
            title: "Phiên đấu giá đã kết thúc",
            message:
              "Phiên đấu giá này đã hết thời gian. Cảm ơn bạn đã tham gia!",
          });
          clearInterval(checkInterval);
        }
      }
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [auction, refetchAuction]);

  const handlePlaceBid = async (amount: number) => {
    if (!auction || !id || !profile?.memberId) return;

    if (auction.status !== "Active") {
      setAlertDialog({
        open: true,
        type: "error",
        title: "Không thể đặt giá",
        message:
          auction.status === "Ended"
            ? "Phiên đấu giá đã kết thúc!"
            : "Phiên đấu giá chưa bắt đầu hoặc đã kết thúc!",
      });
      return;
    }

    const now = new Date().getTime();
    const endTime = new Date(auction.endDate).getTime();
    if (now >= endTime) {
      setAlertDialog({
        open: true,
        type: "error",
        title: "Đấu giá đã kết thúc",
        message: "Phiên đấu giá này đã hết thời gian!",
      });
      await refetchAuction();
      return;
    }

    try {
      await postBidMutation.mutateAsync({
        auctionId: Number(id),
        bidderId: profile?.memberId,
        amount: amount,
      });

      await refetchBids();

      setAlertDialog({
        open: true,
        type: "success",
        title: "Đấu giá thành công!",
        message: `Bạn đã đặt giá ${amount.toLocaleString()}₫`,
      });
    } catch (error: any) {
      console.error("Error placing bid:", error);
      setAlertDialog({
        open: true,
        type: "error",
        title: "Đấu giá thất bại",
        message: error?.response?.data?.message || "Có lỗi xảy ra!",
      });
    }
  };

  const handleManualRefresh = async () => {
    await Promise.all([refetchAuction(), refetchBids()]);
  };

  const handleCloseNotification = () => {
    setNewBidNotification({ show: false, bidderName: "", amount: 0 });
  };

  if (isLoading) {
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

  if (!auction) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Typography variant="h6" className="!text-slate-600">
          Không tìm thấy phiên đấu giá
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-blue-50/30 !to-emerald-50/30">
      <Container maxWidth="xl" className="!py-6">
        <Box className="!flex !items-center !justify-between !mb-4">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!text-slate-600 hover:!bg-slate-100 !rounded-xl"
          >
            Quay lại
          </Button>

          <Box className="!flex !items-center !gap-3">
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshCw size={16} />}
              onClick={handleManualRefresh}
              className="!text-blue-600 !border-blue-600 hover:!bg-blue-50 !rounded-xl"
            >
              Làm mới
            </Button>
          </Box>
        </Box>

        <Box className="!grid !grid-cols-1 lg:!grid-cols-12 !gap-4">
          <Box className="lg:!col-span-7">
            <AuctionMainInfo
              auction={auction}
              bids={bids ?? []}
              onPlaceBid={handlePlaceBid}
            />
          </Box>

          <Box className="lg:!col-span-5">
            <BidHistory bids={bids ?? []} />
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={newBidNotification.show}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: { xs: 70, sm: 24 } }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="warning"
          variant="filled"
          icon={<Bell className="!animate-bounce" />}
          className="!bg-gradient-to-r !from-orange-500 !to-red-600 !shadow-2xl"
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          <Box>
            <Typography variant="subtitle1" className="!font-bold !mb-1">
              🔥 Có giá mới vừa được đặt!
            </Typography>
            <Typography variant="body2">
              <strong>{newBidNotification.bidderName}</strong> đã đặt giá{" "}
              <strong className="!text-yellow-300">
                {newBidNotification.amount.toLocaleString()}₫
              </strong>
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      <Dialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ ...alertDialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "!rounded-3xl !shadow-2xl" }}
      >
        <Box
          className={`!p-6 ${
            alertDialog.type === "success"
              ? "!bg-emerald-50"
              : alertDialog.type === "error"
              ? "!bg-red-50"
              : "!bg-blue-50"
          }`}
        >
          <Box className="!flex !flex-col !items-center !text-center">
            <Box className="!mb-4">
              {alertDialog.type === "success" && (
                <CheckCircle size={64} className="!text-emerald-500" />
              )}
              {alertDialog.type === "error" && (
                <AlertCircle size={64} className="!text-red-500" />
              )}
              {alertDialog.type === "info" && (
                <Bell size={64} className="!text-blue-500" />
              )}
            </Box>

            <DialogTitle className="!p-0 !mb-2">
              <Typography variant="h4" className="!font-bold">
                {alertDialog.title}
              </Typography>
            </DialogTitle>

            <DialogContent className="!p-0 !mb-6">
              <Typography variant="body1" className="!text-slate-600">
                {alertDialog.message}
              </Typography>
            </DialogContent>

            <DialogActions className="!p-0">
              <Button
                onClick={() => setAlertDialog({ ...alertDialog, open: false })}
                variant="contained"
                className={`!rounded-full !px-8 !py-3 !font-bold ${
                  alertDialog.type === "success"
                    ? "!bg-emerald-500"
                    : alertDialog.type === "error"
                    ? "!bg-red-500"
                    : "!bg-blue-500"
                }`}
              >
                Đóng
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AuctionDetailPage;
