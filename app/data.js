// RumahKu Budget — dataset and household state.
//
// The figures describe one example Indonesian household, the Santoso family
// of four in Jakarta, for November 2026. Every number on the site is derived
// from the transaction list below, so the totals on the dashboard, the
// category tables and the charts always agree with each other.
//
// Income for November 2026: Rp 8,500,000
//   salary Rp 6,000,000 + online shop Rp 1,800,000 + freelance Rp 700,000
// Spending for November 2026: Rp 6,002,000 (sum of the expense transactions)
// Remaining: Rp 2,498,000 — a 29.4% savings rate.
// Monthly budgets total Rp 7,000,000, so the household is Rp 998,000 under
// budget this month — every category came in below its budget. Category budgets and actuals are listed in CATEGORIES.

export const META = {
  siteName: 'RumahKu Budget',
  household: 'The Santoso Family',
  members: 'Budi & Sari Santoso, with Andi (10) and Maya (7)',
  city: 'Jakarta, Indonesia',
  month: 'November 2026',
  currency: 'IDR',
  updated: '26 November 2026',
  note: 'An example household budget. Figures are a realistic worked example for November 2026, not a real family’s bank records.',
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries & Food', color: '#0f766e', budget: 2300000 },
  { id: 'housing', label: 'Housing & Utilities', color: '#0369a1', budget: 1150000 },
  { id: 'transport', label: 'Transport', color: '#b45309', budget: 950000 },
  { id: 'education', label: 'Education', color: '#7c3aed', budget: 1250000 },
  { id: 'health', label: 'Health', color: '#be185d', budget: 450000 },
  { id: 'entertainment', label: 'Entertainment', color: '#15803d', budget: 400000 },
  { id: 'clothing', label: 'Clothing', color: '#92400e', budget: 350000 },
  { id: 'other', label: 'Other', color: '#64748b', budget: 150000 },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

// Every November 2026 transaction. Category actuals are the sums of these
// rows: groceries 2,085,000; housing 1,032,000; transport 845,000;
// education 1,150,000; health 285,000; entertainment 310,000;
// clothing 175,000; other 120,000. Income rows total 8,500,000.
export const BASE_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', desc: 'Salary — Budi Santoso (office)', category: 'income', type: 'income', amount: 6000000 },
  { id: 't02', date: '2026-11-01', desc: 'Weekly market shopping — Pasar Minggu', category: 'groceries', type: 'expense', amount: 385000 },
  { id: 't03', date: '2026-11-01', desc: 'School fee (SPP) — Andi', category: 'education', type: 'expense', amount: 650000 },
  { id: 't04', date: '2026-11-01', desc: 'School fee (SPP) — Maya', category: 'education', type: 'expense', amount: 350000 },
  { id: 't05', date: '2026-11-01', desc: 'Fuel — Pertalite', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't06', date: '2026-11-02', desc: 'Electricity bill — PLN', category: 'housing', type: 'expense', amount: 385000 },
  { id: 't07', date: '2026-11-02', desc: 'Water bill — PDAM', category: 'housing', type: 'expense', amount: 142000 },
  { id: 't08', date: '2026-11-03', desc: 'Supermarket — weekly groceries', category: 'groceries', type: 'expense', amount: 212000 },
  { id: 't09', date: '2026-11-04', desc: 'Fuel — Pertalite', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't10', date: '2026-11-05', desc: 'Online shop sales — Sari (week 1)', category: 'income', type: 'income', amount: 950000 },
  { id: 't11', date: '2026-11-05', desc: 'Internet — home Wi-Fi', category: 'housing', type: 'expense', amount: 299000 },
  { id: 't12', date: '2026-11-06', desc: 'Rice & cooking oil — bulk buy', category: 'groceries', type: 'expense', amount: 468000 },
  { id: 't13', date: '2026-11-06', desc: 'Pharmacy — fever medicine', category: 'health', type: 'expense', amount: 85000 },
  { id: 't14', date: '2026-11-07', desc: 'Ride-hailing — ojek to school event', category: 'transport', type: 'expense', amount: 85000 },
  { id: 't15', date: '2026-11-08', desc: 'Books & stationery — Andi', category: 'education', type: 'expense', amount: 95000 },
  { id: 't16', date: '2026-11-09', desc: 'Weekly market shopping — Pasar Minggu', category: 'groceries', type: 'expense', amount: 320000 },
  { id: 't17', date: '2026-11-09', desc: 'Streaming subscription — family plan', category: 'entertainment', type: 'expense', amount: 149000 },
  { id: 't18', date: '2026-11-10', desc: 'Gas LPG refill — 12 kg', category: 'housing', type: 'expense', amount: 96000 },
  { id: 't19', date: '2026-11-11', desc: 'Fuel — Pertalite', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't20', date: '2026-11-12', desc: 'Doctor visit — clinic check-up', category: 'health', type: 'expense', amount: 150000 },
  { id: 't21', date: '2026-11-13', desc: 'Supermarket — weekly groceries', category: 'groceries', type: 'expense', amount: 245000 },
  { id: 't22', date: '2026-11-14', desc: 'Parking & toll', category: 'transport', type: 'expense', amount: 60000 },
  { id: 't23', date: '2026-11-14', desc: 'Kids shoes — Maya', category: 'clothing', type: 'expense', amount: 175000 },
  { id: 't24', date: '2026-11-15', desc: 'Freelance design project — Budi', category: 'income', type: 'income', amount: 700000 },
  { id: 't25', date: '2026-11-15', desc: 'Tutoring — maths, Andi', category: 'education', type: 'expense', amount: 55000 },
  { id: 't26', date: '2026-11-16', desc: 'Weekly market shopping — Pasar Minggu', category: 'groceries', type: 'expense', amount: 295000 },
  { id: 't27', date: '2026-11-17', desc: 'Family movie night — cinema', category: 'entertainment', type: 'expense', amount: 111000 },
  { id: 't28', date: '2026-11-18', desc: 'Fuel — Pertalite', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't29', date: '2026-11-18', desc: 'Home maintenance — leaky tap repair', category: 'housing', type: 'expense', amount: 110000 },
  { id: 't30', date: '2026-11-19', desc: 'Online shop sales — Sari (week 2)', category: 'income', type: 'income', amount: 850000 },
  { id: 't31', date: '2026-11-19', desc: 'Gift — neighbour’s housewarming', category: 'other', type: 'expense', amount: 75000 },
  { id: 't32', date: '2026-11-20', desc: 'Vitamins — family pack', category: 'health', type: 'expense', amount: 50000 },
  { id: 't33', date: '2026-11-21', desc: 'Ride-hailing — ojek to mall', category: 'transport', type: 'expense', amount: 45000 },
  { id: 't34', date: '2026-11-22', desc: 'Supermarket — weekly groceries', category: 'groceries', type: 'expense', amount: 160000 },
  { id: 't35', date: '2026-11-23', desc: 'Board game — family game night', category: 'entertainment', type: 'expense', amount: 50000 },
  { id: 't36', date: '2026-11-24', desc: 'Fuel — Pertalite', category: 'transport', type: 'expense', amount: 55000 },
  { id: 't37', date: '2026-11-25', desc: 'Misc household — batteries & soap', category: 'other', type: 'expense', amount: 45000 },
];

// Monthly totals, June–November 2026. Income is Rp 8,500,000 every month;
// expenses are the recorded monthly totals. November matches the
// transaction list above (6,002,000).
export const MONTHLY = [
  { month: 'Jun 2026', income: 8500000, expenses: 6940000 },
  { month: 'Jul 2026', income: 8500000, expenses: 7210000 },
  { month: 'Aug 2026', income: 8500000, expenses: 6780000 },
  { month: 'Sep 2026', income: 8500000, expenses: 7150000 },
  { month: 'Oct 2026', income: 8500000, expenses: 6905000 },
  { month: 'Nov 2026', income: 8500000, expenses: 6002000 },
];

// Savings goals — saved amounts are cumulative balances, not November flows.
export const BASE_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 15000000, saved: 9750000, note: '6 months of essential spending' },
  { id: 'g2', name: 'Family holiday — Bandung', target: 5000000, saved: 2400000, note: 'School holiday trip in December' },
  { id: 'g3', name: 'New motorcycle', target: 18000000, saved: 6300000, note: 'Replace the 2016 bike next year' },
  { id: 'g4', name: 'Kids education fund', target: 10000000, saved: 4100000, note: 'Andi & Maya — next school year' },
];

// Recurring monthly bills. Amounts match the November transactions where
// the bill has already been paid; two bills are still due this month.
export const BASE_BILLS = [
  { id: 'b1', name: 'School fee — Andi', amount: 650000, dueDay: 1, paid: true },
  { id: 'b2', name: 'School fee — Maya', amount: 350000, dueDay: 1, paid: true },
  { id: 'b3', name: 'Electricity — PLN', amount: 385000, dueDay: 5, paid: true },
  { id: 'b4', name: 'Streaming subscription', amount: 149000, dueDay: 9, paid: true },
  { id: 'b5', name: 'Water — PDAM', amount: 142000, dueDay: 10, paid: true },
  { id: 'b6', name: 'Internet — home Wi-Fi', amount: 299000, dueDay: 15, paid: true },
  { id: 'b7', name: 'Health insurance — BPJS', amount: 150000, dueDay: 27, paid: false },
  { id: 'b8', name: 'Motorcycle instalment', amount: 850000, dueDay: 28, paid: false },
];

// ---------------------------------------------------------------- state
// The household's working state lives in localStorage so edits survive a
// reload. Everything is stored as plain JSON; nothing leaves the browser.

const STORAGE_KEY = 'rumahku-budget-v1';

const clone = (v) => JSON.parse(JSON.stringify(v));

function defaultState() {
  return {
    transactions: clone(BASE_TRANSACTIONS),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    goals: clone(BASE_GOALS),
    bills: clone(BASE_BILLS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    return {
      transactions: Array.isArray(saved.transactions) && saved.transactions.length ? saved.transactions : base.transactions,
      budgets: { ...base.budgets, ...(saved.budgets ?? {}) },
      goals: Array.isArray(saved.goals) && saved.goals.length ? saved.goals : base.goals,
      bills: Array.isArray(saved.bills) && saved.bills.length ? saved.bills : base.bills,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — the page still works for this session.
  }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  return defaultState();
}

// ---------------------------------------------------------------- derived
export function totals(state) {
  const income = state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const budgetTotal = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  return {
    income,
    expenses,
    remaining: income - expenses,
    savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    budgetTotal,
    budgetDiff: expenses - budgetTotal,
  };
}

export function spentByCategory(state) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (t.type === 'expense' && out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}

export function totalSaved(state) {
  return state.goals.reduce((s, g) => s + g.saved, 0);
}

export function upcomingBills(state) {
  return state.bills.filter((b) => !b.paid);
}

// ---------------------------------------------------------------- format
export const fmtRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

export const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const pct = (n) => `${n.toFixed(1)}%`;
