'use client';

import { useEffect, useState } from "react";

const features = [
  {
    icon: "local_fire_department",
    title: "Theo dõi calo",
    description: "Tính toán lượng calo nạp vào và tiêu hao mỗi ngày dựa trên TDEE được cá nhân hóa.",
  },
  {
    icon: "menu_book",
    title: "Quản lý bữa ăn",
    description: "Lưu bữa sáng, trưa, tối và các bữa phụ dễ dàng, nhanh chóng mỗi ngày.",
  },
  {
    icon: "bar_chart",
    title: "Thống kê tiến trình",
    description: "Xem biểu đồ thay đổi theo ngày và theo tuần để theo dõi hành trình rõ ràng.",
  },
  {
    icon: "monitoring",
    title: "Phân tích Macro",
    description: "Theo dõi tỷ lệ protein, carbs, chất béo để đảm bảo chế độ ăn cân bằng, khoa học.",
  },
];

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [barsLoaded, setBarsLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setBarsLoaded(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.13 }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#f4fbf6] text-[#161d1a] overflow-x-hidden">
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <a className="logo" href="#trang-chu">
            <span className="material-symbols-outlined icon-fill" style={{ color: "#005239", fontSize: 26 }}>
              local_fire_department
            </span>
            <span className="logo-text">CaloMate</span>
          </a>

          <div className={`nav-links ${navOpen ? "open" : ""}`}>
            <a className="nav-link" href="#tinh-nang" onClick={() => setNavOpen(false)}>
              Tính năng
            </a>
            <a className="nav-link" href="#cach-hoat-dong" onClick={() => setNavOpen(false)}>
              Cách hoạt động
            </a>
            <a className="nav-link" href="#thong-ke" onClick={() => setNavOpen(false)}>
              Thống kê
            </a>
            <a className="nav-link" href="#lien-he" onClick={() => setNavOpen(false)}>
              Liên hệ
            </a>
            <a className="btn-nav" href="#bat-dau" onClick={() => setNavOpen(false)}>
              Bắt đầu
            </a>
          </div>

          <button className="hamburger" type="button" aria-label="Mở menu" onClick={() => setNavOpen((open) => !open)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <section className="hero" id="trang-chu">
        <div className="blob" style={{ top: "-8%", right: "-5%", width: 580, height: 580, background: "#a5f3cd" }} />
        <div className="blob" style={{ top: "45%", left: "-8%", width: 480, height: 480, background: "#caeadd", opacity: 0.45 }} />
        <div className="blob" style={{ bottom: "-15%", right: "15%", width: 360, height: 360, background: "#8ad6b2", opacity: 0.3 }} />

        <div className="hero-inner">
          <div>
            <div className="eyebrow anim-text d1">
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14, color: "#e86c00" }}>
                local_fire_department
              </span>
              Ứng dụng dinh dưỡng dành cho bạn
            </div>
            <h1 className="hero-h1 anim-text d2">
              Kiểm soát <span className="g">calo.</span>
              <br />
              Xây dựng vóc dáng.
              <br />
              Sống khỏe mỗi ngày.
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
          <a className="btn-primary" href="#" style={{ fontSize: 16, padding: "15px 40px", borderRadius: 14, display: "inline-flex", boxShadow: "0 8px 28px rgba(0,82,57,.32)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_forward
            </span>
            Bắt đầu với CaloMate
          </a>
          <p className="cta-note">✓ Miễn phí hoàn toàn · ✓ Tiếng Việt 100% · ✓ Không cần thẻ ngân hàng</p>
        </div>
      </section>

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
            <a className="footer-link" href="#">Chính sách bảo mật</a>
            <a className="footer-link" href="#">Điều khoản sử dụng</a>
            <a className="footer-link" href="#">Liên hệ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
