/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import { Upload, X } from "lucide-react";
import { convertFileToBase64, compressImage } from "src/utils/utils";
import { PostListingFormData } from "src/types/form.type";

interface ImageUploadStepProps {
  previewImages: string[];
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  formData: PostListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  previewImages,
  setPreviewImages,
  setFormData,
}) => {
  const [uploading, setUploading] = useState(false);

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
      setFormData((prev: any) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...newImages],
        primaryImageUrl: prev.primaryImageUrl || newImages[0],
      }));
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Có lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev: any) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_: any, i: number) => i !== index),
      primaryImageUrl:
        prev.primaryImageUrl === prev.imageUrls?.[index]
          ? prev.imageUrls?.[0] || ""
          : prev.primaryImageUrl,
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      primaryImageUrl: prev.imageUrls?.[index] || "",
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" className="mb-2 font-semibold text-slate-800">
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
          <Typography variant="caption" className="text-slate-600 mt-2">
            Đang tải ảnh lên...
          </Typography>
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
};

export default ImageUploadStep;
