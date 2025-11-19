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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

const RevenueChart = ({ orders }: { orders: any[] }) => {
  const [value, setValue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const availableOptions = useMemo(() => {
    const months = new Set<number>();
    const years = new Set<number>();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);

      const year = date.getFullYear();
      const jan1 = new Date(year, 0, 1);
      const firstMonday = new Date(jan1);
      const dayOfWeek = jan1.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      firstMonday.setDate(jan1.getDate() + daysUntilMonday);

      months.add(date.getMonth());
      years.add(date.getFullYear());
    });

    return {
      months: Array.from(months).sort((a, b) => a - b),
      years: Array.from(years).sort((a, b) => a - b),
    };
  }, [orders]);

  const revenueData = useMemo(() => {
    const processData = (period: string) => {
      if (orders.length === 0) return [];

      const dataMap = new Map();
      const result = [];

      switch (period) {
        case "Day":
          const current = new Date();
          current.setDate(current.getDate() - 6);

          for (let i = 0; i < 7; i++) {
            const key = current.toISOString().split("T")[0];
            dataMap.set(key, 0);
            current.setDate(current.getDate() + 1);
          }

          orders.forEach((order) => {
            const date = new Date(order.createdAt);
            const key = date.toISOString().split("T")[0];
            if (dataMap.has(key)) {
              dataMap.set(
                key,
                dataMap.get(key) + order.listing.commissionPrice
              );
            }
          });

          const displayCurrent = new Date();
          displayCurrent.setDate(displayCurrent.getDate() - 6);

          for (let i = 0; i < 7; i++) {
            const key = displayCurrent.toISOString().split("T")[0];
            result.push({
              date: `${displayCurrent.getDate()}/${
                displayCurrent.getMonth() + 1
              }`,
              commission: dataMap.get(key) || 0,
            });
            displayCurrent.setDate(displayCurrent.getDate() + 1);
          }
          break;

        case "Month":
          const year = new Date().getFullYear();
          const lastDayOfMonth = new Date(year, selectedMonth + 1, 0);

          const weeksInMonth = Math.ceil(lastDayOfMonth.getDate() / 7);

          for (let week = 1; week <= weeksInMonth; week++) {
            dataMap.set(week, 0);
          }

          orders.forEach((order) => {
            const date = new Date(order.createdAt);
            if (
              date.getMonth() === selectedMonth &&
              date.getFullYear() === year
            ) {
              const weekInMonth = Math.ceil(date.getDate() / 7);
              dataMap.set(
                weekInMonth,
                dataMap.get(weekInMonth) + order.listing.commissionPrice
              );
            }
          });

          for (let week = 1; week <= weeksInMonth; week++) {
            result.push({
              date: `Tuần ${week}`,
              commission: dataMap.get(week) || 0,
            });
          }
          break;

        case "Year":
          for (let month = 0; month < 12; month++) {
            dataMap.set(month, 0);
          }

          orders.forEach((order) => {
            const date = new Date(order.createdAt);
            if (date.getFullYear() === selectedYear) {
              const month = date.getMonth();
              dataMap.set(
                month,
                dataMap.get(month) + order.listing.commissionPrice
              );
            }
          });

          for (let month = 0; month < 12; month++) {
            result.push({
              date: `Tháng ${month + 1}`,
              commission: dataMap.get(month) || 0,
            });
          }
          break;
      }

      return result;
    };

    return {
      Day: processData("Day"),
      Month: processData("Month"),
      Year: processData("Year"),
    };
  }, [orders, selectedMonth, selectedYear]);

  const periods = ["Day", "Month", "Year"];
  const currentPeriod = periods[value];
  const data = revenueData[currentPeriod as keyof typeof revenueData];

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: emeraldBlue } }}
        >
          {["Ngày", "Tháng", "Năm"].map((label, idx) => (
            <Tab
              key={label}
              label={label}
              style={{ color: value === idx ? emeraldBlue : "inherit" }}
            />
          ))}
        </Tabs>

        {value === 2 && (
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Chọn tháng</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              label="Chọn tháng"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {value === 3 && availableOptions.years.length > 0 && (
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Chọn năm</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              label="Chọn năm"
            >
              {availableOptions.years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

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

const ListingTable = ({ listings }: { listings: any[] }) => {
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
      .slice(0, 10);
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
            📈 Thống Kê Doanh Thu
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
