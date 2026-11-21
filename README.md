# FarmLine

Namibia's agri marketplace, connecting smallholder farmers, field agents and commercial buyers. Built in React from the FarmLine Stitch designs ("Soft Claymorphism" design system).

Four apps share one demo state:

| App | Start at | What it covers |
| --- | --- | --- |
| Landing page | `/` | Public marketing page |
| Farmer app (mobile) | `/farmer/splash` | Onboarding, selling produce, orders, wallet, prices, SMS help |
| Field agent (mobile) | `/agent` | Route, farmer registration, quality grading |
| Buyer portal (web) | `/buyer/login` | Marketplace, requests, checkout, orders, deliveries, payments, team |
| Ops admin (web) | `/admin` | Operations overview, farmers and agents |

Every designed screen is listed by its Stitch number at `/screens`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` creates a production build in `dist/`.

## Notes

- **Stack:** Vite, React 18, React Router 6, Tailwind CSS 3. Design tokens live in `tailwind.config.js`; clay shadows and shared component classes in `src/index.css`.
- **Demo data:** seed data is in `src/data/seed.js`. Changes are saved in the browser (localStorage); use **Reset demo** in farmer Settings to start over. Actions carry across apps, e.g. a buyer's purchase request appears in the farmer's buyer requests.
- **Images:** product and profile photos are expected in `public/images/` (`butternut`, `tomatoes`, `onions`, `spinach`, `maria`, `thomas`, `routeMap`, `farmerPhone`, `bakkie`, `coins`, `hero`, all `.jpg`). Until they are added, a clay placeholder is shown.
- **Languages:** the language picker stores the choice; the copy is not translated yet.
