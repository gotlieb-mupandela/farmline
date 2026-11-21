import { IMAGES } from './images.js';

/* ------------------------------------------------------------------ */
/* Crops                                                               */
/* ------------------------------------------------------------------ */
// tone: which tinted tile the crop icon sits on (design alternates gold / green).
export const CROPS = {
  butternut: { name: 'Butternut', icon: 'eco', tone: 'accent', image: IMAGES.butternut },
  tomatoes: { name: 'Tomatoes', icon: 'nutrition', tone: 'primary', image: IMAGES.tomatoes },
  onions: { name: 'Red onions', short: 'Onions', icon: 'spa', tone: 'accent', image: IMAGES.onions },
  maize: { name: 'Maize', icon: 'grass', tone: 'accent' },
  spinach: { name: 'Spinach', icon: 'yard', tone: 'primary', image: IMAGES.spinach },
  cabbage: { name: 'Cabbage', icon: 'potted_plant', tone: 'primary' },
  mahangu: { name: 'Mahangu', icon: 'agriculture', tone: 'primary' },
};

export const SELLABLE_CROPS = ['butternut', 'tomatoes', 'onions', 'maize', 'spinach', 'cabbage'];
export const GROWABLE_CROPS = ['butternut', 'tomatoes', 'maize', 'onions', 'spinach', 'mahangu'];

export const REGIONS = ['Omusati', 'Oshana', 'Ohangwena', 'Kavango East', 'Hardap'];

export const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'OS', name: 'Oshiwambo' },
  { code: 'AF', name: 'Afrikaans' },
  { code: 'OT', name: 'Otjiherero' },
  { code: 'RK', name: 'Rukwangali' },
  { code: 'SL', name: 'Silozi' },
  { code: 'DN', name: 'Damara/Nama' },
];

/* ------------------------------------------------------------------ */
/* Farmer app                                                          */
/* ------------------------------------------------------------------ */
export const FARMER = {
  name: 'Maria Nangolo',
  firstName: 'Maria',
  village: 'Okahao',
  region: 'Omusati',
  phone: '+264 81 234 4521',
  walletEnding: '4521',
  crops: ['butternut', 'tomatoes'],
  farmSize: 'Small',
  orders: 18,
  rating: 4.8,
  memberSince: 2026,
  monthEarned: 4850,
  monthChange: 18,
  seasonPaid: 12340,
  agent: { name: 'Thomas K.', image: IMAGES.thomas, phone: '+264 81 777 0192' },
};

export const LISTINGS = [
  {
    id: 'L-201',
    crop: 'butternut',
    qty: 200,
    unit: 'kg',
    price: 10,
    ready: 'Fri 22 Nov',
    readyShort: 'Ready Fri',
    status: 'waiting',
    grade: 'Pending agent check',
    interest: [
      { id: 'I-1', buyer: 'Spar Windhoek', qty: 200, price: 10 },
      { id: 'I-2', buyer: 'Oshakati Fresh Mart', qty: 150, price: 9.5 },
    ],
    trend: [7.6, 8.1, 8.4, 9.0, 9.2, 9.6, 9.9, 10.4],
  },
  {
    id: 'L-202',
    crop: 'tomatoes',
    qty: 80,
    unit: 'kg',
    price: 14,
    ready: 'today',
    readyShort: 'Ready today',
    status: 'ordered',
    grade: 'Grade A',
    interest: [],
    trend: [15.2, 14.8, 14.9, 14.1, 14.4, 13.8, 14.2, 14.0],
  },
  {
    id: 'L-203',
    crop: 'onions',
    qty: 150,
    unit: 'kg',
    price: 8.5,
    ready: 'Mon 25 Nov',
    readyShort: 'Ready Mon',
    status: 'partial',
    grade: 'Grade A',
    interest: [{ id: 'I-3', buyer: 'Ongwediva Lodge', qty: 50, price: 8.5 }],
    trend: [6.9, 7.1, 7.3, 7.6, 7.9, 8.1, 8.3, 8.6],
  },
  {
    id: 'L-180',
    crop: 'onions',
    qty: 120,
    unit: 'kg',
    price: 8.5,
    ready: 'Mon 11 Nov',
    readyShort: 'Sold',
    status: 'sold',
    grade: 'Grade A',
    interest: [],
    trend: [6.5, 6.8, 7.0, 7.2, 7.5, 7.9, 8.2, 8.5],
  },
  {
    id: 'L-171',
    crop: 'cabbage',
    qty: 40,
    unit: 'kg',
    price: 6,
    ready: 'Sun 3 Nov',
    readyShort: 'Expired',
    status: 'expired',
    grade: 'Not graded',
    interest: [],
    trend: [6.2, 6.1, 6.0, 6.2, 6.1, 5.9, 6.0, 6.0],
  },
];

// Six-step journey shown on the order detail screen.
export const ORDER_STEPS = [
  { key: 'confirmed', label: () => 'Order confirmed' },
  { key: 'agent', label: (o) => `Agent assigned (${o.agent})` },
  { key: 'quality', label: (o) => `Quality checked (${o.grade})` },
  { key: 'collected', label: (o) => o.collection.replace('Collection', 'Collected') },
  { key: 'delivered', label: (o) => `Delivered to ${o.city}` },
  { key: 'paid', label: () => 'Paid to wallet' },
];

export const FARMER_ORDERS = [
  {
    id: 'FL-1046',
    buyer: 'Oshakati trader',
    crop: 'butternut',
    qty: 100,
    total: 1000,
    stage: 'confirmed',
    collection: 'Collection to be booked',
    agent: 'Thomas K.',
    grade: 'Grade A',
    city: 'Oshakati',
    pool: 1,
  },
  {
    id: 'FL-1042',
    buyer: 'Spar Windhoek',
    crop: 'butternut',
    qty: 200,
    total: 2000,
    stage: 'quality',
    collection: 'Collection Fri 8:00',
    agent: 'Thomas K.',
    grade: 'Grade A',
    city: 'Windhoek',
    pool: 3,
  },
  {
    id: 'FL-1040',
    buyer: 'Ongwediva Lodge',
    crop: 'tomatoes',
    qty: 80,
    total: 1120,
    stage: 'collected',
    collection: 'Collection Thu 14:00',
    agent: 'Thomas K.',
    grade: 'Grade A',
    city: 'Ongwediva',
    pool: 0,
  },
  {
    id: 'FL-1033',
    buyer: 'Oshakati Fresh Mart',
    crop: 'onions',
    qty: 120,
    total: 1020,
    stage: 'paid',
    collection: 'Collection Sat 16 Nov',
    deliveredOn: '18 Nov',
    agent: 'Thomas K.',
    grade: 'Grade A',
    city: 'Oshakati',
    pool: 0,
  },
];

export const PAYMENTS = [
  {
    id: 'FL-PAY-88213',
    from: 'Spar Windhoek',
    order: 'FL-1031',
    crop: 'butternut',
    qty: 200,
    amount: 2000,
    date: '18 Nov 2026',
  },
  {
    id: 'FL-PAY-87940',
    from: 'Ongwediva Lodge',
    order: 'FL-1027',
    crop: 'tomatoes',
    qty: 80,
    amount: 1120,
    date: '12 Nov 2026',
  },
];

export const BUYER_REQUESTS = [
  {
    id: 'R-1',
    buyer: 'Spar Windhoek',
    type: 'Supermarket',
    icon: 'storefront',
    distance: 420,
    crop: 'onions',
    need: '1 tonne onions weekly',
    due: 'Fri 29 Nov',
    price: 8,
  },
  {
    id: 'R-2',
    buyer: 'Oshakati trader',
    type: 'Market trader',
    icon: 'local_mall',
    distance: 28,
    crop: 'butternut',
    need: '300kg butternut',
    due: 'Mon 25 Nov',
    price: 10,
  },
  {
    id: 'R-3',
    buyer: 'Ongwediva Lodge',
    type: 'Hotel',
    icon: 'restaurant',
    distance: 35,
    crop: 'tomatoes',
    need: '100kg tomatoes',
    due: 'Wed 27 Nov',
    price: 15,
  },
];

export const FARMER_NOTIFICATIONS = [
  {
    id: 'N-1',
    group: 'Today',
    icon: 'shopping_bag',
    tone: 'primary',
    title: 'New order: Spar',
    body: '200kg butternut · Collection Fri 8:00',
    time: '2 hours ago',
    read: false,
    to: '/farmer/orders/FL-1042',
  },
  {
    id: 'N-2',
    group: 'Today',
    icon: 'payments',
    tone: 'accent',
    title: 'Payment received: N$2,000',
    body: 'Sent to your mobile money wallet',
    time: '5 hours ago',
    read: false,
    to: '/farmer/receipt/FL-PAY-88213',
  },
  {
    id: 'N-3',
    group: 'Earlier',
    icon: 'support_agent',
    tone: 'primary-soft',
    title: 'Agent visit scheduled',
    body: 'Thomas K. will visit Thu at 10:00',
    time: 'Yesterday',
    read: true,
    to: '/farmer/orders/FL-1042',
  },
  {
    id: 'N-4',
    group: 'Earlier',
    icon: 'trending_up',
    tone: 'accent-soft',
    title: 'Price alert: Red onions up',
    body: 'Windhoek demand is high this week',
    time: '2 days ago',
    read: true,
    to: '/farmer/prices?crop=onions',
  },
  {
    id: 'N-5',
    group: 'Earlier',
    icon: 'schedule',
    tone: 'primary-soft',
    title: 'Listing expiring soon',
    body: 'Tomatoes 80kg expires in 2 days',
    time: '3 days ago',
    read: true,
    to: '/farmer/listings/L-202',
  },
];

// 12 weekly price points per crop, oldest first.
export const PRICE_INSIGHTS = {
  butternut: {
    avg: 10.5,
    change: 12,
    series: [7.4, 7.7, 7.9, 8.3, 8.4, 8.8, 9.1, 9.5, 9.7, 10.0, 10.3, 10.5],
    tip: 'Supermarkets in Windhoek are buying more butternut. Prices are still climbing.',
    plant: { good: ['Jan', 'Feb', 'Sep', 'Oct'], best: ['Aug'] },
  },
  onions: {
    avg: 8.6,
    change: 18,
    series: [6.4, 6.6, 6.7, 6.9, 7.0, 7.3, 7.5, 7.7, 8.0, 8.2, 8.4, 8.6],
    tip: 'Demand for onions is rising in Windhoek. Good time to sell.',
    plant: { good: ['Mar', 'Apr', 'May'], best: ['Apr'] },
  },
  tomatoes: {
    avg: 14.0,
    change: -4,
    series: [15.1, 15.3, 14.9, 14.8, 14.6, 14.9, 14.4, 14.3, 14.5, 14.1, 14.2, 14.0],
    tip: 'Lots of tomatoes on the market now. Sell to hotels for a better price.',
    plant: { good: ['Jul', 'Aug', 'Sep'], best: ['Aug'] },
  },
};

export const FAQS = [
  {
    q: 'How do I get paid?',
    a: 'Money is sent straight to your mobile money wallet as soon as your produce is collected and checked.',
  },
  {
    q: 'What if my produce is rejected?',
    a: 'Your agent will explain why and help you list Grade B produce for local market traders.',
  },
  {
    q: 'How do I contact my agent?',
    a: 'Open your Profile or any active order to call your assigned field agent directly.',
  },
  {
    q: 'Can I sell without internet?',
    a: 'Yes. Send SELL, the crop and the amount by SMS to 12345. Your listing is saved and buyers can see it.',
  },
];

/* ------------------------------------------------------------------ */
/* Field agent                                                         */
/* ------------------------------------------------------------------ */
export const AGENT = {
  name: 'Thomas K.',
  firstName: 'Thomas',
  area: 'Okahao area',
  image: IMAGES.thomas,
  farmers: 38,
  collections: 12,
  commission: 1240,
};

export const ROUTE_STOPS = [
  { id: 'S-1', farmer: 'Maria N.', crop: 'butternut', time: '08:00', expected: 200, price: 10 },
  { id: 'S-2', farmer: 'Paulus S.', crop: 'onions', time: '09:30', expected: 150, price: 8.5 },
  { id: 'S-3', farmer: 'Selma K.', crop: 'tomatoes', time: '11:15', expected: 60, price: 14 },
  { id: 'S-4', farmer: 'Johannes T.', crop: 'maize', time: '14:00', expected: 300, price: 5 },
];

/* ------------------------------------------------------------------ */
/* Buyer portal                                                        */
/* ------------------------------------------------------------------ */
export const BUYER = {
  company: 'Spar Windhoek',
  branch: 'Spar Windhoek Central',
  initials: 'SW',
  email: 'procurement@sparwindhoek.na',
  regNo: 'CC/2018/04921',
  stores: ['Spar Windhoek Central', 'Spar Swakopmund'],
  defaultLocation: 'Maerua Mall, Windhoek',
};

export const MARKET_LOTS = [
  {
    id: 'butternut',
    crop: 'butternut',
    name: 'Butternut',
    available: 1200,
    unit: 'kg',
    farmers: 6,
    region: 'Omusati',
    ready: 'Fri 22 Nov',
    delivery: 'Mon 25 Nov',
    grade: 'A',
    price: 10,
  },
  {
    id: 'onions',
    crop: 'onions',
    name: 'Red onions',
    available: 850,
    unit: 'kg',
    farmers: 5,
    region: 'Omusati',
    ready: 'Sat 23 Nov',
    delivery: 'Mon 25 Nov',
    grade: 'A',
    price: 8.5,
  },
  {
    id: 'tomatoes',
    crop: 'tomatoes',
    name: 'Tomatoes',
    available: 400,
    unit: 'kg',
    farmers: 4,
    region: 'Oshana',
    ready: 'today',
    delivery: 'Sat 23 Nov',
    grade: 'A',
    price: 14,
  },
  {
    id: 'spinach',
    crop: 'spinach',
    name: 'Fresh spinach',
    available: 240,
    unit: 'bunch',
    farmers: 3,
    region: 'Hardap',
    ready: 'Mon 25 Nov',
    delivery: 'Tue 26 Nov',
    grade: 'A',
    price: 12,
  },
  {
    id: 'cabbage',
    crop: 'cabbage',
    name: 'Cabbage',
    available: 600,
    unit: 'kg',
    farmers: 4,
    region: 'Kavango East',
    ready: 'Tue 26 Nov',
    delivery: 'Fri 29 Nov',
    grade: 'B',
    price: 6.5,
  },
];

export const SUPPLY_BREAKDOWN = {
  onions: [
    { id: 'FRM-104', village: 'Okahao', qty: 200 },
    { id: 'FRM-118', village: 'Tsandi', qty: 250 },
    { id: 'FRM-129', village: 'Outapi', qty: 400 },
  ],
};

export const CART = [
  { lotId: 'butternut', qty: 500 },
  { lotId: 'onions', qty: 300 },
  { lotId: 'spinach', qty: 80 },
];

export const BUYER_ORDERS = [
  {
    id: 'FL-1042',
    items: [
      { name: 'Butternut', crop: 'butternut', qty: 500, unit: 'kg', price: 10 },
      { name: 'Red onions', crop: 'onions', qty: 300, unit: 'kg', price: 8.5 },
      { name: 'Spinach', crop: 'spinach', qty: 80, unit: 'bunch', price: 12 },
    ],
    total: 11420,
    farmers: 6,
    delivery: '25 Nov 2026',
    eta: 'Mon 10:30',
    store: 'Spar Windhoek Central',
    status: 'In transit',
    region: 'Omusati',
  },
  {
    id: 'FL-1039',
    items: [{ name: 'Tomatoes', crop: 'tomatoes', qty: 400, unit: 'kg', price: 14 }],
    total: 5600,
    farmers: 4,
    delivery: '22 Nov 2026',
    eta: 'Fri 08:00',
    store: 'Spar Windhoek Central',
    status: 'Collecting',
    region: 'Oshana',
  },
  {
    id: 'FL-1031',
    items: [{ name: 'Butternut', crop: 'butternut', qty: 800, unit: 'kg', price: 10 }],
    total: 8000,
    farmers: 5,
    delivery: '18 Nov 2026',
    eta: 'Delivered',
    store: 'Spar Windhoek Central',
    status: 'Delivered',
    region: 'Omusati',
  },
];

export const BUYER_ORDER_STEPS = ['Confirmed', 'Collecting', 'Quality checked', 'In transit', 'Delivered'];

export const DELIVERIES = [
  { day: 'Mon', order: 'FL-1042', time: '10:30', crop: 'Onions', store: 'Windhoek', tone: 'accent' },
  { day: 'Wed', order: 'FL-1045', time: '08:00', crop: 'Tomatoes', store: 'Windhoek', tone: 'primary' },
  { day: 'Fri', order: 'FL-1048', time: '09:00', crop: 'Butternut', store: 'Windhoek', tone: 'primary' },
  { day: 'Tue', order: 'FL-1044', time: '11:00', crop: 'Spinach', store: 'Swakopmund', tone: 'primary' },
  { day: 'Thu', order: 'FL-1047', time: '13:30', crop: 'Butternut', store: 'Swakopmund', tone: 'accent' },
];

export const SUPPLIERS = [
  {
    id: 'SUP-1',
    name: 'Maria Nangolo',
    place: 'Okahao, Omusati',
    image: IMAGES.maria,
    preferred: true,
    crops: ['butternut', 'tomatoes'],
    rating: 4.8,
    volume: 2400,
    onTime: 98,
  },
  {
    id: 'SUP-2',
    name: 'Omusati Co-op',
    place: 'Outapi, Omusati',
    initials: 'OC',
    preferred: true,
    crops: ['onions', 'maize'],
    rating: 4.9,
    volume: 8100,
    onTime: 96,
  },
  {
    id: 'SUP-3',
    name: 'Paulus Shikongo',
    place: 'Ongwediva, Oshana',
    initials: 'PS',
    preferred: false,
    crops: ['spinach', 'cabbage'],
    rating: 4.7,
    volume: 1650,
    onTime: 95,
  },
];

export const COMPLIANCE = [
  { crop: 'Butternut', local: 6400, imported: 1200, value: 64000 },
  { crop: 'Red onions', local: 5200, imported: 4800, value: 44200 },
  { crop: 'Tomatoes', local: 4900, imported: 3100, value: 68600 },
];

export const INVOICES = [
  { id: 'INV-2026-88', order: 'FL-1042', amount: 11420, due: '28 Nov', status: 'Due soon' },
  { id: 'INV-2026-84', order: 'FL-1039', amount: 5600, due: '18 Nov', status: 'Paid' },
  { id: 'INV-2026-79', order: 'FL-1031', amount: 8000, due: '10 Nov', status: 'Overdue' },
];

export const BUYER_NOTIFICATIONS = [
  { id: 'BN-1', type: 'Deliveries', icon: 'local_shipping', tone: 'primary', title: 'Order #FL-1042 delivered', time: '10 mins ago', read: false, to: '/buyer/orders/FL-1042' },
  { id: 'BN-2', type: 'Orders', icon: 'eco', tone: 'primary-soft', title: 'New supply matches your onion request', time: '1 hour ago', read: false, to: '/buyer/marketplace/onions' },
  { id: 'BN-3', type: 'Payments', icon: 'payments', tone: 'accent', title: 'Invoice due in 3 days', time: 'Yesterday', read: true, to: '/buyer/payments' },
  { id: 'BN-4', type: 'Orders', icon: 'verified', tone: 'primary-soft', title: 'Quality report available', time: '2 days ago', read: true, to: '/buyer/compliance' },
];

export const TEAM = [
  { id: 'T-1', name: 'Helena Shikongo', email: 'helena@sparwindhoek.na', role: 'Admin', store: 'Windhoek', active: 'Online now' },
  { id: 'T-2', name: 'David Amupanda', email: 'david@sparwindhoek.na', role: 'Buyer', store: 'Windhoek', active: '1 hr ago' },
  { id: 'T-3', name: 'Lukas Hamutenya', email: 'lukas@sparwindhoek.na', role: 'Finance', store: 'All stores', active: 'Yesterday' },
];

/* ------------------------------------------------------------------ */
/* Ops admin                                                           */
/* ------------------------------------------------------------------ */
export const ADMIN_FARMERS = [
  { id: 'F-1', name: 'Maria Nangolo', village: 'Okahao', region: 'Omusati', agent: 'Thomas K.', sales: 12340, status: 'Verified', phone: '+264 81 234 4521', consent: 'Signed (SMS)', image: IMAGES.maria },
  { id: 'F-2', name: 'Paulus Shikongo', village: 'Ongwediva', region: 'Oshana', agent: 'Thomas K.', sales: 8420, status: 'Verified', phone: '+264 81 410 2277', consent: 'Signed (app)' },
  { id: 'F-3', name: 'Selma Kashihakumwa', village: 'Tsandi', region: 'Omusati', agent: 'Thomas K.', sales: 0, status: 'Pending', phone: '+264 81 555 2019', consent: 'Signed (agent)' },
];

export const ADMIN_AGENTS = [
  { id: 'A-1', name: 'Thomas K.', area: 'Okahao, Omusati', farmers: 38, collections: 12, status: 'Active' },
  { id: 'A-2', name: 'Ndapewa H.', area: 'Ongwediva, Oshana', farmers: 29, collections: 9, status: 'Active' },
  { id: 'A-3', name: 'Josef M.', area: 'Rundu, Kavango East', farmers: 17, collections: 4, status: 'Offline' },
];
