# SR Auth Console — Bureau of Access

An Angular 18 (standalone components) console for the SR Auth API: register, sign in,
manage roles, and stamp/revoke roles on holders — built against the OpenAPI spec you
provided (`/sr/api/auth/*`, `/sr/api/role/*`).

## Design

A "security clearance bureau" identity: ink-navy surfaces, a brass/gold accent for
authority and a teal accent for verified/active states, paired with Fraunces (display),
Inter (body) and JetBrains Mono (technical data — IDs, tokens, timestamps). The
signature element is the **Clearance Badge** — the logged-in user rendered as an ID
badge with a shimmering foil strip — reused compactly in the sidebar and full-size on
the dashboard.

## Getting started

```bash
npm install
npm start
```

This runs `ng serve` with `proxy.conf.json`, which forwards `/sr/api/*` and `/health`
to `http://localhost:8000` so you don't hit CORS in development. **Point the proxy at
your actual API** by editing `proxy.conf.json` (`target`), or set
`src/environments/environment.ts` → `apiUrl` directly and skip the proxy.

For a production build:

```bash
npm run build
```

Output goes to `dist/sr-auth-console`. Before deploying, set the real API origin in
`src/environments/environment.prod.ts`.

## What's wired up

- **Auth** — register, login, and silent refresh-token rotation on 401 (single-flight,
  so concurrent requests don't all trigger separate refreshes). Session is kept in
  `localStorage` and decoded from the JWT as a fallback if the login response doesn't
  include a `user` object.
- **Roles** — list, create, rename, delete (`/sr/api/role/*`).
- **Holders & roles** — lists everyone from `UsersWithRoles`, with a drawer to assign or
  remove a role per holder.
- **Route guards** — `authGuard` protects `/dashboard`, `/roles`, `/users`; `guestGuard`
  keeps signed-in users out of `/login` and `/register`.

## Notes on the API contract

The spec's `200` responses are typed as an open schema (`{}`), so `AuthService` reads
defensively — it accepts `access_token`/`accessToken`/`token` and
`refresh_token`/`refreshToken` and falls back to decoding the JWT payload for user
info if the API doesn't return a `user` object. If your API's actual response shape
differs, adjust `applySession()` in `src/app/core/services/auth.service.ts`.

## Project structure

```
src/app/
  core/            services, interceptor, guards, models, error helper
  shared/          sr-button, sr-input, sr-badge, sr-toast-host, sr-empty-state,
                    sr-confirm-dialog, sr-clearance-badge
  layout/          authenticated shell (sidebar + topbar)
  features/
    auth/          split-panel layout, login, register
    dashboard/      overview + stats
    roles/          role CRUD
    users/          holder list + role assignment drawer
```
