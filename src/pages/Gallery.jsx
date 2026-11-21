import { Link } from 'react-router-dom';
import { Icon } from '../components/ui.jsx';

// Every designed screen, numbered as in the Stitch export.
const SECTIONS = [
  {
    title: 'Farmer app',
    icon: 'agriculture',
    blurb: 'Mobile app for smallholder farmers. Works by SMS too.',
    start: '/farmer/splash',
    screens: [
      ['1', 'Splash', '/farmer/splash'],
      ['2', 'Onboarding', '/farmer/onboarding'],
      ['3', 'Language', '/farmer/language'],
      ['4', 'Log in', '/farmer/login'],
      ['5', 'OTP code', '/farmer/otp'],
      ['6', 'Registration', '/farmer/register'],
      ['7', 'Home', '/farmer/home'],
      ['8', 'Sell produce', '/farmer/sell'],
      ['9', 'My listings', '/farmer/listings'],
      ['10', 'Listing detail', '/farmer/listings/L-201'],
      ['11', 'Buyer requests', '/farmer/requests'],
      ['12', 'Orders', '/farmer/orders'],
      ['13', 'Order detail', '/farmer/orders/FL-1042'],
      ['14', 'Wallet', '/farmer/wallet'],
      ['15', 'Payment receipt', '/farmer/receipt/FL-PAY-88213'],
      ['16', 'Price insights', '/farmer/prices'],
      ['17', 'Notifications', '/farmer/notifications'],
      ['21', 'Help & SMS guide', '/farmer/help'],
      ['22', 'Profile', '/farmer/profile'],
      ['23', 'Settings', '/farmer/settings'],
    ],
  },
  {
    title: 'Field agent',
    icon: 'support_agent',
    blurb: 'Register farmers, grade quality and run collection routes, offline.',
    start: '/agent',
    screens: [
      ['18', 'Agent dashboard', '/agent'],
      ['19', 'Register a farmer', '/agent/register'],
      ['20', 'Quality grading', '/agent/grading'],
    ],
  },
  {
    title: 'Buyer portal',
    icon: 'storefront',
    blurb: 'Web portal for supermarkets, hotels and traders.',
    start: '/buyer/login',
    screens: [
      ['24', 'Landing & log in', '/buyer/login'],
      ['25', 'Sign up', '/buyer/signup'],
      ['26', 'Dashboard', '/buyer'],
      ['27', 'Marketplace', '/buyer/marketplace'],
      ['28', 'Produce detail', '/buyer/marketplace/onions'],
      ['29', 'Purchase request', '/buyer/requests'],
      ['30', 'Checkout', '/buyer/checkout'],
      ['31', 'Orders', '/buyer/orders'],
      ['32', 'Order tracking', '/buyer/orders/FL-1042'],
      ['33', 'Deliveries', '/buyer/deliveries'],
      ['34', 'Suppliers', '/buyer/suppliers'],
      ['35', 'Compliance', '/buyer/compliance'],
      ['36', 'Payments', '/buyer/payments'],
      ['37', 'Analytics', '/buyer/analytics'],
      ['38', 'Notifications', '/buyer?notifications=1'],
      ['39', 'Team & users', '/buyer/team'],
      ['40', 'Settings', '/buyer/settings'],
    ],
  },
  {
    title: 'Ops admin',
    icon: 'admin_panel_settings',
    blurb: 'FarmLine operations: farmers, agents, loads and payments.',
    start: '/admin',
    screens: [
      ['41', 'Operations overview', '/admin'],
      ['42', 'Farmers & agents', '/admin/farmers'],
    ],
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-10 animate-surface-enter">
      <header className="flex flex-col gap-4">
        <Link to="/" className="btn-ghost self-start h-10 px-4 text-label-md">
          <Icon name="arrow_back" size={18} /> Back to the landing page
        </Link>
        <div className="flex items-center gap-3">
          <div className="clay-logo w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center relative">
            <Icon name="chat_bubble" size={28} />
            <Icon name="eco" size={16} className="text-accent absolute bottom-2 right-2" />
          </div>
          <span className="font-display text-display-lg-mobile text-primary">FarmLine</span>
        </div>
        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
          Namibia’s agri marketplace connecting rural farmers, field agents and commercial buyers. Pick an app to start, or jump straight to any screen.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SECTIONS.map((s, i) => (
          <Link
            key={s.title}
            to={s.start}
            className={
              i === 0
                ? 'clay-btn-primary press bg-primary text-on-primary rounded-2xl p-6 flex flex-col gap-3'
                : 'clay-card press bg-surface-card rounded-2xl p-6 flex flex-col gap-3'
            }
          >
            <span className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? 'bg-on-primary/15' : 'bg-primary-container text-primary'}`}>
              <Icon name={s.icon} size={26} />
            </span>
            <span className="font-headline text-headline-md">{s.title}</span>
            <span className={`font-body text-body-md ${i === 0 ? 'text-on-primary/85' : 'text-on-surface-variant'}`}>{s.blurb}</span>
            <span className="mt-auto inline-flex items-center gap-1 font-label text-label-md">
              Open <Icon name="arrow_forward" size={18} />
            </span>
          </Link>
        ))}
      </section>

      {SECTIONS.map((s) => (
        <section key={s.title} className="flex flex-col gap-4">
          <h2 className="font-headline text-headline-md text-primary">{s.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {s.screens.map(([n, label, to]) => (
              <Link key={to + n} to={to} className="clay-card press bg-surface-card rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent-container text-on-accent-container flex items-center justify-center font-label text-label-sm tabular-nums shrink-0">
                  {n}
                </span>
                <span className="font-label text-label-md">{label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
