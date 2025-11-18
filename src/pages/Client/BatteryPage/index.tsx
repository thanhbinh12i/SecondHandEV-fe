import React, { useState, useEffect } from "react";
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
import { useGetListing } from "src/queries/useListing";

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_asc" | "price_desc" | "popular";

const BatteryListingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200_000_000]);
  const [page, setPage] = useState(1);

  // Pin = categoryId = 1, chỉ lấy listingStatus = active
  const { data, isLoading } = useGetListing({
    categoryId: 1,
    listingStatus: "active",
    page: 1,
    pageSize: 200,
  });

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&q=80";

  const listings: ListingDto[] = data?.data.items ?? [];

  // Lấy brand từ data (nếu muốn cố định, có thể thay bằng mảng cứng)
  const brands = [
    ...new Set(listings.map((l) => l.brand).filter(Boolean)),
  ].sort() as string[];

  // ========== FILTER ==========
  const filteredListings = listings.filter((listing) => {
    // search theo title / description / brand / model
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        listing.title.toLowerCase().includes(q) ||
        listing.description?.toLowerCase().includes(q) ||
        listing.brand?.toLowerCase().includes(q) ||
        listing.model?.toLowerCase().includes(q);

      if (!matchesSearch) return false;
    }

    // filter hãng
    if (brandFilter !== "all" && listing.brand !== brandFilter) return false;

    // filter khoảng giá
    const price = listing.price ?? 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    return true;
  });

  // ========== SORT ==========
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return (a.price ?? 0) - (b.price ?? 0);
      case "price_desc":
        return (b.price ?? 0) - (a.price ?? 0);
      case "popular":
      case "newest":
      default: {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // mới nhất trước
      }
    }
  });

  // ========== PAGINATION ==========
  const totalResults = sortedListings.length;
  const totalPages = totalResults === 0 ? 1 : Math.ceil(totalResults / PAGE_SIZE);
  const paginatedListings = sortedListings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Khi đổi filter/search/sort thì quay về trang 1
  useEffect(() => {
    setPage(1);
  }, [searchQuery, brandFilter, priceRange, sortBy]);

  const getImageUrl = (listing: ListingDto): string => {
    return listing.primaryImageUrl || listing.imageUrls[0] || DEFAULT_IMAGE;
  };

  const getListingTypeLabel = (type?: string) => {
    switch (type) {
      case "sale":
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setBrandFilter("all");
    setPriceRange([0, 200_000_000]);
    setSortBy("newest");
    setPage(1);
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
          {/* Sidebar filter */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper className="!p-6 !rounded-3xl !shadow-xl !sticky !top-24">
              <Typography
                variant="h6"
                className="!font-bold !text-slate-900 !mb-6"
              >
                Bộ lọc
              </Typography>

              {/* Search */}
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

              {/* Brand */}
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

              {/* Price range */}
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
                  max={200_000_000}
                  step={1_000_000}
                  valueLabelFormat={(value) =>
                    `${(value / 1_000_000).toFixed(0)}M`
                  }
                  className="!text-emerald-600"
                />
                <Box className="!flex !justify-between !mt-2">
                  <Typography variant="caption" className="!text-slate-600">
                    {(priceRange[0] / 1_000_000).toFixed(0)}M đ
                  </Typography>
                  <Typography variant="caption" className="!text-slate-600">
                    {(priceRange[1] / 1_000_000).toFixed(0)}M đ
                  </Typography>
                </Box>
              </Box>

              {/* Sort */}
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={(e) =>
                    setSortBy(e.target.value as SortOption)
                  }
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
                onClick={handleResetFilters}
                className="!mt-6 !border-emerald-500 !text-emerald-600 !rounded-xl"
              >
                Đặt lại bộ lọc
              </Button>
            </Paper>
          </Grid>

          {/* List */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box className="!flex !justify-between !items-center !mb-6">
              <Typography variant="body1" className="!text-slate-600">
                Hiển thị {paginatedListings.length} / {totalResults} kết quả
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {paginatedListings.map((listing) => (
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
