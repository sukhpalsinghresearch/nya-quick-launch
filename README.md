# NYA Quick Launch

The focused public release for Not Your Average.

It contains:

- the NYA homepage and current community direction;
- a direct registration path for BIOS V2;
- UCS503 Software Engineering resources;
- interactive use case, sequence, class, activity and swimlane diagrams.

The complete NYA platform continues separately. This repository intentionally
keeps the public release small while the larger platform is being prepared.

## Local development

```bash
pnpm install
pnpm dev
```

Run the anonymous analytics service in a second terminal:

```bash
pnpm dev:analytics
```

The site stays usable if analytics is unavailable. On localhost, the counter
connects to `http://localhost:8788`. In production, it uses
`/api/analytics`, which Nginx proxies to the local analytics service.

## View counter and private statistics

The counter records:

- total page views;
- anonymous unique visitors;
- visitors active during the last 90 seconds;
- daily and weekly views;
- the most viewed paths.

It does not store raw IP addresses, names, email addresses or browser
fingerprints. A random identifier remains in the visitor's own browser. The
server stores only its HMAC hash. Repeated loads of the same page within ten
seconds count once, and common crawler user agents are ignored.

The public counter uses:

```text
GET  /api/analytics/public
POST /api/analytics/track
```

Detailed statistics do not require an admin dashboard. Read them with the
private key through a request header:

```bash
curl -H "X-Stats-Key: YOUR_PRIVATE_KEY" \
  https://notyouraverage.xyz/api/analytics/stats
```

The response contains `totalViews`, `uniqueVisitors`, `onlineNow`,
`viewsToday`, `viewsThisWeek` and `topPages`.

## Oracle deployment for analytics

1. Use Node.js 22 or newer on the Oracle VM.
2. Clone the repository to `/opt/nya-quick-launch`.
3. Create `/opt/nya-quick-launch/data` and give the `nya` service user write
   access to it.
4. Create `.env.analytics` from `.env.example`. Generate separate random
   values for `ANALYTICS_HASH_SECRET` and `ANALYTICS_STATS_KEY`.
5. Set `ANALYTICS_ALLOWED_ORIGINS` to the final HTTPS domain.
6. Copy `deploy/oracle/nya-analytics.service` to `/etc/systemd/system/`, then
   enable and start it.
7. Add `deploy/oracle/nginx-analytics.conf` inside the website's HTTPS Nginx
   server block and reload Nginx.
8. Keep port 8788 bound to `127.0.0.1`. Do not expose it in the Oracle firewall.

Useful commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nya-analytics
sudo systemctl status nya-analytics
curl http://127.0.0.1:8788/health
```

Back up `data/analytics.sqlite` with the rest of the site data. SQLite WAL mode
is enabled so reads do not block normal view recording.

## Checks

```bash
pnpm lint
pnpm build
```
