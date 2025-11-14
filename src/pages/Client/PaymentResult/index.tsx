/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetOrderById, useUpdateOrderMutation } from "src/queries/useOrder";
import { useUpdateStatusMutation } from "src/queries/useListing";

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const updateOrder = useUpdateOrderMutation();
  const updateListing = useUpdateStatusMutation();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPaymentInfo({
      orderId: p.get("orderId"),
      code: p.get("code"),
      id: p.get("id"),
      cancel: p.get("cancel"),
      status: p.get("status"),
      orderCode: p.get("orderCode"),
    });
  }, []);

  const orderId = paymentInfo?.orderId ? parseInt(paymentInfo.orderId) : 0;

  const { data: orderData, isLoading } = useGetOrderById({
    id: orderId,
    enabled: !!paymentInfo?.orderId,
  });

  useEffect(() => {
    const run = async () => {
      if (!paymentInfo?.status) return;
      if (updateOrder.isPending || updateListing.isPending) return;

      const listingId = orderData?.data?.data.listing.listingId;

      try {
        if (paymentInfo.status === "PAID") {
          await updateOrder.mutateAsync({
            id: orderId,
            body: { orderStatus: "Completed" },
          });

          if (listingId) {
            await updateListing.mutateAsync({
              id: listingId,
              body: { status: "sold" },
            });
          }
        }

        if (paymentInfo.status === "CANCELLED") {
          await updateOrder.mutateAsync({
            id: orderId,
            body: { orderStatus: "Cancelled" },
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [orderData, orderId, paymentInfo, updateListing, updateOrder]);

  if (!paymentInfo || isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  const isPaid = paymentInfo.status === "PAID";
  const isCancelled = paymentInfo.status === "CANCELLED";

  const getStatusConfig = () => {
    if (isPaid) {
      return {
        icon: <CheckCircle className="w-24 h-24 text-white" />,
        title: "Thanh toán thành công!",
        subtitle: "Đơn hàng của bạn đã được xác nhận",
        bgColor: "bg-emerald-500",
        chipColor: "success" as const,
      };
    }
    if (isCancelled) {
      return {
        icon: <XCircle className="w-24 h-24 text-white" />,
        title: "Thanh toán đã hủy",
        subtitle: "Giao dịch đã bị hủy bỏ",
        bgColor: "bg-red-400",
        chipColor: "error" as const,
      };
    }
    return {
      icon: <Clock className="w-24 h-24 text-white" />,
      title: "Đang xử lý",
      subtitle: "Đang kiểm tra thanh toán",
      bgColor: "bg-yellow-500",
      chipColor: "warning" as const,
    };
  };

  const statusConfig = getStatusConfig();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-10">
      <Card className="max-w-2xl w-full shadow-2xl">
        <Box className={`${statusConfig.bgColor} p-8 text-center`}>
          <Box className="flex justify-center mb-4">{statusConfig.icon}</Box>
          <Typography variant="h4" className="text-white font-bold mb-2">
            {statusConfig.title}
          </Typography>
          <Typography variant="body1" className="text-white opacity-90">
            {statusConfig.subtitle}
          </Typography>
        </Box>

        <CardContent className="p-8">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Chi tiết giao dịch
          </Typography>

          <Stack spacing={2}>
            <Box className="flex justify-between items-center py-2">
              <Typography variant="body2" className="text-gray-600">
                Mã đơn hàng:
              </Typography>
              <Typography
                variant="body2"
                className="font-semibold text-gray-800"
              >
                #{paymentInfo.orderId}
              </Typography>
            </Box>
            <Divider />

            <Box className="flex justify-between items-center py-2">
              <Typography variant="body2" className="text-gray-600">
                Mã giao dịch:
              </Typography>
              <Typography
                variant="body2"
                className="font-semibold text-gray-800"
              >
                {paymentInfo.orderCode}
              </Typography>
            </Box>
            <Divider />

            <Box className="flex justify-between items-start py-2">
              <Typography variant="body2" className="text-gray-600">
                Mã thanh toán:
              </Typography>
              <Typography
                variant="body2"
                className="font-mono text-xs text-gray-800 break-all text-right max-w-[200px]"
              >
                {paymentInfo.id}
              </Typography>
            </Box>
            <Divider />

            <Box className="flex justify-between items-center py-2">
              <Typography variant="body2" className="text-gray-600">
                Mã phản hồi:
              </Typography>
              <Typography
                variant="body2"
                className="font-semibold text-gray-800"
              >
                {paymentInfo.code}
              </Typography>
            </Box>
            <Divider />

            <Box className="flex justify-between items-center py-2">
              <Typography variant="body2" className="text-gray-600">
                Trạng thái thanh toán:
              </Typography>
              <Chip
                label={paymentInfo.status}
                color={statusConfig.chipColor}
                size="small"
                className="font-bold"
              />
            </Box>
          </Stack>
          <Stack spacing={2} className="mt-8">
            <Button
              variant="contained"
              fullWidth
              startIcon={<ArrowLeft size={20} />}
              onClick={handleGoHome}
              className="py-3 normal-case font-semibold bg-emerald-500 hover:bg-emerald-600"
            >
              Về trang chủ
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentResult;
