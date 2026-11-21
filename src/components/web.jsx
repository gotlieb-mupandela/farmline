import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from './ui.jsx';
import { useStore } from '../store/AppStore.jsx';
import { cx } from '../lib/format.js';

const BUYER_NAV = [
  { to: '/buyer', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/buyer/marketplace', icon: 'storefront', label: 'Marketplace' },
  { to: '/buyer/requests', icon: 'campaign', label: 'Requests' },
  { to: '/buyer/orders', icon: 'receipt_long', label: 'Orders' },
  { to: '/buyer/deliveries', icon: 'local_shipping', label: 'Deliveries' },
  { to: '/buyer/suppliers', icon: 'groups', label: 'Suppliers' },
  { to: '/buyer/compliance', icon: 'verified', label: 'Compliance' },
  { to: '/buyer/payments', icon: 'payments', label: 'Payments' },
  { to: '/buyer/analytics', icon: 'bar_chart', label: 'Analytics' },
  { to: '/buyer/settings', icon: 'settings', label: 'Settings' },
];

const ADMIN_NAV = [
  { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin/farmers', icon: 'agriculture', label: 'Farmers' },
  { to: '/admin/agents', icon: 'support_agent', label: 'Agents' },
  { to: '/admin/buyers', icon: 'storefront', label: 'Buyers' },
  { to: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { to: '/admin/logistics', icon: 'local_shipping', label: 'Loads & logistics' },
  { to: '/admin/payments', icon: 'payments', label: 'Payments' },
  { to: '/admin/sms', icon: 'sms', label: 'SMS logs' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

function Sidebar({ brand, brandIcon, items, label, footer }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <aside className="w-full lg:w-64 shrink-0 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen bg-surface-card clay-card p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 z-30">
      <div className="flex items-center justify-between gap-3">
        <Link to={items[0].to} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center clay-btn-primary">
            <Icon name={brandIcon} size={22} />
          </div>
          <span className="font-headline text-headline-md text-primary">{brand}</span>
        </Link>
        <button
          type="button"
          className="lg:hidden w-11 h-11 rounded-full bg-surface-elevated text-primary flex items-center justify-center press"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      <nav aria-label={label} className={cx('flex-col gap-1.5', open ? 'flex' : 'hidden lg:flex')}>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              cx(
                'rounded-full px-4 py-2.5 flex items-center gap-3 font-label text-label-md transition-colors duration-state-change',
                isActive ? 'bg-primary text-on-primary clay-btn-primary' : 'text-on-surface-variant hover:bg-surface-elevated hover:text-primary',
              )
            }
          >
            <Icon name={it.icon} size={20} />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
      {footer && <div className={cx('mt-auto', open ? 'block' : 'hidden lg:block')}>{footer}</div>}
    </aside>
  );
}

/** Buyer portal shell: sidebar, top bar (search, notifications, account) and drawer. */
export function BuyerLayout() {
  const { state } = useStore();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState('');
  const drawerOpen = params.get('notifications') === '1';
  const unread = state.buyerNotifications.some((n) => !n.read);
  const cartCount = state.cart.length;

  const setDrawer = (open) => {
    const next = new URLSearchParams(params);
    if (open) next.set('notifications', '1');
    else next.delete('notifications');
    setParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-surface">
      <Sidebar
        brand="FarmLine"
        brandIcon="eco"
        items={BUYER_NAV}
        label="Buyer navigation"
        footer={
          <Link to="/buyer/team" className="flex items-center gap-3 rounded-2xl bg-surface-elevated p-3 press">
            <Icon name="group_add" className="text-primary" />
            <span className="font-label text-label-md">Team &amp; users</span>
          </Link>
        }
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <form
            role="search"
            className="clay-card bg-surface-card rounded-full px-5 py-2.5 flex items-center gap-3 w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/buyer/marketplace?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" size={20} className="text-primary" />
            <label htmlFor="global-search" className="sr-only">
              Search produce, regions, orders
            </label>
            <input
              id="global-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search produce, regions, orders..."
              className="w-full bg-transparent border-0 p-0 font-body text-body-md focus:ring-0"
            />
          </form>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/buyer/checkout"
              aria-label={`Current order, ${cartCount} items`}
              className="clay-card bg-surface-card text-primary w-11 h-11 rounded-full flex items-center justify-center relative press"
            >
              <Icon name="shopping_basket" size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-on-accent font-label text-label-sm flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={unread ? 'Notifications, unread' : 'Notifications'}
              onClick={() => setDrawer(true)}
              className="clay-card bg-surface-card text-primary w-11 h-11 rounded-full flex items-center justify-center relative press"
            >
              <Icon name="notifications" size={22} />
              {unread && <span className="w-2.5 h-2.5 rounded-full bg-accent absolute top-2.5 right-2.5" />}
            </button>
            <Link to="/buyer/settings" className="clay-card bg-surface-card rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2.5 press">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label text-label-sm">SW</span>
              <span className="font-title text-title-md text-on-surface hidden sm:inline">Spar Windhoek</span>
            </Link>
          </div>
        </header>
        <main className="px-4 sm:px-6 lg:px-8 pb-10 flex flex-col gap-6 min-w-0 animate-surface-enter" key={location.pathname}>
          <Outlet />
        </main>
      </div>
      {drawerOpen && <NotificationsDrawer onClose={() => setDrawer(false)} />}
    </div>
  );
}

const DRAWER_FILTERS = ['All', 'Orders', 'Deliveries', 'Payments'];
const NOTE_TONES = {
  primary: 'bg-primary text-on-primary',
  'primary-soft': 'bg-primary-container text-primary',
  accent: 'bg-accent text-on-accent',
};

/** Screen 38 — notifications slide-over panel. */
function NotificationsDrawer({ onClose }) {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const items = state.buyerNotifications.filter((n) => filter === 'All' || n.type === filter);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Notifications">
      <button type="button" aria-label="Close notifications" className="absolute inset-0 bg-clay-shadow/20 cursor-default" onClick={onClose} />
      <aside className="relative w-full max-w-md clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-5 animate-drawer-enter overflow-y-auto">
        <header className="flex items-center justify-between gap-3">
          <h1 className="font-headline text-headline-md text-primary">Notifications</h1>
          <div className="flex items-center gap-2">
            <button type="button" onClick={actions.readAllBuyerNotifications} className="font-label text-label-md text-primary underline underline-offset-4">
              Mark all as read
            </button>
            <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-surface-elevated text-primary flex items-center justify-center press">
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>
        <div className="flex gap-2 flex-wrap">
          {DRAWER_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cx(
                'rounded-full px-3.5 py-1.5 font-label text-label-sm press',
                filter === f ? 'bg-primary text-on-primary' : 'bg-surface-elevated',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {items.length === 0 && <p className="font-body text-body-md text-on-surface-variant">Nothing here yet.</p>}
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                actions.readBuyerNotification(n.id);
                navigate(n.to);
              }}
              className="bg-surface-elevated rounded-2xl p-4 flex items-start gap-3 text-left press hover:ring-2 hover:ring-primary-container"
            >
              <span className={cx('w-10 h-10 rounded-full flex items-center justify-center shrink-0', NOTE_TONES[n.tone])}>
                <Icon name={n.icon} size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-title text-title-md">{n.title}</span>
                <span className="block font-label text-label-sm text-on-surface-variant">{n.time}</span>
              </span>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5" aria-label="Unread" />}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

/** Ops admin shell. */
export function AdminLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-surface">
      <Sidebar brand="FarmLine Ops" brandIcon="admin_panel_settings" items={ADMIN_NAV} label="Admin navigation" />
      <main key={location.pathname} className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 min-w-0 animate-surface-enter">
        <Outlet />
      </main>
    </div>
  );
}

/** Page title row for web screens. */
export function PageHeader({ title, subtitle, back, children }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {back && (
          <Link to={back} aria-label="Back" className="clay-card bg-surface-card text-primary w-11 h-11 rounded-full flex items-center justify-center press shrink-0">
            <Icon name="arrow_back" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-primary">{title}</h1>
          {subtitle && <p className="font-label text-label-md text-on-surface-variant">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}

/** Card used for KPI tiles on dashboards. */
export function StatCard({ label, value, tone = 'text-primary', children }) {
  return (
    <div className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col justify-between gap-2">
      <span className="font-label text-label-md text-on-surface-variant">{label}</span>
      <span className={cx('font-headline text-headline-lg tabular-nums', tone)}>{value}</span>
      {children}
    </div>
  );
}

/** Generic placeholder for nav destinations the designs don't cover yet. */
export function ComingSoon({ title = 'Coming soon', icon = 'construction' }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="clay-card bg-surface-card rounded-2xl p-10 flex flex-col items-center text-center gap-3 max-w-xl">
        <div className="w-14 h-14 rounded-full bg-accent-container text-accent-text flex items-center justify-center">
          <Icon name={icon} size={28} />
        </div>
        <p className="font-title text-title-lg text-on-surface">This section is being built</p>
        <p className="font-body text-body-md text-on-surface-variant">The screens for this area are not designed yet.</p>
      </div>
    </>
  );
}
