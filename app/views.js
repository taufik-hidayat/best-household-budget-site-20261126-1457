// RumahKu Budget — pages. Each view returns HTML for one hash route and a
// bind function that wires up that page's controls. All numbers come from
// the shared state in data.js, so an added transaction updates the
// dashboard, the planner and the reports together.

import {
  META, CATEGORIES, MONTHLY, categoryById,
  totals, spentByCategory, totalSaved, upcomingBills,
  fmtRp, fmtDate, pct, saveState,
} from './data.js';
import { donutChart, monthlyBarChart, hbar } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function kpi(value, label, sub, tone = '') {
  return `<div class="kpi ${tone}"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div><div class="kpi-sub">${sub}</div></div>`;
}

function downloadCsv(filename, header, rows) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header.map(q).join(',')].concat(rows.map((r) => r.map(q).join(','))).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------------------------------------------------------------- dashboard
export function viewDashboard(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: spent[c.id], color: c.color }));
  const over = t.budgetDiff > 0
    ? `Rp ${t.budgetDiff.toLocaleString('id-ID')} over the monthly budget`
    : `Rp ${Math.abs(t.budgetDiff).toLocaleString('id-ID')} under the monthly budget`;
  const recent = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 6);
  const topCats = CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] }))
    .sort((a, b) => b.spent - a.spent).slice(0, 3);
  const goals = state.goals;

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${esc(META.month)} · ${esc(META.city)}</p>
      <h1>Your household money, in one place.</h1>
      <p class="lede">RumahKu Budget tracks ${esc(META.household)}'s income, spending, bills
      and savings goals for ${esc(META.month)} — every rupiah accounted for, no spreadsheets,
      no guesswork.</p>
    </div>
    <div class="hero-card">
      <div class="hero-card-label">Money left this month</div>
      <div class="hero-card-value">${fmtRp(t.remaining)}</div>
      <div class="hero-card-sub">of ${fmtRp(t.income)} income · ${pct(t.savingsRate)} saved</div>
    </div>
  </section>

  <section class="kpis" aria-label="November 2026 summary">
    ${kpi(fmtRp(t.income), 'Income', 'Salary + shop + freelance', 'good')}
    ${kpi(fmtRp(t.expenses), 'Spent', `${state.transactions.filter((x) => x.type === 'expense').length} expense transactions`, 'warn')}
    ${kpi(fmtRp(t.remaining), 'Remaining', over, 'good')}
    ${kpi(pct(t.savingsRate), 'Savings rate', `${fmtRp(totalSaved(state))} saved across ${goals.length} goals`, 'good')}
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      <p class="muted">Spending by category, November 2026. Groceries are the biggest
      slice at ${fmtRp(spent.groceries)} — ${(spent.groceries / t.expenses * 100).toFixed(1)}% of all spending.</p>
      <div class="donut-wrap">
        ${donutChart(slices)}
        <ul class="legend">
          ${slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)}<strong>${fmtRp(s.value)}</strong></li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="card">
      <h2>Income vs spending — last 6 months</h2>
      <p class="muted">Income has held at ${fmtRp(8500000)} a month; November spending
      (${fmtRp(6002000)}) sits below the 6-month average of ${fmtRp(6997833)}.</p>
      ${monthlyBarChart(MONTHLY)}
    </div>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Biggest categories</h2>
      <table class="table">
        <thead><tr><th>Category</th><th>Budget</th><th>Spent</th><th>Left</th></tr></thead>
        <tbody>
          ${topCats.map((c) => `<tr><td><span class="dot" style="background:${c.color}"></span> ${esc(c.label)}</td><td>${fmtRp(state.budgets[c.id])}</td><td>${fmtRp(c.spent)}</td><td class="${state.budgets[c.id] - c.spent < 0 ? 'neg' : 'pos'}">${fmtRp(state.budgets[c.id] - c.spent)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p><a class="btn" href="#/planner">Open the Budget Planner →</a></p>
    </div>
    <div class="card">
      <h2>Latest transactions</h2>
      <ul class="tx-list">
        ${recent.map((x) => `<li><span class="tx-date">${fmtDate(x.date)}</span><span class="tx-desc">${esc(x.desc)}</span><span class="tx-amt ${x.type}">${x.type === 'income' ? '+' : '−'} ${fmtRp(x.amount)}</span></li>`).join('')}
      </ul>
      <p><a class="btn" href="#/transactions">See all transactions →</a></p>
    </div>
  </section>

  <section class="card">
    <h2>Savings goals at a glance</h2>
    <div class="goal-grid">
      ${goals.map((g) => {
        const p = (g.saved / g.target) * 100;
        return `<div class="goal-mini"><div class="goal-mini-head"><strong>${esc(g.name)}</strong><span>${pct(p)}</span></div>${hbar(g.saved, g.target, '#0f766e')}<div class="muted">${fmtRp(g.saved)} of ${fmtRp(g.target)}</div></div>`;
      }).join('')}
    </div>
    <p><a class="btn" href="#/goals">Manage savings goals →</a></p>
  </section>

  <p class="source">Example household budget for November 2026. Income ${fmtRp(8500000)} · spending ${fmtRp(6002000)} · remaining ${fmtRp(2498000)}. Figures are a realistic worked example, not a real family's bank records.</p>`;
}

export function bindDashboard() {}

// ------------------------------------------------------- income & expenses
export function viewTransactions(state) {
  const t = totals(state);
  return `
  <h1>Income &amp; Expenses</h1>
  <p class="lede">Every rupiah in and out for ${esc(META.month)}. Add a transaction and the
  dashboard, planner and reports update at once. ${state.transactions.length} transactions recorded:
  income ${fmtRp(t.income)}, spending ${fmtRp(t.expenses)}.</p>

  <section class="card">
    <h2 id="form-title">Add a transaction</h2>
    <form id="tx-form" class="form-grid">
      <input type="hidden" id="tx-id" value="">
      <label>Date <input type="date" id="tx-date" value="2026-11-26" required></label>
      <label>Description <input type="text" id="tx-desc" placeholder="e.g. Weekly market shopping" required maxlength="80"></label>
      <label>Type
        <select id="tx-type"><option value="expense">Expense</option><option value="income">Income</option></select>
      </label>
      <label>Category
        <select id="tx-category">
          ${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}
          <option value="income">Income</option>
        </select>
      </label>
      <label>Amount (Rp) <input type="number" id="tx-amount" min="1000" step="1000" placeholder="150000" required></label>
      <div class="form-actions">
        <button class="btn primary" type="submit" id="tx-submit">Add transaction</button>
        <button class="btn" type="button" id="tx-cancel" hidden>Cancel edit</button>
      </div>
    </form>
    <p class="muted" id="tx-msg" role="status"></p>
  </section>

  <section class="card">
    <h2>All transactions</h2>
    <div class="filters">
      <label>Search <input type="search" id="f-search" placeholder="Search description…"></label>
      <label>Type
        <select id="f-type"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select>
      </label>
      <label>Category
        <select id="f-category"><option value="all">All categories</option>${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}<option value="income">Income</option></select>
      </label>
      <label>Sort by
        <select id="f-sort"><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="amount-desc">Amount: high to low</option><option value="amount-asc">Amount: low to high</option></select>
      </label>
    </div>
    <p class="muted" id="tx-count" role="status"></p>
    <div class="table-scroll"><table class="table" id="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody id="tx-body"></tbody>
    </table></div>
    <p><button class="btn" id="tx-csv" type="button">Download transactions (CSV)</button></p>
  </section>`;
}

export function bindTransactions(state, rerender) {
  const body = document.getElementById('tx-body');
  const count = document.getElementById('tx-count');
  const form = document.getElementById('tx-form');
  const msg = document.getElementById('tx-msg');

  const renderRows = () => {
    const q = (document.getElementById('f-search').value || '').trim().toLowerCase();
    const type = document.getElementById('f-type').value;
    const cat = document.getElementById('f-category').value;
    const sort = document.getElementById('f-sort').value;
    let rows = state.transactions.filter((x) =>
      (type === 'all' || x.type === type)
      && (cat === 'all' || x.category === cat)
      && (!q || x.desc.toLowerCase().includes(q)));
    const by = {
      'date-desc': (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
      'date-asc': (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
      'amount-desc': (a, b) => b.amount - a.amount,
      'amount-asc': (a, b) => a.amount - b.amount,
    }[sort];
    rows.sort(by);
    const shownIncome = rows.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
    const shownExpense = rows.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
    count.textContent = `${rows.length} of ${state.transactions.length} transactions · income ${fmtRp(shownIncome)} · spending ${fmtRp(shownExpense)}`;
    body.innerHTML = rows.map((x) => {
      const label = x.type === 'income' ? 'Income' : categoryById(x.category).label;
      return `<tr>
        <td>${fmtDate(x.date)}</td>
        <td>${esc(x.desc)}</td>
        <td>${esc(label)}</td>
        <td class="num ${x.type}">${x.type === 'income' ? '+' : '−'} ${fmtRp(x.amount)}</td>
        <td class="row-actions"><button class="linklike" data-edit="${x.id}" type="button">Edit</button> <button class="linklike danger" data-del="${x.id}" type="button">Delete</button></td>
      </tr>`;
    }).join('') || `<tr><td colspan="5">No transactions match these filters.</td></tr>`;
  };

  ['f-search', 'f-type', 'f-category', 'f-sort'].forEach((id) =>
    document.getElementById(id).addEventListener('input', renderRows));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('tx-id').value;
    const desc = document.getElementById('tx-desc').value.trim();
    const amount = Math.round(Number(document.getElementById('tx-amount').value));
    const type = document.getElementById('tx-type').value;
    let category = document.getElementById('tx-category').value;
    if (type === 'income') category = 'income';
    if (!desc || !amount || amount <= 0) { msg.textContent = 'Please fill in a description and an amount above Rp 0.'; return; }
    const date = document.getElementById('tx-date').value || '2026-11-26';
    if (id) {
      const row = state.transactions.find((x) => x.id === id);
      if (row) Object.assign(row, { date, desc, type, category, amount });
      msg.textContent = 'Transaction updated.';
    } else {
      state.transactions.push({ id: 'u' + Date.now().toString(36), date, desc, type, category, amount });
      msg.textContent = 'Transaction added.';
    }
    saveState(state);
    form.reset();
    document.getElementById('tx-date').value = '2026-11-26';
    document.getElementById('tx-id').value = '';
    document.getElementById('form-title').textContent = 'Add a transaction';
    document.getElementById('tx-submit').textContent = 'Add transaction';
    document.getElementById('tx-cancel').hidden = true;
    renderRows();
  });

  document.getElementById('tx-cancel').addEventListener('click', () => {
    form.reset();
    document.getElementById('tx-date').value = '2026-11-26';
    document.getElementById('tx-id').value = '';
    document.getElementById('form-title').textContent = 'Add a transaction';
    document.getElementById('tx-submit').textContent = 'Add transaction';
    document.getElementById('tx-cancel').hidden = true;
    msg.textContent = '';
  });

  body.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-del]');
    if (editBtn) {
      const row = state.transactions.find((x) => x.id === editBtn.dataset.edit);
      if (!row) return;
      document.getElementById('tx-id').value = row.id;
      document.getElementById('tx-date').value = row.date;
      document.getElementById('tx-desc').value = row.desc;
      document.getElementById('tx-type').value = row.type;
      document.getElementById('tx-category').value = row.category;
      document.getElementById('tx-amount').value = row.amount;
      document.getElementById('form-title').textContent = 'Edit transaction';
      document.getElementById('tx-submit').textContent = 'Save changes';
      document.getElementById('tx-cancel').hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (delBtn) {
      const row = state.transactions.find((x) => x.id === delBtn.dataset.del);
      if (!row) return;
      state.transactions = state.transactions.filter((x) => x.id !== row.id);
      saveState(state);
      msg.textContent = `Deleted “${row.desc}” (${fmtRp(row.amount)}).`;
      renderRows();
    }
  });

  document.getElementById('tx-csv').addEventListener('click', () => {
    downloadCsv('rumahku-transactions-nov-2026.csv',
      ['Date', 'Description', 'Category', 'Type', 'Amount (Rp)'],
      [...state.transactions].sort((a, b) => a.date.localeCompare(b.date)).map((x) => [
        x.date, x.desc, x.type === 'income' ? 'Income' : categoryById(x.category).label, x.type, x.amount,
      ]));
  });

  renderRows();
}

// ---------------------------------------------------------------- planner
export function viewPlanner(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const rows = CATEGORIES.map((c) => {
    const actual = spent[c.id];
    const budget = state.budgets[c.id];
    const left = budget - actual;
    const p = budget > 0 ? (actual / budget) * 100 : 0;
    const status = p > 100 ? `<span class="badge over">Over by ${fmtRp(actual - budget)}</span>`
      : p >= 90 ? `<span class="badge near">Almost there — ${pct(p)} used</span>`
      : `<span class="badge ok">${pct(p)} used</span>`;
    return { ...c, actual, budget, left, p, status };
  });
  return `
  <h1>Budget Planner</h1>
  <p class="lede">Set a monthly budget per category and watch actual spending against it.
  November's budgets total ${fmtRp(t.budgetTotal)} against ${fmtRp(t.expenses)} spent —
  ${t.budgetDiff > 0 ? `<strong class="neg">${fmtRp(t.budgetDiff)} over budget.</strong>` : `<strong class="pos">${fmtRp(Math.abs(t.budgetDiff))} under budget.</strong>`}
  Edit any budget below; the totals update immediately.</p>

  <section class="kpis" aria-label="Budget totals">
    ${kpi(fmtRp(t.budgetTotal), 'Total budget', 'All categories, November')}
    ${kpi(fmtRp(t.expenses), 'Actually spent', 'From the transaction list')}
    ${kpi(fmtRp(t.remaining), 'Income left over', `${pct(t.savingsRate)} savings rate`, 'good')}
  </section>

  <section class="card">
    <table class="table planner">
      <thead><tr><th>Category</th><th>Budget (Rp)</th><th>Spent</th><th>Left</th><th style="min-width:180px">Progress</th><th>Status</th></tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>
          <td><span class="dot" style="background:${r.color}"></span> ${esc(r.label)}</td>
          <td><input class="budget-input" type="number" min="0" step="50000" data-budget="${r.id}" value="${r.budget}" aria-label="Budget for ${esc(r.label)}"></td>
          <td>${fmtRp(r.actual)}</td>
          <td class="${r.left < 0 ? 'neg' : 'pos'}">${fmtRp(r.left)}</td>
          <td>${hbar(r.actual, r.budget, r.p > 100 ? '#dc2626' : r.color)}</td>
          <td>${r.status}</td>
        </tr>`).join('')}
      </tbody>
      <tfoot><tr><td><strong>Total</strong></td><td><strong id="plan-total-budget">${fmtRp(t.budgetTotal)}</strong></td><td><strong>${fmtRp(t.expenses)}</strong></td><td><strong id="plan-total-left" class="${t.budgetTotal - t.expenses < 0 ? 'neg' : 'pos'}">${fmtRp(t.budgetTotal - t.expenses)}</strong></td><td colspan="2"><span id="plan-note" class="muted">Budgets are saved automatically.</span></td></tr></tfoot>
    </table>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>What-if calculator</h2>
      <p class="muted">See what happens if you trim a category. Pick a category, enter a
      new budget, and the projected month-end leftover updates below.</p>
      <div class="form-grid">
        <label>Category
          <select id="wi-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select>
        </label>
        <label>New budget (Rp) <input type="number" id="wi-amount" min="0" step="50000" value="2000000"></label>
      </div>
      <p id="wi-out" class="calc-out" role="status"></p>
    </div>
    <div class="card">
      <h2>How the budget was set</h2>
      <p>Budgets follow the 50/30/20 rule of thumb, adapted to this household: needs
      (groceries, housing, transport, education, health) take ${fmtRp(6100000)} — 71.8% of income;
      wants (entertainment, clothing) take ${fmtRp(750000)} — 8.8%; the remaining ${fmtRp(1500000)}
      is earmarked for savings. Every category is under budget so far this month; the tightest
      is housing, at ${pct(spent.housing / state.budgets.housing * 100)} of its budget, and the
      loosest is clothing, at ${pct(spent.clothing / state.budgets.clothing * 100)}.</p>
    </div>
  </section>`;
}

export function bindPlanner(state, rerender) {
  const spent = spentByCategory(state);
  document.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', () => {
      const v = Math.max(0, Math.round(Number(input.value) || 0));
      state.budgets[input.dataset.budget] = v;
      saveState(state);
      rerender();
    });
  });

  const cat = document.getElementById('wi-cat');
  const amount = document.getElementById('wi-amount');
  const out = document.getElementById('wi-out');
  const calc = () => {
    const c = categoryById(cat.value);
    const nb = Math.max(0, Math.round(Number(amount.value) || 0));
    const newTotal = Object.entries(state.budgets).reduce((s, [k, v]) => s + (k === c.id ? nb : v), 0);
    const t = totals(state);
    const change = state.budgets[c.id] - nb;
    out.innerHTML = `If <strong>${esc(c.label)}</strong> moves from ${fmtRp(state.budgets[c.id])} to ${fmtRp(nb)}, `
      + `total budget becomes <strong>${fmtRp(newTotal)}</strong> and the month-end leftover becomes `
      + `<strong>${fmtRp(t.income - t.expenses + change)}</strong> `
      + `(${change >= 0 ? `frees up ${fmtRp(change)}` : `needs ${fmtRp(-change)} more`}).`;
  };
  cat.addEventListener('change', () => {
    amount.value = state.budgets[cat.value];
    calc();
  });
  amount.addEventListener('input', calc);
  amount.value = state.budgets[cat.value];
  calc();
}

// ---------------------------------------------------------------- goals
export function viewGoals(state) {
  const saved = totalSaved(state);
  const target = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <h1>Savings Goals</h1>
  <p class="lede">Four goals, ${fmtRp(saved)} saved so far out of ${fmtRp(target)} —
  ${pct(saved / target * 100)} of the way there. Add money to a goal and its progress bar moves at once.</p>

  <section class="kpis" aria-label="Savings totals">
    ${kpi(fmtRp(saved), 'Total saved', `Across ${state.goals.length} goals`, 'good')}
    ${kpi(fmtRp(target), 'Total target', 'All goals combined')}
    ${kpi(pct(saved / target * 100), 'Overall progress', `${fmtRp(target - saved)} still to save`)}
  </section>

  <section class="goal-grid big">
    ${state.goals.map((g) => {
      const p = (g.saved / g.target) * 100;
      return `<div class="card goal-card">
        <h2>${esc(g.name)}</h2>
        <p class="muted">${esc(g.note)}</p>
        <div class="goal-nums"><strong>${fmtRp(g.saved)}</strong><span>of ${fmtRp(g.target)}</span></div>
        ${hbar(g.saved, g.target, '#0f766e')}
        <div class="goal-pct">${pct(p)} complete · ${fmtRp(g.target - g.saved)} to go</div>
        <div class="add-funds">
          <label>Add funds (Rp) <input type="number" min="1000" step="1000" data-add="${g.id}" placeholder="100000"></label>
          <button class="btn primary" type="button" data-addbtn="${g.id}">Add to goal</button>
        </div>
      </div>`;
    }).join('')}
  </section>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="form-grid">
      <label>Goal name <input type="text" id="goal-name" placeholder="e.g. New laptop for Andi" required maxlength="60"></label>
      <label>Target amount (Rp) <input type="number" id="goal-target" min="10000" step="10000" placeholder="3000000" required></label>
      <label>Note <input type="text" id="goal-note" placeholder="Why this goal matters" maxlength="100"></label>
      <div class="form-actions"><button class="btn primary" type="submit">Create goal</button></div>
    </form>
    <p class="muted" id="goal-msg" role="status"></p>
    <p class="muted">Tip: this month's leftover of ${fmtRp(totals(state).remaining)} could fund the
    emergency fund to ${fmtRp(Math.min(state.goals[0].saved + totals(state).remaining, state.goals[0].target))} —
    ${pct(Math.min(state.goals[0].saved + totals(state).remaining, state.goals[0].target) / state.goals[0].target * 100)} of its target.</p>
  </section>`;
}

export function bindGoals(state, rerender) {
  document.querySelectorAll('[data-addbtn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(`[data-add="${btn.dataset.addbtn}"]`);
      const v = Math.round(Number(input.value) || 0);
      if (v <= 0) { input.focus(); return; }
      const g = state.goals.find((x) => x.id === btn.dataset.addbtn);
      if (!g) return;
      g.saved += v;
      saveState(state);
      rerender();
    });
  });
  const form = document.getElementById('goal-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value.trim();
    const target = Math.round(Number(document.getElementById('goal-target').value));
    const note = document.getElementById('goal-note').value.trim() || 'A new savings goal';
    if (!name || !target || target <= 0) return;
    state.goals.push({ id: 'g' + Date.now().toString(36), name, target, saved: 0, note });
    saveState(state);
    document.getElementById('goal-msg').textContent = `Goal “${name}” created with a target of ${fmtRp(target)}.`;
    form.reset();
    rerender();
  });
}

// ---------------------------------------------------------------- bills
export function viewBills(state) {
  const upcoming = upcomingBills(state);
  const upcomingTotal = upcoming.reduce((s, b) => s + b.amount, 0);
  const paidTotal = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const rows = [...state.bills].sort((a, b) => a.dueDay - b.dueDay);
  return `
  <h1>Bills &amp; Recurring</h1>
  <p class="lede">Fixed monthly bills for ${esc(META.household)}: ${fmtRp(total)} a month across
  ${state.bills.length} recurring payments. ${upcoming.length} still due in November —
  ${fmtRp(upcomingTotal)} — and ${fmtRp(paidTotal)} already paid. Mark a bill paid and the totals update.</p>

  <section class="kpis" aria-label="Bills totals">
    ${kpi(fmtRp(total), 'Monthly bills total', `${state.bills.length} recurring payments`)}
    ${kpi(fmtRp(paidTotal), 'Paid in November', `${state.bills.filter((b) => b.paid).length} of ${state.bills.length} bills`, 'good')}
    ${kpi(fmtRp(upcomingTotal), 'Still due', upcoming.map((b) => `${esc(b.name)} (${fmtRp(b.amount)})`).join(' · ') || 'Nothing outstanding', 'warn')}
  </section>

  <section class="card">
    <table class="table">
      <thead><tr><th>Bill</th><th>Due day</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${rows.map((b) => `<tr>
          <td>${esc(b.name)}</td>
          <td>Nov ${b.dueDay}</td>
          <td class="num">${fmtRp(b.amount)}</td>
          <td>${b.paid ? '<span class="badge ok">Paid</span>' : '<span class="badge over">Due soon</span>'}</td>
          <td><button class="linklike" type="button" data-bill="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <p class="muted">Due dates are the usual day each bill falls. The two bills still open —
    BPJS health insurance (Nov 27) and the motorcycle instalment (Nov 28) — are covered
    by this month's leftover of ${fmtRp(totals(state).remaining)}.</p>
  </section>`;
}

export function bindBills(state, rerender) {
  document.querySelectorAll('[data-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const b = state.bills.find((x) => x.id === btn.dataset.bill);
      if (!b) return;
      b.paid = !b.paid;
      saveState(state);
      rerender();
    });
  });
}

// ---------------------------------------------------------------- reports
export function viewReports(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const avgExpenses = Math.round(MONTHLY.reduce((s, m) => s + m.expenses, 0) / MONTHLY.length);
  const bestMonth = MONTHLY.reduce((a, b) => (a.income - a.expenses) > (b.income - b.expenses) ? a : b);
  return `
  <h1>Reports</h1>
  <p class="lede">Six months of household finances at a glance. November is the latest month:
  income ${fmtRp(t.income)}, spending ${fmtRp(t.expenses)}, leftover ${fmtRp(t.remaining)}.
  The 6-month average spend is ${fmtRp(avgExpenses)}; the best saving month was
  ${bestMonth.month} (${fmtRp(bestMonth.income - bestMonth.expenses)} saved).</p>

  <section class="card">
    <h2>Income vs expenses — June to November 2026</h2>
    ${monthlyBarChart(MONTHLY)}
    <table class="table">
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Expenses</th><th class="num">Saved</th><th class="num">Savings rate</th></tr></thead>
      <tbody>
        ${MONTHLY.map((m) => `<tr><td>${m.month}</td><td class="num">${fmtRp(m.income)}</td><td class="num">${fmtRp(m.expenses)}</td><td class="num pos">${fmtRp(m.income - m.expenses)}</td><td class="num">${pct((m.income - m.expenses) / m.income * 100)}</td></tr>`).join('')}
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>Spending by category — November 2026</h2>
    <table class="table">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th><th class="num">Budget</th><th class="num">Difference</th></tr></thead>
      <tbody>
        ${CATEGORIES.map((c) => {
          const s = spent[c.id];
          const diff = state.budgets[c.id] - s;
          return `<tr><td><span class="dot" style="background:${c.color}"></span> ${esc(c.label)}</td><td class="num">${fmtRp(s)}</td><td class="num">${pct(s / t.expenses * 100)}</td><td class="num">${fmtRp(state.budgets[c.id])}</td><td class="num ${diff < 0 ? 'neg' : 'pos'}">${fmtRp(diff)}</td></tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${fmtRp(t.expenses)}</strong></td><td class="num"><strong>100.0%</strong></td><td class="num"><strong>${fmtRp(t.budgetTotal)}</strong></td><td class="num"><strong>${fmtRp(t.budgetTotal - t.expenses)}</strong></td></tr></tfoot>
    </table>
    <p>
      <button class="btn" id="dl-tx" type="button">Download transactions (CSV)</button>
      <button class="btn" id="dl-months" type="button">Download monthly summary (CSV)</button>
    </p>
  </section>

  <section class="card">
    <h2>What the numbers say</h2>
    <ul class="notes">
      <li><strong>Groceries are the biggest cost</strong> — ${fmtRp(spent.groceries)}, ${(spent.groceries / t.expenses * 100).toFixed(1)}% of November spending, but still ${fmtRp(state.budgets.groceries - spent.groceries)} under budget.</li>
      <li><strong>Education is the second biggest</strong> — ${fmtRp(spent.education)} for two children's school fees, books and tutoring.</li>
      <li><strong>The household saves every month.</strong> Six months in a row the leftover stayed above ${fmtRp(1200000)}; November's ${fmtRp(t.remaining)} is the best month of the half-year.</li>
      <li><strong>Two bills are still open</strong> — BPJS (${fmtRp(150000)}, Nov 27) and the motorcycle instalment (${fmtRp(850000)}, Nov 28) — together ${fmtRp(1000000)}, covered by the leftover.</li>
    </ul>
  </section>`;
}

export function bindReports(state) {
  document.getElementById('dl-tx').addEventListener('click', () => {
    downloadCsv('rumahku-transactions-nov-2026.csv',
      ['Date', 'Description', 'Category', 'Type', 'Amount (Rp)'],
      [...state.transactions].sort((a, b) => a.date.localeCompare(b.date)).map((x) => [
        x.date, x.desc, x.type === 'income' ? 'Income' : categoryById(x.category).label, x.type, x.amount,
      ]));
  });
  document.getElementById('dl-months').addEventListener('click', () => {
    downloadCsv('rumahku-monthly-summary-2026.csv',
      ['Month', 'Income (Rp)', 'Expenses (Rp)', 'Saved (Rp)'],
      MONTHLY.map((m) => [m.month, m.income, m.expenses, m.income - m.expenses]));
  });
}
