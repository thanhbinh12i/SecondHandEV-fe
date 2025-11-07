/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
  CircularProgress,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Chip,
} from "@mui/material";
import {
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
import { useGetMyAuctions } from "src/queries/useAuction";

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
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedAuction, setSelectedAuction] =
    useState<AuctionResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const pageSize = 10;

  const {
    data: auctionData,
    isLoading,
    isError,
  } = useGetMyAuctions({
    page: page,
    pageSize: pageSize,
  });

  const auctions = auctionData?.data.data || [];

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "Upcoming":
        return { label: "Sắp diễn ra", color: "warning" };
      case "Active":
        return { label: "Đang diễn ra", color: "success" };
      case "Ended":
        return { label: "Đã kết thúc", color: "error" };
      default:
        return { label: "Không xác định", color: "default" };
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
    return `${value.toLocaleString("vi-VN")} ₫`;
  };

  const filterAuctions = (status?: string) => {
    if (!status) return auctions;
    return auctions.filter((auction) => auction.status === status);
  };

  const upcomingAuctions = filterAuctions("Upcoming");
  const activeAuctions = filterAuctions("Active");
  const endedAuctions = filterAuctions("Ended");

  const totalPages = Math.ceil(auctions.length / pageSize);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
  };

  const AuctionCard = ({ auction }: { auction: AuctionResponse }) => {
    const { label, color } = getStatusLabel(auction.status);
    const timeRemaining = getTimeRemaining(auction.endDate);

    return (
      <Card className="!hover:shadow-lg !transition-shadow !mb-3">
        <CardContent>
          <Box className="!flex !justify-between !items-start !mb-3">
            <Box className="!flex-1">
              <Typography variant="h6" className="!font-bold !mb-1">
                {auction.listing.title || "Sản phẩm đấu giá"}
              </Typography>
              <Typography
                variant="body2"
                className="!text-slate-600 !mb-2 !line-clamp-2"
              >
                {auction.listing.description || "Chưa có mô tả"}
              </Typography>
              <Box className="!flex !items-center !gap-1 !text-slate-500">
                <User size={14} />
                <Typography variant="caption">
                  Người bán: {auction.seller.displayName || "Không rõ"}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={label}
              color={color as any}
              size="small"
              className="!font-semibold"
            />
          </Box>

          <Grid container spacing={2} className="!mb-3">
            <Grid size={{ xs: 6, md: 3 }}>
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
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Giá hiện tại
                </Typography>
                <Typography
                  variant="body2"
                  className="!font-bold !text-emerald-600"
                >
                  {auction.currentPrice
                    ? formatCurrency(auction.currentPrice)
                    : formatCurrency(auction.startingPrice)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Số lượt đấu
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {auction.totalBids || 0} lượt
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
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
              onClick={() => navigate(`/auctions/${auction.id}`)}
            >
              Xem
            </Button>
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
            {auction.status === "Upcoming" && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit size={16} />}
                  onClick={() => navigate(`/admin/auctions/edit/${auction.id}`)}
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

  if (isError) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Container maxWidth="sm">
          <Alert severity="error" icon={<AlertCircle size={24} />}>
            <Typography variant="h6" className="!font-bold !mb-2">
              Có lỗi xảy ra
            </Typography>
            <Typography variant="body2">
              Không thể tải danh sách đấu giá. Vui lòng thử lại sau.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

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
        </Box>

        {isLoading ? (
          <Box className="!flex !justify-center !items-center !py-12">
            <Box className="!text-center">
              <CircularProgress size={60} className="!text-blue-500" />
              <Typography variant="body2" className="!mt-4 !text-slate-600">
                Đang tải danh sách đấu giá...
              </Typography>
            </Box>
          </Box>
        ) : (
          <Paper className="!rounded-2xl">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
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
                      color="warning"
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

            {/* Pagination */}
            {auctions.length > 0 && (
              <Box className="!flex !justify-center !py-4 !border-t !border-slate-200">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Paper>
        )}
      </Container>

      {/* Detail Dialog */}
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
                  {selectedAuction.listing.title || "Không có tiêu đề"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Mô tả
                </Typography>
                <Typography variant="body2" className="!text-slate-700">
                  {selectedAuction.listing.description || "Chưa có mô tả"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Người bán
                </Typography>
                <Box className="!flex !items-center !gap-2 !mt-1">
                  <User size={16} className="!text-slate-500" />
                  <Typography variant="body2" className="!font-semibold">
                    {selectedAuction.seller.displayName || "Không rõ"}
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
                  Giá hiện tại
                </Typography>
                <Typography
                  variant="body2"
                  className="!font-bold !text-emerald-600"
                >
                  {selectedAuction.currentPrice
                    ? formatCurrency(selectedAuction.currentPrice)
                    : formatCurrency(selectedAuction.startingPrice)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="!text-slate-600">
                  Số lượt đấu giá
                </Typography>
                <Typography variant="body2" className="!font-semibold">
                  {selectedAuction.totalBids || 0} lượt
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
                  <Chip
                    label={getStatusLabel(selectedAuction.status).label}
                    color={getStatusLabel(selectedAuction.status).color as any}
                    size="small"
                    className="!font-semibold"
                  />
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
          {selectedAuction && (
            <Button
              variant="contained"
              onClick={() => navigate(`/auctions/${selectedAuction.id}`)}
            >
              Xem phiên đấu giá
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuctionManagementPage;
