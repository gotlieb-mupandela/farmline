import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chip, Icon, Img } from '../../components/ui.jsx';
import { MobileScreen } from '../../components/mobile.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { CROPS, GROWABLE_CROPS, LANGUAGES, REGIONS } from '../../data/seed.js';
import { IMAGES } from '../../data/images.js';
import { cx } from '../../lib/format.js';

/** App mark: chat bubble with a gold leaf, as on the splash and login screens. */
export function AppMark({ size = 'lg' }) {
  const big = size === 'lg';
  return (
    <div
      className={cx(
        'bg-primary text-on-primary flex items-center justify-center relative',
        big ? 'clay-logo w-24 h-24 rounded-2xl' : 'clay-btn-primary w-14 h-14 rounded-xl',
      )}
    >
      <Icon name="chat_bubble" size={big ? 48 : 28} />
      <Icon name="eco" size={big ? 24 : 16} className={cx('text-accent absolute', big ? 'bottom-3 right-3' : 'bottom-2 right-2')} />
    </div>
  );
}

/* 1. Splash ---------------------------------------------------------------- */
export function Splash() {
  const navigate = useNavigate();
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setDot((d) => (d + 1) % 3), 400);
    const go = setTimeout(() => navigate('/farmer/onboarding', { replace: true }), 2200);
    return () => {
      clearInterval(tick);
      clearTimeout(go);
    };
  }, [navigate]);

  return (
    <MobileScreen className="py-section items-center justify-between">
      <div aria-hidden="true" className="h-6" />
      <button type="button" onClick={() => navigate('/farmer/onboarding')} className="w-full" aria-label="Open FarmLine">
        <div className="clay-card bg-surface-card rounded-2xl p-section w-full flex flex-col items-center text-center gap-gutter-lg">
          <AppMark />
          <div className="flex flex-col gap-gutter-sm">
            <h1 className="font-display text-display-lg-mobile text-primary">FarmLine</h1>
            <div className="bg-accent text-on-accent rounded-full px-gutter-lg py-gutter-xs inline-flex items-center justify-center mx-auto">
              <p className="font-label text-label-lg">Sell your harvest from any phone</p>
            </div>
          </div>
        </div>
      </button>
      <footer className="flex items-center justify-center gap-gutter-sm pb-gutter-lg" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cx('w-3 h-3 rounded-full transition-colors duration-surface-enter', i === dot ? 'bg-primary' : i === (dot + 1) % 3 ? 'bg-primary/60' : 'bg-primary/30')}
          />
        ))}
      </footer>
    </MobileScreen>
  );
}

/* 2. Onboarding ------------------------------------------------------------ */
const SLIDES = [
  {
    image: IMAGES.farmerPhone,
    alt: 'Namibian farmer holding a basic phone',
    title: 'Sell your harvest',
    body: 'List your produce by SMS or app, no internet needed.',
  },
  {
    image: IMAGES.bakkie,
    alt: 'Supermarket and delivery bakkie',
    title: 'Reach real buyers',
    body: 'Supermarkets, hotels and traders order straight from you. Your agent helps with collection.',
  },
  {
    image: IMAGES.coins,
    alt: 'Phone with gold coins',
    title: 'Get paid to phone',
    body: 'Money goes to your mobile money wallet as soon as your produce is checked.',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;
  const others = SLIDES.filter((_, idx) => idx !== i);

  return (
    <MobileScreen className="justify-between">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-gutter-sm">
          <Icon name="eco" size={24} className="text-primary" />
          <span className="font-title text-title-md text-primary">FarmLine</span>
        </div>
        <Link to="/farmer/language" className="font-label text-label-lg text-primary px-gutter-md py-gutter-xs">
          Skip
        </Link>
      </header>

      <main className="flex flex-col gap-gutter-lg">
        <article key={i} className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col items-center text-center gap-gutter-lg animate-surface-enter">
          <Img src={slide.image} alt={slide.alt} className="w-full h-56 object-cover rounded-xl" />
          <div className="flex flex-col gap-gutter-sm">
            <h1 className="font-headline text-headline-lg-mobile text-primary">{slide.title}</h1>
            <p className="font-body text-body-lg text-on-surface-variant text-pretty">{slide.body}</p>
          </div>
        </article>
        <div className="grid grid-cols-2 gap-gutter-md">
          {others.map((s) => {
            const idx = SLIDES.indexOf(s);
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setI(idx)}
                className="clay-card press bg-surface-card rounded-xl p-gutter-md flex flex-col items-center text-center gap-gutter-xs"
              >
                <Img src={s.image} alt={s.alt} className="w-full h-20 object-cover rounded" />
                <h2 className="font-label text-label-md text-primary">{s.title}</h2>
                <p className="font-label text-label-sm text-on-surface-variant">
                  {idx === 0 ? 'By SMS or app' : idx === 1 ? 'Direct orders' : 'Fast mobile money'}
                </p>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="flex flex-col items-center gap-gutter-lg pb-gutter-sm">
        <div className="flex items-center gap-gutter-sm" aria-label={`Slide ${i + 1} of ${SLIDES.length}`}>
          {SLIDES.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cx('h-2.5 rounded-full transition-all duration-surface-enter', idx === i ? 'w-7 bg-primary' : 'w-2.5 bg-primary/30')}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn-primary w-full px-6 py-4 min-h-[52px]"
          onClick={() => (last ? navigate('/farmer/language') : setI(i + 1))}
        >
          <span>{last ? 'Get started' : 'Next'}</span>
          <Icon name="arrow_forward" size={20} />
        </button>
      </footer>
    </MobileScreen>
  );
}

/* 3. Language -------------------------------------------------------------- */
export function LanguageSelect() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(state.language);

  return (
    <MobileScreen className="justify-between">
      <header className="flex flex-col gap-gutter-xs">
        <h1 className="font-headline text-headline-lg-mobile text-primary">Choose your language</h1>
        <p className="font-body text-body-md text-on-surface-variant">You can change this anytime in Settings.</p>
      </header>
      <main className="flex flex-col gap-gutter-md" role="radiogroup" aria-label="Language selection">
        {LANGUAGES.map((l, idx) => {
          const on = selected === l.code;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(l.code)}
              className={cx(
                'clay-card press bg-surface-card rounded-xl px-gutter-lg py-gutter-md min-h-[60px] flex items-center justify-between gap-gutter-md text-left border-2',
                on ? 'border-primary' : 'border-transparent',
              )}
            >
              <div className="flex items-center gap-gutter-md">
                <span
                  className={cx(
                    'w-9 h-9 rounded-full flex items-center justify-center font-label text-label-sm',
                    on ? 'bg-primary text-on-primary' : idx % 2 ? 'bg-primary-container text-on-primary-container' : 'bg-accent-container text-on-accent-container',
                  )}
                >
                  {l.code}
                </span>
                <span className="font-title text-title-md text-on-surface">{l.name}</span>
              </div>
              {on ? (
                <span className="w-8 h-8 rounded-full bg-accent text-on-accent flex items-center justify-center">
                  <Icon name="check" size={20} />
                </span>
              ) : (
                <Icon name="radio_button_unchecked" className="text-on-surface-variant" />
              )}
            </button>
          );
        })}
      </main>
      <footer className="pt-gutter-sm">
        <button
          type="button"
          className="btn-primary w-full px-6 py-4 min-h-[52px]"
          onClick={() => {
            actions.setLanguage(selected);
            navigate('/farmer/login');
          }}
        >
          Continue
        </button>
      </footer>
    </MobileScreen>
  );
}

/* 4. Login ----------------------------------------------------------------- */
export function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('81 234 4521');
  const digits = phone.replace(/\D/g, '');
  const valid = digits.length >= 9;

  return (
    <MobileScreen className="py-section justify-between gap-gutter-xl">
      <header className="flex flex-col items-start gap-gutter-md pt-gutter-md">
        <AppMark size="sm" />
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg-mobile text-primary">Welcome back</h1>
          <p className="font-body text-body-lg text-on-surface-variant">Enter your phone number to continue</p>
        </div>
      </header>
      <form
        className="flex flex-col gap-gutter-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) navigate('/farmer/otp', { state: { phone: digits } });
        }}
      >
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <label htmlFor="phone-input" className="font-label text-label-lg text-on-surface">
            Mobile number
          </label>
          <div className="flex items-center gap-gutter-sm bg-surface-elevated rounded-xl px-gutter-lg py-gutter-md border border-outline-variant focus-within:border-primary">
            <span className="font-title text-title-md text-primary tabular-nums shrink-0">+264</span>
            <span className="w-px h-6 bg-outline-variant" aria-hidden="true" />
            <input
              id="phone-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent border-0 p-0 font-title text-title-md text-on-surface tabular-nums focus:ring-0"
            />
          </div>
        </div>
        <button type="submit" disabled={!valid} className="btn-primary w-full px-6 py-4 min-h-[52px]">
          Send code
        </button>
        <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-lg flex items-center gap-gutter-md">
          <div className="w-11 h-11 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0">
            <Icon name="sms" size={22} />
          </div>
          <p className="font-body text-body-md">
            No smartphone? Dial or SMS <strong className="font-headline">'JOIN'</strong> to{' '}
            <strong className="font-headline tabular-nums">12345</strong>
          </p>
        </div>
      </form>
      <footer className="flex flex-col items-center gap-gutter-md pb-gutter-sm">
        <Link to="/farmer/register" className="font-label text-label-lg text-primary underline underline-offset-4">
          Register as a farmer
        </Link>
        <Link to="/agent" className="font-label text-label-md text-on-surface-variant">
          I am a field agent
        </Link>
      </footer>
    </MobileScreen>
  );
}

/* 5. OTP ------------------------------------------------------------------- */
export function Otp() {
  const navigate = useNavigate();
  const toast = useToast();
  const [code, setCode] = useState('482');
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Allow typing on a physical keyboard too.
  useEffect(() => {
    const onKey = (e) => {
      if (/^\d$/.test(e.key)) setCode((c) => (c.length < 6 ? c + e.key : c));
      if (e.key === 'Backspace') setCode((c) => c.slice(0, -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const press = (d) => setCode((c) => (c.length < 6 ? c + d : c));
  const complete = code.length === 6;

  return (
    <MobileScreen className="justify-between">
      <header className="flex flex-col gap-gutter-md">
        <button type="button" aria-label="Back" className="btn-back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" />
        </button>
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg-mobile text-primary">Enter the code</h1>
          <p className="font-body text-body-md text-on-surface-variant tabular-nums">We sent a 6-digit code by SMS to +264 81 *** 4521</p>
        </div>
      </header>
      <main className="flex flex-col gap-gutter-lg">
        <div className="grid grid-cols-6 gap-gutter-sm" aria-label="6-digit verification code" aria-live="polite">
          {Array.from({ length: 6 }).map((_, idx) => {
            const ch = code[idx];
            const active = idx === code.length;
            return (
              <div
                key={idx}
                className={cx(
                  'clay-card bg-surface-card rounded h-14 flex items-center justify-center font-headline text-headline-md tabular-nums border-2',
                  active ? 'border-primary text-primary' : 'border-transparent',
                  ch ? 'text-on-surface' : 'text-on-surface-variant',
                )}
              >
                {ch ?? '•'}
              </div>
            );
          })}
        </div>
        <p className="font-label text-label-md text-on-surface-variant text-center tabular-nums">
          {seconds > 0 ? (
            <>
              Resend code in <span className="text-primary">0:{String(seconds).padStart(2, '0')}</span>
            </>
          ) : (
            <button
              type="button"
              className="text-primary underline underline-offset-4"
              onClick={() => {
                setSeconds(60);
                toast('New code sent by SMS', { icon: 'sms' });
              }}
            >
              Resend code
            </button>
          )}
        </p>
        <button type="button" disabled={!complete} onClick={() => navigate('/farmer/home')} className="btn-primary w-full px-6 py-4 min-h-[52px]">
          Verify
        </button>
      </main>
      <section aria-label="Numeric keypad" className="grid grid-cols-3 gap-gutter-sm pb-gutter-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} className="clay-card press bg-surface-card rounded-xl h-14 font-headline text-headline-md text-on-surface tabular-nums">
            {d}
          </button>
        ))}
        <div aria-hidden="true" />
        <button type="button" onClick={() => press('0')} className="clay-card press bg-surface-card rounded-xl h-14 font-headline text-headline-md text-on-surface tabular-nums">
          0
        </button>
        <button
          type="button"
          aria-label="Backspace"
          onClick={() => setCode((c) => c.slice(0, -1))}
          className="clay-card press bg-surface-card rounded-xl h-14 flex items-center justify-center text-primary"
        >
          <Icon name="backspace" size={24} />
        </button>
      </section>
    </MobileScreen>
  );
}

/* 6. Registration ---------------------------------------------------------- */
const SIZES = ['Small', 'Medium', 'Large'];

export function Register() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const f = state.farmer;
  const [form, setForm] = useState({
    name: f.name,
    village: f.village,
    region: f.region,
    phone: f.phone,
    crops: f.crops,
    farmSize: f.farmSize,
  });
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const toggleCrop = (c) => set('crops', form.crops.includes(c) ? form.crops.filter((x) => x !== c) : [...form.crops, c]);
  const valid = form.name.trim() && form.village.trim() && form.phone.replace(/\D/g, '').length >= 9 && form.crops.length > 0;

  return (
    <MobileScreen>
      <header className="flex flex-col gap-gutter-sm">
        <div className="flex items-center justify-between">
          <span className="font-label text-label-md text-primary tabular-nums">Step 2 of 3</span>
          <span className="font-label text-label-sm text-on-surface-variant">Farm profile</span>
        </div>
        <div className="w-full h-3 rounded-full bg-surface-card overflow-hidden" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={3}>
          <div className="w-2/3 h-full rounded-full bg-primary" />
        </div>
        <h1 className="font-headline text-headline-lg-mobile text-primary pt-gutter-xs">Tell us about your farm</h1>
      </header>
      <form
        className="flex flex-col gap-gutter-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          const first = form.name.trim().split(' ')[0];
          actions.updateFarmer({ ...form, firstName: first });
          navigate('/farmer/home');
        }}
      >
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <Field id="full-name" label="Full name" value={form.name} onChange={(v) => set('name', v)} autoComplete="name" />
          <Field id="village" label="Village / area" value={form.village} onChange={(v) => set('village', v)} />
          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="region" className="field-label">
              Region
            </label>
            <select id="region" value={form.region} onChange={(e) => set('region', e.target.value)} className="field">
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <Field id="wallet" label="Mobile money wallet number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} className="tabular-nums" />
        </div>
        <div className="clay-card bg-surface-card rounded-2xl p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-on-surface">What do you grow?</h2>
          <div className="flex flex-wrap gap-gutter-sm">
            {GROWABLE_CROPS.map((c) => (
              <Chip key={c} active={form.crops.includes(c)} onClick={() => toggleCrop(c)} icon={CROPS[c].icon}>
                {CROPS[c].short ?? CROPS[c].name}
              </Chip>
            ))}
          </div>
          <h2 className="font-title text-title-md text-on-surface pt-gutter-xs">Farm size</h2>
          <div className="grid grid-cols-3 gap-gutter-sm" role="radiogroup" aria-label="Farm size">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={form.farmSize === s}
                onClick={() => set('farmSize', s)}
                className={cx('chip justify-center py-2.5', form.farmSize === s ? 'chip-on' : 'chip-off')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="clay-card bg-accent-container text-on-accent-container rounded-2xl p-gutter-lg flex items-center gap-gutter-md">
          <Icon name="support_agent" size={24} className="text-accent-text" />
          <p className="font-body text-body-md">An agent can help you fill this in.</p>
        </div>
        <button type="submit" disabled={!valid} className="btn-primary w-full px-6 py-4 min-h-[52px]">
          Continue
        </button>
      </form>
    </MobileScreen>
  );
}

export function Field({ id, label, value, onChange, type = 'text', className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-gutter-xs">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cx('field', className)} {...rest} />
    </div>
  );
}

