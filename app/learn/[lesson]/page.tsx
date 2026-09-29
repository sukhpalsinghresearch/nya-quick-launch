import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LessonInteraction } from '@/components/learning/ucs503-interactions';
import { lessonForId, moduleForLesson } from '@/lib/ucs503-curriculum';
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
  return <main className="lesson-page">
    <SiteHeader active="resources" />
    <section className="lesson-hero">
      <Link href="/resources" className="lesson-back"><ArrowLeft aria-hidden="true" /> UCS503 course map</Link>
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
    {lesson.diagramHref && <section className="diagram-launch"><div><span>INTERACTIVE UML LAB</span><h2>Take this idea into the diagram.</h2><p>The lab uses familiar systems so you can inspect every actor, relationship, message and ownership handoff.</p></div><Link href={lesson.diagramHref}>Open {lesson.title} <ArrowRight aria-hidden="true" /></Link></section>}
    <section className="source-placeholder"><div><span>VIDEOS AND SOURCES</span><h2>Verified links are being added with the finalized class notes.</h2><p>Each lesson will have one short explanation, one deeper source and a clear reason to use each.</p></div><span><ExternalLink aria-hidden="true" /> No generic playlist</span></section>
    <SiteFooter />
  </main>;
}
