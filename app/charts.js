// RumahKu Budget — small hand-drawn SVG charts. No libraries, no network:
// every chart is built from the numbers passed in, as plain SVG markup.

const NS = 'http://www.w3.org/2000/svg';

// Donut chart: one ring segment per slice. `slices` is an array of
// { label, value, color }. Returns an SVG string with a legend-free ring;
// the caller prints its own legend so labels stay readable.
export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const parts = slices
    .filter((x) => x.value > 0)
    .map((x) => {
      const frac = x.value / total;
      const len = Math.max(frac * circ - 2, 0.5);
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.color}" stroke-width="26" stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-offset}" />`;
      offset += frac * circ;
      return seg;
    })
    .join('');
  const hole = `<circle cx="${cx}" cy="${cy}" r="${r - 20}" style="fill:var(--card)" />`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category" xmlns="${NS}">${parts}${hole}</svg>`;
}

// Grouped vertical bar chart: income vs expenses per month. `rows` is an
// array of { label, income, expenses }. Values are scaled to the largest
// number in the set; the axis labels are real rupiah in millions.
export function monthlyBarChart(rows, width = 640, height = 260) {
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.expenses)));
  const padL = 58;
  const padB = 30;
  const padT = 14;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(26, groupW / 3);
  const y = (v) => padT + plotH - (v / max) * plotH;

  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    const label = `Rp ${(max * f / 1e6).toFixed(1)} jt`;
    return `<line x1="${padL}" y1="${gy}" x2="${width - 12}" y2="${gy}" stroke="#e5e0d8" stroke-width="1" /><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#6b7280">${label}</text>`;
  }).join('');

  const bars = rows.map((r, i) => {
    const gx = padL + i * groupW + groupW / 2;
    return `<rect x="${gx - barW - 3}" y="${y(r.income)}" width="${barW}" height="${padT + plotH - y(r.income)}" rx="3" fill="#0f766e" />`
      + `<rect x="${gx + 3}" y="${y(r.expenses)}" width="${barW}" height="${padT + plotH - y(r.expenses)}" rx="3" fill="#f59e0b" />`
      + `<text x="${gx}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#374151">${r.label}</text>`;
  }).join('');

  const legend = `<g font-size="12" fill="#374151">`
    + `<rect x="${padL}" y="0" width="10" height="10" fill="#0f766e" /><text x="${padL + 15}" y="10">Income</text>`
    + `<rect x="${padL + 90}" y="0" width="10" height="10" fill="#f59e0b" /><text x="${padL + 105}" y="10">Expenses</text></g>`;

  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Monthly income versus expenses" xmlns="${NS}">${legend}${grid}${bars}</svg>`;
}

// Horizontal bar used for a single value against a maximum (budget usage,
// savings progress). Pure HTML so the bar can sit inside a table cell.
export function hbar(value, max, color) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return `<div class="hbar" role="img" aria-label="${w.toFixed(0)} percent"><span style="width:${w.toFixed(1)}%;background:${color}"></span></div>`;
}
