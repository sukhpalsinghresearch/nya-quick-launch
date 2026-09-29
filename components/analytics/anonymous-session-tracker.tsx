'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const HEARTBEAT_SECONDS = 30;

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
  const sessionStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const apiBase = resolveApiBase();
    const currentPath = window.location.pathname || '/';
    lastPathRef.current = currentPath;

    const startSession = async () => {
      try {
        const res = await fetch(`${apiBase}/analytics/session/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentPath }),
          credentials: 'include',
        });
        if (res.ok) {
          sessionStartedRef.current = true;
        }
      } catch {
        // Analytics must never throw or interrupt the user experience.
      }
    };

    const sendHeartbeat = async (pathToSend?: string) => {
      try {
        const path = pathToSend || lastPathRef.current || window.location.pathname || '/';
        const res = await fetch(`${apiBase}/analytics/session/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
          credentials: 'include',
        });
        if (!res.ok) {
          // If session is expired or invalid on the server, initiate a new session
          if (res.status === 400 || res.status === 401) {
            void startSession();
          }
        }
      } catch {
        // Silent failure
      }
    };

    // On mount, start anonymous session
    if (!sessionStartedRef.current) {
      void startSession();
    }

    // Set recurring heartbeat
    const intervalTimer = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_SECONDS * 1000);

    return () => {
      window.clearInterval(intervalTimer);
    };
  }, []);

  // Handle route navigation changes
  useEffect(() => {
    const currentPath = pathname || window.location.pathname || '/';
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      lastPathRef.current = currentPath;
      const apiBase = resolveApiBase();
      try {
        void fetch(`${apiBase}/analytics/session/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentPath }),
          credentials: 'include',
        }).catch(() => {});
      } catch {}
    } else {
      lastPathRef.current = currentPath;
    }
  }, [pathname]);

  return null;
}
