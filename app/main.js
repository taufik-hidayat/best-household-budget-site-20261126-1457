// RumahKu Budget — router and shell. Six pages, one shared household state
// (loaded from localStorage in data.js). The header and footer are static;
// the main element is re-rendered on every hash change, and each page binds
// its own controls after rendering. No network, no framework.

import { META, loadState, resetState } from './data.js';
import {
  viewDashboard, bindDashboard,
  viewTransactions, bindTransactions,
  viewPlanner, bindPlanner,
  viewGoals, bindGoals,
  viewBills, bindBills,
  viewReports, bindReports,
} from './views.js';

const ROUTES = {
  '/': { title: 'Dashboard', view: viewDashboard, bind: bindDashboard },
  '/transactions': { title: 'Income & Expenses', view: viewTransactions, bind: bindTransactions },
  '/planner': { title: 'Budget Planner', view: viewPlanner, bind: bindPlanner },
  '/goals': { title: 'Savings Goals', view: viewGoals, bind: bindGoals },
  '/bills': { title: 'Bills & Recurring', view: viewBills, bind: bindBills },
  '/reports': { title: 'Reports', view: viewReports, bind: bindReports },
};

const app = document.getElementById('app');
let state = loadState();

// Re-render the current page from the (possibly changed) state. Pages that
// edit state call this after saving, so every page always shows fresh numbers.
function rerender() {
  route();
}

function route() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const path = hash.split('?')[0];
  const match = ROUTES[path] ?? ROUTES['/'];
  document.title = `${match.title} — ${META.siteName} · Household Budget`;
  app.innerHTML = match.view(state);
  document.querySelectorAll('nav a').forEach((a) => {
    const active = a.getAttribute('href') === `#${path}`;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  match.bind(state, rerender);
  window.scrollTo(0, 0);
}

document.getElementById('reset-data').addEventListener('click', () => {
  state = resetState();
  route();
});

window.addEventListener('hashchange', route);
route();
