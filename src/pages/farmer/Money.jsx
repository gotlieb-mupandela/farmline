import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, Chip, EmptyState, Icon, IconTile, Modal, Sparkline } from '../../components/ui.jsx';
import { MobileScreen, ScreenHeader } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { CROPS, PRICE_INSIGHTS } from '../../data/seed.js';
import { cx, downloadText, money, perUnit, qty } from '../../lib/format.js';
import { cropName } from './shared.js';

/* 14. Wallet --------------------------------------------------------------- */
export function Wallet() {
  const { state } = useStore();
  const toast = useToast();
  const [withdraw, setWithdraw] = useState(false);
  const [amount, setAmount] = useState('2000');
  const { farmer, payments } = state;

  const statement = () => {
    const rows = payments.map((p) => `${p.date},${p.from},#${p.order},${cropName(p.crop)} ${p.qty}kg,${p.amount},${p.id}`);
    downloadText('farmline-statement.csv', ['Date,From,Order,Crop,Amount (N$),Reference', ...rows].join('\n'), 'text/csv');
    toast('Statement downloaded', { icon: 'download' });
  };

  return (
    <MobileScreen nav="farmer" padded={false}>
      <header className="px-page-margin pt-gutter-xl">
        <h1 className="font-headline text-headline-lg-mobile text-primary">Wallet</h1>
      </header>
      <main className="px-page-margin flex flex-col gap-gutter-lg">
        <article className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <p className="font-title text-title-md text-on-surface-variant">Total paid this season</p>
          <div className="flex items-center gap-gutter-md">
            <div className="w-12 h-12 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0">
              <Icon name="account_balance_wallet" size={26} />
            </div>
            <p className="font-display text-display-lg-mobile text-accent-text tabular-nums">{money(farmer.seasonPaid)}</p>
          </div>
          <p className="font-label text-label-md text-on-surface-variant tabular-nums">Mobile money wallet: +264 81 *** {farmer.walletEnding}</p>
          <div className="grid grid-cols-2 gap-gutter-md pt-gutter-xs">
            <button type="button" onClick={() => setWithdraw(true)} className="btn-primary py-3 min-h-[48px]">
              Withdraw
            </button>
            <button type="button" onClick={statement} className="btn-tonal py-3 min-h-[48px] text-label-lg">
              Statement
            </button>
          </div>
        </article>

        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-headline text-headline-md text-primary">Recent payments</h2>
          {payments.length === 0 && <EmptyState icon="payments" title="No payments yet" />}
          {payments.map((p) => (
            <Link key={p.id} to={`/farmer/receipt/${p.id}`} className="clay-card press bg-surface-card rounded-xl p-gutter-lg flex items-center justify-between gap-gutter-md">
              <div className="flex items-center gap-gutter-md">
                <IconTile icon={CROPS[p.crop]?.icon ?? 'eco'} tone={CROPS[p.crop]?.tone === 'accent' ? 'accent-soft' : 'primary-soft'} />
                <div>
                  <p className="font-title text-title-md text-on-surface">{p.from}</p>
                  <p className="font-label text-label-sm text-on-surface-variant">{p.date.replace(/ \d{4}$/, '')} · SMS receipt sent</p>
                </div>
              </div>
              <span className="font-title text-title-md text-primary tabular-nums">+{money(p.amount)}</span>
            </Link>
          ))}
        </section>

        <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-lg flex items-center justify-between gap-gutter-md">
          <p className="font-body text-body-md">Your sales history can help you get a loan later</p>
          <Badge tone="accent" className="shrink-0">
            Coming soon
          </Badge>
        </div>
      </main>

      <Modal open={withdraw} onClose={() => setWithdraw(false)} title="Withdraw money">
        <p className="font-body text-body-md text-on-surface-variant">Send money from FarmLine to your mobile money wallet ending {farmer.walletEnding}.</p>
        <label htmlFor="withdraw-amount" className="field-label">
          Amount
        </label>
        <div className="flex items-center gap-gutter-sm bg-surface-elevated rounded-xl px-gutter-lg py-gutter-md border border-outline-variant">
          <span className="font-title text-title-md text-primary">N$</span>
          <input
            id="withdraw-amount"
            type="number"
            inputMode="numeric"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent border-0 p-0 font-headline text-headline-md tabular-nums focus:ring-0"
          />
        </div>
        <button
          type="button"
          disabled={!(Number(amount) > 0)}
          className="btn-primary w-full py-3.5"
          onClick={() => {
            setWithdraw(false);
            toast(`${money(Number(amount))} is on its way to your wallet`, { icon: 'send_money' });
          }}
        >
          Send to my wallet
        </button>
      </Modal>
    </MobileScreen>
  );
}

/* 15. Payment receipt ------------------------------------------------------ */
export function Receipt() {
  const { id } = useParams();
  const { state } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const p = state.payments.find((x) => x.id === id) ?? state.payments[0];
  if (!p) return null;

  const rows = [
    ['From', p.from],
    ['Order', `#${p.order}`],
    ['Crop', `${cropName(p.crop)} ${qty(p.qty)}`],
    ['Date', p.date],
    ['Paid to wallet', `Ending ${state.farmer.walletEnding}`],
    ['Reference', p.id],
  ];

  const share = async () => {
    const text = `FarmLine receipt\nPayment received: ${money(p.amount, { decimals: 2 })}\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FarmLine receipt', text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast('Receipt copied. Paste it in SMS or WhatsApp', { icon: 'content_copy' });
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <MobileScreen className="py-section justify-between">
      <main className="clay-card bg-surface-card rounded-2xl p-section flex flex-col items-center text-center gap-gutter-lg">
        <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center clay-btn-primary">
          <Icon name="check" size={36} />
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg-mobile text-primary">Payment received</h1>
          <p className="font-display text-display-lg-mobile text-accent-text tabular-nums">{money(p.amount, { decimals: 2 })}</p>
        </div>
        <dl className="w-full border-t border-dashed border-outline-variant pt-gutter-lg flex flex-col gap-gutter-sm text-left">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-gutter-md">
              <dt className="font-body text-body-md text-on-surface-variant">{k}</dt>
              <dd className="font-title text-title-md text-on-surface tabular-nums text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="bg-primary-container text-on-primary-container rounded-full px-4 py-2 inline-flex items-center gap-gutter-xs">
          <Icon name="sms" size={18} />
          <span className="font-label text-label-md">A copy was sent to you by SMS</span>
        </div>
      </main>
      <footer className="flex flex-col gap-gutter-sm">
        <button type="button" onClick={share} className="btn-primary w-full py-4 min-h-[52px]">
          Share receipt
        </button>
        <button type="button" onClick={() => navigate('/farmer/wallet')} className="btn-outline w-full py-3.5 min-h-[48px]">
          Back to wallet
        </button>
      </footer>
    </MobileScreen>
  );
}

/* 16. Price insights ------------------------------------------------------- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PriceInsights() {
  const [params, setParams] = useSearchParams();
  const crop = PRICE_INSIGHTS[params.get('crop')] ? params.get('crop') : 'butternut';
  const data = PRICE_INSIGHTS[crop];
  const up = data.change >= 0;

  return (
    <MobileScreen>
      <ScreenHeader title="Market prices this week" />
      <main className="flex flex-col gap-gutter-lg">
        <div className="flex flex-wrap gap-gutter-sm" role="radiogroup" aria-label="Crop">
          {Object.keys(PRICE_INSIGHTS).map((c) => (
            <Chip
              key={c}
              active={c === crop}
              onClick={() => setParams({ crop: c }, { replace: true })}
              icon={CROPS[c].icon}
              className={cx('px-4', c !== crop && 'clay-card bg-surface-card border-transparent')}
            >
              {CROPS[c].short ?? CROPS[c].name}
            </Chip>
          ))}
        </div>

        <section key={crop} className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md animate-surface-enter">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label text-label-md text-on-surface-variant">Current average</p>
              <p className="font-display text-display-lg-mobile text-accent-text tabular-nums">{perUnit(data.avg, 'kg', { decimals: 2 })}</p>
            </div>
            <Badge tone={up ? 'primary-soft' : 'accent-soft'} className="tabular-nums">
              <Icon name={up ? 'trending_up' : 'trending_down'} size={16} />
              {up ? '+' : ''}
              {data.change}%
            </Badge>
          </div>
          <Sparkline values={data.series} height={100} className="w-full h-28" label={`12-week ${cropName(crop).toLowerCase()} price chart`} />
          <div className="flex justify-between font-label text-label-sm text-on-surface-variant">
            <span>12 wks ago</span>
            <span>6 wks ago</span>
            <span>This week</span>
          </div>
        </section>

        <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-xl flex items-start gap-gutter-md">
          <div className="w-11 h-11 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0">
            <Icon name="auto_awesome" size={22} />
          </div>
          <div className="flex flex-col gap-gutter-xs">
            <p className="font-label text-label-md text-accent-text">Market tip</p>
            <p className="font-body text-body-lg">{data.tip}</p>
          </div>
        </div>

        <section className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-lg text-primary">Best time to plant</h2>
          <div className="grid grid-cols-4 gap-gutter-sm">
            {MONTHS.map((m) => {
              const best = data.plant.best.includes(m);
              const good = data.plant.good.includes(m);
              return (
                <span
                  key={m}
                  className={cx(
                    'rounded-full py-2 text-center font-label text-label-md',
                    best ? 'bg-accent text-on-accent' : good ? 'bg-primary text-on-primary' : 'bg-surface-elevated text-on-surface-variant',
                  )}
                >
                  {m}
                </span>
              );
            })}
          </div>
          <div className="flex gap-gutter-md font-label text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-primary" /> Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-accent" /> Best
            </span>
          </div>
        </section>

        <Link to={`/farmer/sell`} className="btn-primary w-full py-4 min-h-[52px]">
          Sell {cropName(crop).toLowerCase()} now
        </Link>
      </main>
    </MobileScreen>
  );
}

/* 17. Notifications -------------------------------------------------------- */
export function FarmerNotifications() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const groups = ['Today', 'Earlier'];

  return (
    <MobileScreen>
      <ScreenHeader
        title="Notifications"
        back="/farmer/home"
        right={
          <button type="button" onClick={actions.readAllFarmerNotifications} className="font-label text-label-md text-primary underline underline-offset-4 shrink-0">
            Mark all read
          </button>
        }
      />
      <main className="flex flex-col gap-gutter-lg">
        {groups.map((g) => {
          const items = state.farmerNotifications.filter((n) => n.group === g);
          if (!items.length) return null;
          return (
            <section key={g} className="flex flex-col gap-gutter-sm">
              <h2 className="font-label text-label-lg text-on-surface-variant">{g}</h2>
              {items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    actions.readFarmerNotification(n.id);
                    navigate(n.to);
                  }}
                  className="clay-card press bg-surface-card rounded-2xl p-gutter-lg flex items-start gap-gutter-md text-left"
                >
                  <IconTile icon={n.icon} tone={n.tone} round />
                  <span className="flex-1">
                    <span className="block font-title text-title-md text-on-surface">{n.title}</span>
                    <span className="block font-body text-body-md text-on-surface-variant">{n.body}</span>
                    <span className="block font-label text-label-sm text-on-surface-variant pt-gutter-xs">{n.time}</span>
                  </span>
                  {!n.read && <span className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1" aria-label="Unread" />}
                </button>
              ))}
            </section>
          );
        })}
      </main>
    </MobileScreen>
  );
}
