import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Alert,
  Chip,
  Card,
  CardMedia,
} from "@mui/material";
import { DynamicFormData } from "src/types/form.type";

interface ConfirmationStepProps {
  formData: DynamicFormData;
  previewImages: string[];
  categories: { id: number; name: string }[];
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  previewImages,
  categories,
}) => {
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

      {/* General Info */}
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
                {categories.find((c) => c.id === formData.categoryId)?.name}
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

      {/* Price & Status */}
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
              <Typography variant="h6" className="font-bold text-emerald-600">
                {formData.price?.toLocaleString()} VND
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2" className="text-slate-600">
                Loại tin:
              </Typography>
              <Chip
                label={
                  formData.listingType === "fixed" ? "Mua ngay" : "Đấu giá"
                }
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

      {/* Technical Specs - Battery */}
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

      {/* Technical Specs - Ebike */}
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

      {/* Description */}
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

      {/* Images Preview */}
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
            {previewImages.length > 4 && (
              <Typography
                variant="caption"
                className="text-slate-600 mt-2 block"
              >
                +{previewImages.length - 4} ảnh khác
              </Typography>
            )}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default ConfirmationStep;
