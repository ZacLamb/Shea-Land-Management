# Shea Land Management website

Node/Express + EJS site for Shea Land Management (East Sandwich, MA). Deploys on Railway from this repo.

## What is in it

| Area | URL pattern | Count |
| --- | --- | --- |
| Home, About, Contact, Services, Service Areas | `/`, `/about`, `/contact`, `/services`, `/service-areas` | 5 |
| Service pages | `/services/<service>` | 4 |
| Town pages | `/service-areas/<town>-ma` | 15 |
| Service-by-town pages (programmatic SEO) | `/services/<service>/<town>-ma` | 60 |
| Articles | `/articles`, `/articles/<slug>` | 5 starter articles + weekly |
| SEO plumbing | `/sitemap.xml`, `/robots.txt`, JSON-LD on every page type | |

Content lives in `data/`: `services.js`, `towns.js`, `articles-seed.js`, `topics.js` (the article queue) and `site.js`.
Edit those files to change copy. Add a town or service there and its pages, links and sitemap entries appear on the next deploy.

Job photos: upload `.jpg`, `.png` or `.webp` files to `public/images/projects/` and a "Recent work" gallery appears on the home page.

## Railway variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `BUSINESS_PHONE` | Call buttons | e.g. `(508) 555-0100`. Call buttons stay hidden until this is set |
| `BUSINESS_EMAIL` | Footer/contact email | Optional |
| `SITE_URL` | Canonical URLs and sitemap | e.g. `https://www.example.com` once the domain is attached |
| `FACEBOOK_URL` | Footer link | Optional |
| `GHL_WEBHOOK_URL` | Quote form into GoHighLevel | Inbound Webhook trigger URL from a GHL workflow |
| `REPORT_WEBHOOK_URL` | Daily traffic email | Inbound Webhook trigger URL from a second GHL workflow |
| `REPORT_EMAIL` | Daily traffic email | Passed through as `report_email` |
| `ADMIN_KEY` | `/admin/report` and the API routes | Any long random string |
| `DATABASE_URL` | Keeping traffic, leads and new articles | Railway Postgres. Without it, traffic counts reset on every restart and new articles cannot be stored |
| `ANTHROPIC_API_KEY` | Weekly auto-written articles | Optional. `ANTHROPIC_MODEL` overrides the model |

## GoHighLevel setup

**Quote form.** Create a workflow with an Inbound Webhook trigger, paste its URL into `GHL_WEBHOOK_URL`, submit the form once so GHL learns the fields, then map: `first_name`, `last_name`, `phone`, `email`, `town`, `service`, `message`, `page`, `source`. Add Create/Update Contact, an opportunity, the instant text back and the owner notification.

**Daily report.** Create a second workflow with an Inbound Webhook trigger and paste its URL into `REPORT_WEBHOOK_URL`. The site posts every day at 7:00 AM Eastern with yesterday's numbers. Add a Send Email action using `{{inboundWebhookRequest.subject}}` as the subject and `{{inboundWebhookRequest.summary_html}}` as the body. Individual numbers (`visitors`, `pageviews`, `call_clicks`, `quote_button_clicks`, `quote_requests`, `top_pages`, `top_sources`) are in the payload too.

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
