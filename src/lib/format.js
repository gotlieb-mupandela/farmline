// Currency is always N$ with no space, e.g. N$4,850 or N$8.50/kg.
export function money(value, { decimals } = {}) {
  const n = Number(value) || 0;
  const frac = decimals ?? (Number.isInteger(n) ? 0 : 2);
  const sign = n < 0 ? '-' : '';
  return (
    sign +
    'N$' +
    Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: frac, maximumFractionDigits: frac })
  );
}

export function perUnit(price, unit = 'kg', opts) {
  return `${money(price, opts)}/${unit}`;
}

export function qty(n, unit = 'kg') {
  const num = Number(n) || 0;
  if (unit === 'kg') return `${num.toLocaleString('en-US')}kg`;
  const label = unit === 'bunch' ? (num === 1 ? 'bunch' : 'bunches') : unit;
  return `${num.toLocaleString('en-US')} ${label}`;
}

export function tonnes(kg) {
  if (kg >= 1000) {
    const t = kg / 1000;
    return `${Number.isInteger(t) ? t : t.toFixed(1)} ${t === 1 ? 'tonne' : 'tonnes'}`;
  }
  return `${kg}kg`;
}

const DAY = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const DM = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

/** "Fri 22 Nov" style label from an ISO date (yyyy-mm-dd). */
export function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return `${DAY.format(d)} ${DM.format(d)}`;
}

export function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Trigger a client-side download of generated text (CSV, delivery notes, invoices). */
export function downloadText(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function nextId(prefix, existing) {
  const nums = existing
    .map((x) => Number(String(x).replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n));
  return `${prefix}${Math.max(1000, ...nums) + 1}`;
}

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
