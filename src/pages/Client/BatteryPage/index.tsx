import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Slider,
} from "@mui/material";
import { Search, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ListingDto } from "src/types/listing.type";
// import { useGetListings } from "src/queries/useListing";

const BatteryListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000000]);
  const [page, setPage] = useState(1);

  const isLoading = false;

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&q=80";

  const mockListings: ListingDto[] = [
    {
      listingId: 8,
      memberId: 5,
      categoryId: 1,
      categoryName: "Battery",
      title: "Pin LiFePO4 60kWh - VinFast VF8 (2023)",
      description: "Pin còn rất mới, bảo hành 2 năm",
      year: 2023,
      price: 180000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-10-28T10:06:44",
      sellerDisplayName: "iEm Bình Nè",
      sellerEmail: "nptbinh17092004@gmail.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600",
      imageUrls: [],
      brand: "VinFast",
      model: "VF8",
    },
    {
      listingId: 6,
      memberId: 3,
      categoryId: 1,
      categoryName: "Battery",
      title: "Panasonic 48V 700Wh Battery",
      description: "Pin Panasonic dung lượng cao, đi xa.",
      year: 2020,
      price: 4500000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-25T21:37:35",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800&h=600",
      imageUrls: [],
      brand: "Panasonic",
      model: "48V700",
    },
    {
      listingId: 5,
      memberId: 2,
      categoryId: 1,
      categoryName: "Battery",
      title: "LG 36V 300Wh Battery",
      description: "Pin LG nhỏ gọn, phù hợp xe thành phố.",
      year: 2022,
      price: 2500000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-25T21:37:35",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600",
      imageUrls: [],
      brand: "LG",
      model: "36V300C",
    },
    {
      listingId: 4,
      memberId: 1,
      categoryId: 1,
      categoryName: "Battery",
      title: "Samsung 48V 500Wh Battery",
      description: "Pin Samsung dung lượng 500Wh, còn sử dụng tốt.",
      year: 2021,
      price: 3500000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-25T21:37:35",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?w=800&h=600",
      imageUrls: [],
      brand: "Samsung",
      model: "48V500",
    },
    {
      listingId: 3,
      memberId: 1,
      categoryId: 1,
      categoryName: "Battery",
      title: "BYD Blade Battery 75kWh",
      description: "Pin BYD Blade công nghệ mới nhất, an toàn cao",
      year: 2024,
      price: 95000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-08-15T14:20:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600",
      imageUrls: [],
      brand: "BYD",
      model: "Blade 75",
    },
    {
      listingId: 2,
      memberId: 2,
      categoryId: 1,
      categoryName: "Battery",
      title: "Tesla Model 3 Battery Pack 60kWh",
      description: "Pin Tesla chính hãng, độ bền cao",
      year: 2022,
      price: 150000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-07-10T09:30:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800&h=600",
      imageUrls: [],
      brand: "Tesla",
      model: "Model 3",
    },
  ];

  const listings = mockListings;
  const totalPages = 3;

  const brands = ["VinFast", "Samsung", "LG", "Panasonic", "BYD", "Tesla"];

  const getImageUrl = (listing: ListingDto): string => {
    return listing.primaryImageUrl || listing.imageUrls[0] || DEFAULT_IMAGE;
  };

  const getListingTypeLabel = (type?: string) => {
    switch (type) {
      case "fixed":
        return "Giá cố định";
      case "auction":
        return "Đấu giá";
      default:
        return "";
    }
  };

  const handleCardClick = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  if (isLoading) {
    return (
      <Box className="!min-h-screen !flex !items-center !justify-center">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !to-slate-100 !py-8">
      <Container maxWidth="xl">
        <Box className="!mb-8">
          <Typography variant="h3" className="!font-bold !text-slate-900 !mb-3">
            Pin xe điện
          </Typography>
          <Typography variant="h6" className="!text-slate-600">
            Khám phá các loại pin chất lượng cao cho xe điện của bạn
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper className="!p-6 !rounded-3xl !shadow-xl !sticky !top-24">
              <Typography
                variant="h6"
                className="!font-bold !text-slate-900 !mb-6"
              >
                Bộ lọc
              </Typography>

              <TextField
                fullWidth
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                className="!mb-6"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} className="!text-slate-400" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth size="small" className="!mb-6">
                <InputLabel>Hãng</InputLabel>
                <Select
                  value={brandFilter}
                  label="Hãng"
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box className="!mb-6">
                <Typography
                  variant="body2"
                  className="!font-semibold !text-slate-700 !mb-3"
                >
                  Khoảng giá
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) =>
                    setPriceRange(newValue as number[])
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={200000000}
                  step={1000000}
                  valueLabelFormat={(value) =>
                    `${(value / 1000000).toFixed(0)}M`
                  }
                  className="!text-emerald-600"
                />
                <Box className="!flex !justify-between !mt-2">
                  <Typography variant="caption" className="!text-slate-600">
                    {(priceRange[0] / 1000000).toFixed(0)}M đ
                  </Typography>
                  <Typography variant="caption" className="!text-slate-600">
                    {(priceRange[1] / 1000000).toFixed(0)}M đ
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="price_asc">Giá tăng dần</MenuItem>
                  <MenuItem value="price_desc">Giá giảm dần</MenuItem>
                  <MenuItem value="popular">Phổ biến</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="outlined"
                className="!mt-6 !border-emerald-500 !text-emerald-600 !rounded-xl"
              >
                Đặt lại bộ lọc
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Box className="!flex !justify-between !items-center !mb-6">
              <Typography variant="body1" className="!text-slate-600">
                Hiển thị {listings.length} kết quả
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {listings.map((listing) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={listing.listingId}>
                  <Card
                    onClick={() => handleCardClick(listing.listingId)}
                    className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-105 !cursor-pointer"
                  >
                    <Box className="!relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(listing)}
                        alt={listing.title}
                        className="!h-52 !object-cover"
                      />
                      {listing.listingType && (
                        <Chip
                          label={getListingTypeLabel(listing.listingType)}
                          size="small"
                          className="!absolute !top-3 !left-3 !bg-emerald-500 !text-white !font-semibold !shadow-lg"
                        />
                      )}
                    </Box>

                    <CardContent className="!p-5">
                      <Typography
                        variant="h6"
                        className="!font-bold !text-slate-900 !mb-3 !line-clamp-2 !min-h-[3.5rem]"
                      >
                        {listing.title}
                      </Typography>

                      {listing.description && (
                        <Typography
                          variant="body2"
                          className="!text-slate-600 !mb-4 !line-clamp-2"
                        >
                          {listing.description}
                        </Typography>
                      )}

                      <Box className="!flex !flex-wrap !gap-2 !mb-4">
                        {listing.brand && (
                          <Chip
                            label={listing.brand}
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
                        {listing.model && (
                          <Chip
                            label={listing.model}
                            size="small"
                            className="!bg-purple-100 !text-purple-700"
                          />
                        )}
                      </Box>

                      <Box className="!flex !justify-between !items-center !pt-4 !border-t !border-slate-200">
                        <Box>
                          <Typography
                            variant="caption"
                            className="!text-slate-600"
                          >
                            Giá bán
                          </Typography>
                          <Typography
                            variant="h6"
                            className="!font-bold !text-emerald-600"
                          >
                            {listing.price?.toLocaleString() || 0} đ
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(listing.listingId);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>

                      <Box className="!flex !items-center !gap-2 !mt-3 !pt-3 !border-t !border-slate-200">
                        <Typography
                          variant="caption"
                          className="!text-slate-600"
                        >
                          Người bán: {listing.sellerDisplayName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box className="!flex !justify-center !mt-12">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                size="large"
                color="primary"
                className="!shadow-lg !bg-white !rounded-2xl !p-3"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BatteryListingsPage;
