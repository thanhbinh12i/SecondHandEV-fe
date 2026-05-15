import React from "react";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Tag, FileText } from "lucide-react";

interface BasicInfoStepProps {
  categoryId: number;
  title: string;
  description: string;
  categories: { id: number; name: string }[];
  onCategoryChange: (categoryId: number) => void;
  onFieldChange: (field: string, value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  categoryId,
  title,
  description,
  categories,
  onCategoryChange,
  onFieldChange,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" className="mb-4 font-semibold text-slate-800">
          Thông tin cơ bản
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <InputLabel>Danh mục *</InputLabel>
          <Select
            value={categoryId}
            label="Danh mục *"
            onChange={(e) => onCategoryChange(e.target.value as number)}
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
          value={title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder={
            categoryId === 1
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
          value={description}
          onChange={(e) => onFieldChange("description", e.target.value)}
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
};

export default BasicInfoStep;
