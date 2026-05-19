<a href="/downloads/final-project-self-report-template.md" download="final-project-self-report-template.md">Tải về template (.md)</a>

---

## Thông tin cá nhân

|                        |                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| **Họ tên**             | Từ Văn Huy Hoàng                                                                          |
| **MSSV**               | 24020009                                                                                  |
| **Nhóm**               | CaloMate                                                                                  |
| **Vai trò trong nhóm** | Lập trình viên Full-stack & Phụ trách kỹ thuật cốt lõi (Full-stack Developer & Tech Lead) |

---

## Task 1 — Planning & Setup

**Tuần:** Tuần 1 (01/05/2026 – 08/05/2026)

**Công việc đã làm:**

- **Thiết kế & Lập trình Module Tính toán Dinh dưỡng cốt lõi (`lib/calc.ts`):** Lập trình các thuật toán tự động tính toán nhu cầu năng lượng hàng ngày của người dùng dựa trên công thức Mifflin-St Jeor (tính BMR, TDEE, và tự động thiết lập các chỉ số mục tiêu Calo, tỷ lệ Protein, Carbs, Fat theo mục tiêu giảm/tăng/duy trì cân nặng).
- **Xây dựng hệ thống UI Components dùng chung cốt lõi (`components/ui/`):** Thiết kế bộ thư viện component giao diện cơ bản có khả năng tái sử dụng cao như Button, Card, Input, Modal, ProgressBar, Badge, BottomNav.
- **Lập trình hệ thống Bottom Navigation (`components/nav/BottomNav.tsx`):** Triển khai thanh menu điều hướng chân trang để liên kết các trang chính Dashboard (`/`), Nhật ký (`/diary`), và Thống kê (`/stats`).

**Bằng chứng đóng góp:**

- Commits:
  - [b2162de](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/b2162de) - `feat: implement calorie & macro calculation (issue #7)`
  - [152615c](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/152615c) - `feat: add reusable UI components (issue #9)`
  - [060c166](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/060c166) - `feat: implement bottom navigation (issue #10)`

**Khó khăn gặp phải:**

- Thiết kế hệ thống kiểu dữ liệu TypeScript (`types/index.ts`) sao cho vừa đủ tính linh hoạt để bao quát được nhiều bữa ăn đa dạng trong ngày, vừa đảm bảo tính nhất quán tuyệt đối của State Store khi đồng bộ hóa.

**Đánh giá bản thân:** 8/10

---

## Task 2 — UI Implementation

**Tuần:** Tuần 2 (09/05/2026 – 15/05/2026)

**Công việc đã làm:**

- **Xây dựng & Tối ưu hóa thuật toán tìm kiếm nguyên liệu (`lib/search.ts`):** Cài đặt cơ chế chuẩn hóa chuỗi tiếng Việt (loại bỏ dấu và ký tự đặc biệt) kết hợp thuật toán chấm điểm và xếp hạng kết quả (scoring & ranking algorithm) nhằm mang lại trải nghiệm tìm kiếm nhanh chóng và chính xác cho hơn 15+ món ăn Việt phổ biến.
- **Hoàn thiện & Nâng cấp UI/UX trang Nhật ký ăn uống (`app/diary/page.tsx`):** Lập trình giao diện 4 bữa chính/phụ, bổ sung tính năng gộp nhiều món ăn trùng nhau (tự động cộng dồn khối lượng gram và cập nhật lại lượng Calo/dinh dưỡng), cải tiến bộ chọn món và tích hợp chức năng xóa món trực quan.
- **Tối ưu hóa và sửa lỗi hiển thị:** Fix các lỗi cú pháp JSX, thuộc tính CSS, và tích hợp thư viện Framer Motion để tạo hiệu ứng chuyển động mượt mà cho nút bấm `motion.button` trong trang Diary.

**Bằng chứng đóng góp:**

- Commits:
  - [4d18754](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/4d18754) - `feat: improve search with scoring and ranking (#22)`
  - [8cf3790](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8cf3790) - `fix: có thể gộp nhiều món với nhau`
  - [6a0bdb1](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/6a0bdb1) - `fix cách chọn món ăn, và thêm chức năng xóa món ăn`
  - [4be543f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/4be543f) - `fix: sửa lỗi cú pháp JSX và thẻ motion.button trong trang diary`
  - [215e68f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/215e68f) - `feat: fix chuỗi`

**Khó khăn gặp phải:**

- Xử lý việc gộp các nguyên liệu trùng tên và tự động tính toán lại tổng calorie của bữa ăn theo thời gian thực đòi hỏi quản lý nested state trong Zustand một cách tỉ mỉ để tránh lỗi đồng bộ dữ liệu hoặc re-render thừa.

**Đánh giá bản thân:** 8/10

---

## Task 3 — Database Integration

**Tuần:** Tuần 3 (16/05/2026 – 17/05/2026)

**Công việc đã làm:**

- **Phát triển cơ chế đồng bộ chuỗi ngày đạt mục tiêu (`syncStreak`):** Thiết kế và lập trình hàm `calculateAndUpdateStreak` tự động quét dữ liệu log nhật ký cũ, đối chiếu điều kiện đạt chuẩn (đủ 3 bữa chính Sáng, Trưa, Tối trong ngày) để đếm và đồng bộ chuỗi Streak thực tế của người dùng.
- **Tích hợp đồng bộ trạng thái toàn cục:** Đồng bộ hóa dữ liệu Streak, mục tiêu dinh dưỡng và nhật ký ăn uống trực tiếp giữa các trang chính qua Zustand Store (`profileStore.ts` & `diaryStore.ts`).
- **Xây dựng Storage Layer Offline-first:** Tận dụng tối đa `localStorage` thông qua cơ chế tự động đồng bộ và khôi phục trạng thái (Zustand persist helper), đảm bảo ứng dụng chạy mượt mà offline không lo mất dữ liệu.

**Bằng chứng đóng góp:**

- Commits:
  - [7e4aa99](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/7e4aa99) - `PR #1: done (thêm luôn tính năng syncStreak để đồng bộ các streak lại với nhau)`

**Khó khăn gặp phải:**

- Việc đồng bộ chuỗi Streak liên tục đòi hỏi đồng bộ hóa chính xác giữa hai Store độc lập (`profileStore` quản lý thông tin profile/streak và `diaryStore` quản lý logs bữa ăn) mà không gây ra hiện tượng xung đột hay mất tính nhất quán khi người dùng chuyển trang liên tục.

**Đánh giá bản thân:** 8/10

---

## Task 4 — Optimization, UI Refinement & Bug Fixing

**Tuần:** Tuần 3 & Tuần 4 (16/05/2026 – 20/05/2026)

**Công việc đã làm:**

- **Tinh chỉnh giao diện Homepage & Dashboard:** Tổ chức lại bố cục trang chủ (Homepage), dọn dẹp các thành phần UI thừa trên Dashboard, đồng thời tối ưu tỷ lệ hiển thị nhằm nâng cao trải nghiệm người dùng.
- **Cập nhật Web Tab Icon (Logo):** Thay đổi biểu tượng favicon của trang web thành icon `local_fire_department` để đồng bộ với nhận diện chuỗi ngày (streak).
- **Tối ưu hóa quy trình phát triển nhóm & Giải quyết xung đột:** Trực tiếp giải quyết các xung đột mã nguồn phức tạp (đặc biệt là tệp `app/layout.tsx`), gộp nhánh `fix-workflow`, thiết lập cơ chế gộp code tự động và đảm bảo quá trình build diễn ra an toàn.
- **Tối ưu hóa chất lượng mã nguồn:** Sửa đổi triệt để các lỗi cú pháp JSX, TypeScript lặp lại để đảm bảo toàn bộ dự án chạy ổn định.
- **Hoàn thiện tài liệu hướng dẫn kỹ thuật:** Cập nhật chi tiết tệp tài liệu dự án hoàn chỉnh (`docs/src/content/docs/index.mdx`) mô tả cụ thể kiến trúc Store, cấu trúc cơ sở dữ liệu và sơ đồ luồng dữ liệu ứng dụng.
- **Refactor kiến trúc Layout Components & Pattern:** Thiết kế và xây dựng `AppShell` wrapper component tái sử dụng cao và `AppHeader` component hiển thị logo/streak/settings, sau đó refactor ba trang chính (Diary, Stats, Dashboard) để sử dụng các component này, giảm code duplication (~80 dòng/trang), xóa bỏ `lib/storage.ts` không cần thiết và tập trung vào Zustand store pattern.

**Bằng chứng đóng góp:**

- Commits:
  - [4387530](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/438753004c3b642c51dd56d77451038d107f2516) - `resolve: merge conflict in layout.tsx - keep icon link + Material Symbols`
  - [4ed70b4](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/4ed70b4148efdd98ad30e72688e5623f84d1504a) - `fix logo lan 1`
  - [7ddef05](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/7ddef058b1202bba2ab69e84826927514ffba421) - `zoom homepage`
  - [b7b5ea5](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/b7b5ea58f15c67d3e397ce70a4a46c3edaad8bf4) - `fix homepage lan 2`
  - [69cec29](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/69cec290f75514f07bcd9a1f4ce3e44307034c39) - `sua lai hompage`
  - [1fae67f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/1fae67f) - `merge: gộp fix-workflow và tự động lấy toàn bộ incoming change`
  - [0d8251f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/0d8251f) - `fix lần 3`
  - [54477af](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/54477af) - `fix lan 3`
  - [d67b282](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d67b282) - `update file docs`
  - [1cb3596](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/1cb3596) - `feat: optimize header và bottom`

**Khó khăn gặp phải:**

- Quá trình giải quyết merge conflict ở file layout gốc và gộp code từ nhiều nhánh song song yêu cầu sự tỉ mỉ để không làm đứt gãy các liên kết thư viện font chữ, UI components và phiên bản thư viện của toàn dự án.
- Refactor layout pattern đòi hỏi cân bằng giữa việc giảm code duplication và đảm bảo flexibility cho từng trang có các yêu cầu responsive design riêng.

**Đánh giá bản thân:** 8/10

---

## Task 5 — Peer Review

**Tuần:** Tuần 3 (16/05/2026 – 17/05/2026)

**Công việc đã làm:**

- **Thực hiện hoạt động đánh giá chéo (Peer Review) dự án của nhóm khác:** Tiến hành kiểm thử và đọc hiểu mã nguồn của nhóm `tducn110` (dự án Tracker_yourMoney). Phát hiện lỗi nghiêm trọng liên quan đến kiểu dữ liệu khi thanh toán hóa đơn và đóng góp ý kiến phản hồi chất lượng cao dưới dạng GitHub Issue.
  - Chi tiết lỗi: Trong hàm `BillService.payBill()`, hệ thống lưu giao dịch với thuộc tính `source: "bill_payment"` nhưng giá trị này không được chấp nhận trong schema validation, gây lỗi validation khi lưu giao dịch và có thể làm sai lệch dữ liệu khi lọc hoặc xuất báo cáo CSV.

**Bằng chứng đóng góp:**

- [GitHub Issue #177 gửi nhóm tducn110/Tracker_yourMoney](https://github.com/tducn110/Tracker_yourMoney/issues/177)

**Khó khăn gặp phải:**

- Không có khó khăn đáng kể nào. Việc đọc hiểu mã nguồn và phát hiện các lỗi logic của nhóm bạn được hoàn thành nhanh chóng nhờ kinh nghiệm làm việc với hệ thống định nghĩa kiểu dữ liệu nghiêm ngặt trong CaloMate.

**Đánh giá bản thân:** 8/10

---

## Tổng Kết Đóng Góp Cá Nhân

**Tóm tắt những gì bạn đã đóng góp cho dự án:**
Trong dự án CaloMate,tôi đã thiết kế và xây dựng thành công công cụ tính toán dinh dưỡng Mifflin-St Jeor tự động, xây dựng hệ thống UI Components dùng chung cốt lõi, phát triển thuật toán tìm kiếm món ăn Việt thông minh (chuẩn hóa tiếng Việt, xếp hạng kết quả) và triển khai hệ thống đồng bộ hóa chuỗi ngày đạt mục tiêu (Streak Sync) trên toàn ứng dụng. Đồng thời, tôi luôn tích cực hỗ trợ giải quyết các xung đột merge conflict lớn, tối ưu hóa Git workflow của cả nhóm, tinh chỉnh giao diện Homepage/Dashboard và viết tài liệu kỹ thuật hoàn chỉnh. Qua dự án này, tôi đã cải thiện đáng kể kỹ năng lập trình Next.js/React 19, quản lý state nâng cao với Zustand, và tích lũy được nhiều kinh nghiệm thực chiến quý báu khi giải quyết các bài toán logic phức tạp trong làm việc nhóm.

**Ước tính % đóng góp so với cả nhóm:** ~25%

**Điểm tự đánh giá tổng thể:** 8/10

---

## Tổng Kết Đóng Góp Cá Nhân

**Tóm tắt những gì bạn đã đóng góp cho dự án:**
Trong dự án CaloMate, tôi đã thiết kế và xây dựng thành công công cụ tính toán dinh dưỡng Mifflin-St Jeor tự động, xây dựng hệ thống UI Components dùng chung cốt lõi, phát triển thuật toán tìm kiếm món ăn Việt thông minh (chuẩn hóa tiếng Việt, xếp hạng kết quả) và triển khai hệ thống đồng bộ hóa chuỗi ngày đạt mục tiêu (Streak Sync) trên toàn ứng dụng. Đồng thời, tôi luôn tích cực hỗ trợ giải quyết các xung đột merge conflict lớn, tối ưu hóa Git workflow của cả nhóm, tinh chỉnh giao diện Homepage/Dashboard, viết tài liệu kỹ thuật hoàn chỉnh, và gần đây tôi đã refactor toàn bộ kiến trúc layout bằng cách tạo AppShell component pattern để giảm code duplication và nâng cao maintainability. Qua dự án này, tôi đã cải thiện đáng kể kỹ năng lập trình Next.js/React 19, quản lý state nâng cao với Zustand, architecture pattern design, và tích lũy được nhiều kinh nghiệm thực chiến quý báu khi giải quyết các bài toán logic phức tạp trong làm việc nhóm.

**Ước tính % đóng góp so với cả nhóm:** ~25-27%

**Điểm tự đánh giá tổng thể:** 8/10
