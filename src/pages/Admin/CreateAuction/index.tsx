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
  TextField,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import {
  Gavel,
  Calendar,
  DollarSign,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGetListing } from "src/queries/useListing";

interface CreateAuctionForm {
  listingId: number | null;
  startingPrice: string;
  startDate: string;
  endDate: string;
}

const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAuctionForm>({
    listingId: null,
    startingPrice: "",
    startDate: "",
    endDate: "",
  });
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: listingsData, isLoading } = useGetListing();

  const listings = listingsData?.data?.items || [];
  const auctionListings = listings?.filter(
    (listing) => listing.listingType === "auction"
  );

  const handleInputChange = (field: keyof CreateAuctionForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");
  };

  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
    setFormData((prev) => ({
      ...prev,
      listingId: listing.id,
      startingPrice: listing.price?.toString() || "",
    }));
    setSearchOpen(false);
    setSearchQuery("");
  };

  const validateForm = (): string | null => {
    if (!formData.listingId) {
      return "Vui lòng chọn sản phẩm đấu giá";
    }
    if (!formData.startingPrice || Number(formData.startingPrice) <= 0) {
      return "Giá khởi điểm phải lớn hơn 0";
    }
    if (!formData.startDate) {
      return "Vui lòng chọn ngày bắt đầu";
    }
    if (!formData.endDate) {
      return "Vui lòng chọn ngày kết thúc";
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      return "Ngày bắt đầu phải sau thời điểm hiện tại";
    }
    if (endDate <= startDate) {
      return "Ngày kết thúc phải sau ngày bắt đầu";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        listingId: formData.listingId,
        startingPrice: Number(formData.startingPrice),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      console.log("Creating auction with payload:", payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/admin/auctions/all");
      }, 2000);
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo buổi đấu giá"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (value?: number | string) => {
    if (!value) return "—";
    const num = Number(value);
    return `${num.toLocaleString("vi-VN")} đ`;
  };

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="xl" className="!py-6">
        <Box className="!mb-6">
          <Box className="!flex !items-center !gap-3 !mb-2">
            <Gavel size={32} className="!text-blue-600" />
            <Typography variant="h4" className="!font-bold">
              Tạo buổi đấu giá mới
            </Typography>
          </Box>
        </Box>

        {submitSuccess && (
          <Alert severity="success" className="!mb-4" icon={<CheckCircle />}>
            <Typography variant="body1" className="!font-semibold">
              Tạo buổi đấu giá thành công!
            </Typography>
            <Typography variant="body2">
              Đang chuyển hướng đến danh sách đấu giá...
            </Typography>
          </Alert>
        )}

        {submitError && (
          <Alert
            severity="error"
            className="!mb-4"
            onClose={() => setSubmitError("")}
          >
            {submitError}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
              <Typography variant="h6" className="!font-bold !mb-4">
                Chọn sản phẩm đấu giá
              </Typography>

              {selectedListing ? (
                <Card className="!mb-4">
                  <Box className="!flex !gap-4 !p-4">
                    {selectedListing.primaryImageUrl && (
                      <CardMedia
                        component="img"
                        image={selectedListing.primaryImageUrl}
                        alt={selectedListing.title}
                        className="!w-32 !h-32 !object-cover !rounded-lg"
                      />
                    )}
                    <Box className="!flex-1">
                      <Box className="!flex !items-start !justify-between !mb-2">
                        <Typography variant="h6" className="!font-bold">
                          {selectedListing.title}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedListing(null);
                            setFormData((prev) => ({
                              ...prev,
                              listingId: null,
                              startingPrice: "",
                            }));
                          }}
                        >
                          Thay đổi
                        </Button>
                      </Box>
                      <Box className="!flex !items-center !gap-2 !mb-2">
                        <Chip
                          label={selectedListing.categoryName}
                          size="small"
                          className="!font-semibold"
                        />
                        {selectedListing.brand && (
                          <Chip
                            label={selectedListing.brand}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        className="!text-slate-600 !mb-2"
                      >
                        Giá niêm yết:{" "}
                        <strong className="!text-emerald-600">
                          {formatCurrency(selectedListing.price)}
                        </strong>
                      </Typography>
                      <Typography variant="caption" className="!text-slate-500">
                        Đăng ngày: {formatDate(selectedListing.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setSearchOpen(true)}
                  className="!border-dashed !py-8"
                >
                  <Box className="!text-center">
                    <Search
                      size={48}
                      className="!mx-auto !mb-2 !text-slate-400"
                    />
                    <Typography variant="h6" className="!font-bold !mb-1">
                      Chọn sản phẩm
                    </Typography>
                    <Typography variant="body2" className="!text-slate-600">
                      Click để tìm và chọn sản phẩm cho buổi đấu giá
                    </Typography>
                  </Box>
                </Button>
              )}
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-lg">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin đấu giá
              </Typography>

              <Box className="!space-y-4">
                <Box>
                  <Box className="!flex !items-center !gap-2 !mb-2">
                    <DollarSign size={18} className="!text-slate-600" />
                    <Typography variant="body2" className="!font-semibold">
                      Giá khởi điểm <span className="!text-red-500">*</span>
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Nhập giá khởi điểm"
                    value={formData.startingPrice}
                    onChange={(e) =>
                      handleInputChange("startingPrice", e.target.value)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">đ</InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText>
                    Giá khởi điểm cho cuộc đấu giá (VNĐ)
                  </FormHelperText>
                </Box>

                <Box>
                  <Box className="!flex !items-center !gap-2 !mb-2">
                    <Calendar size={18} className="!text-slate-600" />
                    <Typography variant="body2" className="!font-semibold">
                      Ngày bắt đầu <span className="!text-red-500">*</span>
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText>
                    Thời gian bắt đầu nhận đấu giá
                  </FormHelperText>
                </Box>

                <Box>
                  <Box className="!flex !items-center !gap-2 !mb-2">
                    <Calendar size={18} className="!text-slate-600" />
                    <Typography variant="body2" className="!font-semibold">
                      Ngày kết thúc <span className="!text-red-500">*</span>
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText>
                    Thời gian kết thúc buổi đấu giá
                  </FormHelperText>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !sticky !top-6">
              <Typography variant="h6" className="!font-bold !mb-4">
                Tóm tắt buổi đấu giá
              </Typography>

              <Box className="!space-y-3 !mb-4">
                <Box className="!p-3 !bg-slate-50 !rounded-xl">
                  <Typography variant="caption" className="!text-slate-600">
                    Sản phẩm
                  </Typography>
                  <Typography variant="body2" className="!font-bold">
                    {selectedListing?.title || "Chưa chọn"}
                  </Typography>
                </Box>

                <Box className="!p-3 !bg-blue-50 !rounded-xl">
                  <Typography variant="caption" className="!text-slate-600">
                    Giá khởi điểm
                  </Typography>
                  <Typography
                    variant="h6"
                    className="!font-bold !text-blue-600"
                  >
                    {formatCurrency(formData.startingPrice)}
                  </Typography>
                </Box>

                <Box className="!p-3 !bg-emerald-50 !rounded-xl">
                  <Typography variant="caption" className="!text-slate-600">
                    Thời gian diễn ra
                  </Typography>
                  <Typography variant="body2" className="!font-semibold">
                    {formData.startDate && formData.endDate
                      ? `${new Date(formData.startDate).toLocaleString(
                          "vi-VN"
                        )} → ${new Date(formData.endDate).toLocaleString(
                          "vi-VN"
                        )}`
                      : "Chưa thiết lập"}
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" className="!mb-4" icon={<AlertCircle />}>
                <Typography variant="body2">
                  Buổi đấu giá sẽ tự động bắt đầu và kết thúc theo thời gian đã
                  thiết lập
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || !formData.listingId}
                onClick={handleSubmit}
                className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !py-3"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Gavel size={20} />
                  )
                }
              >
                {isSubmitting ? "Đang tạo..." : "Tạo buổi đấu giá"}
              </Button>

              <Box className="!mt-4 !space-y-2">
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Tự động thông báo cho người theo dõi
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Hiển thị trên trang chủ
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Quản lý lịch sử đấu giá
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" className="!font-bold">
              Chọn sản phẩm đấu giá
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!mb-4"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />

            {isLoading ? (
              <Box className="!text-center !py-8">
                <CircularProgress />
                <Typography variant="body2" className="!mt-2 !text-slate-600">
                  Đang tải danh sách sản phẩm...
                </Typography>
              </Box>
            ) : auctionListings.length === 0 ? (
              <Alert severity="info">Không tìm thấy sản phẩm đấu giá nào</Alert>
            ) : (
              <Box className="!space-y-2 !max-h-96 !overflow-y-auto">
                {auctionListings.map((listing: any) => (
                  <Card
                    key={listing.id}
                    className="!cursor-pointer hover:!shadow-md !transition-shadow"
                  >
                    <CardActionArea
                      onClick={() => handleSelectListing(listing)}
                    >
                      <Box className="!flex !gap-3 !p-3">
                        {listing.primaryImageUrl && (
                          <CardMedia
                            component="img"
                            image={listing.primaryImageUrl}
                            alt={listing.title}
                            className="!w-20 !h-20 !object-cover !rounded"
                          />
                        )}
                        <CardContent className="!flex-1 !p-0">
                          <Typography
                            variant="body1"
                            className="!font-bold !mb-1"
                          >
                            {listing.title}
                          </Typography>
                          <Box className="!flex !items-center !gap-2 !mb-1">
                            <Chip label={listing.categoryName} size="small" />
                            {listing.brand && (
                              <Chip
                                label={listing.brand}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            className="!text-emerald-600 !font-semibold"
                          >
                            {formatCurrency(listing.price)}
                          </Typography>
                        </CardContent>
                      </Box>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSearchOpen(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CreateAuctionPage;
