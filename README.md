# Innovera Next.js

Next.js 16 App Router frontend for the Innovera corporate site and Academy course catalog. Content is loaded from Directus via server components (SSR/ISR) and a BFF API layer.

## Prerequisites

- Node.js 20+
- Directus reachable at the URL in `NEXT_PUBLIC_DIRECTUS_URL` / `DIRECTUS_URL` (local Docker default: see repo root `docker-compose.yml`)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev          # default port 3001 (see package.json)
```

Production Node server:

```bash
npm run build
npm run start        # default port 3001
```

Clean dev cache if routes behave oddly after upgrades:

```bash
npm run dev:clean
```

Bundle analysis (webpack build required for the report):

```bash
# PowerShell
$env:ANALYZE="true"; npm run analyze
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. **Never commit `.env.local`.**

Directus URLs are resolved in `src/lib/config/directus.config.ts`. Localhost is used **only** as a development fallback when the variables below are unset.

### Production (must set on the host / CI)

| Variable | Required | Exposed to browser | Description |
|----------|----------|-------------------|-------------|
| `NEXT_PUBLIC_DIRECTUS_URL` | **Yes** | Yes | Public Directus base URL baked into image `src` (`{url}/assets/...`) and client CMS calls. For `build:static` / deploying `out/`: use a **publicly reachable** Directus URL (**not** localhost). |
| `DIRECTUS_URL` | **Yes** (server) | No | Server-only Directus REST URL for SSR, ISR, and BFF routes. Prefer this for server fetches; falls back to `NEXT_PUBLIC_DIRECTUS_URL`. |
| `APP_URL` | Recommended | No | Canonical site URL for SEO metadata (e.g. `https://innoveracorp.com`). Must be a full `https://` URL in production. |
| `DIRECTUS_ADMIN_TOKEN` | Recommended | No | Static token for BFF routes (`/api/courses`, `/api/enroll`). Create in Directus → Settings → Access Tokens |
| `LARAVEL_API_BASE_URL` or `PAYMENT_API_BASE_URL` | Required for payments | No | Server-side Laravel API base (SSR data fetches, OG/image URLs). Leave **unset/empty** when Laravel is same-origin in production (e.g. `https://innoveracorp.com`) so server fetches use the deploy's own resolution; set to the Laravel origin when it's on a different host. |
| `NEXT_PUBLIC_LARAVEL_API_BASE_URL` | Optional | Yes | Browser-side Laravel API base (payment page, course cards). **Leave unset/empty for same-origin production** (`https://innoveracorp.com/api`) so `paymentApiUrl()` / client calls stay relative and avoid CORS. Only set when the API is on a different origin than the static site. |
| `GEMINI_API_KEY` | Optional | No | Floating chatbot (Gemini). App works without it; chat fails gracefully |

### Example `.env.local` (local development)

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_TOKEN=your-directus-static-token
APP_URL=http://localhost:3001
LARAVEL_API_BASE_URL=
GEMINI_API_KEY=
```

### Example production values

```env
NEXT_PUBLIC_DIRECTUS_URL=https://cms.example.com
DIRECTUS_URL=https://cms.example.com
APP_URL=https://www.example.com
DIRECTUS_ADMIN_TOKEN=…
LARAVEL_API_BASE_URL=https://uncentrical-judith-noninterpretative.ngrok-free.dev
```

### Public vs server-only

- **`NEXT_PUBLIC_*`** — inlined into client bundles; use only for non-secret values.
- **No prefix** — available only in Server Components, Route Handlers, and `next.config.ts`.

### Static export (`export/`)

```bash
npm run build:static   # writes HTML/CSS/JS to export/ (see scripts/build-static.mjs)
npm run deploy:laravel -- --target ../../innovera-profile---php/laravel/public
                       # mirrors export/ into Laravel public/, deleting stale build files
```

Image URLs are absolute Directus asset links (`NEXT_PUBLIC_DIRECTUS_URL/assets/<id>`). Static export does **not** include Next rewrites or `/api/directus`, so set `NEXT_PUBLIC_DIRECTUS_URL` (and preferably `DIRECTUS_URL`) to the live Directus host **before** building for deployment. The build script warns if the public URL still points at localhost.

For production (`https://innoveracorp.com`), build with `APP_URL=https://innoveracorp.com`, `LARAVEL_API_BASE_URL=https://innoveracorp.com` (server-side SSR/OG fetches), and `NEXT_PUBLIC_LARAVEL_API_BASE_URL` **unset** (browser payment/course calls stay relative to the same origin). See `docs/static-payment-hosting.md` for hosting the `payment/{token}` route and the Laravel `routes/web.php` rewrite that serves `export/`.

#### ⚠️ Image origin: set `ASSET_URL` on the backend when building against a local Laravel

Course/vendor-logo image URLs are generated **by Laravel**, not by this app — `Course::resolvePublicUrl()` calls Laravel's `asset()`, which is request-aware and derives the origin from whatever host served the request. So if you build the export while pointing `LARAVEL_API_BASE_URL` at a local backend, every image URL gets baked into the shipped HTML as `http://localhost:8000/images/...` — broken (and mixed-content blocked) in production. This shipped once; don't repeat it.

Two safe options:

- **Build against the production API** (`LARAVEL_API_BASE_URL=https://innoveracorp.com`) — image URLs come out correct automatically. Preferred when production's API is healthy.
- **Build against a local backend** — then set `ASSET_URL=https://innoveracorp.com` in the *Laravel* `.env` for the duration of the build (and `php artisan config:clear` + restart, since `asset()` reads it at boot). Remove it afterwards so local dev keeps producing localhost URLs.

Either way, verify before shipping:

```bash
grep -rho "localhost:[0-9]*" --include="*.html" export/ | sort | uniq -c   # must output nothing
```

### Production checklist (backend)

The Laravel backend (`../laravel`) must have `APP_DEBUG=false` and `APP_ENV=production` in its production `.env` — never ship the `.env.dev` file (development secrets; committed to the backend repo for local Docker use only, per its `.gitignore` `!.env.dev` exception) to a production host.

## Project structure

```
src/
├── app/              # App Router pages, layouts, API routes
├── components/       # UI and page sections
├── features/directus # RTK Query (client) + types/transforms
├── lib/              # Directus helpers, metadata, config
└── store/            # Redux store
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/courses`, `/courses/[id]` | SSR course catalog and detail (SEO + OG from Directus) |
| `/training`, `/training/enroll/[courseId]` | Academy UI (modal) and enrollment |
| `/about`, `/news`, `/events`, … | CMS-driven marketing pages |

## API routes (BFF)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/courses` | GET | Course list (admin token stays server-side) |
| `/api/courses/[id]` | GET | Course + lessons |
| `/api/enroll` | POST | Enrollment submission |

Client RTK Query calls `/api/courses` instead of Directus directly for the catalog.

## Auth note

Student auth (`/signup`, `/login`, `/account`) is real: `/api/student/register|login|logout` proxy to Laravel Sanctum (`app/Http/Controllers/StudentAuthController.php`), issuing a bearer token stored client-side (`AuthProvider`) and required by internship endpoints (`/api/internships/*`). Enrollment itself (course or internship) does not require login for courses, but internship enrollment and the interview flow do.

## Tech stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Redux Toolkit + RTK Query
- Directus REST API
- `next/image` for optimized images
- `next/font` (Geist) — no external CSS font imports

## Pre-production QA pass (2026-09-17/18)

A full pre-production QA sweep (manual + parallel automated passes across auth, courses, internships, CMS pages, and the production build) found and fixed the following real bugs. All are in this branch.

**Internship payments & flow:**
- `PaymentController::show`/`status` (Laravel) never recognized internship payment tokens — every internship payment link 404'd. Fixed backend-side; see `../laravel` README.
- `InternshipEnrollmentController::interviewCallback` (Laravel) matched enrollments by exact program title, but the AI Interviewer app sends back its own internal track slug (e.g. `software-development` for `"Software (Frontend & Backend)"`) — every real interview result silently 404'd. Fixed backend-side.
- `InternshipEnrollment` model (Laravel) was missing `total_score`, `total_score_max`, and `attempt_number` from `$fillable` — interview scores and real attempt numbers were silently discarded by mass-assignment protection on every save. Fixed backend-side.
- `internship-enrollment-status.ts`: `isInternshipPaid()` didn't recognize Laravel's `'cash'` payment status (used everywhere else in the backend as equivalent to `'accepted'`), so a cash-confirmed payment still showed as "not paid yet" throughout the UI.
- `PaymentPageClient.tsx`: the voucher UI rendered on internship payment pages even though internship payments have no voucher support on the backend — `showVoucher` now also excludes `payment_type === "internship"`.
- `src/components/pages/Internship/index.tsx`: retrying payment after exhausting both allowed interview attempts dropped the user into a broken payment step (no valid token) with a generic toast instead of a clear "no attempts left" message.
- `InternshipInterviewStep.tsx` / `InternshipResultStep.tsx` / `InternshipLanding.tsx`: removed a UX dead-end loop (passed-result screen's button sent the user back to a landing screen with the same button, indefinitely) and fixed "You are passed" grammar. The passed-result screen now also shows the actual interview score percentage (from Laravel's `total_score`/`total_score_max`) instead of only a checkmark.

**Auth:**
- `student-auth.ts`: the Laravel fetch had no request timeout (every other Laravel client in the codebase does) — reproduced a real hang where a slow/stuck request wedged the entire Next dev server. Fixed.
- `AuthProvider.tsx` / new `src/app/api/student/logout/route.ts`: **logout never revoked the Sanctum token server-side** — it only cleared local storage, so a "logged out" session's token stayed valid indefinitely. Logout now calls the new BFF route, which forwards to Laravel's `/api/student/logout` to actually revoke it.

**Courses:**
- `src/lib/laravel/proxy.ts`: same missing-timeout issue as `student-auth.ts`, on the course enroll/detail proxy calls. Fixed.

**Platform/config:**
- `next.config.ts`: the Laravel `next/image` remote pattern only allowed `/storage/**`, but Laravel actually serves course images from multiple paths (`/images/**`, bare asset paths) — this crashed entire pages (not just the image) via Next's unconfigured-host error. Broadened to the whole origin.
- `eslint.config.mjs`: was linting the generated static-export output under `export/**` (stale `out/**` ignore entry from before the export directory was renamed), producing thousands of spurious errors/warnings in generated, minified chunks. Fixed.
- `docs/static-payment-hosting.md`: the documented Laravel `routes/web.php` snippet was stale relative to the actual current implementation. Updated to match.

**Static-export production build (found by actually running `npm run build:static` and serving the output through Laravel, not just the dev server):**
- Course images broke in production because Directus does not run there — see `../laravel/README.md`'s `Course::resolvePublicUrl()` fix and the `images/` folder it added. Once fixed backend-side, no frontend change was needed (the existing Laravel `next/image` remote pattern already covered it).
- `SignupPage.tsx`: the static export has no Next.js BFF in front of it, so the signup form's `fetch("/api/student/register")` hits Laravel directly. Laravel's validation-error response shape (`{message, errors: {field: [...]}}`) differs from the Next BFF's (`{error}`), and the form only checked `payload.error` — every real validation failure (duplicate email/mobile, etc.) showed a generic "Registration failed" instead of the actual reason. Fixed with a helper that checks both shapes.
- A copy mistake while manually testing the production build (not a code bug) briefly broke the internship hero image and news/events placeholder icons — see `../laravel/README.md` for the actual fix (a genuinely missing `images/innoveraPlaceHolder.jpg` source asset, repointed to existing placeholder SVGs).

See `../laravel/README.md` for the corresponding backend-side fixes (`PaymentController`, `InternshipEnrollmentController`, `InternshipEnrollment` and `Course` models, `routes/web.php`, admin panel).

**Known issues intentionally left unfixed — need a product/ops decision, not a code change:**
- `laravel/.env.dev` is tracked in git with what look like real secret values (Fawry/PayTabs keys, interview webhook secrets, DB password) — confirm with whoever owns those credentials whether they're sandbox values or need rotating before launch.
- Forgot-password emails fail to send in dev because the Microsoft Graph mail service can't authenticate (credentials/tenant config) — the OTP is still correctly created in the DB, so this is a credentials issue, not a logic bug.
- **Course pages are live** (previously build-time snapshots): the catalog, course detail and enroll pages all refetch from Laravel `/api/v1/*` on load, so dashboard edits, additions and removals show up without a rebuild. A course the build didn't know about is served by an exported shell page (`courses/fallback/`, `courses/enroll/fallback/`, `training/enroll/fallback/`) — Laravel's `routes/web.php` serves that shell for any numeric id with no exported file, keeping the URL, and `CourseLiveShell` reads the id from the path. Same pattern as `/payment/{token}`. Browser calls use `/api/v1/*` because the un-prefixed `/api/{resource}` GETs were shadowed in production by a stale HTML page; `fetchPublicJson` also rejects any 200 that isn't JSON rather than silently falling back to build-time data.
