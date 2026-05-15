import React, { useState, useEffect } from "react";
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
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Plus,
  Gavel,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ListingDto } from "src/types/listing.type";
import {
  useDeleteListingMutation,
  useGetMyListing,
} from "src/queries/useListing";
import { useConvertToSaleMutation } from "src/queries/useListing";
import { useGetAuctionByListingId } from "src/queries/useAuction";

const ListingAuctionButton: React.FC<{ listing: ListingDto }> = ({
  listing,
}) => {
  const navigate = useNavigate();

  const { data: auctionData, isLoading } = useGetAuctionByListingId({
    listingId: listing.listingId,
    enabled:
      listing.listingType === "auction" && listing.listingStatus === "active",
  });

  const auction = auctionData?.data.data;

  if (listing.listingType !== "auction" || listing.listingStatus !== "active") {
    return null;
  }

  if (isLoading) {
    return (
      <Button
        fullWidth
        variant="contained"
        disabled
        className="!bg-slate-300 !rounded-xl"
      >
        <CircularProgress size={20} className="!mr-2" />
        Đang tải...
      </Button>
    );
  }

  if (auction) {
    return (
      <Button
        fullWidth
        variant="contained"
        startIcon={<Eye size={18} />}
        onClick={() => navigate(`/auctions/${auction.id}`)}
        className="!bg-gradient-to-r !from-blue-500 !to-indigo-600 !font-semibold !rounded-xl !shadow-lg hover:!shadow-xl"
      >
        Xem buổi đấu giá
      </Button>
    );
  }

  return (
    <Button
      fullWidth
      variant="contained"
      startIcon={<Gavel size={18} />}
      onClick={() => navigate(`/auctions/create?id=${listing.listingId}`)}
      className="!bg-gradient-to-r !from-purple-500 !to-pink-600 !font-semibold !rounded-xl !shadow-lg hover:!shadow-xl"
    >
      Tạo buổi đấu giá
    </Button>
  );
};

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<ListingDto | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [convertPrice, setConvertPrice] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data, isLoading, refetch: refetchListings } = useGetMyListing();
  const convertToSaleMutation = useConvertToSaleMutation();
  const deleteListingMutation = useDeleteListingMutation();

  const { data: auctionData, isLoading: isAuctionLoading } =
    useGetAuctionByListingId({
      listingId: selectedListing?.listingId || 0,
      enabled: !!selectedListing && selectedListing.listingType === "auction",
    });

  const auction = auctionData?.data.data;
  const hasAuction = !!auction;

  const listings = data?.data.items || [];

  useEffect(() => {
    if (convertDialogOpen && auction) {
      if (auction.status === "Ended") {
        setConvertPrice(
          auction.currentPrice?.toString() ||
            selectedListing?.price?.toString() ||
            ""
        );
      } else {
        setConvertPrice(selectedListing?.price?.toString() || "");
      }
    }
  }, [convertDialogOpen, auction, selectedListing]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "!bg-emerald-100 !text-emerald-700";
      case "pending":
        return "!bg-amber-100 !text-amber-700";
      case "sold":
        return "!bg-slate-100 !text-slate-700";
      case "reject":
        return "!bg-red-100 !text-red-700";
      default:
        return "!bg-slate-100 !text-slate-700";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Đang bán";
      case "pending":
        return "Chờ duyệt";
      case "sold":
        return "Đã bán";
      case "reject":
        return "Từ chối";
      default:
        return status || "Không xác định";
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.model?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && listing.listingStatus === "active") ||
      (tabValue === 2 && listing.listingStatus === "pending") ||
      (tabValue === 3 && listing.listingStatus === "sold");

    return matchesSearch && matchesTab;
  });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    listing: ListingDto
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/listing/edit/${selectedListing?.listingId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedListing?.listingId) return;

    try {
      await deleteListingMutation.mutateAsync(selectedListing.listingId);

      await refetchListings();

      setSnackbar({
        open: true,
        message: "Đã xóa tin đăng thành công!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa tin đăng!",
        severity: "error",
      });
    }
  };

  const handleCreateAuction = (listing: ListingDto) => {
    navigate(`/auctions/create?id=${listing.listingId}`);
  };

  const handleOpenConvertDialog = () => {
    setConvertDialogOpen(true);
    handleMenuClose();
  };

  const handleConvertToSale = async () => {
    if (!selectedListing) return;

    if (auction.status !== "Ended") return;

    try {
      await convertToSaleMutation.mutateAsync({
        listingId: selectedListing.listingId,
        price: Number(convertPrice),
        commissionPrice: Number(convertPrice) * 0.05,
      });
      await refetchListings();
      setConvertDialogOpen(false);
      setConvertPrice("");
      setSnackbar({
        open: true,
        message: "Chuyển đổi thành công!!",
        severity: "success",
      });
      setSelectedListing(null);
    } catch (error) {
      console.error("Error converting to sale:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra!",
        severity: "error",
      });
    }
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

  const isAuctionActive = () => {
    return auction && auction.status === "Active";
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
            Tin đăng của tôi
          </Typography>
          <Typography className="!text-slate-600">
            Quản lý các tin đăng bán xe điện và pin của bạn
          </Typography>
        </Box>

        <Grid container spacing={3} className="!mb-8">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-emerald-500 !to-emerald-600 !text-white">
              <Typography variant="body2" className="!mb-2 !opacity-90">
                Tổng tin đăng
              </Typography>
              <Typography variant="h3" className="!font-bold">
                {listings.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white">
              <Typography variant="body2" className="!mb-2 !opacity-90">
                Đang bán
              </Typography>
              <Typography variant="h3" className="!font-bold">
                {listings.filter((l) => l.listingStatus === "active").length}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-amber-500 !to-amber-600 !text-white">
              <Typography variant="body2" className="!mb-2 !opacity-90">
                Chờ duyệt
              </Typography>
              <Typography variant="h3" className="!font-bold">
                {listings.filter((l) => l.listingStatus === "pending").length}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className="!p-6 !bg-gradient-to-br !from-slate-500 !to-slate-600 !text-white">
              <Typography variant="body2" className="!mb-2 !opacity-90">
                Đã bán
              </Typography>
              <Typography variant="h3" className="!font-bold">
                {listings.filter((l) => l.listingStatus === "sold").length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper className="!p-4 !mb-6">
          <Box className="!flex !flex-col md:!flex-row !gap-4 !justify-between !items-center">
            <TextField
              placeholder="Tìm kiếm tin đăng..."
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
              onClick={() => navigate("/post")}
              className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !font-semibold !px-6 !rounded-xl !whitespace-nowrap"
            >
              Đăng tin mới
            </Button>
          </Box>
        </Paper>

        <Paper className="!mb-6">
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
            <Tab label="Đang bán" />
            <Tab label="Chờ duyệt" />
            <Tab label="Đã bán" />
          </Tabs>
        </Paper>

        {filteredListings.length === 0 ? (
          <Paper className="!p-12 !text-center">
            <Typography variant="h6" className="!text-slate-600 !mb-4">
              {searchQuery
                ? "Không tìm thấy tin đăng nào"
                : "Bạn chưa có tin đăng nào"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate("/post")}
              className="!bg-gradient-to-r !from-emerald-500 !to-blue-600"
            >
              Đăng tin đầu tiên
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredListings.map((listing) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={listing.listingId}
              >
                <Card
                  sx={{ height: 450 }}
                  className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-105"
                >
                  <Box className="!relative">
                    <CardMedia
                      component="img"
                      height="200"
                      image={listing.primaryImageUrl}
                      alt={listing.title}
                      className="!h-48 !object-cover"
                    />
                    <Chip
                      label={getStatusLabel(listing.listingStatus)}
                      size="small"
                      className={`!absolute !top-3 !left-3 ${getStatusColor(
                        listing.listingStatus
                      )} !font-semibold`}
                    />
                    {listing.listingType === "auction" && (
                      <Chip
                        icon={<Gavel size={14} />}
                        label="Đấu giá"
                        size="small"
                        className="!absolute !top-3 !left-24 !bg-purple-100 !text-purple-700 !font-semibold"
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, listing)}
                      className="!absolute !top-3 !right-3 !bg-white !shadow-lg hover:!bg-slate-100"
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </Box>

                  <CardContent className="!p-4">
                    <Typography className="!h-5 !font-bold !text-slate-900 !mb-2 !line-clamp-2">
                      {listing.title}
                    </Typography>

                    {listing.description && (
                      <Typography
                        variant="body2"
                        className="!h-10 !text-slate-600 !mb-3 !line-clamp-2"
                      >
                        {listing.description}
                      </Typography>
                    )}

                    <Box className="!flex !flex-wrap !gap-2 !mb-3">
                      {listing.categoryName && (
                        <Chip
                          label={listing.categoryName}
                          size="small"
                          className="!bg-blue-100 !text-blue-700"
                        />
                      )}
                      {listing.year && (
                        <Chip
                          icon={<Calendar size={12} />}
                          label={listing.year}
                          size="small"
                          className="!bg-slate-100 !text-slate-600"
                        />
                      )}
                      {listing.brand && (
                        <Chip
                          label={listing.brand}
                          size="small"
                          className="!bg-slate-100 !text-slate-600"
                        />
                      )}
                    </Box>

                    <Box className="!pt-3 !border-t !border-slate-200">
                      <Box className="!flex !justify-between !items-center !mb-3">
                        <Typography
                          variant="h6"
                          className="!h-10 !font-bold !text-emerald-600"
                        >
                          {listing.price?.toLocaleString() || 0} đ
                        </Typography>
                        <Typography
                          variant="caption"
                          className="!text-slate-500"
                        >
                          {formatDate(listing.createdAt)}
                        </Typography>
                      </Box>

                      <ListingAuctionButton listing={listing} />
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
        {selectedListing?.listingType === "auction" &&
          selectedListing?.listingStatus === "active" && (
            <>
              {hasAuction ? (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    if (auction) {
                      navigate(`/auction/${auction.id}`);
                    }
                  }}
                  className="!text-blue-600"
                >
                  <Eye size={18} className="!mr-2" />
                  Xem buổi đấu giá
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    if (selectedListing) {
                      handleCreateAuction(selectedListing);
                    }
                  }}
                  className="!text-purple-600"
                >
                  <Gavel size={18} className="!mr-2" />
                  Tạo đấu giá
                </MenuItem>
              )}
              <MenuItem
                onClick={handleOpenConvertDialog}
                className="!text-blue-600"
              >
                <ShoppingCart size={18} className="!mr-2" />
                Chuyển sang bán thường
              </MenuItem>
            </>
          )}
        <MenuItem onClick={handleDelete} className="!text-red-600">
          <Trash2 size={18} className="!mr-2" />
          Xóa tin
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle className="!font-bold">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tin đăng "{selectedListing?.title}"? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions className="!p-4">
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={convertDialogOpen}
        onClose={() => setConvertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!font-bold !flex !items-center !gap-2">
          <ShoppingCart size={24} className="!text-blue-600" />
          Chuyển sang bán thường
        </DialogTitle>
        <DialogContent>
          {isAuctionLoading ? (
            <Box className="!py-8 !text-center">
              <CircularProgress size={40} />
              <Typography className="!mt-4 !text-slate-600">
                Đang kiểm tra trạng thái đấu giá...
              </Typography>
            </Box>
          ) : isAuctionActive() ? (
            <Alert severity="error" icon={<AlertTriangle />} className="!mb-4">
              <Typography className="!font-bold !mb-2">
                Không thể chuyển đổi!
              </Typography>
              <Typography variant="body2">
                Phiên đấu giá đang diễn ra (Status:{" "}
                <strong>{auction?.status}</strong>). Bạn chỉ có thể chuyển sang
                bán thường khi đấu giá đã kết thúc.
              </Typography>
            </Alert>
          ) : (
            <>
              <Typography className="!mb-4 !text-slate-600">
                Chuyển tin đăng "<strong>{selectedListing?.title}</strong>" từ{" "}
                <Chip
                  label="Đấu giá"
                  size="small"
                  className="!bg-purple-100 !text-purple-700"
                />{" "}
                sang{" "}
                <Chip
                  label="Bán thường"
                  size="small"
                  className="!bg-blue-100 !text-blue-700"
                />
              </Typography>

              {auction?.status === "Ended" && (
                <Alert severity="info" className="!mb-4">
                  <Typography variant="body2" className="!font-semibold !mb-1">
                    📊 Thông tin đấu giá
                  </Typography>
                  <Typography variant="body2">
                    • Giá khởi điểm:{" "}
                    <strong>{auction.startingPrice?.toLocaleString()}đ</strong>
                  </Typography>
                  <Typography variant="body2">
                    • Giá cao nhất:{" "}
                    <strong className="!text-emerald-600">
                      {auction.currentPrice?.toLocaleString()}đ
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    • Tổng lượt đấu: <strong>{auction.totalBids}</strong>
                  </Typography>
                </Alert>
              )}

              <TextField
                fullWidth
                label="Giá bán"
                type="number"
                value={convertPrice}
                onChange={(e) => setConvertPrice(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
                helperText={
                  auction?.status === "Ended"
                    ? `Giá được tự động điền = giá đấu giá cao nhất (${auction.currentPrice?.toLocaleString()}đ)`
                    : "Nhập giá bán mong muốn"
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="!p-4">
          <Button onClick={() => setConvertDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleConvertToSale}
            disabled={
              !convertPrice ||
              Number(convertPrice) <= 0 ||
              convertToSaleMutation.isPending ||
              isAuctionActive()
            }
            className="!bg-blue-600"
          >
            {convertToSaleMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              <span className="!text-white">Xác nhận chuyển đổi</span>
            )}
          </Button>
        </DialogActions>
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
    </Box>
  );
};

export default MyListingsPage;
