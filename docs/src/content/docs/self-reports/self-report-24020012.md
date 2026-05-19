---
title: "Personal Contribution Report - Hoàng Triều"
description: "Detailed contribution report for Full-stack Developer role (Database, API, State Management, and Tracking) in the CaloMate project."
---

## Personal Information

| | |
|---|---|
| **Full Name** | Hoàng Triều |
| **Student ID** | 24020012 |
| **Team** | CaloMate |
| **Role** | Full-stack Developer |

---

## Task 1 — Planning & Setup

**Week:** Week 1–2, May 08 – May 19

**Work Done:**
- Designed database schema with Prisma (User, Meal, Ingredient, MealIngredient models)
- Configured PostgreSQL connection and environment variables (DATABASE_URL, DIRECT_URL)
- Set up basic API routes (/api/users, /api/meals, /api/ingredients)
- Designed store management structure (useProfileStore, useDiaryStore)
- Configured TypeScript strict mode and ESLint

**Evidence:**
- Commits: `49d0b16` (add profile store), `90fc640` (add diary store), `5499a1d` (add ingredients data)
- PRs: #12 (profile store), #13 (diary store)
- Database schema: `prisma/schema.prisma`
- API routes: `app/api/users/route.ts`, `app/api/meals/route.ts`, `app/api/ingredients/route.ts`

**Challenges:**
- Syncing localStorage + Zustand store architecture, resolved by designing an abstraction layer (`lib/storage.ts`)
- Setting up Prisma relations for the MealIngredient junction table

**Self-assessment:** 8/10

---

## Task 2 — UI Implementation

**Week:** Week 1–2, May 08 – May 16

**Work Done:**
- Implemented ingredient search system: modal search, filtering, real-time query
- Added ingredients database JSON: 15+ Vietnamese dishes with macro data
- Integrated search into Diary UI
- Implemented stats page real data integration (calories tracking, macro distribution)
- Added animations to stats page (Framer Motion)

**Evidence:**
- Commits: `24cac34` (ingredient search system), `cf72f4c` (update ingredients database), `ce56975` (add ingredients database), `4349cdb` (stats real data integration #21), `f50b6c5` (feat: add animations), `9f7ec73` (add animation for stats page)
- PRs: #8 (ingredient search), #21 (stats real data)
- Files: `components/diary/AddMealModalV2.tsx`, `lib/ingredients.json`, `components/stats/WeeklyChart.tsx`

**Challenges:**
- Optimizing search performance with a large ingredient list
- Integrating real data from store into chart components (Recharts)

**Self-assessment:** 7/10

---

## Task 3 — Database Integration

**Week:** Week 2, May 08 – May 10

**Work Done:**
- Set up Prisma client (`lib/prisma.ts`) with connection pooling
- Implemented API GET `/api/meals?userId=xxx&date=xxx` to fetch meals by date
- Implemented API POST `/api/meals`, GET `/api/users?email=xxx`, POST `/api/users` (upsert)
- Added dynamic routing `/api/meals/[id]` for individual meal operations
- Set up database seeding in `prisma/seed.ts`

**Evidence:**
- Commits: `2d98a47` (setup tracking & logging tools - includes database config)
- API routes documentation: `TRACKING_API_REFERENCE.md`
- Files: `app/api/meals/route.ts`, `app/api/users/route.ts`, `app/api/ingredients/route.ts`, `app/api/meals/[id]/route.ts`

**Challenges:**
- Optimizing Prisma queries for joins (Meal + MealIngredient + Ingredient)
- Configuring environment variables for production deployment

**Self-assessment:** 7/10

---

## Task 4 — Optimization

**Week:** Week 2–3, May 16 – May 19

**Work Done:**
- Set up tracking & logging tools: Google Analytics (gtag.js), Sentry error tracking, custom logger
- Implemented analytics wrapper (`lib/analytics.ts`): `trackEvent()`, `trackPageView()`, `setUserProperties()`
- Implemented Sentry configuration (`lib/sentry.config.ts`) with error tracking + performance monitoring
- Set up custom logger (`lib/logging.ts`) with levels: debug, info, warn, error
- Implemented AnalyticsProvider component for automatic page tracking
- Implemented tracking hooks (`lib/tracking-hooks.ts`): `usePageTime()`, `useFeatureTracking()`
- Set up environment configuration with .env.local templates

**Evidence:**
- Commits: `e9f895f` (setup tracking & logging tools), `2d98a47` (setup tracking & logging tools)
- Files: `lib/analytics.ts`, `lib/sentry.config.ts`, `lib/logging.ts`, `lib/tracking-hooks.ts`, `components/providers/AnalyticsProvider.tsx`
- Documentation: `TRACKING_SETUP.md`, `TRACKING_API_REFERENCE.md`, `TRACKING_IMPLEMENTATION_SUMMARY.md`

**Challenges:**
- Configuring Sentry sample rates for production vs development environments
- Integrating gtag script into Next.js 16 App Router architecture

**Self-assessment:** 8/10

---

## Task 5 — Peer Review

**Week:** Week 2–3, May 10 – May 19

**Work Done:**
- Reviewed code from team members, collaborated on issues #8, #12, #13, #21
- Merged branches into main, resolved merge conflicts
- Updated documentation to reflect current codebase
- Commit `394a9b8` (update docs) — updated README & docs to match code changes

**Evidence:**
- Merge commits: `e1a5a7b`, `b9acc1e` (merging team branches)
- Commit: `394a9b8` (update docs)
- Collaboration on shared branches

**Challenges:**
- Handling conflicting changes when merging from multiple branches
- Keeping documentation in sync with rapid code changes

**Self-assessment:** 7/10

---

## Personal Contribution Summary

I contributed to the CaloMate project by designing and implementing the core infrastructure of the application:

1. **Database & API Layer**: Designed Prisma schema with PostgreSQL, implemented 6 API endpoints, configured ORM
2. **State Management**: Designed Zustand stores (useProfileStore, useDiaryStore) with localStorage persistence
3. **Search & Data Features**: Implemented ingredient search system, managed 15+ Vietnamese dish database, integrated real data into stats page
4. **Tracking & Monitoring**: Set up Google Analytics, Sentry error tracking, custom logger — foundation for production monitoring
5. **Animations & UX**: Added Framer Motion animations to stats page, improved overall user experience

The parts I am most proud of are the database architecture (clean Prisma schema), tracking/logging infrastructure (production-ready setup), and ingredient search system (real-time filtering). Through this project, I learned how to design scalable backend architecture, optimize Next.js performance, and integrate monitoring tools for production applications.

**Estimated contribution compared to the whole team:** ~10–15%

**Overall self-assessment:** 7/10