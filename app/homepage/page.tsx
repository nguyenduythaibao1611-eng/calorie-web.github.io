'use client';

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";

export default function Home() {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [barsLoaded, setBarsLoaded] = useState(false);

  const handleStart = useCallback(() => {
    const hasProfile = profile && profile.name && profile.name.trim() !== "";
    if (hasProfile) {
      router.push("/dashboard");
    } else {
      router.push("/setup");
    }
  }, [profile, router]);

  const features = [
    { icon: "calculate", title: "Tính TDEE tự động", description: "Nhập thông số cơ thể, CaloMate sẽ tính toán lượng calo cần thiết mỗi ngày một cách chính xác." },
    { icon: "analytics", title: "Theo dõi macro chi tiết", description: "Giám sát Protein, Carbs, Chất béo hàng ngày và nhận gợi ý cải thiện để đạt mục tiêu nhanh hơn." },
    { icon: "food_bank", title: "Thực phẩm Việt Nam", description: "Cơ sở dữ liệu rộng lớn các thực phẩm Việt Nam với thông tin dinh dưỡng chính xác, cập nhật liên tục." },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBarsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#f4fbf6]">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <div className="logo">
            <span className="material-symbols-outlined filled-icon text-primary" style={{ fontSize: 20 }}>
              local_fire_department
            </span>
            <span className="font-h1 font-black tracking-tight logo-text">CaloMate</span>
          </div>
          <div className={`nav-links ${navOpen ? "open" : ""}`}>
            <a className="nav-link" href="#tinh-nang">Tính năng</a>
            <Link className="nav-link" href="/diary">Nhật ký</Link>
            <Link className="nav-link" href="/stats">Thống kê</Link>
            <button className="nav-link" onClick={handleStart}>Bắt đầu</button>
            <Link className="btn-nav" href="/settings">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                account_circle
              </span>
              Tài khoản
            </Link>
          </div>
          <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow anim-text d1">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                auto_awesome
              </span>
              Công cụ quản lý dinh dưỡng toàn diện
            </div>
            <h1 className="hero-h1 anim-text d2">
              <span className="g">Kiểm soát dinh dưỡng</span>, <br /> thay đổi cơ thể
            </h1>
            <p className="hero-sub anim-text d3">
              CaloMate giúp bạn tính TDEE, theo dõi macro, ghi nhật ký bữa ăn và tiến trình thay đổi cơ thể bằng giao diện đơn giản, hiện đại và trực quan.
            </p>
            <div className="hero-btns anim-text d4">
              <a className="btn-primary" href="#bat-dau">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  rocket_launch
                </span>
                Bắt đầu miễn phí
              </a>
            </div>
            <div className="hero-stats anim-text d4">
              <div className="hstat" style={{ paddingLeft: 0 }}>
                <span className="hstat-num fn">30s</span>
                <span className="hstat-lbl">Để bắt đầu</span>
              </div>
            </div>
          </div>

          <div className="mock-wrap anim-card">
            <div className="float-badge" style={{ top: -18, right: 20 }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: "#e86c00", fontSize: 16 }}>
                local_fire_department
              </span>
              Chuỗi 5 ngày 🔥
            </div>

            <div className="mock-card">
              <div className="mc-label">Tổng quan hôm nay</div>
              <div className="mc-num fn" id="hero-calo">
                2,594
              </div>
              <div className="mc-unit">kcal còn lại</div>
              <div className="mc-div" />
              <div className="mc-macros">
                <div className="mm-row">
                  <div className="mm-head">
                    <span className="mm-name">Protein</span>
                    <span className="mm-val">78 / 195g</span>
                  </div>
                  <div className="track">
                    <div className="bar bar-p" style={{ width: barsLoaded ? "40%" : "0%" }} />
                  </div>
                </div>
                <div className="mm-row">
                  <div className="mm-head">
                    <span className="mm-name">Carbs</span>
                    <span className="mm-val">90 / 292g</span>
                  </div>
                  <div className="track">
                    <div className="bar bar-c" style={{ width: barsLoaded ? "31%" : "0%" }} />
                  </div>
                </div>
                <div className="mm-row">
                  <div className="mm-head">
                    <span className="mm-name">Chất béo</span>
                    <span className="mm-val">19 / 72g</span>
                  </div>
                  <div className="track">
                    <div className="bar bar-f" style={{ width: barsLoaded ? "26%" : "0%" }} />
                  </div>
                </div>
              </div>
              <div className="mc-badge">
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16, color: "#005239" }}>
                  check_circle
                </span>
                Đang theo đúng kế hoạch!
              </div>
            </div>

            <div className="float-badge" style={{ bottom: -20, left: 18 }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: "#1a6b4e", fontSize: 16 }}>
                trending_down
              </span>
              −0.4kg tuần này
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="tinh-nang">
        <div className="section-inner">
          <h2 className="sec-title reveal">Tất cả những gì bạn cần<br />để kiểm soát dinh dưỡng</h2>
          <p className="sec-sub reveal rd1">
            Được thiết kế cho người Việt, với giao diện thân thiện và dữ liệu thực phẩm Việt Nam đầy đủ.
          </p>
          <div className="feat-grid">
            {features.map((feature, index) => (
              <div key={feature.title} className={`feat-card reveal rd${index + 1}`}>
                <div className="feat-icon">
                  <span className="material-symbols-outlined icon-fill" style={{ color: index === 0 ? "#e86c00" : index === 1 ? "#1a6b4e" : index === 2 ? "#005239" : "#48645a", fontSize: 26 }}>
                    {feature.icon}
                  </span>
                </div>
                <div className="feat-title">{feature.title}</div>
                <div className="feat-desc">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" id="thong-ke" style={{ paddingTop: 0 }}>
        <div className="stats-band reveal">
          <div className="sb-item">
            <div className="sb-num fn">10,000+</div>
            <div className="sb-lbl">Người dùng đang hoạt động</div>
          </div>
          <div className="sb-div" />
          <div className="sb-item">
            <div className="sb-num fn">2.5M+</div>
            <div className="sb-lbl">Bữa ăn đã ghi nhận</div>
          </div>
          <div className="sb-div" />
          <div className="sb-item">
            <div className="sb-num fn">4.9 ★</div>
            <div className="sb-lbl">Đánh giá trung bình</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-bg" id="cach-hoat-dong">
        <div className="section-inner">
          <h2 className="sec-title reveal">
            Bắt đầu chỉ trong <span style={{ color: "#005239" }}>3 bước</span>
          </h2>
          <p className="sec-sub reveal rd1">
            Không cần kiến thức dinh dưỡng. CaloMate tính toán mọi thứ cho bạn.
          </p>
          <div className="steps-wrap">
            <div className="steps-line" />
            <div className="step-card reveal rd1">
              <div className="step-num fn">1</div>
              <div className="step-title">Tạo hồ sơ</div>
              <div className="step-desc">Nhập thông số cơ thể: giới tính, tuổi, chiều cao, cân nặng và mức vận động.</div>
            </div>
            <div className="step-card reveal rd2">
              <div className="step-num fn">2</div>
              <div className="step-title">Nhận kế hoạch</div>
              <div className="step-desc">CaloMate tự động tính TDEE và phân bổ macro phù hợp với mục tiêu của bạn.</div>
            </div>
            <div className="step-card reveal rd3">
              <div className="step-num fn">3</div>
              <div className="step-title">Ghi nhật ký</div>
              <div className="step-desc">Ghi lại bữa ăn mỗi ngày và theo dõi tiến trình thay đổi cơ thể theo từng tuần.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" id="bat-dau">
        <div className="cta-box reveal" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <div style={{ background: "rgba(165,243,205,.55)", borderRadius: 999, padding: 16, display: "inline-flex" }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: "#005239", fontSize: 32 }}>
                rocket_launch
              </span>
            </div>
          </div>
          <h2 className="cta-title">Bắt đầu hành trình thay đổi<br />cơ thể ngay hôm nay</h2>
          <p className="cta-sub">Chỉ mất 30 giây để tạo hồ sơ và nhận kế hoạch<br />dinh dưỡng cá nhân hóa hoàn toàn miễn phí.</p>
          <button className="btn-primary" onClick={handleStart} style={{ fontSize: 16, padding: "15px 40px", borderRadius: 14, display: "inline-flex", boxShadow: "0 8px 28px rgba(0,82,57,.32)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_forward
            </span>
            Bắt đầu với CaloMate
          </button>
          <p className="cta-note">✓ Miễn phí hoàn toàn · ✓ Tiếng Việt 100% · ✓ Không cần thẻ ngân hàng</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="lien-he">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="material-symbols-outlined icon-fill" style={{ color: "#005239", fontSize: 20 }}>
              local_fire_department
            </span>
            <span style={{ fontWeight: 900, fontSize: 16, color: "#005239", letterSpacing: "-0.02em" }}>CaloMate</span>
            <span className="footer-copy" style={{ marginLeft: 6 }}>© 2026</span>
          </div>
          <div className="footer-links">
            <a className="footer-link" href="/privacy">Chính sách bảo mật</a>
            <a className="footer-link" href="/terms">Điều khoản sử dụng</a>
            <a className="footer-link" href="/contact">Liên hệ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}