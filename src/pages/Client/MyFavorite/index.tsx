import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Heart, ShoppingCart, Calendar, Trash2, ArrowLeft } from "lucide-react";
import {
  useDeleteFavoriteMutation,
  useGetMyFavorite,
} from "src/queries/useFavorite";
import { FavoriteDto } from "src/types/favorite.type";

const MyFavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    favoriteId: number | null;
    listingId: number | null;
    title: string;
  }>({
    open: false,
    favoriteId: null,
    listingId: null,
    title: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const pageSize = 12;
  const { data, isLoading, isError, refetch } = useGetMyFavorite({
    page,
    pageSize,
  });

  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const favorites = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalItems = data?.data?.totalItems || 0;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (
    favoriteId: number,
    listingId: number,
    title: string
  ) => {
    setDeleteDialog({
      open: true,
      favoriteId,
      listingId,
      title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.listingId) {
      try {
        await deleteFavoriteMutation.mutateAsync(deleteDialog.listingId);

        if (favorites.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          await refetch();
        }

        setSnackbar({
          open: true,
          message: "Đã xóa khỏi danh sách yêu thích!",
          severity: "success",
        });
        setDeleteDialog({
          open: false,
          favoriteId: null,
          title: "",
          listingId: null,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          open: true,
          message: "Có lỗi xảy ra. Vui lòng thử lại!",
          severity: "error",
        });
      }
    }
  };

  const handleViewDetail = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  if (isLoading) {
    return (
      <Box className="!min-h-screen !bg-slate-50 !flex !items-center !justify-center">
        <Box className="!text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="!mt-4 !text-slate-600">
            Đang tải danh sách yêu thích...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="!min-h-screen !bg-slate-50">
        <Container maxWidth="xl" className="!py-6">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!mb-4 !text-slate-600"
          >
            Quay lại
          </Button>
          <Alert severity="error">
            <Typography variant="h6" className="!font-bold !mb-2">
              Không thể tải danh sách yêu thích
            </Typography>
            <Typography variant="body2">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="!min-h-screen !bg-slate-50">
      <Container maxWidth="xl" className="!py-6">
        <Box className="!mb-6">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="!mb-4 !text-slate-600"
          >
            Quay lại
          </Button>
          <Box className="!flex !items-center !justify-between !flex-wrap !gap-4">
            <Box>
              <Typography variant="h4" className="!font-bold">
                Sản phẩm yêu thích của tôi
              </Typography>
              <Typography variant="body1" className="!text-slate-600 !mt-3">
                {totalItems > 0
                  ? `Bạn có ${totalItems} sản phẩm yêu thích`
                  : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {favorites.length === 0 ? (
          <Paper className="!p-12 !rounded-2xl !shadow-lg !text-center">
            <Heart size={80} className="!mx-auto !text-slate-300 !mb-4" />
            <Typography variant="h5" className="!font-bold !mb-2">
              Chưa có sản phẩm yêu thích
            </Typography>
            <Typography variant="body1" className="!text-slate-600 !mb-6">
              Hãy khám phá và thêm những sản phẩm bạn yêu thích vào danh sách!
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {favorites.map((favorite: FavoriteDto) => {
                return (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    key={favorite.favoriteId}
                  >
                    <Card className="!h-full !flex !flex-col !rounded-2xl !shadow-lg !transition-all hover:!shadow-2xl hover:!-translate-y-1">
                      <Box className="!relative">
                        <CardMedia
                          component="img"
                          image={favorite.primaryImageUrl}
                          alt={favorite.title}
                          className="!h-56 !object-cover !cursor-pointer"
                          onClick={() => handleViewDetail(favorite.listingId)}
                        />
                        <Box className="!absolute !top-3 !left-3 !flex !gap-2">
                          <Chip
                            label={favorite.categoryName || "Chưa phân loại"}
                            size="small"
                            className="!bg-white/90 !font-semibold"
                          />
                        </Box>
                        <IconButton
                          className="!absolute !top-3 !right-3 !bg-white/90 hover:!bg-white !shadow-lg"
                          onClick={() =>
                            handleDeleteClick(
                              favorite.favoriteId,
                              favorite.listingId,
                              favorite.title
                            )
                          }
                        >
                          <Heart
                            size={20}
                            fill="red"
                            className="!text-red-500"
                          />
                        </IconButton>
                      </Box>

                      <CardContent className="!flex-1 !p-4">
                        <Typography
                          className="!font-bold !mb-2 !line-clamp-2 !cursor-pointer hover:!text-emerald-600"
                          onClick={() => handleViewDetail(favorite.listingId)}
                        >
                          {favorite.title}
                        </Typography>

                        <Box className="!flex !flex-wrap !gap-2 !mb-3">
                          {(favorite.brand || favorite.model) && (
                            <Chip
                              label={`${favorite.brand || ""} ${
                                favorite.model || ""
                              }`.trim()}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Typography
                          variant="h6"
                          className="!font-bold !text-emerald-600 !mb-3"
                        >
                          {favorite.price?.toLocaleString() || "0"} ₫
                        </Typography>

                        <Box className="!space-y-2 !text-sm !text-slate-600">
                          {favorite.year && (
                            <Box className="!flex !items-center !gap-2">
                              <Calendar size={16} />
                              <span>Năm: {favorite.year}</span>
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      <CardActions className="!p-4 !pt-0 !flex !gap-2">
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart size={18} />}
                          className="!bg-gradient-to-r !from-emerald-500 !to-green-600"
                          onClick={() => handleViewDetail(favorite.listingId)}
                        >
                          Xem chi tiết
                        </Button>
                        <IconButton
                          size="small"
                          className="!border !border-slate-300"
                          onClick={() =>
                            handleDeleteClick(
                              favorite.favoriteId,
                              favorite.listingId,
                              favorite.title
                            )
                          }
                        >
                          <Trash2 size={18} className="!text-red-500" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {totalPages > 1 && (
              <Box className="!flex !justify-center !mt-8">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        <Dialog
          open={deleteDialog.open}
          onClose={() =>
            setDeleteDialog({
              open: false,
              favoriteId: null,
              listingId: null,
              title: "",
            })
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="!font-bold">
            Xóa khỏi danh sách yêu thích
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa "<strong>{deleteDialog.title}</strong>"
              khỏi danh sách yêu thích?
            </Typography>
          </DialogContent>
          <DialogActions className="!p-4">
            <Button
              onClick={() =>
                setDeleteDialog({
                  open: false,
                  favoriteId: null,
                  listingId: null,
                  title: "",
                })
              }
              className="!text-slate-600"
              disabled={deleteFavoriteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              disabled={deleteFavoriteMutation.isPending}
              startIcon={
                deleteFavoriteMutation.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Trash2 size={18} />
                )
              }
            >
              {deleteFavoriteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MyFavoritesPage;
