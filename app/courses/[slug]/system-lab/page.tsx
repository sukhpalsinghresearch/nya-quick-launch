import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SystemDesignLab } from './system-design-lab';

export const metadata: Metadata = {
  title: 'Interactive System Design Lab | UCS503',
  description:
    'Learn use case, sequence, class, activity and swimlane diagrams through familiar applications.',
};

export default async function SystemLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ diagram?: string }>;
}) {
  const { slug } = await params;
  const { diagram } = await searchParams;
  const mode =
    diagram === 'sequence' ||
    diagram === 'class' ||
    diagram === 'activity' ||
    diagram === 'swimlane'
      ? diagram
      : 'use-case';
  if (slug !== 'ucs503-software-engineering') notFound();
  return (
    <SystemDesignLab
      key={mode}
      initialMode={mode}
      courseSlug={slug}
      thapar
    />
  );
}
