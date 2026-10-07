# urlx1.site Bio Page

Cloudflare Pages + GitHub powered bio page with no KV, D1 or R2.

## Cloudflare Pages settings
- Production branch: main
- Build command: exit 0
- Build output directory: public

## Environment variables / secrets
Add these in Cloudflare Pages → Settings → Variables and Secrets:

- GITHUB_OWNER = fbstoryaccoutn1-jpg
- GITHUB_REPO = urlx1-bio
- GITHUB_BRANCH = main
- GITHUB_TOKEN = fine-grained GitHub token with Contents: Read and write for this repo
- ADMIN_PASSWORD = your chosen admin password

Set GITHUB_TOKEN and ADMIN_PASSWORD as encrypted secrets.

## Routes
- Public bio: /
- Admin panel: /admin/
- Config API: /api/config
- Save API: /api/save

## Custom domain
Attach: urlx1.site

The public page is server-rendered, so OG tags are included in the initial HTML for social preview crawlers.
