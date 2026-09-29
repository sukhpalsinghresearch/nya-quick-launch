import { ArrowRight, BookOpen, ExternalLink, HandHeart, TicketCheck } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter, SiteHeader } from './site-chrome';

export default function Home() {
  return (
    <main className="quick-site">
      <SiteHeader active="home" />

      <section className="nya-intro">
        <p className="quick-kicker">NOT YOUR AVERAGE</p>
        <h1>For everyone who believes we can do <em>better.</em></h1>
        <p>
          NYA started with students who wanted to learn, build and do more than
          what was expected of them. This is the beginning of a community built
          around that belief.
        </p>
        <div className="hero-actions" aria-label="Start here">
          <Link href="/resources" className="hero-action hero-action-primary">
            <BookOpen aria-hidden="true" />
            <span>
              <small>EXAM RESOURCES</small>
              <strong>Study UCS503</strong>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <a className="hero-action" href="https://csatnypudj.zite.so" target="_blank" rel="noreferrer">
            <HandHeart aria-hidden="true" />
            <span>
              <small>JOIN THE TEAM</small>
              <strong>Volunteer for BIOS</strong>
            </span>
            <ExternalLink aria-hidden="true" />
          </a>
          <a className="hero-action" href="https://bios.notyouraverage.xyz/tracks" target="_blank" rel="noreferrer">
            <TicketCheck aria-hidden="true" />
            <span>
              <small>HACKATHON</small>
              <strong>Register for BIOS</strong>
            </span>
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="bios-feature" aria-labelledby="bios-title">
        <div className="bios-teaser-copy">
          <div>
            <p className="bios-label">BIOS V2 · THAPAR INSTITUTE, PATIALA</p>
            <h2 id="bios-title">Life meets computation.</h2>
            <p>We are organising BIOS again this year. Choose a track, form a team and turn a real problem into something that works.</p>
          </div>
          <div className="bios-actions">
            <a className="bios-volunteer" href="https://csatnypudj.zite.so" target="_blank" rel="noreferrer">
              Volunteer for BIOS <HandHeart aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="bios-art-stage">
          {/* oxlint-disable-next-line next/no-img-element -- local teaser artwork; next/image is incompatible with the current vinext dev runtime */}
          <img src="/images/bios-frag-hands.jpg" alt="A human hand and a machine hand reaching toward each other" width="639" height="217" />
          <a className="bios-visit" href="https://bios.notyouraverage.xyz" target="_blank" rel="noreferrer">
            Visit the BIOS website <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
