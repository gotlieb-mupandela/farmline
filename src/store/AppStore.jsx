import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as seed from '../data/seed.js';
import { nextId } from '../lib/format.js';

const STORAGE_KEY = 'farmline:v1';

function initialState() {
  return {
    language: 'EN',
    farmer: { ...seed.FARMER },
    listings: seed.LISTINGS,
    farmerOrders: seed.FARMER_ORDERS,
    readyConfirmed: [],
    payments: seed.PAYMENTS,
    buyerRequests: seed.BUYER_REQUESTS,
    offers: [],
    farmerNotifications: seed.FARMER_NOTIFICATIONS,
    farmerSettings: { sms: true, push: true, price: true, dataSaver: true, lastSync: '10 min ago' },
    offline: true,
    agentPending: 3,
    marketLots: seed.MARKET_LOTS,
    cart: seed.CART,
    buyerOrders: seed.BUYER_ORDERS,
    invoices: seed.INVOICES,
    buyerNotifications: seed.BUYER_NOTIFICATIONS,
    team: seed.TEAM,
    buyerSettings: { orderUpdates: true, complianceAlerts: true, twoFactor: true, weeklyDigest: false },
    adminFarmers: seed.ADMIN_FARMERS,
    adminAgents: seed.ADMIN_AGENTS,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable or corrupt: fall back to seed data */
  }
  return initialState();
}

const StoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(load);
  // Latest state for actions that must return a generated id synchronously.
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [state]);

  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), []);

  const actions = useMemo(
    () => ({
      reset: () => setState(initialState()),
      setLanguage: (code) => patch(() => ({ language: code })),

      /* ---------- Farmer ---------- */
      updateFarmer: (fields) => patch((s) => ({ farmer: { ...s.farmer, ...fields } })),

      addListing: (listing) => {
        const id = nextId('L-', ref.current.listings.map((l) => l.id));
        patch((s) => {
          return {
            listings: [
              {
                id,
                status: 'waiting',
                grade: 'Pending agent check',
                interest: [],
                trend: seed.PRICE_INSIGHTS[listing.crop]?.series.slice(-8) ?? [],
                ...listing,
              },
              ...s.listings,
            ],
          };
        });
        return id;
      },
      updateListing: (id, fields) =>
        patch((s) => ({ listings: s.listings.map((l) => (l.id === id ? { ...l, ...fields } : l)) })),
      removeListing: (id) => patch((s) => ({ listings: s.listings.filter((l) => l.id !== id) })),

      acceptInterest: (listingId, interestId) => {
        const cur = ref.current;
        const orderId = nextId('FL-', [...cur.farmerOrders, ...cur.buyerOrders].map((o) => o.id));
        patch((s) => {
          const listing = s.listings.find((l) => l.id === listingId);
          const offer = listing?.interest.find((i) => i.id === interestId);
          if (!listing || !offer) return {};
          const remaining = listing.qty - offer.qty;
          return {
            listings: s.listings.map((l) =>
              l.id === listingId
                ? {
                    ...l,
                    status: remaining > 0 ? 'partial' : 'ordered',
                    interest: l.interest.filter((i) => i.id !== interestId),
                  }
                : l,
            ),
            farmerOrders: [
              {
                id: orderId,
                buyer: offer.buyer,
                crop: listing.crop,
                qty: offer.qty,
                total: Math.round(offer.qty * offer.price),
                stage: 'confirmed',
                collection: 'Collection to be booked',
                agent: s.farmer.agent.name,
                grade: 'Grade A',
                city: offer.buyer.split(' ')[1] || 'Windhoek',
                pool: 0,
              },
              ...s.farmerOrders,
            ],
          };
        });
        return orderId;
      },
      confirmReady: (orderId) =>
        patch((s) => ({ readyConfirmed: [...new Set([...s.readyConfirmed, orderId])] })),

      offerSupply: (requestId) =>
        patch((s) => ({
          offers: s.offers.includes(requestId)
            ? s.offers.filter((r) => r !== requestId)
            : [...s.offers, requestId],
        })),

      readFarmerNotification: (id) =>
        patch((s) => ({
          farmerNotifications: s.farmerNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      readAllFarmerNotifications: () =>
        patch((s) => ({ farmerNotifications: s.farmerNotifications.map((n) => ({ ...n, read: true })) })),

      setFarmerSetting: (key, value) =>
        patch((s) => ({ farmerSettings: { ...s.farmerSettings, [key]: value } })),
      syncNow: () =>
        patch((s) => ({
          offline: false,
          agentPending: 0,
          farmerSettings: { ...s.farmerSettings, lastSync: 'just now' },
        })),

      /* ---------- Field agent ---------- */
      registerFarmer: (f) =>
        patch((s) => ({
          agentPending: s.offline ? s.agentPending + 1 : s.agentPending,
          adminFarmers: [
            ...s.adminFarmers,
            {
              id: nextId('F-', s.adminFarmers.map((x) => x.id)),
              agent: 'Thomas K.',
              sales: 0,
              status: 'Pending',
              consent: 'Signed (agent)',
              ...f,
            },
          ],
        })),

      /* ---------- Buyer ---------- */
      addToCart: (lotId, amount) =>
        patch((s) => {
          const existing = s.cart.find((c) => c.lotId === lotId);
          return {
            cart: existing
              ? s.cart.map((c) => (c.lotId === lotId ? { ...c, qty: c.qty + amount } : c))
              : [...s.cart, { lotId, qty: amount }],
          };
        }),
      setCartQty: (lotId, amount) =>
        patch((s) => ({
          cart:
            amount <= 0
              ? s.cart.filter((c) => c.lotId !== lotId)
              : s.cart.map((c) => (c.lotId === lotId ? { ...c, qty: amount } : c)),
        })),

      placeOrder: ({ items, total, store, delivery, terms }) => {
        const cur = ref.current;
        const id = nextId('FL-', [...cur.farmerOrders, ...cur.buyerOrders].map((o) => o.id));
        patch((s) => {
          const invoiceNo = Math.max(...s.invoices.map((i) => Number(i.id.split('-').pop()) || 0)) + 1;
          return {
            cart: [],
            buyerOrders: [
              {
                id,
                items,
                total,
                farmers: items.reduce((n, it) => n + (it.farmers || 2), 0),
                delivery,
                eta: 'Awaiting collection',
                store,
                status: 'Confirmed',
                region: items[0]?.region || 'Omusati',
                terms,
              },
              ...s.buyerOrders,
            ],
            invoices: [
              {
                id: `INV-2026-${invoiceNo}`,
                order: id,
                amount: total,
                due: terms === 'On delivery' ? 'On delivery' : terms === '7 days' ? 'In 7 days' : 'In 30 days',
                status: 'Open',
              },
              ...s.invoices,
            ],
            buyerNotifications: [
              {
                id: `BN-${Date.now()}`,
                type: 'Orders',
                icon: 'receipt_long',
                tone: 'primary',
                title: `Order #${id} placed`,
                time: 'Just now',
                read: false,
                to: `/buyer/orders/${id}`,
              },
              ...s.buyerNotifications,
            ],
          };
        });
        return id;
      },

      publishRequest: (req) =>
        patch((s) => ({
          buyerRequests: [{ id: `R-${Date.now()}`, ...req }, ...s.buyerRequests],
          farmerNotifications: [
            {
              id: `N-${Date.now()}`,
              group: 'Today',
              icon: 'campaign',
              tone: 'accent',
              title: `New buyer request: ${req.buyer}`,
              body: `Needs ${req.need} · ${req.price ? `N$${req.price}/kg` : ''}`,
              time: 'Just now',
              read: false,
              to: '/farmer/requests',
            },
            ...s.farmerNotifications,
          ],
        })),

      payInvoice: (id) =>
        patch((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: 'Paid' } : i)) })),

      readBuyerNotification: (id) =>
        patch((s) => ({
          buyerNotifications: s.buyerNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      readAllBuyerNotifications: () =>
        patch((s) => ({ buyerNotifications: s.buyerNotifications.map((n) => ({ ...n, read: true })) })),

      setBuyerSetting: (key, value) =>
        patch((s) => ({ buyerSettings: { ...s.buyerSettings, [key]: value } })),

      inviteMember: (m) =>
        patch((s) => ({
          team: [...s.team, { id: `T-${Date.now()}`, active: 'Invite sent', ...m }],
        })),

      /* ---------- Admin ---------- */
      updateFarmerRecord: (id, fields) =>
        patch((s) => ({
          adminFarmers: s.adminFarmers.map((f) => (f.id === id ? { ...f, ...fields } : f)),
        })),
    }),
    [patch],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <AppStoreProvider>');
  return ctx;
}
