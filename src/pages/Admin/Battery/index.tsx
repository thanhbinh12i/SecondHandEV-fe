/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  Trash2,
  Clock,
  AlertTriangle,
  Package,
  Battery,
} from "lucide-react";
import { ListingDto } from "src/types/listing.type";
import { useGetListing } from "src/queries/useListing";
import { useUpdateStatusMutation } from "src/queries/useListing";

const BatteryAllPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<ListingDto | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data } = useGetListing({ categoryId: 1 }); // categoryId 1 for batteries
  const updateStatusMutation = useUpdateStatusMutation();

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&q=80";

  const listings = data?.data.items;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "!bg-emerald-100 !text-emerald-700";
      case "pending":
        return "!bg-amber-100 !text-amber-700";
      case "sold":
        return "!bg-slate-100 !text-slate-700";
      case "rejected":
        return "!bg-red-100 !text-red-700";
      default:
        return "!bg-slate-100 !text-slate-700";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "sold":
        return "Đã bán";
      case "rejected":
        return "Đã từ chối";
      default:
        return "Không xác định";
    }
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

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch =
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sellerDisplayName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || listing.listingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedListings = filteredListings?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = [
    {
      icon: Package,
      label: "Tổng tin đăng",
      value: listings?.length || 0,
      color: "!from-blue-500 !to-cyan-600",
    },
    {
      icon: Clock,
      label: "Chờ duyệt",
      value: listings?.filter((l) => l.listingStatus === "pending").length || 0,
      color: "!from-amber-500 !to-orange-600",
    },
    {
      icon: CheckCircle,
      label: "Đã duyệt",
      value: listings?.filter((l) => l.listingStatus === "active").length || 0,
      color: "!from-emerald-500 !to-green-600",
    },
    {
      icon: AlertTriangle,
      label: "Đã từ chối",
      value:
        listings?.filter((l) => l.listingStatus === "rejected").length || 0,
      color: "!from-red-500 !to-pink-600",
    },
  ];

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

  const handleViewDetail = () => {
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = async () => {
    if (!selectedListing?.listingId) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedListing.listingId,
        body: { status: "active" },
      });

      setSnackbar({
        open: true,
        message: "Đã duyệt tin đăng thành công!",
        severity: "success",
      });
      setDetailDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi duyệt tin đăng!",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  const handleReject = async () => {
    if (!selectedListing?.listingId) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedListing.listingId,
        body: { status: "rejected" },
      });

      setSnackbar({
        open: true,
        message: "Đã từ chối tin đăng!",
        severity: "success",
      });
      setDetailDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi từ chối tin đăng!",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getImageUrl = (listing: ListingDto): string => {
    return listing.primaryImageUrl || listing.imageUrls?.[0] || DEFAULT_IMAGE;
  };

  return (
    <Box className="!p-6">
      <Container maxWidth="xl">
        <Box className="!mb-6">
          <Box className="!flex !items-center !gap-3 !mb-2">
            <Box className="!w-12 !h-12 !bg-gradient-to-br !from-orange-500 !to-red-600 !rounded-xl !flex !items-center !justify-center">
              <Battery className="!text-white" size={28} />
            </Box>
            <Box>
              <Typography variant="h4" className="!font-bold !text-slate-900">
                Quản lý Pin xe điện
              </Typography>
              <Typography className="!text-slate-600">
                Xem và quản lý toàn bộ tin đăng pin xe điện
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} className="!mb-6">
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                className={`!p-6 !bg-gradient-to-br ${stat.color} !text-white !rounded-2xl`}
              >
                <Box className="!flex !items-center !gap-4">
                  <Box className="!w-14 !h-14 !bg-white/20 !rounded-xl !flex !items-center !justify-center">
                    <stat.icon size={28} />
                  </Box>
                  <Box>
                    <Typography variant="h4" className="!font-bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="!opacity-90">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper className="!p-4 !mb-6 !rounded-2xl">
          <Box className="!flex !flex-col md:!flex-row !gap-4 !justify-between !items-center">
            <TextField
              placeholder="Tìm kiếm tin đăng pin..."
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
            <FormControl size="small" className="!w-full md:!w-48">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="active">Đã duyệt</MenuItem>
                <MenuItem value="rejected">Đã từ chối</MenuItem>
                <MenuItem value="sold">Đã bán</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Paper className="!shadow-xl !rounded-2xl">
          <TableContainer>
            <Table>
              <TableHead className="!bg-slate-50">
                <TableRow>
                  <TableCell className="!font-semibold">Tin đăng</TableCell>
                  <TableCell className="!font-semibold">Người bán</TableCell>
                  <TableCell className="!font-semibold">Giá</TableCell>
                  <TableCell className="!font-semibold">Ngày đăng</TableCell>
                  <TableCell className="!font-semibold">Trạng thái</TableCell>
                  <TableCell className="!font-semibold" align="center">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedListings?.map((listing) => (
                  <TableRow
                    key={listing.listingId}
                    className="hover:!bg-slate-50 !transition-colors"
                  >
                    <TableCell>
                      <Box className="!flex !items-center !gap-3">
                        <Avatar
                          src={getImageUrl(listing)}
                          variant="rounded"
                          className="!w-16 !h-16"
                        />
                        <Box>
                          <Typography className="!font-semibold !text-slate-900">
                            {listing.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="!text-slate-500"
                          >
                            {listing.brand} • {listing.model}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography className="!font-medium !text-slate-900">
                        {listing.sellerDisplayName}
                      </Typography>
                      <Typography variant="caption" className="!text-slate-500">
                        {listing.sellerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="!font-bold !text-emerald-600">
                        {listing.price?.toLocaleString()} đ
                      </Typography>
                    </TableCell>
                    <TableCell className="!text-slate-700">
                      {formatDate(listing.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(listing.listingStatus)}
                        size="small"
                        className={`${getStatusColor(
                          listing.listingStatus
                        )} !font-semibold`}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, listing)}
                        className="!text-slate-600"
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredListings?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số dòng mỗi trang:"
          />
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewDetail}>
            <Eye size={18} className="!mr-2" />
            Xem chi tiết
          </MenuItem>
          {selectedListing?.listingStatus === "pending" && (
            <>
              <MenuItem onClick={handleApprove} className="!text-emerald-600">
                <CheckCircle size={18} className="!mr-2" />
                Duyệt tin
              </MenuItem>
              <MenuItem onClick={handleReject} className="!text-red-600">
                <AlertTriangle size={18} className="!mr-2" />
                Từ chối
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleMenuClose} className="!text-red-600">
            <Trash2 size={18} className="!mr-2" />
            Xóa
          </MenuItem>
        </Menu>

        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="!bg-gradient-to-r !from-orange-500 !to-red-600 !text-white">
            <Box className="!flex !items-center !gap-2">
              <Battery size={24} />
              <span>Chi tiết Pin xe điện</span>
            </Box>
          </DialogTitle>
          <DialogContent className="!mt-4">
            {selectedListing && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <img
                    src={getImageUrl(selectedListing)}
                    alt={selectedListing.title}
                    className="!w-full !h-64 !object-cover !rounded-2xl"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" className="!font-bold !mb-2">
                    {selectedListing.title}
                  </Typography>
                  <Typography className="!text-slate-600 !mb-4">
                    {selectedListing.description}
                  </Typography>
                </Grid>

                {/* Battery Specs */}
                {selectedListing.battery && (
                  <Grid size={{ xs: 12 }}>
                    <Paper className="!p-4 !bg-slate-50">
                      <Typography
                        variant="subtitle2"
                        className="!font-bold !mb-3 !flex !items-center !gap-2"
                      >
                        <Battery size={18} className="!text-orange-500" />
                        Thông số kỹ thuật
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedListing.battery.voltage && (
                          <Grid size={{ xs: 6, md: 4 }}>
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Điện áp
                            </Typography>
                            <Typography className="!font-bold !text-orange-600">
                              {selectedListing.battery.voltage}V
                            </Typography>
                          </Grid>
                        )}
                        {selectedListing.battery.capacityWh && (
                          <Grid size={{ xs: 6, md: 4 }}>
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Dung lượng
                            </Typography>
                            <Typography className="!font-bold !text-blue-600">
                              {selectedListing.battery.capacityWh}Wh
                            </Typography>
                          </Grid>
                        )}
                        {selectedListing.battery.weightKg && (
                          <Grid size={{ xs: 6, md: 4 }}>
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Trọng lượng
                            </Typography>
                            <Typography className="!font-bold">
                              {selectedListing.battery.weightKg}kg
                            </Typography>
                          </Grid>
                        )}
                        {selectedListing.battery.ageYears !== undefined && (
                          <Grid size={{ xs: 6, md: 4 }}>
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Tuổi pin
                            </Typography>
                            <Typography className="!font-bold">
                              {selectedListing.battery.ageYears} năm
                            </Typography>
                          </Grid>
                        )}
                        {selectedListing.battery.condition && (
                          <Grid size={{ xs: 6, md: 4 }}>
                            <Typography
                              variant="caption"
                              className="!text-slate-600"
                            >
                              Tình trạng
                            </Typography>
                            <Box className="!mt-1">
                              <Chip
                                label={selectedListing.battery.condition}
                                size="small"
                                className={getConditionColor(
                                  selectedListing.battery.condition
                                )}
                              />
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                )}

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" className="!text-slate-600">
                    Giá bán
                  </Typography>
                  <Typography
                    variant="h6"
                    className="!font-bold !text-emerald-600"
                  >
                    {selectedListing.price?.toLocaleString()} đ
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" className="!text-slate-600">
                    Trạng thái
                  </Typography>
                  <Box className="!mt-1">
                    <Chip
                      label={getStatusLabel(selectedListing.listingStatus)}
                      size="small"
                      className={getStatusColor(selectedListing.listingStatus)}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Paper className="!p-4 !bg-blue-50">
                    <Typography
                      variant="subtitle2"
                      className="!font-bold !mb-2"
                    >
                      Thông tin người bán
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tên:</strong> {selectedListing.sellerDisplayName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedListing.sellerEmail}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions className="!p-4">
            {selectedListing?.listingStatus === "pending" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  startIcon={<CheckCircle size={18} />}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending
                    ? "Đang xử lý..."
                    : "Duyệt tin"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  startIcon={<AlertTriangle size={18} />}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? "Đang xử lý..." : "Từ chối"}
                </Button>
              </>
            )}
            <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
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
      </Container>
    </Box>
  );
};

export default BatteryAllPage;
