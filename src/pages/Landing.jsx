import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, Img, Sparkline } from '../components/ui.jsx';
import { CROPS, PRICE_INSIGHTS } from '../data/seed.js';
import { IMAGES } from '../data/images.js';
import { cx, perUnit } from '../lib/format.js';

/* Public marketing landing page for FarmLine. */

const NAV = [
  ['How it works', '#how'],
  ['Farmers', '#farmers'],
  ['Buyers', '#buyers'],
  ['Prices', '#prices'],
  ['FAQ', '#faq'],
];

function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="FarmLine home">
      <span className="clay-logo w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center relative">
        <Icon name="chat_bubble" size={20} />
        <Icon name="eco" size={12} className="text-accent absolute bottom-1.5 right-1.5" />
      </span>
      <span className={cx('font-display text-headline-md', light ? 'text-on-primary' : 'text-primary')}>FarmLine</span>
    </Link>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const { hash } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [hash]);

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[72px] flex items-center gap-6">
        <Logo />
        <nav aria-label="Sections" className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="px-3 py-2 rounded-full font-label text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-card transition-colors duration-state-change"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <Link to="/buyer/login" className="btn-ghost px-4 h-11 text-label-lg">
            Buyer log in
          </Link>
          <Link to="/farmer/splash" className="btn-primary px-5 h-11">
            Start selling
          </Link>
        </div>
        <button
          type="button"
          className="btn-back ml-auto sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="landing-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      {open && (
        <div id="landing-menu" className="lg:hidden px-4 sm:px-8 pb-4 animate-surface-enter">
          <nav aria-label="Sections" className="clay-card bg-surface-card rounded-2xl p-3 flex flex-col">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="px-4 py-3 rounded-xl font-label text-label-lg text-on-surface hover:bg-surface-elevated">
                {label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2 sm:hidden">
              <Link to="/buyer/login" className="btn-ghost h-12 text-label-lg">
                Buyer log in
              </Link>
              <Link to="/farmer/splash" className="btn-primary h-12">
                Start selling
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* Hero visual: a clay phone showing a live listing, with floating status chips. */
function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[360px] pt-6 pb-10">
      <div className="clay-card bg-surface-card rounded-[40px] p-4 border-[6px] border-surface-elevated">
        <div className="flex items-center gap-3 px-1 pt-1 pb-3">
          <Img src={IMAGES.maria} alt="Maria Nangolo" fallbackIcon="person" className="w-11 h-11 rounded-full object-cover text-[18px]" />
          <div className="min-w-0">
            <p className="font-label text-label-sm text-on-surface-variant">Good morning</p>
            <p className="font-headline text-title-lg text-primary">Hi Maria</p>
          </div>
          <span className="ml-auto w-10 h-10 rounded-full bg-surface-elevated text-primary flex items-center justify-center relative">
            <Icon name="notifications" size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent" />
          </span>
        </div>

        <div className="clay-btn-primary bg-primary text-on-primary rounded-2xl p-4">
          <p className="font-label text-label-md text-on-primary/80">Earned this month</p>
          <p className="font-display text-display-lg-mobile tabular-nums">N$4,850</p>
          <p className="font-label text-label-sm text-accent mt-1">+N$1,950 today</p>
        </div>

        <div className="mt-3 bg-surface-elevated rounded-2xl p-3 flex items-center gap-3">
          <Img src={IMAGES.butternut} alt="Butternut" fallbackIcon="eco" className="w-14 h-14 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-title text-title-md">Butternut · 200kg</p>
            <p className="font-body text-label-md text-on-surface-variant">Ready Fri 12 Dec</p>
          </div>
          <span className="badge bg-accent-container text-on-accent-container">2 buyers</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ['add_circle', 'Sell'],
            ['receipt_long', 'Orders'],
            ['account_balance_wallet', 'Wallet'],
          ].map(([icon, label]) => (
            <div key={label} className="bg-surface-elevated rounded-xl py-3 flex flex-col items-center gap-1 text-primary">
              <Icon name={icon} size={22} />
              <span className="font-label text-label-sm text-on-surface">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="clay-card absolute -right-2 sm:-right-10 -top-2 bg-surface-elevated rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 animate-surface-enter [animation-delay:200ms]">
        <span className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center">
          <Icon name="verified" size={20} />
        </span>
        <span className="leading-tight">
          <span className="block font-label text-label-md">Grade A</span>
          <span className="block font-body text-label-sm text-on-surface-variant">Checked by Thomas K.</span>
        </span>
      </div>

      <div className="clay-card absolute -left-2 sm:-left-10 bottom-2 bg-accent rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 animate-surface-enter [animation-delay:380ms]">
        <span className="w-9 h-9 rounded-full bg-surface-elevated/70 text-on-accent flex items-center justify-center">
          <Icon name="payments" size={20} />
        </span>
        <span className="leading-tight text-on-accent">
          <span className="block font-label text-label-md tabular-nums">N$1,950 received</span>
          <span className="block font-body text-label-sm">To mobile wallet</span>
        </span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-12 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-6 items-center">
      <div className="flex flex-col gap-6 animate-surface-enter">
        <span className="badge self-start bg-surface-card text-primary clay-card px-4 py-2 text-label-md">
          <Icon name="location_on" size={16} /> Made for Namibian farms
        </span>
        <h1 className="font-display text-[38px] leading-[44px] sm:text-[52px] sm:leading-[58px] font-extrabold tracking-[-0.75px] text-primary text-balance">
          Sell your harvest before it leaves the field.
        </h1>
        <p className="font-body text-body-lg sm:text-[18px] sm:leading-[28px] text-on-surface-variant max-w-xl text-pretty">
          FarmLine connects smallholder farmers with supermarkets, hotels and traders. List your produce in the app or by SMS. An agent collects and grades it at your farm, and you are paid straight to your mobile wallet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/farmer/splash" className="btn-primary h-14 px-7 text-[16px]">
            <Icon name="agriculture" size={22} /> I’m a farmer
          </Link>
          <Link to="/buyer/signup" className="btn-outline h-14 px-7 text-[16px]">
            <Icon name="storefront" size={22} /> I’m a buyer
          </Link>
        </div>
        <p className="font-body text-label-md text-on-surface-variant flex items-center gap-2">
          <Icon name="sms" size={18} className="text-primary" />
          <span>
            No smartphone? Text <strong className="text-primary">SELL</strong> to <strong className="text-primary tabular-nums">12345</strong>.
          </span>
        </p>
      </div>
      <HeroPhone />
    </section>
  );
}

const STATS = [
  ['1,240', 'farmers selling'],
  ['32', 'field agents'],
  ['N$412,000', 'paid out to farmers'],
  ['7', 'languages, incl. Oshiwambo'],
];

function Stats() {
  return (
    <section aria-label="FarmLine in numbers" className="max-w-6xl mx-auto px-4 sm:px-8">
      <div className="clay-card bg-surface-card rounded-2xl grid grid-cols-2 lg:grid-cols-4">
        {STATS.map(([value, label], i) => (
          <div
            key={label}
            className={cx(
              'p-5 sm:p-7 flex flex-col gap-1',
              i % 2 === 1 && 'border-l border-outline-variant/60',
              i >= 2 && 'border-t lg:border-t-0 border-outline-variant/60',
              i === 2 && 'lg:border-l',
            )}
          >
            <span className="font-display text-headline-lg-mobile sm:text-headline-lg text-primary tabular-nums">{value}</span>
            <span className="font-body text-body-md text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, body, center = false, light = false }) {
  return (
    <div className={cx('flex flex-col gap-3 max-w-2xl', center && 'mx-auto text-center items-center')}>
      <span className={cx('font-label text-label-md uppercase tracking-[1.2px]', light ? 'text-accent' : 'text-accent-text')}>{eyebrow}</span>
      <h2 className={cx('font-display text-headline-lg-mobile sm:text-[34px] sm:leading-[40px] font-extrabold text-balance', light ? 'text-on-primary' : 'text-primary')}>
        {title}
      </h2>
      {body && <p className={cx('font-body text-body-lg text-pretty', light ? 'text-on-primary/80' : 'text-on-surface-variant')}>{body}</p>}
    </div>
  );
}

const STEPS = [
  ['add_circle', 'List your produce', 'Tell us the crop, how much and when it will be ready. In the app, or with one SMS.'],
  ['handshake', 'A buyer accepts', 'Supermarkets, hotels and traders see your listing and accept it at a fair, shown price.'],
  ['local_shipping', 'Collected and graded', 'A FarmLine agent weighs and grades at your farm gate. Loads are shared with neighbours.'],
  ['account_balance_wallet', 'You get paid', 'Money goes to your mobile wallet as soon as the quality check is done. No waiting for cash.'],
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 flex flex-col gap-10">
      <SectionHead
        center
        eyebrow="How it works"
        title="From field to wallet in four steps"
        body="No middlemen setting the price at the gate. You see what buyers pay before you sell."
      />
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map(([icon, title, body], i) => (
          <li key={title} className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <span
                className={cx(
                  'w-14 h-14 rounded-2xl flex items-center justify-center',
                  i === 3 ? 'bg-accent text-on-accent clay-btn-secondary' : 'bg-primary text-on-primary clay-btn-primary',
                )}
              >
                <Icon name={icon} size={28} />
              </span>
              <span className="font-display text-[44px] leading-none text-outline-variant tabular-nums" aria-hidden>
                {i + 1}
              </span>
            </div>
            <h3 className="font-headline text-headline-md text-primary">{title}</h3>
            <p className="font-body text-body-md text-on-surface-variant">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const SMS_THREAD = [
  ['out', 'SELL BUTTERNUT 200KG'],
  ['in', 'Listed: Butternut 200kg at N$10.00/kg. We will SMS you when a buyer accepts. Reply ORDERS to check.'],
  ['in', 'A buyer in Windhoek accepted your butternut. Agent Thomas K. collects Fri 08:00.'],
  ['in', 'Paid N$1,950 to your wallet for 195kg Grade A. Ref FL-PAY-88213.'],
];

function Farmers() {
  return (
    <section id="farmers" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="flex flex-col gap-6">
        <SectionHead
          eyebrow="For farmers"
          title="Works on any phone, even without data"
          body="Every feature in the app also works by SMS, in your language. Your field agent can register you in five minutes."
        />
        <ul className="flex flex-col gap-3">
          {[
            ['sell', 'See today’s price before you list'],
            ['groups', 'Share a truck with neighbours to fill a load'],
            ['translate', 'English, Oshiwambo, Afrikaans, Otjiherero and more'],
            ['support_agent', 'A local agent you can call for help'],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                <Icon name={icon} size={20} />
              </span>
              <span className="font-body text-body-lg">{text}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link to="/farmer/splash" className="btn-primary h-12 px-6">
            Open the farmer app <Icon name="arrow_forward" size={20} />
          </Link>
          <Link to="/farmer/help" className="btn-ghost h-12 px-5 text-label-lg">
            <Icon name="sms" size={20} /> SMS guide
          </Link>
        </div>
      </div>

      <div className="clay-card bg-surface-card rounded-2xl p-5 sm:p-7 max-w-md w-full mx-auto lg:mr-0">
        <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/60">
          <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <Icon name="sms" size={20} />
          </span>
          <div>
            <p className="font-title text-title-md">FarmLine</p>
            <p className="font-body text-label-sm text-on-surface-variant tabular-nums">12345 · SMS</p>
          </div>
        </div>
        <ol className="flex flex-col gap-3 pt-4" aria-label="Example SMS conversation">
          {SMS_THREAD.map(([dir, text], i) => (
            <li
              key={i}
              className={cx(
                'max-w-[85%] px-4 py-3 font-body text-body-md',
                dir === 'out'
                  ? 'self-end bg-primary text-on-primary rounded-2xl rounded-br-md font-label tracking-[0.4px]'
                  : 'self-start bg-surface-elevated text-on-surface rounded-2xl rounded-bl-md',
              )}
            >
              {text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Buyers() {
  return (
    <section id="buyers" className="scroll-mt-24 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 lg:order-2">
          <SectionHead
            light
            eyebrow="For buyers"
            title="Reliable local supply, traced to every farm"
            body="Order graded produce from hundreds of farmers through one portal, with one delivery and one invoice."
          />
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              ['verified', 'Graded at the farm gate'],
              ['inventory_2', 'Pooled loads, steady volumes'],
              ['route', 'Full traceability for compliance'],
              ['request_quote', 'Post a request, farmers respond'],
            ].map(([icon, text]) => (
              <li key={text} className="bg-on-primary/10 rounded-xl px-4 py-3 flex items-center gap-3 text-on-primary">
                <Icon name={icon} size={20} className="text-accent" />
                <span className="font-label text-label-lg">{text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link to="/buyer/signup" className="press clay-btn-secondary bg-accent text-on-accent rounded-full h-12 px-6 inline-flex items-center gap-2 font-label text-label-lg">
              Create a buyer account <Icon name="arrow_forward" size={20} />
            </Link>
            <Link to="/buyer/marketplace" className="press rounded-full h-12 px-6 inline-flex items-center gap-2 font-label text-label-lg text-on-primary border-2 border-on-primary/40 hover:border-on-primary">
              Browse the marketplace
            </Link>
          </div>
        </div>

        <div className="clay-card bg-surface-card rounded-2xl p-5 sm:p-7 flex flex-col gap-5 lg:order-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-headline text-headline-md text-primary">Order #FL-1042</p>
              <p className="font-body text-label-md text-on-surface-variant">14 supplying farmers · Omusati → Windhoek</p>
            </div>
            <span className="badge bg-accent text-on-accent tabular-nums">N$11,420</span>
          </div>
          <ol className="grid grid-cols-5 gap-1" aria-label="Order progress: in transit">
            {['Confirmed', 'Collecting', 'Checked', 'In transit', 'Delivered'].map((s, i) => (
              <li key={s} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={cx(
                    'w-9 h-9 rounded-full flex items-center justify-center',
                    i < 4 ? 'bg-accent text-on-accent' : 'bg-surface-elevated border-2 border-outline-variant',
                  )}
                >
                  {i < 3 && <Icon name="check" size={18} />}
                  {i === 3 && <Icon name="local_shipping" size={18} />}
                </span>
                <span className={cx('font-label text-[11px] leading-[14px] sm:text-label-sm', i < 4 ? 'text-on-surface' : 'text-on-surface-variant')}>{s}</span>
              </li>
            ))}
          </ol>
          <ul className="flex flex-col gap-2">
            {[
              ['butternut', '500kg', 'N$5,000'],
              ['onions', '300kg', 'N$2,550'],
              ['spinach', '80 bunches', 'N$960'],
            ].map(([crop, q, total]) => (
              <li key={crop} className="bg-surface-elevated rounded-xl px-4 py-3 flex items-center gap-3">
                <Img src={CROPS[crop].image} alt={CROPS[crop].name} fallbackIcon={CROPS[crop].icon} className="w-9 h-9 rounded-lg object-cover" />
                <span className="font-label text-label-lg flex-1 min-w-0">
                  {CROPS[crop].name}
                  <span className="hidden sm:inline"> · Grade A</span>
                </span>
                <span className="font-body text-body-md text-on-surface-variant tabular-nums">
                  {q} · {total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHead
          eyebrow="Market prices"
          title="Know the price before you plant"
          body="Average prices paid on FarmLine over the last 12 weeks."
        />
        <Link to="/farmer/prices" className="btn-ghost h-11 px-5 text-label-lg self-start sm:self-auto shrink-0">
          All price insights <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {Object.entries(PRICE_INSIGHTS).map(([crop, p]) => {
          const up = p.change >= 0;
          return (
            <Link
              key={crop}
              to={`/farmer/prices?crop=${crop}`}
              className="clay-card press bg-surface-card rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Img src={CROPS[crop].image} alt="" fallbackIcon={CROPS[crop].icon} className="w-11 h-11 rounded-xl object-cover" />
                <span className="font-headline text-title-lg">{CROPS[crop].name}</span>
                <span
                  className={cx(
                    'badge ml-auto tabular-nums',
                    up ? 'bg-primary-container text-on-primary-container' : 'bg-error/10 text-error',
                  )}
                >
                  <Icon name={up ? 'trending_up' : 'trending_down'} size={16} />
                  {up ? '+' : ''}
                  {p.change}%
                </span>
              </div>
              <p className="font-display text-headline-lg text-primary tabular-nums">{perUnit(p.avg, 'kg', { decimals: 2 })}</p>
              <Sparkline values={p.series} label={`${CROPS[crop].name} price trend`} className="w-full h-16" />
              <p className="font-body text-label-md text-on-surface-variant">{p.tip}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
      <figure className="clay-card bg-accent-container rounded-2xl p-7 sm:p-12 grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
        <Img src={IMAGES.maria} alt="Maria Nangolo" fallbackIcon="person" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover text-[36px] clay-card" />
        <div className="flex flex-col gap-4">
          <Icon name="format_quote" size={40} className="text-accent-text" />
          <blockquote className="font-headline text-headline-md sm:text-headline-lg text-on-accent-container text-pretty">
            Before, I waited for a trader to drive past and take whatever price he said. Now I know the price, the buyer and the day my money comes.
          </blockquote>
          <figcaption className="font-label text-label-lg text-on-accent-container">
            Maria Nangolo <span className="font-body text-on-surface-variant">· butternut and onion farmer, Okahao</span>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}

const LANDING_FAQS = [
  ['What does it cost farmers?', 'Listing is free. FarmLine takes a small service fee from the buyer, so the price you see is the price you get.'],
  ['How and when do I get paid?', 'Straight to your mobile money wallet, as soon as your produce is collected and the quality check is done.'],
  ['What if my produce is graded lower?', 'Grade B produce is still bought at a lower, agreed price. If it is rejected, your agent explains why and it stays yours to sell elsewhere.'],
  ['I only have a small harvest. Can I still sell?', 'Yes. FarmLine pools produce from neighbouring farms into one load, so even 50kg can reach a supermarket.'],
  ['How do buyers pay?', 'Buyers get one monthly invoice per store, with delivery notes and traceability records for every order.'],
];

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 max-w-3xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24 flex flex-col gap-8">
      <SectionHead center eyebrow="Questions" title="Good to know" />
      <div className="flex flex-col gap-3">
        {LANDING_FAQS.map(([q, a], i) => (
          <details key={q} className="group clay-card bg-surface-card rounded-2xl" open={i === 0}>
            <summary className="flex items-center gap-4 px-6 py-5 font-title text-title-lg">
              <span className="flex-1">{q}</span>
              <span className="w-9 h-9 rounded-full bg-surface-elevated text-primary flex items-center justify-center shrink-0 transition-transform duration-surface-enter group-open:rotate-45">
                <Icon name="add" size={22} />
              </span>
            </summary>
            <p className="px-6 pb-6 -mt-1 font-body text-body-lg text-on-surface-variant">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
      <div className="clay-logo bg-primary rounded-2xl p-8 sm:p-14 flex flex-col lg:flex-row lg:items-center gap-8 relative overflow-hidden">
        <Icon name="eco" size={220} className="text-on-primary/[0.06] absolute -right-8 -bottom-12 pointer-events-none" />
        <div className="flex flex-col gap-3 flex-1 relative">
          <h2 className="font-display text-headline-lg-mobile sm:text-[34px] sm:leading-[40px] font-extrabold text-on-primary text-balance">
            Your next harvest could already be sold.
          </h2>
          <p className="font-body text-body-lg text-on-primary/80">Join in minutes, or ask your local FarmLine agent to sign you up.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative">
          <Link to="/farmer/splash" className="press clay-btn-secondary bg-accent text-on-accent rounded-full h-14 px-7 inline-flex items-center justify-center gap-2 font-label text-[16px]">
            Start selling
          </Link>
          <Link to="/buyer/signup" className="press bg-surface-elevated text-primary rounded-full h-14 px-7 inline-flex items-center justify-center gap-2 font-label text-[16px]">
            Buy produce
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-outline-variant/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="font-body text-body-md text-on-surface-variant max-w-xs">Namibia’s agri marketplace for farmers, field agents and buyers.</p>
        </div>
        {[
          ['Farmers', [['Farmer app', '/farmer/splash'], ['SMS guide', '/farmer/help'], ['Market prices', '/farmer/prices']]],
          ['Buyers', [['Create account', '/buyer/signup'], ['Log in', '/buyer/login'], ['Marketplace', '/buyer/marketplace']]],
          ['FarmLine', [['Field agents', '/agent'], ['Ops admin', '/admin'], ['All screens', '/screens']]],
        ].map(([title, links]) => (
          <nav key={title} aria-label={title} className="flex flex-col gap-2">
            <p className="font-label text-label-md text-on-surface-variant uppercase tracking-[1px]">{title}</p>
            {links.map(([label, to]) => (
              <Link key={to} to={to} className="font-label text-label-lg text-on-surface hover:text-primary w-fit">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <p className="max-w-6xl mx-auto px-4 sm:px-8 pb-8 font-body text-label-md text-on-surface-variant">© 2026 FarmLine · Windhoek, Namibia</p>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <TopNav />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Farmers />
        <Buyers />
        <Prices />
        <Testimonial />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
