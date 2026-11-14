# Shea Land Management website

Node/Express + EJS site for Shea Land Management (East Sandwich, MA). Deploys on Railway from this repo.

## What is in it

| Area | URL pattern | Count |
| --- | --- | --- |
| Home, About, Contact, Services, Service Areas | `/`, `/about`, `/contact`, `/services`, `/service-areas` | 5 |
| Service pages | `/services/<service>` | 4 |
| Town pages | `/service-areas/<town>-ma` | 15 |
| Service-by-town pages (programmatic SEO) | `/services/<service>/<town>-ma` | 60 |
| Instant estimate tool | `/estimate` | 6 project types |
| Articles | `/articles`, `/articles/<slug>` | 5 starter articles + weekly |
| SEO plumbing | `/sitemap.xml`, `/robots.txt`, JSON-LD on every page type | |

Content lives in `data/`: `services.js`, `towns.js`, `articles-seed.js`, `topics.js` (the article queue) and `site.js`.
Edit those files to change copy. Add a town or service there and its pages, links and sitemap entries appear on the next deploy.

Instant estimate tool: prices live in `data/quote.js` as low/high ranges per unit, with a minimum per project and access multipliers. The numbers there are starting ballparks, not the owner's prices: confirm them with him before launch. Estimates submitted through the tool reach GHL tagged `instant-estimate` with the selections and the range shown in the contact note.

Site photos: the six photos (hero, one per service, stone detail) are downloaded into `public/images/site/` during the build by `scripts/fetch-images.js`. To replace one with a real job photo, upload a file with the same name (`hero.jpg`, `hardscaping.jpg`, `clearing.jpg`, `landscaping.jpg`, `tree.jpg`, `stone.jpg`) to that folder.

Job photos: upload `.jpg`, `.png` or `.webp` files to `public/images/projects/` and a "Recent work" gallery appears on the home page.

## Railway variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `BUSINESS_PHONE` | Call buttons | e.g. `(508) 555-0100`. Call buttons stay hidden until this is set |
| `BUSINESS_EMAIL` | Footer/contact email | Optional |
| `SITE_URL` | Canonical URLs and sitemap | e.g. `https://www.example.com` once the domain is attached |
| `FACEBOOK_URL` | Footer link | Optional |
| `GHL_API_KEY` | Quote forms and the daily report email | Private Integration token from the Shea Land Management sub-account (Settings > Private Integrations). Scopes: `contacts.write`, `contacts.readonly`, `conversations/message.write` |
| `GHL_LOCATION_ID` | Which sub-account receives leads | Already set to `ru496ygp3O8vzPCikxMg` (Shea Land Management) |
| `REPORT_EMAIL` | Daily traffic email | Address that receives the 7:00 AM report |
| `ADMIN_KEY` | `/admin/report` and the API routes | Any long random string |
| `DATABASE_URL` | Keeping traffic, leads and new articles | Railway Postgres. Without it, traffic counts reset on every restart and new articles cannot be stored |
| `ANTHROPIC_API_KEY` | Weekly auto-written articles | Optional. `ANTHROPIC_MODEL` overrides the model |

## GoHighLevel

Everything goes through the GHL API (`lib/ghl.js`), no webhooks or workflows required.

**Quote forms.** Every form on the site posts to `/api/lead`, which creates or updates the contact in the Shea Land Management sub-account, sets source to "Website quote form", adds the tags `website-lead`, `service-<service>` and `town-<town>`, and attaches the job details as a note. Build any follow-up automation in GHL off the `website-lead` tag (trigger: Contact Tag added).

**Daily report.** At 7:00 AM Eastern the site emails yesterday's numbers to `REPORT_EMAIL` through the sub-account's email. The recipient is stored as a contact tagged `website-report-recipient`.

## Articles

- **Automatic:** with `ANTHROPIC_API_KEY` and `DATABASE_URL` set, one article is written and published every Tuesday at 9:00 AM Eastern from the queue in `data/topics.js`.
- **On demand:** `POST /api/articles/generate` with header `x-api-key: <ADMIN_KEY>`.
- **Push your own:** `POST /api/articles` with header `x-api-key: <ADMIN_KEY>` and JSON `{ "title", "excerpt", "body_html", "service" }`.

## Traffic report

- View any day: `/admin/report?key=<ADMIN_KEY>` (add `&format=json` for raw data).
- Send now: `POST /api/report/send` with header `x-api-key: <ADMIN_KEY>`.
- Tracking is first-party and cookie-free: page views, taps on call and email links, quote button clicks, form starts and quote requests. Bots are filtered out.

## Run locally

```
npm install
npm start
```
