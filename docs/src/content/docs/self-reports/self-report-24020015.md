# Self-Report — Nguyen Duy Thai Bao

## Personal Information

| | |
|---|---|
| **Full Name** | Nguyen Duy Thai Bao |
| **Student ID** | 24020015 |
| **Team** | CaloMate |
| **Role in Team** | Leader |
| **GitHub** | [nguyenduythaibao1611-eng](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io) |

---

## Task 1 — Planning & Setup

**Week:** Week 1, May 1–8, 2026

**Work completed:**

- **Ideation & core feature definition** for the CaloMate app: daily calorie tracking, macro-nutrient tracking (Protein, Carbs, Fat), streak feature, nutrition dashboard, stats page, user profile management.
- **Selected the tech stack** for the entire team: Next.js 15, React 19, TypeScript strict mode, Tailwind CSS v4, Zustand, Recharts, Framer Motion, Prisma ORM + Supabase.
- **Initialized the Next.js project**, set up the folder structure (`app`, `components`, `lib`, `store`, `types`), configured `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.
- **Established the Git workflow** for the team: branch naming convention, commit message convention.
- **Wrote documentation**: `README.md` and `AGENTS.md` (coding conventions).
- **Defined TypeScript interfaces**: `UserProfile`, `MacroTarget`, `Ingredient`, `MealEntry`, `DailyLog`.
- **Built the localStorage abstraction layer**: `getProfile`, `saveProfile`, `getLog`, `saveLog`, `getLogs`.
- **Designed wireframes** for the main pages: Homepage/Dashboard, Diary/Food Log, Stats/Progress, Settings/Profile.
- **Analyzed requirements** and defined user stories and acceptance criteria for the main features.

**Evidence of contribution (Commits):**

| Commit | Description |
|--------|-------------|
| [`9e8fd83`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/9e8fd83) | `initial commit` |
| [`be61f61`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/be61f61) | `setup: initialize Next.js project with Tailwind, TypeScript and setup project structure (app, components, lib, store, types)` |
| [`8a7bb38`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8a7bb38) | `add UserProfile, MacroTarget, Ingredient, MealEntry, DailyLog + add localStorage layer - getProfile, saveProfile, getLog, saveLog, getLogs` |
| [`d6cc0db`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d6cc0db) | `update file readme` |
| [`86f80d7`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/86f80d7) | `update file docs` |
| [`3332bca`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/3332bca) | `update file docs` |
| [`5848826`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/5848826) | `update file docs` |

**Difficulties encountered:**

- Balancing a modern tech stack (Next.js 15, React 19) with an appropriate difficulty level so all team members could contribute effectively.
- Reaching consensus with the entire team on design patterns and code structure before starting development.
- Deciding on a data structure and database schema appropriate for the project requirements.

**Self-assessment:** 8/10

---

## Task 2 — UI Implementation

**Week:** Weeks 2–3, May 8–20, 2026

**Work completed:**

- **Set up layout files** for the entire app (`app/page.tsx`, layout files).
- **Built the Root Page** (`app/page.tsx`) — automatic routing page: if profile exists → `/dashboard`, otherwise → `/homepage`.
- **Connected the Diary page** with real data from `diaryStore`.
- **Synchronized the overview and diary pages**, created a settings button.
- **Synchronized the Stats page** with real data.
- **Updated the Dashboard UI** (dashboard layout).
- **Built the Homepage** (`app/homepage/page.tsx`) — landing page with hero section, features, stats, CTA, and footer. *(Completed instructor feedback: required to create a Homepage)*
- **Fixed Homepage workflow**: added navigation logic for the "Get started with CaloMate" and "Get started" nav buttons — checks localStorage; first-time users → `/setup`, returning users → `/dashboard`.
- **Synchronized add-meal modal data**: passed `existingIngredients` to `AddMealModalV2` to display previously saved items when the modal is reopened.
- **Redesigned the Dashboard** — improved layout, added macro progress percentage display, adjusted water glass sizing for better multi-device responsiveness. *(Completed instructor feedback: required to update the Dashboard)*
- **Added date range selection feature on the Stats page** — supports viewing by Week / Month / Custom with an integrated date range picker and mini calendar. *(Completed instructor feedback: required to add range selector on Stats page)*
- **Integrated Google Analytics** into the project to track user visits.
- **Integrated Sentry** for runtime error tracking on production.

**Evidence of contribution (Commits):**

| Commit | Date | Description |
|--------|------|-------------|
| [`d990022`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d990022) | May 9 | `setup file layout` |
| [`d8dbad8`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d8dbad8) | May 9 | `setup file layout` |
| [`1202d68`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/1202d68) | May 9 | `feat: connect diary with real data` |
| [`dbbe44d`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/dbbe44d) | May 10 | `Sync overview page and diary page. Create settings button` |
| [`d49205e`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d49205e) | May 11 | `Sync stats page` |
| [`d1401f3`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d1401f3) | May 10 | `Update dashboard page` |
| [`ea2063c`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/ea2063c) | May 17 | `homepage` |
| [`40a82ef`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/40a82ef) | May 18 | `homepage` |
| [`60e85ce`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/60e85ce) | May 18 | `homepage` |
| [`5bb81de`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/5bb81de) | May 19 | `Fix web workflow - sync add meal data` |
| [`98d189f`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/98d189f) | May 19 | `Fix web workflow - sync add meal data` |
| [`beb4f22`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/beb4f22) | May 19 | `Fix web workflow - sync add meal data` |
| [`8e04bd9`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8e04bd9) | May 13 | `Update Readme` |
| [`74c7bf6`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/74c7bf6) | May 19 | `Fix UI for overview and diary pages` |
| [`cf5c0eb`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/cf5c0eb) | May 19 | `Fix date display and add weekly/monthly/custom stats feature` |
| [`8742aba`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8742aba) | May 20 | `Fix date display and add percentage` |
| [`8e89cd8`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8e89cd8) | May 19 | `Integrate Google Analytics link` |
| [`3655480`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/3655480) | May 19 | `Integrate Google Analytics link` |
| [`0f5ef5d`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/0f5ef5d) | May 19 | `Integrate Google Analytics link` |
| [`6cb1193`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/6cb1193) | May 20 | `Integrate Sentry link` |

**Pull Requests created/merged:** PR #48, #51, #52, #55, #56, #62, #66, #67, #94, #120, #122, #124, #125, #126

**Difficulties encountered:**

- **Hydration mismatch** between server and client when using localStorage with Zustand — resolved using `queueMicrotask` and an `isMounted` flag.
- **Merge conflict** when pulling `main` into the `fixbug/homepage-workflow` branch — manually resolved in `app/page.tsx`.
- **Building the date range picker from scratch** with a mini calendar, hover range preview, and preset shortcuts — required handling many edge cases around date boundaries.

**Self-assessment:** 9/10

---

## Task 3 — Database Integration

**Week:** Weeks 2–3, May 9–19, 2026

**Work completed:**

- **Connected real data to the UI**: connected the diary page with data from `diaryStore` (commit `1202d68`).
- **Reviewed and merged database-related PRs** in the role of Leader: PR #94, #97, #99.
- **Ensured the UI did not break** during the transition between the existing localStorage layer and the newly integrated Prisma API.

- **Direct Prisma/Supabase integration (schema design, API routes)** was handled by another team member.

**Evidence of contribution (Commits & PRs):**

| Evidence | Description |
|----------|-------------|
| [`1202d68`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/1202d68) | `feat: connect diary with real data` |

**Difficulties encountered:**

- Coordinating between the existing localStorage layer and the newly integrated Prisma API — ensuring the UI did not break during the transition.

**Self-assessment:** 7/10

---

## Task 4 — Optimization & Quality Assurance

**Week:** Week 3, May 10–20, 2026

**Work completed:**

- **Configured `next.config.ts`**: enabled `optimizeCss`, removed `console.log` in production, added security headers, configured image optimization (avif/webp).
- **Fixed TypeScript build error**: removed `"ignoreDeprecations": "6.0"` from `tsconfig.json` (value not supported by TypeScript).
- **Fixed merge conflict in `app/page.tsx`** that was causing a build failure.
- **Ran `npm run build`** to detect and resolve compilation errors — ensured zero TypeScript errors.
- **Verified successful build result**:
  - ✓ Compiled successfully in 2.8s
  - ✓ Finished TypeScript in 4.5s
  - ✓ Generated 10/10 static pages prerendered
  - ✓ Exit Code: 0
- **Reviewed and merged the performance optimization PR** from a team member (Task 25 — lazy load, Lighthouse > 75) — PR #71.
- **Integrated Google Analytics & Sentry** for production monitoring and error tracking.

**Evidence of contribution (Commits):**

| Commit | Date | Description |
|--------|------|-------------|
| [`80a9f37`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/80a9f37) | May 19 | `fix: resolve merge conflict` |
| [`8e89cd8`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8e89cd8) | May 19 | `Integrate Google Analytics link` |
| [`6cb1193`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/6cb1193) | May 20 | `Integrate Sentry link` |
| `next.config.ts` | — | Compiler options, security headers, image config (avif/webp) |
| Merge PR #71 | May 11 | Task 25 — performance optimization (lazy load, Lighthouse > 75) |

**Active branch:** `fixbug/homepage-workflow` (pushed to origin)

**Difficulties encountered:**

- `Invalid value for '--ignoreDeprecations'` error during build because the TypeScript version did not support the value `"6.0"` — fixed by removing that line from `tsconfig.json`.
- Next.js build process using worker threads made error messages unclear at times.

**Self-assessment:** 7/10

---

## Task 5 — Peer Review & Collaboration

**Week:** Week 3, May 15–20, 2026

**Work completed:**

- **Optimized the team's development workflow (Git Workflow)**: directly resolved complex merge conflicts, merged branches, and established a safe code-merging mechanism.
- **Reviewed and approved PRs** from team members (in the role of Leader): PR #71, #84, #87, #93, #94, #97, #99, #100, #101, #120, #121, #122, #123, #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134, #135.
- **Opened a new GitHub Issue for the WindToDo team** to propose the next feature: [[Feature] Add "Export" button to Statistics page #58](https://github.com/TonyLikeDev/WindTodo-V1/issues/58) — with a clear problem description, steps to reproduce, expected behavior, and a detailed suggested implementation (client-side CSV export, using the lucide-react Download icon, handling lint errors simultaneously).
- **Addressed and completed all instructor feedback**:
  - ✅ Created the Homepage with full landing page sections (hero, features, stats, CTA, footer).
  - ✅ Redesigned the Dashboard — improved layout, added macro progress percentage, optimized responsiveness.
  - ✅ Added date range selection feature on the Stats page — supports Week / Month / Custom views.
- **Updated project documentation**: README, AGENTS.md, self-report.

**Evidence of contribution:**

| Evidence | Description |
|----------|-------------|
| [`728da27`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/728da27) | `Merge branch 'main' into fixbug/homepage-workflow` |
| [`80a9f37`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/80a9f37) | `fix: resolve merge conflict` |
| [`cf5c0eb`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/cf5c0eb) | `Fix date display and add weekly/monthly/custom stats feature` *(instructor feedback)* |
| [`74c7bf6`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/74c7bf6) | `Fix UI for overview and diary pages` *(instructor feedback)* |
| [`60e85ce`](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/60e85ce) | `homepage` *(instructor feedback)* |
| GitHub Issue #58 | [[Feature] Add "Export" button to Statistics page](https://github.com/TonyLikeDev/WindTodo-V1/issues/58) — full problem description, expected behavior, and suggested implementation |
| Merged PRs | #71, #84, #87, #93, #94, #97, #99, #100, #101, #120–#135 |

**Difficulties encountered:**

- Integrating code from multiple parallel development branches required careful review to resolve conflicts without disrupting the team's overall progress.
- Addressing instructor feedback under time pressure required effective prioritization and task redistribution.

**Self-assessment:** 9/10

---

## Contribution Summary

| Task | Main Content | Status | Score |
|------|-------------|--------|-------|
| Task 1 — Planning & Setup | Project initialization, tech stack, TypeScript types, localStorage layer, Git workflow | ✓ Completed | 8/10 |
| Task 2 — UI Implementation | Root page routing, Diary sync, Dashboard, Stats, Homepage, workflow fix, range picker, GA, Sentry | ✓ Completed | 9/10 |
| Task 3 — Database Integration | Connected UI with real data, merged & reviewed database PRs | ✓ Completed | 6/10 |
| Task 4 — Optimization | next.config.ts, TypeScript build fix, merge conflict fix, build verification, GA & Sentry | ✓ Completed | 7/10 |
| Task 5 — Peer Review | Git workflow, PR reviews (#71–#135), GitHub issue #58, instructor feedback, documentation | ✓ Completed | 9/10 |
| **Overall** | | ✓ Completed | **7.8/10** |

---

## Personal Contribution Summary

**Summary of contributions:**

As the Leader of CaloMate, I was responsible from ideation, tech stack selection (Next.js 15, React 19, TypeScript, Zustand), to initializing the entire project structure and setting up the Git workflow for the team. On the UI side, I designed the basic UI using Stitch, built the automatic onboarding workflow (routing first-time users to ProfileForm, returning users to Dashboard), synchronized all main pages (overview, diary, stats), and completed the Homepage with a full landing page layout. I also completed all instructor feedback items: creating the Homepage, redesigning the Dashboard with macro progress percentages, and adding a date range selection feature (week/month/custom) on the Stats page. Additionally, I integrated Google Analytics and Sentry for production monitoring, and resolved key technical issues including hydration mismatch with Zustand, TypeScript build errors, and merge conflicts. The part I am most proud of is the overall architecture of the project, the localStorage abstraction layer, and keeping the codebase building successfully throughout the entire development process.

**Estimated % contribution relative to the team:** ~25%

**Overall self-assessment score:** 8/10

---

## Technical Notes

- **Final build status:** ✓ Compiled successfully — 10/10 static routes prerendered — Exit Code: 0
- **Repository:** https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io
- **All TypeScript errors have been fully resolved**
- **Development server ready** with `npm run dev`
- **Google Analytics & Sentry** integrated and active on production