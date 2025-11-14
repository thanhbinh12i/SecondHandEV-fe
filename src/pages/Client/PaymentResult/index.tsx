import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

interface PaymentInfo {
  orderId: string | null;
  code: string | null;
  id: string | null;
  cancel: string | null;
  status: string | null;
  orderCode: string | null;
}

const PaymentResult: React.FC = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const info: PaymentInfo = {
      orderId: urlParams.get("orderId"),
      code: urlParams.get("code"),
      id: urlParams.get("id"),
      cancel: urlParams.get("cancel"),
      status: urlParams.get("status"),
      orderCode: urlParams.get("orderCode"),
    };

    setPaymentInfo(info);
    setLoading(false);
  }, []);

  if (loading || !paymentInfo) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center">
        <CircularProgress size={60} className="text-emerald-600" />
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
        chipColor: "primary" as const,
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
    window.location.href = "/";
  };
  return (
    <Box className="bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-10">
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
                Trạng thái:
              </Typography>
              <Chip
                label={paymentInfo.status}
                color={statusConfig.chipColor}
                size="small"
                className="font-bold"
              />
            </Box>
          </Stack>

          <Box className="mt-6">
            {isPaid && (
              <Alert
                severity="success"
                icon={<CheckCircle size={20} />}
                className="mb-4"
              >
                Thanh toán đã được xử lý thành công. Bạn sẽ nhận được email xác
                nhận trong giây lát.
              </Alert>
            )}

            {isCancelled && (
              <Alert
                severity="info"
                icon={<XCircle size={20} />}
                className="mb-4"
              >
                Giao dịch đã bị hủy. Nếu bạn muốn thử lại, vui lòng quay lại
                trang thanh toán.
              </Alert>
            )}
          </Box>

          <Stack spacing={2} className="mt-8">
            <Button
              variant={"contained"}
              fullWidth
              startIcon={<ArrowLeft size={20} />}
              onClick={handleGoHome}
              className={`py-3 normal-case font-semibold bg-blue-500 hover:bg-blue-600`}
            >
              {"Về trang chủ"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentResult;
