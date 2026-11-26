[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/taufik-hidayat/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/taufik-hidayat/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# RumahKu Budget — Household Budget Site

**RumahKu Budget** is a household budget site for an example Indonesian family of four in
Jakarta, covering November 2026: income, spending, a budget planner, savings goals, bills,
and reports. It runs fully offline from static files — no build step, no network request,
no framework — and every control works.

- **Live entry:** built for the make.fun bounty
  [Make the best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457)
- **Run it:** `node serve.ts`, then open http://localhost:8080
- **Hand it in:** `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`

## What is inside

- `app/` — the site: `index.html`, `style.css`, `main.js` (hash router),
  `views.js` (6 pages), `charts.js` (hand-drawn SVG charts), `data.js`
  (the household dataset + localStorage state).
- Pages: Dashboard (KPIs, category donut, 6-month chart), Income & Expenses
  (add / edit / delete transactions, filter, search, sort, CSV download),
  Budget Planner (editable budgets, progress bars, what-if calculator),
  Savings Goals (progress + add funds + create a goal), Bills & Recurring
  (due dates, mark paid), Reports (monthly chart, category table, CSV downloads).
- Every number is consistent: November income Rp 8,500,000, spending Rp 6,002,000
  (33 expense transactions), remaining Rp 2,498,000 — a 29.4% savings rate.
  Edits are saved in the browser (localStorage) and update every page at once.
- `screenshots/` — real renders of the site in a browser (desktop + phone).
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## Data

The figures describe one example household, the Santoso family, for November 2026:
salary Rp 6,000,000, online shop Rp 1,800,000, freelance Rp 700,000; spending by
category — groceries Rp 2,085,000, housing Rp 1,032,000, transport Rp 845,000,
education Rp 1,150,000, health Rp 285,000, entertainment Rp 310,000, clothing
Rp 175,000, other Rp 120,000. Monthly budgets total Rp 7,000,000, so the household
is Rp 998,000 under budget. Savings goals total Rp 22,550,000 saved of Rp 48,000,000
targeted. These are a realistic worked example, not a real family's bank records.

---

<sub>Entered on [make.fun](https://make.fun/?ref=2z9vc20p&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
