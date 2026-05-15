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
import { Search, Calendar, Filter, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ListingDto } from "src/types/listing.type";
import { useGetListing } from "src/queries/useListing";

const PAGE_SIZE = 12;

const EBikeListingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "price_asc" | "price_desc" | "popular" | "year_desc"
  >("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState<string | number>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100_000_000]);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetListing({
    categoryId: 2,
    listingStatus: "active",
    page: 1,
    pageSize: 200,
  });

  const listings: ListingDto[] = data?.data.items ?? [];

  const brands = [
    ...new Set(listings.map((l) => l.brand).filter(Boolean)),
  ].sort() as string[];
  const years = [...new Set(listings.map((l) => l.year).filter(Boolean))].sort(
    (a, b) => (b ?? 0) - (a ?? 0)
  ) as number[];

  const filteredListings = listings.filter((listing) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        listing.title.toLowerCase().includes(q) ||
        listing.description?.toLowerCase().includes(q) ||
        listing.brand?.toLowerCase().includes(q) ||
        listing.model?.toLowerCase().includes(q);

      if (!matchesSearch) return false;
    }

    if (brandFilter !== "all" && listing.brand !== brandFilter) return false;

    if (yearFilter !== "all") {
      const yearNumber = Number(yearFilter);
      if (!listing.year || listing.year !== yearNumber) return false;
    }

    const price = listing.price ?? 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return (a.price ?? 0) - (b.price ?? 0);
      case "price_desc":
        return (b.price ?? 0) - (a.price ?? 0);
      case "year_desc":
        return (b.year ?? 0) - (a.year ?? 0);
      case "popular":
      case "newest":
      default: {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
    }
  });

  const totalResults = sortedListings.length;
  const totalPages =
    totalResults === 0 ? 1 : Math.ceil(totalResults / PAGE_SIZE);
  const paginatedListings = sortedListings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, brandFilter, yearFilter, priceRange, sortBy]);

  const getImageUrl = (listing: ListingDto): string => {
    return listing.primaryImageUrl || listing.imageUrls[0];
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
    setYearFilter("all");
    setPriceRange([0, 100_000_000]);
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
    <Box className="!min-h-screen !bg-gradient-to-br !from-blue-50 !via-slate-50 !to-purple-50 !py-8">
      <Container maxWidth="xl">
        <Box className="!mb-8">
          <Typography variant="h3" className="!font-bold !text-slate-900 !mb-3">
            Xe điện
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
                  max={100_000_000}
                  step={1_000_000}
                  valueLabelFormat={(value) =>
                    `${(value / 1_000_000).toFixed(0)}M`
                  }
                  className="!text-blue-600"
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

              <FormControl fullWidth size="small" className="!mb-4">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
                onClick={handleResetFilters}
                className="!border-blue-500 !text-blue-600 !rounded-xl hover:!bg-blue-50"
              >
                Đặt lại bộ lọc
              </Button>
            </Paper>
          </Grid>

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
                        className="!h-18 !font-bold !text-slate-900 !mb-3 !line-clamp-2 !min-h-[3.5rem]"
                      >
                        {listing.title}
                      </Typography>
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
