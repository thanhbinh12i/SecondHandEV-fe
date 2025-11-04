/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Sparkles, Info, AlertCircle, CheckCircle } from "lucide-react";
import {
  geminiPriceService,
  ProductInfo,
  PriceSuggestion,
} from "src/utils/geminiService";

interface AIPriceSuggestionProps {
  productInfo: ProductInfo;
  onPriceSelect: (price: number) => void;
  currentPrice: number;
}

const AIPriceSuggestion: React.FC<AIPriceSuggestionProps> = ({
  productInfo,
  onPriceSelect,
  currentPrice,
}) => {
  const [priceSuggestion, setPriceSuggestion] =
    useState<PriceSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate product info
  const validation = geminiPriceService.validateProductInfo(productInfo);

  const handleGenerateSuggestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const suggestion = await geminiPriceService.generatePriceSuggestion(
        productInfo
      );
      setPriceSuggestion(suggestion);
    } catch (err) {
      console.error("Error generating price suggestion:", err);
      setError("Không thể tạo gợi ý giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuggestedPrice = (priceType: "min" | "suggested" | "max") => {
    if (!priceSuggestion) return;

    const price =
      priceType === "min"
        ? priceSuggestion.minPrice
        : priceType === "max"
        ? priceSuggestion.maxPrice
        : priceSuggestion.suggestedPrice;

    onPriceSelect(price);
  };

  const getPriceComparison = () => {
    if (!priceSuggestion || !currentPrice) return null;

    const diff = currentPrice - priceSuggestion.suggestedPrice;
    const diffPercent = Math.abs(diff / priceSuggestion.suggestedPrice) * 100;

    if (diffPercent < 5) {
      return { type: "success", message: "Giá phù hợp với thị trường" };
    } else if (diff > 0) {
      return {
        type: "warning",
        message: `Giá cao hơn gợi ý ${diffPercent.toFixed(0)}%`,
      };
    } else {
      return {
        type: "info",
        message: `Giá thấp hơn gợi ý ${diffPercent.toFixed(0)}%`,
      };
    }
  };

  return (
    <Paper className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
      <Box className="flex items-center justify-between mb-3">
        <Box className="flex items-center gap-2">
          <Sparkles size={24} className="text-purple-600" />
          <Typography variant="h6" className="font-bold text-purple-900">
            Gợi ý giá bằng AI
          </Typography>
          <Chip
            label="Powered by Gemini"
            size="small"
            className="bg-purple-100 text-purple-700 font-semibold"
          />
        </Box>
        <Tooltip title="AI phân tích dựa trên thông tin sản phẩm và xu hướng thị trường">
          <IconButton size="small">
            <Info size={18} className="text-slate-500" />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
      )}

      {!validation.isValid ? (
        <Alert severity="warning" className="mb-3">
          <Typography variant="body2" className="font-semibold mb-2">
            Vui lòng điền đầy đủ thông tin để nhận gợi ý giá:
          </Typography>
          <List dense className="mt-1">
            {validation.missingFields.map((field) => (
              <ListItem key={field} className="py-0">
                <ListItemIcon className="min-w-[32px]">
                  <AlertCircle size={16} className="text-orange-600" />
                </ListItemIcon>
                <ListItemText
                  primary={field}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      ) : !priceSuggestion ? (
        <Button
          fullWidth
          variant="contained"
          onClick={handleGenerateSuggestion}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} /> : <Sparkles size={20} />
          }
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        >
          {loading ? "AI đang phân tích..." : "Nhận gợi ý giá từ Gemini AI"}
        </Button>
      ) : (
        <Box>
          {/* Price Display */}
          <Box className="bg-white rounded-lg p-4 mb-4">
            <Typography variant="overline" className="text-slate-600">
              Giá đề xuất
            </Typography>
            <Typography variant="h4" className="font-bold text-purple-900 mb-2">
              {priceSuggestion.suggestedPrice.toLocaleString()} VND
            </Typography>
            <Box className="flex items-center gap-4 text-sm text-slate-600">
              <Box>
                <Typography variant="caption" className="text-slate-500">
                  Giá thấp nhất
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {priceSuggestion.minPrice.toLocaleString()} VND
                </Typography>
              </Box>
              <Box className="w-px h-8 bg-slate-300" />
              <Box>
                <Typography variant="caption" className="text-slate-500">
                  Giá cao nhất
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {priceSuggestion.maxPrice.toLocaleString()} VND
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box className="grid grid-cols-3 gap-2 mb-4">
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleUseSuggestedPrice("min")}
              className="text-purple-600 border-purple-300"
            >
              Dùng giá min
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleUseSuggestedPrice("suggested")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Dùng gợi ý
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleUseSuggestedPrice("max")}
              className="text-purple-600 border-purple-300"
            >
              Dùng giá max
            </Button>
          </Box>

          {/* Price Comparison */}
          {currentPrice > 0 && getPriceComparison() && (
            <Alert
              severity={getPriceComparison()!.type as any}
              className="mb-3"
              icon={<CheckCircle size={20} />}
            >
              {getPriceComparison()!.message}
            </Alert>
          )}

          {/* Recalculate Button */}
          <Button
            size="small"
            onClick={handleGenerateSuggestion}
            disabled={loading}
            className="text-purple-600"
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            🔄 Tính lại
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AIPriceSuggestion;
