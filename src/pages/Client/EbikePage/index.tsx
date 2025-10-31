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
import { useGetListing } from "src/queries/useListing";

const EBikeListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000000]);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetListing({ categoryId: 1 });

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&h=600&q=80";

  const listings = data?.data.items;
  const activeListings = listings?.filter(
    (listing) => listing.listingStatus === "active"
  );
  const totalPages = Math.ceil((activeListings?.length ?? 0) / 12);
  const paginatedListings = activeListings?.slice((page - 1) * 12, page * 12);

  const brands = [
    ...new Set(listings?.map((l) => l.brand).filter(Boolean)),
  ].sort();
  const years = [...new Set(listings?.map((l) => l.year).filter(Boolean))].sort(
    (a, b) => b! - a!
  );

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
                Hiển thị {paginatedListings?.length} / {activeListings?.length}{" "}
                kết quả
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {paginatedListings?.map((listing) => (
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
