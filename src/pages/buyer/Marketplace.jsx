import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Badge, EmptyState, Icon, Img, Segmented } from '../../components/ui.jsx';
import { PageHeader } from '../../components/web.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { CROPS, SUPPLY_BREAKDOWN } from '../../data/seed.js';
import { IMAGES } from '../../data/images.js';
import { cx, perUnit, qty, tonnes } from '../../lib/format.js';

const REGION_OPTIONS = ['All regions', 'Omusati', 'Oshana', 'Kavango East', 'Hardap'];
const VILLAGES = ['Okahao', 'Tsandi', 'Outapi', 'Oshakati', 'Ongwediva', 'Rundu', 'Mariental'];

const availLabel = (l) => (l.unit === 'kg' ? tonnes(l.available) : qty(l.available, l.unit));
const readyText = (l) => (l.ready === 'today' ? 'Ready today' : `Ready ${l.ready}`);

/* 27. Marketplace ---------------------------------------------------------- */
export function Marketplace() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [view, setView] = useState('Grid');
  const [crops, setCrops] = useState([]);
  const [region, setRegion] = useState('All regions');
  const [grades, setGrades] = useState(['A']);

  const allCrops = [...new Set(state.marketLots.map((l) => l.crop))];
  const lots = useMemo(
    () =>
      state.marketLots.filter((l) => {
        const needle = q.trim().toLowerCase();
        if (needle && !`${l.name} ${l.region}`.toLowerCase().includes(needle)) return false;
        if (crops.length && !crops.includes(l.crop)) return false;
        if (region !== 'All regions' && l.region !== region) return false;
        if (grades.length && !grades.includes(l.grade)) return false;
        return true;
      }),
    [state.marketLots, q, crops, region, grades],
  );

  const toggle = (list, setList, v) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const add = (l) => {
    actions.addToCart(l.id, l.unit === 'kg' ? 100 : 20);
    toast(`${l.name} added to your order`, { icon: 'add_shopping_cart', action: { label: 'Checkout', to: '/buyer/checkout' } });
  };

  return (
    <>
      <PageHeader title="Marketplace">
        <div className="clay-card bg-surface-card rounded-full px-5 py-2.5 flex items-center gap-2 w-full sm:w-80">
          <Icon name="search" size={20} className="text-primary" />
          <label htmlFor="crop-search" className="sr-only">
            Search crops
          </label>
          <input
            id="crop-search"
            type="search"
            value={q}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set('q', e.target.value);
              else next.delete('q');
              setParams(next, { replace: true });
            }}
            placeholder="Search crops..."
            className="w-full bg-transparent border-0 p-0 font-body text-body-md focus:ring-0"
          />
        </div>
        <Segmented options={['Grid', 'Map']} value={view} onChange={setView} size="sm" className="p-1" label="View" />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-3 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-5 lg:sticky lg:top-6">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-lg text-primary">Filters</h2>
            {(crops.length > 0 || region !== 'All regions' || grades.length !== 1 || grades[0] !== 'A') && (
              <button
                type="button"
                className="font-label text-label-sm text-primary underline"
                onClick={() => {
                  setCrops([]);
                  setRegion('All regions');
                  setGrades(['A']);
                }}
              >
                Reset
              </button>
            )}
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="font-label text-label-md text-on-surface-variant mb-2">Crops</legend>
            {allCrops.map((c) => (
              <label key={c} className="inline-flex items-center gap-2 font-body text-body-md">
                <input type="checkbox" checked={crops.includes(c)} onChange={() => toggle(crops, setCrops, c)} />
                <span>{CROPS[c].name}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="region-filter" className="font-label text-label-md text-on-surface-variant">
              Region
            </label>
            <select id="region-filter" value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-xl bg-surface-elevated border border-outline-variant px-3 py-2 font-body text-body-md">
              {REGION_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-label-md text-on-surface-variant">Quality grade</span>
            <div className="flex gap-2">
              {['A', 'B'].map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={grades.includes(g)}
                  onClick={() => toggle(grades, setGrades, g)}
                  className={cx('press rounded-full px-3 py-1 font-label text-label-sm', grades.includes(g) ? 'bg-primary text-on-primary' : 'bg-surface-elevated')}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9 flex flex-col gap-6">
          <p className="font-label text-label-md text-on-surface-variant" aria-live="polite">
            {lots.length} {lots.length === 1 ? 'lot' : 'lots'} available{q && ` for “${q}”`}
          </p>
          {lots.length === 0 && <EmptyState icon="search_off" title="No produce matches your filters" body="Try another region or grade, or post a purchase request." action={<Link to="/buyer/requests" className="btn-primary px-5 py-2.5 text-label-md">Post a request</Link>} />}
          {view === 'Map' && lots.length > 0 && (
            <div className="clay-card bg-surface-card rounded-2xl p-4 flex flex-col gap-4">
              <div className="relative">
                <Img src={IMAGES.routeMap} alt="Map of produce lots in Namibia" className="w-full h-80 object-cover rounded-xl" fallbackIcon="map" />
                {lots.map((l, i) => (
                  <Link
                    key={l.id}
                    to={`/buyer/marketplace/${l.id}`}
                    className="absolute bg-primary text-on-primary rounded-full px-3 py-1 font-label text-label-sm clay-btn-primary press flex items-center gap-1"
                    style={{ left: `${12 + ((i * 23) % 70)}%`, top: `${15 + ((i * 31) % 65)}%` }}
                  >
                    <Icon name="location_on" size={14} />
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {view === 'Grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lots.map((l) => (
                <article key={l.id} className="clay-card bg-surface-card rounded-2xl p-5 flex flex-col gap-4">
                  <Link to={`/buyer/marketplace/${l.id}`} className="flex flex-col gap-4">
                    <Img src={CROPS[l.crop].image} alt={l.name} className="w-full h-44 object-cover rounded-xl" fallbackIcon={CROPS[l.crop].icon} />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-title text-title-lg text-on-surface">{l.name}</h3>
                        <p className="font-body text-body-md text-on-surface-variant tabular-nums">
                          {availLabel(l)}
                          {l.unit === 'kg' && ` from ${l.farmers} farmers`} · {l.region}
                        </p>
                        <p className="font-label text-label-sm text-on-surface-variant">{readyText(l)}</p>
                      </div>
                      <Badge tone={l.grade === 'A' ? 'primary-soft' : 'accent-soft'}>Grade {l.grade}</Badge>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                    <span className="bg-accent text-on-accent rounded-full px-3.5 py-1.5 font-headline text-title-md tabular-nums">{perUnit(l.price, l.unit, { decimals: 2 })}</span>
                    <button type="button" onClick={() => add(l)} className="btn-primary px-5 py-2.5 text-label-md">
                      Add to order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* 28. Produce listing detail ----------------------------------------------- */
function breakdownFor(lot) {
  if (SUPPLY_BREAKDOWN[lot.id]) return SUPPLY_BREAKDOWN[lot.id];
  // Deterministic split of the lot across its farmers.
  const n = Math.min(lot.farmers, 4);
  const base = Math.floor(lot.available / n / 10) * 10;
  return Array.from({ length: n }, (_, i) => ({
    id: `FRM-${110 + i * 7 + lot.name.length}`,
    village: VILLAGES[(i + lot.name.length) % VILLAGES.length],
    qty: i === n - 1 ? lot.available - base * (n - 1) : base,
  }));
}

export function ProduceDetail() {
  const { id } = useParams();
  const { state, actions } = useStore();
  const toast = useToast();
  const lot = state.marketLots.find((l) => l.id === id);
  const [amount, setAmount] = useState(300);

  if (!lot) return <EmptyState icon="search_off" title="This produce is no longer listed" action={<Link to="/buyer/marketplace" className="btn-primary px-5 py-2.5 text-label-md">Back to marketplace</Link>} />;
  const rows = breakdownFor(lot);
  const tooMuch = amount > lot.available;

  return (
    <>
      <header className="flex items-center gap-4">
        <Link to="/buyer/marketplace" aria-label="Back" className="clay-card bg-surface-card text-primary w-11 h-11 rounded-full flex items-center justify-center press">
          <Icon name="arrow_back" />
        </Link>
        <nav aria-label="Breadcrumb" className="font-label text-label-md text-on-surface-variant">
          <Link to="/buyer/marketplace" className="hover:text-primary">
            Marketplace
          </Link>{' '}
          / {lot.region} / {lot.name}
        </nav>
      </header>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 clay-card bg-surface-card rounded-2xl p-4">
          <Img src={CROPS[lot.crop].image} alt={`${lot.name} Grade ${lot.grade}`} className="w-full h-64 lg:h-80 object-cover rounded-xl" fallbackIcon={CROPS[lot.crop].icon} />
        </div>
        <div className="lg:col-span-6 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="font-headline text-headline-lg text-primary">
              {lot.name}, Grade {lot.grade}
            </h1>
            <span className="bg-accent text-on-accent rounded-full px-4 py-1.5 font-headline text-title-lg tabular-nums">{perUnit(lot.price, lot.unit)}</span>
          </div>
          <p className="font-body text-body-lg text-on-surface-variant tabular-nums">
            {qty(lot.available, lot.unit)} available from {lot.farmers} verified farmers in {lot.region}
          </p>
          <div className="grid grid-cols-2 gap-4 bg-surface-elevated rounded-xl p-4">
            <div>
              <p className="font-label text-label-sm text-on-surface-variant">Ready date</p>
              <p className="font-title text-title-md">{lot.ready === 'today' ? 'Today' : lot.ready}</p>
            </div>
            <div>
              <p className="font-label text-label-sm text-on-surface-variant">Est. delivery to Windhoek</p>
              <p className="font-title text-title-md">{lot.delivery}</p>
            </div>
          </div>
          <form
            className="flex items-center gap-4 pt-2 flex-wrap"
            onSubmit={(e) => {
              e.preventDefault();
              if (tooMuch || amount <= 0) return;
              actions.addToCart(lot.id, amount);
              toast(`${qty(amount, lot.unit)} ${lot.name.toLowerCase()} added`, { icon: 'add_shopping_cart', action: { label: 'Checkout', to: '/buyer/checkout' } });
            }}
          >
            <label className="relative">
              <span className="sr-only">Quantity in {lot.unit}</span>
              <input
                type="number"
                min="1"
                max={lot.available}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className={cx('w-36 rounded-full bg-surface-elevated border px-4 py-3 pr-12 font-title text-title-md tabular-nums text-center', tooMuch ? 'border-error' : 'border-outline-variant')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label text-label-sm text-on-surface-variant">{lot.unit}</span>
            </label>
            <button type="submit" disabled={tooMuch || amount <= 0} className="btn-primary flex-1 py-3.5 min-w-[160px]">
              Add to order
            </button>
            {tooMuch && <p className="w-full font-label text-label-sm text-error">Only {qty(lot.available, lot.unit)} available.</p>}
          </form>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4 overflow-x-auto">
          <h2 className="font-title text-title-lg text-primary">Supply breakdown</h2>
          <table className="clay-table">
            <thead>
              <tr>
                <th>Farmer ID</th>
                <th>Village</th>
                <th>Quantity</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.village}</td>
                  <td>{qty(r.qty, lot.unit)}</td>
                  <td>Grade {lot.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-5 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Traceability</h2>
          <div className="flex items-center justify-between gap-2 pt-2">
            <TraceStep icon="agriculture" label="Farm" />
            <span className="flex-1 h-1 bg-primary rounded-full" />
            <TraceStep icon="verified" label="Graded" />
            <span className="flex-1 h-1 bg-primary rounded-full" />
            <TraceStep icon="storefront" label="Store" accent />
          </div>
          <p className="font-body text-body-md text-on-surface-variant">Every crate is weighed and graded by a FarmLine field agent at collection.</p>
        </div>
      </section>
    </>
  );
}

function TraceStep({ icon, label, accent }) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <span className={cx('w-10 h-10 rounded-full flex items-center justify-center', accent ? 'bg-accent text-on-accent' : 'bg-primary text-on-primary')}>
        <Icon name={icon} size={20} />
      </span>
      <span className="font-label text-label-sm">{label}</span>
    </div>
  );
}
