import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Gavel,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useCreateAuctionMutation } from "src/queries/useAuction";
import { useGetMyListing } from "src/queries/useListing";
import { AuctionCreateRequest } from "src/types/auction.type";

const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const { listingId: paramListingId } = useParams();
  const [searchParams] = useSearchParams();
  const queryListingId = searchParams.get("id");

  const selectedListingId = paramListingId || queryListingId;

  const { data: listingsData } = useGetMyListing();
  const createAuctionMutation = useCreateAuctionMutation();

  const [formData, setFormData] = useState<AuctionCreateRequest>({
    listingId: 0,
    startingPrice: 0,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const listings = listingsData?.data.items || [];
  const auctionListings = listings.filter(
    (l) => l.listingType === "auction" && l.listingStatus === "active"
  );
  const selectedListing = listings.find(
    (l) => l.listingId === Number(formData.listingId)
  );

  useEffect(() => {
    if (selectedListingId) {
      setFormData((prev) => ({
        ...prev,
        listingId: Number(selectedListingId),
      }));
    }
  }, [selectedListingId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.listingId) {
      newErrors.listingId = "Vui lòng chọn sản phẩm";
    }
    if (!formData.startingPrice || formData.startingPrice <= 0) {
      newErrors.startingPrice = "Giá khởi điểm phải lớn hơn 0";
    }
    if (selectedListing && formData.startingPrice > selectedListing.price!) {
      newErrors.startingPrice = "Giá khởi điểm không nên vượt quá giá niêm yết";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const now = new Date();

      if (start < now) {
        newErrors.startDate = "Ngày bắt đầu phải sau thời điểm hiện tại";
      }
      if (end <= start) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration < 1) {
        newErrors.endDate = "Thời gian đấu giá phải ít nhất 1 giờ";
      }
      if (duration > 30 * 24) {
        newErrors.endDate = "Thời gian đấu giá không quá 30 ngày";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createAuctionMutation.mutateAsync(formData);
      setSuccessDialogOpen(true);
      setTimeout(() => {
        navigate("/auctions");
      }, 2000);
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  const getMinEndDateTime = () => {
    if (!formData.startDate) return getMinDateTime();
    const start = new Date(formData.startDate);
    start.setHours(start.getHours() + 1);
    return start.toISOString().slice(0, 16);
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const hours = Math.round(
      (new Date(formData.endDate).getTime() -
        new Date(formData.startDate).getTime()) /
        (1000 * 60 * 60)
    );
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) return `${days} ngày ${remainingHours} giờ`;
    return `${hours} giờ`;
  };

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !via-emerald-50/30 !to-blue-50/50">
      <Box className="!bg-gradient-to-r !from-emerald-500 !via-blue-500 !to-emerald-600 !text-white !py-12 !relative !overflow-hidden">
        <Box className="!absolute !inset-0 !opacity-10">
          <Box className="!absolute !top-10 !left-10 !w-72 !h-72 !bg-white !rounded-full !blur-3xl" />
          <Box className="!absolute !bottom-10 !right-10 !w-96 !h-96 !bg-blue-300 !rounded-full !blur-3xl" />
        </Box>
        <Container maxWidth="xl" className="!relative">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!mb-4 !text-white !border-white/30 hover:!bg-white/10"
            variant="outlined"
          >
            Quay lại
          </Button>
          <Box className="!flex !items-center !gap-4 !mb-3">
            <Box className="!bg-white/20 !backdrop-blur-sm !p-4 !rounded-2xl">
              <Gavel size={40} />
            </Box>
            <Box>
              <Typography variant="h3" className="!font-bold !mb-1">
                Tạo buổi đấu giá
              </Typography>
              <Typography variant="h6" className="!opacity-90">
                Biến sản phẩm của bạn thành cơ hội đấu giá hấp dẫn
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="!py-8">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper className="!p-8 !rounded-xl !border-2 !border-blue-200 !bg-white/80 !backdrop-blur-sm">
                <Box className="!mb-8">
                  <Box className="!flex !items-center !gap-3 !mb-4">
                    <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-2 !rounded-xl">
                      <Package size={24} className="!text-white" />
                    </Box>
                    <Typography variant="h5" className="!font-bold">
                      Chọn sản phẩm
                    </Typography>
                  </Box>

                  {auctionListings.length === 0 ? (
                    <Alert
                      severity="warning"
                      icon={<AlertCircle />}
                      className="!rounded-xl !border !border-amber-200"
                    >
                      <Typography className="!font-semibold !mb-2">
                        Không có sản phẩm phù hợp
                      </Typography>
                      <Typography variant="body2" className="!mb-3">
                        Bạn cần có sản phẩm loại "Đấu giá" và đang ở trạng thái
                        "Đang bán"
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/post")}
                        className="!bg-gradient-to-r !from-emerald-500 !to-blue-600"
                      >
                        Đăng tin ngay
                      </Button>
                    </Alert>
                  ) : (
                    <FormControl fullWidth error={!!errors.listingId}>
                      <InputLabel>Chọn sản phẩm để đấu giá</InputLabel>
                      <Select
                        value={formData.listingId || ""}
                        label="Chọn sản phẩm để đấu giá"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            listingId: Number(e.target.value),
                          }))
                        }
                        className="!rounded-xl"
                      >
                        {auctionListings.map((listing) => (
                          <MenuItem
                            key={listing.listingId}
                            value={listing.listingId}
                          >
                            <Box className="!flex !items-center !gap-3 !py-2">
                              <img
                                src={
                                  listing.primaryImageUrl ||
                                  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&q=80"
                                }
                                alt={listing.title}
                                className="!w-12 !h-12 !object-cover !rounded-lg"
                              />
                              <Box className="!flex-1">
                                <Typography className="!font-semibold">
                                  {listing.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="!text-emerald-600 !font-bold"
                                >
                                  {listing.price!.toLocaleString()} ₫
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.listingId && (
                        <Typography
                          variant="caption"
                          className="!text-red-600 !mt-1"
                        >
                          {errors.listingId}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </Box>

                <Divider className="!my-4" />

                <Box className="!mb-8">
                  <Box className="!flex !items-center !gap-3 !mb-4">
                    <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-2 !rounded-xl">
                      <DollarSign size={24} className="!text-white" />
                    </Box>
                    <Typography variant="h5" className="!font-bold">
                      Giá khởi điểm
                    </Typography>
                  </Box>

                  {selectedListing && (
                    <Alert
                      severity="info"
                      icon={<TrendingUp />}
                      className="!mb-4 !rounded-xl !bg-blue-50 !border !border-blue-200"
                    >
                      <Typography variant="body2">
                        Giá niêm yết:{" "}
                        <strong className="!text-blue-700">
                          {selectedListing.price!.toLocaleString()} ₫
                        </strong>
                      </Typography>
                      <Typography variant="caption" className="!text-slate-600">
                        💡 Đặt giá khởi điểm thấp hơn để thu hút nhiều người
                        tham gia
                      </Typography>
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Nhập giá khởi điểm"
                    type="number"
                    value={formData.startingPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startingPrice: Number(e.target.value),
                      }))
                    }
                    error={!!errors.startingPrice}
                    helperText={errors.startingPrice}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign size={20} className="!text-emerald-600" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography className="!font-bold !text-slate-600">
                            ₫
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    className="!mb-3"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />

                  {formData.startingPrice > 0 && selectedListing && (
                    <Box className="!p-4 !bg-gradient-to-r !from-emerald-50 !to-blue-50 !rounded-xl !border !border-emerald-200">
                      <Box className="!flex !items-center !justify-between">
                        <Box>
                          <Typography
                            variant="body2"
                            className="!text-slate-600 !mb-1"
                          >
                            Giá khởi điểm của bạn
                          </Typography>
                          <Typography
                            variant="h5"
                            className="!font-bold !bg-gradient-to-r !from-emerald-600 !to-blue-600 !bg-clip-text !text-transparent"
                          >
                            {formData.startingPrice.toLocaleString()} ₫
                          </Typography>
                        </Box>
                        <Chip
                          label={`${Math.round(
                            (formData.startingPrice / selectedListing.price!) *
                              100
                          )}% giá gốc`}
                          className="!bg-white !text-emerald-700 !font-bold !shadow-sm"
                        />
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider className="!my-4" />

                <Box>
                  <Box className="!flex !items-center !gap-3 !mb-4">
                    <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-2 !rounded-xl">
                      <Clock size={24} className="!text-white" />
                    </Box>
                    <Typography variant="h5" className="!font-bold">
                      Thời gian đấu giá
                    </Typography>
                  </Box>

                  <Alert
                    severity="info"
                    icon={<Calendar />}
                    className="!mb-4 !rounded-xl !bg-emerald-50 !border !border-emerald-200"
                  >
                    <Typography variant="body2">
                      ⏱️ Thời gian đấu giá từ <strong>1 giờ</strong> đến{" "}
                      <strong>30 ngày</strong>
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Ngày giờ bắt đầu"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: getMinDateTime() }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Ngày giờ kết thúc"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: getMinEndDateTime() }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {calculateDuration() && (
                    <Box className="!mt-4 !p-4 !bg-gradient-to-r !from-blue-50 !to-emerald-50 !rounded-xl !border !border-blue-200">
                      <Typography
                        variant="body2"
                        className="!text-slate-600 !mb-2"
                      >
                        📅 Tổng quan thời gian
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="caption"
                            className="!text-slate-500"
                          >
                            Bắt đầu
                          </Typography>
                          <Typography
                            variant="body2"
                            className="!font-semibold !text-blue-700"
                          >
                            {formatDate(formData.startDate)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="caption"
                            className="!text-slate-500"
                          >
                            Kết thúc
                          </Typography>
                          <Typography
                            variant="body2"
                            className="!font-semibold !text-emerald-700"
                          >
                            {formatDate(formData.endDate)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box className="!mt-3 !pt-3 !border-t !border-slate-200">
                        <Typography
                          variant="body2"
                          className="!font-bold !text-slate-700"
                        >
                          ⚡ Thời lượng: {calculateDuration()}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Submit Button */}
                <Box className="!mt-8 !pt-6 !border-t">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={createAuctionMutation.isPending}
                    className="!py-4 !rounded-xl !text-lg !font-bold !bg-gradient-to-r !from-emerald-500 !via-blue-500 !to-emerald-600 !shadow-lg hover:!shadow-xl !transition-all"
                    startIcon={
                      createAuctionMutation.isPending ? (
                        <CircularProgress size={24} className="!text-white" />
                      ) : (
                        <Sparkles size={24} />
                      )
                    }
                  >
                    {createAuctionMutation.isPending
                      ? "Đang tạo..."
                      : "Tạo buổi đấu giá"}
                  </Button>
                </Box>

                {createAuctionMutation.isError && (
                  <Alert
                    severity="error"
                    icon={<AlertCircle />}
                    className="!mt-4 !rounded-xl"
                  >
                    <Typography className="!font-semibold !mb-1">
                      Có lỗi xảy ra
                    </Typography>
                    <Typography variant="body2">
                      Không thể tạo buổi đấu giá. Vui lòng thử lại sau.
                    </Typography>
                  </Alert>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              {selectedListing ? (
                <Paper className="!p-6 !rounded-xl !border-2 !border-blue-200 !sticky !top-4 !bg-gradient-to-br !from-white !to-emerald-50/30">
                  <Box className="!flex !items-center !gap-2 !mb-4">
                    <Sparkles size={20} className="!text-emerald-600" />
                    <Typography variant="h6" className="!font-bold">
                      Xem trước
                    </Typography>
                  </Box>
                  <Divider className="!mb-4" />

                  <Card className="!rounded-xl !border-2 !border-red-500 !mb-4 !overflow-hidden">
                    <Box className="!relative">
                      <CardMedia
                        component="img"
                        image={
                          selectedListing.primaryImageUrl ||
                          "https://via.placeholder.com/400"
                        }
                        alt={selectedListing.title}
                        className="!h-56 !object-cover"
                      />
                      <Chip
                        label="Sắp đấu giá"
                        size="small"
                        className="!absolute !top-3 !left-3 !bg-gradient-to-r !from-emerald-500 !to-blue-600 !text-white !font-semibold !shadow-lg"
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" className="!font-bold !mb-3">
                        {selectedListing.title}
                      </Typography>

                      <Box className="!space-y-3">
                        <Box className="!p-3 !bg-slate-50 !rounded-xl">
                          <Typography
                            variant="caption"
                            className="!text-slate-600 !block !mb-1"
                          >
                            Giá niêm yết
                          </Typography>
                          <Typography
                            variant="h6"
                            className="!font-bold !text-slate-900"
                          >
                            {selectedListing.price!.toLocaleString()} ₫
                          </Typography>
                        </Box>

                        {formData.startingPrice > 0 && (
                          <Box className="!p-3 !bg-gradient-to-r !from-emerald-50 !to-blue-50 !rounded-xl !border !border-emerald-200">
                            <Typography
                              variant="caption"
                              className="!text-slate-600 !block !mb-1"
                            >
                              Giá khởi điểm
                            </Typography>
                            <Typography
                              variant="h5"
                              className="!font-bold !bg-gradient-to-r !from-emerald-600 !to-blue-600 !bg-clip-text !text-transparent"
                            >
                              {formData.startingPrice.toLocaleString()} ₫
                            </Typography>
                          </Box>
                        )}

                        {calculateDuration() && (
                          <Box className="!p-3 !bg-blue-50 !rounded-xl !border !border-blue-200">
                            <Box className="!flex !items-center !gap-2 !mb-2">
                              <Clock size={16} className="!text-blue-600" />
                              <Typography
                                variant="caption"
                                className="!text-blue-700 !font-semibold"
                              >
                                Thời gian đấu giá
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              className="!font-bold !text-blue-900"
                            >
                              {calculateDuration()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    className="!rounded-xl !bg-emerald-50 !border !border-emerald-200"
                  >
                    <Typography variant="body2" className="!font-semibold">
                      Sẵn sàng để tạo đấu giá! 🎉
                    </Typography>
                  </Alert>
                </Paper>
              ) : (
                <Paper className="!p-8 !rounded-xl !border-2 !border-blue-200 !text-center !bg-gradient-to-br !from-white !to-slate-50">
                  <Box className="!bg-slate-100 !w-16 !h-16 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                    <Gavel size={32} className="!text-slate-400" />
                  </Box>
                  <Typography variant="h6" className="!font-bold !mb-2">
                    Chọn sản phẩm
                  </Typography>
                  <Typography variant="body2" className="!text-slate-600">
                    Chọn sản phẩm để xem trước buổi đấu giá
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </form>
      </Container>

      <Dialog
        open={successDialogOpen}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "!rounded-3xl !p-6",
        }}
      >
        <DialogContent className="!text-center !py-8">
          <Box className="!bg-gradient-to-br !from-emerald-100 !to-blue-100 !w-24 !h-24 !rounded-full !flex !items-center !justify-center !mx-auto !mb-6">
            <CheckCircle size={48} className="!text-emerald-600" />
          </Box>
          <Typography variant="h4" className="!font-bold !mb-3">
            Tạo thành công! 🎉
          </Typography>
          <Typography className="!text-slate-600 !mb-6">
            Buổi đấu giá của bạn đã được tạo và sẽ bắt đầu vào thời gian đã chọn
          </Typography>
          <Box className="!flex !items-center !justify-center !gap-2">
            <CircularProgress size={20} className="!text-emerald-500" />
            <Typography variant="body2" className="!text-slate-500">
              Đang chuyển hướng đến trang đấu giá...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateAuctionPage;
