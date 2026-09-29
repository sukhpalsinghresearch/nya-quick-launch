export type LearningResource = {
  title: string;
  url: string;
  publisher: string;
  format: 'quick video' | 'full lecture' | 'worked example' | 'course reference';
  useFor: string;
  verifiedBy: string;
};

const nptelCourse = (useFor: string): LearningResource => ({
  title: 'Software Engineering by Prof. Rajib Mall',
  url: 'https://www.youtube.com/playlist?list=PLbRMhDVUMngf8oZR3DpKMvYhZKga90JVt',
  publisher: 'NPTEL IIT Kharagpur',
  format: 'course reference',
  useFor,
  verifiedBy: 'NPTEL course listing and YouTube playlist',
});

const resource = (
  title: string,
  id: string,
  publisher: string,
  format: LearningResource['format'],
  useFor: string,
  verifiedBy: string,
): LearningResource => ({
  title,
  url: `https://www.youtube.com/watch?v=${id}`,
  publisher,
  format,
  useFor,
  verifiedBy,
});

export const lessonResources: Record<string, LearningResource[]> = {
  'software-engineering-introduction': [
    resource('Lecture 01: Introduction I', 'Ln_LP7c23WM', 'NPTEL IIT Kharagpur', 'full lecture', 'Understand why software engineering exists and how a product differs from a small program.', 'NPTEL course index'),
    nptelCourse('Use the playlist only when you need the complete university-level sequence.'),
  ],
  'software-engineering-basics': [
    resource('Lecture 01: Introduction I', 'Ln_LP7c23WM', 'NPTEL IIT Kharagpur', 'full lecture', 'Review scale, quality and disciplined development before moving into lifecycle models.', 'NPTEL course index'),
  ],
  'process-models': [
    resource('Lecture 06: Life Cycle Model', 'OT2O7uNldQk', 'NPTEL IIT Kharagpur', 'full lecture', 'Learn the purpose of a lifecycle model and the phases a model organizes.', 'NPTEL playlist and course page'),
    resource('Lecture 11: Evolutionary Model', 'XKW9TWrxxPo', 'NPTEL IIT Kharagpur', 'full lecture', 'Use this after the lab to separate evolutionary, incremental and risk-driven development.', 'NPTEL video listing'),
  ],
  'agile-model': [
    resource('What Is Scrum?', 'b02ZkndLk1Y', 'Atlassian', 'quick video', 'Get a short explanation of sprints, milestones and why change is expected.', 'Verified Atlassian channel'),
    resource('Lecture 12: Agile Model', 'x90kIAFGYKE', 'NPTEL IIT Kharagpur', 'full lecture', 'Use for the academic treatment of Agile in the course sequence.', 'NPTEL playlist index'),
  ],
  'user-stories': [
    resource('Writing good user stories in agile software development', 'MQzS30PtsiM', 'Atlassian', 'quick video', 'See how role, goal and benefit keep a story focused on user value.', 'Verified Atlassian channel'),
  ],
  'requirements-engineering': [
    resource('Lecture 15: Introduction to requirement specification', 'l9XFipXoJb0', 'NPTEL IIT Kharagpur', 'full lecture', 'Connect stakeholder needs to an organized and reviewable specification.', 'NPTEL course index'),
    resource('Lecture 17: Functional requirements', 'PR_ZwLfjWrA', 'NPTEL IIT Kharagpur', 'full lecture', 'Use for precise functional requirement statements and common errors.', 'NPTEL course index'),
  ],
  'requirements-gathering': [
    resource('Lecture 16: Requirement gathering and analysis', 'ul6nW1g3xK0', 'NPTEL IIT Kharagpur', 'full lecture', 'Review elicitation, analysis and anomalies found in gathered requirements.', 'NPTEL course index'),
  ],
  'requirement-modeling': [
    resource('UML Tutorial: Use Case, Activity, Class and Sequence Diagrams', 'RMuMz5hQMf4', 'Edward Kench', 'worked example', 'See one business case carried through several model views.', 'Public video metadata and UML teaching reference'),
    resource('Lecture 24: Basics of Data Flow Diagrams', 'e6HjDcd4U6U', 'NPTEL IIT Kharagpur', 'full lecture', 'Use when the model question is about data entering, changing and leaving.', 'NPTEL course index'),
  ],
  'use-case-activity': [
    resource('UML use case diagrams: Everything you need to know', '4emxjxonNRI', 'Lucid Software', 'quick video', 'Review actors, boundaries, associations, include and extend before opening the studio.', 'Verified Lucid Software channel and public video metadata'),
    resource('Lecture 31: Use Case Modelling', '7wo9PHfkyik', 'NPTEL IIT Kharagpur', 'full lecture', 'Review actor goals, the system boundary and use-case relationships.', 'NPTEL playlist index'),
    resource('UML activity diagram tutorial', 'F8nmfMsLaSI', 'Lucid Software', 'quick video', 'Review action flow, decisions, guards, forks, joins and swimlanes in a short worked tutorial.', 'Verified Lucid Software channel and public video metadata'),
  ],
  dfd: [
    resource('Lecture 24: Basics of Data Flow Diagrams', 'e6HjDcd4U6U', 'NPTEL IIT Kharagpur', 'full lecture', 'Learn entities, processes, stores, flows and functional decomposition.', 'NPTEL course index'),
    resource('Data Flow Diagram Level 0 and Level 1 Sample', 'hiMeEswjWuk', 'Christopher Kalodikis', 'worked example', 'Watch a context-level model decomposed into a lower-level DFD. Note the title correction stated by the author.', 'Public video metadata'),
  ],
  'class-diagrams': [
    resource('UML Class Diagram Tutorial', 'UI6lqHOVHic', 'Lucid Software', 'quick video', 'Review classes, attributes, methods and relationship notation before opening the studio.', 'Verified Lucid Software channel and public video metadata'),
    resource('Lecture 33: Overview of Class Diagram', 'z5bsXJ5lnpk', 'NPTEL IIT Kharagpur', 'full lecture', 'Start with classes, attributes, operations and relationships.', 'NPTEL playlist index'),
    resource('Aggregation, Composition and Dependency Relations', '9KokDbcr6cM', 'NPTEL IIT Kharagpur', 'full lecture', 'Use this when ownership and relationship notation are unclear.', 'NPTEL playlist index'),
  ],
  'case-studies': [
    resource('UML Tutorial: Use Case, Activity, Class and Sequence Diagrams', 'RMuMz5hQMf4', 'Edward Kench', 'worked example', 'Follow one case across several diagrams and check whether the scenario remains consistent.', 'Public video metadata and UML teaching reference'),
  ],
  'non-functional-requirements': [
    resource('Functional and Non-Functional Requirements: Understand the Difference in Software Development', 'V74qIKo-OqI', 'Canal TI', 'quick video', 'Separate system behaviour from measurable quality constraints using examples.', 'Verified YouTube channel and public video metadata'),
    resource('Lecture 15: Introduction to requirement specification', 'l9XFipXoJb0', 'NPTEL IIT Kharagpur', 'full lecture', 'Use the broader lecture when you need requirements specification context.', 'NPTEL course index'),
  ],
  'interaction-diagrams': [
    resource('UML Sequence Diagram Tutorial', 'pCK6prSq8aw', 'Lucid Software', 'quick video', 'Review lifelines, message order and common sequence notation before opening the studio.', 'Lucidchart tutorial reference and public video link'),
    resource('Development of Sequence Diagrams', 'RFosHwXYLg4', 'NPTEL IIT Kharagpur', 'full lecture', 'Build a sequence diagram from interaction responsibilities and message order.', 'NPTEL playlist index'),
    resource('UML Communication Diagrams', 'TL4ABTx_RtE', 'Derek Banas', 'quick video', 'Compare numbered messages and object links with the sequence view.', 'Tampere University UML resource list'),
  ],
  'state-diagrams': [
    resource('Lecture 39: State-Machine Diagram', 'RoQ__mLv1hM', 'NPTEL IIT Kharagpur', 'full lecture', 'Learn states, transitions, events and guards for one object lifecycle.', 'NPTEL playlist index'),
    resource('UML State Machine Diagrams', '_6TFVzBW7oo', 'Derek Banas', 'quick video', 'Use as a short notation refresher before the state exercise.', 'Tampere University UML resource list'),
  ],
  'component-deployment': [
    resource('UML Component Diagrams', 'KQUGFFN4M90', 'Derek Banas', 'quick video', 'Review components, provided interfaces and dependencies.', 'Tampere University UML resource list'),
    resource('UML Deployment Diagrams', 'nTtQwGoUUNc', 'Derek Banas', 'quick video', 'Review nodes, artifacts and deployment links.', 'Tampere University UML resource list'),
  ],
};

export const resourceAuditReferences = [
  {
    label: 'NPTEL Software Engineering course',
    url: 'https://nptel.ac.in/courses/106105182',
  },
  {
    label: 'Tampere University UML video list',
    url: 'https://plus.tuni.fi/comp.se.210/spring2024/lectures/uml/?hl=en',
  },
];
