import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import AuctionMainInfo from "src/components/AuctionMainInfo";
import { useGetBidList, usePostBidMutation } from "src/queries/useBid";
import BidHistory from "src/components/BidHistory";
import { useGetAuctionById } from "src/queries/useAuction";
import { AppContext } from "src/contexts/app.context";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);

  const { data: auctionData, isLoading } = useGetAuctionById({
    id: Number(id),
    enabled: !!id,
  });

  const auction = auctionData?.data.data;

  const { data: bidData } = useGetBidList({
    id: Number(id),
    enabled: !!id,
  });

  const bids = bidData?.data.data;

  const postBidMutation = usePostBidMutation();

  const handlePlaceBid = async (amount: number) => {
    if (!auction || !id || !profile?.memberId) return;

    try {
      await postBidMutation.mutateAsync({
        auctionId: Number(id),
        bidderId: profile?.memberId,
        amount: amount,
      });

      alert(`Đấu giá thành công với giá ${amount.toLocaleString()}₫`);
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Có lỗi xảy ra khi đặt giá. Vui lòng thử lại!");
    }
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
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          className="!mb-4 !text-slate-600"
        >
          Quay lại
        </Button>

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
    </Box>
  );
};

export default AuctionDetailPage;
