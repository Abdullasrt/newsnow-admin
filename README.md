# 🛡️ NEWS NOW — Editorial CMS & Newsroom Admin Suite

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A dedicated, production-grade **Newsroom Content Management System (CMS) & Editorial Administration Panel** designed for high-velocity journalism, multi-stage review workflows, team RBAC governance, breaking news dispatch, and reader telemetry.

Standalone project directory: `pulse-news-admin/`

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (fast HMR, optimized Rollup bundling)
- **Routing**: [React Router v7](https://reactrouter.com/) (declarative routing with protected guards)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `@tailwindcss/typography`
- **State & Storage**: React Context (`NewsContext.jsx`) with automatic `localStorage` persistence and fallback data
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: [Oxlint](https://oxc.rs/)

---

## 🚀 Key Modules & Architecture

1. **Newsroom Overview (`/admin` or `/`)**:
   - Executive telemetry, concurrent reader velocity, active breaking wire monitor, recent newsroom activity log, and 1-click draft publishing.

2. **Compose & Edit Dispatches (`/admin/articles/new` & `/admin/articles/edit/:id`)**:
   - SEO headline length analysis, auto-slugify permalink generator, desk category selector, lead excerpt length validator, cover photo gallery presets with attribution/licensing, rich HTML editor with inline formatting, and live broadsheet reader preview toggle.

3. **Stories & Dispatch Table (`/admin/articles`)**:
   - Multi-desk filtering, status filters (`Published`, `Drafts`, `In Review`, `Archived`), keyword search, bulk deletion, duplication as draft, and 1-click cover story pinning.

4. **Editorial Review Queue (`/admin/review-queue`)**:
   - Multi-stage approval workflow: approve stories for immediate publishing or request changes with editorial feedback notes.

5. **Breaking News Live Ticker (`/admin/breaking`)**:
   - Manage real-time marquee wire bulletins, re-order priority, link alerts directly to articles, and broadcast live alerts.

6. **Desk & Beat Management (`/admin/categories`)**:
   - Manage news beats (Tech, Kerala, Business, Science, Culture, Politics), story counts, bureau leads, and description tags.

7. **Whistleblower Tip Line & Inbox (`/admin/enquiries`)**:
   - Secure reader submissions, leaked leads, confidential document drops, internal editorial notes, and 1-click **Convert Tip into Story Draft**.

8. **Audience Distribution & Push Wire (`/admin/newsletter`)**:
   - Automated newsletter dispatches, instant mobile push alerts, and syndicated feed endpoints (`/feeds/master.xml`, etc.).

9. **Staff Directory & RBAC Governance (`/admin/team`)**:
   - Role-Based Access Control for Super Admin, Chief Editor, Desk Editors, Reporters, and Guest Contributors. 1-click role switcher simulation in the sidebar.

10. **Readership Telemetry & Analytics (`/admin/analytics`)**:
    - **Minimalist & Modern 0k–80k Velocity Bar Graph**: Formatted Y-axis scale lines (`80k`, `60k`, `40k`, `20k`, `0k`), permanent inline data badges, peak indicators, and interactive day-by-day telemetry cards.
    - Bureau regional concentration, traffic acquisition channels, and journalist leaderboard.

11. **Newsroom Settings & Data Management (`/admin/settings`)**:
    - Publication masthead metadata, timezone localization, staff 2FA security, live activity audit trail, and JSON database export/restore.

---

## 🛠️ Quick Start

```bash
# 1. Navigate to the admin project directory
cd pulse-news-admin

# 2. Install dependencies (if not linked)
npm install

# 3. Start local development server
npm run dev

# 4. Verify quality and build production bundle
npm run lint
npm run build
npm run preview
```

---

## ☁️ Vercel & GitHub Deployment

- **Vercel**: Includes [`vercel.json`](./vercel.json) with single-page app rewrites so routes like `/admin/articles`, `/admin/analytics`, and `/login` never return 404 on direct URL navigation.
- **GitHub Actions**: Automated CI pipeline configured in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) to lint and build the admin panel on every push.
