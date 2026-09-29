'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_STORAGE_KEY = 'nya_anonymous_session_id';
const ACTIVE_FLAG_KEY = 'nya_session_active_flag';
const HEARTBEAT_SECONDS = 30;

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && existing.length >= 16) {
      return existing;
    }
    const created =
      window.crypto.randomUUID?.() ??
      Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
    window.localStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return window.crypto.randomUUID?.() ?? 'anonymous-fallback-id';
  }
}

function resolveApiBase(): string {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (window.location.port && window.location.port !== '8788') {
      return 'http://localhost:8788';
    }
  }
  return '';
}

export function AnonymousSessionTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    sessionIdRef.current = sessionId;
    const apiBase = resolveApiBase();
    const currentPath = window.location.pathname || '/';
    lastPathRef.current = currentPath;

    const postAnalytics = async (endpoint: string, keepalive = false) => {
      try {
        const url = `${apiBase}${endpoint}`;
        const payload = JSON.stringify({
          session_id: sessionIdRef.current,
          path: lastPathRef.current || window.location.pathname || '/',
        });

        if (keepalive && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const blob = new Blob([payload], { type: 'application/json' });
          if (navigator.sendBeacon(url, blob)) return;
        }

        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive,
        });
      } catch {
        // Analytics must never throw or interrupt the user experience.
      }
    };

    if (!initializedRef.current) {
      initializedRef.current = true;
      const isAlreadyActive = window.sessionStorage.getItem(ACTIVE_FLAG_KEY);
      if (!isAlreadyActive) {
        window.sessionStorage.setItem(ACTIVE_FLAG_KEY, '1');
        void postAnalytics('/analytics/session/start');
      } else {
        void postAnalytics('/analytics/session/heartbeat');
      }
    }

    const intervalTimer = window.setInterval(() => {
      void postAnalytics('/analytics/session/heartbeat');
    }, HEARTBEAT_SECONDS * 1000);

    const handleUnload = () => {
      void postAnalytics('/analytics/session/end', true);
    };

    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.clearInterval(intervalTimer);
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Handle route navigation
  useEffect(() => {
    if (!sessionIdRef.current) return;
    const currentPath = pathname || window.location.pathname || '/';
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      lastPathRef.current = currentPath;
      const apiBase = resolveApiBase();
      try {
        void fetch(`${apiBase}/analytics/session/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionIdRef.current,
            path: currentPath,
          }),
        }).catch(() => {});
      } catch {}
    } else {
      lastPathRef.current = currentPath;
    }
  }, [pathname]);

  return null;
}
