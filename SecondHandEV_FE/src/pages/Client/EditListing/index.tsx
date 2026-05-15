/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  Zap,
  Battery,
  Gauge,
  Weight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetListingById,
  useUpdateListingMutation,
} from "src/queries/useListing";
import { ListingUpdateRequest } from "src/types/listing.type";

const EditListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const frameSizes = ["Small", "Medium", "Large"];

  const { data: listingData, isLoading: isLoadingListing } = useGetListingById({
    id: listingId,
    enabled: !!listingId,
  });
  const updateListingMutation = useUpdateListingMutation();

  const listing = listingData?.data;

  const [formData, setFormData] = useState<ListingUpdateRequest>({
    title: "",
    description: "",
    year: undefined,
    price: undefined,
    commissionPrice: undefined,
    listingType: "sale",
    brand: "",
    model: "",
    condition: "",
    weightKg: undefined,
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        year: listing.year,
        price: listing.price,
        commissionPrice: listing.commissionPrice,
        listingType: listing.listingType === "auction" ? "auction" : "sale",
        brand: listing.brand || "",
        model: listing.model || "",
        condition:
          listing.battery?.condition || listing.ebike?.condition || undefined,
        weightKg:
          listing.battery?.weightKg || listing.ebike?.weightKg || undefined,
        voltage: listing.battery?.voltage,
        capacityWh: listing.battery?.capacityWh,
        ageYears: listing.battery?.ageYears,
        motorPowerW: listing.ebike?.motorPowerW,
        batteryVoltage: listing.ebike?.batteryVoltage,
        rangeKm: listing.ebike?.rangeKm,
        frameSize: listing.ebike?.frameSize,
        mileageKm: listing.ebike?.mileageKm,
        yearOfManufacture: listing.year,
      });
      setSelectedCategory(listing.categoryId);
      setPrimaryImage(listing.primaryImageUrl || "");
      setAdditionalImages(listing.imageUrls || []);
    }
  }, [listing]);

  const handleInputChange = (field: keyof ListingUpdateRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (price: number) => {
    handleInputChange("price", price);
    handleInputChange("commissionPrice", price * 0.05);
  };

  const handleSubmit = async () => {
    try {
      const updateData: ListingUpdateRequest = {
        ...formData,
        primaryImageUrl: primaryImage,
        imageUrls: additionalImages,
      };

      await updateListingMutation.mutateAsync({
        id: listingId,
        body: updateData,
      });

      setSnackbar({
        open: true,
        message: "Cập nhật tin đăng thành công!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/my-listings");
      }, 1500);
    } catch (error) {
      console.error("Error updating listing:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật tin đăng!",
        severity: "error",
      });
    }
  };

  const isBatteryCategory = selectedCategory === 1;
  const isEbikeCategory = selectedCategory === 2;

  if (isLoadingListing) {
    return (
      <Box className="!min-h-screen !flex !items-center !justify-center">
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" className="!py-8">
        <Alert severity="error">Không tìm thấy tin đăng!</Alert>
      </Container>
    );
  }

  return (
    <Box className="!min-h-screen !bg-gradient-to-br !from-slate-50 !to-slate-100 !py-8">
      <Container maxWidth="lg">
        <Box className="!mb-6">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate("/my-listings")}
            className="!mb-4 !text-slate-600"
          >
            Quay lại
          </Button>
          <Typography variant="h4" className="!font-bold !text-slate-900 !mb-2">
            Chỉnh sửa tin đăng
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Paper className="!p-6 !mb-6">
            <Typography
              variant="h6"
              className="!font-bold !mb-4 !flex !items-center !gap-2"
            >
              <Package size={24} className="!text-emerald-600" />
              Thông tin cơ bản
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth disabled>
                  <InputLabel>Danh mục</InputLabel>
                  <Select value={selectedCategory || ""} label="Danh mục">
                    <MenuItem value={1}>Pin xe điện</MenuItem>
                    <MenuItem value={2}>Xe điện</MenuItem>
                  </Select>
                </FormControl>
                <Typography
                  variant="caption"
                  className="!text-slate-500 !mt-1 !block"
                >
                  Danh mục không thể thay đổi
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Tiêu đề *"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="VD: Pin xe điện 48V 20Ah mới 95%"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Mô tả chi tiết về sản phẩm..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Thương hiệu"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="VD: Panasonic"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="VD: NCR18650B"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    required
                    label="Tình trạng"
                    value={formData.condition}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                    placeholder="VD: 100%, 90%..."
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Năm sản xuất"
                  value={formData.year || ""}
                  onChange={(e) =>
                    handleInputChange("year", Number(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá bán (VNĐ) *"
                  value={formData.price || ""}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DollarSign size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {isBatteryCategory && (
            <Paper className="!p-6 !mb-6">
              <Typography
                variant="h6"
                className="!font-bold !mb-4 !flex !items-center !gap-2"
              >
                <Battery size={24} className="!text-blue-600" />
                Thông số pin
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Điện áp (V)"
                    value={formData.voltage || ""}
                    onChange={(e) =>
                      handleInputChange("voltage", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Zap size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Dung lượng (Wh)"
                    value={formData.capacityWh || ""}
                    onChange={(e) =>
                      handleInputChange("capacityWh", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Battery size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Tuổi pin (năm)"
                    value={formData.ageYears || ""}
                    onChange={(e) =>
                      handleInputChange("ageYears", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Khối lượng (kg)"
                    value={formData.weightKg || ""}
                    onChange={(e) =>
                      handleInputChange("weightKg", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Weight size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {isEbikeCategory && (
            <Paper className="!p-6 !mb-6">
              <Typography
                variant="h6"
                className="!font-bold !mb-4 !flex !items-center !gap-2"
              >
                <Zap size={24} className="!text-purple-600" />
                Thông số xe điện
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Công suất động cơ (W)"
                    value={formData.motorPowerW || ""}
                    onChange={(e) =>
                      handleInputChange("motorPowerW", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Zap size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Điện áp pin (V)"
                    value={formData.batteryVoltage || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "batteryVoltage",
                        Number(e.target.value)
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Battery size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quãng đường (km)"
                    value={formData.rangeKm || ""}
                    onChange={(e) =>
                      handleInputChange("rangeKm", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Gauge size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Kích thước khung</InputLabel>
                    <Select
                      value={formData.frameSize || ""}
                      label="Kích thước khung"
                      onChange={(e) =>
                        handleInputChange("frameSize", e.target.value)
                      }
                    >
                      {frameSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quãng đường đã đi (km)"
                    value={formData.mileageKm || ""}
                    onChange={(e) =>
                      handleInputChange("mileageKm", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Gauge size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Khối lượng (kg)"
                    value={formData.weightKg || ""}
                    onChange={(e) =>
                      handleInputChange("weightKg", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Weight size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        <Box className="!space-y-3">
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={updateListingMutation.isPending}
            className="!bg-gradient-to-r !from-emerald-500 !to-blue-600 !font-semibold !py-3 !rounded-xl"
          >
            {updateListingMutation.isPending ? (
              <CircularProgress size={24} className="!text-white" />
            ) : (
              "Cập nhật tin đăng"
            )}
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditListingPage;
