import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Donut, Icon, Img, Modal, Segmented, Sparkline, ToggleRow } from '../../components/ui.jsx';
import { PageHeader, StatCard } from '../../components/web.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { BUYER, COMPLIANCE, CROPS, DELIVERIES, SUPPLIERS } from '../../data/seed.js';
import { cx, downloadText, initials, money, qty } from '../../lib/format.js';
import { WebField } from './Auth.jsx';

/* 33. Deliveries schedule -------------------------------------------------- */
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function Deliveries() {
  const navigate = useNavigate();
  const [store, setStore] = useState('Windhoek');
  const [view, setView] = useState('Week');
  const drops = DELIVERIES.filter((d) => d.store === store);

  return (
    <>
      <PageHeader title="Deliveries schedule">
        <label htmlFor="store-select" className="sr-only">
          Store
        </label>
        <select id="store-select" value={store} onChange={(e) => setStore(e.target.value)} className="clay-card bg-surface-card rounded-full border-0 px-4 py-2 pr-10 font-label text-label-md">
          <option value="Windhoek">Windhoek store</option>
          <option value="Swakopmund">Swakopmund store</option>
        </select>
        <Segmented options={['Week', 'Month']} value={view} onChange={setView} size="sm" className="p-1" label="Calendar view" />
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {view === 'Week' ? (
          <section className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {WEEK.map((day) => {
              const list = drops.filter((d) => d.day === day);
              return (
                <div key={day} className="flex flex-col gap-2">
                  <span className="font-label text-label-md text-center">{day}</span>
                  {list.length === 0 && <div className="bg-surface-elevated rounded-xl p-3 font-label text-label-sm text-on-surface-variant">No drops</div>}
                  {list.map((d) => (
                    <button
                      key={d.order}
                      type="button"
                      onClick={() => navigate(`/buyer/orders/${d.order}`)}
                      className={cx('press rounded-xl p-3 font-label text-label-sm text-left', d.tone === 'accent' ? 'bg-accent text-on-accent' : 'bg-primary text-on-primary')}
                    >
                      #{d.order}
                      <br />
                      {d.time} · {d.crop}
                    </button>
                  ))}
                </div>
              );
            })}
          </section>
        ) : (
          <section className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-3">
            <h2 className="font-title text-title-lg text-primary">November 2026</h2>
            <div className="grid grid-cols-7 gap-2 text-center font-label text-label-sm text-on-surface-variant">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const date = i - 5; // 1 Nov 2026 is a Sunday
                const has = date >= 25 && date <= 29 && drops.some((d) => WEEK[date - 25] === d.day);
                return (
                  <span key={i} className={cx('rounded-xl py-2 tabular-nums', date < 1 || date > 30 ? 'opacity-0' : has ? 'bg-primary text-on-primary' : 'bg-surface-elevated text-on-surface')}>
                    {date}
                  </span>
                );
              })}
            </div>
          </section>
        )}
        <aside className="lg:col-span-4 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Today&apos;s deliveries</h2>
          <div className="bg-surface-elevated rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <span className="font-title text-title-md">10:00 – 11:00</span>
              <Badge tone="accent">In transit</Badge>
            </div>
            <p className="font-body text-body-md">TransNamib Cold Haul · 800kg</p>
            <Link to="/buyer/orders/FL-1042" className="press bg-primary text-on-primary rounded-full py-2 font-label text-label-md mt-1 text-center">
              Track
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

/* 34. Suppliers directory -------------------------------------------------- */
export function Suppliers() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  return (
    <>
      <PageHeader title="Suppliers directory">
        <Badge tone="primary-soft" className="px-4 py-1.5 text-label-md whitespace-normal">
          <Icon name="verified" size={18} />
          <span>All suppliers are verified by FarmLine field agents</span>
        </Badge>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {SUPPLIERS.map((s, i) => (
          <article key={s.id} className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar s={s} accent={i === 2} />
                <div>
                  <h2 className="font-title text-title-lg">{s.name}</h2>
                  <p className="font-label text-label-sm text-on-surface-variant">{s.place}</p>
                </div>
              </div>
              {s.preferred && (
                <Badge tone="accent" className="shrink-0">
                  Preferred
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {s.crops.map((c) => (
                <span key={c} className="bg-surface-elevated rounded-full px-3 py-1 font-label text-label-sm">
                  {CROPS[c].name}
                </span>
              ))}
            </div>
            <div className="flex justify-between font-body text-body-md tabular-nums">
              <span>{s.rating} ★</span>
              <span>
                {qty(s.volume)} · {s.onTime}% on-time
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" onClick={() => setProfile(s)} className="btn-ghost py-2 text-label-md">
                View profile
              </button>
              <button type="button" onClick={() => navigate(`/buyer/requests?crop=${s.crops[0]}`)} className="press bg-primary text-on-primary rounded-full py-2 font-label text-label-md">
                Request supply
              </button>
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!profile} onClose={() => setProfile(null)} title={profile?.name ?? ''}>
        {profile && (
          <>
            <div className="flex items-center gap-3">
              <Avatar s={profile} />
              <div>
                <p className="font-title text-title-md">{profile.place}</p>
                <p className="font-label text-label-sm text-on-surface-variant">Verified by Thomas K. · member since 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Rating" value={`${profile.rating} ★`} />
              <MiniStat label="Supplied" value={qty(profile.volume)} />
              <MiniStat label="On-time" value={`${profile.onTime}%`} />
            </div>
            <p className="font-body text-body-md text-on-surface-variant">
              Grows {profile.crops.map((c) => CROPS[c].name.toLowerCase()).join(' and ')}. All produce is graded at collection and traceable to the farm.
            </p>
          </>
        )}
      </Modal>
    </>
  );
}

function Avatar({ s, accent }) {
  if (s.image) return <Img src={s.image} alt={s.name} className="w-12 h-12 rounded-full object-cover shrink-0" fallbackIcon="person" />;
  return (
    <div className={cx('w-12 h-12 rounded-full flex items-center justify-center font-title text-title-md shrink-0', accent ? 'bg-accent text-on-accent' : 'bg-primary text-on-primary')}>
      {s.initials ?? initials(s.name)}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-surface-elevated rounded-xl p-3">
      <p className="font-title text-title-md tabular-nums">{value}</p>
      <p className="font-label text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

/* 35. Local sourcing compliance ------------------------------------------- */
export function Compliance() {
  const toast = useToast();
  const exportCsv = () => {
    const rows = COMPLIANCE.map((r) => `${r.crop},${r.local},${r.imported},${r.value}`);
    downloadText('local-sourcing-q4-2026.csv', ['Crop,Local (kg),Imported (kg),Local value (N$)', ...rows].join('\n'), 'text/csv');
    toast('CSV exported', { icon: 'download' });
  };

  return (
    <>
      <PageHeader title="Local sourcing report, Q4 2026" subtitle="Generated from verified FarmLine transactions">
        <button type="button" onClick={() => window.print()} className="btn-primary px-5 py-2.5 text-label-md">
          Download report (PDF)
        </button>
        <button type="button" onClick={exportCsv} className="btn-outline px-5 py-2.5 text-label-md">
          Export CSV
        </button>
      </PageHeader>
      <section className="clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex items-center justify-between gap-8 flex-wrap">
        <div className="flex items-center gap-6 flex-wrap">
          <Donut value={52} size={96} stroke={8} />
          <div>
            <Badge tone="primary">On track</Badge>
            <h2 className="font-display text-display-lg-mobile sm:text-display-lg text-accent-text tabular-nums pt-1">52% local</h2>
            <p className="font-body text-body-lg text-on-surface-variant tabular-nums">Namibian Agronomic Board minimum: 47%</p>
          </div>
        </div>
        <div className="sm:text-right tabular-nums">
          <p className="font-label text-label-md text-on-surface-variant">Verified local spend</p>
          <p className="font-headline text-headline-lg text-primary">{money(184500)}</p>
        </div>
      </section>
      <section className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4 overflow-x-auto">
        <h2 className="font-title text-title-lg text-primary">Breakdown by crop</h2>
        <table className="clay-table min-w-[560px]">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Local (kg)</th>
              <th>Imported (kg)</th>
              <th>Local share</th>
              <th>Local value</th>
            </tr>
          </thead>
          <tbody>
            {COMPLIANCE.map((r) => {
              const share = Math.round((r.local / (r.local + r.imported)) * 100);
              return (
                <tr key={r.crop}>
                  <td className="font-title">{r.crop}</td>
                  <td>{qty(r.local)}</td>
                  <td>{qty(r.imported)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-surface rounded-full">
                        <div className={cx('h-full rounded-full', share >= 47 ? 'bg-primary' : 'bg-accent')} style={{ width: `${share}%` }} />
                      </div>
                      <span>{share}%</span>
                    </div>
                  </td>
                  <td className="text-primary font-title">{money(r.value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}

/* 36. Payments & invoices -------------------------------------------------- */
const INVOICE_TONE = { 'Due soon': 'accent', Paid: 'primary', Overdue: 'error', Open: 'primary-soft' };

export function Payments() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [paying, setPaying] = useState(null);
  const outstanding = state.invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
  const paid = 96400 + state.invoices.filter((i) => i.status === 'Paid' && i.id !== 'INV-2026-84').reduce((s, i) => s + i.amount, 0);

  const download = (inv) => {
    downloadText(`${inv.id}.txt`, `FarmLine invoice ${inv.id}\nBilled to: ${BUYER.branch}\nOrder: #${inv.order}\nAmount: ${money(inv.amount)}\nStatus: ${inv.status}`);
    toast(`${inv.id} downloaded`, { icon: 'download' });
  };

  return (
    <>
      <PageHeader title="Payments & invoices" />
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Outstanding" value={money(outstanding)} tone="text-accent-text" />
        <StatCard label="Paid this month" value={money(paid)} />
        <StatCard label="Next due" value="28 Nov" tone="text-on-surface" />
      </section>
      <section className="clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
        <table className="clay-table min-w-[640px]">
          <thead>
            <tr>
              <th>Invoice no.</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-title">{inv.id}</td>
                <td>
                  <Link to={`/buyer/orders/${inv.order}`} className="hover:text-primary underline-offset-4 hover:underline">
                    #{inv.order}
                  </Link>
                </td>
                <td>{money(inv.amount)}</td>
                <td>{inv.due}</td>
                <td>
                  <Badge tone={INVOICE_TONE[inv.status]}>{inv.status}</Badge>
                </td>
                <td>
                  {inv.status === 'Paid' ? (
                    <button type="button" onClick={() => download(inv)} className="text-primary font-label text-label-md underline">
                      Download
                    </button>
                  ) : (
                    <button type="button" onClick={() => setPaying(inv)} className="press bg-primary text-on-primary rounded-full px-4 py-1.5 font-label text-label-sm">
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Modal open={!!paying} onClose={() => setPaying(null)} title={`Pay ${paying?.id ?? ''}`}>
        {paying && (
          <>
            <div className="bg-surface-elevated rounded-xl p-4 flex justify-between font-body text-body-md tabular-nums">
              <span>Order #{paying.order}</span>
              <strong>{money(paying.amount)}</strong>
            </div>
            <p className="font-body text-body-md text-on-surface-variant">Paid by EFT from your company account on file. Farmers have already been paid by FarmLine.</p>
            <button
              type="button"
              className="btn-primary w-full py-3.5"
              onClick={() => {
                actions.payInvoice(paying.id);
                toast(`${paying.id} marked as paid`, { icon: 'payments' });
                setPaying(null);
              }}
            >
              Confirm payment of {money(paying.amount)}
            </button>
          </>
        )}
      </Modal>
    </>
  );
}

/* 37. Analytics ------------------------------------------------------------ */
const SPEND = [92, 104, 118, 121, 139, 152, 168, 184.5];
const REGIONS_SHARE = [
  { name: 'Omusati', share: 48, tone: 'bg-primary' },
  { name: 'Oshana', share: 29, tone: 'bg-accent' },
  { name: 'Hardap', share: 23, tone: 'bg-primary/70' },
];

export function Analytics() {
  const [period, setPeriod] = useState('Q4 2026');
  const [store, setStore] = useState('All stores');
  return (
    <>
      <PageHeader title="Analytics">
        <select aria-label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} className="clay-card bg-surface-card rounded-full border-0 px-4 py-2 pr-10 font-label text-label-md">
          <option>Q4 2026</option>
          <option>Q3 2026</option>
        </select>
        <select aria-label="Store" value={store} onChange={(e) => setStore(e.target.value)} className="clay-card bg-surface-card rounded-full border-0 px-4 py-2 pr-10 font-label text-label-md">
          <option>All stores</option>
          {BUYER.stores.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </PageHeader>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Avg price vs import" value="-14% lower" />
        <StatCard label="On-time delivery" value="96.4%" />
        <StatCard label="Quality acceptance" value="98.1%" tone="text-accent-text" />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-lg text-primary">Spend on local produce</h2>
            <span className="font-label text-label-md text-on-surface-variant tabular-nums">N$ thousands</span>
          </div>
          <Sparkline values={SPEND} width={400} height={150} className="w-full h-40" label="Spend on local produce, rising from N$92k to N$184.5k" />
        </div>
        <div className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Supply by region</h2>
          <div className="flex flex-col gap-3">
            {REGIONS_SHARE.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between font-label text-label-md">
                  <span>{r.name}</span>
                  <span className="tabular-nums">{r.share}%</span>
                </div>
                <div className="w-full h-3 bg-surface rounded-full mt-1">
                  <div className={cx('h-full rounded-full', r.tone)} style={{ width: `${r.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* 39. Team & users --------------------------------------------------------- */
const ROLE_TONE = { Admin: 'primary', Buyer: 'accent', Finance: 'primary-soft' };

export function Team() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Buyer', store: 'Windhoek' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <PageHeader title="Team & users" back="/buyer/settings">
        <button type="button" onClick={() => setOpen(true)} className="btn-primary px-6 py-3">
          Invite member
        </button>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
          <table className="clay-table min-w-[520px]">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Store</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody>
              {state.team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <p className="font-title">{m.name}</p>
                    <p className="font-label text-label-sm text-on-surface-variant">{m.email}</p>
                  </td>
                  <td>
                    <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
                  </td>
                  <td>{m.store}</td>
                  <td>{m.active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="lg:col-span-4 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Role permissions</h2>
          <Perm icon="shield_person" title="Admin" body="Manage users, billing & compliance" />
          <Perm icon="shopping_cart" title="Buyer" body="Place orders & post purchase requests" accent />
          <Perm icon="payments" title="Finance" body="Pay invoices & export statements" />
        </aside>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Invite member">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            actions.inviteMember({ name: form.name.trim(), email: form.email.trim(), role: form.role, store: form.store });
            toast(`Invite sent to ${form.email}`, { icon: 'mail' });
            setForm({ name: '', email: '', role: 'Buyer', store: 'Windhoek' });
            setOpen(false);
          }}
        >
          <WebField id="inv-name" label="Full name" value={form.name} onChange={(v) => set('name', v)} required />
          <WebField id="inv-email" label="Work email" type="email" value={form.email} onChange={(v) => set('email', v)} required />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="inv-role" className="field-label">
                Role
              </label>
              <select id="inv-role" value={form.role} onChange={(e) => set('role', e.target.value)} className="field-web">
                <option>Admin</option>
                <option>Buyer</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="inv-store" className="field-label">
                Store
              </label>
              <select id="inv-store" value={form.store} onChange={(e) => set('store', e.target.value)} className="field-web">
                <option>Windhoek</option>
                <option>Swakopmund</option>
                <option>All stores</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary py-3.5">
            Send invite
          </button>
        </form>
      </Modal>
    </>
  );
}

function Perm({ icon, title, body, accent }) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} className={accent ? 'text-accent-text' : 'text-primary'} />
      <div>
        <p className="font-title text-title-md">{title}</p>
        <p className="font-label text-label-sm text-on-surface-variant">{body}</p>
      </div>
    </div>
  );
}

/* 40. Settings ------------------------------------------------------------- */
const SETTINGS_TABS = ['Company profile', 'Delivery locations', 'Notifications', 'Payment methods', 'Security', 'Billing', 'Team & users'];

export function BuyerSettings() {
  const { state, actions } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Company profile');
  const [company, setCompany] = useState({ name: BUYER.branch, regNo: BUYER.regNo, email: BUYER.email, location: BUYER.defaultLocation });
  const s = state.buyerSettings;
  const setC = (k, v) => setCompany((c) => ({ ...c, [k]: v }));

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <nav aria-label="Settings sections" className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-none">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t}
              type="button"
              aria-current={tab === t ? 'page' : undefined}
              onClick={() => (t === 'Team & users' ? navigate('/buyer/team') : setTab(t))}
              className={cx(
                'press rounded-full px-5 py-3 text-left font-label text-label-md whitespace-nowrap flex items-center justify-between gap-2',
                tab === t ? 'clay-btn-primary bg-primary text-on-primary' : 'clay-card bg-surface-card',
              )}
            >
              {t}
              {t === 'Team & users' && <Icon name="arrow_forward" size={18} className="hidden lg:inline-block" />}
            </button>
          ))}
        </nav>
        <section key={tab} className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6 animate-surface-enter">
          <h2 className="font-title text-title-lg text-primary">{tab}</h2>
          {tab === 'Company profile' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WebField id="s-name" label="Business name" value={company.name} onChange={(v) => setC('name', v)} />
              <WebField id="s-reg" label="Registration number" value={company.regNo} onChange={(v) => setC('regNo', v)} inputClass="tabular-nums" />
              <WebField id="s-email" label="Contact email" type="email" value={company.email} onChange={(v) => setC('email', v)} />
              <WebField id="s-loc" label="Default delivery location" value={company.location} onChange={(v) => setC('location', v)} />
            </div>
          )}
          {tab === 'Delivery locations' && (
            <ul className="flex flex-col gap-3">
              {BUYER.stores.map((st, i) => (
                <li key={st} className="bg-surface-elevated rounded-xl p-4 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Icon name="store" className="text-primary" />
                    <span className="font-title text-title-md">{st}</span>
                  </span>
                  {i === 0 && <Badge tone="primary-soft">Default</Badge>}
                </li>
              ))}
            </ul>
          )}
          {tab === 'Payment methods' && (
            <div className="bg-surface-elevated rounded-xl p-4 flex items-center gap-3">
              <Icon name="account_balance" className="text-primary" />
              <div>
                <p className="font-title text-title-md">Company EFT account</p>
                <p className="font-label text-label-sm text-on-surface-variant">Verified · used for all invoices</p>
              </div>
            </div>
          )}
          {tab === 'Billing' && <p className="font-body text-body-md text-on-surface-variant">Invoices are emailed to accounts@sparwindhoek.na. Default terms: 7 days.</p>}
          {(tab === 'Company profile' || tab === 'Notifications' || tab === 'Security') && (
            <div className={cx('flex flex-col gap-3', tab === 'Company profile' && 'border-t border-outline-variant pt-4')}>
              {tab === 'Company profile' && <h3 className="font-title text-title-md text-primary">Notifications &amp; security</h3>}
              {tab !== 'Security' && <ToggleRow label="Email & SMS order updates" checked={s.orderUpdates} onChange={(v) => actions.setBuyerSetting('orderUpdates', v)} />}
              {tab !== 'Security' && <ToggleRow label="Compliance alerts" checked={s.complianceAlerts} onChange={(v) => actions.setBuyerSetting('complianceAlerts', v)} />}
              {tab === 'Notifications' && <ToggleRow label="Weekly price digest" checked={s.weeklyDigest} onChange={(v) => actions.setBuyerSetting('weeklyDigest', v)} />}
              {tab !== 'Notifications' && <ToggleRow label="Two-factor authentication" checked={s.twoFactor} onChange={(v) => actions.setBuyerSetting('twoFactor', v)} />}
            </div>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={() => toast('Settings saved')} className="btn-primary px-8 py-3">
              Save changes
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
