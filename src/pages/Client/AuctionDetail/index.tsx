import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { AuctionResponse } from "src/types/auction.type";
import { BidResponse } from "src/types/bid.type";
import AuctionMainInfo from "src/components/AuctionMainInfo";
import { usePostBidMutation } from "src/queries/useBid";
import BidHistory from "src/components/BidHistory";
import AuctionSidebar from "src/components/AuctionSidebar";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<AuctionResponse | null>(null);
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const postBidMutation = usePostBidMutation();

  useEffect(() => {
    const loadAuctionData = async () => {
      try {
        setIsLoading(true);

        const mockAuction: AuctionResponse = {
          id: 1,
          listing: {
            listingId: 101,
            title: "Pin Lithium 72V 40Ah - Chính hãng Samsung",
            description:
              "Pin lithium chính hãng Samsung với dung lượng 40Ah, điện áp 72V. Sản phẩm mới 100%, chưa qua sử dụng, bảo hành 24 tháng. Phù hợp cho xe đạp điện, xe máy điện cao cấp.\n\nĐặc điểm nổi bật:\n- Dung lượng cao 40Ah\n- Điện áp ổn định 72V\n- Tuổi thọ pin lên đến 2000 chu kỳ sạc\n- An toàn với hệ thống BMS bảo vệ\n- Trọng lượng nhẹ, dễ lắp đặt",
            price: 20000000,
            listingType: "auction",
          },
          startingPrice: 15000000,
          startDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          endDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          seller: {
            memberId: 1,
            displayName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
          },
        };

        const mockBids: BidResponse[] = [
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

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setAuction(mockAuction);
        setBids(mockBids);
      } catch (error) {
        console.error("Error loading auction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAuctionData();
    }
  }, [id]);

  const handlePlaceBid = async (amount: number) => {
    if (!auction || !id) return;

    try {
      const currentUserId = 1;

      await postBidMutation.mutateAsync({
        auctionId: Number(id),
        bidderId: currentUserId,
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
              bids={bids}
              onPlaceBid={handlePlaceBid}
            />
            <Box className="!mt-4">
              <BidHistory bids={bids} />
            </Box>
          </Box>

          <Box className="lg:!col-span-5">
            <AuctionSidebar auction={auction} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuctionDetailPage;
