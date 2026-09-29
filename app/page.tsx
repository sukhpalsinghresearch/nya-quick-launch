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
        <p className="platform-note">THE FULL NYA PLATFORM IS COMING SOON</p>
      </section>

      <section className="bios-feature" aria-labelledby="bios-title">
        <a className="bios-art-link" href="https://bios.notyouraverage.xyz" target="_blank" rel="noreferrer" aria-label="Visit the BIOS hackathon website">
          {/* oxlint-disable-next-line next/no-img-element -- local hero asset; next/image is incompatible with the current vinext dev runtime */}
          <img src="/images/bios-landing-with-background.png" alt="BIOS, where life and computation meet" width="1679" height="943" />
          <span>Enter the BIOS website <ExternalLink aria-hidden="true" /></span>
        </a>
        <div className="bios-teaser-copy">
          <div>
            <p className="bios-label">BIOS V2 · THAPAR INSTITUTE, PATIALA</p>
            <h2 id="bios-title">Life meets computation.</h2>
            <p>We are organising BIOS again this year. Choose a track, form a team and turn a real problem into something that works.</p>
          </div>
          <div className="bios-actions">
            <a className="bios-register" href="https://bios.notyouraverage.xyz/tracks" target="_blank" rel="noreferrer">
              Register for BIOS <ExternalLink aria-hidden="true" />
            </a>
            <a className="bios-volunteer" href="https://csatnypudj.zite.so" target="_blank" rel="noreferrer">
              Volunteer for BIOS <HandHeart aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="volunteer-callout" aria-labelledby="volunteer-title">
        <div>
          <p className="quick-kicker">BIOS VOLUNTEERS</p>
          <h2 id="volunteer-title">Want to volunteer for BIOS? <em>Be Not Average.</em></h2>
        </div>
        <div className="volunteer-callout-copy">
          <p>
            Work starts immediately. During MSTs, the workload stays limited.
            After MSTs, it is all hands on deck until 1 November.
          </p>
          <p>
            Prior experience is not required. Dedication, consistency,
            reliability and ownership are.
          </p>
          <strong>Write your answers yourself. AI-generated responses may be rejected.</strong>
          <a
            className="volunteer-apply"
            href="https://csatnypudj.zite.so"
            target="_blank"
            rel="noreferrer"
          >
            Apply to volunteer <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
