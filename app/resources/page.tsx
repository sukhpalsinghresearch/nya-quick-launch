import { ArrowRight, BookOpen, GraduationCap, Network, TimerReset } from 'lucide-react';

import { SiteFooter, SiteHeader } from '@/app/site-chrome';
import { ucs503Modules } from '@/lib/ucs503-curriculum';

export const metadata = {
  title: 'UCS503 Software Engineering | Not Your Average',
  description: 'Interactive UCS503 revision for process models, requirements engineering and UML modeling.',
};

const diagramPractice = [
  { name: 'Use case', level: 'full studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=use-case', question: 'Who wants what from the system?' },
  { name: 'Sequence', level: 'full studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=sequence', question: 'Who sends which message, and when?' },
  { name: 'Class', level: 'full studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=class', question: 'What structure supports the scenario?' },
  { name: 'Activity', level: 'full studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=activity', question: 'What work, choice or parallel path occurs?' },
  { name: 'Swimlane', level: 'full studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=swimlane', question: 'Who owns each activity and handoff?' },
  { name: 'DFD', level: 'guided builder', href: '/learn/dfd', question: 'Where does data enter, change and persist?' },
  { name: 'Collaboration', level: 'guided comparison', href: '/learn/interaction-diagrams', question: 'Which linked object owns each numbered message?' },
  { name: 'State', level: 'guided simulator', href: '/learn/state-diagrams', question: 'How does one object react to events?' },
  { name: 'Component and deployment', level: 'guided explorer', href: '/learn/component-deployment', question: 'What is the software split, and where does it run?' },
];

const connectedDiagrams = diagramPractice.slice(0, 5);
const guidedDiagrams = diagramPractice.slice(5);

export default function ResourcesPage() {
  return <main className="quick-site ucs503-page">
    <SiteHeader active="resources" />
    <section className="resource-intro">
      <p className="quick-kicker"><GraduationCap aria-hidden="true" /> UCS503 · SOFTWARE ENGINEERING</p>
      <h1>Understand the system<br /><em>before you draw it.</em></h1>
      <p>Process models explain how the work moves. Requirements explain what the system must achieve. UML makes the behaviour, structure and deployment visible.</p>
    </section>
    <section className="studio-gateway" aria-labelledby="studio-gateway-title">
      <div className="studio-gateway-copy">
        <p className="quick-kicker"><Network aria-hidden="true" /> INTERACTIVE DIAGRAM STUDIO</p>
        <h2 id="studio-gateway-title">Choose a system. Choose a scenario. Draw every connected view.</h2>
        <p>
          This is the complete lab built around Instagram, Spotify, Uber, Ola and other familiar systems.
          Change the scenario, then switch between Classroom, System Design and Near Exhaustive depth.
        </p>
        <a className="studio-primary-link" href="/courses/ucs503-software-engineering/system-lab">
          Open the complete studio <ArrowRight aria-hidden="true" />
        </a>
      </div>
      <div className="studio-diagram-links">
        {connectedDiagrams.map((item, index) => (
          <a href={item.href} key={item.name}>
            <small>0{index + 1}</small>
            <span><strong>{item.name}</strong><em>{item.question}</em></span>
            <ArrowRight aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
    <section className="revision-strip"><TimerReset aria-hidden="true" /><div><span>EXAM REVISION PATH</span><strong>Start with the module you need, then use a worked interaction to test the idea.</strong></div><a href="/revision">Start a 15-minute revision <ArrowRight aria-hidden="true" /></a></section>
    <section className="module-map" id="course-map">
      {ucs503Modules.map((module) => <article key={module.id}>
        <header><span>MODULE {module.number}</span><h2>{module.title}</h2><p>{module.subtitle}</p></header>
        <div className="module-exam-focus"><strong>Exam focus</strong><p>{module.examFocus}</p></div>
        <ol>{module.lessons.map((lesson) => <li key={`${module.id}-${lesson.id}`}><span>{lesson.lecture}</span><div><small>{lesson.kind === 'diagram' ? 'full diagram studio' : 'guided interactive'}</small><h3>{lesson.title}</h3><p>{lesson.question}</p></div><a href={`/learn/${lesson.id}`}>Learn <ArrowRight aria-hidden="true" /></a></li>)}</ol>
      </article>)}
    </section>
    <section className="diagram-practice-index">
      <header><span>MORE DIAGRAMS</span><h2>Continue beyond the connected UML studio.</h2><p>These guided exercises cover data flow, object collaboration, state changes, components and deployment.</p></header>
      <div>{guidedDiagrams.map((item) => <a href={item.href} key={item.name}><small>{item.level}</small><h3>{item.name}</h3><p>{item.question}</p><ArrowRight aria-hidden="true" /></a>)}</div>
    </section>
    <section className="course-entry"><BookOpen aria-hidden="true" /><div><span>CONNECTED DIAGRAM STUDIO</span><h2>Use one scenario across five live diagrams.</h2></div><a href="/courses/ucs503-software-engineering/system-lab">Open the UML lab <ArrowRight aria-hidden="true" /></a></section>
    <SiteFooter />
  </main>;
}
