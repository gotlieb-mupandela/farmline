import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chip, Icon, Img, Toggle } from '../../components/ui.jsx';
import { IMAGES } from '../../data/images.js';
import { BUYER } from '../../data/seed.js';
import { cx } from '../../lib/format.js';

/* 24. Web landing + log in ------------------------------------------------- */
export function BuyerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(BUYER.email);
  const [password, setPassword] = useState('demo-password');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 flex items-center">
      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center animate-surface-enter">
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center clay-btn-primary">
              <Icon name="eco" size={26} />
            </div>
            <span className="font-headline text-headline-md text-primary">FarmLine Buyer Portal</span>
          </div>
          <h1 className="font-display text-display-lg-mobile sm:text-display-lg text-primary text-balance">
            Buy local produce, straight from Namibian farmers
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="bg-surface-card clay-card rounded-full px-4 py-2 inline-flex items-center gap-2 font-label text-label-md text-on-surface">
              <Icon name="verified" size={18} className="text-primary" />
              <span>Graded quality</span>
            </span>
            <span className="bg-surface-card clay-card rounded-full px-4 py-2 inline-flex items-center gap-2 font-label text-label-md text-on-surface">
              <Icon name="local_shipping" size={18} className="text-primary" />
              <span>Reliable supply</span>
            </span>
            <span className="bg-accent text-on-accent rounded-full px-4 py-2 inline-flex items-center gap-2 font-label text-label-md">
              <Icon name="assessment" size={18} />
              <span>Local-sourcing reports</span>
            </span>
          </div>
          <div className="clay-card bg-surface-card rounded-2xl p-4">
            <Img src={IMAGES.hero} alt="Namibian farm produce flowing to supermarkets" className="w-full h-56 sm:h-72 object-cover rounded-xl" fallbackIcon="storefront" />
          </div>
        </section>
        <section className="lg:col-span-5">
          <div className="clay-card bg-surface-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h2 className="font-headline text-headline-lg text-primary">Log in</h2>
              <p className="font-body text-body-md text-on-surface-variant">Access your supermarket or hospitality buyer account.</p>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                navigate('/buyer');
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="buyer-email" className="field-label">
                  Work email
                </label>
                <input id="buyer-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-web" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="buyer-pass" className="field-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="buyer-pass"
                    type={show ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field-web pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-8 h-8 flex items-center justify-center"
                  >
                    <Icon name={show ? 'visibility_off' : 'visibility'} size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span className="font-label text-label-md text-on-surface-variant">Remember me</span>
                </label>
                <a href="#forgot" className="font-label text-label-md text-primary underline underline-offset-4">
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="btn-primary w-full py-4 mt-2">
                Log in
              </button>
            </form>
            <p className="text-center font-body text-body-md text-on-surface-variant">
              New to FarmLine?{' '}
              <Link to="/buyer/signup" className="font-label text-primary underline underline-offset-4">
                Create a buyer account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/* 25. Buyer sign-up -------------------------------------------------------- */
const STEPS = ['Company', 'Contact', 'Delivery locations', 'Payment'];
const BUSINESS_TYPES = ['Supermarket', 'Hotel', 'Restaurant', 'Distributor', 'Market trader'];
const TOWNS = ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati'];

export function BuyerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    business: 'Spar Windhoek Central',
    type: 'Supermarket',
    regNo: BUYER.regNo,
    town: 'Windhoek',
    imports: true,
    contactName: 'Helena Shikongo',
    contactRole: 'Procurement manager',
    email: BUYER.email,
    phone: '+264 61 300 400',
    locations: ['Maerua Mall, Windhoek'],
    newLocation: '',
    terms: '7 days',
    billingEmail: 'accounts@sparwindhoek.na',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const last = step === STEPS.length - 1;

  return (
    <div className="min-h-screen w-full max-w-5xl mx-auto px-5 sm:px-8 py-12 flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/buyer/login" aria-label="Back to log in" className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center clay-btn-primary">
            <Icon name="eco" size={24} />
          </Link>
          <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-primary">Create a buyer account</h1>
        </div>
        <span className="bg-accent text-on-accent rounded-full px-4 py-1.5 font-label text-label-md tabular-nums">
          Step {step + 1} of {STEPS.length}
        </span>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <ol className="lg:col-span-4 flex flex-col gap-3">
          {STEPS.map((label, i) => {
            const on = i === step;
            const done = i < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  aria-current={on ? 'step' : undefined}
                  className={cx(
                    'w-full rounded-full px-5 py-3.5 flex items-center gap-3 text-left transition-colors duration-state-change',
                    on ? 'clay-btn-primary bg-primary text-on-primary' : 'clay-card bg-surface-card text-on-surface-variant',
                    i > step && 'cursor-default',
                  )}
                >
                  <span
                    className={cx(
                      'w-7 h-7 rounded-full flex items-center justify-center font-label text-label-sm',
                      on ? 'bg-accent text-on-accent' : done ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant',
                    )}
                  >
                    {done ? <Icon name="check" size={16} /> : i + 1}
                  </span>
                  <span className="font-title text-title-md">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <form
          key={step}
          className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 animate-surface-enter"
          onSubmit={(e) => {
            e.preventDefault();
            if (last) navigate('/buyer');
            else setStep(step + 1);
          }}
        >
          {step === 0 && (
            <>
              <h2 className="font-headline text-headline-md text-primary">Company details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WebField id="biz-name" label="Business name" value={form.business} onChange={(v) => set('business', v)} className="md:col-span-2" required />
                <div className="flex flex-col gap-2 md:col-span-2">
                  <span className="field-label">Business type</span>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_TYPES.map((t) => (
                      <Chip key={t} active={form.type === t} onClick={() => set('type', t)} className="px-4">
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>
                <WebField id="reg-no" label="Registration number" value={form.regNo} onChange={(v) => set('regNo', v)} inputClass="tabular-nums" />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="town" className="field-label">
                    Town
                  </label>
                  <select id="town" value={form.town} onChange={(e) => set('town', e.target.value)} className="field-web">
                    {TOWNS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-accent-container text-on-accent-container rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon name="info" className="text-accent-text" />
                  <span className="font-body text-body-md">Do you import horticulture produce? (Tracks 47% local-sourcing compliance)</span>
                </div>
                <Toggle checked={form.imports} onChange={(v) => set('imports', v)} label="Imports horticulture produce" />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-headline text-headline-md text-primary">Main contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WebField id="c-name" label="Full name" value={form.contactName} onChange={(v) => set('contactName', v)} required />
                <WebField id="c-role" label="Job title" value={form.contactRole} onChange={(v) => set('contactRole', v)} />
                <WebField id="c-email" label="Work email" type="email" value={form.email} onChange={(v) => set('email', v)} required />
                <WebField id="c-phone" label="Phone" type="tel" value={form.phone} onChange={(v) => set('phone', v)} inputClass="tabular-nums" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-headline text-headline-md text-primary">Delivery locations</h2>
              <ul className="flex flex-col gap-3">
                {form.locations.map((loc) => (
                  <li key={loc} className="bg-surface-elevated rounded-xl p-4 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <Icon name="store" className="text-primary" />
                      <span className="font-title text-title-md">{loc}</span>
                    </span>
                    <button type="button" aria-label={`Remove ${loc}`} onClick={() => set('locations', form.locations.filter((l) => l !== loc))} className="text-on-surface-variant">
                      <Icon name="close" size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <label htmlFor="new-loc" className="sr-only">
                  Add a store address
                </label>
                <input id="new-loc" value={form.newLocation} onChange={(e) => set('newLocation', e.target.value)} placeholder="Add a store address" className="field-web" />
                <button
                  type="button"
                  disabled={!form.newLocation.trim()}
                  onClick={() => setForm((f) => ({ ...f, locations: [...f.locations, f.newLocation.trim()], newLocation: '' }))}
                  className="btn-primary px-6 shrink-0 text-label-md"
                >
                  Add
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-headline text-headline-md text-primary">Payment</h2>
              <div className="flex flex-col gap-2">
                <span className="field-label">Preferred payment terms</span>
                <div className="flex flex-wrap gap-2">
                  {['On delivery', '7 days', '30 days'].map((t) => (
                    <Chip key={t} active={form.terms === t} onClick={() => set('terms', t)} className="px-4">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
              <WebField id="billing" label="Billing email" type="email" value={form.billingEmail} onChange={(v) => set('billingEmail', v)} />
              <div className="bg-primary-container text-on-primary-container rounded-xl p-3.5 flex items-center gap-2.5 font-label text-label-md">
                <Icon name="verified" size={20} />
                <span>Farmers are paid on delivery by FarmLine. You pay FarmLine on your chosen terms.</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-2 gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost px-6 py-3 text-label-lg">
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn-primary px-8 py-3.5">
              {last ? 'Create account' : 'Continue'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export function WebField({ id, label, value, onChange, type = 'text', className = '', inputClass = '', ...rest }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cx('field-web', inputClass)} {...rest} />
    </div>
  );
}
