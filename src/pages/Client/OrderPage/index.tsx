import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  Avatar,
  Snackbar,
} from "@mui/material";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useGetListingById } from "src/queries/useListing";
import { useCreatePayOSMutation } from "src/queries/useOrder";

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const createPayOSMutation = useCreatePayOSMutation();
  const { data, isLoading, isError } = useGetListingById({
    id: Number(id),
    enabled: !!id,
  });

  const listing = data?.data;
  const handlePayment = async () => {
    if (!listing) return;

    setIsProcessing(true);

    try {
      const paymentPayload = {
        listingId: listing.listingId,
      };

      const paymentResponse = await createPayOSMutation.mutateAsync(
        listing.listingId
      );

      console.log(paymentResponse);
      window.location.href = paymentResponse.data.data.checkoutUrl;

      setSnackbar({
        open: true,
        message: "Đang chuyển hướng đến trang thanh toán...",
        severity: "success",
      });

      setTimeout(() => {
        alert(
          "Demo: Chuyển hướng đến PayOS\n\nPayload:\n" +
            JSON.stringify(paymentPayload, null, 2)
        );
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra. Vui lòng thử lại!",
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Box className="!text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="!mt-4 !text-slate-600">
            Đang tải thông tin đơn hàng...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !listing) {
    return (
      <Box className="!min-h-screen !bg-slate-50">
        <Container maxWidth="lg" className="!py-6">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!mb-4 !text-slate-600"
          >
            Quay lại
          </Button>
          <Alert severity="error" className="!mb-4">
            <Typography variant="h6" className="!font-bold !mb-2">
              Không thể tải thông tin đơn hàng
            </Typography>
            <Typography variant="body2">
              Sản phẩm không tồn tại hoặc đã bị xóa. Vui lòng thử lại sau.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  const imageUrl = listing.primaryImageUrl || listing.imageUrls?.[0] || "";

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="lg" className="!py-6">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          className="!mb-4 !text-slate-600"
        >
          Quay lại
        </Button>

        <Typography variant="h4" className="!font-bold !mb-6">
          Xác nhận đơn hàng
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin sản phẩm
              </Typography>
              <Box className="!flex !gap-4">
                {imageUrl && (
                  <Card className="!flex-shrink-0">
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={listing.title || "Product"}
                      className="!w-32 !h-32 !object-cover !rounded-lg"
                    />
                  </Card>
                )}
                <Box className="!flex-1">
                  <Typography variant="h6" className="!font-bold !mb-2">
                    {listing.title || "Chưa có tiêu đề"}
                  </Typography>
                  <Box className="!flex !items-center !gap-2 !mb-2">
                    <Chip
                      label={listing.categoryName || "Chưa phân loại"}
                      size="small"
                      className="!font-semibold"
                    />
                    {(listing.brand || listing.model) && (
                      <Chip
                        label={`${listing.brand || ""} ${
                          listing.model || ""
                        }`.trim()}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    className="!font-bold !text-emerald-600"
                  >
                    {listing.price?.toLocaleString() || "0"} ₫
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin người bán
              </Typography>
              <Box className="!flex !items-center !gap-4 !mb-4">
                <Avatar className="!w-16 !h-16 !bg-gradient-to-br !from-blue-500 !to-cyan-600">
                  {listing.sellerDisplayName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Typography variant="h6" className="!font-bold">
                    {listing.sellerDisplayName || "Người bán"}
                  </Typography>
                  <Box className="!flex !items-center !gap-1 !text-slate-600">
                    <CheckCircle size={16} className="!text-emerald-500" />
                    <Typography variant="body2">Đã xác thực</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper className="!p-6 !rounded-2xl !shadow-lg !sticky !top-6">
              <Typography variant="h6" className="!font-bold !mb-4">
                Thông tin thanh toán
              </Typography>

              <Box className="!space-y-3 !mb-4">
                <Box className="!flex !justify-between">
                  <Typography variant="body2" className="!text-slate-600">
                    Tạm tính
                  </Typography>
                  <Typography variant="body2" className="!font-semibold">
                    {listing.price?.toLocaleString() || "0"} ₫
                  </Typography>
                </Box>
                <Box className="!flex !justify-between">
                  <Typography variant="body2" className="!text-slate-600">
                    Phí vận chuyển
                  </Typography>
                  <Typography
                    variant="body2"
                    className="!font-semibold !text-emerald-600"
                  >
                    Miễn phí
                  </Typography>
                </Box>
                <Divider />
                <Box className="!flex !justify-between !items-center">
                  <Typography variant="h6" className="!font-bold">
                    Tổng cộng
                  </Typography>
                  <Typography
                    variant="h5"
                    className="!font-bold !text-emerald-600"
                  >
                    {listing.price?.toLocaleString() || "0"} ₫
                  </Typography>
                </Box>
              </Box>

              <Divider className="!my-4" />

              <Alert severity="info" className="!mb-4">
                <Typography variant="body2">
                  Bạn sẽ được chuyển đến trang thanh toán PayOS để hoàn tất giao
                  dịch
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={isProcessing}
                onClick={handlePayment}
                className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !py-3 !mb-3"
                startIcon={
                  isProcessing ? (
                    <CircularProgress size={20} className="!text-white" />
                  ) : (
                    <CreditCard size={20} />
                  )
                }
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
              </Button>

              <Box className="!flex !items-center !justify-center !gap-2 !py-3 !bg-slate-50 !rounded-xl">
                <Typography variant="body2" className="!text-slate-600">
                  Thanh toán an toàn với
                </Typography>
                <Box className="!flex !items-center !gap-1">
                  <Box className="!bg-blue-600 !text-white !px-3 !py-1 !rounded !font-bold !text-sm">
                    Pay
                  </Box>
                  <Box className="!bg-orange-500 !text-white !px-3 !py-1 !rounded !font-bold !text-sm">
                    OS
                  </Box>
                </Box>
              </Box>

              <Box className="!mt-4 !space-y-2">
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Bảo mật thông tin thanh toán
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Hoàn tiền nếu có sự cố
                  </Typography>
                </Box>
                <Box className="!flex !items-center !gap-2">
                  <CheckCircle size={16} className="!text-emerald-500" />
                  <Typography variant="caption" className="!text-slate-600">
                    Hỗ trợ 24/7
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

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

export default OrderPage;
