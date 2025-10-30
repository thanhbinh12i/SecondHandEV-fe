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
  Bike,
} from "lucide-react";
import { ListingDto } from "src/types/listing.type";

const EBikeAllPage: React.FC = () => {
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

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600&q=80";

  const mockListings: ListingDto[] = [
    {
      listingId: 20,
      memberId: 5,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "VinFast Impes 1500W Premium Scooter",
      description: "Xe máy điện VinFast Impes cao cấp, pin rời tiện lợi",
      year: 2024,
      price: 52000000,
      listingType: "buy_now",
      listingStatus: "pending",
      createdAt: "2025-10-28T14:30:00",
      sellerDisplayName: "Nguyễn Thị Mai",
      sellerEmail: "mai@email.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600",
      imageUrls: [],
      brand: "VinFast",
      model: "Impes",
      ebike: {
        motorPowerW: 1500,
        batteryVoltage: 60,
        rangeKm: 80,
        frameSize: "M",
        condition: "Mới",
        mileageKm: 0,
        weightKg: 85,
        yearOfManufacture: 2024,
      },
    },
    {
      listingId: 1,
      memberId: 1,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "Giant 750W Mountain E-Bike",
      description: "Xe đạp địa hình Giant, mạnh mẽ cho leo núi",
      year: 2021,
      price: 22000000,
      listingType: "buy_now",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600",
      imageUrls: [],
      brand: "Giant",
      model: "MTB750",
      ebike: {
        motorPowerW: 750,
        batteryVoltage: 48,
        rangeKm: 60,
        frameSize: "L",
        condition: "Đã sử dụng",
        mileageKm: 1200,
        weightKg: 28,
        yearOfManufacture: 2021,
      },
    },
    {
      listingId: 21,
      memberId: 6,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "Brompton Electric P Line 250W",
      description: "Xe đạp gấp điện Brompton nhập khẩu Anh",
      year: 2024,
      price: 95000000,
      listingType: "negotiable",
      listingStatus: "pending",
      createdAt: "2025-10-28T10:15:00",
      sellerDisplayName: "Trần Văn Long",
      sellerEmail: "long@email.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "Brompton",
      model: "P Line",
      ebike: {
        motorPowerW: 250,
        batteryVoltage: 36,
        rangeKm: 40,
        frameSize: "S",
        condition: "Mới",
        mileageKm: 0,
        weightKg: 16,
        yearOfManufacture: 2024,
      },
    },
    {
      listingId: 2,
      memberId: 2,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "Trek 500W City E-Bike",
      description: "Xe đạp điện Trek phù hợp đi làm",
      year: 2020,
      price: 18000000,
      listingType: "negotiable",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "Trek",
      model: "City500",
      ebike: {
        motorPowerW: 500,
        batteryVoltage: 48,
        rangeKm: 50,
        frameSize: "M",
        condition: "Như mới",
        mileageKm: 800,
        weightKg: 24,
        yearOfManufacture: 2020,
      },
    },
    {
      listingId: 22,
      memberId: 7,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "Super Soco TC Max 3000W",
      description: "Xe mô tô điện Super Soco công suất cao",
      year: 2024,
      price: 78000000,
      listingType: "buy_now",
      listingStatus: "pending",
      createdAt: "2025-10-27T16:45:00",
      sellerDisplayName: "Lê Hoàng Nam",
      sellerEmail: "nam@email.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "Super Soco",
      model: "TC Max",
      ebike: {
        motorPowerW: 3000,
        batteryVoltage: 72,
        rangeKm: 120,
        frameSize: "L",
        condition: "Mới",
        mileageKm: 0,
        weightKg: 95,
        yearOfManufacture: 2024,
      },
    },
    {
      listingId: 3,
      memberId: 3,
      categoryId: 2,
      categoryName: "Xe điện",
      title: "FoldX 350W Foldable E-Bike",
      description: "Xe gấp gọn FoldX tiện lợi",
      year: 2019,
      price: 12000000,
      listingType: "buy_now",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "FoldX",
      model: "FX350",
      ebike: {
        motorPowerW: 350,
        batteryVoltage: 36,
        rangeKm: 35,
        frameSize: "S",
        condition: "Đã sử dụng",
        mileageKm: 2500,
        weightKg: 18,
        yearOfManufacture: 2019,
      },
    },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "!bg-emerald-100 !text-emerald-700";
      case "pending":
        return "!bg-amber-100 !text-amber-700";
      case "sold":
        return "!bg-slate-100 !text-slate-700";
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

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sellerDisplayName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || listing.listingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedListings = filteredListings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = [
    {
      icon: Package,
      label: "Tổng tin đăng",
      value: mockListings.length,
      color: "!from-blue-500 !to-cyan-600",
    },
    {
      icon: Clock,
      label: "Chờ duyệt",
      value: mockListings.filter((l) => l.listingStatus === "pending").length,
      color: "!from-amber-500 !to-orange-600",
    },
    {
      icon: CheckCircle,
      label: "Đã duyệt",
      value: mockListings.filter((l) => l.listingStatus === "active").length,
      color: "!from-emerald-500 !to-green-600",
    },
    {
      icon: AlertTriangle,
      label: "Cần xử lý",
      value: mockListings.filter((l) => l.listingStatus === "pending").length,
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

  const handleApprove = () => {
    setSnackbar({
      open: true,
      message: "Đã duyệt tin đăng thành công!",
      severity: "success",
    });
    handleMenuClose();
  };

  const handleReject = () => {
    setSnackbar({
      open: true,
      message: "Đã từ chối tin đăng!",
      severity: "error",
    });
    handleMenuClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getImageUrl = (listing: ListingDto): string => {
    return listing.primaryImageUrl || listing.imageUrls[0] || DEFAULT_IMAGE;
  };

  return (
    <Box className="!p-6">
      <Container maxWidth="xl">
        {/* Header */}
        <Box className="!mb-6">
          <Box className="!flex !items-center !gap-3 !mb-2">
            <Box className="!w-12 !h-12 !bg-gradient-to-br !from-blue-500 !to-cyan-600 !rounded-xl !flex !items-center !justify-center">
              <Bike className="!text-white" size={28} />
            </Box>
            <Box>
              <Typography variant="h4" className="!font-bold !text-slate-900">
                Quản lý Xe điện
              </Typography>
              <Typography className="!text-slate-600">
                Xem và quản lý toàn bộ tin đăng xe điện
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats */}
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

        {/* Filters */}
        <Paper className="!p-4 !mb-6 !rounded-2xl">
          <Box className="!flex !flex-col md:!flex-row !gap-4 !justify-between !items-center">
            <TextField
              placeholder="Tìm kiếm tin đăng xe điện..."
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
                <MenuItem value="sold">Đã bán</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Table */}
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
                {paginatedListings.map((listing) => (
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
            count={filteredListings.length}
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

        {/* Context Menu */}
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

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="!bg-gradient-to-r !from-blue-500 !to-cyan-600 !text-white">
            <Box className="!flex !items-center !gap-2">
              <Bike size={24} />
              <span>Chi tiết Xe điện</span>
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

                {/* E-Bike Specs */}
                <Grid size={{ xs: 12 }}>
                  <Paper className="!p-4 !bg-slate-50">
                    <Typography
                      variant="subtitle2"
                      className="!font-bold !mb-3 !flex !items-center !gap-2"
                    >
                      <Bike size={18} className="!text-blue-500" />
                      Thông số kỹ thuật
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Công suất động cơ
                        </Typography>
                        <Typography className="!font-bold !text-orange-600">
                          {selectedListing.ebike?.motorPowerW}W
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Điện áp pin
                        </Typography>
                        <Typography className="!font-bold !text-purple-600">
                          {selectedListing.ebike?.batteryVoltage}V
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Quãng đường
                        </Typography>
                        <Typography className="!font-bold !text-blue-600">
                          {selectedListing.ebike?.rangeKm}km
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Kích thước khung
                        </Typography>
                        <Typography className="!font-bold">
                          {selectedListing.ebike?.frameSize}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Số km đã đi
                        </Typography>
                        <Typography className="!font-bold">
                          {selectedListing.ebike?.mileageKm?.toLocaleString()}km
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Trọng lượng
                        </Typography>
                        <Typography className="!font-bold">
                          {selectedListing.ebike?.weightKg}kg
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Năm sản xuất
                        </Typography>
                        <Typography className="!font-bold">
                          {selectedListing.ebike?.yearOfManufacture}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Tình trạng
                        </Typography>
                        <Box className="!mt-1">
                          <Chip
                            label={selectedListing.ebike?.condition}
                            size="small"
                            className={getConditionColor(
                              selectedListing.ebike?.condition
                            )}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

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
                >
                  Duyệt tin
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  startIcon={<AlertTriangle size={18} />}
                >
                  Từ chối
                </Button>
              </>
            )}
            <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          </DialogActions>
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

export default EBikeAllPage;
