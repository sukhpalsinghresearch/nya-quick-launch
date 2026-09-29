export type LessonKind =
  | 'reading'
  | 'interactive'
  | 'diagram';

export type Lesson = {
  id: string;
  lecture: string;
  title: string;
  kind: LessonKind;
  question: string;
  summary: string;
  objectives: string[];
  concepts: string[];
  mistakes: string[];
  tool?:
    | 'foundations'
    | 'process'
    | 'agile'
    | 'story'
    | 'requirements'
    | 'elicitation'
    | 'model-choice'
    | 'dfd'
    | 'nfr'
    | 'uml-interaction'
    | 'uml-state'
    | 'uml-architecture';
  diagramHref?: string;
};

export type CourseModule = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  examFocus: string;
  lessons: Lesson[];
};

const useCaseActivity: Lesson = {
  id: 'use-case-activity',
  lecture: 'L10',
  title: 'Use Case and Activity Diagrams',
  kind: 'diagram',
  question: 'What does a user want, and what workflow makes that goal happen?',
  summary: 'Use cases frame the goal outside the boundary. Activities show the work, choices and parallel paths inside the workflow.',
  objectives: [
    'Separate actors from the system boundary.',
    'Use include only for required reusable behaviour.',
    'Use extend only for optional or conditional behaviour.',
    'Turn one use case into a defensible activity flow.',
  ],
  concepts: ['actor', 'system boundary', 'association', 'include', 'extend', 'guard', 'fork', 'join'],
  mistakes: [
    'Calling every outside entity a primary actor.',
    'Drawing login as an include relationship for every use case.',
    'Using an activity diagram as a list of screens.',
  ],
  diagramHref: '/courses/ucs503-software-engineering/system-lab?diagram=use-case',
};

const classDiagram: Lesson = {
  id: 'class-diagrams',
  lecture: 'L12',
  title: 'Class Diagrams',
  kind: 'diagram',
  question: 'What stable objects and relationships support the selected scenario?',
  summary: 'A class diagram describes static structure. It does not replay the order of messages or copy database tables blindly.',
  objectives: [
    'Choose classes from responsibilities, not nouns alone.',
    'Distinguish association, aggregation, composition and inheritance.',
    'Use multiplicity to state a real constraint.',
  ],
  concepts: ['class', 'attribute', 'operation', 'association', 'multiplicity', 'composition', 'inheritance'],
  mistakes: [
    'Adding every UI field as an attribute.',
    'Using composition when objects can exist independently.',
    'Leaving multiplicities out when they affect the design.',
  ],
  diagramHref: '/courses/ucs503-software-engineering/system-lab?diagram=class',
};

export const ucs503Modules: CourseModule[] = [
  {
    id: 'process-agile',
    number: '01',
    title: 'Process Models and Agile Software Development',
    subtitle: 'Choose a way of working before you begin drawing the system.',
    examFocus: 'Compare models through requirement change, risk, feedback and delivery constraints.',
    lessons: [
      {
        id: 'software-engineering-introduction',
        lecture: 'L01',
        title: 'Introduction to Software Engineering',
        kind: 'reading',
        question: 'Why is engineering software different from simply writing code?',
        summary: 'Software engineering adds a repeatable way to understand needs, make trade-offs, test outcomes and maintain what is built.',
        objectives: ['Separate product work from one-off coding.', 'Identify stakeholders, constraints and evidence of quality.'],
        concepts: ['software process', 'stakeholder', 'quality', 'maintenance', 'constraint'],
        mistakes: ['Treating a process as paperwork rather than a way to reduce uncertainty.'],
        tool: 'foundations',
      },
      {
        id: 'software-engineering-basics',
        lecture: 'L02',
        title: 'Software Engineering Basics',
        kind: 'reading',
        question: 'What has to be true before a software solution can be trusted?',
        summary: 'A useful system has a purpose, defined users, observable behaviour and constraints that can be checked.',
        objectives: ['State scope, assumptions and quality criteria.', 'Separate a feature from the requirement it serves.'],
        concepts: ['scope', 'assumption', 'verification', 'validation', 'quality attribute'],
        mistakes: ['Calling a technology choice a requirement without a reason.'],
        tool: 'foundations',
      },
      {
        id: 'process-models',
        lecture: 'L03',
        title: 'Software Process Models',
        kind: 'interactive',
        question: 'Which process model fits the uncertainty in this project?',
        summary: 'A process model is a trade-off between planning, feedback, risk and cost of change.',
        objectives: ['Compare Waterfall, Incremental, Iterative, Prototyping, Spiral and V-model.', 'Defend a model through project conditions.'],
        concepts: ['Waterfall', 'Incremental', 'Iterative', 'Prototyping', 'Spiral', 'V-model'],
        mistakes: ['Calling Agile the right answer for every project.', 'Choosing a model by memorized definition instead of project evidence.'],
        tool: 'process',
      },
      {
        id: 'agile-model',
        lecture: 'L04',
        title: 'Agile Model',
        kind: 'interactive',
        question: 'How does a team turn a backlog into a small, reviewable increment?',
        summary: 'Agile reduces uncertainty through short cycles, feedback and visible priorities. It is not an absence of planning.',
        objectives: ['Plan a sprint within capacity.', 'Explain the effect of a change request.', 'Separate backlog priority from urgency alone.'],
        concepts: ['backlog', 'sprint', 'increment', 'review', 'retrospective', 'capacity'],
        mistakes: ['Adding work to a sprint without changing capacity.', 'Treating a sprint backlog as a permanent requirements document.'],
        tool: 'agile',
      },
      {
        id: 'user-stories',
        lecture: 'L05',
        title: 'User Stories and Cards',
        kind: 'interactive',
        question: 'Can a short story state a user goal without becoming vague?',
        summary: 'A story makes the user, goal and outcome visible. Acceptance criteria tell the team how to know it is done.',
        objectives: ['Write role, goal and benefit.', 'Add testable acceptance criteria.', 'Check a story against INVEST.'],
        concepts: ['role', 'goal', 'benefit', 'acceptance criteria', 'INVEST'],
        mistakes: ['Writing a technical task as a user story.', 'Using “works properly” as acceptance criteria.'],
        tool: 'story',
      },
    ],
  },
  {
    id: 'requirements',
    number: '02',
    title: 'Requirement Engineering and Analysis Modeling',
    subtitle: 'Find the actual problem before choosing notation or technology.',
    examFocus: 'Classify requirements, make them testable and trace them into models.',
    lessons: [
      {
        id: 'requirements-engineering',
        lecture: 'L07',
        title: 'Requirement Engineering',
        kind: 'interactive',
        question: 'How do needs become requirements that can be checked?',
        summary: 'Requirements engineering discovers, negotiates, specifies, validates and manages change in what the system must achieve.',
        objectives: ['Distinguish stakeholder need, requirement and design decision.', 'Identify ambiguity and missing acceptance evidence.'],
        concepts: ['elicitation', 'analysis', 'specification', 'validation', 'change management'],
        mistakes: ['Treating the first request as the final requirement.', 'Ignoring conflicting stakeholder goals.'],
        tool: 'requirements',
      },
      {
        id: 'requirements-gathering',
        lecture: 'L08',
        title: 'Requirement Gathering',
        kind: 'interactive',
        question: 'Which elicitation technique exposes the information you do not yet know?',
        summary: 'Interviews, observation, workshops, questionnaires and document study answer different questions. A good process combines them.',
        objectives: ['Match an elicitation technique to a situation.', 'Write questions that reveal rules, exceptions and constraints.'],
        concepts: ['interview', 'observation', 'workshop', 'questionnaire', 'document analysis'],
        mistakes: ['Only asking users what screen they want.', 'Skipping exceptions and failure cases.'],
        tool: 'elicitation',
      },
      {
        id: 'requirement-modeling',
        lecture: 'L09',
        title: 'Requirement Modeling',
        kind: 'interactive',
        question: 'Which view makes the requirement easier to discuss?',
        summary: 'Models make scope, behaviour, data movement and responsibility explicit before implementation.',
        objectives: ['Choose a model based on the question being asked.', 'Trace a statement into a use case, DFD or workflow.'],
        concepts: ['context', 'behaviour', 'data flow', 'structure', 'traceability'],
        mistakes: ['Using one diagram to answer every question.'],
        tool: 'model-choice',
      },
      useCaseActivity,
      {
        id: 'dfd',
        lecture: 'L11',
        title: 'Data Flow Diagrams: Level 0 and Level 1',
        kind: 'interactive',
        question: 'What data enters, changes, is stored and leaves the system?',
        summary: 'A DFD follows data, not control flow. Level 1 must preserve the external inputs and outputs of the process it decomposes.',
        objectives: ['Identify entities, processes, stores and flows.', 'Check balancing between levels.', 'Avoid illegal direct flows.'],
        concepts: ['external entity', 'process', 'data store', 'data flow', 'balancing'],
        mistakes: ['Drawing UI buttons or database commands as data flows.', 'Connecting an external entity directly to a data store.'],
        tool: 'dfd',
      },
      classDiagram,
      {
        id: 'case-studies',
        lecture: 'L13',
        title: 'Case Studies: Use Case and Activity Diagram',
        kind: 'diagram',
        question: 'Can one scenario remain consistent when the view changes?',
        summary: 'A case study exposes weak assumptions. The same actor goal should be recognizable in both the use case and activity diagram.',
        objectives: ['Carry one scenario across two diagrams.', 'Identify what belongs to each notation.'],
        concepts: ['scenario', 'precondition', 'postcondition', 'alternate flow'],
        mistakes: ['Changing the scenario midway without stating an assumption.'],
        diagramHref: '/courses/ucs503-software-engineering/system-lab?diagram=activity',
      },
      {
        id: 'non-functional-requirements',
        lecture: 'L14',
        title: 'Non-Functional Requirements',
        kind: 'interactive',
        question: 'How do you make a quality expectation measurable?',
        summary: 'Non-functional requirements constrain how well the system must work. They need a measure, target and condition.',
        objectives: ['Classify common quality attributes.', 'Rewrite vague statements into testable requirements.', 'Explain trade-offs between qualities.'],
        concepts: ['performance', 'availability', 'security', 'usability', 'reliability', 'scalability'],
        mistakes: ['Writing “fast”, “secure” or “user friendly” without a measure.'],
        tool: 'nfr',
      },
    ],
  },
  {
    id: 'uml',
    number: '03',
    title: 'UML Modeling',
    subtitle: 'Choose the diagram that answers the question in front of you.',
    examFocus: 'Explain why one diagram is appropriate and identify what it must not contain.',
    lessons: [
      useCaseActivity,
      classDiagram,
      {
        id: 'interaction-diagrams',
        lecture: 'L15',
        title: 'Sequence and Collaboration Diagrams',
        kind: 'interactive',
        question: 'Do you need time order or object links to explain the interaction?',
        summary: 'Sequence diagrams emphasize time. Collaboration diagrams, also called communication diagrams, emphasize linked objects and numbered messages.',
        objectives: ['Model one scenario in both views.', 'Explain the message order and participating objects.'],
        concepts: ['lifeline', 'message', 'activation', 'link', 'message numbering'],
        mistakes: ['Drawing a collaboration diagram as a compressed sequence diagram.'],
        tool: 'uml-interaction',
        diagramHref: '/courses/ucs503-software-engineering/system-lab?diagram=sequence',
      },
      {
        id: 'state-diagrams',
        lecture: 'L15',
        title: 'State Diagrams',
        kind: 'interactive',
        question: 'How does one object change over time when events happen?',
        summary: 'A state diagram follows the life of one object, not the complete workflow of several actors.',
        objectives: ['Separate state from action.', 'Use event, guard and transition correctly.'],
        concepts: ['state', 'event', 'transition', 'guard', 'entry action'],
        mistakes: ['Putting every system action into a state machine.'],
        tool: 'uml-state',
      },
      {
        id: 'component-deployment',
        lecture: 'L15',
        title: 'Component and Deployment Diagrams',
        kind: 'interactive',
        question: 'What is the software split, and where does each part run?',
        summary: 'Components show software responsibilities and interfaces. Deployment shows physical or virtual nodes and the artifacts placed on them.',
        objectives: ['Separate component dependency from class relationship.', 'Place artifacts on realistic nodes.', 'Identify a single point of failure.'],
        concepts: ['component', 'interface', 'dependency', 'node', 'artifact', 'execution environment'],
        mistakes: ['Using deployment nodes as classes.', 'Calling a database table a component.'],
        tool: 'uml-architecture',
      },
    ],
  },
];

export const canonicalLessons = Array.from(
  new Map(ucs503Modules.flatMap((module) => module.lessons).map((lesson) => [lesson.id, lesson])).values(),
);

export function lessonForId(id: string) {
  return canonicalLessons.find((lesson) => lesson.id === id);
}

export function moduleForLesson(id: string) {
  return ucs503Modules.find((module) => module.lessons.some((lesson) => lesson.id === id));
}
