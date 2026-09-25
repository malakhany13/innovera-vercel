# Static export: payment page hosting (backend requirement)

The Next.js static export **cannot** generate one HTML file per payment token
(tokens are created at runtime after enrollment approval).

## What the frontend exports

After `npm run build:static`, the payment UI is emitted as a **shell page**:

```text
export/payment/fallback/index.html
```

(plus `_next` assets shared site-wide, and RSC segment files under
`export/payment/fallback/`).

A `demo123` page is also exported for local UI checks:
`export/payment/demo123/index.html`.

The browser client reads the real token from the URL path
(`/payment/{token}`) and calls Laravel APIs **directly** (no Next.js server):

- `GET  /api/payment/{token}/status` (checkout details **and** post-PayTabs verification)
- `GET  /api/payment/{token}/fawry/redirect`  (returns Fawry reference; no browser redirect)
- `GET  /api/payment/{token}/paytabs/redirect` (returns JSON `{ redirect_url }` for PayTabs)
- `POST /api/payment/{token}/apply-voucher` (voucher UI)
- `POST /api/payment/{token}/remove-voucher` (voucher UI)

Do **not** call exact `GET /api/payment/{token}` from the browser. On production
that path can return the Next.js HTML shell instead of JSON.

There is **no** Next.js `/api/payment*` BFF in the static build.
`build-static.mjs` stashes only `src/app/api/` — the `payment/` page stays in the export.

## Why `/payment/{token}` 404s without a rewrite

On disk, only `/payment/fallback/` and `/payment/demo123/` exist. A plain static
file server looks for `payment/ABC123/index.html`, does not find it, and returns
**404**. The fix is a **host rewrite** that serves the fallback HTML while
**keeping** the browser URL as `/payment/ABC123` so the client can parse the token.

## Fallback without a dedicated rewrite

If the host serves Next’s `404.html` for unknown paths (common when `export/` is
copied into Laravel `public/` and no payment route exists), the client
`not-found` page detects `/payment/{token}` and `/payment/{token}/result` via
`PaymentNotFoundBridge` and mounts the payment UI from the live URL. That recovers
checkout **without** a Laravel rewrite, though the HTTP status may still be 404
until a proper rewrite is added.

A dedicated rewrite (below) is still recommended so email links return **200**.

**Keep the browser URL as `/payment/{token}`** (do not 302 to `/payment/fallback/`).
After PayTabs, **keep `/payment/{token}/result`** (do not 302 to `/payment/fallback/result`).
The React client parses the token from `window.location.pathname`.

### Laravel (implemented — see `routes/web.php`)

The backend copies the contents of `export/` directly into Laravel's `public/`
folder (site root, not a `public/frontend/` subfolder), and `routes/web.php`
already implements both routes described in this doc:

```php
// routes/web.php (current)
Route::get('/payment/{token}', function (string $token) {
    if ($token === '..' || str_contains($token, "\0")) {
        abort(404);
    }

    $static = public_path("payment/{$token}/index.html");
    if (File::exists($static)) {
        return response()->file($static, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    $fallback = public_path('payment/fallback/index.html');
    abort_unless(File::exists($fallback), 404);

    return response()->file($fallback, ['Content-Type' => 'text/html; charset=UTF-8']);
})->where('token', '[^/]+');

// PayTabs / Fawry return URL. Keep `/payment/{token}/result` in the browser
// (do not 302 to `/payment/fallback/result`).
Route::get('/payment/{token}/result', function (string $token) {
    if ($token === '..' || str_contains($token, "\0")) {
        abort(404);
    }

    $static = public_path("payment/{$token}/result/index.html");
    if (File::exists($static)) {
        return response()->file($static, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    $fallback = public_path('payment/fallback/result/index.html');
    abort_unless(File::exists($fallback), 404);

    return response()->file($fallback, ['Content-Type' => 'text/html; charset=UTF-8']);
})->where('token', '[^/]+');

// Directory-style export routes (<route>/index.html, with a flat
// <route>.html fallback), explicitly excluding /api/*:
Route::get('/{page?}', function (?string $page = null) {
    // ... resolves public_path("{$page}/index.html") then "{$page}.html",
    // falls back to 404.html. See routes/web.php for the full body.
})->where('page', '^(?!api(?:/|$)).*$');
```

Because `export/` is copied to `public/` at the site root, `/_next/**`,
`/images/**`, and other static assets resolve automatically — no separate
step needed.

### Apache (`DocumentRoot` = `export/`)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^payment/([^/]+)/result/?$ payment/fallback/result/index.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^payment/([^/]+)/?$ payment/fallback/index.html [L]
```

### Nginx (`root` = `export/`)

```nginx
location ~ ^/payment/([^/]+)/result/?$ {
  try_files $uri $uri/ /payment/fallback/result/index.html;
}

location ~ ^/payment/([^/]+)/?$ {
  try_files $uri $uri/ /payment/fallback/index.html;
}
```

## Same-origin API

Prefer serving `export/` from the **same host** as Laravel so the browser can call
`/api/payment/...` with relative URLs (no CORS).

If the static site and API are on different origins, set at **build** time:

```env
NEXT_PUBLIC_LARAVEL_API_BASE_URL=https://api.example.com
```

## Local Next.js dev

Payment API calls use relative `/api/payment/*`. There is **no** Next rewrite
for `/api/payment` (a rewrite would collide with the App Router and can return
HTML). In `next-dev`, `src/app/api/payment/[token]` is the BFF and forwards to
Laravel using server-only `LARAVEL_API_BASE_URL`.

In `next-dev`, any `/payment/{token}` URL is served by Next (`dynamicParams: true`).
Static export still only emits `fallback` + `demo123`; real tokens need the host rewrite.
(`build:static` temporarily patches the payment route to `dynamicParams: false` because Next requires a literal boolean.)
