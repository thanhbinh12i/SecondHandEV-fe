import React, { useContext, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ShoppingBag, Store } from "lucide-react";
import { useBuyerOrders, useSellerOrders } from "src/queries/useOrder";
import OrderCard from "src/components/OrderCard";
import { AppContext } from "src/contexts/app.context";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MyOrders: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { profile } = useContext(AppContext);
  const {
    data: buyerOrdersData,
    isLoading: buyerLoading,
    error: buyerError,
  } = useBuyerOrders(profile?.memberId || 0, {
    page: 1,
    pageSize: 20,
  });

  const {
    data: sellerOrdersData,
    isLoading: sellerLoading,
    error: sellerError,
  } = useSellerOrders(profile?.memberId || 0, {
    page: 1,
    pageSize: 20,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const buyerOrders = buyerOrdersData?.data?.data || [];
  const sellerOrders = sellerOrdersData?.data?.data || [];

  return (
    <Box className="min-h-screen !bg-gradient-to-br !from-emerald-100  !to-blue-200 py-8">
      <Container maxWidth="lg">
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Đơn hàng của tôi
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Quản lý các đơn hàng mua và bán của bạn
          </Typography>
        </Box>

        <Card className="mb-4">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className="border-b"
            TabIndicatorProps={{
              className: "bg-emerald-500",
            }}
          >
            <Tab
              icon={<ShoppingBag size={20} />}
              iconPosition="start"
              label={`Đơn mua (${buyerOrders.length})`}
              className="normal-case font-semibold"
            />
            <Tab
              icon={<Store size={20} />}
              iconPosition="start"
              label={`Đơn bán (${sellerOrders.length})`}
              className="normal-case font-semibold"
            />
          </Tabs>
        </Card>

        <TabPanel value={tabValue} index={0}>
          {buyerLoading ? (
            <Box className="flex justify-center py-12">
              <CircularProgress className="text-emerald-500" />
            </Box>
          ) : buyerError ? (
            <Alert severity="error">
              Không thể tải đơn mua. Vui lòng thử lại sau.
            </Alert>
          ) : buyerOrders.length === 0 ? (
            <Alert severity="info">Bạn chưa có đơn mua nào.</Alert>
          ) : (
            buyerOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} isSeller={false} />
            ))
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {sellerLoading ? (
            <Box className="flex justify-center py-12">
              <CircularProgress className="text-blue-500" />
            </Box>
          ) : sellerError ? (
            <Alert severity="error">
              Không thể tải đơn bán. Vui lòng thử lại sau.
            </Alert>
          ) : sellerOrders.length === 0 ? (
            <Alert severity="info">Bạn chưa có đơn bán nào.</Alert>
          ) : (
            sellerOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} isSeller={true} />
            ))
          )}
        </TabPanel>
      </Container>
    </Box>
  );
};

export default MyOrders;
