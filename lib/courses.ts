export type CourseModule = {
  number: string;
  title: string;
  question: string;
  href: string;
  kind: 'diagram lab';
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  subject: 'Software Engineering';
  track: 'Thapar';
  instructor: string;
  summary: string;
  direction: string;
  outcomes: string[];
  modules: CourseModule[];
};

const modules: CourseModule[] = [
  {
    number: '01',
    title: 'Use Case Diagrams',
    kind: 'diagram lab',
    question: 'Who is outside the system, what do they want, and what crosses the boundary?',
    href: '/courses/ucs503-software-engineering/system-lab?diagram=use-case',
  },
  {
    number: '02',
    title: 'Sequence Diagrams',
    kind: 'diagram lab',
    question: 'How do the required participants communicate in one exact scenario?',
    href: '/courses/ucs503-software-engineering/system-lab?diagram=sequence',
  },
  {
    number: '03',
    title: 'Class Diagrams',
    kind: 'diagram lab',
    question: 'What stable classes and relationships support the selected scenario?',
    href: '/courses/ucs503-software-engineering/system-lab?diagram=class',
  },
  {
    number: '04',
    title: 'Activity Diagrams',
    kind: 'diagram lab',
    question: 'What actions, decisions, loops and parallel paths form the workflow?',
    href: '/courses/ucs503-software-engineering/system-lab?diagram=activity',
  },
  {
    number: '05',
    title: 'Swimlane Diagrams',
    kind: 'diagram lab',
    question: 'Who owns each activity, and where does responsibility change hands?',
    href: '/courses/ucs503-software-engineering/system-lab?diagram=swimlane',
  },
];

export const courses: Course[] = [
  {
    slug: 'ucs503-software-engineering',
    code: 'UCS503',
    title: 'Software Engineering',
    subject: 'Software Engineering',
    track: 'Thapar',
    instructor: 'Sukhpal Singh',
    summary: 'Carry one familiar system through five connected diagrams, and defend every element you draw.',
    direction: 'Use Case Diagram → Sequence Diagram → Class Diagram → Activity Diagram → Swimlane Diagram',
    outcomes: [
      'Fix the system boundary before drawing.',
      'Carry one scenario across several UML views.',
      'Explain why every actor, message, class, decision and lane exists.',
    ],
    modules,
  },
];

export function courseForSlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}
