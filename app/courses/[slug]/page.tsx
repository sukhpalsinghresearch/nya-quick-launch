import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Network, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';

import { SiteFooter, SiteHeader } from '@/app/site-chrome';
import { courseForSlug, courses } from '@/lib/courses';

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = courseForSlug((await params).slug);
  if (!course) return {};
  return { title: `${course.code} ${course.title} | Not Your Average`, description: course.summary };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = courseForSlug((await params).slug);
  if (!course) notFound();

  return (
    <main>
      <SiteHeader active="courses" />
      <section className="course-hero course-hero-plum">
        <a className="course-back" href="/resources"><ArrowLeft aria-hidden="true" /> UCS503 resources</a>
        <div className="course-title-row">
          <div>
            <p className="eyebrow">THAPAR / {course.code}</p>
            <h1>{course.title}</h1>
            <p className="course-summary">{course.summary}</p>
          </div>
          <aside className="course-track-card">
            <span>LEARNING DIRECTION</span>
            <p>{course.direction}</p>
            <div className="course-instructor">
              <UserRound aria-hidden="true" />
              <span><small>INSTRUCTOR</small><strong>{course.instructor}</strong></span>
            </div>
          </aside>
        </div>
      </section>

      <section className="course-outcomes">
        <p className="eyebrow">WHAT YOU SHOULD BE ABLE TO DEFEND</p>
        <ul>{course.outcomes.map((outcome) => <li key={outcome}><Check aria-hidden="true" /> {outcome}</li>)}</ul>
      </section>

      <section className="module-directory">
        <div className="module-heading">
          <div><p className="eyebrow">COURSE MAP</p><h2>Start with the question, then draw.</h2></div>
          <p>Each module opens directly into the interactive lab. Use the same platform and scenario when you want to compare diagrams.</p>
        </div>
        <div className="module-list">
          {course.modules.map((module) => (
            <article className="module-row module-live" key={module.number}>
              <span className="module-number">{module.number}</span>
              <div className="module-main"><div><span>{module.kind}</span></div><h3>{module.title}</h3><p>{module.question}</p></div>
              <a href={module.href}>Open module <ArrowRight aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="course-lab-promo course-lab-promo-plum">
        <div><p className="eyebrow"><Network aria-hidden="true" /> INTERACTIVE UML LAB</p><h2>Choose the diagram, system and depth you need.</h2></div>
        <p>Use Classroom for exam revision. Expand into System Design when you want to inspect a larger product model.</p>
        <a href={`/courses/${course.slug}/system-lab`}>Open the UML lab <ArrowRight aria-hidden="true" /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
