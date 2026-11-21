import { Link, useNavigate } from 'react-router-dom';
import { Badge, CropTile, Icon, Img } from '../../components/ui.jsx';
import { MobileScreen } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { IMAGES } from '../../data/images.js';
import { money, qty } from '../../lib/format.js';
import { STAGE_BADGE, cropName } from './shared.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function FarmerHome() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const { farmer } = state;
  const unread = state.farmerNotifications.filter((n) => !n.read).length;
  const active = state.listings.filter((l) => ['waiting', 'ordered', 'partial'].includes(l.status)).slice(0, 2);
  const latest = state.farmerOrders.find((o) => o.stage !== 'paid' && o.stage !== 'confirmed') ?? state.farmerOrders[0];

  return (
    <MobileScreen nav="farmer" padded={false}>
      <header className="px-page-margin pt-gutter-xl flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-md min-w-0">
          <Link to="/farmer/profile" className="shrink-0">
            <Img src={IMAGES.maria} alt={farmer.name} className="w-12 h-12 rounded-full object-cover ring-4 ring-surface-card clay-btn-secondary" fallbackIcon="person" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-headline text-headline-lg-mobile text-primary leading-tight">
              {greeting()}, {farmer.firstName}
            </h1>
            <p className="font-label text-label-md text-on-surface-variant flex items-center gap-gutter-xs">
              <Icon name="location_on" size={16} className="text-primary" />
              <span>
                {farmer.village}, {farmer.region}
              </span>
            </p>
          </div>
        </div>
        <Link
          to="/farmer/notifications"
          aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
          className="clay-btn-secondary press bg-surface-card text-primary w-12 h-12 rounded-full inline-flex items-center justify-center relative shrink-0"
        >
          <Icon name="notifications" size={24} />
          {unread > 0 && <span aria-hidden="true" className="w-3 h-3 rounded-full bg-accent ring-2 ring-surface-card absolute top-2.5 right-2.5" />}
        </Link>
      </header>

      <main className="px-page-margin flex flex-col gap-gutter-lg">
        {state.offline && (
          <button
            type="button"
            role="status"
            onClick={() => {
              actions.syncNow();
              toast('Synced. Everything is up to date', { icon: 'cloud_done' });
            }}
            className="bg-accent-container text-on-accent-container rounded-full px-gutter-lg py-gutter-sm flex items-center justify-between gap-gutter-sm clay-btn-secondary press text-left"
          >
            <span className="flex items-center gap-gutter-sm">
              <Icon name="cloud_off" size={18} className="text-accent-text" />
              <span className="font-label text-label-md">Saved offline, will sync when connected</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
          </button>
        )}

        <Link to="/farmer/wallet" className="clay-card press bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-sm">
          <span className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-title-md text-on-surface-variant">This month you earned</h2>
            <Badge tone="primary-soft">
              <Icon name="trending_up" size={16} />
              <span className="tabular-nums">+{farmer.monthChange}%</span>
            </Badge>
          </span>
          <span className="flex items-center gap-gutter-md pt-gutter-xs">
            <span className="w-12 h-12 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="payments" size={26} />
            </span>
            <span className="font-display text-display-lg-mobile text-accent-text tabular-nums">{money(farmer.monthEarned)}</span>
          </span>
        </Link>

        <section aria-label="Quick actions" className="grid grid-cols-3 gap-gutter-md items-stretch">
          <QuickAction to="/farmer/sell" icon="add_circle" label="Sell produce" primary />
          <QuickAction to="/farmer/requests" icon="campaign" label="Buyer requests" iconTone="bg-accent text-on-accent" />
          <QuickAction to="/farmer/wallet" icon="account_balance_wallet" label="My payments" iconTone="bg-primary-container text-primary" />
        </section>

        <section className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-primary">Active listings</h2>
            <Link to="/farmer/listings" className="font-label text-label-md text-primary underline underline-offset-4">
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-gutter-md">
            {active.length === 0 && (
              <Link to="/farmer/sell" className="clay-card bg-surface-card rounded-xl p-gutter-lg font-body text-body-md text-on-surface-variant">
                No active listings. Tap to sell produce.
              </Link>
            )}
            {active.map((l) => (
              <Link
                key={l.id}
                to={`/farmer/listings/${l.id}`}
                className="clay-card bg-surface-card rounded-xl p-gutter-lg flex items-center justify-between gap-gutter-md transition-transform duration-state-change active:scale-[0.98]"
              >
                <div className="flex items-center gap-gutter-md">
                  <CropTile crop={l.crop} />
                  <div>
                    <h3 className="font-title text-title-md text-on-surface">{cropName(l.crop)}</h3>
                    <p className="font-body text-body-md text-on-surface-variant tabular-nums">{qty(l.qty, l.unit)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-gutter-sm shrink-0">
                  <Badge tone={l.ready === 'today' ? 'accent' : 'primary-soft'}>{l.readyShort}</Badge>
                  <Icon name="chevron_right" className="text-on-surface-variant" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {latest && (
          <section className="flex flex-col gap-gutter-md">
            <h2 className="font-headline text-headline-md text-primary">Latest order</h2>
            <article className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
              <header className="flex items-start justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-md">
                  <div className="w-12 h-12 rounded bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <Icon name="storefront" size={24} />
                  </div>
                  <div>
                    <h3 className="font-title text-title-lg text-on-surface">{latest.buyer}</h3>
                    <p className="font-body text-body-md text-on-surface-variant tabular-nums">
                      {qty(latest.qty)} {cropName(latest.crop).toLowerCase()}
                    </p>
                  </div>
                </div>
                <Badge tone="primary-soft">{latest.stage === 'collected' ? STAGE_BADGE.collected.label : 'Confirmed'}</Badge>
              </header>
              <button
                type="button"
                onClick={() => navigate(`/farmer/orders/${latest.id}`)}
                className="bg-surface-elevated rounded px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-sm press"
              >
                <span className="flex items-center gap-gutter-sm text-on-surface">
                  <Icon name="local_shipping" size={20} className="text-primary" />
                  <span className="font-body text-body-md tabular-nums">{latest.collection}</span>
                </span>
                <Icon name="arrow_forward" size={20} className="text-primary" />
              </button>
            </article>
          </section>
        )}

        <Link to="/farmer/prices" className="clay-card press bg-accent-container text-on-accent-container rounded-2xl p-gutter-lg flex items-center gap-gutter-md">
          <span className="w-11 h-11 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0">
            <Icon name="auto_awesome" size={22} />
          </span>
          <span className="flex-1 font-body text-body-md">See market prices this week</span>
          <Icon name="chevron_right" className="text-accent-text" />
        </Link>
      </main>
    </MobileScreen>
  );
}

function QuickAction({ to, icon, label, primary, iconTone }) {
  return (
    <Link
      to={to}
      className={
        primary
          ? 'clay-btn-primary press bg-primary text-on-primary rounded-xl p-gutter-md min-h-[104px] flex flex-col items-center justify-center gap-gutter-sm text-center'
          : 'clay-card press bg-surface-card text-on-surface rounded-xl p-gutter-md min-h-[104px] flex flex-col items-center justify-center gap-gutter-sm text-center'
      }
    >
      <span className={`w-11 h-11 rounded-full flex items-center justify-center ${primary ? 'bg-on-primary/15' : iconTone}`}>
        <Icon name={icon} size={24} />
      </span>
      <span className="font-label text-label-md leading-tight">{label}</span>
    </Link>
  );
}
