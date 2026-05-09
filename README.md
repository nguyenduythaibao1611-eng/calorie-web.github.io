# 🍽️ Calorie Web

**Ứng dụng web quản lý calo hàng ngày** - Được xây dựng bằng Next.js 16, React 19, TypeScript

Dự án tập trung vào tính đơn giản, dễ sử dụng và phù hợp với sinh viên hoặc người mới bắt đầu.

> **Trạng thái:** v0.1.0 (Early Stage Development)

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tech Stack](#tech-stack)
- [Cấu trúc Thư Mục](#cấu-trúc-thư-mục)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Chạy Dự Án](#chạy-dự-án)
- [Tính Năng Hiện Tại](#tính-năng-hiện-tại)
- [Git Workflow](#git-workflow)
- [Tiến Độ Hiện Tại](#tiến-độ-hiện-tại)
- [Công Việc Sắp Tới](#công-việc-sắp-tới)

---

## 🎯 Giới thiệu

**Calorie Web** là ứng dụng giúp người dùng:
- Ghi lại lượng calo tiêu thụ mỗi ngày
- Theo dõi dinh dưỡng cơ bản (protein, carbs, fat)
- Trực quan hóa dữ liệu bằng biểu đồ
- Thiết lập mục tiêu calo cá nhân

**Đối tượng sử dụng:**
- Sinh viên muốn quản lý chế độ ăn
- Người tập gym theo dõi dinh dưỡng
- Người muốn kiểm soát cân nặng
- Người không thích ứng dụng phức tạp

---

## 🛠️ Tech Stack

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **Next.js** | 16.2.4 | Full-stack framework với App Router |
| **React** | 19.2.4 | UI component library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Styling framework |
| **Zustand** | 5.0.13 | State management |
| **Recharts** | 3.8.1 | Data visualization |
| **Lucide React** | 1.14.0 | Icon library |
| **ESLint** | 9 | Code quality |

---

## 📁 Cấu Trúc Thư Mục

```
calorie-web/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── favicon.ico
│
├── components/          # UI Components
│   └── button.tsx      # Button component
│
├── lib/                 # Utilities & Logic
│   └── storage.ts      # localStorage abstraction layer
│
├── store/              # State Management
│   └── useAppStore.ts  # Zustand store
│
├── types/              # TypeScript Definitions
│   ├── index.ts        # Main interfaces
│   └── user.ts         # User types
│
├── public/             # Static assets
│
├── docs/               # Documentation (Astro Starlight)
│   └── src/content/docs/
│
└── Config Files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.js
    └── eslint.config.mjs
```

---

## 📦 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js 18+ (khuyến nghị 20+)
- npm 9+ hoặc yarn 3+

### Các Bước

1. **Clone dự án**
   ```bash
   git clone <repository-url>
   cd calorie-web
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Kiểm tra TypeScript**
   ```bash
   npm run build
   ```

---

## 🚀 Chạy Dự Án

### Development Server
```bash
npm run dev
```
Truy cập: **http://localhost:3000**

### Production Build
```bash
npm run build
npm run start
```

### Lint Code
```bash
npm run lint
```

### Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint checks
npm run docs      # Generate documentation
```

---

## ✨ Tính Năng Hiện Tại


### ✅ Đã Hoàn Thành

| Tính Năng | Mô Tả |
|-----------|-------|
| **Diary UI** | Giao diện nhập nhật ký calo, 4 section bữa ăn, modal thêm/xóa nguyên liệu, tổng calories từng bữa và cả ngày |
| **Tìm kiếm món ăn** | Modal tìm kiếm 15+ món Việt, nhập gram, tự động tính calories |
| **Lưu trữ tự động** | Dùng Zustand + localStorage, không mất dữ liệu khi reload |
| **Responsive** | Mobile-first, tối ưu cho điện thoại |
| **TypeScript Setup** | Strict mode, full type safety |
| **Tailwind CSS v4** | CSS framework + PostCSS |
| **Zustand Store** | Global state management |
| **Storage Layer** | localStorage abstraction (getProfile, saveProfile, getLog, saveLog, getLogs) |
| **Type Definitions** | MacroTarget, UserProfile, Ingredient, MealEntry, DailyLog |
| **Components** | Button component |
| **ESLint** | Code quality checking |
| **Next.js Layout** | Root layout with global styles |
| **Sửa toàn bộ lỗi** | Đã fix lỗi typescript, props, import/export, duplicate export, v.v. |

### 🔄 Đang Phát Triển

- Dashboard tổng hợp, biểu đồ thống kê
- Trang profile người dùng

### 📋 Planned (Sắp Làm)

- Biểu đồ calories, protein, carbs, fat theo ngày/tuần
- Tối ưu UX cho mobile/tablet
- Thêm hướng dẫn sử dụng chi tiết

---

## 📌 Git Workflow

### Branch Naming Convention

```
feature/<tên-tính-năng>
  Ví dụ: feature/calorie-tracker

bugfix/<mô-tả-lỗi>
  Ví dụ: bugfix/storage-error

docs/<chủ-đề>
  Ví dụ: docs/setup-guide

refactor/<component-name>
  Ví dụ: refactor/storage-layer
```

### Commit Naming Convention

```
feat: Thêm tính năng mới
  Ví dụ: feat: Thêm form ghi calo

fix: Sửa lỗi
  Ví dụ: fix: Sửa lỗi parse localStorage

docs: Cập nhật documentation
  Ví dụ: docs: Cập nhật README

refactor: Tái cấu trúc code
  Ví dụ: refactor: Tách storage logic

style: Thay đổi format code
  Ví dụ: style: Format với eslint

chore: Maintenance
  Ví dụ: chore: Cập nhật dependencies
```

### Quy Trình

```bash
# 1. Tạo branch feature
git checkout -b feature/feature-name

# 2. Commit thay đổi
git add .
git commit -m "feat: Mô tả tính năng"

# 3. Push lên remote
git push origin feature/feature-name

# 4. Tạo Pull Request

# 5. Merge sau khi approved
```

---

## 📊 Tiến Độ Hiện Tại


---

## 📝 Hướng Dẫn Sử Dụng Diary UI

1. Vào trang **/diary** để nhập nhật ký calo từng ngày
2. Chọn bữa ăn, nhấn nút **+** để mở modal thêm món
3. Tìm kiếm món ăn, nhập số gram, xác nhận để lưu
4. Có thể xóa từng nguyên liệu đã thêm
5. Xem tổng calories từng bữa và tổng cả ngày ở đầu trang

---

## 📌 Công Việc Sắp Tới

### Priority 1: Core Pages
- [ ] Dashboard/Home page
- [ ] User profile page
- [ ] Daily log page

### Priority 2: Components
- [ ] Form inputs
- [ ] Card component
- [ ] Meal entry component

### Priority 3: Features
- [ ] Meal logging form
- [ ] Ingredient selector
- [ ] Data calculation

### Priority 4: Visualization
- [ ] Integrate Recharts
- [ ] Charts display
- [ ] Analytics page

---

## 📝 Ghi Chú Khác
- Code được viết bằng **TypeScript strict mode** - đảm bảo type safety
- Storage layer được thiết kế để dễ dàng migrate sang backend sau
- Sử dụng **Zustand** thay vì Redux để code gọn gàng và dễ hiểu

---

test

