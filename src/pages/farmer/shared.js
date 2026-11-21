import { CROPS, ORDER_STEPS } from '../../data/seed.js';

export const LISTING_STATUS = {
  waiting: { label: 'Waiting for buyer', tone: 'accent', tab: 'Active' },
  ordered: { label: 'Ordered', tone: 'primary', tab: 'Active' },
  partial: { label: 'Partially sold', tone: 'accent-soft', tab: 'Active' },
  sold: { label: 'Sold', tone: 'primary-soft', tab: 'Sold' },
  expired: { label: 'Expired', tone: 'ghost', tab: 'Expired' },
};

export const cropName = (key) => CROPS[key]?.name ?? key;

export const readyLabel = (l) => (l.ready === 'today' ? 'Ready today' : `Ready ${l.ready}`);

/* Farmer order stages. The order list shows 5 dots; the detail screen shows 6 steps. */
export const STAGE_INDEX = Object.fromEntries(ORDER_STEPS.map((s, i) => [s.key, i]));
const DOTS_FILLED = [1, 2, 2, 3, 4, 5];

export const stageDots = (stage) => DOTS_FILLED[STAGE_INDEX[stage] ?? 0];

export const STAGE_BADGE = {
  confirmed: { label: 'New order', tone: 'accent' },
  agent: { label: 'Agent assigned', tone: 'primary-soft' },
  quality: { label: 'Agent assigned', tone: 'primary-soft' },
  collected: { label: 'Collected', tone: 'accent' },
  delivered: { label: 'Delivered', tone: 'primary-soft' },
  paid: { label: 'Paid', tone: 'primary' },
};

export const orderTab = (o) => (o.stage === 'confirmed' ? 'New' : o.stage === 'paid' ? 'Completed' : 'In progress');

export function orderWhen(o) {
  if (o.stage === 'paid') return `Delivered ${o.deliveredOn ?? ''}`.trim();
  if (o.stage === 'collected' || o.stage === 'delivered') return o.collection.replace('Collection', 'Collected');
  return o.collection;
}
