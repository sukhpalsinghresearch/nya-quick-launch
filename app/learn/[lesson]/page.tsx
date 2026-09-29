import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import { notFound } from 'next/navigation';

import { LessonInteraction } from '@/components/learning/ucs503-interactions';
import { ResourceDeck } from '@/components/learning/resource-deck';
import { lessonForId, moduleForLesson } from '@/lib/ucs503-curriculum';
import { lessonResources } from '@/lib/ucs503-resources';
import { SiteFooter, SiteHeader } from '@/app/site-chrome';

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const lesson = lessonForId((await params).lesson);
  if (!lesson) return {};
  return { title: `${lesson.title} | UCS503`, description: lesson.summary };
}

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const lesson = lessonForId((await params).lesson);
  if (!lesson) notFound();
  const courseModule = moduleForLesson(lesson.id);
  const diagramLinks = lesson.id === 'use-case-activity'
    ? [
        { label: 'Open use case studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=use-case' },
        { label: 'Open activity studio', href: '/courses/ucs503-software-engineering/system-lab?diagram=activity' },
      ]
    : lesson.id === 'case-studies'
      ? [
          { label: 'Inspect the use case', href: '/courses/ucs503-software-engineering/system-lab?diagram=use-case' },
          { label: 'Carry it into activity flow', href: '/courses/ucs503-software-engineering/system-lab?diagram=activity' },
        ]
      : lesson.diagramHref
        ? [{ label: `Open ${lesson.title}`, href: lesson.diagramHref }]
        : [];
  return <main className="lesson-page">
    <SiteHeader active="resources" />
    <section className="lesson-hero">
      <a href="/resources" className="lesson-back"><ArrowLeft aria-hidden="true" /> UCS503 course map</a>
      <p className="quick-kicker">{courseModule?.number} / {courseModule?.title.toUpperCase()} / {lesson.lecture}</p>
      <h1>{lesson.title}</h1>
      <p>{lesson.summary}</p>
    </section>
    <section className="lesson-question"><span>START WITH THIS QUESTION</span><h2>{lesson.question}</h2></section>
    <section className="lesson-knowledge-grid">
      <article><BookOpen aria-hidden="true" /><h2>What you should be able to do</h2><ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><Lightbulb aria-hidden="true" /><h2>Terms to use precisely</h2><div className="concept-tags">{lesson.concepts.map((item) => <span key={item}>{item}</span>)}</div></article>
      <article className="mistake-card"><h2>Common mistakes</h2><ul>{lesson.mistakes.map((item) => <li key={item}>{item}</li>)}</ul></article>
    </section>
    <LessonInteraction tool={lesson.tool} />
    {diagramLinks.length > 0 && <section className="diagram-launch"><div><span>INTERACTIVE UML LAB</span><h2>Take this idea into the diagram.</h2><p>The lab uses familiar systems so you can inspect every actor, relationship, message and ownership handoff.</p></div><div className="diagram-launch-links">{diagramLinks.map((item) => <a href={item.href} key={item.href}>{item.label} <ArrowRight aria-hidden="true" /></a>)}</div></section>}
    <ResourceDeck resources={lessonResources[lesson.id] ?? []} />
    <SiteFooter />
  </main>;
}
