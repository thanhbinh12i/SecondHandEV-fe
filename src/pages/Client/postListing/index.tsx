/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import {
  usePostBatteryMutation,
  usePostEbikeMutation,
} from "src/queries/useListing";
import { PostListingFormData } from "src/types/form.type";
import BasicInfoStep from "src/components/Step/BasicInfoStep";
import ListingDetailStep from "src/components/Step/ListingDetailStep";
import ImageUploadStep from "src/components/Step/ImageUploadStep";
import ConfirmationStep from "src/components/Step/ConfirmationStep";

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const postBatteryMutation = usePostBatteryMutation();
  const postEbikeMutation = usePostEbikeMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PostListingFormData>({
    categoryId: 1,
    title: "",
    description: "",
    year: new Date().getFullYear(),
    price: 0,
    listingType: "sale",
    listingStatus: "pending",
    primaryImageUrl: "",
    imageUrls: [],
    brand: "",
    model: "",
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: number) => {
    const baseData = {
      categoryId,
      title: formData.title,
      description: formData.description,
      year: formData.year,
      price: formData.price,
      listingType: "sale",
      listingStatus: "pending",
      primaryImageUrl: formData.primaryImageUrl,
      imageUrls: formData.imageUrls,
      brand: formData.brand,
      model: formData.model,
    };
    setFormData(baseData as PostListingFormData);
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoStep
            categoryId={formData.categoryId}
            title={formData.title}
            description={formData.description}
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onFieldChange={handleInputChange}
          />
        );

      case 1:
        return (
          <ListingDetailStep
            categoryId={formData.categoryId}
            formData={formData}
            onFieldChange={handleInputChange}
          />
        );

      case 2:
        return (
          <ImageUploadStep
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 3:
        return (
          <ConfirmationStep
            formData={formData}
            previewImages={previewImages}
            categories={categories}
          />
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
