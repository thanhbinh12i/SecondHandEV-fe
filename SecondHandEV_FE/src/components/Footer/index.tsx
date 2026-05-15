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
    {
      title: "Hỗ trợ",
      links: [
        "Trung tâm hỗ trợ",
        "Câu hỏi thường gặp",
        "Hướng dẫn mua",
        "Hướng dẫn bán",
      ],
    },
  ];

  const socialIcons = [
    { icon: Facebook, color: "#1877f2", label: "Facebook" },
    { icon: Twitter, color: "#1da1f2", label: "Twitter" },
    { icon: Instagram, color: "#e4405f", label: "Instagram" },
    { icon: Linkedin, color: "#0a66c2", label: "LinkedIn" },
  ];

  return (
    <Box component="footer" className="!bg-slate-900 !text-white !pt-16 !pb-8">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>

      <Container maxWidth="xl">
        <Grid container spacing={4} className="!mb-12">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              className="!flex !items-center !gap-2 !mb-4"
              sx={{ animation: "fadeInUp 0.6s ease-out" }}
            >
              <Box className="!bg-gradient-to-br !from-emerald-500 !to-blue-600 !p-3 !rounded-xl !flex !shadow-lg">
                <Zap className="!text-white" size={24} />
              </Box>
              <Typography variant="h6" className="!font-bold !text-white">
                SecondHandEV
              </Typography>
            </Box>
            <Typography
              variant="body2"
              className="!text-slate-400 !mb-6 !leading-relaxed"
            >
              Nền tảng giao dịch xe điện và pin hàng đầu Việt Nam. Kết nối người
              mua và người bán một cách an toàn, nhanh chóng.
            </Typography>
            <Box className="!flex !gap-3">
              {socialIcons.map((social, index) => (
                <IconButton
                  key={social.label}
                  aria-label={social.label}
                  className="!bg-white/10 !text-white hover:!-translate-y-1 hover:!scale-110 !transition-all !duration-300"
                  sx={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    "&:hover": {
                      bgcolor: social.color,
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
            <Grid size={{ xs: 12, sm: 6, md: 2.66 }} key={section.title}>
              <Typography
                variant="h6"
                className="!font-bold !text-white !mb-6"
                sx={{
                  animation: `fadeInUp 0.6s ease-out ${
                    (sectionIndex + 1) * 0.1
                  }s both`,
                }}
              >
                {section.title}
              </Typography>
              <List className="!p-0">
                {section.links.map((link, linkIndex) => (
                  <ListItem
                    key={link}
                    className="!p-0 !mb-3"
                    sx={{
                      animation: `fadeInUp 0.6s ease-out ${
                        (sectionIndex + 1) * 0.1 + linkIndex * 0.05
                      }s both`,
                    }}
                  >
                    <MuiLink
                      href="#"
                      underline="none"
                      className="!text-slate-400 !text-sm hover:!text-emerald-500 hover:!translate-x-1 !transition-all !duration-300 !relative before:!content-[''] before:!absolute before:!-left-4 before:!top-1/2 before:!-translate-y-1/2 before:!w-0 before:!h-0.5 before:!bg-emerald-500 before:!transition-all before:!duration-300 hover:before:!w-2.5"
                    >
                      {link}
                    </MuiLink>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider className="!bg-slate-800 !mb-8" />

        <Box className="!flex !justify-between !items-center !flex-wrap !gap-4">
          <Typography variant="body2" className="!text-slate-400">
            © 2025 SecondHandEV. All rights reserved.
          </Typography>
          <Box className="!flex !gap-6">
            {["Điều khoản", "Chính sách", "Cookie"].map((item, index) => (
              <MuiLink
                key={item}
                href="#"
                underline="none"
                className="!text-slate-400 !text-sm hover:!text-emerald-500 !transition-colors !duration-300"
                sx={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
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
