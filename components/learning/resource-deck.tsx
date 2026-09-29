import { ExternalLink, PlayCircle, ShieldCheck } from 'lucide-react';

import type { LearningResource } from '@/lib/ucs503-resources';

export function ResourceDeck({ resources }: { resources: LearningResource[] }) {
  return <section className="lesson-resources">
    <header>
      <div><span>CHECKED LEARNING LINKS</span><h2>Watch the part that solves the gap.</h2></div>
      <p>Each link is matched to this lesson. Start with a quick video when available. Open the full lecture when you need the academic explanation.</p>
    </header>
    <div className="lesson-resource-grid">
      {resources.map((item, index) => <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
        <div><PlayCircle aria-hidden="true" /><span>{index === 0 ? 'WATCH FIRST' : 'GO DEEPER'}</span><small>{item.format}</small></div>
        <h3>{item.title}</h3>
        <p>{item.useFor}</p>
        <footer><span>{item.publisher}</span><small><ShieldCheck aria-hidden="true" /> {item.verifiedBy}</small><ExternalLink aria-hidden="true" /></footer>
      </a>)}
    </div>
  </section>;
}
