'use client';

import { ExternalLink, Menu } from 'lucide-react';
import { useState } from 'react';
import { ViewCounter } from '@/components/analytics/view-counter';

export function SiteHeader({ active = 'home' }: { active?: 'home' | 'resources' | 'courses' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="quick-header">
      <a className="quick-brand" href="/" aria-label="Not Your Average home">
        <strong>NOT / AVERAGE</strong>
        <span>WE CAN DO BETTER</span>
      </a>
      <nav className={open ? 'quick-nav open' : 'quick-nav'} aria-label="Primary navigation">
        <a className={active === 'home' ? 'active' : ''} href="/">Home</a>
        <a className={active === 'resources' || active === 'courses' ? 'active' : ''} href="/resources">UCS503 resources</a>
        <a href="https://bios.notyouraverage.xyz" target="_blank" rel="noreferrer">BIOS <ExternalLink aria-hidden="true" /></a>
      </nav>
      <button className="quick-menu" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <Menu aria-hidden="true" />
      </button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="quick-footer">
      <div className="quick-brand"><strong>NOT / AVERAGE</strong><span>WE CAN DO BETTER</span></div>
      <p>Built for the people who believe average is not the limit.</p>
      <ViewCounter />
      <div><a href="/resources">UCS503 resources</a><a href="https://bios.notyouraverage.xyz">BIOS</a></div>
    </footer>
  );
}
