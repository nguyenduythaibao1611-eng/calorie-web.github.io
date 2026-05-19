---
title: "Personal Contribution Report - Đặng Đức Minh"
description: "Detailed contribution report for Planning, UI, DB Integration, Optimization, and Peer Review tasks in the Calomate project."
---

## Personal Information

| | |
|---|---|
| **Full Name** | Đặng Đức Minh |
| **Student ID** | 24020001 |
| **Team** | Calomate |
| **Role in Team** | Member |

---

## Task 1 — Planning & Setup

**Week:** Week 1, May 6–8, 2026

**Work completed:**
- Participated in project planning with the team and divided tasks among members
- Participated in reviewing and merging initial setup Pull Requests (PR #31, #32, #33, #34, #35, #36)
- Took on the role of reviewer (indominusrex932005-arch) — inspecting code before merging into main

**Evidence of contribution:**
- [Merge PR #35 – TypeScript definitions & storage layer](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/35)
- [Merge PR #36 – TV1 data (ingredients database)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/36)

**Difficulties encountered:**
The team was working with Next.js App Router and Zustand for the first time, and it took time to agree on a folder structure before getting started.

**Self-assessment:** 7/10

---

## Task 2 — UI Implementation

**Week:** Weeks 1–2, May 9–16, 2026

**Work completed:**
- Finalized ProfileForm UI: adjusted logo, colors, watermark (commit 591f3ef)
- Completed Task 20: Dashboard displaying real data, Water tracking (commit 8057296)
- Completed Task 18: Connected TDEE logic and saved to Store (commit 077c27a)
- Completed Task 14: Profile page UI (commit fc208f2)
- Fixed several UI bugs and tested mobile interface (commits 29a6404, ecec104)

**Evidence of contribution:**
- [PR #47 – Profile UI (Task 14)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/47)
- [PR #57 – Task 18: TDEE & store connection](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/57)
- [PR #60 – Task 20: Dashboard real data](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/60)
- [PR #76 – UI improvements & bug fixes](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/76)

**Difficulties encountered:**
Most of the UI code was written with heavy AI assistance — I understand the logic at a basic level but haven't fully grasped every detail. Debugging prop-passing errors between Dashboard and Store took quite a long time due to my limited familiarity with Zustand.

**Self-assessment:** 7/10

---

## Task 3 — Database Integration

**Week:** Weeks 2–3, May 17–19, 2026

**Work completed:**
- Learned Prisma ORM and Supabase from scratch — had no prior experience with either technology before this project
- Installed Prisma, connected to Supabase, selected compatible library versions for the team (commit c8a525f)
- Migrated data from a static database (JSON) to a dynamic database with Prisma (commit 43ed13a)
- Built API routes for meals, users, and ingredients (commits a3351ae, e04334b, 4236e93)
- Fixed static rendering issue: added `force-dynamic` to `route.ts` files (commits 2fa4fdb, d85a01c)
- Fixed `postinstall prisma generate` so Vercel generates the client at the correct time (commit 6bfeabd)
- Reviewed and approved PR #93 (timezone bug fix in streak — discovered and implemented by another member)

**Evidence of contribution:**
- [PR #91 – Migrate static DB to dynamic](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/91)
- [PR #97 – Prisma API setup](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/97)
- [PR #99 – API database v2 (final)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/99)

**Difficulties encountered:**
This was the hardest part for me personally. Having no prior knowledge of Prisma and Supabase, most of the work was done with AI assistance and documentation — my actual depth of understanding is still limited.
The Vercel deployment phase ran into many consecutive errors and took much longer than expected. Partly because I didn't fully understand the root cause of each error, and partly because I had to rely on another member's Vercel account to deploy and test — every fix required waiting for that person to act.

**Self-assessment:** 7/10

---

## Task 4 — Optimization

**Week:** Week 2, May 10–11, 2026

**Work completed:**
- Completed Task 25: optimized Lighthouse score to above 75 (commit 78bb0e2)
- Applied lazy loading with `next/dynamic` for Modal and Charts
- Added `aria-label` to interactive elements to improve Accessibility
- Added `useMemo` and `useCallback` to several components
- Configured Cache Headers in `next.config.ts`
- Completed Task 23: Responsive UI for Dashboard on Mobile and Tablet (commit 8ef7d6d)
- Fixed missing `id` attribute in `searchIngredient` function (commit ae59f20)

**Evidence of contribution:**
- [PR #71 – Task 25 Performance optimization](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/71)
- [PR #65 – Task 23 Responsive UI](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/65)
- [PR #64 – Fix search ingredient id](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pull/64)

**Difficulties encountered:**
The optimization steps were mostly carried out by following AI guidance and the Next.js documentation — I understood the purpose of each step but haven't fully grasped the underlying technical reasoning. `optimizeCss` caused a build error with no clear reason and took extra time to resolve.

**Self-assessment:** 7/10

---

## Task 5 — Peer Review

**Week:** Week 3, May 17–19, 2026

**Work completed:**
- Internal code review as reviewer (indominusrex932005-arch): approved and merged PRs #59, #65, #68, #69, #71, #72, #76, #81, #93, #99
- Cross-team peer review for hothong3k/QuickToDo: read source code and submitted a feedback issue on UX

**Feedback submitted to team hothong3k/QuickToDo:**
Issue: *"Missing delete confirmation dialog and undo feature"*

Description: When a user clicks the delete button on a todo, the item is removed immediately with no confirmation dialog or Undo functionality. This can cause data loss if the user clicks accidentally — especially for todos that have detailed descriptions, multiple subtasks, and due dates.

**Evidence of contribution:**
- [Peer review issue submitted to hothong3k/QuickToDo](https://github.com/hothong3k/QuickToDo/issues)
- [Internal PR merge history (reviewer: indominusrex932005-arch)](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io/pulls?q=is%3Apr+is%3Amerged)

**Difficulties encountered:**
Reviewing another team's code was not too difficult since it only required reading and commenting — this part went better than the coding tasks.

**Self-assessment:** 8/10

---

## Personal Contribution Summary

**Summary of contributions to the project:**
My main contributions were in database integration and some UI work. Most of the code was written with significant AI and documentation assistance — I understand the overall flow at a high level but haven't deeply internalized every technical detail. The most time-consuming part was the Prisma deployment to Vercel, due to dependency on another member's environment and my unfamiliarity with the build errors. Through this project, I gained a basic understanding of Prisma, Supabase, and team collaboration via GitHub — though there is still much more to learn.

**Estimated % contribution relative to the team:** ~25%

**Overall self-assessment score:** 7/10