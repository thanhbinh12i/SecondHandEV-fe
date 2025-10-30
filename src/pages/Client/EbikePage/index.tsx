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
import { Search, Calendar, Filter, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ListingDto } from "src/types/listing.type";

const EBikeListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000000]);
  const [page, setPage] = useState(1);

  const isLoading = false;

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600&q=80";

  const mockListings: ListingDto[] = [
    {
      listingId: 1,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Giant 750W Mountain E-Bike",
      description:
        "Xe đạp địa hình Giant, mạnh mẽ cho leo núi. Pin 48V 15Ah, tầm xa 80km.",
      year: 2021,
      price: 22000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600",
      imageUrls: [],
      brand: "Giant",
      model: "MTB750",
    },
    {
      listingId: 2,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Trek 500W City E-Bike",
      description:
        "Xe đạp điện Trek phù hợp đi làm và thành phố. Thiết kế sang trọng.",
      year: 2020,
      price: 18000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "Trek",
      model: "City500",
    },
    {
      listingId: 3,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "FoldX 350W Foldable E-Bike",
      description:
        "Xe gấp gọn FoldX tiện lợi, dễ mang theo. Pin nhẹ, sạc nhanh.",
      year: 2019,
      price: 12000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-25T21:36:39",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "FoldX",
      model: "FX350",
    },
    {
      listingId: 4,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Specialized Turbo Vado 600W",
      description:
        "Xe đạp điện cao cấp Specialized, động cơ mạnh mẽ, pin 604Wh.",
      year: 2023,
      price: 45000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-15T14:20:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600",
      imageUrls: [],
      brand: "Specialized",
      model: "Turbo Vado",
    },
    {
      listingId: 5,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Yamaha PAS 400W City Cruiser",
      description: "Xe đạp điện Yamaha nhập khẩu, êm ái, phù hợp phụ nữ.",
      year: 2022,
      price: 25000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-10-10T09:30:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600",
      imageUrls: [],
      brand: "Yamaha",
      model: "PAS City",
    },
    {
      listingId: 6,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "VinFast Klara S 1200W",
      description:
        "Xe máy điện VinFast Klara S, pin rời tiện lợi, bảo hành 3 năm.",
      year: 2023,
      price: 28000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-20T16:45:00",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600",
      imageUrls: [],
      brand: "VinFast",
      model: "Klara S",
    },
    {
      listingId: 7,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "BMC Alpenchallenge AMP 500W",
      description: "Xe đạp điện thể thao BMC, nhẹ, bền, phù hợp đường dài.",
      year: 2024,
      price: 38000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-18T11:00:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600",
      imageUrls: [],
      brand: "BMC",
      model: "Alpenchallenge",
    },
    {
      listingId: 8,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Yadea G5 800W Scooter",
      description: "Xe máy điện Yadea G5, thiết kế trẻ trung, giá tốt.",
      year: 2023,
      price: 15000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-09-28T13:20:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "Yadea",
      model: "G5",
    },
    {
      listingId: 9,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Pega Cap A 600W Classic",
      description: "Xe máy điện Pega phong cách cổ điển, màu xanh độc đáo.",
      year: 2022,
      price: 19000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-20T10:15:00",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "Pega",
      model: "Cap A",
    },
    {
      listingId: 10,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Tesla Cyberquad 1500W ATV",
      description:
        "Xe địa hình điện Tesla Cyberquad, mạnh mẽ, phong cách tương lai.",
      year: 2024,
      price: 85000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-25T15:30:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600",
      imageUrls: [],
      brand: "Tesla",
      model: "Cyberquad",
    },
    {
      listingId: 11,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Cannondale Quick Neo 400W",
      description:
        "Xe đạp điện Cannondale nhẹ, thích hợp tập luyện và đi chơi.",
      year: 2023,
      price: 32000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-10-05T08:45:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600",
      imageUrls: [],
      brand: "Cannondale",
      model: "Quick Neo",
    },
    {
      listingId: 12,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "DYU D3F 250W Mini E-Bike",
      description: "Xe đạp điện mini DYU siêu nhỏ gọn, phù hợp sinh viên.",
      year: 2022,
      price: 8500000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-09-15T12:00:00",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "DYU",
      model: "D3F",
    },
    {
      listingId: 13,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Haibike XDURO 700W Mountain",
      description: "Xe đạp điện leo núi Haibike Đức, suspension đầy đủ.",
      year: 2023,
      price: 55000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-12T14:30:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "Haibike",
      model: "XDURO",
    },
    {
      listingId: 14,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Xiaomi Himo C26 350W",
      description: "Xe đạp điện Xiaomi Himo thiết kế đẹp, giá rẻ.",
      year: 2021,
      price: 11000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-09-10T09:20:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600",
      imageUrls: [],
      brand: "Xiaomi",
      model: "Himo C26",
    },
    {
      listingId: 15,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Gogoro S2 ABS 1200W Smart Scooter",
      description:
        "Xe máy điện Gogoro thông minh, đổi pin nhanh, công nghệ cao.",
      year: 2024,
      price: 48000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-22T17:00:00",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600",
      imageUrls: [],
      brand: "Gogoro",
      model: "S2 ABS",
    },
    {
      listingId: 16,
      memberId: 1,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Cube Touring Hybrid 500W",
      description: "Xe đạp điện touring Cube, pin lớn, đi xa 120km.",
      year: 2023,
      price: 42000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-08T11:45:00",
      sellerDisplayName: "Nguyễn Văn An",
      sellerEmail: "an.nguyen@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600",
      imageUrls: [],
      brand: "Cube",
      model: "Touring Hybrid",
    },
    {
      listingId: 17,
      memberId: 2,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "NIU MQi+ Sport 1500W",
      description: "Xe máy điện NIU cao cấp, màn hình cảm ứng, kết nối app.",
      year: 2024,
      price: 38000000,
      listingType: "auction",
      listingStatus: "active",
      createdAt: "2025-10-19T13:15:00",
      sellerDisplayName: "Trần Thị Hoa",
      sellerEmail: "hoa.tran@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600",
      imageUrls: [],
      brand: "NIU",
      model: "MQi+ Sport",
    },
    {
      listingId: 18,
      memberId: 3,
      categoryId: 2,
      categoryName: "E-Bike",
      title: "Scott E-Spark 600W Full Suspension",
      description: "Xe đạp điện thể thao Scott, giảm xóc toàn phần.",
      year: 2023,
      price: 62000000,
      listingType: "fixed",
      listingStatus: "active",
      createdAt: "2025-10-14T10:30:00",
      sellerDisplayName: "Lê Minh Tuấn",
      sellerEmail: "tuan.le@example.com",
      primaryImageUrl:
        "https://images.unsplash.com/photo-1559294582-2f3f2e2c4ab4?w=800&h=600",
      imageUrls: [],
      brand: "Scott",
      model: "E-Spark",
    },
  ];

  const listings = mockListings;
  const totalPages = Math.ceil(listings.length / 12);
  const paginatedListings = listings.slice((page - 1) * 12, page * 12);

  const brands = [
    ...new Set(mockListings.map((l) => l.brand).filter(Boolean)),
  ].sort();
  const years = [
    ...new Set(mockListings.map((l) => l.year).filter(Boolean)),
  ].sort((a, b) => b! - a!);

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
    <Box className="!min-h-screen !bg-gradient-to-br !from-blue-50 !via-slate-50 !to-purple-50 !py-8">
      <Container maxWidth="xl">
        <Box className="!mb-8">
          <Typography variant="h3" className="!font-bold !text-slate-900 !mb-3">
            Xe đạp & Xe máy điện
          </Typography>
          <Typography variant="h6" className="!text-slate-600">
            Khám phá các dòng xe điện hiện đại, thân thiện môi trường
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper className="!p-6 !rounded-3xl !shadow-xl !sticky !top-24">
              <Box className="!flex !items-center !gap-3 !mb-6">
                <Filter className="!text-blue-600" size={24} />
                <Typography variant="h6" className="!font-bold !text-slate-900">
                  Bộ lọc
                </Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Tìm kiếm xe..."
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
                <InputLabel>Hãng xe</InputLabel>
                <Select
                  value={brandFilter}
                  label="Hãng xe"
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

              <FormControl fullWidth size="small" className="!mb-6">
                <InputLabel>Năm sản xuất</InputLabel>
                <Select
                  value={yearFilter}
                  label="Năm sản xuất"
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
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
                  max={100000000}
                  step={1000000}
                  valueLabelFormat={(value) =>
                    `${(value / 1000000).toFixed(0)}M`
                  }
                  className="!text-blue-600"
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

              <FormControl fullWidth size="small" className="!mb-4">
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
                  <MenuItem value="year_desc">Năm mới nhất</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="outlined"
                className="!border-blue-500 !text-blue-600 !rounded-xl hover:!bg-blue-50"
              >
                Đặt lại bộ lọc
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Box className="!flex !justify-between !items-center !mb-6">
              <Typography variant="body1" className="!text-slate-600">
                Hiển thị {paginatedListings.length} / {listings.length} kết quả
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {paginatedListings.map((listing) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={listing.listingId}>
                  <Card
                    onClick={() => handleCardClick(listing.listingId)}
                    className="!rounded-2xl !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-105 !cursor-pointer !border-2 !border-transparent hover:!border-blue-500"
                  >
                    <Box className="!relative !overflow-hidden">
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(listing)}
                        alt={listing.title}
                        className="!h-52 !object-cover !transition-transform !duration-500 hover:!scale-110"
                      />
                      {listing.listingType && (
                        <Chip
                          label={getListingTypeLabel(listing.listingType)}
                          size="small"
                          className="!absolute !top-3 !left-3 !bg-blue-500 !text-white !font-semibold !shadow-lg"
                        />
                      )}
                      {listing.year && listing.year >= 2023 && (
                        <Chip
                          label="Mới"
                          size="small"
                          className="!absolute !top-3 !right-3 !bg-emerald-500 !text-white !font-semibold !shadow-lg"
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
                          className="!text-slate-600 !mb-4 !line-clamp-2 !min-h-[2.5rem]"
                        >
                          {listing.description}
                        </Typography>
                      )}

                      <Box className="!flex !flex-wrap !gap-2 !mb-4">
                        {listing.brand && (
                          <Chip
                            icon={<Zap size={12} />}
                            label={listing.brand}
                            size="small"
                            className="!bg-purple-100 !text-purple-700 !font-medium"
                          />
                        )}
                        {listing.year && (
                          <Chip
                            icon={<Calendar size={12} />}
                            label={listing.year}
                            size="small"
                            className="!bg-blue-100 !text-blue-700 !font-medium"
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
                            className="!font-bold !text-blue-600"
                          >
                            {listing.price?.toLocaleString() || 0} đ
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          className="!bg-gradient-to-r !from-blue-500 !to-cyan-600 !rounded-xl !shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(listing.listingId);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </Box>

                      <Box className="!flex !items-center !justify-between !mt-3 !pt-3 !border-t !border-slate-200">
                        <Typography
                          variant="caption"
                          className="!text-slate-600 !truncate !flex-1"
                        >
                          👤 {listing.sellerDisplayName}
                        </Typography>
                        <Chip
                          label={listing.model || "N/A"}
                          size="small"
                          className="!bg-slate-100 !text-slate-700 !text-xs"
                        />
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
                className="!shadow-xl !bg-white !rounded-2xl !p-4"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EBikeListingsPage;
