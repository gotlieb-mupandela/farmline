import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Icon, Img, Modal, ToggleRow } from '../../components/ui.jsx';
import { MobileScreen, ScreenHeader } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { FAQS, LANGUAGES } from '../../data/seed.js';
import { IMAGES } from '../../data/images.js';
import { downloadText } from '../../lib/format.js';

/* 22. Profile -------------------------------------------------------------- */
const MENU = [
  { to: '/farmer/register', icon: 'agriculture', label: 'My farm details' },
  { to: '/farmer/register', icon: 'eco', label: 'Crops I grow' },
  { to: '/farmer/wallet', icon: 'account_balance_wallet', label: 'Mobile money wallet' },
  { to: '/farmer/orders', icon: 'support_agent', label: 'My agent' },
  { to: '/farmer/language', icon: 'translate', label: 'Language' },
  { to: '/farmer/help', icon: 'help', label: 'Help and support' },
  { to: '/farmer/settings', icon: 'settings', label: 'Settings' },
];

export function Profile() {
  const { state } = useStore();
  const navigate = useNavigate();
  const f = state.farmer;

  return (
    <MobileScreen nav="farmer">
      <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
        <Img src={IMAGES.maria} alt={f.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-accent" fallbackIcon="person" />
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-primary">{f.name}</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            {f.village}, {f.region}
          </p>
        </div>
        <Badge tone="accent" className="px-3.5 text-label-md">
          <Icon name="verified" size={18} />
          <span>Verified farmer</span>
        </Badge>
        <div className="grid grid-cols-3 gap-gutter-sm w-full pt-gutter-sm border-t border-outline-variant">
          <Stat value={f.orders} label="Orders" />
          <Stat value={f.rating} label="Rating" tone="text-accent-text" />
          <Stat value={f.memberSince} label="Member" />
        </div>
      </section>
      <nav aria-label="Account menu" className="flex flex-col gap-gutter-sm">
        {MENU.map((m) => (
          <Link key={m.label} to={m.to} className="clay-card press bg-surface-card rounded-xl px-gutter-lg py-gutter-md flex items-center justify-between">
            <span className="flex items-center gap-gutter-md">
              <Icon name={m.icon} className="text-primary" />
              <span className="font-title text-title-md">{m.label}</span>
            </span>
            <Icon name="chevron_right" className="text-on-surface-variant" />
          </Link>
        ))}
      </nav>
      <button type="button" onClick={() => navigate('/farmer/login')} className="btn-outline w-full py-3.5 min-h-[48px]">
        Log out
      </button>
    </MobileScreen>
  );
}

function Stat({ value, label, tone = 'text-primary' }) {
  return (
    <div>
      <p className={`font-title text-title-lg tabular-nums ${tone}`}>{value}</p>
      <p className="font-label text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

/* 23. Settings ------------------------------------------------------------- */
export function FarmerSettings() {
  const { state, actions } = useStore();
  const toast = useToast();
  const s = state.farmerSettings;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const language = LANGUAGES.find((l) => l.code === state.language)?.name ?? 'English';

  return (
    <MobileScreen>
      <ScreenHeader title="Settings" />
      <main className="flex flex-col gap-gutter-lg pb-gutter-lg">
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-primary">Notifications</h2>
          <ToggleRow label="SMS alerts" checked={s.sms} onChange={(v) => actions.setFarmerSetting('sms', v)} />
          <ToggleRow label="Push alerts" checked={s.push} onChange={(v) => actions.setFarmerSetting('push', v)} />
          <ToggleRow label="Price alerts" checked={s.price} onChange={(v) => actions.setFarmerSetting('price', v)} />
        </section>
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-primary">App &amp; data</h2>
          <Link to="/farmer/language" className="flex items-center justify-between">
            <span className="font-body text-body-md">Language</span>
            <Badge tone="accent">{language}</Badge>
          </Link>
          <ToggleRow label="Data saver mode" checked={s.dataSaver} onChange={(v) => actions.setFarmerSetting('dataSaver', v)} />
          <div className="flex items-center justify-between pt-gutter-xs border-t border-outline-variant">
            <div>
              <p className="font-body text-body-md">Offline sync</p>
              <p className="font-label text-label-sm text-on-surface-variant">Last synced {s.lastSync}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                actions.syncNow();
                toast('Synced. Everything is up to date', { icon: 'cloud_done' });
              }}
              className="press bg-primary text-on-primary rounded-full px-4 py-2 font-label text-label-sm"
            >
              Sync now
            </button>
          </div>
        </section>
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-primary">Privacy &amp; account</h2>
          <RowButton label="Data sharing consent" onClick={() => toast('You agreed to share sales data with your buyers and agent', { icon: 'policy' })} />
          <RowButton
            label="Download my data"
            onClick={() => {
              downloadText('my-farmline-data.json', JSON.stringify({ farmer: state.farmer, listings: state.listings, orders: state.farmerOrders, payments: state.payments }, null, 2), 'application/json');
              toast('Your data was downloaded', { icon: 'download' });
            }}
          />
          <RowButton label="Change phone number" to="/farmer/login" />
          <button type="button" onClick={() => setConfirmDelete(true)} className="text-left font-label text-label-md text-error pt-gutter-xs">
            Delete account
          </button>
        </section>
        <p className="font-label text-label-sm text-on-surface-variant text-center">
          FarmLine v1.0 · Terms · Privacy Policy ·{' '}
          <button
            type="button"
            className="underline"
            onClick={() => {
              actions.reset();
              toast('Demo data reset', { icon: 'restart_alt' });
            }}
          >
            Reset demo
          </button>
        </p>
      </main>
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete account?">
        <p className="font-body text-body-md text-on-surface-variant">
          Your listings and sales history will be removed. Money already in your wallet is not affected. Your agent can help if you are unsure.
        </p>
        <div className="grid grid-cols-2 gap-gutter-sm">
          <button type="button" className="btn-ghost py-3 text-label-lg" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="press rounded-full py-3 bg-error text-on-error font-label text-label-lg"
            onClick={() => {
              setConfirmDelete(false);
              toast('Request sent. Your agent will call to confirm', { icon: 'support_agent' });
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </MobileScreen>
  );
}

function RowButton({ label, to, onClick }) {
  const inner = (
    <>
      <span>{label}</span>
      <Icon name="chevron_right" className="text-on-surface-variant" />
    </>
  );
  return to ? (
    <Link to={to} className="flex items-center justify-between font-body text-body-md">
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className="flex items-center justify-between font-body text-body-md text-left">
      {inner}
    </button>
  );
}

/* 21. Help & SMS guide ----------------------------------------------------- */
const COMMANDS = [
  { cmd: 'SELL MAIZE 100KG', primary: true },
  { cmd: 'ORDERS' },
  { cmd: 'BALANCE' },
  { cmd: 'HELP' },
];

export function Help() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const faqs = FAQS.filter((f) => (f.q + f.a).toLowerCase().includes(q.trim().toLowerCase()));

  const copy = async (cmd) => {
    try {
      await navigator.clipboard.writeText(cmd);
      toast(`Copied "${cmd}". Send it to 12345`, { icon: 'content_copy' });
    } catch {
      toast(`Send "${cmd}" to 12345`, { icon: 'sms' });
    }
  };

  return (
    <MobileScreen>
      <header className="flex flex-col gap-gutter-md">
        <ScreenHeader title="How can we help?" />
        <div className="clay-card bg-surface-card rounded-full px-gutter-lg py-gutter-sm flex items-center gap-gutter-sm">
          <Icon name="search" className="text-primary" />
          <label htmlFor="help-search" className="sr-only">
            Search help topics
          </label>
          <input
            id="help-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help topics"
            className="w-full bg-transparent border-0 p-0 font-body text-body-md text-on-surface focus:ring-0"
          />
        </div>
      </header>
      <main className="flex flex-col gap-gutter-lg">
        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center gap-gutter-sm">
            <Icon name="sms" size={24} className="text-primary" />
            <h2 className="font-title text-title-lg text-primary">Use FarmLine by SMS</h2>
          </div>
          <p className="font-body text-body-md text-on-surface-variant tabular-nums">
            Send any of these commands to <strong className="text-primary">12345</strong>:
          </p>
          <div className="flex flex-wrap gap-gutter-sm">
            {COMMANDS.map((c) => (
              <button
                key={c.cmd}
                type="button"
                onClick={() => copy(c.cmd)}
                className={`press rounded-full px-3.5 py-2 font-label text-label-md ${c.primary ? 'bg-accent text-on-accent' : 'bg-primary-container text-on-primary-container'}`}
              >
                {c.cmd}
              </button>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-title text-title-md text-primary">Common questions</h2>
          {faqs.length === 0 && <p className="font-body text-body-md text-on-surface-variant">No answers match "{q}". Call support below.</p>}
          {faqs.map((f, i) => (
            <details key={f.q} className="group clay-card bg-surface-card rounded-2xl p-gutter-lg" open={i === 0}>
              <summary className="font-title text-title-md text-on-surface flex items-center justify-between gap-gutter-sm">
                <span>{f.q}</span>
                <Icon name="expand_more" className="text-primary transition-transform duration-state-change group-open:rotate-180" />
              </summary>
              <p className="font-body text-body-md text-on-surface-variant pt-gutter-sm">{f.a}</p>
            </details>
          ))}
        </section>
        <div className="grid grid-cols-2 gap-gutter-md pb-gutter-md">
          <a href="tel:12345" className="btn-primary py-3.5 min-h-[48px]">
            <Icon name="call" size={20} />
            <span>Call support</span>
          </a>
          <button type="button" onClick={() => toast('Opening WhatsApp support chat', { icon: 'chat' })} className="btn-outline py-3.5 min-h-[48px]">
            <Icon name="chat" size={20} />
            <span>WhatsApp</span>
          </button>
        </div>
      </main>
    </MobileScreen>
  );
}
