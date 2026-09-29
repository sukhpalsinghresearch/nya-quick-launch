#!/usr/bin/env bash
set -euo pipefail

repo=/opt/nya-quick-launch
state=/var/lib/nya-deploy

install -d -o nya -g nya -m 750 "$state"
exec 9>"$state/deploy.lock"
flock -n 9 || exit 0

runuser -u nya -- git -C "$repo" fetch --quiet origin main
remote="$(runuser -u nya -- git -C "$repo" rev-parse origin/main)"
deployed="$(cat "$state/last-successful" 2>/dev/null || true)"
[[ "$remote" == "$deployed" ]] && exit 0

test "$state" = /var/lib/nya-deploy
rm -rf "$state/dist-backup"
cp -a "$repo/dist" "$state/dist-backup"

runuser -u nya -- git -C "$repo" reset --hard origin/main

if ! runuser -u nya -- env CI=true bash -lc "cd '$repo' && /usr/local/bin/pnpm install --frozen-lockfile && /usr/local/bin/pnpm lint && /usr/local/bin/pnpm build"; then
  rm -rf "$repo/dist"
  cp -a "$state/dist-backup" "$repo/dist"
  chown -R nya:nya "$repo/dist"
  echo 'Deployment stopped: install, lint, or build failed; previous build restored.' >&2
  exit 1
fi

systemctl restart nya-web.service nya-analytics.service
printf '%s\n' "$remote" > "$state/last-successful"
chown nya:nya "$state/last-successful"
echo "Deployed origin/main $remote"
