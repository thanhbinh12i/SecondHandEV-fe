import React, { useContext, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { AppContext } from "src/contexts/app.context";
import { MemberDto } from "src/types/user.type";

const ProfilePage: React.FC = () => {
  const { profile } = useContext(AppContext);
  const [member, setMember] = useState<MemberDto>(profile!);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<MemberDto>(profile!);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedMember(member);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMember(member);
  };

  const handleSave = () => {
    setMember(editedMember);
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: "Cập nhật thông tin thành công!",
      severity: "success",
    });
  };

  const handleChange = (field: keyof MemberDto, value: string) => {
    setEditedMember((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentMember = isEditing ? editedMember : member;

  return (
    <Box className="!p-6 !bg-gray-50 !min-h-screen">
      <Container maxWidth="md">
        <Paper className="!rounded-2xl !shadow-lg !p-8">
          <Box className="!flex !items-center !gap-6 !mb-8 !pb-6 !border-b">
            <Avatar className="!w-24 !h-24 !bg-gradient-to-br !from-blue-500 !to-cyan-600 !text-white !text-2xl !font-bold">
              {getInitials(currentMember.displayName)}
            </Avatar>
            <Box className="!flex-1">
              <Typography variant="h5" className="!font-bold !mb-1">
                {currentMember.displayName || "Chưa có tên"}
              </Typography>
              <Typography className="!text-gray-600">
                {currentMember.email}
              </Typography>
            </Box>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit size={18} />}
                onClick={handleEdit}
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box className="!flex !gap-2">
                <Button
                  variant="outlined"
                  startIcon={<X size={18} />}
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save size={18} />}
                  onClick={handleSave}
                  className="!bg-green-600 hover:!bg-green-700"
                >
                  Lưu
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <User size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Tên hiển thị
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={currentMember.displayName || ""}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.displayName || "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <User size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Họ và tên
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={currentMember.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.fullName || "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <Mail size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Email
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={currentMember.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.email || "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <Phone size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Số điện thoại
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={currentMember.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.phone || "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <MapPin size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Địa chỉ
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={currentMember.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.address || "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <Calendar size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Ngày sinh
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={currentMember.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.dateOfBirth
                    ? new Date(currentMember.dateOfBirth).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="!flex !items-center !gap-2 !mb-2">
                <User size={18} className="!text-blue-600" />
                <Typography variant="subtitle2" className="!font-semibold">
                  Giới thiệu
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={currentMember.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              ) : (
                <Typography className="!text-gray-700 !ml-7">
                  {currentMember.bio || "—"}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

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

export default ProfilePage;
