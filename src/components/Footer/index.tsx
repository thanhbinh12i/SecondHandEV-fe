import React from "react";
import { Zap, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import {
  Container,
  Box,
  IconButton,
  List,
  ListItem,
  Grid,
  Typography,
  Divider,
  Link as MuiLink,
} from "@mui/material";

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Sản phẩm",
      links: ["Mua xe điện", "Mua pin", "Đăng tin bán", "Định giá AI"],
    },
    {
      title: "Công ty",
      links: ["Về chúng tôi", "Blog", "Tuyển dụng", "Liên hệ"],
    },
  ];

  const socialIcons = [
    { icon: Facebook, color: "#1877f2" },
    { icon: Twitter, color: "#1da1f2" },
    { icon: Instagram, color: "#e4405f" },
    { icon: Linkedin, color: "#0a66c2" },
  ];

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#0f172a", color: "white", pt: 8, pb: 4 }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                animation: "fadeInUp 0.6s ease-out",
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #2563eb 100%)",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                }}
              >
                <Zap color="white" size={24} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                SecondHandEV
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#94a3b8", mb: 3, lineHeight: 1.8 }}
            >
              Nền tảng giao dịch xe điện và pin hàng đầu Việt Nam. Kết nối người
              mua và người bán một cách an toàn, nhanh chóng.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {socialIcons.map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    transition: "all 0.3s ease",
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    "&:hover": {
                      bgcolor: social.color,
                      transform: "translateY(-5px) scale(1.1)",
                      boxShadow: `0 10px 20px ${social.color}40`,
                    },
                  }}
                >
                  <social.icon size={20} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {footerSections.map((section, sectionIndex) => (
            <Grid size={{ xs: 12, sm: 4, md: 3 }} key={section.title}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mb: 3,
                  animation: `fadeInUp 0.6s ease-out ${
                    (sectionIndex + 1) * 0.1
                  }s both`,
                }}
              >
                {section.title}
              </Typography>
              <List sx={{ p: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <ListItem
                    key={link}
                    sx={{
                      p: 0,
                      mb: 1.5,
                      animation: `fadeInUp 0.6s ease-out ${
                        (sectionIndex + 1) * 0.1 + linkIndex * 0.05
                      }s both`,
                    }}
                  >
                    <MuiLink
                      href="#"
                      underline="none"
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                          color: "#10b981",
                          transform: "translateX(5px)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: -15,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 2,
                          bgcolor: "#10b981",
                          transition: "width 0.3s ease",
                        },
                        "&:hover::before": {
                          width: 10,
                        },
                      }}
                    >
                      {link}
                    </MuiLink>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ bgcolor: "#1e293b", mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            © 2025 EVMarket. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Điều khoản", "Chính sách", "Cookie"].map((item, index) => (
              <MuiLink
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  transition: "color 0.3s ease",
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                  "&:hover": {
                    color: "#10b981",
                  },
                }}
              >
                {item}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
