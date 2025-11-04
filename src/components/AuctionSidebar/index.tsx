import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
} from "@mui/material";
import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AuctionResponse } from "src/types/auction.type";

interface AuctionSidebarProps {
  auction: AuctionResponse;
}

const AuctionSidebar: React.FC<AuctionSidebarProps> = ({ auction }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const imageUrls = [
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
  ];

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Box className="!sticky !top-6">
      <Paper className="!rounded-2xl !overflow-hidden !shadow-xl !mb-4">
        <Typography variant="h6" className="!font-bold !p-4 !bg-slate-50">
          📦 Thông tin sản phẩm
        </Typography>
        {imageUrls.length > 0 && (
          <Box className="!relative">
            <img
              src={imageUrls[selectedImageIndex]}
              alt={auction.listing.title}
              className="!w-full !h-[400px] !object-cover !cursor-pointer"
              onClick={() => setImageDialogOpen(true)}
            />
            {imageUrls.length > 1 && (
              <>
                <IconButton
                  className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                  onClick={handleNextImage}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </Box>
        )}

        {imageUrls.length > 1 && (
          <Box className="!p-3 !flex !gap-2 !overflow-x-auto !bg-slate-50">
            {imageUrls.map((url, index) => (
              <Card
                key={index}
                className={`!cursor-pointer !flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "!ring-4 !ring-emerald-500"
                    : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <CardMedia
                  component="img"
                  image={url}
                  className="!w-20 !h-20 !object-cover"
                />
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      <Paper className="!p-6 !rounded-2xl !shadow-lg !mb-4">
        <Typography variant="h6" className="!font-bold !mb-3">
          📝 Mô tả chi tiết
        </Typography>
        <Typography className="!text-slate-700 !leading-relaxed !whitespace-pre-line">
          {auction.listing.description || "Chưa có mô tả"}
        </Typography>
      </Paper>

      <Paper className="!p-6 !rounded-2xl !shadow-lg">
        <Typography variant="h6" className="!font-bold !mb-4">
          👤 Thông tin người bán
        </Typography>
        <Box className="!flex !items-center !gap-4 !mb-4">
          <Avatar className="!w-16 !h-16 !bg-gradient-to-br !from-emerald-500 !to-blue-600">
            {auction.seller.displayName?.[0] || "?"}
          </Avatar>
          <Box>
            <Typography variant="h6" className="!font-bold">
              {auction.seller.displayName || "Người bán"}
            </Typography>
            <Box className="!flex !items-center !gap-1 !text-slate-600">
              <CheckCircle size={16} className="!text-emerald-500" />
              <Typography variant="body2">Đã xác thực</Typography>
            </Box>
          </Box>
        </Box>

        {auction.seller.email && (
          <Box className="!mb-2">
            <Typography variant="caption" className="!text-slate-600">
              Email
            </Typography>
            <Typography variant="body2" className="!font-semibold">
              {auction.seller.email}
            </Typography>
          </Box>
        )}

        {auction.seller.phone && (
          <Box className="!mb-3">
            <Typography variant="caption" className="!text-slate-600">
              Số điện thoại
            </Typography>
            <Typography variant="body2" className="!font-semibold">
              {auction.seller.phone}
            </Typography>
          </Box>
        )}

        <Alert severity="info">
          <Typography variant="body2">
            Liên hệ qua hệ thống để đảm bảo an toàn giao dịch
          </Typography>
        </Alert>
      </Paper>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <IconButton
          className="!absolute !top-4 !right-4 !z-10 !bg-white/80 hover:!bg-white"
          onClick={() => setImageDialogOpen(false)}
        >
          <X />
        </IconButton>
        <DialogContent className="!p-0 !relative">
          {imageUrls.length > 0 && (
            <>
              <img
                src={imageUrls[selectedImageIndex]}
                alt={auction.listing.title}
                className="!w-full !h-auto"
              />
              {imageUrls.length > 1 && (
                <>
                  <IconButton
                    className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                    onClick={handlePreviousImage}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !bg-white/80 hover:!bg-white"
                    onClick={handleNextImage}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AuctionSidebar;
