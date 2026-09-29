import { ArrowRight, BookOpen, GraduationCap, TimerReset } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter, SiteHeader } from '@/app/site-chrome';
import { ucs503Modules } from '@/lib/ucs503-curriculum';

export const metadata = {
  title: 'UCS503 Software Engineering | Not Your Average',
  description: 'Interactive UCS503 revision for process models, requirements engineering and UML modeling.',
};

export default function ResourcesPage() {
  return <main className="quick-site ucs503-page">
    <SiteHeader active="resources" />
    <section className="resource-intro">
      <p className="quick-kicker"><GraduationCap aria-hidden="true" /> UCS503 · SOFTWARE ENGINEERING</p>
      <h1>Understand the system<br /><em>before you draw it.</em></h1>
      <p>Process models explain how the work moves. Requirements explain what the system must achieve. UML makes the behaviour, structure and deployment visible.</p>
    </section>
    <section className="revision-strip"><TimerReset aria-hidden="true" /><div><span>EXAM REVISION PATH</span><strong>Start with the module you need, then use a worked interaction to test the idea.</strong></div><Link href="/revision">Start a 15-minute revision <ArrowRight aria-hidden="true" /></Link></section>
    <section className="module-map" id="course-map">
      {ucs503Modules.map((module) => <article key={module.id}>
        <header><span>MODULE {module.number}</span><h2>{module.title}</h2><p>{module.subtitle}</p></header>
        <div className="module-exam-focus"><strong>Exam focus</strong><p>{module.examFocus}</p></div>
        <ol>{module.lessons.map((lesson) => <li key={`${module.id}-${lesson.id}`}><span>{lesson.lecture}</span><div><small>{lesson.kind}</small><h3>{lesson.title}</h3><p>{lesson.question}</p></div><Link href={`/learn/${lesson.id}`}>Learn <ArrowRight aria-hidden="true" /></Link></li>)}</ol>
      </article>)}
    </section>
    <section className="course-entry"><BookOpen aria-hidden="true" /><div><span>CONNECTED DIAGRAM STUDIO</span><h2>Use one scenario across five live diagrams.</h2></div><Link href="/courses/ucs503-software-engineering">Open the UML lab <ArrowRight aria-hidden="true" /></Link></section>
    <SiteFooter />
  </main>;
}
