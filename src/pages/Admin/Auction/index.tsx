import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Plus,
  Gavel,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { AuctionResponse } from "src/types/auction.type";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box className="!p-4">{children}</Box>}
    </div>
  );
}

const AuctionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAuction, setSelectedAuction] =
    useState<AuctionResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setIsLoading(true);

        const mockAuctions: AuctionResponse[] = [
          {
            id: 1,
            listing: {
              listingId: 101,
              title: "Pin LFP 48V 200Ah Pin Xe Điện",
              description:
                "Pin LiFePO4 chất lượng cao, dung lượng 200Ah, điện áp 48V, tuổi thọ 5000+ chu kỳ, bảo hành 5 năm",
              price: 50000000,
              listingType: "auction",
            },
            startingPrice: 45000000,
            startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            seller: {
              memberId: 1,
              displayName: "Nguyễn Văn A",
              email: "nguyenvana@example.com",
              phone: "0901234567",
            },
          },
          {
            id: 2,
            listing: {
              listingId: 102,
              title: "Pin Lithium 72V 150Ah Xe Điện Cao Cấp",
              description:
                "Pin Lithium ion công suất cao, điện áp 72V, dung lượng 150Ah, hiệu suất 98%, tích hợp BMS thông minh",
              price: 70000000,
              listingType: "auction",
            },
            startingPrice: 65000000,
            startDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            seller: {
              memberId: 2,
              displayName: "Trần Thị B",
              email: "tranthib@example.com",
              phone: "0912345678",
            },
          },
          {
            id: 3,
            listing: {
              listingId: 103,
              title: "Pin LFP 48V 100Ah Đôi Bánh",
              description:
                "Pin LiFePO4 cho xe đôi bánh, 48V 100Ah, nhẹ, an toàn, thích hợp cho city bike",
              price: 25000000,
              listingType: "auction",
            },
            startingPrice: 22000000,
            startDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            seller: {
              memberId: 3,
              displayName: "Lê Văn C",
              email: "levanc@example.com",
              phone: "0923456789",
            },
          },
          {
            id: 4,
            listing: {
              listingId: 104,
              title: "Pin Lithium 96V 200Ah Xe Điện 3 Bánh",
              description:
                "Pin lithium cao cấp 96V 200Ah, công suất lớn, cho xe 3 bánh chở hàng, quãng đường 300km",
              price: 95000000,
              listingType: "auction",
            },
            startingPrice: 90000000,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            seller: {
              memberId: 4,
              displayName: "Phạm Thị D",
              email: "phamthid@example.com",
              phone: "0934567890",
            },
          },
        ];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAuctions(mockAuctions);
      } catch (error) {
        console.error("Error loading auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuctions();
  }, []);

  const getAuctionStatus = (
    startDate: string,
    endDate: string
  ): {
    status: "upcoming" | "active" | "ended";
    label: string;
    color: string;
  } => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: "upcoming", label: "Sắp diễn ra", color: "warning" };
    } else if (now >= start && now < end) {
      return { status: "active", label: "Đang diễn ra", color: "success" };
    } else {
      return { status: "ended", label: "Đã kết thúc", color: "error" };
    }
  };

  const getTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Đã kết thúc";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} ngày ${hours} giờ`;
    } else if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else {
      return `${minutes} phút`;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString("vi-VN")} đ`;
  };

  const filterAuctions = (status?: "upcoming" | "active" | "ended") => {
    let filtered = auctions;

    if (status) {
      filtered = filtered.filter((auction) => {
        const auctionStatus = getAuctionStatus(
          auction.startDate,
          auction.endDate
        );
        return auctionStatus.status === status;
      });
    }

    return filtered;
  };

  const upcomingAuctions = filterAuctions("upcoming");
  const activeAuctions = filterAuctions("active");
  const endedAuctions = filterAuctions("ended");

  const AuctionCard = ({ auction }: { auction: AuctionResponse }) => {
    const { status, label, color } = getAuctionStatus(
      auction.startDate,
      auction.endDate
    );
    const timeRemaining = getTimeRemaining(auction.endDate);

    return (
      <Card className="!hover:shadow-lg !transition-shadow !mb-3">
        <CardContent>
          <Box className="!flex !justify-between !items-start !mb-3">
            <Box className="!flex-1">
              <Typography variant="h6" className="!font-bold !mb-1">
                {auction.listing.title}
              </Typography>
              <Typography variant="body2" className="!text-slate-600 !mb-2">
                {auction.listing.description}
              </Typography>
              <Box className="!flex !items-center !gap-1 !text-slate-500">
                <User size={14} />
                <Typography variant="caption">
                  Người bán: {auction.seller.displayName}
                </Typography>
              </Box>
            </Box>
            <Box
              className={`!px-3 !py-1 !rounded-full !text-xs !font-semibold ${
                color === "warning"
                  ? "!bg-yellow-100 !text-yellow-800"
                  : color === "success"
                  ? "!bg-green-100 !text-green-800"
                  : "!bg-red-100 !text-red-800"
              }`}
            >
              {label}
            </Box>
          </Box>

          <Grid container spacing={2} className="!mb-3">
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Giá khởi điểm
                </Typography>
                <Typography
                  variant="body2"
                  className="!font-bold !text-blue-600"
                >
                  {formatCurrency(auction.startingPrice)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Bắt đầu
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {new Date(auction.startDate).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Kết thúc
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {new Date(auction.endDate).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Thời gian còn lại
                </Typography>
                <Box className="!flex !items-center !gap-1 !mt-1">
                  <Clock size={14} className="!text-slate-500" />
                  <Typography
                    variant="caption"
                    className="!font-semibold !text-slate-700"
                  >
                    {timeRemaining}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box className="!flex !gap-2 !justify-end">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Eye size={16} />}
              onClick={() => {
                setSelectedAuction(auction);
                setDetailDialogOpen(true);
              }}
            >
              Chi tiết
            </Button>
            {status !== "active" && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit size={16} />}
                >
                  Sửa
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                >
                  Xóa
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="xl" className="!py-6">
        <Box className="!flex !items-center !justify-between !mb-6">
          <Box className="!flex !items-center !gap-3">
            <Gavel size={32} className="!text-blue-600" />
            <Typography variant="h4" className="!font-bold">
              Quản lý buổi đấu giá
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/admin/auctions/create")}
            className="!bg-gradient-to-r !from-blue-500 !to-blue-600"
          >
            Tạo buổi đấu giá
          </Button>
        </Box>

        {isLoading ? (
          <Box className="!flex !justify-center !items-center !py-12">
            <CircularProgress />
          </Box>
        ) : (
          <Paper className="!rounded-2xl">
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              className="!border-b !border-slate-200"
            >
              <Tab
                label={
                  <Box className="!flex !items-center !gap-2">
                    <Zap size={18} />
                    <span>Sắp diễn ra</span>
                    <Chip
                      label={upcomingAuctions.length}
                      size="small"
                      className="!ml-1"
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box className="!flex !items-center !gap-2">
                    <CheckCircle size={18} />
                    <span>Đang diễn ra</span>
                    <Chip
                      label={activeAuctions.length}
                      size="small"
                      className="!ml-1"
                      color="success"
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box className="!flex !items-center !gap-2">
                    <AlertCircle size={18} />
                    <span>Đã kết thúc</span>
                    <Chip
                      label={endedAuctions.length}
                      size="small"
                      className="!ml-1"
                    />
                  </Box>
                }
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {upcomingAuctions.length === 0 ? (
                <Alert severity="info" icon={<AlertCircle />}>
                  Không có buổi đấu giá nào sắp diễn ra
                </Alert>
              ) : (
                <Box>
                  {upcomingAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {activeAuctions.length === 0 ? (
                <Alert severity="info" icon={<AlertCircle />}>
                  Không có buổi đấu giá nào đang diễn ra
                </Alert>
              ) : (
                <Box>
                  <Alert severity="success" className="!mb-4" icon={<Zap />}>
                    <Typography variant="body2">
                      Các buổi đấu giá đang diễn ra sẽ không thể sửa hoặc xóa
                    </Typography>
                  </Alert>
                  {activeAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {endedAuctions.length === 0 ? (
                <Alert severity="info" icon={<AlertCircle />}>
                  Không có buổi đấu giá nào đã kết thúc
                </Alert>
              ) : (
                <Box>
                  {endedAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </Box>
              )}
            </TabPanel>
          </Paper>
        )}
      </Container>

      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" className="!font-bold">
            Chi tiết buổi đấu giá
          </Typography>
        </DialogTitle>
        {selectedAuction && (
          <DialogContent>
            <Box className="!space-y-4 !mt-4">
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Tên sản phẩm
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {selectedAuction.listing.title}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Mô tả
                </Typography>
                <Typography variant="body2" className="!text-slate-700">
                  {selectedAuction.listing.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Người bán
                </Typography>
                <Box className="!flex !items-center !gap-2 !mt-1">
                  <User size={16} className="!text-slate-500" />
                  <Typography variant="body2" className="!font-semibold">
                    {selectedAuction.seller.displayName}
                  </Typography>
                </Box>
                {selectedAuction.seller.email && (
                  <Typography
                    variant="caption"
                    className="!text-slate-600 !ml-6"
                  >
                    Email: {selectedAuction.seller.email}
                  </Typography>
                )}
                {selectedAuction.seller.phone && (
                  <Typography
                    variant="caption"
                    className="!text-slate-600 !ml-6 !block"
                  >
                    SĐT: {selectedAuction.seller.phone}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Giá khởi điểm
                </Typography>
                <Typography
                  variant="body2"
                  className="!font-bold !text-blue-600"
                >
                  {formatCurrency(selectedAuction.startingPrice)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Thời gian bắt đầu
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {formatDate(selectedAuction.startDate)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Thời gian kết thúc
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {formatDate(selectedAuction.endDate)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Trạng thái
                </Typography>
                <Box className="!mt-1">
                  {getAuctionStatus(
                    selectedAuction.startDate,
                    selectedAuction.endDate
                  ).status === "upcoming" && (
                    <Chip
                      label="Sắp diễn ra"
                      color="warning"
                      size="small"
                      className="!font-semibold"
                    />
                  )}
                  {getAuctionStatus(
                    selectedAuction.startDate,
                    selectedAuction.endDate
                  ).status === "active" && (
                    <Chip
                      label="Đang diễn ra"
                      color="success"
                      size="small"
                      className="!font-semibold"
                      icon={<Zap size={14} />}
                    />
                  )}
                  {getAuctionStatus(
                    selectedAuction.startDate,
                    selectedAuction.endDate
                  ).status === "ended" && (
                    <Chip
                      label="Đã kết thúc"
                      color="error"
                      size="small"
                      className="!font-semibold"
                    />
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Thời gian còn lại
                </Typography>
                <Box className="!flex !items-center !gap-2 !mt-1">
                  <Clock size={16} className="!text-slate-500" />
                  <Typography
                    variant="body2"
                    className="!font-semibold !text-slate-700"
                  >
                    {getTimeRemaining(selectedAuction.endDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuctionManagementPage;
