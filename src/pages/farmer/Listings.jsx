import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Icon, Img, Modal, Segmented, Sparkline, EmptyState } from '../../components/ui.jsx';
import { MobileScreen, ScreenHeader, Stepper } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { CROPS, PRICE_INSIGHTS, SELLABLE_CROPS } from '../../data/seed.js';
import { cx, money, perUnit, qty, shortDate, todayIso } from '../../lib/format.js';
import { LISTING_STATUS, cropName, readyLabel } from './shared.js';

/* 8. Create listing -------------------------------------------------------- */
const UNITS = ['kg', 'crates', 'bags'];
const SUGGESTED = { butternut: [9, 11], tomatoes: [12, 15], onions: [8, 9], maize: [4, 6], spinach: [10, 13], cabbage: [5, 7] };

export function SellProduce() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [crop, setCrop] = useState('butternut');
  const [unit, setUnit] = useState('kg');
  const [amount, setAmount] = useState(200);
  const [date, setDate] = useState(todayIso(1));
  const [price, setPrice] = useState('10');
  const [photo, setPhoto] = useState(null);
  const dateRef = useRef(null);
  const fileRef = useRef(null);
  const [lo, hi] = SUGGESTED[crop] ?? [8, 12];

  const submit = () => {
    const ready = shortDate(date);
    const isToday = date === todayIso();
    const id = actions.addListing({
      crop,
      qty: amount,
      unit,
      price: Number(price) || 0,
      ready: isToday ? 'today' : ready,
      readyShort: isToday ? 'Ready today' : `Ready ${ready.split(' ')[0]}`,
      photo,
    });
    toast(`${cropName(crop)} listed. Buyers can see it now`, { icon: 'storefront' });
    navigate(`/farmer/listings/${id}`, { replace: true });
  };

  return (
    <MobileScreen>
      <ScreenHeader title="What are you selling?" back="/farmer/home" />
      <main className="flex flex-col gap-gutter-lg">
        <section aria-label="Select crop" role="radiogroup" className="grid grid-cols-3 gap-gutter-md">
          {SELLABLE_CROPS.map((c) => {
            const on = crop === c;
            const meta = CROPS[c];
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setCrop(c);
                  setPrice(String(SUGGESTED[c]?.[0] ?? ''));
                }}
                className={cx(
                  'clay-card press bg-surface-card rounded-xl p-gutter-md flex flex-col items-center gap-gutter-xs relative border-2',
                  on ? 'border-primary' : 'border-transparent',
                )}
              >
                {on && (
                  <span className="w-6 h-6 rounded-full bg-accent text-on-accent flex items-center justify-center absolute -top-2 -right-2">
                    <Icon name="check" size={15} />
                  </span>
                )}
                <span
                  className={cx(
                    'w-11 h-11 rounded-full flex items-center justify-center',
                    meta.tone === 'accent' ? 'bg-accent-container text-accent-text' : 'bg-primary-container text-primary',
                  )}
                >
                  <Icon name={meta.icon} size={24} />
                </span>
                <span className={cx('font-label text-label-md', on ? 'text-primary' : 'text-on-surface')}>{meta.short ?? meta.name}</span>
              </button>
            );
          })}
        </section>

        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Quantity</h2>
            <div className="bg-surface rounded-full p-1 inline-flex gap-gutter-xs" role="radiogroup" aria-label="Unit">
              {UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  role="radio"
                  aria-checked={unit === u}
                  onClick={() => {
                    setUnit(u);
                    setAmount(u === 'kg' ? 200 : 10);
                  }}
                  className={cx('rounded-full px-3 py-1 font-label text-label-sm', unit === u ? 'bg-primary text-on-primary' : 'text-on-surface-variant')}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <Stepper value={amount} onChange={setAmount} step={unit === 'kg' ? 10 : 1} min={0} unit={unit} labelDecrease="Decrease quantity" labelIncrease="Increase quantity" />
        </div>

        <div className="grid grid-cols-2 gap-gutter-md">
          <button
            type="button"
            onClick={() => (dateRef.current?.showPicker ? dateRef.current.showPicker() : dateRef.current?.focus())}
            className="clay-card press bg-surface-card rounded-2xl p-gutter-lg flex flex-col items-start gap-gutter-xs text-left relative"
          >
            <Icon name="calendar_today" size={24} className="text-primary" />
            <span className="font-label text-label-sm text-on-surface-variant">Ready date</span>
            <span className="font-title text-title-md text-on-surface">{date === todayIso() ? 'Today' : shortDate(date)}</span>
            <input
              ref={dateRef}
              type="date"
              min={todayIso()}
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none"
              tabIndex={-1}
              aria-label="Ready date"
            />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="clay-card press bg-surface-card rounded-2xl p-gutter-lg flex flex-col items-start gap-gutter-xs text-left overflow-hidden relative"
          >
            {photo && <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />}
            <Icon name={photo ? 'check_circle' : 'photo_camera'} size={24} className="text-primary relative" />
            <span className="font-label text-label-sm text-on-surface-variant relative">Optional</span>
            <span className="font-title text-title-md text-primary relative">{photo ? 'Photo added' : 'Add photo'}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setPhoto(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </button>
        </div>

        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-sm">
          <label htmlFor="price-input" className="font-title text-title-md text-on-surface">
            Your price per {unit === 'kg' ? 'kg' : unit.replace(/s$/, '')} (optional)
          </label>
          <div className="flex items-center gap-gutter-sm bg-surface-elevated rounded-xl px-gutter-lg py-gutter-md border border-outline-variant focus-within:border-primary">
            <span className="font-title text-title-md text-primary">N$</span>
            <input
              id="price-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent border-0 p-0 font-headline text-headline-md text-on-surface tabular-nums focus:ring-0"
            />
            <span className="font-label text-label-md text-on-surface-variant">/{unit === 'kg' ? 'kg' : unit.replace(/s$/, '')}</span>
          </div>
          {unit === 'kg' && (
            <button
              type="button"
              onClick={() => setPrice(String((lo + hi) / 2))}
              className="bg-accent text-on-accent rounded-full px-gutter-md py-1.5 inline-flex items-center gap-gutter-xs self-start press"
            >
              <Icon name="auto_awesome" size={16} />
              <span className="font-label text-label-sm tabular-nums">
                Suggested: N${lo}-{hi}/kg this week
              </span>
            </button>
          )}
        </div>

        <button type="button" disabled={amount <= 0} onClick={submit} className="btn-primary w-full px-6 py-4 min-h-[52px]">
          List my produce
        </button>
      </main>
    </MobileScreen>
  );
}

/* 9. My listings ----------------------------------------------------------- */
export function MyListings() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('Active');
  const [confirm, setConfirm] = useState(null);
  const items = state.listings.filter((l) => LISTING_STATUS[l.status].tab === tab);

  return (
    <MobileScreen
      nav="farmer"
      padded={false}
      fab={
        <Link
          to="/farmer/sell"
          aria-label="Add listing"
          className="clay-btn-primary press fixed bottom-24 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center z-30"
          style={{ right: 'max(20px, calc(50vw - 175px))' }}
        >
          <Icon name="add" size={28} />
        </Link>
      }
    >
      <header className="px-page-margin pt-gutter-xl flex flex-col gap-gutter-md">
        <h1 className="font-headline text-headline-lg-mobile text-primary">My listings</h1>
        <Segmented options={['Active', 'Sold', 'Expired']} value={tab} onChange={setTab} label="Listing status" />
      </header>
      <main className="px-page-margin pb-4 flex flex-col gap-gutter-md">
        {items.length === 0 && <EmptyState icon="inventory_2" title={`No ${tab.toLowerCase()} listings`} body="Listings you create will show up here." />}
        {items.map((l) => {
          const st = LISTING_STATUS[l.status];
          const img = l.photo || CROPS[l.crop]?.image;
          return (
            <article key={l.id} className="clay-card bg-surface-card rounded-2xl p-gutter-lg flex flex-col gap-gutter-md">
              <Link to={`/farmer/listings/${l.id}`} className="flex items-start justify-between gap-gutter-md">
                <div className="flex items-center gap-gutter-md min-w-0">
                  <Img src={img} alt={cropName(l.crop)} className="w-16 h-16 rounded-xl object-cover shrink-0" fallbackIcon={CROPS[l.crop]?.icon} />
                  <div className="min-w-0">
                    <h2 className="font-title text-title-lg text-on-surface">{cropName(l.crop)}</h2>
                    <p className="font-body text-body-md text-on-surface-variant tabular-nums">
                      {qty(l.qty, l.unit)} · {perUnit(l.price, l.unit === 'kg' ? 'kg' : l.unit.replace(/s$/, ''))}
                    </p>
                    <p className="font-label text-label-sm text-on-surface-variant">{l.status === 'expired' ? `Expired ${l.ready}` : readyLabel(l)}</p>
                  </div>
                </div>
                <Badge tone={st.tone} className="shrink-0">
                  {st.label}
                </Badge>
              </Link>
              {tab === 'Active' ? (
                <div className="flex items-center gap-gutter-sm pt-gutter-xs">
                  <Link to={`/farmer/listings/${l.id}/edit`} className="btn-tonal flex-1 py-2.5 text-label-md">
                    Edit
                  </Link>
                  <button type="button" onClick={() => setConfirm(l)} className="btn-ghost flex-1 py-2.5 text-label-md text-on-surface-variant">
                    Remove
                  </button>
                </div>
              ) : (
                <Link to="/farmer/sell" className="btn-tonal py-2.5 text-label-md">
                  Sell again
                </Link>
              )}
            </article>
          );
        })}
      </main>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Remove listing?">
        <p className="font-body text-body-md text-on-surface-variant">
          {confirm && `${cropName(confirm.crop)}, ${qty(confirm.qty, confirm.unit)} will no longer be shown to buyers.`}
        </p>
        <div className="grid grid-cols-2 gap-gutter-sm">
          <button type="button" className="btn-ghost py-3 text-label-lg" onClick={() => setConfirm(null)}>
            Keep it
          </button>
          <button
            type="button"
            className="press rounded-full py-3 bg-error text-on-error font-label text-label-lg"
            onClick={() => {
              actions.removeListing(confirm.id);
              toast('Listing removed', { icon: 'delete' });
              setConfirm(null);
            }}
          >
            Remove
          </button>
        </div>
      </Modal>
    </MobileScreen>
  );
}

/* 10. Listing detail ------------------------------------------------------- */
export function ListingDetail() {
  const { id } = useParams();
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const listing = state.listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <MobileScreen>
        <ScreenHeader title="Listing" back="/farmer/listings" />
        <EmptyState icon="search_off" title="Listing not found" body="It may have been removed." />
      </MobileScreen>
    );
  }

  const st = LISTING_STATUS[listing.status];
  const img = listing.photo || CROPS[listing.crop]?.image;
  const unitLabel = listing.unit === 'kg' ? 'kg' : listing.unit.replace(/s$/, '');
  const avg = listing.trend?.length ? listing.trend.reduce((a, b) => a + b, 0) / listing.trend.length : listing.price;
  const sold = listing.status === 'sold';

  return (
    <MobileScreen>
      <header className="flex items-center justify-between">
        <button type="button" aria-label="Back" className="btn-back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" />
        </button>
        <Badge tone={st.tone} className="px-3.5 py-1.5 text-label-md">
          {st.label}
        </Badge>
      </header>
      <main className="flex flex-col gap-gutter-lg">
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-md flex flex-col gap-gutter-md">
          <Img src={img} alt={`Fresh harvested ${cropName(listing.crop).toLowerCase()}`} className="w-full h-48 object-cover rounded-xl" fallbackIcon={CROPS[listing.crop]?.icon} />
          <div className="px-gutter-xs pb-gutter-xs">
            <h1 className="font-headline text-headline-lg-mobile text-primary tabular-nums">
              {cropName(listing.crop)}, {qty(listing.qty, listing.unit)}
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">
              {state.farmer.village}, {state.farmer.region}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-gutter-md">
          <InfoTile label="Ready date" value={listing.ready === 'today' ? 'Today' : listing.ready} />
          <InfoTile label="Price" value={perUnit(listing.price, unitLabel)} valueClass="text-accent-text tabular-nums" />
          <div className="clay-card bg-surface-card rounded-xl p-gutter-lg col-span-2 flex items-center justify-between">
            <div>
              <p className="font-label text-label-sm text-on-surface-variant">Quality grade</p>
              <p className="font-title text-title-md text-on-surface">{listing.grade}</p>
            </div>
            <Icon name="verified" size={26} className="text-accent-text" />
          </div>
        </div>

        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-lg text-primary">Interested buyers</h2>
          {listing.interest.length === 0 && (
            <p className="font-body text-body-md text-on-surface-variant">
              {sold ? 'This listing is sold.' : 'No offers yet. We will send you an SMS when a buyer is interested.'}
            </p>
          )}
          {listing.interest.map((b) => (
            <div key={b.id} className="bg-surface-elevated rounded-xl p-gutter-md flex items-center justify-between gap-gutter-sm">
              <div>
                <p className="font-title text-title-md text-on-surface">{b.buyer}</p>
                <p className="font-label text-label-md text-on-surface-variant tabular-nums">
                  {qty(b.qty, listing.unit)} · {perUnit(b.price, unitLabel)} · {money(b.qty * b.price)}
                </p>
              </div>
              <button
                type="button"
                className="press bg-primary text-on-primary rounded-full px-4 py-2 font-label text-label-md"
                onClick={() => {
                  const orderId = actions.acceptInterest(listing.id, b.id);
                  toast(`Order confirmed with ${b.buyer}`, { icon: 'handshake', action: { label: 'View', to: `/farmer/orders/${orderId}` } });
                }}
              >
                Accept
              </button>
            </div>
          ))}
        </section>

        {listing.trend?.length > 1 && (
          <Link to={`/farmer/prices?crop=${listing.crop}`} className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-md text-primary">Price insight (8 weeks)</h2>
              <span className="font-label text-label-md text-accent-text tabular-nums">{perUnit(Math.round(avg * 2) / 2, unitLabel)} avg</span>
            </div>
            <Sparkline values={listing.trend} label={`${cropName(listing.crop)} price trend over 8 weeks`} />
          </Link>
        )}

        {!sold && listing.status !== 'expired' && (
          <div className="flex flex-col gap-gutter-sm pb-gutter-md">
            <Link to={`/farmer/listings/${listing.id}/edit`} className="btn-primary w-full py-4 min-h-[52px]">
              Edit listing
            </Link>
            <button
              type="button"
              className="btn-outline w-full py-3.5 min-h-[48px]"
              onClick={() => {
                actions.updateListing(listing.id, { status: 'sold', interest: [], readyShort: 'Sold' });
                toast('Marked as sold', { icon: 'sell' });
              }}
            >
              Mark as sold
            </button>
          </div>
        )}
      </main>
    </MobileScreen>
  );
}

function InfoTile({ label, value, valueClass = 'text-on-surface' }) {
  return (
    <div className="clay-card bg-surface-card rounded-xl p-gutter-lg">
      <p className="font-label text-label-sm text-on-surface-variant">{label}</p>
      <p className={cx('font-title text-title-md', valueClass)}>{value}</p>
    </div>
  );
}

/* Edit listing (reuses the create-listing visual language) ----------------- */
export function EditListing() {
  const { id } = useParams();
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const listing = state.listings.find((l) => l.id === id);
  const [amount, setAmount] = useState(listing?.qty ?? 0);
  const [price, setPrice] = useState(String(listing?.price ?? ''));

  if (!listing) return null;
  const hint = PRICE_INSIGHTS[listing.crop];

  return (
    <MobileScreen>
      <ScreenHeader title={`Edit ${cropName(listing.crop).toLowerCase()}`} />
      <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
        <h2 className="font-title text-title-md text-on-surface">Quantity</h2>
        <Stepper value={amount} onChange={setAmount} step={listing.unit === 'kg' ? 10 : 1} unit={listing.unit} />
      </div>
      <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-sm">
        <label htmlFor="edit-price" className="font-title text-title-md text-on-surface">
          Price
        </label>
        <div className="flex items-center gap-gutter-sm bg-surface-elevated rounded-xl px-gutter-lg py-gutter-md border border-outline-variant">
          <span className="font-title text-title-md text-primary">N$</span>
          <input
            id="edit-price"
            type="number"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-transparent border-0 p-0 font-headline text-headline-md tabular-nums focus:ring-0"
          />
        </div>
        {hint && (
          <p className="font-label text-label-sm text-accent-text tabular-nums">Market average this week: {perUnit(hint.avg)}</p>
        )}
      </div>
      <button
        type="button"
        className="btn-primary w-full py-4 min-h-[52px]"
        onClick={() => {
          actions.updateListing(listing.id, { qty: amount, price: Number(price) || 0 });
          toast('Listing updated');
          navigate(`/farmer/listings/${listing.id}`, { replace: true });
        }}
      >
        Save changes
      </button>
    </MobileScreen>
  );
}
