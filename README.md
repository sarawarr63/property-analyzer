
# PropAnalyze — Real Estate Property Analysis MVP

A modern web application that analyzes investment properties: estimates value, recommends repairs, calculates ARV and profit, and generates a printable report.

> **Data modes:** With a [RentCast](https://www.rentcast.io/api) API key, the app pulls **real property records and AVM valuations** for customer addresses. Without a key, it falls back to simulated data for demos.

**Sample address:** `207 Midway Island, Clearwater, FL 33767`



## Tech Stack (Recommended)

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) | Full-stack in one repo — React UI + API routes, fast to ship |
| **Language** | TypeScript | Type safety for financial calculations |
| **Styling** | Tailwind CSS 4 | Professional UI with minimal custom CSS |
| **Database** | SQLite via [Prisma](https://prisma.io) | Zero external DB setup for local dev |
| **Deployment** | Vercel (future) | Native Next.js hosting |

**Not included yet (add later):** Auth (Clerk/NextAuth), PDF export, background jobs, Redis cache.



## System Architecture


┌─────────────────────────────────────────────────────────────┐
│                     Browser (React)                          │
│  Dashboard (/)          Report Page (/report/[id])           │
│  - AddressForm          - PropertySummary                    │
│  - RecentAnalyses       - RepairRecommendations              │
│                         - ProfitAnalysis                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────┐
│                  Next.js API Routes                            │
│  POST /api/analyze        → Run pipeline + save to DB        │
│  GET  /api/analyses       → List recent reports              │
│  GET  /api/analyses/[id]  → Fetch single report              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Analysis Engine (src/lib/analysis/)               │
│  1. property-data.ts  → RentCast records (or mock fallback)   │
│  2. valuation.ts      → RentCast AVM or internal estimate     │
│  3. repairs.ts        → Generate repair recommendations      │
│  4. engine.ts         → Orchestrate + compute ARV & profit   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Prisma + SQLite (PropertyAnalysis)              │
└─────────────────────────────────────────────────────────────┘


### Analysis Pipeline

1. User submits address (e.g. `207 Midway Island, Clearwater, FL 33767`)
2. **Property Data Service** — RentCast public records when `RENTCAST_API_KEY` is set; mock data otherwise
3. **Valuation Engine** — RentCast AVM when available; otherwise sq ft × price/sq ft model
4. **Repair Engine** — recommends repairs based on condition; scales costs by property size
5. **Profit Calculator** — ARV = estimated value + ROI-weighted repair uplift; profit = ARV − value − repairs − holding costs
6. Results saved to DB and displayed on report page



## Database Design

### Entity: `PropertyAnalysis`

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `address` | String | Display address |
| `normalizedAddress` | String | Lowercase normalized for dedup (future) |
| `createdAt` | DateTime | Report timestamp |
| `bedrooms` | Int | Property bedrooms |
| `bathrooms` | Float | Property bathrooms |
| `squareFeet` | Int | Living area |
| `yearBuilt` | Int | Construction year |
| `lotSizeSqFt` | Int | Lot size |
| `propertyType` | String | Single Family, Condo, etc. |
| `condition` | String | poor / fair / good / excellent |
| `lastSalePrice` | Float? | Last recorded sale |
| `lastSaleDate` | String? | Last sale date |
| `taxAssessed` | Float? | Tax assessment |
| `estimatedValue` | Float | Current value estimate |
| `totalRepairCost` | Float | Sum of repair costs |
| `arv` | Float | After-repair value |
| `potentialProfit` | Float | Gross profit before holding |
| `profitMarginPct` | Float | Net margin % |
| `repairs` | JSON | Array of repair recommendations |

Schema file: `prisma/schema.prisma`



## Development Plan

### Phase 1 — MVP ✅
- [x] Dashboard with address input
- [x] RentCast integration for real customer home data
- [x] Mock fallback when no API key
- [x] Repair recommendations + cost estimates
- [x] ARV and profit analysis
- [x] Report page with printable layout
- [x] SQLite persistence + recent analyses list

### Phase 2 — Enhanced Data
- [ ] Integrate geocoding to validate partial addresses
- [ ] Cache RentCast responses to reduce API usage
- [ ] Add user accounts and saved property lists

### Phase 3 — Production Features
- [ ] PDF report export
- [ ] Email report sharing
- [ ] Batch analysis (CSV upload)
- [ ] Admin dashboard for repair cost templates
- [ ] Migrate SQLite → PostgreSQL for production

### Phase 4 — Scale
- [ ] Background job queue for long-running analyses
- [ ] Caching layer for repeated addresses
- [ ] ML-based ARV model trained on local comps



## How to Run Locally

### Prerequisites

1. **Node.js 20+** — Download from [https://nodejs.org](https://nodejs.org)
2. **npm** (included with Node.js)

Verify installation:

```powershell
node -v
npm -v
```

### Setup & Start

Open PowerShell and run:

```powershell
cd C:\Users\gwarr\property-analyzer

# Install dependencies
npm install

# Copy environment file and add your RentCast key
copy .env.example .env

# Create the SQLite database (run again after schema changes)
npm run db:push

# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Enable Real Customer Home Data

1. Sign up at [rentcast.io/api](https://www.rentcast.io/api) (free tier: 50 requests/month)
2. Copy your API key into `.env`:

```env
RENTCAST_API_KEY="your_key_here"
```

3. Restart the dev server
4. Analyze a real address — the report will show a **Live property records** badge

Without a key, the app uses simulated data so you can still demo the workflow.

### Try It

1. Click **Try sample: 207 Midway Island, Clearwater** on the dashboard, or enter:
   `207 Midway Island, Clearwater, FL 33767`
2. Click **Analyze Property**
3. View beds/baths/sq ft, sale history, value estimate, repairs, and profit
4. Click **Print Report** to save as PDF

### Other Commands

```powershell
npm run build      # Production build
npm run start      # Run production server (after build)
npm run db:studio  # Open Prisma database GUI
```



## Project Structure


property-analyzer/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/       # POST — run analysis
│   │   │   └── analyses/      # GET — list & fetch reports
│   │   ├── report/[id]/       # Results / report page
│   │   ├── layout.tsx         # App shell
│   │   ├── page.tsx           # Dashboard
│   │   └── globals.css
│   ├── components/            # UI components
│   └── lib/
│       ├── analysis/          # Core business logic
│       ├── db.ts              # Prisma client
│       └── format.ts          # Currency/date helpers
├── .env                       # DATABASE_URL (local)
└── package.json
```



## Real vs. Simulated Data

| Mode | When | Data source |
|------|------|-------------|
| **Live** | `RENTCAST_API_KEY` set in `.env` | RentCast property records + AVM |
| **Demo** | No API key | Deterministic mock based on address hash |

Provider code: `src/lib/analysis/providers/rentcast.ts`
Mock fallback: `src/lib/analysis/mock-property-data.ts`



## License

MIT — MVP prototype for demonstration purposes.

