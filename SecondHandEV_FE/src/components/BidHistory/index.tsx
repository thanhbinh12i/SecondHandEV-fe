import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import { TrendingUp, Award, Gavel } from "lucide-react";
import { BidResponse } from "src/types/bid.type";

interface BidHistoryProps {
  bids: BidResponse[];
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids }) => {
  const formatTimeAgo = (dateString: string): string => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return "Vừa xong";
  };

  return (
    <Paper className="!p-6 !rounded-2xl !shadow-xl !bg-gradient-to-br !from-white !to-blue-50/30">
      <Typography
        variant="h5"
        className="!font-bold !mb-4 !flex !items-center !gap-3"
      >
        <TrendingUp size={28} className="!text-emerald-500" />
        Lịch sử đấu giá
      </Typography>

      {bids.length > 0 ? (
        <List className="!space-y-2">
          {bids.map((bid, index) => (
            <ListItem
              key={bid.bidId}
              className={`!rounded-2xl !p-4 !shadow-md ${
                index === 0
                  ? "!bg-gradient-to-r !from-emerald-100 !via-green-50 !to-blue-100 !border-3 !border-emerald-400 !shadow-lg"
                  : "!bg-slate-50 !border-2 !border-slate-200"
              }`}
            >
              <ListItemAvatar>
                <Avatar
                  className={`!w-14 !h-14 !me-3 ${
                    index === 0
                      ? "!bg-gradient-to-br !from-emerald-500 !to-blue-600 !shadow-lg"
                      : "!bg-slate-400"
                  }`}
                >
                  {index === 0 ? (
                    <Award size={28} />
                  ) : (
                    <Typography variant="h6">{bid.bidderName[0]}</Typography>
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box className="!flex !items-center !justify-between !mb-1">
                    <Typography variant="h6" className="!font-bold">
                      {bid.bidderName}
                    </Typography>
                    {index === 0 && (
                      <Chip
                        label="🏆 CAO NHẤT"
                        size="small"
                        className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !text-white !font-bold !px-2"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box className="!flex !items-center !justify-between !mt-2">
                    <Typography
                      variant="h6"
                      className={`!font-black ${
                        index === 0 ? "!text-emerald-600" : "!text-slate-700"
                      }`}
                    >
                      {bid.amount.toLocaleString()} ₫
                    </Typography>
                    <Typography
                      variant="body2"
                      className="!text-slate-600 !font-semibold"
                    >
                      {formatTimeAgo(bid.createdAt)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box className="!text-center !py-12 !bg-slate-50 !rounded-2xl">
          <Gavel size={64} className="!mx-auto !mb-4 !text-slate-300" />
          <Typography variant="h6" className="!text-slate-600 !font-bold">
            Chưa có lượt đấu giá nào
          </Typography>
          <Typography variant="body2" className="!text-slate-500">
            Hãy là người đầu tiên đặt giá!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default BidHistory;
