---
title: "Báo Cáo Đóng Góp Cá Nhân - Đặng Đức Minh"
description: "Báo cáo chi tiết đóng góp cho các task Planning, UI, DB Integration, Optimization và Peer Review trong dự án Calomate."
---

## Thông tin cá nhân

| | |
|---|---|
| **Họ tên** | Đặng Đức Minh |
| **MSSV** | 24020001 |
| **Nhóm** | Calomate |
| **Vai trò trong nhóm** | Member |

---

## Task 1 — Planning & Setup

**Tuần:** Tuần 1, ngày 06/05/2026 – 08/05/2026

**Công việc đã làm:**
- Tham gia lên kế hoạch dự án cùng nhóm và phân chia nhiệm vụ cho các thành viên
- Tham gia review và merge các Pull Request khởi tạo ban đầu (PR #31, #32, #33, #34, #35, #36)
- Đảm nhận vai trò reviewer (indominusrex932005-arch) — kiểm tra code trước khi merge vào main

**Bằng chứng đóng góp:**
- [Merge PR #35 – TypeScript definitions & storage layer](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/35)
- [Merge PR #36 – TV1 data (ingredients database)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/36)

**Khó khăn gặp phải:**
Nhóm lần đầu làm việc với Next.js App Router và Zustand, mất thời gian thống nhất cấu trúc thư mục trước khi bắt đầu.

**Đánh giá bản thân:** 7/10

---

## Task 2 — UI Implementation

**Tuần:** Tuần 1–3, ngày 09/05/2026 – 20/05/2026

**Công việc đã làm:**
- Hoàn thiện UI ProfileForm: chỉnh logo, màu sắc, watermark (commit `591f3ef`)
- Hoàn thành Task 20: Dashboard hiển thị dữ liệu thật, Water tracking (commit `8057296`)
- Hoàn thành Task 18: Kết nối logic TDEE và lưu vào Store (commit `077c27a`)
- Hoàn thành Task 14: UI trang Profile (commit `fc208f2`)
- Sửa nhiều lỗi UI và test giao diện mobile (commits `29a6404`, `ecec104`)
- **Cải thiện DashboardPage** — merge DashboardPage với diary, sửa lỗi layout, cải thiện responsive trên đa thiết bị (commits `92fd704`, `a1a7035`, `9e9fc0c`) *(Hoàn thành feedback giảng viên: yêu cầu cập nhật lại Dashboard)*
- **Căn chỉnh lại kích thước ly nước** cho chuẩn hơn trên các thiết bị khác nhau (commits `9e2e6eb`, `ba378a3`)
- **Cải thiện trang Homepage**: tối ưu nav, hero CTA, stats numbers và accessibility (commit `97e5470`) *(Hỗ trợ feedback giảng viên: yêu cầu tạo trang Homepage)*

**Bằng chứng đóng góp:**
- [PR #47 – Profile UI (Task 14)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/47)
- [PR #57 – Task 18: TDEE & store connection](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/57)
- [PR #60 – Task 20: Dashboard real data](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/60)
- [PR #76 – UI improvements & bug fixes](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/76)
- [PR #128 – Fix DashboardPage](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/128)
- [PR #133 – Fix DashboardPage V3](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/133)
- [PR #134 – Fix layout drinks](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/134)
- [PR #135 – Optimize layout đa thiết bị](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/135)

**Khó khăn gặp phải:**
Phần lớn code UI được viết với sự hỗ trợ nhiều từ AI — hiểu logic ở mức cơ bản nhưng chưa nắm rõ từng chi tiết. Debug lỗi truyền props giữa Dashboard và Store tốn khá nhiều thời gian do chưa quen với Zustand. Việc căn chỉnh layout responsive trên nhiều kích thước màn hình cũng đòi hỏi nhiều lần thử nghiệm.

**Đánh giá bản thân:** 8/10

---

## Task 3 — Database Integration

**Tuần:** Tuần 2–3, ngày 17/05/2026 – 20/05/2026

**Công việc đã làm:**
- Tự học Prisma ORM và Supabase từ đầu — không có kinh nghiệm trước với cả hai công nghệ này
- Cài đặt Prisma, kết nối Supabase, chọn phiên bản thư viện tương thích cho nhóm (commit `c8a525f`)
- Chuyển đổi dữ liệu từ database tĩnh (JSON) sang database động với Prisma (commit `43ed13a`)
- Xây dựng API routes cho meals, users và ingredients (commits `a3351ae`, `e04334b`, `4236e93`)
- Fix lỗi static rendering: thêm `force-dynamic` vào các file `route.ts` (commits `2fa4fdb`, `d85a01c`)
- Fix `postinstall prisma generate` để Vercel generate client đúng thời điểm (commit `6bfeabd`)
- **Xóa bảng User/Meal trong Prisma và cập nhật storage sang dùng localStorage** sau khi đánh giá lại kiến trúc (commit `144e51c`)
- Review và approve PR #93 (fix timezone bug trong streak — do thành viên khác phát hiện và thực hiện)

**Bằng chứng đóng góp:**
- [PR #91 – Migrate static DB to dynamic](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/91)
- [PR #97 – Prisma API setup](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/97)
- [PR #99 – API database v2 (final)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/99)
- [PR #121 – Refactor storage và Prisma](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/121)

**Khó khăn gặp phải:**
Đây là phần khó nhất với tôi. Không có kiến thức nền về Prisma và Supabase, phần lớn công việc thực hiện với sự hỗ trợ của AI và tài liệu — mức độ hiểu thực sự vẫn còn hạn chế. Giai đoạn deploy Vercel gặp nhiều lỗi liên tiếp và tốn thời gian hơn dự kiến nhiều. Một phần vì không hiểu đủ sâu nguyên nhân gốc của từng lỗi, một phần vì phải dựa vào tài khoản Vercel của thành viên khác để deploy và test — mỗi lần fix đều phải chờ người đó thao tác.

**Đánh giá bản thân:** 7/10

---

## Task 4 — Optimization

**Tuần:** Tuần 2–3, ngày 10/05/2026 – 20/05/2026

**Công việc đã làm:**
- Hoàn thành Task 25: tối ưu Lighthouse score lên trên 75 (commit `78bb0e2`)
- Áp dụng lazy loading với `next/dynamic` cho Modal và Charts
- Thêm `aria-label` cho các interactive elements để cải thiện Accessibility
- Thêm `useMemo` và `useCallback` vào một số components
- Cấu hình Cache Headers trong `next.config.ts`
- Hoàn thành Task 23: Responsive UI cho Dashboard trên Mobile và Tablet (commit `8ef7d6d`)
- Fix thiếu thuộc tính `id` trong hàm `searchIngredient` (commit `ae59f20`)
- **Tối ưu accessibility trên trang Homepage** — cải thiện nav, CTA và stats numbers (commit `97e5470`)

**Bằng chứng đóng góp:**
- [PR #71 – Task 25 Performance optimization](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/71)
- [PR #65 – Task 23 Responsive UI](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/65)
- [PR #64 – Fix search ingredient id](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/64)
- [PR #104 – Cải thiện trang Homepage](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/104)

**Khó khăn gặp phải:**
Các bước tối ưu chủ yếu thực hiện theo hướng dẫn của AI và tài liệu Next.js — hiểu mục đích của từng bước nhưng chưa nắm hết lý do kỹ thuật bên dưới. `optimizeCss` gây lỗi build không rõ nguyên nhân và tốn thêm thời gian để giải quyết.

**Đánh giá bản thân:** 7/10

---

## Task 5 — Peer Review

**Tuần:** Tuần 3, ngày 17/05/2026 – 20/05/2026

**Công việc đã làm:**
- Review code nội bộ với tư cách reviewer (indominusrex932005-arch): approve và merge các PR #59, #65, #68, #69, #71, #72, #76, #81, #93, #99, #103, #104, #121, #128, #129, #133, #134, #135
- Cross-team peer review cho hothong3k/QuickToDo: đọc source code và gửi issue feedback về UX

**Feedback gửi cho nhóm hothong3k/QuickToDo:**
Issue: *"Missing delete confirmation dialog and undo feature"*

Mô tả: Khi người dùng click nút xóa một todo, item bị xóa ngay lập tức mà không có dialog xác nhận hay chức năng Undo. Điều này có thể gây mất dữ liệu nếu người dùng click nhầm — đặc biệt với các todo có mô tả chi tiết, nhiều subtask và deadline.

**Bằng chứng đóng góp:**
- [Peer review issue gửi cho hothong3k/QuickToDo](https://github.com/hothong3k/QuickToDo/issues)
- [Lịch sử merge PR nội bộ (reviewer: indominusrex932005-arch)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pulls?q=is%3Apr+is%3Amerged)

**Khó khăn gặp phải:**
Review code của nhóm khác không quá khó vì chỉ cần đọc và comment — phần này diễn ra tốt hơn so với các task code.

**Đánh giá bản thân:** 8/10

---

## Tóm tắt đóng góp cá nhân

**Tóm tắt những gì đã đóng góp:**
Đóng góp chính của tôi tập trung ở phần tích hợp database và một số phần UI. Phần lớn code được viết với sự hỗ trợ đáng kể từ AI và tài liệu — hiểu tổng thể luồng hoạt động ở mức cao nhưng chưa nắm sâu từng chi tiết kỹ thuật. Phần tốn thời gian nhất là deploy Prisma lên Vercel, do phụ thuộc vào môi trường của thành viên khác và sự không quen thuộc với các lỗi build. Trong giai đoạn cuối, tôi tập trung vào cải thiện Dashboard layout, tối ưu responsive cho ly nước, và hỗ trợ cải thiện trang Homepage — hoàn thành các feedback từ giảng viên. Qua dự án này, tôi có được hiểu biết cơ bản về Prisma, Supabase và làm việc nhóm qua GitHub — dù vẫn còn rất nhiều điều cần học thêm.

**Ước tính % đóng góp so với cả nhóm:** ~25%

**Điểm tự đánh giá tổng thể:** 7.4/10