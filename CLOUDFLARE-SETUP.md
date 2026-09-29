# Innovera: Cloudflare migration

## What this package moves

This repository contains the Next.js website and API proxies. Laravel runs separately at
https://innovera-testing-production.up.railway.app and handles accounts, enrollment,
payments, courses, and other content. Its source and database are not in this ZIP.
Keep Railway running. This configuration does not migrate your database or PHP backend.

The integration uses OpenNext to retain the existing Next.js build. Cloudflare also
offers vinext; switching frameworks is outside this first migration.

## 1. Put the updated source in GitHub

Create a migration branch in the existing repository and copy this package over it.
Commit the source, including package-lock.json, wrangler.jsonc, open-next.config.ts,
and public/_headers. Do not commit node_modules, .next, .open-next, .env.local,
.dev.vars, tokens, or database exports. The ZIP intentionally omits the old static
export ZIP and temporary test payloads.

## 2. Prepare Cloudflare

Sign in at https://dash.cloudflare.com.
Enable R2 if it is not enabled, reviewing any account or billing requirements.
Create an R2 bucket named `innovera-next-cache`. This bucket stores Next.js cache
data, not the Railway database. Keep it private.
The Worker has a Cloudflare Images binding for Next.js image optimization; check
your account's Images availability and pricing before production use.

## 3. Connect the repository

In Workers & Pages, create a Worker by importing the GitHub repository.
Authorize that repository and select the migration branch for the initial test.
Use these build settings:

| Setting | Value |
| --- | --- |
| Worker name | `innovera` |
| Root directory | Repository root (where package.json is) |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |

If you choose another Worker name, change both `name` and the
`WORKER_SELF_REFERENCE` service name in wrangler.jsonc.
Use Node.js 22 or 24 in the build environment (for example NODE_VERSION=22).
Do not use build:static, upload the old export folder, or configure this as a
static-only Pages project: the application needs its API routes.

## 4. Configure build variables and runtime settings

Before building, add these under the Worker's build variables:

| Name | Value |
| --- | --- |
| API_BASE_URL | https://innovera-testing-production.up.railway.app |
| NEXT_PUBLIC_API_BASE_URL | https://innovera-testing-production.up.railway.app |
| CHATBOT_API_BASE_URL | https://innovera-testing-production.up.railway.app/chatbot/api |
| NEXT_PUBLIC_DEPLOYMENT_ENV | production |
| APP_URL | Your actual HTTPS workers.dev preview URL initially; your final domain later |

The two server upstream URLs are also defined in wrangler.jsonc for runtime.
Add APP_URL to wrangler.jsonc `vars` with the same value as the build setting.
Public variables are baked into browser JavaScript, so rebuild when changing them.

If your Vercel deployment has DIRECTUS_URL, NEXT_PUBLIC_DIRECTUS_URL, or
DIRECTUS_ADMIN_TOKEN, copy the real values privately into Cloudflare. Set the
URLs for build and runtime; store DIRECTUS_ADMIN_TOKEN as a secret in both the
build environment and Worker runtime. Do not put the token in wrangler.jsonc.
The ZIP has no production .env, so the live Directus settings remain unverified.

Remove NEXT_STATIC_EXPORT, NEXT_PUBLIC_STATIC_EXPORT, and
NEXT_PUBLIC_CMS_ASSETS_LOCAL from the Cloudflare environment if present.

## 5. Allow the new frontend on Laravel

The existing browser code calls Railway directly for several APIs. In Laravel's
CORS configuration, allow the exact new HTTPS preview origin and later the final
domain. Ensure authorization headers, required methods, and OPTIONS preflight
requests work. Do not replace the allowed origins with a wildcard when using
credentialed requests. Review the backend's frontend/return URLs for password
reset and payment redirects too; the exact setting names require the Laravel code.

## 6. Deploy and test the preview

Deploy the branch and open its workers.dev URL. Check:

- Homepage, Academy, courses, course details, news, events, and images.
- Login/logout, signup and password reset using a designated test account.
- Enrollment and payment checkout using the payment provider's sandbox mode.
- Chatbot health and response streaming.
- Browser console/network for CORS failures and Worker logs for errors.

Read-only upstream checks on 2026-09-29 returned HTTP 200 JSON for /api/courses
and /api/v1/news. The configured /chatbot/api/health.php returned HTTP 404.
Confirm the correct chatbot URL with the backend project; migration alone will
not fix that missing endpoint.

## 7. Connect the domain after the preview passes

In the Worker settings, add a Custom Domain and follow Cloudflare's DNS setup.
Update APP_URL in build variables and runtime vars, Laravel allowed origins,
and any backend payment/frontend return URLs. Rebuild and repeat the checks.
Keep the old deployment available for rollback until the migration is verified.

## Local verification

Verification performed on 2026-09-29:

- Dependencies installed and package-lock.json updated successfully.
- Next.js, eslint-config-next, and @next/bundle-analyzer upgraded from 16.2.9
  to 16.3.6 to satisfy @opennextjs/cloudflare 1.20.7's peer requirement.
- `npm run build` passed, including TypeScript and generation of all 44 pages.
- A separate `tsc --noEmit --incremental false` check passed.
- Package/lockfile consistency and the Worker service name were checked.
- `npm run build:cloudflare` failed locally while esbuild tried to resolve
  open-next.config.ts: "Cannot read directory ... Access is denied" on Windows.
  No Worker bundle or Cloudflare deployment has been verified. Run the Linux
  Cloudflare build before considering the migration ready for production.
- Account, enrollment, payment and CMS flows have not been exercised end-to-end.

```sh
npm ci
# Copy .env.cloudflare.example to .env.local and enter the actual values.
npm run build:cloudflare
npm run preview:cloudflare
```

Preview runs the compiled app in Cloudflare's local runtime. OpenNext has limited
native Windows support; if adapter packaging fails on Windows, use WSL/Linux or
Cloudflare's Linux build environment. A successful Next.js build alone does not
prove that the Worker package is valid.

## Moving everything off Railway later

Provide the Laravel repository, database engine/version/schema, upload storage
details, and a list of background jobs, mail and payment integrations. Laravel
cannot simply be uploaded as a JavaScript Worker. Moving to Workers/D1 requires
backend changes and a separate data migration, validation, and cutover plan.
Do not cancel Railway until those services have a tested replacement.

References:
- https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- https://opennext.js.org/cloudflare/get-started
- https://developers.cloudflare.com/workers/ci-cd/builds/
