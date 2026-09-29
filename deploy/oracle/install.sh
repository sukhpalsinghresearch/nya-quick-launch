#!/usr/bin/env bash
set -euo pipefail

app_dir=/opt/nya-quick-launch

if ! id nya >/dev/null 2>&1; then
  useradd --system --home-dir "$app_dir" --shell /sbin/nologin nya
fi

chown -R nya:nya "$app_dir"
install -d -o nya -g nya -m 750 "$app_dir/data"

if [[ ! -f "$app_dir/.env.analytics" ]]; then
  umask 077
  hash_secret="$(openssl rand -hex 32)"
  stats_key="$(openssl rand -hex 32)"
  printf '%s\n' \
    'ANALYTICS_PORT=8788' \
    'ANALYTICS_HOST=127.0.0.1' \
    "ANALYTICS_DB_PATH=$app_dir/data/analytics.sqlite" \
    "ANALYTICS_HASH_SECRET=$hash_secret" \
    "ANALYTICS_STATS_KEY=$stats_key" \
    'ANALYTICS_ALLOWED_ORIGINS=http://129.154.224.127,https://notyouraverage.xyz,https://www.notyouraverage.xyz' \
    > "$app_dir/.env.analytics"
  chown nya:nya "$app_dir/.env.analytics"
fi

install -o root -g root -m 644 /tmp/nya-web.service /etc/systemd/system/nya-web.service
install -o root -g root -m 644 /tmp/nya-analytics.service /etc/systemd/system/nya-analytics.service
install -o root -g root -m 644 /tmp/nginx.conf /etc/nginx/nginx.conf
install -o root -g root -m 644 /tmp/nya.conf /etc/nginx/conf.d/nya.conf

nginx -t
systemctl daemon-reload
systemctl enable --now nya-web.service nya-analytics.service nginx.service
systemctl reload nginx.service
