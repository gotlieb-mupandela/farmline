import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Icon, Img } from '../../components/ui.jsx';
import { MobileScreen, ScreenHeader } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { AGENT, CROPS, REGIONS, ROUTE_STOPS } from '../../data/seed.js';
import { IMAGES } from '../../data/images.js';
import { cx, money } from '../../lib/format.js';
import { Field } from '../farmer/Auth.jsx';

/* 18. Field agent dashboard ------------------------------------------------ */
export function AgentDashboard() {
  const { state, actions } = useStore();
  const toast = useToast();
  const pending = state.agentPending;

  return (
    <MobileScreen nav="agent" padded={false}>
      <header className="px-page-margin pt-gutter-xl flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-md">
          <Img src={AGENT.image} alt={AGENT.name} className="w-12 h-12 rounded-full object-cover ring-4 ring-surface-card shrink-0" fallbackIcon="person" />
          <div>
            <h1 className="font-headline text-headline-md text-primary">Hi {AGENT.firstName}</h1>
            <p className="font-label text-label-md text-on-surface-variant">{AGENT.area}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!pending) return;
            actions.syncNow();
            toast(`${pending} records synced`, { icon: 'cloud_done' });
          }}
          className={cx(
            'press rounded-full px-3 py-1.5 font-label text-label-sm tabular-nums',
            pending ? 'bg-accent-container text-on-accent-container' : 'bg-primary-container text-on-primary-container',
          )}
        >
          {pending ? `Offline · ${pending} to sync` : 'Online · synced'}
        </button>
      </header>
      <main className="px-page-margin flex flex-col gap-gutter-lg">
        <section className="grid grid-cols-3 gap-gutter-sm items-stretch">
          <Metric label="Farmers" value={AGENT.farmers + state.adminFarmers.length - 3} />
          <Metric label="Collections" value={AGENT.collections} />
          <Metric label="Commission" value={money(AGENT.commission)} small />
        </section>
        <section className="grid grid-cols-3 gap-gutter-sm items-stretch">
          <Link to="/agent/register" className="clay-btn-primary press bg-primary text-on-primary rounded-xl p-gutter-md flex flex-col items-center justify-center gap-gutter-xs text-center">
            <Icon name="person_add" size={24} />
            <span className="font-label text-label-sm">Register</span>
          </Link>
          <Link to="/agent/grading" className="clay-card press bg-surface-card text-on-surface rounded-xl p-gutter-md flex flex-col items-center justify-center gap-gutter-xs text-center">
            <Icon name="verified" size={24} className="text-primary" />
            <span className="font-label text-label-sm">Grade</span>
          </Link>
          <Link to="/agent/collections" className="clay-card press bg-surface-card text-on-surface rounded-xl p-gutter-md flex flex-col items-center justify-center gap-gutter-xs text-center">
            <Icon name="local_shipping" size={24} className="text-accent-text" />
            <span className="font-label text-label-sm">Collect</span>
          </Link>
        </section>
        <RouteCard />
      </main>
    </MobileScreen>
  );
}

function Metric({ label, value, small }) {
  return (
    <div className="clay-card bg-surface-card rounded-xl p-gutter-md flex flex-col justify-between gap-1">
      <span className="font-label text-label-sm text-on-surface-variant">{label}</span>
      <span className={cx('tabular-nums', small ? 'font-title text-title-lg text-accent-text' : 'font-headline text-headline-lg-mobile text-primary')}>{value}</span>
    </div>
  );
}

function RouteCard() {
  return (
    <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
      <h2 className="font-title text-title-lg text-primary">Today&apos;s route ({ROUTE_STOPS.length} stops)</h2>
      <Img src={IMAGES.routeMap} alt="Route map around Okahao" className="w-full h-32 object-cover rounded-xl" fallbackIcon="map" />
      <ul className="flex flex-col gap-gutter-sm">
        {ROUTE_STOPS.map((s, i) => (
          <li key={s.id}>
            <Link to={`/agent/grading?stop=${s.id}`} className="bg-surface-elevated rounded px-gutter-md py-gutter-sm flex items-center justify-between press">
              <span className="font-body text-body-md">
                {i + 1}. {s.farmer} · {CROPS[s.crop].short ?? CROPS[s.crop].name}
              </span>
              <span className="font-label text-label-md text-primary tabular-nums">{s.time}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Agent "Collections" tab — today's stops. */
export function AgentCollections() {
  return (
    <MobileScreen nav="agent">
      <h1 className="font-headline text-headline-lg-mobile text-primary">Collections</h1>
      <RouteCard />
    </MobileScreen>
  );
}

/** Agent "Farmers" tab — farmers registered in the area. */
export function AgentFarmers() {
  const { state } = useStore();
  return (
    <MobileScreen nav="agent">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-headline-lg-mobile text-primary">My farmers</h1>
        <Link to="/agent/register" className="btn-primary px-4 py-2 text-label-md">
          <Icon name="person_add" size={18} /> Add
        </Link>
      </div>
      {state.adminFarmers.map((f) => (
        <div key={f.id} className="clay-card bg-surface-card rounded-xl p-gutter-lg flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <Img src={f.image} alt={f.name} className="w-11 h-11 rounded-full object-cover" fallbackIcon="person" />
            <div>
              <p className="font-title text-title-md">{f.name}</p>
              <p className="font-label text-label-sm text-on-surface-variant">
                {f.village}, {f.region}
              </p>
            </div>
          </div>
          <Badge tone={f.status === 'Verified' ? 'primary' : 'accent'}>{f.status}</Badge>
        </div>
      ))}
    </MobileScreen>
  );
}

/** Agent "Earnings" tab. */
export function AgentEarnings() {
  return (
    <MobileScreen nav="agent">
      <h1 className="font-headline text-headline-lg-mobile text-primary">Earnings</h1>
      <article className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-sm">
        <p className="font-title text-title-md text-on-surface-variant">Commission this month</p>
        <p className="font-display text-display-lg-mobile text-accent-text tabular-nums">{money(AGENT.commission)}</p>
        <p className="font-label text-label-md text-on-surface-variant">From {AGENT.collections} collections · paid every Friday</p>
      </article>
      {[
        ['Collection · Maria N.', 'Today', 195],
        ['Registration · Selma K.', 'Yesterday', 50],
        ['Collection · Paulus S.', 'Mon', 140],
      ].map(([t, d, a]) => (
        <div key={t} className="clay-card bg-surface-card rounded-xl p-gutter-lg flex items-center justify-between">
          <div>
            <p className="font-title text-title-md">{t}</p>
            <p className="font-label text-label-sm text-on-surface-variant">{d}</p>
          </div>
          <span className="font-title text-title-md text-primary tabular-nums">+{money(a)}</span>
        </div>
      ))}
    </MobileScreen>
  );
}

/** Agent "Profile" tab. */
export function AgentProfile() {
  return (
    <MobileScreen nav="agent">
      <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
        <Img src={AGENT.image} alt={AGENT.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-accent" fallbackIcon="person" />
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-primary">{AGENT.name}</h1>
          <p className="font-body text-body-md text-on-surface-variant">Field agent · {AGENT.area}</p>
        </div>
      </section>
      <Link to="/farmer/help" className="clay-card bg-surface-card rounded-xl px-gutter-lg py-gutter-md flex items-center justify-between press">
        <span className="flex items-center gap-gutter-md">
          <Icon name="help" className="text-primary" />
          <span className="font-title text-title-md">Help and SMS guide</span>
        </span>
        <Icon name="chevron_right" className="text-on-surface-variant" />
      </Link>
      <Link to="/farmer/login" className="btn-outline w-full py-3.5 min-h-[48px]">
        Log out
      </Link>
    </MobileScreen>
  );
}

/* 19. Register a farmer ---------------------------------------------------- */
export function AgentRegisterFarmer() {
  const { actions } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    name: 'Selma Kashihakumwa',
    phone: '+264 81 555 2019',
    noPhone: false,
    village: 'Tsandi',
    region: 'Omusati',
    wallet: '+264 81 555 2019',
    consent: true,
  });
  const [photo, setPhoto] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.village.trim() && form.consent && (form.noPhone || form.phone.replace(/\D/g, '').length >= 9);

  return (
    <MobileScreen>
      <header className="flex flex-col gap-gutter-sm">
        <div className="flex items-center justify-between">
          <button type="button" aria-label="Back" className="btn-back" onClick={() => navigate('/agent')}>
            <Icon name="arrow_back" />
          </button>
          <Badge tone="accent">Works offline</Badge>
        </div>
        <div className="w-full h-2.5 rounded-full bg-surface-card overflow-hidden">
          <div className="w-2/3 h-full rounded-full bg-primary" />
        </div>
        <h1 className="font-headline text-headline-lg-mobile text-primary">Register a farmer</h1>
      </header>
      <form
        className="flex flex-col gap-gutter-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          actions.registerFarmer({ name: form.name.trim(), village: form.village.trim(), region: form.region, phone: form.noPhone ? 'Household contact' : form.phone });
          toast(`${form.name.split(' ')[0]} registered. SMS welcome queued`, { icon: 'person_add' });
          navigate('/agent');
        }}
      >
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <Field id="f-name" label="Farmer full name" value={form.name} onChange={(v) => set('name', v)} />
          <div className="flex flex-col gap-gutter-xs">
            <Field id="f-phone" label="Phone number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} className="tabular-nums" disabled={form.noPhone} />
            <label className="inline-flex items-center gap-gutter-sm pt-gutter-xs">
              <input type="checkbox" checked={form.noPhone} onChange={(e) => set('noPhone', e.target.checked)} />
              <span className="font-label text-label-sm text-on-surface-variant">No phone, use household contact</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-gutter-sm">
            <Field id="f-village" label="Village" value={form.village} onChange={(v) => set('village', v)} />
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="f-region" className="field-label">
                Region
              </label>
              <select id="f-region" value={form.region} onChange={(e) => set('region', e.target.value)} className="field">
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <Field id="f-wallet" label="Mobile money wallet" type="tel" value={form.wallet} onChange={(v) => set('wallet', v)} className="tabular-nums" />
        </div>
        <div className="grid grid-cols-2 gap-gutter-md">
          <button type="button" onClick={() => setPhoto(true)} className="clay-card press bg-surface-card rounded-2xl p-gutter-lg flex items-center gap-gutter-sm text-left">
            <Icon name={photo ? 'check_circle' : 'photo_camera'} size={24} className="text-primary" />
            <span className="font-label text-label-md text-primary">{photo ? 'Photo added' : 'Add photo'}</span>
          </button>
          <div className="clay-card bg-primary-container text-on-primary-container rounded-2xl p-gutter-lg flex items-center gap-gutter-sm">
            <Icon name="my_location" size={22} />
            <span className="font-label text-label-sm">Location captured</span>
          </div>
        </div>
        <label className="clay-card bg-surface-card rounded-2xl p-gutter-lg flex items-center gap-gutter-md">
          <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="w-5 h-5 shrink-0" />
          <span className="font-body text-body-md text-on-surface flex-1">Farmer agrees to FarmLine terms and data use</span>
          <Icon name="info" size={20} className="text-on-surface-variant" />
        </label>
        <button type="submit" disabled={!valid} className="btn-primary w-full py-4 min-h-[52px]">
          Register farmer
        </button>
      </form>
    </MobileScreen>
  );
}

/* 20. Quality grading & collection ---------------------------------------- */
const GRADES = [
  { key: 'A', label: 'Grade A', factor: 1 },
  { key: 'B', label: 'Grade B', factor: 0.8 },
  { key: 'R', label: 'Reject', factor: 0 },
];

export function AgentGrading() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const stop = ROUTE_STOPS.find((s) => s.id === params.get('stop')) ?? ROUTE_STOPS[0];
  const [weight, setWeight] = useState(stop.id === 'S-1' ? 195 : stop.expected);
  const [grade, setGrade] = useState('A');
  const [notes, setNotes] = useState(stop.id === 'S-1' ? 'Clean, firm, uniform size. 5kg culled.' : '');
  const g = GRADES.find((x) => x.key === grade);
  const payout = Math.round(weight * stop.price * g.factor);
  const cropLabel = CROPS[stop.crop].name;
  const cropImage = CROPS[stop.crop].image;

  return (
    <MobileScreen>
      <ScreenHeader title={`Collection: ${stop.farmer}`} subtitle={`${cropLabel} · Expected ${stop.expected}kg`} size="sm" back="/agent" />
      <main className="flex flex-col gap-gutter-lg">
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Accepted weight</h2>
            <button
              type="button"
              onClick={() => {
                const reading = Math.max(0, stop.expected - 5);
                setWeight(reading);
                toast(`Scale reads ${reading}kg`, { icon: 'scale' });
              }}
              className="btn-tonal px-3.5 py-1.5 text-label-sm"
            >
              <Icon name="scale" size={16} />
              <span>Read from scale</span>
            </button>
          </div>
          <label className="bg-surface-elevated rounded-xl px-gutter-lg py-gutter-md flex items-baseline justify-center gap-gutter-sm border border-outline-variant focus-within:border-primary">
            <span className="sr-only">Accepted weight in kilograms</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={weight}
              onChange={(e) => setWeight(Math.max(0, Number(e.target.value) || 0))}
              className="w-28 bg-transparent border-0 p-0 text-center font-display text-display-lg-mobile text-primary tabular-nums focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="font-title text-title-lg text-on-surface-variant">kg</span>
          </label>
        </section>
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-on-surface">Quality grade</h2>
          <div className="grid grid-cols-3 gap-gutter-sm" role="radiogroup" aria-label="Quality grade">
            {GRADES.map((x) => {
              const on = x.key === grade;
              return (
                <button
                  key={x.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setGrade(x.key)}
                  className={cx(
                    'press rounded-full py-3 font-label text-label-lg',
                    on && x.key !== 'R' && 'clay-btn-primary bg-primary text-on-primary',
                    on && x.key === 'R' && 'bg-error text-on-error',
                    !on && 'bg-surface-elevated border border-outline-variant',
                    !on && (x.key === 'R' ? 'text-error' : 'text-on-surface'),
                  )}
                >
                  {x.label}
                </button>
              );
            })}
          </div>
        </section>
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Photos</h2>
            <button type="button" onClick={() => toast('Camera opens on the agent phone', { icon: 'add_a_photo' })} className="text-primary font-label text-label-md inline-flex items-center gap-gutter-xs">
              <Icon name="add_a_photo" size={18} />
              <span>Add</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-gutter-sm">
            <Img src={cropImage} alt={`${cropLabel} batch 1`} className="w-full h-24 object-cover rounded-xl" fallbackIcon={CROPS[stop.crop].icon} />
            <Img src={cropImage} alt={`${cropLabel} batch 2`} className="w-full h-24 object-cover rounded-xl [transform:scaleX(-1)]" fallbackIcon={CROPS[stop.crop].icon} />
          </div>
          <label htmlFor="grade-notes" className="sr-only">
            Notes
          </label>
          <textarea id="grade-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="field" placeholder="Notes" />
        </section>
        <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-xl flex items-center justify-between gap-gutter-md">
          <div>
            <p className="font-label text-label-md">Summary</p>
            <p className="font-title text-title-md tabular-nums">{grade === 'R' ? 'Rejected · nothing paid' : `Accepted ${weight}kg · ${g.label}`}</p>
          </div>
          <span className="bg-accent text-on-accent rounded-full px-3.5 py-1.5 font-headline text-title-lg tabular-nums">{money(payout)}</span>
        </div>
        <button
          type="button"
          className="btn-primary w-full py-4 min-h-[52px]"
          onClick={() => {
            toast(`SMS sent to ${stop.farmer}: ${grade === 'R' ? 'produce rejected' : `${weight}kg ${g.label}, ${money(payout)}`}`, { icon: 'sms' });
            navigate('/agent');
          }}
        >
          Confirm and send SMS to farmer
        </button>
      </main>
    </MobileScreen>
  );
}
