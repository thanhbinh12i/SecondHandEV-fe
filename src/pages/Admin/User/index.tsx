import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Search, MoreVertical, Edit, Trash2, Eye, Filter } from "lucide-react";
import { useGetUserList } from "src/queries/useUser";
import { AdminMemberDto } from "src/types/user.type";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<AdminMemberDto | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data, isLoading } = useGetUserList({
    page,
    pageSize,
    search,
    isActive: isActive === "" ? undefined : isActive === "true",
  });

  const userList = data?.data.users || [];
  const totalCount = data?.data.totalCount || 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleIsActiveChange = (event: SelectChangeEvent<string>) => {
    setIsActive(event.target.value);
    setPage(1);
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: AdminMemberDto
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewUser = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const activeUsers = userList.filter((u) => u.isActive).length;
  const inactiveUsers = userList.filter((u) => !u.isActive).length;
  const adminUsers = userList.filter((u) => u.role === "Admin").length;

  return (
    <Box className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-slate-600">
          Quản lý thông tin và trạng thái người dùng trong hệ thống
        </p>
      </div>

      <Grid container spacing={3} className="mb-6">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper className="p-4 !bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <Typography variant="body2" className="mb-1 opacity-90">
              Tổng người dùng
            </Typography>
            <Typography variant="h4" className="font-bold">
              {totalCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper className="p-4 !bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Typography variant="body2" className="mb-1 opacity-90">
              Đang hoạt động
            </Typography>
            <Typography variant="h4" className="font-bold">
              {activeUsers}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper className="p-4 !bg-gradient-to-br from-red-500 to-red-600 text-white">
            <Typography variant="body2" className="mb-1 opacity-90">
              Tạm khóa
            </Typography>
            <Typography variant="h4" className="font-bold">
              {inactiveUsers}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper className="p-4 !bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Typography variant="body2" className="mb-1 opacity-90">
              Quản trị viên
            </Typography>
            <Typography variant="h4" className="font-bold">
              {adminUsers}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <TextField
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={search}
            onChange={handleSearchChange}
            size="small"
            className="w-full md:w-96"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-slate-400" />
                </InputAdornment>
              ),
            }}
          />
          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<Filter size={18} />}
              className="text-slate-700 border-slate-300"
              onClick={handleFilterOpen}
            >
              Lọc
            </Button>
          </div>
        </div>
      </Paper>

      <Paper className="shadow-lg">
        <TableContainer>
          <Table>
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell className="font-semibold">Người dùng</TableCell>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell className="font-semibold">Số điện thoại</TableCell>
                <TableCell className="font-semibold">Vai trò</TableCell>
                <TableCell className="font-semibold">Ngày tạo</TableCell>
                <TableCell className="font-semibold">Trạng thái</TableCell>
                <TableCell className="font-semibold" align="center">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : userList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    <Typography>Không tìm thấy người dùng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                userList.map((user) => (
                  <TableRow
                    key={user.memberId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="bg-gradient-to-br from-emerald-500 to-blue-600"
                          sx={{ width: 40, height: 40 }}
                        >
                          {getInitials(user.displayName)}
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {user.displayName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.fullName || "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {user.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        className={
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Hoạt động" : "Tạm khóa"}
                        size="small"
                        className={
                          user.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewUser}>
          <Eye size={18} className="mr-2" />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit size={18} className="mr-2" />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="text-red-600">
          <Trash2 size={18} className="mr-2" />
          Xóa
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          style: { minWidth: "200px", padding: "8px" },
        }}
      >
        <div className="px-3 py-2">
          <Typography variant="subtitle2" className="font-semibold mb-3">
            Bộ lọc
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={isActive}
              onChange={(e) => {
                handleIsActiveChange(e);
                handleFilterClose();
              }}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Hoạt động</MenuItem>
              <MenuItem value="false">Tạm khóa</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Menu>

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Avatar className="bg-white text-emerald-600">
              {getInitials(selectedUser?.displayName)}
            </Avatar>
            <div>
              <Typography variant="h6">{selectedUser?.displayName}</Typography>
              <Typography variant="body2" className="opacity-90">
                {selectedUser?.email}
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="mt-4">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Họ và tên
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {selectedUser?.fullName || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Số điện thoại
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {selectedUser?.phone || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Email
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {selectedUser?.email || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Ngày sinh
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {formatDate(selectedUser?.dateOfBirth)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Vai trò
              </Typography>
              <Chip
                label={selectedUser?.role}
                className={
                  selectedUser?.role === "Admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Trạng thái
              </Typography>
              <Chip
                label={selectedUser?.isActive ? "Hoạt động" : "Tạm khóa"}
                className={
                  selectedUser?.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Địa chỉ
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {selectedUser?.address || "—"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Thống kê hoạt động
              </Typography>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <Paper className="p-3 text-center bg-blue-50">
                  <Typography variant="h6" className="text-blue-600 font-bold">
                    {selectedUser?.totalListings || 0}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Sản phẩm
                  </Typography>
                </Paper>
                <Paper className="p-3 text-center bg-emerald-50">
                  <Typography
                    variant="h6"
                    className="text-emerald-600 font-bold"
                  >
                    {selectedUser?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Đơn hàng
                  </Typography>
                </Paper>
                <Paper className="p-3 text-center bg-purple-50">
                  <Typography
                    variant="h6"
                    className="text-purple-600 font-bold"
                  >
                    {selectedUser?.totalReviews || 0}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Đánh giá
                  </Typography>
                </Paper>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Ngày tạo
              </Typography>
              <Typography variant="body1">
                {formatDate(selectedUser?.createdAt)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" className="text-slate-600 mb-1">
                Cập nhật lần cuối
              </Typography>
              <Typography variant="body1">
                {formatDate(selectedUser?.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
          <Button
            variant="contained"
            className="bg-gradient-to-r from-emerald-500 to-blue-600"
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
