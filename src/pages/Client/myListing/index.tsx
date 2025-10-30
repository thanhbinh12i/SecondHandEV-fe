import React, { useState } from "react";
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
} from "@mui/material";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ListingDto } from "src/types/listing.type";
import { useGetMyListing } from "src/queries/useListing";

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<ListingDto | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const myListing = useGetMyListing();

  const isLoading = false;

  const mockListings: ListingDto[] = myListing.data?.data || [];

  const listings = mockListings;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "!bg-emerald-100 !text-emerald-700";
      case "pending":
        return "!bg-amber-100 !text-amber-700";
      case "sold":
        return "!bg-slate-100 !text-slate-700";
      case "inactive":
      case "draft":
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
      case "draft":
        return "Nháp";
      default:
        return status || "Không xác định";
    }
  };

  const getListingTypeLabel = (type?: string) => {
    switch (type) {
      case "fixed":
        return "Giá cố định";
      case "auction":
        return "Đấu giá";
      default:
        return type || "";
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
    try {
      console.log("Delete listing:", selectedListing?.listingId);
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleToggleStatus = () => {
    console.log("Toggle status:", selectedListing?.listingId);
    handleMenuClose();
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
        {/* Header */}
        <Box className="!mb-8">
          <Typography variant="h4" className="!font-bold !text-slate-900 !mb-2">
            Tin đăng của tôi
          </Typography>
          <Typography className="!text-slate-600">
            Quản lý các tin đăng bán xe điện và pin của bạn
          </Typography>
        </Box>

        {/* Stats Cards */}
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

        {/* Filter Section */}
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

        {/* Tabs */}
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

        {/* Listings Grid */}
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
                <Card className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-105">
                  <Box className="!relative">
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        listing.primaryImageUrl ||
                        "https://via.placeholder.com/800x600?text=No+Image"
                      }
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
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, listing)}
                      className="!absolute !top-3 !right-3 !bg-white !shadow-lg hover:!bg-slate-100"
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </Box>

                  <CardContent className="!p-4">
                    <Typography
                      variant="h6"
                      className="!font-bold !text-slate-900 !mb-2 !line-clamp-2"
                    >
                      {listing.title}
                    </Typography>

                    {listing.description && (
                      <Typography
                        variant="body2"
                        className="!text-slate-600 !mb-3 !line-clamp-2"
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

                    {listing.listingType && (
                      <Box className="!mb-3">
                        <Chip
                          label={getListingTypeLabel(listing.listingType)}
                          size="small"
                          className="!bg-emerald-100 !text-emerald-700"
                        />
                      </Box>
                    )}

                    <Box className="!flex !justify-between !items-center !pt-3 !border-t !border-slate-200">
                      <Typography
                        variant="h6"
                        className="!font-bold !text-emerald-600"
                      >
                        {listing.price?.toLocaleString() || 0} đ
                      </Typography>
                      <Typography variant="caption" className="!text-slate-500">
                        {formatDate(listing.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit size={18} className="!mr-2" />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedListing?.listingStatus === "active" ? (
            <>
              <EyeOff size={18} className="!mr-2" />
              Ẩn tin
            </>
          ) : (
            <>
              <Eye size={18} className="!mr-2" />
              Hiển thị
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} className="!text-red-600">
          <Trash2 size={18} className="!mr-2" />
          Xóa tin
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
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
    </Box>
  );
};

export default MyListingsPage;
