# urlx1.site Multi Bio Pages

No KV, D1 or R2. Persistent bio-page settings are stored in `pages.json` in this GitHub repository.

## Public routes
- `/` — official urlx1.site homepage
- `/admin/` — password-protected admin manager
- `/<slug>` — generated bio page, e.g. `/amina-whatsapp`
- Each bio page uses the same theme and can have its own profile info, social preview, buttons, redirect destination and delay.

## Cloudflare Pages
- Production branch: `main`
- Framework preset: None
- Build command: `exit 0`
- Build output directory: `public`

## Variables and secrets
- `GITHUB_OWNER=fbstoryaccoutn1-jpg`
- `GITHUB_REPO=urlx1-bio`
- `GITHUB_BRANCH=main`
- `GITHUB_TOKEN` = fine-grained token for this repository, Contents read/write
- `ADMIN_PASSWORD` = your chosen admin password

Keep GITHUB_TOKEN and ADMIN_PASSWORD as Cloudflare secrets.

## Creating pages
Log in at `/admin/`, press **+ New**, choose the slug, fill only the fields you want, set the main destination and redirect delay, optionally add buttons, then **Save All Changes**.
