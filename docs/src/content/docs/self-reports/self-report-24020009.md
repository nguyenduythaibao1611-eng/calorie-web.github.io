---
title: "Personal Contribution Report - Từ Văn Huy Hoàng"
description: "Detailed contribution report for Full-stack Developer & Core Tech Lead role in the CaloMate project."
---

<a href="/downloads/final-project-self-report-template.md" download="final-project-self-report-template.md">Download template (.md)</a>

---

## Personal Information

| | |
|---|---|
| **Full Name** | Từ Văn Huy Hoàng |
| **Student ID** | 24020009 |
| **Team** | CaloMate |
| **Role in Team** | Full-stack Developer & Core Tech Lead |

---

## Task 1 — Planning & Setup

**Week:** Week 1 (May 1–8, 2026)

**Work completed:**
- **Designed & implemented the core Nutrition Calculation Module (`lib/calc.ts`):** Programmed algorithms to automatically calculate users' daily energy needs using the Mifflin-St Jeor formula (computing BMR, TDEE, and automatically setting Calorie, Protein, Carbs, and Fat targets based on the user's weight loss/gain/maintenance goal).
- **Built the core shared UI Components system (`components/ui/`):** Designed a library of highly reusable basic interface components including Button, Card, Input, Modal, ProgressBar, Badge, and BottomNav.
- **Implemented the Bottom Navigation system (`components/nav/BottomNav.tsx`):** Developed the bottom navigation bar linking the main pages: Dashboard (`/`), Diary (`/diary`), and Stats (`/stats`).

**Evidence of contribution:**
- Commits:
  - [b2162de](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/b2162de) - `feat: implement calorie & macro calculation (issue #7)`
  - [152615c](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/152615c) - `feat: add reusable UI components (issue #9)`
  - [060c166](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/060c166) - `feat: implement bottom navigation (issue #10)`

**Difficulties encountered:**
- Designing the TypeScript type system (`types/index.ts`) that was flexible enough to cover a wide variety of daily meals while ensuring absolute state consistency when syncing the Store.

**Self-assessment:** 8/10

---

## Task 2 — UI Implementation

**Week:** Week 2 (May 9–15, 2026)

**Work completed:**
- **Built & optimized the ingredient search algorithm (`lib/search.ts`):** Implemented a Vietnamese string normalization mechanism (removing diacritics and special characters) combined with a scoring and ranking algorithm to deliver a fast and accurate search experience across 15+ popular Vietnamese dishes.
- **Completed & enhanced the Food Diary page UI/UX (`app/diary/page.tsx`):** Programmed the 4-meal (main/snack) interface, added a feature to merge duplicate food items (automatically accumulating gram weight and updating calorie/nutrition totals), improved the food selector, and integrated an intuitive delete functionality.
- **Optimizations and display bug fixes:** Fixed JSX syntax errors, CSS attributes, and integrated the Framer Motion library to create smooth animations for `motion.button` elements on the Diary page.

**Evidence of contribution:**
- Commits:
  - [4d18754](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/4d18754) - `feat: improve search with scoring and ranking (#22)`
  - [8cf3790](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/8cf3790) - `fix: allow merging multiple food items together`
  - [6a0bdb1](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/6a0bdb1) - `fix food item selection method, and add food item deletion feature`
  - [4be543f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/4be543f) - `fix: resolve JSX syntax and motion.button tag errors on diary page`
  - [215e68f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/215e68f) - `feat: fix string`

**Difficulties encountered:**
- Handling the merging of identically named ingredients and recalculating the meal's total calorie count in real time required meticulous nested state management in Zustand to avoid data sync errors or unnecessary re-renders.

**Self-assessment:** 8/10

---

## Task 3 — Database Integration

**Week:** Week 3 (May 16–17, 2026)

**Work completed:**
- **Developed the goal-streak synchronization mechanism (`syncStreak`):** Designed and programmed the `calculateAndUpdateStreak` function to automatically scan historical diary log data, evaluate completion conditions (having all 3 main meals — Breakfast, Lunch, Dinner — in a day), and count and sync the user's actual Streak.
- **Integrated global state synchronization:** Synchronized Streak data, nutritional goals, and food diary entries directly across the main pages via Zustand Store (`profileStore.ts` & `diaryStore.ts`).
- **Built an Offline-first Storage Layer:** Maximized use of `localStorage` through an automatic state sync and restore mechanism (Zustand persist helper), ensuring the app runs smoothly offline without risk of data loss.

**Evidence of contribution:**
- Commits:
  - [7e4aa99](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/7e4aa99) - `PR #1: done (also added syncStreak feature to synchronize all streaks together)`

**Difficulties encountered:**
- Continuously syncing the Streak required precise coordination between two independent Stores (`profileStore` managing profile/streak info and `diaryStore` managing meal logs) without causing conflicts or data inconsistency when users navigate between pages frequently.

**Self-assessment:** 8/10

---

## Task 4 — Optimization

**Week:** Week 3 (May 16–17, 2026)

**Work completed:**
- **Optimized the team's development workflow (Git Workflow):** Directly resolved complex code merge conflicts, merged the `fix-workflow` branch, and established a safe automatic code-merging mechanism that takes all incoming changes.
- **Improved code quality:** Thoroughly fixed recurring JSX and TypeScript syntax errors (fix round 3) to ensure the entire project builds and runs stably.
- **Finalized technical documentation:** Updated the complete project documentation file (`docs/src/content/docs/index.mdx`) with detailed descriptions of the Store architecture, database structure, and application data flow diagrams.

**Evidence of contribution:**
- Commits:
  - [1fae67f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/1fae67f) - `merge: merge fix-workflow and automatically take all incoming changes`
  - [0d8251f](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/0d8251f) - `fix round 3`
  - [54477af](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/54477af) - `fix round 3 (non-diacritic conversion)`
  - [d67b282](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/commit/d67b282) - `update docs file`

**Difficulties encountered:**
- Integrating and merging code from multiple parallel development branches required careful review to definitively resolve conflicts in file structure and library versions without disrupting the team's overall progress.

**Self-assessment:** 8/10

---

## Task 5 — Peer Review

**Week:** Week 3 (May 16–17, 2026)

**Work completed:**
- Cross-team peer review activity has not yet been carried out. This section will be updated once task assignments are received from the instructor.

**Evidence of contribution:**
- *(Not yet available — will be updated later)*

**Difficulties encountered:**
- *(Not yet available — will be updated later)*

**Self-assessment:** 8/10

---

## Personal Contribution Summary

**Summary of contributions to the project:**
In the CaloMate project, I am proud to have taken on the role of Full-stack Developer and Core Tech Lead for the team. I successfully designed and built the automatic Mifflin-St Jeor nutrition calculator, developed the core shared UI Components system, created the intelligent Vietnamese food search algorithm (Vietnamese normalization, result ranking), and implemented the goal-streak synchronization system across the entire app. I also actively supported the team by resolving major merge conflicts, optimizing the Git workflow, and writing complete technical documentation. Through this project, I significantly improved my Next.js/React 19 programming skills, advanced state management with Zustand, and gained valuable hands-on experience solving complex logic problems in a team environment.

**Estimated % contribution relative to the team:** *(To be updated later)*

**Overall self-assessment score:** 8/10