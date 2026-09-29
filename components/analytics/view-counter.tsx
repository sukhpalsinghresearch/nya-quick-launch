'use client';

import { Eye, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type PublicStats = {
  totalViews: number;
  onlineNow: number;
};

function endpoint() {
  if (typeof window === 'undefined') return '/api/analytics';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8788';
  }
  return '/api/analytics';
}

function visitorId() {
  const key = 'nya-anonymous-visitor';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = window.crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function ViewCounter() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const id = visitorId();
    const api = endpoint();
    const send = async (event: 'view' | 'heartbeat') => {
      try {
        const response = await fetch(`${api}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, path: window.location.pathname, visitorId: id }),
          keepalive: true,
        });
        if (response.ok) setStats(await response.json());
      } catch {
        // Analytics must never stop the learning experience from working.
      }
    };
    void send('view');
    const timer = window.setInterval(() => void send('heartbeat'), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!stats) return null;

  return <div className="view-counter" aria-label="Site activity" aria-live="polite">
    <span><Eye aria-hidden="true" /> {stats.totalViews.toLocaleString()} views</span>
    <span><Users aria-hidden="true" /> {stats.onlineNow.toLocaleString()} online</span>
  </div>;
}
