/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Calendar, Zap, Battery, Gauge } from "lucide-react";
import AIPriceSuggestion from "src/components/AIPriceSuggestion";
import { PostListingFormData } from "src/types/form.type";
import { ListingAIInfo } from "src/types/listing.type";

interface ListingDetailStepProps {
  categoryId: number;
  formData: PostListingFormData;
  onFieldChange: (field: string, value: any) => void;
}

const ListingDetailStep: React.FC<ListingDetailStepProps> = ({
  categoryId,
  formData,
  onFieldChange,
}) => {
  const conditions = ["Mới", "Như mới", "Đã sử dụng", "Cần sửa chữa"];
  const frameSizes = ["XS", "S", "M", "L", "XL"];

  const listingInfo: ListingAIInfo = {
    categoryId: categoryId,
    title: formData.title,
    description: formData.description,
    brand: formData.brand,
    model: formData.model,
    year: formData.year,
    condition: formData.condition!,
    voltage: formData.voltage,
    capacityWh: formData.capacityWh,
    weightKg: formData.weightKg,
    ageYears: formData.ageYears,
    motorPowerW: formData.motorPowerW,
    batteryVoltage: formData.batteryVoltage,
    rangeKm: formData.rangeKm,
    mileageKm: formData.mileageKm,
    frameSize: formData.frameSize,
  };

  const renderCategorySpecificFields = () => {
    if (categoryId === 1) {
      return (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Điện áp (V) *"
              value={formData.voltage || ""}
              onChange={(e) =>
                onFieldChange("voltage", parseFloat(e.target.value))
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
              required
              type="number"
              label="Dung lượng (Wh) *"
              value={formData.capacityWh || ""}
              onChange={(e) =>
                onFieldChange("capacityWh", parseFloat(e.target.value))
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
                onFieldChange("weightKg", parseFloat(e.target.value))
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
                onFieldChange("ageYears", parseInt(e.target.value))
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
        </>
      );
    } else {
      return (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Công suất động cơ (W) *"
              value={formData.motorPowerW || ""}
              onChange={(e) =>
                onFieldChange("motorPowerW", parseFloat(e.target.value))
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
              required
              type="number"
              label="Điện áp pin (V) *"
              value={formData.batteryVoltage || ""}
              onChange={(e) =>
                onFieldChange("batteryVoltage", parseFloat(e.target.value))
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
              required
              type="number"
              label="Quãng đường (km) *"
              value={formData.rangeKm || ""}
              onChange={(e) =>
                onFieldChange("rangeKm", parseFloat(e.target.value))
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
                onChange={(e) => onFieldChange("frameSize", e.target.value)}
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
                onFieldChange("mileageKm", parseFloat(e.target.value))
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
                onFieldChange("weightKg", parseFloat(e.target.value))
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
        </>
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" className="mb-4 font-semibold text-slate-800">
          Chi tiết sản phẩm
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Hãng *"
          value={formData.brand}
          onChange={(e) => onFieldChange("brand", e.target.value)}
          placeholder="VD: Tesla, Vinfast..."
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Model *"
          value={formData.model}
          onChange={(e) => onFieldChange("model", e.target.value)}
          placeholder="VD: Klara S, Model 3..."
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          type="number"
          label="Năm sản xuất *"
          value={formData.year}
          onChange={(e) => onFieldChange("year", parseInt(e.target.value))}
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
        <FormControl fullWidth required>
          <InputLabel>Tình trạng *</InputLabel>
          <Select
            value={formData.condition || ""}
            label="Tình trạng *"
            onChange={(e) => onFieldChange("condition", e.target.value)}
          >
            {conditions.map((cond) => (
              <MenuItem key={cond} value={cond}>
                {cond}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {renderCategorySpecificFields()}

      <Grid size={{ xs: 12 }}>
        <AIPriceSuggestion
          listingInfo={listingInfo}
          onPriceSelect={(price) => onFieldChange("price", price)}
          currentPrice={formData.price}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          type="number"
          label="Giá bán *"
          value={formData.price}
          onChange={(e) => onFieldChange("price", parseFloat(e.target.value))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2" className="text-slate-500">
                  VND
                </Typography>
              </InputAdornment>
            ),
          }}
          helperText="💡 Bạn có thể sử dụng gợi ý giá từ AI ở trên"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <InputLabel>Loại tin</InputLabel>
          <Select
            value={formData.listingType}
            label="Loại tin"
            onChange={(e) => onFieldChange("listingType", e.target.value)}
          >
            <MenuItem value="sale">Mua ngay (3% phí giao dịch)</MenuItem>
            <MenuItem value="auction">Đấu giá (5% phí giao dịch)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ListingDetailStep;
