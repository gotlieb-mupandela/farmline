import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './ui.jsx';
import { cx } from '../lib/format.js';

/**
 * 390px mobile frame from the designs. Centered on wider screens so the farmer and
 * agent apps read like a phone, full width on actual phones.
 */
export function MobileScreen({ children, nav, padded = true, className = '', fab }) {
  return (
    <div className="min-h-screen w-full max-w-[390px] mx-auto bg-surface flex flex-col relative sm:shadow-[0_0_0_1px_rgba(138,90,60,0.08)]">
      <div
        className={cx(
          'flex-1 flex flex-col gap-gutter-lg animate-surface-enter',
          padded && 'px-page-margin py-gutter-xl',
          nav && 'pb-28',
          className,
        )}
      >
        {children}
      </div>
      {fab}
      {nav === 'farmer' && <BottomNav items={FARMER_NAV} label="Primary navigation" />}
      {nav === 'agent' && <BottomNav items={AGENT_NAV} label="Agent navigation" />}
    </div>
  );
}

/** Back button + title row used across secondary farmer screens. */
export function ScreenHeader({ title, subtitle, back = -1, right, size = 'lg' }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between gap-gutter-sm">
      <div className="flex items-center gap-gutter-md min-w-0">
        {back !== false && (
          <button type="button" aria-label="Back" className="btn-back" onClick={() => (typeof back === 'string' ? navigate(back) : navigate(back))}>
            <Icon name="arrow_back" size={22} />
          </button>
        )}
        <div className="min-w-0">
          <h1
            className={cx(
              'font-headline text-primary',
              size === 'lg' && 'text-headline-lg-mobile',
              size === 'md' && 'text-headline-md tabular-nums',
              size === 'sm' && 'font-title text-title-lg',
            )}
          >
            {title}
          </h1>
          {subtitle && <p className="font-label text-label-md text-on-surface-variant tabular-nums">{subtitle}</p>}
        </div>
      </div>
      {right}
    </header>
  );
}

const FARMER_NAV = [
  { to: '/farmer/home', icon: 'home', label: 'Home' },
  { to: '/farmer/listings', icon: 'inventory_2', label: 'Listings' },
  { to: '/farmer/orders', icon: 'local_shipping', label: 'Orders' },
  { to: '/farmer/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
  { to: '/farmer/profile', icon: 'person', label: 'Profile' },
];

const AGENT_NAV = [
  { to: '/agent', icon: 'home', label: 'Home', end: true },
  { to: '/agent/farmers', icon: 'groups', label: 'Farmers' },
  { to: '/agent/collections', icon: 'local_shipping', label: 'Collections' },
  { to: '/agent/earnings', icon: 'payments', label: 'Earnings' },
  { to: '/agent/profile', icon: 'person', label: 'Profile' },
];

function BottomNav({ items, label }) {
  return (
    <nav
      aria-label={label}
      className="clay-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-surface-card rounded-t-2xl px-gutter-sm py-gutter-sm z-20"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <ul className="grid grid-cols-5 items-center gap-gutter-xs">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cx(
                  'flex flex-col items-center justify-center gap-gutter-xs py-gutter-xs rounded',
                  isActive ? 'text-primary' : 'text-on-surface-variant',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cx(
                      'rounded-full px-3.5 py-1 flex items-center justify-center transition-colors duration-state-change',
                      isActive && 'bg-primary text-on-primary',
                    )}
                  >
                    <Icon name={it.icon} size={22} />
                  </span>
                  <span className="font-label text-label-sm">{it.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Large +/- stepper used for quantities and weights. */
export function Stepper({ value, onChange, step = 10, min = 0, unit, labelDecrease = 'Decrease', labelIncrease = 'Increase' }) {
  return (
    <div className="flex items-center justify-between gap-gutter-md">
      <button
        type="button"
        aria-label={labelDecrease}
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="clay-card press bg-surface-elevated text-primary w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-40"
      >
        <Icon name="remove" size={28} />
      </button>
      <label className="flex items-baseline justify-center gap-1 min-w-0">
        <span className="sr-only">Amount</span>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="w-28 bg-transparent border-0 p-0 text-center font-display text-display-lg-mobile text-on-surface tabular-nums focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="font-title text-title-lg text-on-surface-variant">{unit}</span>}
      </label>
      <button
        type="button"
        aria-label={labelIncrease}
        onClick={() => onChange(value + step)}
        className="clay-btn-primary press bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center"
      >
        <Icon name="add" size={28} />
      </button>
    </div>
  );
}
