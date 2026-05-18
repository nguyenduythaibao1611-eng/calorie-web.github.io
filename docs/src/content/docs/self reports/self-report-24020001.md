## Thông tin cá nhân

| | |
|---|---|
| **Họ tên** | Đặng Đức Minh |
| **MSSV** | 24020001 |
| **Nhóm** | Calomate |
| **Vai trò trong nhóm** | Thành viên |

---

## Task 1 — Planning & Setup

**Tuần:** Tuần 1, ngày 06/05 – 08/05/2026

**Công việc đã làm:**

- Tham gia lên kế hoạch dự án cùng nhóm, phân chia task cho các thành viên
- Tham gia review và merge các Pull Request setup ban đầu (PR #31, #32, #33, #34, #35, #36)
- Đảm nhận vai trò reviewer (indominusrex932005-arch) — kiểm tra code trước khi merge vào main

**Bằng chứng đóng góp:**

- [Merge PR #35 – TypeScript definitions & storage layer](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/35)
- [Merge PR #36 – TV1 data (ingredients database)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/36)

**Khó khăn gặp phải:**

Nhóm lần đầu làm việc với Next.js App Router và Zustand, mất thời gian thống nhất cấu trúc thư mục trước khi bắt đầu.

**Đánh giá bản thân:** 7/10

---

## Task 2 — UI Implementation

**Tuần:** Tuần 1–2, ngày 09/05 – 16/05/2026

**Công việc đã làm:**

- Hoàn thiện UI ProfileForm: chỉnh logo, màu sắc, watermark (commit 591f3ef)
- Hoàn thành Task 20: Dashboard hiển thị dữ liệu thật, Water tracking (commit 8057296)
- Hoàn thành Task 18: Kết nối Logic TDEE và lưu Store (commit 077c27a)
- Hoàn thành Task 14: UI trang Profile (commit fc208f2)
- Fix một số lỗi UI và test giao diện mobile (commits 29a6404, ecec104)

**Bằng chứng đóng góp:**

- [PR #47 – Profile UI (Task 14)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/47)
- [PR #57 – Task 18: kết nối TDEE & store](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/57)
- [PR #60 – Task 20: Dashboard real data](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/60)
- [PR #76 – UI improvements & bug fixes](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/76)

**Khó khăn gặp phải:**

Phần lớn code UI được viết với sự hỗ trợ của AI — bản thân hiểu logic ở mức cơ bản nhưng chưa thực sự nắm sâu từng phần. Việc debug khi có lỗi props giữa Dashboard và Store mất khá nhiều thời gian vì chưa quen với Zustand.

**Đánh giá bản thân:** 7/10

---

## Task 3 — Database Integration

**Tuần:** Tuần 2–3, ngày 17/05 – 19/05/2026

**Công việc đã làm:**

- Tìm hiểu Prisma ORM và Supabase từ đầu — trước dự án chưa có kinh nghiệm với hai công nghệ này
- Cài đặt Prisma, kết nối Supabase, chọn phiên bản thư viện phù hợp cho nhóm (commit c8a525f)
- Chuyển đổi dữ liệu từ Database tĩnh (JSON) sang Database động với Prisma (commit 43ed13a)
- Xây dựng API routes cho meals, users, ingredients (commits a3351ae, e04334b, 4236e93)
- Fix lỗi static render: thêm `force-dynamic` vào các file `route.ts` (commits 2fa4fdb, d85a01c)
- Fix `postinstall prisma generate` để Vercel generate client đúng lúc (commit 6bfeabd)
- Review và approve PR #93 (fix timezone bug trong streak — do thành viên khác phát hiện và implement)

**Bằng chứng đóng góp:**

- [PR #91 – Chuyển DB tĩnh sang động](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/91)
- [PR #97 – Prisma API setup](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/97)
- [PR #99 – API database v2 (final)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/99)

**Khó khăn gặp phải:**

Đây là phần khó nhất với bản thân. Chưa biết Prisma và Supabase từ trước nên phần lớn được thực hiện dựa trên AI và tài liệu — mức độ hiểu thực sự còn hạn chế.

Giai đoạn deploy lên Vercel gặp nhiều lỗi liên tiếp và mất nhiều thời gian hơn dự kiến. Một phần vì chưa hiểu rõ nguyên nhân từng lỗi, một phần vì phải phụ thuộc vào tài khoản Vercel của thành viên khác để deploy và test — mỗi lần sửa đều phải chờ người kia thực hiện.

**Đánh giá bản thân:** 7/10

---

## Task 4 — Optimization

**Tuần:** Tuần 2, ngày 10/05 – 11/05/2026

**Công việc đã làm:**

- Hoàn thành Task 25: tối ưu Lighthouse score đạt trên 75 (commit 78bb0e2)
- Áp dụng Lazy loading với `next/dynamic` cho Modal và Biểu đồ
- Thêm `aria-label` cho các interactive elements để cải thiện Accessibility
- Thêm `useMemo` và `useCallback` ở một số component
- Cấu hình Cache Headers trong `next.config.ts`
- Hoàn thành Task 23: Responsive UI cho Dashboard trên Mobile và Tablet (commit 8ef7d6d)
- Fix thuộc tính `id` bị thiếu trong hàm `searchIngredient` (commit ae59f20)

**Bằng chứng đóng góp:**

- [PR #71 – Task 25 Performance optimization](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/71)
- [PR #65 – Task 23 Responsive UI](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/65)
- [PR #64 – Fix search ingredient id](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/64)

**Khó khăn gặp phải:**

Các bước tối ưu chủ yếu thực hiện theo hướng dẫn của AI và tài liệu Next.js — hiểu được mục đích từng bước nhưng chưa nắm chắc lý do kỹ thuật phía sau. `optimizeCss` gây lỗi build không rõ nguyên nhân và mất thêm thời gian xử lý.

**Đánh giá bản thân:** 7/10

---

## Task 5 — Peer Review

**Tuần:** Tuần 3, ngày 17/05 – 19/05/2026

**Công việc đã làm:**

- Review code nội bộ với tư cách reviewer (indominusrex932005-arch): approve và merge PR #59, #65, #68, #69, #71, #72, #76, #81, #93, #99
- Peer review nhóm hothong3k/QuickToDo: đọc source code và tạo issue phản hồi về UX

**Nội dung feedback gửi cho nhóm hothong3k/QuickToDo:**

Issue: *"Missing delete confirmation dialog and undo feature"*

Mô tả: Khi người dùng nhấn nút xóa todo, item bị xóa ngay lập tức mà không có hộp thoại xác nhận hay tính năng Undo. Điều này có thể gây mất dữ liệu nếu người dùng nhấn nhầm — đặc biệt với các todo đã có mô tả chi tiết, nhiều subtask và ngày hết hạn.

**Bằng chứng đóng góp:**

- [Issue peer review gửi cho nhóm hothong3k/QuickToDo](https://github.com/hothong3k/QuickToDo/issues)
- [Lịch sử merge PR nội bộ (reviewer: indominusrex932005-arch)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pulls?q=is%3Apr+is%3Amerged)

**Khó khăn gặp phải:**

Việc review code của nhóm khác không quá khó vì chỉ cần đọc hiểu và nhận xét — phần này làm được ổn hơn so với các task code.

**Đánh giá bản thân:** 8/10

---

## Tổng Kết Đóng Góp Cá Nhân

**Tóm tắt những gì bạn đã đóng góp cho dự án:**

Tôi đóng góp chủ yếu ở phần database integration và một số phần UI. Hầu hết code được viết với sự hỗ trợ lớn từ AI và tài liệu — bản thân hiểu được luồng hoạt động ở mức tổng quan nhưng chưa nắm sâu từng chi tiết kỹ thuật. Phần tốn thời gian nhất là giai đoạn deploy Prisma lên Vercel do phụ thuộc vào môi trường của thành viên khác và chưa thực sự quen với các lỗi build. Qua dự án, tôi có thêm hiểu biết cơ bản về Prisma, Supabase và quy trình làm việc nhóm qua GitHub — dù vẫn còn nhiều thứ cần học thêm.

**Ước tính % đóng góp so với cả nhóm:** ~25%

**Điểm tự đánh giá tổng thể:** 7/10
