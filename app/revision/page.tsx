import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Route } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter, SiteHeader } from '@/app/site-chrome';
import { Ucs503Revision } from '@/components/learning/ucs503-revision';

export const metadata: Metadata = {
  title: 'UCS503 Revision | Not Your Average',
  description: 'Short, interactive revision for UCS503 Software Engineering.',
};

export default function RevisionPage() {
  return <main className="lesson-page revision-page">
    <SiteHeader active="resources" />
    <section className="lesson-hero revision-hero">
      <Link href="/resources" className="lesson-back"><Route aria-hidden="true" /> UCS503 course map</Link>
      <p className="quick-kicker">UCS503 / EXAM REVISION</p>
      <h1>Revise the decision,<br /><em>not the label.</em></h1>
      <p>Use this after you have walked the module map. A wrong answer should tell you which concept or diagram to reopen.</p>
    </section>
    <section className="revision-guide">
      <article><BookOpen aria-hidden="true" /><h2>Before you begin</h2><p>Do not open notes yet. Choose the answer you can defend, then read the explanation.</p></article>
      <article><ArrowRight aria-hidden="true" /><h2>After each answer</h2><p>Go back to the relevant lesson only when the explanation exposes a gap. This keeps revision focused.</p></article>
    </section>
    <Ucs503Revision />
    <section className="diagram-launch"><div><span>NEED A DIAGRAM DRILL?</span><h2>Practice one scenario across five views.</h2><p>Use the connected UML studio for use case, sequence, class, activity and swimlane diagrams.</p></div><Link href="/courses/ucs503-software-engineering">Open the UML lab <ArrowRight aria-hidden="true" /></Link></section>
    <SiteFooter />
  </main>;
}
