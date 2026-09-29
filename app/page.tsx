import { ArrowRight, ExternalLink } from 'lucide-react';
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
        <div className="intro-status">
          <span>THE FULL NYA PLATFORM IS COMING SOON</span>
          <Link href="/resources">UCS503 resources are available now <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="bios-frame" aria-labelledby="bios-title">
        <div className="bios-bio">
          <span>BIO</span>
          <p>humanity · nature · life</p>
        </div>
        <div className="bios-main">
          <p className="bios-label">BIOS V2 · THAPAR INSTITUTE, PATIALA</p>
          <h2 id="bios-title">Bringing Innovation<br />On-Stage</h2>
          <p>A hackathon where life and computation meet.</p>
          <div className="bios-actions">
            <a className="bios-register" href="https://bios.notyouraverage.xyz/tracks" target="_blank" rel="noreferrer">
              Register for BIOS <ExternalLink aria-hidden="true" />
            </a>
            <a href="https://bios.notyouraverage.xyz" target="_blank" rel="noreferrer">Visit the BIOS website</a>
          </div>
        </div>
        <div className="bios-os">
          <span>OS</span>
          <p>computation · systems · machines</p>
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
