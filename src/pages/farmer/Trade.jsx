import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, EmptyState, Icon, Img, Segmented, StepDots } from '../../components/ui.jsx';
import { MobileScreen, ScreenHeader } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { ORDER_STEPS } from '../../data/seed.js';
import { cx, money, qty } from '../../lib/format.js';
import { STAGE_BADGE, STAGE_INDEX, cropName, orderTab, orderWhen, stageDots } from './shared.js';

/* 11. Buyer requests ------------------------------------------------------- */
const REQUEST_FILTERS = ['All', 'Near me', 'My crops'];

export function BuyerRequests() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const items = state.buyerRequests.filter((r) => {
    if (filter === 'Near me') return r.distance <= 100;
    if (filter === 'My crops') return state.farmer.crops.includes(r.crop);
    return true;
  });

  return (
    <MobileScreen nav="farmer" padded={false}>
      <header className="px-page-margin pt-gutter-xl flex flex-col gap-gutter-md">
        <h1 className="font-headline text-headline-lg-mobile text-primary">Buyers looking for produce</h1>
        <div className="flex items-center gap-gutter-sm">
          {REQUEST_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cx(
                'press rounded-full px-4 py-2 font-label text-label-md',
                filter === f ? 'bg-primary text-on-primary' : 'clay-card bg-surface-card text-on-surface',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      <main className="px-page-margin flex flex-col gap-gutter-md">
        {items.length === 0 && <EmptyState icon="campaign" title="No requests here yet" body="Try another filter." />}
        {items.map((r, idx) => {
          const offered = state.offers.includes(r.id);
          return (
            <article key={r.id} className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
              <div className="flex items-start justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-md">
                  <div
                    className={cx(
                      'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                      idx % 2 ? 'bg-accent-container text-accent-text' : 'bg-primary-container text-primary',
                    )}
                  >
                    <Icon name={r.icon} size={24} />
                  </div>
                  <div>
                    <h2 className="font-title text-title-lg text-on-surface">{r.buyer}</h2>
                    <p className="font-label text-label-sm text-on-surface-variant">
                      {r.type} · {r.distance}km away
                    </p>
                  </div>
                </div>
                <Badge tone="accent" className="text-label-md tabular-nums">
                  N${r.price}/kg
                </Badge>
              </div>
              <p className="font-body text-body-md text-on-surface">
                Needs <strong className="font-headline">{r.need}</strong> · Due {r.due}
              </p>
              <button
                type="button"
                aria-pressed={offered}
                onClick={() => {
                  actions.offerSupply(r.id);
                  if (!offered) toast(`Offer sent to ${r.buyer}. Your agent will call you`, { icon: 'send' });
                }}
                className={cx(
                  'w-full rounded-full py-3 min-h-[48px] font-label text-label-lg press inline-flex items-center justify-center gap-gutter-xs',
                  offered ? 'bg-primary-container text-on-primary-container' : 'clay-btn-primary bg-primary text-on-primary',
                )}
              >
                {offered && <Icon name="check" size={20} />}
                {offered ? 'Offer sent' : 'I can supply'}
              </button>
            </article>
          );
        })}
      </main>
    </MobileScreen>
  );
}

/* 12. Orders --------------------------------------------------------------- */
export function FarmerOrders() {
  const { state } = useStore();
  const [tab, setTab] = useState('In progress');
  const items = state.farmerOrders.filter((o) => orderTab(o) === tab);

  return (
    <MobileScreen nav="farmer" padded={false}>
      <header className="px-page-margin pt-gutter-xl flex flex-col gap-gutter-md">
        <h1 className="font-headline text-headline-lg-mobile text-primary">Orders</h1>
        <Segmented options={['New', 'In progress', 'Completed']} value={tab} onChange={setTab} label="Order status" />
      </header>
      <main className="px-page-margin flex flex-col gap-gutter-md">
        {items.length === 0 && <EmptyState icon="local_shipping" title={`No ${tab.toLowerCase()} orders`} />}
        {items.map((o) => {
          const badge = STAGE_BADGE[o.stage];
          return (
            <Link key={o.id} to={`/farmer/orders/${o.id}`} className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md transition-transform duration-state-change active:scale-[0.98]">
              <div className="flex items-start justify-between gap-gutter-sm">
                <div>
                  <h2 className="font-title text-title-lg text-on-surface">{o.buyer}</h2>
                  <p className="font-body text-body-md text-on-surface-variant tabular-nums">
                    {cropName(o.crop)} · {qty(o.qty)}
                  </p>
                </div>
                <span className="font-title text-title-lg text-accent-text tabular-nums">{money(o.total)}</span>
              </div>
              <div className="flex items-center justify-between gap-gutter-sm">
                <span className="font-label text-label-md text-on-surface-variant">{orderWhen(o)}</span>
                <Badge tone={badge.tone}>{badge.label}</Badge>
              </div>
              <StepDots total={5} filled={stageDots(o.stage)} />
            </Link>
          );
        })}
      </main>
    </MobileScreen>
  );
}

/* 13. Order detail --------------------------------------------------------- */
export function FarmerOrderDetail() {
  const { id } = useParams();
  const { state, actions } = useStore();
  const toast = useToast();
  const order = state.farmerOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <MobileScreen>
        <ScreenHeader title="Order" back="/farmer/orders" />
        <EmptyState icon="search_off" title="Order not found" />
      </MobileScreen>
    );
  }

  const current = STAGE_INDEX[order.stage];
  const ready = state.readyConfirmed.includes(order.id);
  const canConfirm = current < STAGE_INDEX.collected;
  const agent = state.farmer.agent;

  return (
    <MobileScreen>
      <ScreenHeader title={`Order #${order.id}`} size="md" back="/farmer/orders" />
      <main className="flex flex-col gap-gutter-lg">
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex items-center justify-between gap-gutter-md">
          <div>
            <h2 className="font-title text-title-lg text-on-surface">{order.buyer}</h2>
            <p className="font-body text-body-md text-on-surface-variant tabular-nums">
              {cropName(order.crop)} · {qty(order.qty)}
            </p>
          </div>
          <span className="bg-accent text-on-accent rounded-full px-3.5 py-1.5 font-headline text-title-md tabular-nums">{money(order.total)}</span>
        </div>

        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-primary">Order tracking</h2>
          <ol className="flex flex-col gap-gutter-md">
            {ORDER_STEPS.map((step, i) => {
              // Steps up to the current stage are done; the next one is "in progress".
              const done = i <= current;
              const next = i === current + 1;
              return (
                <li key={step.key} className="flex items-center gap-gutter-md" aria-current={next ? 'step' : undefined}>
                  {done ? (
                    <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <Icon name="check" size={18} />
                    </span>
                  ) : next ? (
                    <span className="w-8 h-8 rounded-full border-2 border-primary bg-surface-elevated text-primary flex items-center justify-center shrink-0">
                      <Icon name={step.key === 'collected' ? 'local_shipping' : step.key === 'paid' ? 'payments' : 'more_horiz'} size={16} />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full border-2 border-outline bg-surface-elevated shrink-0" />
                  )}
                  <span className={cx('font-body text-body-md tabular-nums', done ? 'text-on-surface' : 'text-on-surface-variant')}>{step.label(order)}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="clay-card bg-surface-card rounded-2xl p-gutter-lg flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <Img src={agent.image} alt={agent.name} className="w-12 h-12 rounded-full object-cover shrink-0" fallbackIcon="person" />
            <div>
              <p className="font-title text-title-md text-on-surface">{agent.name}</p>
              <p className="font-label text-label-sm text-on-surface-variant">Your field agent</p>
            </div>
          </div>
          <a href={`tel:${agent.phone.replace(/\s/g, '')}`} aria-label={`Call ${agent.name}`} className="btn-tonal px-4 py-2.5 text-label-md text-primary">
            <Icon name="call" size={18} />
            <span>Call</span>
          </a>
        </div>

        {order.pool > 0 && (
          <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-lg flex items-center gap-gutter-md">
            <Icon name="groups" size={24} className="text-accent-text" />
            <p className="font-body text-body-md tabular-nums">
              Combined load: your {qty(order.qty)} + {order.pool} nearby farmers
            </p>
          </div>
        )}

        {order.stage === 'paid' ? (
          <Link to="/farmer/wallet" className="btn-outline w-full py-4 min-h-[52px]">
            See payment in wallet
          </Link>
        ) : (
          canConfirm && (
            <button
              type="button"
              disabled={ready}
              onClick={() => {
                actions.confirmReady(order.id);
                toast(`${agent.name} knows your produce is ready`, { icon: 'local_shipping' });
              }}
              className="btn-primary w-full py-4 min-h-[52px]"
            >
              {ready && <Icon name="check" size={20} />}
              {ready ? 'Ready for collection' : 'Confirm ready for collection'}
            </button>
          )
        )}
      </main>
    </MobileScreen>
  );
}
