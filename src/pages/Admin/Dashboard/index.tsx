/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Users, ClipboardList, Package, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetUserList } from "src/queries/useUser";
import { useGetListing } from "src/queries/useListing";
import { useGetOrderList } from "src/queries/useOrder";

const emeraldBlue = "rgb(20, 184, 166)";

// Component Biểu đồ Doanh Thu
const RevenueChart = ({ orders }: { orders: any[] }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  // Xử lý dữ liệu doanh thu theo period
  const revenueData = useMemo(() => {
    const processData = (period: string) => {
      const dataMap = new Map();

      orders.forEach((order) => {
        const date = new Date(order.createdAt);
        let key = "";

        switch (period) {
          case "Day":
            key = `${date.getDate()}/${date.getMonth() + 1}`;
            break;
          case "Week":
            const weekNum = Math.ceil(date.getDate() / 7);
            key = `Tuần ${weekNum}`;
            break;
          case "Month":
            key = `Tháng ${date.getMonth() + 1}`;
            break;
          case "Year":
            key = `${date.getFullYear()}`;
            break;
        }

        if (dataMap.has(key)) {
          dataMap.set(key, dataMap.get(key) + order.listing.commissionPrice);
        } else {
          dataMap.set(key, order.listing.commissionPrice);
        }
      });

      return Array.from(dataMap.entries())
        .map(([date, commission]) => ({ date, commission }))
        .slice(-10); // Lấy 10 records gần nhất
    };

    return {
      Day: processData("Day"),
      Week: processData("Week"),
      Month: processData("Month"),
      Year: processData("Year"),
    };
  }, [orders]);

  const periods = ["Day", "Week", "Month", "Year"];
  const currentPeriod = periods[value];
  const data = revenueData[currentPeriod as keyof typeof revenueData];

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { backgroundColor: emeraldBlue } }}
        className="mb-6"
      >
        {["Ngày", "Tuần", "Tháng", "Năm"].map((label, idx) => (
          <Tab
            key={label}
            label={label}
            style={{ color: value === idx ? emeraldBlue : "inherit" }}
          />
        ))}
      </Tabs>
      <Box className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: any) => `${value.toLocaleString("vi-VN")} VNĐ`}
            />
            <Legend />
            <Bar
              dataKey="commission"
              fill={emeraldBlue}
              name="Doanh thu"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

// Component Bảng Thống Kê Tin Đăng
const ListingTable = ({ listings }: { listings: any[] }) => {
  // Nhóm listings theo ngày
  const listingStats = useMemo(() => {
    const statsMap = new Map();

    listings.forEach((listing) => {
      const date = new Date(listing.createdAt).toISOString().split("T")[0];

      if (!statsMap.has(date)) {
        statsMap.set(date, { total: 0, active: 0, expired: 0 });
      }

      const stats = statsMap.get(date);
      stats.total += 1;

      if (listing.status === "active") {
        stats.active += 1;
      } else if (listing.status === "expired") {
        stats.expired += 1;
      }
    });

    return Array.from(statsMap.entries())
      .map(([date, stats], index) => ({
        id: index + 1,
        date,
        ...stats,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10); // Lấy 10 ngày gần nhất
  }, [listings]);

  const columns = [
    { field: "date", headerName: "Ngày", width: 200 },
    { field: "total", headerName: "Tổng Tin Đăng", width: 200 },
  ];

  return (
    <div className="h-96 w-full">
      <DataGrid
        rows={listingStats}
        columns={columns}
        pageSizeOptions={[5]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        className="shadow-sm border-2 border-gray-100"
      />
    </div>
  );
};

const Dashboard = () => {
  const { data: userData, isLoading: userLoading } = useGetUserList({});
  const { data: listingData, isLoading: listingLoading } = useGetListing({});
  const { data: orderData, isLoading: orderLoading } = useGetOrderList({});

  const totalUserCount = userData?.data?.totalCount || 0;

  const listingList = listingData?.data?.items || [];
  const totalListingCount = listingData?.data?.totalItems || 0;

  const orderList = Array.isArray(orderData?.data?.data)
    ? orderData.data.data.filter(
        (order: any) => order.orderStatus === "Completed"
      )
    : [];
  const totalOrderCount = orderList.length || 0;

  const totalRevenue = useMemo(() => {
    return orderList.reduce(
      (sum: number, order: any) => sum + (order.listing.commissionPrice || 0),
      0
    );
  }, [orderList]);

  const stats = [
    {
      title: "Tổng Người dùng",
      value: userLoading ? (
        <CircularProgress size={20} />
      ) : (
        totalUserCount.toLocaleString("vi-VN")
      ),
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Tổng Tin đăng",
      value: listingLoading ? (
        <CircularProgress size={20} />
      ) : (
        totalListingCount.toLocaleString("vi-VN")
      ),
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tổng Đơn hàng",
      value: orderLoading ? (
        <CircularProgress size={20} />
      ) : (
        totalOrderCount.toLocaleString("vi-VN")
      ),
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Tổng Doanh thu",
      value: orderLoading ? (
        <CircularProgress size={20} />
      ) : (
        `${totalRevenue.toLocaleString("vi-VN")} VNĐ`
      ),
      icon: DollarSign,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1
        className="text-3xl font-bold mb-8 text-gray-800 pb-2"
        style={{ borderBottom: `2px solid ${emeraldBlue}` }}
      >
        <span style={{ color: emeraldBlue }}>📊</span> Trang thống kê
      </h1>

      <Grid container spacing={3} className="mb-8">
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <CardContent className="flex items-center p-4">
                <div className={`p-3 rounded-full mr-4 ${stat.bgColor}`}>
                  <stat.icon size={28} className={stat.color} />
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 uppercase text-xs"
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    className="font-bold text-gray-900"
                  >
                    {stat.value}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card className="shadow-lg mb-8 rounded-lg">
        <CardContent>
          <h2
            className="text-xl font-semibold mb-4 text-gray-700 pb-2"
            style={{ color: emeraldBlue, borderBottom: "1px solid #ccc" }}
          >
            📈 Thống Kê Doanh Thu Theo Ngày, Tuần, Tháng, Năm
          </h2>
          {orderLoading ? (
            <Box className="flex justify-center items-center h-96">
              <CircularProgress />
            </Box>
          ) : (
            <RevenueChart orders={orderList} />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-lg">
        <CardContent>
          <h2
            className="text-xl font-semibold mb-4 text-gray-700 pb-2"
            style={{ color: emeraldBlue, borderBottom: "1px solid #ccc" }}
          >
            📋 Thống Kê Tin Đăng Theo Ngày
          </h2>
          {listingLoading ? (
            <Box className="flex justify-center items-center h-96">
              <CircularProgress />
            </Box>
          ) : (
            <ListingTable listings={listingList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
