import { Link } from 'react-router-dom';
import { Badge, Donut, Img, Sparkline } from '../../components/ui.jsx';
import { StatCard } from '../../components/web.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { CROPS } from '../../data/seed.js';
import { money, perUnit, qty, tonnes } from '../../lib/format.js';

const WEEKLY = [9.8, 11.2, 12.0, 13.9, 14.6, 16.8, 18.1, 19.4, 21.5, 23.9];

/* 26. Buyer dashboard ------------------------------------------------------ */
export default function BuyerDashboard() {
  const { state, actions } = useStore();
  const toast = useToast();
  const open = state.buyerOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const upcoming = [
    { label: 'Butternut · 500kg', when: 'Fri 08:00 · Omusati', status: 'Confirmed', to: '/buyer/orders/FL-1042' },
    { label: 'Red onions · 850kg', when: 'Sat 10:30 · Oshana', status: 'In transit', to: '/buyer/orders/FL-1042' },
  ];
  const recommended = state.marketLots.filter((l) => l.grade === 'A').slice(0, 3);

  return (
    <>
      <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-primary">Dashboard overview</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        <StatCard label="Local produce bought (Q4)" value={money(184500)} />
        <Link to="/buyer/compliance" className="clay-card bg-surface-card rounded-2xl p-6 flex items-center justify-between gap-3 press">
          <div>
            <span className="font-label text-label-md text-on-surface-variant">Local sourcing</span>
            <p className="font-headline text-headline-lg text-on-accent-container tabular-nums">52%</p>
            <span className="font-label text-label-sm text-primary">Target 47%</span>
          </div>
          <Donut value={52} />
        </Link>
        <Link to="/buyer/orders" className="press rounded-2xl">
          <StatCard label="Open orders" value={open} />
        </Link>
        <Link to="/buyer/suppliers" className="press rounded-2xl">
          <StatCard label="Farmers supplying you" value="41" />
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-lg text-primary">Weekly local purchases</h2>
            <span className="font-label text-label-md text-accent-text tabular-nums">{money(23900)} this week</span>
          </div>
          <Sparkline values={WEEKLY} width={500} height={160} className="w-full h-44" label="Weekly purchases chart" />
        </div>
        <div className="lg:col-span-5 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-lg text-primary">Upcoming deliveries</h2>
            <Link to="/buyer/deliveries" className="font-label text-label-md text-primary underline underline-offset-4">
              Schedule
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {upcoming.map((d) => (
              <Link key={d.label} to={d.to} className="bg-surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3 press">
                <div>
                  <p className="font-title text-title-md">{d.label}</p>
                  <p className="font-label text-label-sm text-on-surface-variant">{d.when}</p>
                </div>
                <Badge tone={d.status === 'In transit' ? 'accent' : 'primary-soft'}>{d.status}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-title text-title-lg text-primary">Recommended supply near you</h2>
          <Link to="/buyer/marketplace" className="font-label text-label-md text-primary underline underline-offset-4">
            Marketplace
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommended.map((l) => (
            <div key={l.id} className="bg-surface-elevated rounded-2xl p-4 flex items-center justify-between gap-3">
              <Link to={`/buyer/marketplace/${l.id}`} className="flex items-center gap-3 min-w-0">
                <Img src={CROPS[l.crop].image} alt={l.name} className="w-14 h-14 rounded-xl object-cover shrink-0" fallbackIcon={CROPS[l.crop].icon} />
                <div className="min-w-0">
                  <p className="font-title text-title-md truncate">
                    {l.name} · {l.unit === 'kg' ? tonnes(l.available).replace(' tonnes', 't').replace(' tonne', 't') : qty(l.available, l.unit)}
                  </p>
                  <p className="font-label text-label-md text-accent-text tabular-nums">{perUnit(l.price, l.unit)}</p>
                </div>
              </Link>
              <button
                type="button"
                className="press bg-primary text-on-primary rounded-full px-4 py-2 font-label text-label-md shrink-0"
                onClick={() => {
                  actions.addToCart(l.id, l.unit === 'kg' ? 100 : 20);
                  toast(`${l.name} added to your order`, { icon: 'add_shopping_cart', action: { label: 'Checkout', to: '/buyer/checkout' } });
                }}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
