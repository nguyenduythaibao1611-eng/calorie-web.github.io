## Thông tin cá nhân

| | |
|---|---|
| **Họ tên** | Hoàng Triều |
| **MSSV** | 24020012 |
| **Nhóm** | CaloMate |
| **Vai trò trong nhóm** | Full-stack Developer |

---

## Task 1 — Planning & Setup

**Tuần:** Tuần 1–2, ngày 08/05 – 19/05

**Công việc đã làm:**

- Thiết kế database schema với Prisma (User, Meal, Ingredient, MealIngredient models)
- Cấu hình PostgreSQL connection và environment variables (DATABASE_URL, DIRECT_URL)
- Setup API routes cơ bản (/api/users, /api/meals, /api/ingredients)
- Thiết kế structure store management (useProfileStore, useDiaryStore)
- Cấu hình TypeScript strict mode và ESLint

**Bằng chứng đóng góp:**

- Commits: `49d0b16` (add profile store), `90fc640` (add diary store), `5499a1d` (add ingredients data)
- PR: #12 (profile store), #13 (diary store)
- Database schema: `prisma/schema.prisma`
- API routes: `app/api/users/route.ts`, `app/api/meals/route.ts`, `app/api/ingredients/route.ts`

**Khó khăn gặp phải:**

- Sync localStorage + Zustand store architecture, giải quyết bằng cách thiết kế abstraction layer (`lib/storage.ts`)
- Prisma relations setup cho MealIngredient trung gian

**Đánh giá bản thân:** 8/10

---

## Task 2 — UI Implementation

**Tuần:** Tuần 1–2, ngày 08/05 – 16/05

**Công việc đã làm:**

- Implement ingredient search system: modal search, filter, real-time query
- Add ingredients database JSON: 15+ Vietnamese dishes with macro data
- Integrate search vào Diary UI
- Implement stats page real data integration (calories tracking, macro distribution)
- Thêm animations cho stats page (Framer Motion)

**Bằng chứng đóng góp:**

- Commits: `24cac34` (ingredient search system), `cf72f4c` (update ingredients database), `ce56975` (add ingredients database), `4349cdb` (stats real data integration #21), `f50b6c5` (feat: add animations), `9f7ec73` (add animation for stats page)
- PR: #8 (ingredient search), #21 (stats real data)
- Files: `components/diary/AddMealModalV2.tsx`, `lib/ingredients.json`, `components/stats/WeeklyChart.tsx`

**Khó khăn gặp phải:**

- Tối ưu search performance với large ingredient list
- Integration real data từ store vào chart components (Recharts)

**Đánh giá bản thân:** 7/10

---

## Task 3 — Database Integration

**Tuần:** Tuần 2, ngày 08/05 – 10/05

**Công việc đã làm:**

- Setup Prisma client (`lib/prisma.ts`) với connection pooling
- Implement API GET /api/meals?userId=xxx&date=xxx lấy meals theo ngày
- Implement API POST /api/meals, GET /api/users?email=xxx, POST /api/users (upsert)
- Thêm dynamic routing /api/meals/[id] cho individual meal
- Database seeding setup trong `prisma/seed.ts`

**Bằng chứng đóng góp:**

- Commits: `2d98a47` (setup tracking & logging tools - có database config)
- API routes documentation: `TRACKING_API_REFERENCE.md`
- Files: `app/api/meals/route.ts`, `app/api/users/route.ts`, `app/api/ingredients/route.ts`, `app/api/meals/[id]/route.ts`

**Khó khăn gặp phải:**

- Prisma query optimization cho joins (Meal + MealIngredient + Ingredient)
- Environment variable configuration cho production

**Đánh giá bản thân:** 7/10

---

## Task 4 — Optimization

**Tuần:** Tuần 2–3, ngày 16/05 – 19/05

**Công việc đã làm:**

- Setup tracking & logging tools: Google Analytics (gtag.js), Sentry error tracking, custom logger
- Implement analytics wrapper (`lib/analytics.ts`): trackEvent(), trackPageView(), setUserProperties()
- Implement Sentry configuration (`lib/sentry.config.ts`) với error tracking + performance monitoring
- Setup custom logger (`lib/logging.ts`) với levels: debug, info, warn, error
- Implement AnalyticsProvider component cho automatic page tracking
- Implement tracking hooks (`lib/tracking-hooks.ts`): usePageTime(), useFeatureTracking()
- Environment setup với .env.local templates

**Bằng chứng đóng góp:**

- Commits: `e9f895f` (setup tracking & logging tools), `2d98a47` (setup tracking & logging tools)
- Files: `lib/analytics.ts`, `lib/sentry.config.ts`, `lib/logging.ts`, `lib/tracking-hooks.ts`, `components/providers/AnalyticsProvider.tsx`
- Documentation: `TRACKING_SETUP.md`, `TRACKING_API_REFERENCE.md`, `TRACKING_IMPLEMENTATION_SUMMARY.md`

**Khó khăn gặp phải:**

- Cấu hình Sentry sample rates cho production vs development
- Integrating gtag script vào Next.js 16 App Router architecture

**Đánh giá bản thân:** 8/10

---

## Task 5 — Peer Review

**Tuần:** Tuần 2–3, ngày 10/05 – 19/05

**Công việc đã làm:**

- Review code của team members, cộng tác trên issues #8, #12, #13, #21
- Merge branches vào main, giải quyết merge conflicts
- Update documentation để reflect codebase hiện tại
- Commit `394a9b8` (update docs) - cập nhật README & docs theo code changes

**Bằng chứng đóng góp:**

- Merge commits: `e1a5a7b`, `b9acc1e` (merge team branches)
- Commit: `394a9b8` (update docs)
- Collaboration trên shared branches

**Khó khăn gặp phải:**

- Conflicting changes khi merge từ multiple branches
- Keeping documentation in sync với rapid code changes

**Đánh giá bản thân:** 7/10

---

## Tổng Kết Đóng Góp Cá Nhân

Tôi đã đóng góp vào CaloMate project bằng cách thiết kế và implement core infrastructure của ứng dụng:

1. **Database & API Layer**: Thiết kế Prisma schema với PostgreSQL, implement 6 API endpoints, setup ORM configuration
2. **State Management**: Design Zustand stores (useProfileStore, useDiaryStore) với localStorage persistence
3. **Search & Data Features**: Implement ingredient search system, manage 15+ Vietnamese dish database, integrate real data vào stats page
4. **Tracking & Monitoring**: Setup Google Analytics, Sentry error tracking, custom logger - foundation cho production monitoring
5. **Animations & UX**: Thêm Framer Motion animations cho stats page, improve user experience

Những phần tôi tự hào nhất là database architecture (clean Prisma schema), tracking/logging infrastructure (production-ready setup), và ingredient search system (real-time filtering). Qua dự án này, tôi học được cách thiết kế scalable backend architecture, optimize Next.js performance, và integrate monitoring tools cho production apps.

**Ước tính % đóng góp so với cả nhóm:** ~10 - 15%

**Điểm tự đánh giá tổng thể:** 7/10