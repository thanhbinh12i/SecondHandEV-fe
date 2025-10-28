/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
  Card,
  CardMedia,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
} from "@mui/material";
import {
  Upload,
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { usePostListingMutation } from "src/queries/useListing";
import { ListingCreateRequest } from "src/types/listing.type";

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const postListingMutation = usePostListingMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ListingCreateRequest>({
    categoryId: 1,
    title: "",
    description: "",
    year: new Date().getFullYear(),
    price: 0,
    listingType: "fixed",
    listingStatus: "active",
    primaryImageUrl: "",
    imageUrls: [],
    brand: "",
    model: "",
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const steps = [
    "Thông tin cơ bản",
    "Chi tiết sản phẩm",
    "Hình ảnh",
    "Xác nhận",
  ];

  const categories = [
    { id: 1, name: "Xe điện" },
    { id: 2, name: "Pin xe điện" },
    { id: 3, name: "Phụ kiện" },
  ];

  const brands = [
    "VinFast",
    "Tesla",
    "BYD",
    "Honda",
    "Yamaha",
    "Pega",
    "Yadea",
    "Khác",
  ];

  const handleInputChange = (field: keyof ListingCreateRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploading(true);
      const newImages: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newImages]);
            setFormData((prev) => ({
              ...prev,
              imageUrls: [...(prev.imageUrls || []), ...newImages],
              primaryImageUrl: prev.primaryImageUrl || newImages[0],
            }));
            setUploading(false);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index),
      primaryImageUrl:
        prev.primaryImageUrl === prev.imageUrls?.[index]
          ? prev.imageUrls?.[0] || ""
          : prev.primaryImageUrl,
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      primaryImageUrl: prev.imageUrls?.[index] || "",
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (postListingMutation.isPending) return;

    if (!formData.title.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập tiêu đề tin đăng",
        severity: "error",
      });
      setActiveStep(0);
      return;
    }

    if (!formData.brand) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn hãng sản phẩm",
        severity: "error",
      });
      setActiveStep(1);
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập giá bán hợp lệ",
        severity: "error",
      });
      setActiveStep(1);
      return;
    }

    if (!previewImages.length) {
      setSnackbar({
        open: true,
        message: "Vui lòng tải lên ít nhất 1 hình ảnh",
        severity: "error",
      });
      setActiveStep(2);
      return;
    }

    try {
      await postListingMutation.mutateAsync(formData);

      setSnackbar({
        open: true,
        message: "Đăng tin thành công! Đang chuyển hướng...",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/my-listings");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting listing:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đã có lỗi xảy ra khi đăng tin. Vui lòng thử lại.";

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                className="mb-4 font-semibold text-slate-800"
              >
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Danh mục *</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Danh mục *"
                  onChange={(e) =>
                    handleInputChange("categoryId", e.target.value)
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tiêu đề tin đăng *"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="VD: Xe điện VinFast Klara S 2023 - Màu đỏ"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
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
                placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 2 }}
                    >
                      <FileText size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                className="mb-4 font-semibold text-slate-800"
              >
                Chi tiết sản phẩm
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Hãng *</InputLabel>
                <Select
                  value={formData.brand}
                  label="Hãng *"
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="VD: Klara S, Model 3..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Năm sản xuất *"
                value={formData.year}
                onChange={(e) =>
                  handleInputChange("year", parseInt(e.target.value))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá bán *"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" className="text-slate-500">
                        VND
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Loại tin</InputLabel>
                <Select
                  value={formData.listingType}
                  label="Loại tin"
                  onChange={(e) =>
                    handleInputChange("listingType", e.target.value)
                  }
                >
                  <MenuItem value="fixed">Giá cố định</MenuItem>
                  <MenuItem value="negotiable">Có thể thương lượng</MenuItem>
                  <MenuItem value="auction">Đấu giá</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.listingStatus}
                  label="Trạng thái"
                  onChange={(e) =>
                    handleInputChange("listingStatus", e.target.value)
                  }
                >
                  <MenuItem value="active">Đang bán</MenuItem>
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="sold">Đã bán</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                className="mb-2 font-semibold text-slate-800"
              >
                Hình ảnh sản phẩm
              </Typography>
              <Typography variant="body2" className="text-slate-600 mb-4">
                Thêm ít nhất 3 hình ảnh. Hình đầu tiên sẽ là ảnh đại diện.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Paper
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-colors cursor-pointer"
                sx={{ p: 4, textAlign: "center", bgcolor: "slate.50" }}
              >
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                    <div>
                      <Typography
                        variant="body1"
                        className="font-semibold text-slate-700"
                      >
                        Nhấn để tải ảnh lên
                      </Typography>
                      <Typography variant="body2" className="text-slate-500">
                        hoặc kéo thả ảnh vào đây
                      </Typography>
                    </div>
                    <Typography variant="caption" className="text-slate-400">
                      PNG, JPG, GIF tối đa 10MB
                    </Typography>
                  </div>
                </label>
              </Paper>
            </Grid>
            {uploading && (
              <Grid size={{ xs: 12 }}>
                <LinearProgress className="rounded-full" />
              </Grid>
            )}
            {previewImages.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {previewImages.map((img, index) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                      <Card className="relative group">
                        <CardMedia
                          component="img"
                          height="200"
                          image={img}
                          alt={`Preview ${index + 1}`}
                          className="h-48 object-cover"
                        />
                        {index === 0 && (
                          <Chip
                            label="Ảnh đại diện"
                            size="small"
                            className="absolute top-2 left-2 bg-emerald-500 text-white"
                          />
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            sx={{
                              bgcolor: "error.main",
                              color: "white",
                              "&:hover": { bgcolor: "error.dark" },
                            }}
                          >
                            <X size={16} />
                          </IconButton>
                        </div>
                        {index !== 0 && (
                          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="bg-white text-slate-700 hover:bg-slate-100"
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                py: 0.5,
                                fontSize: "0.75rem",
                              }}
                            >
                              Đặt làm ảnh đại diện
                            </Button>
                          </div>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Alert severity="success" className="mb-4">
                <Typography variant="body1" className="font-semibold">
                  Xác nhận thông tin đăng tin
                </Typography>
                <Typography variant="body2">
                  Vui lòng kiểm tra lại thông tin trước khi đăng tin
                </Typography>
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className="p-4">
                <Typography
                  variant="subtitle2"
                  className="text-slate-600 mb-3 font-semibold"
                >
                  Thông tin chung
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Danh mục:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {
                        categories.find((c) => c.id === formData.categoryId)
                          ?.name
                      }
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Tiêu đề:
                    </Typography>
                    <Typography
                      variant="body2"
                      className="font-semibold text-right max-w-xs truncate"
                    >
                      {formData.title}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Hãng:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {formData.brand}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Model:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {formData.model || "—"}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Năm:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {formData.year}
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className="p-4">
                <Typography
                  variant="subtitle2"
                  className="text-slate-600 mb-3 font-semibold"
                >
                  Giá & Trạng thái
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Giá bán:
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-emerald-600"
                    >
                      {formData.price?.toLocaleString()} VND
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Loại tin:
                    </Typography>
                    <Chip
                      label={formData.listingType}
                      size="small"
                      className="bg-blue-100 text-blue-700"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Trạng thái:
                    </Typography>
                    <Chip
                      label={formData.listingStatus}
                      size="small"
                      className="bg-emerald-100 text-emerald-700"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="text-slate-600">
                      Số ảnh:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {previewImages.length} ảnh
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            {formData.description && (
              <Grid size={{ xs: 12 }}>
                <Paper className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="text-slate-600 mb-2 font-semibold"
                  >
                    Mô tả
                  </Typography>
                  <Typography variant="body2" className="text-slate-700">
                    {formData.description}
                  </Typography>
                </Paper>
              </Grid>
            )}
            {previewImages.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="text-slate-600 mb-3 font-semibold"
                  >
                    Hình ảnh ({previewImages.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {previewImages.slice(0, 4).map((img, index) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={index}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="120"
                            image={img}
                            alt={`Preview ${index + 1}`}
                            className="h-32 object-cover"
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Paper className="p-6 mb-6 !bg-gradient-to-r from-emerald-500 to-blue-600">
          <Typography variant="h4" className="text-white font-bold mb-2">
            Đăng tin bán hàng
          </Typography>
          <Typography variant="body1" className="text-white opacity-90">
            Điền đầy đủ thông tin để đăng tin nhanh chóng
          </Typography>
        </Paper>

        <Paper className="p-6 mb-6">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper className="p-6 mb-6">{renderStepContent()}</Paper>

        <Paper className="p-4">
          <div className="flex justify-between">
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || postListingMutation.isPending}
              startIcon={<ArrowLeft size={18} />}
              className="text-slate-700 border-slate-300"
            >
              Quay lại
            </Button>
            <div className="flex gap-2">
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={postListingMutation.isPending}
                  endIcon={<CheckCircle size={18} />}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600"
                >
                  {postListingMutation.isPending ? "Đang đăng..." : "Đăng tin"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={postListingMutation.isPending}
                  endIcon={<ArrowRight size={18} />}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600"
                >
                  Tiếp theo
                </Button>
              )}
            </div>
          </div>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};

export default CreateListingPage;
