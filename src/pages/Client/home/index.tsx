import React, { useState, useEffect } from "react";
import {
  Search,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ChevronRight,
  Battery,
  Car,
  CheckCircle,
  MessageCircle,
  Heart,
  MapPin,
  Calendar,
  Gauge,
} from "lucide-react";

const HomePage: React.FC = () => {
  const [searchType, setSearchType] = useState("ev");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSections, setVisibleSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const featuredListings = [
    {
      id: 1,
      type: "ev",
      title: "Tesla Model 3 Long Range",
      year: 2022,
      price: "850,000,000",
      battery: 95,
      km: 25000,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format",
      location: "TP. Hồ Chí Minh",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      type: "battery",
      title: "Pin LFP 60kWh - VinFast VF8",
      capacity: "60kWh",
      health: 92,
      price: "180,000,000",
      cycles: 450,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop&auto=format",
      location: "Hà Nội",
      verified: true,
    },
    {
      id: 3,
      type: "ev",
      title: "VinFast VF e34",
      year: 2023,
      price: "450,000,000",
      battery: 88,
      km: 12000,
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format",
      location: "Đà Nẵng",
      verified: true,
    },
    {
      id: 4,
      type: "ev",
      title: "Hyundai Kona Electric",
      year: 2021,
      price: "620,000,000",
      battery: 90,
      km: 35000,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format",
      location: "TP. Hồ Chí Minh",
      verified: false,
    },
  ];

  const stats = [
    { icon: Car, value: "2,500+", label: "Xe điện đang bán" },
    { icon: Battery, value: "850+", label: "Pin có sẵn" },
    { icon: CheckCircle, value: "1,200+", label: "Giao dịch thành công" },
    { icon: Star, value: "4.8/5", label: "Đánh giá trung bình" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Kiểm định chất lượng",
      description:
        "Mọi xe và pin đều được kiểm tra kỹ thuật trước khi đăng bán",
    },
    {
      icon: TrendingUp,
      title: "AI định giá thông minh",
      description: "Hệ thống AI gợi ý giá dựa trên dữ liệu thị trường thực tế",
    },
    {
      icon: Zap,
      title: "Giao dịch nhanh chóng",
      description: "Thanh toán an toàn, ký hợp đồng số hóa trong vài phút",
    },
    {
      icon: MessageCircle,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-on-scroll {
            opacity: 0;
            transition: all 0.6s ease-out;
          }

          .animate-on-scroll.visible {
            opacity: 1;
          }

          .slide-up.visible {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .slide-left.visible {
            animation: fadeInLeft 0.8s ease-out forwards;
          }

          .slide-right.visible {
            animation: fadeInRight 0.8s ease-out forwards;
          }

          .scale-in.visible {
            animation: scaleIn 0.8s ease-out forwards;
          }
        `}
      </style>

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-12"
            style={{ animation: "fadeInDown 0.8s ease-out" }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-emerald-700 to-blue-700 bg-clip-text text-transparent">
              Nền tảng giao dịch
              <br />
              Xe điện & Pin hàng đầu
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Mua bán xe điện và pin đã qua sử dụng an toàn, nhanh chóng với
              công nghệ AI định giá thông minh
            </p>
          </div>

          <div
            className="max-w-4xl mx-auto"
            style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSearchType("ev")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    searchType === "ev"
                      ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Car className="inline mr-2" size={20} />
                  Tìm xe điện
                </button>
                <button
                  onClick={() => setSearchType("battery")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    searchType === "battery"
                      ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Battery className="inline mr-2" size={20} />
                  Tìm pin
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder={
                      searchType === "ev"
                        ? "Tìm theo hãng, model, năm..."
                        : "Tìm theo dung lượng, loại pin..."
                    }
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all">
                  Tìm kiếm
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-slate-800 font-bold pt-1">
                  Phổ biến:
                </span>
                {[
                  "Tesla Model 3",
                  "VinFast VF8",
                  "Pin LFP 60kWh",
                  "Hyundai Kona",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-all hover:scale-110"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      <section
        id="stats"
        data-animate
        className={`py-12 bg-white/50 backdrop-blur-sm animate-on-scroll slide-up ${
          visibleSections["stats"] ? "visible" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                style={{
                  animation: visibleSections["stats"]
                    ? `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    : "none",
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4 shadow-lg hover:scale-110 transition-transform">
                  <stat.icon className="text-white" size={28} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="listings" data-animate className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center mb-12 animate-on-scroll slide-up ${
              visibleSections["listings"] ? "visible" : ""
            }`}
          >
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Tin đăng nổi bật
              </h2>
              <p className="text-slate-600">
                Các xe và pin được quan tâm nhiều nhất
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all font-medium hover:scale-105 hover:shadow-lg">
              Xem tất cả
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing, index) => (
              <div
                key={listing.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:scale-105 animate-on-scroll ${
                  index % 2 === 0 ? "slide-left" : "slide-right"
                } ${visibleSections["listings"] ? "visible" : ""}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {listing.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                      ⭐ Nổi bật
                    </div>
                  )}
                  {listing.verified && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="text-white" size={18} />
                    </div>
                  )}
                  <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all hover:scale-110">
                    <Heart size={20} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {listing.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.type === "ev" ? (
                      <>
                        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          <Calendar size={12} />
                          {listing.year}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          <Gauge size={12} />
                          {typeof listing.km === "number"
                            ? listing.km.toLocaleString()
                            : "N/A"}{" "}
                          km
                        </span>
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full font-medium">
                          <Battery size={12} />
                          {listing.battery}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          <Zap size={12} />
                          {listing.capacity}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full font-medium">
                          <Battery size={12} />
                          {listing.health}% health
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                    <MapPin size={14} />
                    {listing.location}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <div>
                      <div className="text-xl font-bold text-emerald-600">
                        {listing.price}
                        <span className="text-lg">tr</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all hover:scale-105">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        data-animate
        className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 animate-on-scroll slide-up ${
              visibleSections["features"] ? "visible" : ""
            }`}
          >
            <h2 className="text-4xl font-bold mb-4">Tại sao chọn EVMarket?</h2>
            <p className="text-slate-300 text-lg">
              Những lợi ích vượt trội khi sử dụng nền tảng của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl animate-on-scroll scale-in ${
                  visibleSections["features"] ? "visible" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg hover:rotate-12 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta"
        data-animate
        className={`py-20 bg-gradient-to-r from-emerald-500 to-blue-600 animate-on-scroll scale-in ${
          visibleSections["cta"] ? "visible" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu giao dịch?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho người dùng mới
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:shadow-2xl hover:scale-110 transition-all transform hover:-translate-y-1">
              Đăng ký miễn phí
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition-all hover:scale-110 transform hover:-translate-y-1">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
