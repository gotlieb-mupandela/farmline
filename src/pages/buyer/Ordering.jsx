import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, Chip, EmptyState, Icon, Img } from '../../components/ui.jsx';
import { PageHeader } from '../../components/web.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { BUYER, BUYER_ORDER_STEPS, CROPS } from '../../data/seed.js';
import { IMAGES } from '../../data/images.js';
import { cx, downloadText, money, perUnit, qty } from '../../lib/format.js';

/* 29. Post a purchase request ---------------------------------------------- */
const REQUEST_CROPS = ['onions', 'butternut', 'tomatoes', 'spinach', 'cabbage'];
const FREQUENCIES = ['One-time', 'Weekly', 'Monthly'];

export function PostRequest() {
  const { actions } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = REQUEST_CROPS.includes(params.get('crop')) ? params.get('crop') : 'onions';
  const [crop, setCrop] = useState(initial);
  const [amount, setAmount] = useState(1000);
  const [price, setPrice] = useState(8);
  const [freq, setFreq] = useState('Weekly');
  const [store, setStore] = useState(BUYER.stores[0]);
  const [date, setDate] = useState('2026-11-29');

  const cropWord = (CROPS[crop].short ?? CROPS[crop].name).toLowerCase();
  const amountWord = amount >= 1000 ? `${amount / 1000} ${amount === 1000 ? 'tonne' : 'tonnes'}` : `${amount}kg`;
  const need = `${amountWord} ${cropWord}${freq === 'One-time' ? '' : ` ${freq.toLowerCase()}`}`;
  const estimate = Math.max(3, Math.round(amount / 45));
  const storeShort = store.replace(' Central', '');

  return (
    <>
      <PageHeader title="Post a purchase request" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          className="lg:col-span-7 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            actions.publishRequest({
              buyer: storeShort,
              type: 'Supermarket',
              icon: 'storefront',
              distance: 420,
              crop,
              need,
              due: new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', ''),
              price,
            });
            toast(`Request published to ${estimate} nearby farmers`, { icon: 'campaign', action: { label: 'Farmer view', to: '/farmer/requests' } });
            navigate('/buyer');
          }}
        >
          <div className="flex flex-col gap-2">
            <span className="field-label">Crop</span>
            <div className="flex flex-wrap gap-2">
              {REQUEST_CROPS.map((c) => (
                <Chip key={c} active={crop === c} onClick={() => setCrop(c)} icon={CROPS[c].icon} className="px-4">
                  {CROPS[c].name}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField id="req-qty" label="Quantity" value={amount} onChange={setAmount} suffix="kg" step={50} />
            <NumberField id="req-price" label="Target price per kg" value={price} onChange={setPrice} prefix="N$" step={0.5} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="field-label">Frequency</span>
            <div className="flex gap-2 flex-wrap">
              {FREQUENCIES.map((f) => (
                <Chip key={f} active={freq === f} onClick={() => setFreq(f)} className="px-4">
                  {f}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="req-store" className="field-label">
                Delivery location
              </label>
              <select id="req-store" value={store} onChange={(e) => setStore(e.target.value)} className="field-web">
                {BUYER.stores.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="req-date" className="field-label">
                First delivery date
              </label>
              <input id="req-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field-web" />
            </div>
          </div>
          <button type="submit" disabled={amount <= 0} className="btn-primary py-4 mt-2">
            Publish request
          </button>
        </form>
        <aside className="lg:col-span-5 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-5 lg:sticky lg:top-6">
          <span className="font-label text-label-md text-on-surface-variant">Live farmer preview</span>
          <div className="bg-surface-elevated rounded-2xl p-5 flex flex-col gap-3">
            <p className="font-title text-title-lg text-primary">Farmers will see:</p>
            <p className="font-body text-body-lg">
              “{storeShort} needs <strong className="font-headline">{need}</strong>, <strong className="text-accent-text">{perUnit(price)}</strong>”
            </p>
            <p className="font-label text-label-sm text-on-surface-variant">Sent by app and SMS in the farmer’s own language.</p>
          </div>
          <div className="bg-accent-container text-on-accent-container rounded-2xl p-5 flex items-center justify-between gap-3">
            <span className="font-body text-body-md">Estimated farmers nearby who can supply</span>
            <span className="bg-accent text-on-accent rounded-full px-4 py-1.5 font-headline text-headline-md tabular-nums">{estimate}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function NumberField({ id, label, value, onChange, prefix, suffix, step = 1 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl bg-surface-elevated border border-outline-variant px-4 focus-within:border-primary">
        {prefix && <span className="font-label text-label-md text-primary">{prefix}</span>}
        <input
          id={id}
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent border-0 px-0 py-3 font-body text-body-md tabular-nums focus:ring-0"
        />
        {suffix && <span className="font-label text-label-md text-on-surface-variant">{suffix}</span>}
      </div>
    </div>
  );
}

/* 30. Order review & checkout ---------------------------------------------- */
const LOGISTICS = 2500;
const TERMS = ['On delivery', '7 days', '30 days'];
const serviceFee = (subtotal) => Math.round((subtotal * 0.048) / 10) * 10;

export function Checkout() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [delivery, setDelivery] = useState(`${BUYER.stores[0]} · Mon 25 Nov`);
  const [terms, setTerms] = useState('On delivery');

  const lines = state.cart
    .map((c) => {
      const lot = state.marketLots.find((l) => l.id === c.lotId);
      return lot ? { ...c, lot, total: c.qty * lot.price } : null;
    })
    .filter(Boolean);
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const fee = serviceFee(subtotal);
  const total = subtotal ? subtotal + fee + LOGISTICS : 0;

  if (!lines.length) {
    return (
      <>
        <PageHeader title="Order review & checkout" back="/buyer/marketplace" />
        <EmptyState icon="shopping_basket" title="Your order is empty" body="Add produce from the marketplace to get started." action={<Link to="/buyer/marketplace" className="btn-primary px-5 py-2.5 text-label-md">Browse marketplace</Link>} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Order review & checkout" back="/buyer/marketplace" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-7 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-5">
          <h2 className="font-title text-title-lg text-primary">Order items ({lines.length})</h2>
          {lines.map(({ lot, qty: amount, total: lineTotal }) => (
            <div key={lot.id} className="bg-surface-elevated rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Img src={CROPS[lot.crop].image} alt={lot.name} className="w-16 h-16 rounded-xl object-cover" fallbackIcon={CROPS[lot.crop].icon} />
                <div>
                  <p className="font-title text-title-md">
                    {CROPS[lot.crop].name} (Grade {lot.grade})
                  </p>
                  <p className="font-label text-label-md text-on-surface-variant tabular-nums">
                    {perUnit(lot.price, lot.unit, { decimals: 2 })} · {lot.region}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-surface-card rounded-full flex items-center">
                  <button type="button" aria-label={`Less ${lot.name}`} onClick={() => actions.setCartQty(lot.id, amount - (lot.unit === 'kg' ? 50 : 10))} className="w-9 h-9 rounded-full flex items-center justify-center text-primary press">
                    <Icon name="remove" size={18} />
                  </button>
                  <span className="px-2 font-title text-title-md tabular-nums min-w-[96px] text-center">{qty(amount, lot.unit)}</span>
                  <button
                    type="button"
                    aria-label={`More ${lot.name}`}
                    disabled={amount >= lot.available}
                    onClick={() => actions.setCartQty(lot.id, Math.min(lot.available, amount + (lot.unit === 'kg' ? 50 : 10)))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-primary press disabled:opacity-40"
                  >
                    <Icon name="add" size={18} />
                  </button>
                </div>
                <span className="font-headline text-title-lg text-primary tabular-nums min-w-[84px] text-right">{money(lineTotal)}</span>
                <button type="button" aria-label={`Remove ${lot.name}`} onClick={() => actions.setCartQty(lot.id, 0)} className="text-on-surface-variant hover:text-error">
                  <Icon name="delete" size={20} />
                </button>
              </div>
            </div>
          ))}
          <Link to="/buyer/marketplace" className="font-label text-label-md text-primary underline underline-offset-4 self-start">
            + Add more produce
          </Link>
        </section>
        <aside className="lg:col-span-5 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-5 lg:sticky lg:top-6">
          <h2 className="font-title text-title-lg text-primary">Order summary</h2>
          <dl className="flex flex-col gap-2.5 font-body text-body-md tabular-nums">
            <Row k="Produce subtotal" v={money(subtotal)} />
            <Row k="FarmLine service fee" v={money(fee)} />
            <Row k="Cold-chain logistics" v={money(LOGISTICS)} />
            <div className="flex justify-between pt-3 border-t border-outline-variant items-center">
              <dt className="font-title text-title-lg">Total</dt>
              <dd className="bg-accent text-on-accent rounded-full px-4 py-1.5 font-display text-headline-lg">{money(total)}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2">
            <label htmlFor="delivery" className="field-label">
              Delivery store &amp; date
            </label>
            <select id="delivery" value={delivery} onChange={(e) => setDelivery(e.target.value)} className="rounded-xl bg-surface-elevated border border-outline-variant px-4 py-2.5 font-body text-body-md">
              <option>{BUYER.stores[0]} · Mon 25 Nov</option>
              <option>{BUYER.stores[0]} · Wed 27 Nov</option>
              <option>{BUYER.stores[1]} · Thu 28 Nov</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="field-label">Payment terms</span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment terms">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={terms === t}
                  onClick={() => setTerms(t)}
                  className={cx('press rounded-full py-2 font-label text-label-sm', terms === t ? 'bg-primary text-on-primary' : 'bg-surface-elevated border border-outline-variant')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-primary-container text-on-primary-container rounded-xl p-3.5 flex items-center gap-2.5 font-label text-label-md">
            <Icon name="verified" size={20} />
            <span>Farmers are paid on delivery by FarmLine.</span>
          </div>
          <button
            type="button"
            className="btn-primary w-full py-4"
            onClick={() => {
              const [store, day] = delivery.split(' · ');
              const id = actions.placeOrder({
                items: lines.map(({ lot, qty: q }) => ({ name: CROPS[lot.crop].name, crop: lot.crop, qty: q, unit: lot.unit, price: lot.price, farmers: lot.farmers, region: lot.region })),
                total,
                store,
                delivery: `${day} 2026`.replace(/^\w+ /, ''),
                terms,
              });
              toast(`Order #${id} placed`, { icon: 'receipt_long' });
              navigate(`/buyer/orders/${id}`);
            }}
          >
            Place order
          </button>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between">
      <dt className="text-on-surface-variant">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

/* 31. Orders list ---------------------------------------------------------- */
const ORDER_FILTERS = ['All', 'Pending', 'In transit', 'Delivered', 'Cancelled'];
const statusGroup = (s) => (['Confirmed', 'Collecting', 'Quality checked'].includes(s) ? 'Pending' : s);
export const STATUS_TONE = { 'In transit': 'accent', Collecting: 'primary-soft', Confirmed: 'primary-soft', 'Quality checked': 'primary-soft', Delivered: 'primary', Cancelled: 'error' };

export function BuyerOrders() {
  const { state } = useStore();
  const [filter, setFilter] = useState('All');
  const orders = state.buyerOrders.filter((o) => filter === 'All' || statusGroup(o.status) === filter);

  return (
    <>
      <PageHeader title="Orders">
        <div className="flex gap-2 flex-wrap">
          {ORDER_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cx('press rounded-full px-4 py-2 font-label text-label-md', filter === f ? 'bg-primary text-on-primary' : 'clay-card bg-surface-card')}
            >
              {f}
            </button>
          ))}
        </div>
      </PageHeader>
      <section className="clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
        {orders.length === 0 ? (
          <p className="font-body text-body-md text-on-surface-variant py-6 text-center">No {filter.toLowerCase()} orders.</p>
        ) : (
          <table className="clay-table min-w-[760px]">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Farmers</th>
                <th>Delivery date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-title text-primary">
                    <Link to={`/buyer/orders/${o.id}`}>#{o.id}</Link>
                  </td>
                  <td>{o.items.map((i) => `${i.name.replace('Red onions', 'Onions')} ${qty(i.qty, i.unit)}`).slice(0, 2).join(', ')}{o.items.length > 2 && ` +${o.items.length - 2}`}</td>
                  <td className="font-title text-accent-text">{money(o.total)}</td>
                  <td>{o.farmers}</td>
                  <td>{o.delivery}</td>
                  <td>
                    <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                  </td>
                  <td>
                    {o.status === 'Delivered' ? (
                      <Link to="/buyer/payments" className="text-primary font-label text-label-md underline">
                        Invoice
                      </Link>
                    ) : (
                      <Link to={`/buyer/orders/${o.id}`} className="text-primary font-label text-label-md underline">
                        {o.status === 'In transit' ? 'Track' : 'View'}
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

/* 32. Order detail & tracking --------------------------------------------- */
const STEP_ICON = ['check', 'agriculture', 'verified', 'local_shipping', 'storefront'];

export function BuyerOrderDetail() {
  const { id } = useParams();
  const { state } = useStore();
  const toast = useToast();
  const order = state.buyerOrders.find((o) => o.id === id);
  if (!order) return <EmptyState icon="search_off" title="Order not found" action={<Link to="/buyer/orders" className="btn-primary px-5 py-2.5 text-label-md">All orders</Link>} />;

  const current = BUYER_ORDER_STEPS.indexOf(order.status);
  const deliveryNote = () => {
    const lines = [
      `FarmLine delivery note · Order #${order.id}`,
      `Deliver to: ${order.store}`,
      `Delivery date: ${order.delivery}`,
      '',
      ...order.items.map((i) => `${i.name} (Grade A)  ${qty(i.qty, i.unit)}  ${money(i.qty * i.price)}`),
      '',
      `Total: ${money(order.total)}`,
      `Supplying farmers: ${order.farmers} · verified by Thomas K.`,
    ];
    downloadText(`delivery-note-${order.id}.txt`, lines.join('\n'));
    toast('Delivery note downloaded', { icon: 'download' });
  };

  return (
    <>
      <header className="clay-card bg-surface-card rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/buyer/orders" aria-label="Back to orders" className="bg-surface-elevated text-primary w-10 h-10 rounded-full flex items-center justify-center press">
            <Icon name="arrow_back" />
          </Link>
          <div>
            <h1 className="font-headline text-headline-lg text-primary tabular-nums">Order #{order.id}</h1>
            <p className="font-label text-label-md text-on-surface-variant">
              {order.store} · {order.farmers} supplying farmers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-accent text-on-accent rounded-full px-4 py-1.5 font-headline text-title-lg tabular-nums">{money(order.total)}</span>
          <Badge tone={order.status === 'Delivered' ? 'primary' : order.status === 'In transit' ? 'primary' : 'primary-soft'} className="px-4 py-1.5 text-label-md">
            {order.status}
          </Badge>
        </div>
      </header>
      <section className="clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
        <ol className="grid grid-cols-5 gap-4 text-center min-w-[560px]">
          {BUYER_ORDER_STEPS.map((step, i) => {
            const done = i < current || order.status === 'Delivered';
            const now = i === current && order.status !== 'Delivered';
            const label = step === 'Collecting' ? (done ? `Collected (${order.farmers} farmers)` : 'Collecting') : step;
            return (
              <li key={step} className="flex flex-col items-center gap-2" aria-current={now ? 'step' : undefined}>
                <span
                  className={cx(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    done && 'bg-primary text-on-primary',
                    now && 'bg-accent text-on-accent',
                    !done && !now && 'border-2 border-outline bg-surface-elevated',
                  )}
                >
                  {(done || now) && <Icon name={done ? 'check' : STEP_ICON[i]} size={20} />}
                </span>
                <span className={cx('font-label text-label-md', now && 'text-primary', !done && !now && 'text-on-surface-variant')}>{label}</span>
              </li>
            );
          })}
        </ol>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Accepted items</h2>
          {order.items.map((i) => (
            <div key={i.name} className="bg-surface-elevated rounded-xl p-4 flex justify-between gap-3 tabular-nums">
              <span>{i.name} (Grade A)</span>
              <strong>
                {qty(i.qty, i.unit)} · {money(i.qty * i.price)}
              </strong>
            </div>
          ))}
        </section>
        <section className="lg:col-span-6 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-title text-title-lg text-primary">Route: {order.region} → Windhoek</h2>
            <Badge tone="primary-soft">{order.status === 'Delivered' ? 'Delivered' : `ETA ${order.eta}`}</Badge>
          </div>
          <Img src={IMAGES.routeMap} alt={`Route from ${order.region} to Windhoek`} className="w-full h-48 object-cover rounded-xl" fallbackIcon="map" />
        </section>
      </div>
      <footer className="clay-card bg-surface-card rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <span className="font-body text-body-md text-on-surface-variant">
          Supplying farmers: Maria N., Paulus S., Selma K.{order.farmers > 3 && `, +${order.farmers - 3} others`} (verified by Thomas K.)
        </span>
        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={deliveryNote} className="btn-primary px-5 py-2.5 text-label-md">
            Download delivery note
          </button>
          <button type="button" onClick={() => toast('Issue reported. FarmLine ops will call you within 1 hour', { icon: 'support_agent' })} className="btn-ghost px-5 py-2.5 text-label-md">
            Report an issue
          </button>
        </div>
      </footer>
    </>
  );
}
