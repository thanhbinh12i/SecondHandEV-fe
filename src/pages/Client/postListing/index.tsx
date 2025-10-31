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
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Battery,
  Gauge,
} from "lucide-react";
import {
  usePostBatteryMutation,
  usePostEbikeMutation,
} from "src/queries/useListing";
import { convertFileToBase64, compressImage } from "src/utils/utils";

interface BatteryFields {
  voltage?: number;
  capacityWh?: number;
  weightKg?: number;
  condition?: string;
  ageYears?: number;
}

interface EbikeFields {
  motorPowerW?: number;
  batteryVoltage?: number;
  rangeKm?: number;
  frameSize?: string;
  condition?: string;
  mileageKm?: number;
  weightKg?: number;
  yearOfManufacture?: number;
}

type DynamicFormData = {
  categoryId: number;
  title: string;
  description: string;
  year: number;
  price: number;
  listingType: string;
  listingStatus: string;
  primaryImageUrl: string;
  imageUrls: string[];
  brand: string;
  model: string;
} & BatteryFields &
  EbikeFields;

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const postBatteryMutation = usePostBatteryMutation();
  const postEbikeMutation = usePostEbikeMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<DynamicFormData>({
    categoryId: 1,
    title: "",
    description: "",
    year: new Date().getFullYear(),
    price: 0,
    listingType: "fixed",
    listingStatus: "pending",
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
    { id: 1, name: "Pin xe điện" },
    { id: 2, name: "Xe điện" },
  ];

  const brands = ["VinFast", "Tesla", "Giant", "Xiaomi", "Yadea"];
  const conditions = ["Mới", "Như mới", "Đã sử dụng", "Cần sửa chữa"];
  const frameSizes = ["XS", "S", "M", "L", "XL"];

  const handleInputChange = (field: keyof DynamicFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: number) => {
    // Reset dynamic fields when category changes
    const baseData = {
      categoryId,
      title: formData.title,
      description: formData.description,
      year: formData.year,
      price: formData.price,
      listingType: "fixed",
      listingStatus: "pending",
      primaryImageUrl: formData.primaryImageUrl,
      imageUrls: formData.imageUrls,
      brand: formData.brand,
      model: formData.model,
    };
    setFormData(baseData as DynamicFormData);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const compressedFile = await compressImage(file);
        if (compressedFile) {
          const base64String = await convertFileToBase64(compressedFile);
          newImages.push(base64String);
        } else {
          const base64String = await convertFileToBase64(file);
          newImages.push(base64String);
        }
      }
      setPreviewImages((prev) => [...prev, ...newImages]);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...newImages],
        primaryImageUrl: prev.primaryImageUrl || newImages[0],
      }));
    } catch (error) {
      console.error("Error processing images:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi khi tải ảnh lên. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
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
    const currentMutation =
      formData.categoryId === 1 ? postBatteryMutation : postEbikeMutation;

    if (currentMutation.isPending) return;

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
      if (formData.categoryId === 1) {
        const requestData = {
          title: formData.title,
          description: formData.description,
          year: formData.year,
          price: formData.price,
          listingType: formData.listingType,
          listingStatus: formData.listingStatus,
          primaryImageUrl: formData.primaryImageUrl,
          imageUrls: formData.imageUrls,
          brand: formData.brand,
          model: formData.model,
          voltage: formData.voltage,
          capacityWh: formData.capacityWh,
          weightKg: formData.weightKg,
          condition: formData.condition,
          ageYears: formData.ageYears,
        };
        await postBatteryMutation.mutateAsync(requestData);
      } else {
        const requestData = {
          title: formData.title,
          description: formData.description,
          year: formData.year,
          price: formData.price,
          listingType: formData.listingType,
          listingStatus: formData.listingStatus,
          primaryImageUrl: formData.primaryImageUrl,
          imageUrls: formData.imageUrls,
          brand: formData.brand,
          model: formData.model,
          motorPowerW: formData.motorPowerW,
          batteryVoltage: formData.batteryVoltage,
          rangeKm: formData.rangeKm,
          frameSize: formData.frameSize,
          condition: formData.condition,
          mileageKm: formData.mileageKm,
          weightKg: formData.weightKg,
          yearOfManufacture: formData.year,
        };
        await postEbikeMutation.mutateAsync(requestData);
      }

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

  const renderCategorySpecificFields = () => {
    if (formData.categoryId === 1) {
      return (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Điện áp (V)"
              value={formData.voltage || ""}
              onChange={(e) =>
                handleInputChange("voltage", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Zap size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      V
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Dung lượng (Wh)"
              value={formData.capacityWh || ""}
              onChange={(e) =>
                handleInputChange("capacityWh", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Battery size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      Wh
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Trọng lượng (kg)"
              value={formData.weightKg || ""}
              onChange={(e) =>
                handleInputChange("weightKg", parseFloat(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      kg
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Tuổi pin (năm)"
              value={formData.ageYears || ""}
              onChange={(e) =>
                handleInputChange("ageYears", parseInt(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      năm
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Tình trạng</InputLabel>
              <Select
                value={formData.condition || ""}
                label="Tình trạng"
                onChange={(e) => handleInputChange("condition", e.target.value)}
              >
                {conditions.map((cond) => (
                  <MenuItem key={cond} value={cond}>
                    {cond}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      );
    } else if (formData.categoryId === 2) {
      return (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Công suất động cơ (W)"
              value={formData.motorPowerW || ""}
              onChange={(e) =>
                handleInputChange("motorPowerW", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Zap size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      W
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Điện áp pin (V)"
              value={formData.batteryVoltage || ""}
              onChange={(e) =>
                handleInputChange("batteryVoltage", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Battery size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      V
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Quãng đường (km)"
              value={formData.rangeKm || ""}
              onChange={(e) =>
                handleInputChange("rangeKm", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Gauge size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      km
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Kích thước khung</InputLabel>
              <Select
                value={formData.frameSize || ""}
                label="Kích thước khung"
                onChange={(e) => handleInputChange("frameSize", e.target.value)}
              >
                {frameSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Số km đã đi"
              value={formData.mileageKm || ""}
              onChange={(e) =>
                handleInputChange("mileageKm", parseFloat(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      km
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Trọng lượng (kg)"
              value={formData.weightKg || ""}
              onChange={(e) =>
                handleInputChange("weightKg", parseFloat(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" className="text-slate-500">
                      kg
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Tình trạng</InputLabel>
              <Select
                value={formData.condition || ""}
                label="Tình trạng"
                onChange={(e) => handleInputChange("condition", e.target.value)}
              >
                {conditions.map((cond) => (
                  <MenuItem key={cond} value={cond}>
                    {cond}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      );
    }
    return null;
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
                    handleCategoryChange(e.target.value as number)
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
                placeholder={
                  formData.categoryId === 1
                    ? "VD: Pin xe điện 48V 20Ah - Còn mới 90%"
                    : "VD: Xe điện VinFast Klara S 2023 - Màu đỏ"
                }
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
            {renderCategorySpecificFields()}

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
                  <MenuItem value="fixed">Mua ngay</MenuItem>
                  <MenuItem value="auction">Đấu giá</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá bán *"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value))
                }
                InputProps={{
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
                  {formData.condition && (
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-slate-600">
                        Tình trạng:
                      </Typography>
                      <Typography variant="body2" className="font-semibold">
                        {formData.condition}
                      </Typography>
                    </div>
                  )}
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

            {formData.categoryId === 1 && (
              <Grid size={{ xs: 12 }}>
                <Paper className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="text-slate-600 mb-3 font-semibold"
                  >
                    Thông số kỹ thuật Pin
                  </Typography>
                  <div className="space-y-2">
                    {formData.voltage && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Điện áp:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.voltage}V
                        </Typography>
                      </div>
                    )}
                    {formData.capacityWh && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Dung lượng:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.capacityWh}Wh
                        </Typography>
                      </div>
                    )}
                    {formData.weightKg && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Trọng lượng:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.weightKg}kg
                        </Typography>
                      </div>
                    )}
                    {formData.ageYears && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Tuổi pin:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.ageYears} năm
                        </Typography>
                      </div>
                    )}
                  </div>
                </Paper>
              </Grid>
            )}

            {formData.categoryId === 2 && (
              <Grid size={{ xs: 12 }}>
                <Paper className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="text-slate-600 mb-3 font-semibold"
                  >
                    Thông số kỹ thuật Xe điện
                  </Typography>
                  <div className="space-y-2">
                    {formData.motorPowerW && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Công suất động cơ:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.motorPowerW}W
                        </Typography>
                      </div>
                    )}
                    {formData.batteryVoltage && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Điện áp pin:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.batteryVoltage}V
                        </Typography>
                      </div>
                    )}
                    {formData.rangeKm && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Quãng đường:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.rangeKm}km
                        </Typography>
                      </div>
                    )}
                    {formData.frameSize && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Kích thước khung:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.frameSize}
                        </Typography>
                      </div>
                    )}
                    {formData.mileageKm && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Số km đã đi:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.mileageKm}km
                        </Typography>
                      </div>
                    )}
                    {formData.weightKg && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-slate-600">
                          Trọng lượng:
                        </Typography>
                        <Typography variant="body2" className="font-semibold">
                          {formData.weightKg}kg
                        </Typography>
                      </div>
                    )}
                  </div>
                </Paper>
              </Grid>
            )}

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
              disabled={
                activeStep === 0 ||
                postBatteryMutation.isPending ||
                postEbikeMutation.isPending
              }
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
                  disabled={
                    postBatteryMutation.isPending || postEbikeMutation.isPending
                  }
                  endIcon={<CheckCircle size={18} />}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600"
                >
                  {postBatteryMutation.isPending || postEbikeMutation.isPending
                    ? "Đang đăng..."
                    : "Đăng tin"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    postBatteryMutation.isPending || postEbikeMutation.isPending
                  }
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
