import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { User, Store, Phone, Mail, Calendar, Package } from "lucide-react";
import { Order } from "src/types/order.type";

interface OrderCardProps {
  order: Order;
  isSeller: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isSeller }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      case "Completed":
        return "info";
      default:
        return "default";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const contactPerson = isSeller ? order.buyer : order.seller;

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box className="flex items-start justify-between mb-2">
              <Box>
                <Typography
                  variant="h6"
                  className="!font-bold text-gray-800 mb-1"
                >
                  {order.listing.title}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 flex items-center"
                >
                  <Package size={14} />
                  Mã đơn hàng: #{order.orderId}
                </Typography>
              </Box>
              <Chip
                label={order.orderStatus}
                color={getStatusColor(order.orderStatus)}
                size="small"
                className="font-semibold"
              />
            </Box>

            <Typography variant="body2" className="text-gray-600 !mb-2">
              {order.listing.description}
            </Typography>

            <Divider />

            <Box className="bg-gray-50 p-3 rounded-lg">
              <Typography
                variant="subtitle2"
                className="font-semibold mb-2 flex items-center gap-1"
              >
                {isSeller ? (
                  <>
                    <User size={16} className="text-emerald-600 " />
                    <p className="text-emerald-600 font-bold">
                      Người mua: {contactPerson.displayName}
                    </p>
                  </>
                ) : (
                  <>
                    <Store size={16} className="text-blue-600" />
                    <p className="text-blue-600 font-bold">
                      Người bán: {contactPerson.displayName}
                    </p>
                  </>
                )}
              </Typography>
              <Box className="space-y-1">
                <Typography
                  variant="body2"
                  className="text-gray-600 flex items-center gap-1"
                >
                  <Mail size={14} />
                  {contactPerson.email}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-600 flex items-center gap-1"
                >
                  <Phone size={14} />
                  {contactPerson.phone}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="h-full flex flex-col justify-between">
              <Box>
                <Typography variant="h6" className="text-gray-500 mb-1 block">
                  Tổng giá trị
                </Typography>
                <Typography
                  variant="h4"
                  className="font-bold text-emerald-600 mb-3"
                >
                  {formatPrice(order.orderAmount)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  className="text-gray-500 flex items-center gap-1 mb-2"
                >
                  <Calendar size={20} />
                  {formatDate(order.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
