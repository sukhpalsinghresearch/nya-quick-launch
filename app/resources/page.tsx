import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter, SiteHeader } from '@/app/site-chrome';
import { courses } from '@/lib/courses';

export const metadata = {
  title: 'UCS503 Resources | Not Your Average',
  description: 'Interactive revision for UCS503 Software Engineering diagrams.',
};

export default function ResourcesPage() {
  const course = courses[0];
  return (
    <main className="quick-site">
      <SiteHeader active="resources" />
      <section className="resource-intro">
        <p className="quick-kicker"><GraduationCap aria-hidden="true" /> UCS503 · SOFTWARE ENGINEERING</p>
        <h1>One system.<br /><em>Five diagrams.</em></h1>
        <p>
          Choose a familiar application, fix the boundary and carry one
          scenario through each diagram. The point is to understand why every
          element exists, not to memorize symbols.
        </p>
      </section>

      <section className="diagram-directory" aria-label="UCS503 diagram resources">
        {course.modules.map((module) => (
          <Link href={module.href} key={module.number}>
            <span>{module.number}</span>
            <div><p>{module.kind}</p><h2>{module.title}</h2><p>{module.question}</p></div>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </section>

      <section className="course-entry">
        <BookOpen aria-hidden="true" />
        <div><span>COMPLETE COURSE VIEW</span><h2>Follow the diagrams in teaching order.</h2></div>
        <Link href="/courses/ucs503-software-engineering">Open UCS503 <ArrowRight aria-hidden="true" /></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
