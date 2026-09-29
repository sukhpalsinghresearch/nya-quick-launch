'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, Check, CircleAlert, X } from 'lucide-react';

type Tool = 'foundations' | 'process' | 'agile' | 'story' | 'requirements' | 'elicitation' | 'model-choice' | 'dfd' | 'nfr' | 'uml-interaction' | 'uml-state' | 'uml-architecture';

export function LessonInteraction({ tool }: { tool?: Tool }) {
  if (!tool) return null;
  const labs: Record<Tool, ReactNode> = {
    foundations: <FoundationsLab />,
    process: <ProcessModelLab />,
    agile: <AgileSprintLab />,
    story: <UserStoryLab />,
    requirements: <RequirementsLab />,
    elicitation: <ElicitationLab />,
    'model-choice': <ModelChoiceLab />,
    dfd: <DfdLab />,
    nfr: <NfrLab />,
    'uml-interaction': <UmlBridgeLab initialView="interaction" />,
    'uml-state': <UmlBridgeLab initialView="state" />,
    'uml-architecture': <UmlBridgeLab initialView="architecture" />,
  };
  return <section className="lesson-lab">{labs[tool]}</section>;
}

function LabHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <header className="lesson-lab-header"><span>{eyebrow}</span><h2>{title}</h2><p>{copy}</p></header>;
}

const foundationChecks = [
  {
    prompt: 'A lecturer asks for an attendance app. What should happen first?',
    options: ['Choose React', 'Clarify users, rules and evidence of success', 'Create the database'],
    answer: 1,
    reason: 'Engineering begins by understanding the problem, stakeholders and constraints. Technology follows that decision.',
  },
  {
    prompt: 'The team proves that the code matches the written specification. What is this?',
    options: ['Validation', 'Verification', 'Maintenance'],
    answer: 1,
    reason: 'Verification asks whether the product was built according to its specification. Validation asks whether the right product was built.',
  },
  {
    prompt: 'Students can submit attendance, but the workflow does not match how classes operate. What failed?',
    options: ['Validation', 'Compilation', 'Version control'],
    answer: 0,
    reason: 'The software may run correctly and still solve the wrong operational problem. That is a validation failure.',
  },
];

function FoundationsLab() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const item = foundationChecks[index];
  return <>
    <LabHeader eyebrow="ENGINEERING CHECK" title="Decide before you code." copy="Use a small case to separate requirements, design choices, verification and validation." />
    <article className="requirement-card"><span>CASE {index + 1} / {foundationChecks.length}</span><h3>{item.prompt}</h3><div className="choice-row stacked-choices">{item.options.map((option, optionIndex) => <button type="button" className={choice === optionIndex ? 'selected' : ''} disabled={choice !== null} key={option} onClick={() => setChoice(optionIndex)}>{option}</button>)}</div><p aria-live="polite">{choice === null ? 'Choose the action or concept that best fits.' : `${choice === item.answer ? 'Correct.' : 'Not quite.'} ${item.reason}`}</p><footer><strong>{choice === null ? 'Reason from the situation' : choice === item.answer ? 'Decision defended' : 'Read the distinction once more'}</strong><button type="button" disabled={choice === null} onClick={() => { setIndex((index + 1) % foundationChecks.length); setChoice(null); }}>Next case <ArrowRight aria-hidden="true" /></button></footer></article>
  </>;
}

function ProcessModelLab() {
  const [stability, setStability] = useState('changing');
  const [risk, setRisk] = useState('medium');
  const [feedback, setFeedback] = useState('frequent');
  const [assurance, setAssurance] = useState('normal');
  const result = useMemo(() => {
    if (risk === 'high') return { model: 'Spiral', reason: 'The project has material risk, so each cycle should identify and reduce risk before committing further.' };
    if (assurance === 'high' && stability === 'stable') return { model: 'V-model', reason: 'Stable, safety or compliance-heavy work benefits from planned verification alongside each specification level.' };
    if (stability === 'stable' && feedback === 'limited') return { model: 'Waterfall', reason: 'The requirements are stable and external feedback is limited, so planned phase handoffs are defensible.' };
    if (stability === 'changing' && feedback === 'frequent') return { model: 'Agile / Iterative', reason: 'Frequent feedback and changing requirements favor short increments that can be reviewed and changed.' };
    return { model: 'Incremental / Prototyping', reason: 'Deliver a thin, useful slice early, learn from it, then expand the system without pretending uncertainty is gone.' };
  }, [assurance, feedback, risk, stability]);
  const paths: Record<string, string[]> = {
    'Waterfall': ['Requirements', 'System design', 'Implementation', 'Testing', 'Deployment'],
    'V-model': ['Specify', 'Plan matching tests', 'Implement', 'Run unit to acceptance tests', 'Release'],
    'Spiral': ['Set objectives', 'Analyze risks', 'Engineer a solution', 'Review with stakeholders', 'Plan the next loop'],
    'Agile / Iterative': ['Order backlog', 'Plan a short cycle', 'Build and test', 'Review the increment', 'Adapt'],
    'Incremental / Prototyping': ['Choose a thin slice', 'Prototype or design it', 'Build and validate', 'Integrate', 'Choose the next slice'],
  };

  return <>
    <LabHeader eyebrow="PROCESS MODEL DECISION" title="Choose the model from the project, not the definition." copy="Change the project conditions. The recommendation should change because the trade-off changes." />
    <div className="lab-grid model-controls">
      <label>Requirement stability<select value={stability} onChange={(event) => setStability(event.target.value)}><option value="stable">Mostly stable</option><option value="changing">Likely to change</option></select></label>
      <label>Project risk<select value={risk} onChange={(event) => setRisk(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High or unknown</option></select></label>
      <label>Feedback access<select value={feedback} onChange={(event) => setFeedback(event.target.value)}><option value="limited">Limited</option><option value="frequent">Frequent</option></select></label>
      <label>Assurance need<select value={assurance} onChange={(event) => setAssurance(event.target.value)}><option value="normal">Normal</option><option value="high">Safety, regulation or strict verification</option></select></label>
    </div>
    <div className="lab-result"><span>BEST FIT</span><h3>{result.model}</h3><p>{result.reason}</p></div>
    <div className="process-path" aria-label={`${result.model} working flow`}>{paths[result.model].map((step, index) => <div key={step}><small>{String(index + 1).padStart(2, '0')}</small><strong>{step}</strong>{index < paths[result.model].length - 1 && <ArrowRight aria-hidden="true" />}</div>)}</div>
    <p className="lab-rule"><CircleAlert aria-hidden="true" /> This is a reasoned starting point, not an automatic answer. Defend it with the four conditions above.</p>
  </>;
}

const backlog = [
  { id: 'login', title: 'Member can sign in', points: 3, value: 'Unblocks protected work.' },
  { id: 'profile', title: 'Member edits profile', points: 3, value: 'Useful after sign in.' },
  { id: 'search', title: 'Search people by skill', points: 5, value: 'Useful, but depends on profiles.' },
  { id: 'theme', title: 'Dark theme', points: 2, value: 'Nice to have, not the first increment.' },
  { id: 'audit', title: 'Audit log', points: 5, value: 'Important if verification rules are live.' },
];

function AgileSprintLab() {
  const [selected, setSelected] = useState<string[]>(['login', 'profile']);
  const [change, setChange] = useState(false);
  const capacity = 8;
  const total = backlog.filter((item) => selected.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <>
    <LabHeader eyebrow="AGILE SPRINT PLANNER" title="A sprint is a commitment within capacity." copy="Choose work for one team with eight story points. Then introduce a change request." />
    <div className="sprint-layout">
      <div className="sprint-backlog">
        {backlog.map((item) => <label className={selected.includes(item.id) ? 'sprint-item selected' : 'sprint-item'} key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span><strong>{item.title}</strong><small>{item.value}</small></span><b>{item.points} pts</b></label>)}
      </div>
      <aside className="sprint-summary"><span>SPRINT CAPACITY</span><strong className={total > capacity ? 'over-capacity' : ''}>{total} / {capacity} pts</strong><p>{total > capacity ? 'Too much work. Remove or split an item before the sprint begins.' : 'Capacity is respected. Check dependencies before calling the plan ready.'}</p><button type="button" onClick={() => setChange((value) => !value)}>{change ? 'Remove change request' : 'Add urgent change request'}</button>{change && <article><strong>Change request: audit log</strong><p>Do not silently add it. Re-negotiate the sprint, reduce scope or move it to the next increment.</p></article>}</aside>
    </div>
  </>;
}

function UserStoryLab() {
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [benefit, setBenefit] = useState('');
  const [criteria, setCriteria] = useState('');
  const checks = [
    { label: 'A specific user or role is named', pass: role.trim().length >= 3 },
    { label: 'The goal describes an outcome, not an implementation task', pass: goal.trim().length >= 8 && !/api|database|button|endpoint/i.test(goal) },
    { label: 'The benefit explains why the goal matters', pass: benefit.trim().length >= 8 },
    { label: 'Acceptance criteria can be checked', pass: criteria.trim().length >= 12 && /when|then|must|within|show|allow/i.test(criteria) },
  ];
  return <>
    <LabHeader eyebrow="USER STORY BUILDER" title="Write a user goal that a team can test." copy="A story is a promise to have a conversation. Acceptance criteria make the result checkable." />
    <div className="story-builder"><label>As a<input value={role} onChange={(event) => setRole(event.target.value)} placeholder="student preparing for UCS503" /></label><label>I want to<input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="compare two diagram types" /></label><label>So that<input value={benefit} onChange={(event) => setBenefit(event.target.value)} placeholder="I can choose the right one in an exam" /></label><label>Acceptance criteria<textarea value={criteria} onChange={(event) => setCriteria(event.target.value)} placeholder="When I choose a scenario, the system must show the correct diagram and its purpose." /></label></div>
    <div className="story-preview"><span>YOUR STORY</span><p>As a <strong>{role || '…'}</strong>, I want to <strong>{goal || '…'}</strong>, so that <strong>{benefit || '…'}</strong>.</p></div>
    <div className="checklist">{checks.map((item) => <p className={item.pass ? 'pass' : ''} key={item.label}>{item.pass ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}{item.label}</p>)}</div>
  </>;
}

const requirementQuestions = [
  { text: 'The system shall let a student download a generated UML revision sheet.', answer: 'functional', reason: 'It describes observable system behaviour.' },
  { text: 'The generated revision sheet must download within 3 seconds for 95% of requests.', answer: 'non-functional', reason: 'It constrains performance with a measurable target.' },
  { text: 'The system must use the university single sign-on service.', answer: 'constraint', reason: 'It constrains the solution rather than describing user-visible behaviour.' },
];

function RequirementsLab() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('Choose the most accurate classification.');
  const item = requirementQuestions[index];
  const select = (choice: string) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choice);
    const correct = choice === item.answer;
    if (correct) setScore((value) => value + 1);
    setFeedback(`${correct ? 'Correct.' : 'Not quite.'} ${item.reason}`);
  };
  const next = () => { setIndex((value) => (value + 1) % requirementQuestions.length); setSelectedChoice(null); setFeedback('Choose the most accurate classification.'); };
  return <>
    <LabHeader eyebrow="REQUIREMENT CHECK" title="Classify the statement before you model it." copy="A stakeholder need, a functional requirement, a quality target and a technical constraint are different things." />
    <article className="requirement-card"><span>STATEMENT {index + 1} / {requirementQuestions.length}</span><h3>{item.text}</h3><div className="choice-row">{['functional', 'non-functional', 'constraint'].map((choice) => <button type="button" className={selectedChoice === choice ? 'selected' : ''} disabled={selectedChoice !== null} key={choice} onClick={() => select(choice)}>{choice}</button>)}</div><p aria-live="polite">{feedback}</p><footer><strong>Score: {score}</strong><button type="button" disabled={selectedChoice === null} onClick={next}>Next statement <ArrowRight aria-hidden="true" /></button></footer></article>
    <p className="lab-rule"><CircleAlert aria-hidden="true" /> Ask two questions: what must the system do, and how well or under what restriction must it do it?</p>
  </>;
}

const elicitationCases = [
  { situation: 'Nurses perform a fast handover that they find difficult to explain step by step.', technique: 'Observation followed by interview', reason: 'Observation reveals tacit work. The interview then checks why exceptions and shortcuts occur.', question: 'What changes when the ward is understaffed?' },
  { situation: 'Finance and operations disagree about who may approve a refund.', technique: 'Facilitated workshop', reason: 'The conflict must be made visible and negotiated with both decision makers in the room.', question: 'Which amount or risk level changes the approval owner?' },
  { situation: 'You need comparable feedback from 2,000 existing users.', technique: 'Questionnaire, then targeted interviews', reason: 'A questionnaire gives coverage. Interviews explain important or surprising patterns.', question: 'Which result would make us contact you for a follow-up?' },
  { situation: 'A replacement system must preserve legal rules embedded in current forms.', technique: 'Document analysis plus domain interview', reason: 'Documents expose formal rules, while an expert identifies rules that are obsolete or interpreted differently.', question: 'Which fields are legally required, and which are only historical?' },
];

function ElicitationLab() {
  const [index, setIndex] = useState(0);
  const item = elicitationCases[index];
  return <>
    <LabHeader eyebrow="ELICITATION PLANNER" title="Choose a technique for the missing knowledge." copy="No single gathering method is always correct. Match it to access, scale, tacit work and stakeholder conflict." />
    <div className="elicitation-lab"><article><span>SITUATION</span><h3>{item.situation}</h3><div className="choice-row stacked-choices">{elicitationCases.map((candidate, candidateIndex) => <button type="button" className={index === candidateIndex ? 'selected' : ''} key={candidate.situation} onClick={() => setIndex(candidateIndex)}>Case {candidateIndex + 1}</button>)}</div></article><article className="lab-result"><span>BEST STARTING METHOD</span><h3>{item.technique}</h3><p>{item.reason}</p><strong>Ask next: {item.question}</strong></article></div>
  </>;
}

const modelQuestions = [
  { question: 'Who wants what from the system, and what sits outside its boundary?', answer: 'Use case', why: 'Use case diagrams organize actor goals and system scope.' },
  { question: 'What work, decisions and parallel paths complete one workflow?', answer: 'Activity', why: 'Activity diagrams focus on control flow through a process.' },
  { question: 'What information moves between entities, processes and stores?', answer: 'DFD', why: 'A data flow diagram follows data transformation and storage.' },
  { question: 'Which objects, attributes and stable relationships form the domain?', answer: 'Class', why: 'Class diagrams describe static structure and responsibility.' },
  { question: 'In what order do participants exchange messages for one scenario?', answer: 'Sequence', why: 'Sequence diagrams put message order and lifelines at the center.' },
  { question: 'How does one object react to events during its lifetime?', answer: 'State', why: 'State diagrams follow the changing condition of one object.' },
];

function ModelChoiceLab() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const item = modelQuestions[index];
  const options = ['Use case', 'Activity', 'DFD', 'Class', 'Sequence', 'State'];
  return <>
    <LabHeader eyebrow="MODEL SELECTOR" title="Start with the question, then choose the notation." copy="A diagram is useful only when its notation answers the question being discussed." />
    <article className="requirement-card"><span>QUESTION {index + 1} / {modelQuestions.length}</span><h3>{item.question}</h3><div className="choice-row model-choice-grid">{options.map((option) => <button type="button" className={choice === option ? 'selected' : ''} disabled={choice !== null} key={option} onClick={() => setChoice(option)}>{option}</button>)}</div><p aria-live="polite">{choice === null ? 'Choose one model.' : `${choice === item.answer ? 'Correct.' : `Use ${item.answer}.`} ${item.why}`}</p><footer><strong>{choice === null ? 'One question, one strongest view' : `Answer: ${item.answer}`}</strong><button type="button" disabled={choice === null} onClick={() => { setIndex((index + 1) % modelQuestions.length); setChoice(null); }}>Next question <ArrowRight aria-hidden="true" /></button></footer></article>
  </>;
}

type DfdNode = 'student' | 'revision-process' | 'diagram-store' | 'pdf-service';
const dfdNodes: Array<{ id: DfdNode; label: string; type: 'entity' | 'process' | 'store' }> = [
  { id: 'student', label: 'Student', type: 'entity' },
  { id: 'revision-process', label: 'Generate revision sheet', type: 'process' },
  { id: 'diagram-store', label: 'Diagram content store', type: 'store' },
  { id: 'pdf-service', label: 'PDF service', type: 'entity' },
];

function DfdLab() {
  const [source, setSource] = useState<DfdNode>('student');
  const [target, setTarget] = useState<DfdNode>('revision-process');
  const [label, setLabel] = useState('diagram choice');
  const [flows, setFlows] = useState<Array<{ source: DfdNode; target: DfdNode; label: string }>>([]);
  const sourceNode = dfdNodes.find((node) => node.id === source)!;
  const targetNode = dfdNodes.find((node) => node.id === target)!;
  const illegal = source === target || (sourceNode.type === 'entity' && targetNode.type === 'store') || (sourceNode.type === 'store' && targetNode.type === 'entity') || (sourceNode.type === 'store' && targetNode.type === 'store');
  const required = [['student', 'revision-process'], ['revision-process', 'student'], ['revision-process', 'diagram-store']];
  const balanced = required.every(([from, to]) => flows.some((flow) => flow.source === from && flow.target === to));
  const addFlow = () => { if (!illegal && label.trim()) setFlows((current) => [...current, { source, target, label: label.trim() }]); };
  return <>
    <LabHeader eyebrow="DFD FLOW BUILDER" title="Follow data, not screens or clicks." copy="Connect the entities, process and store. The lab blocks invalid direct flows." />
    <div className="dfd-builder"><div className="dfd-nodes">{dfdNodes.map((node) => <article className={`dfd-node ${node.type}`} key={node.id}><small>{node.type}</small><strong>{node.label}</strong></article>)}</div><div className="dfd-controls"><label>From<select value={source} onChange={(event) => setSource(event.target.value as DfdNode)}>{dfdNodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label><label>To<select value={target} onChange={(event) => setTarget(event.target.value as DfdNode)}>{dfdNodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label><label>Data label<input value={label} onChange={(event) => setLabel(event.target.value)} /></label><button type="button" disabled={illegal || !label.trim()} onClick={addFlow}>Add data flow</button>{illegal && <p className="invalid-flow">That direct flow is not valid in a DFD. Route it through a process.</p>}</div></div>
    <div className="dfd-flow-list"><span>DRAWN FLOWS</span>{flows.length === 0 ? <p>Add a flow to begin.</p> : flows.map((flow, index) => <p key={`${flow.source}-${flow.target}-${index}`}><strong>{dfdNodes.find((node) => node.id === flow.source)?.label}</strong><ArrowRight aria-hidden="true" /><strong>{dfdNodes.find((node) => node.id === flow.target)?.label}</strong><small>{flow.label}</small></p>)}</div>
    <p className={balanced ? 'lab-rule balanced' : 'lab-rule'}>{balanced ? <Check aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}{balanced ? 'Core Level 0 flows are visible. Decompose the process at Level 1 without losing these external inputs and outputs.' : 'For the Level 0 check, show student input, student output and the process reading diagram content.'}</p>
  </>;
}

function NfrLab() {
  const [quality, setQuality] = useState('Performance');
  const [metric, setMetric] = useState('response time');
  const [target, setTarget] = useState('3 seconds');
  const [condition, setCondition] = useState('for 95% of requests during peak revision week');
  const valid = target.trim().length > 0 && /\d/.test(target) && condition.trim().length > 10;
  return <>
    <LabHeader eyebrow="NFR MEASUREMENT LAB" title="Turn “good” into something testable." copy="A quality requirement needs an attribute, a measure, a target and the condition under which it matters." />
    <div className="nfr-builder"><label>Quality attribute<select value={quality} onChange={(event) => setQuality(event.target.value)}>{['Performance', 'Availability', 'Security', 'Usability', 'Reliability', 'Scalability'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Measure<input value={metric} onChange={(event) => setMetric(event.target.value)} /></label><label>Target<input value={target} onChange={(event) => setTarget(event.target.value)} /></label><label>Condition<textarea value={condition} onChange={(event) => setCondition(event.target.value)} /></label></div>
    <div className={valid ? 'nfr-preview valid' : 'nfr-preview'}><span>{valid ? 'TESTABLE REQUIREMENT' : 'NEEDS A MEASURABLE TARGET'}</span><p>The system shall meet <strong>{quality.toLowerCase()}</strong> by keeping <strong>{metric || '…'}</strong> at <strong>{target || '…'}</strong> <strong>{condition || '…'}</strong>.</p></div>
  </>;
}

function UmlBridgeLab({ initialView }: { initialView: 'interaction' | 'state' | 'architecture' }) {
  const [view, setView] = useState<'interaction' | 'state' | 'architecture'>(initialView);
  const [state, setState] = useState('Draft');
  const [activeComponent, setActiveComponent] = useState('Web client');
  const transitions: Record<string, string> = { Draft: 'submit', Submitted: 'approve', Approved: 'publish', Published: 'archive', Archived: 'restore' };
  const nextStates: Record<string, string> = { Draft: 'Submitted', Submitted: 'Approved', Approved: 'Published', Published: 'Archived', Archived: 'Draft' };
  const components = ['Web client', 'UML learning service', 'Diagram content store', 'PDF renderer'];
  return <>
    <LabHeader eyebrow="UML VIEW SWITCHER" title="The same system needs different views." copy="Switch the question first. Then choose the diagram whose notation answers it." />
    <div className="uml-tabs"><button className={view === 'interaction' ? 'active' : ''} type="button" onClick={() => setView('interaction')}>Sequence / collaboration</button><button className={view === 'state' ? 'active' : ''} type="button" onClick={() => setView('state')}>State</button><button className={view === 'architecture' ? 'active' : ''} type="button" onClick={() => setView('architecture')}>Component / deployment</button></div>
    {view === 'interaction' && <div className="interaction-compare"><article><span>SEQUENCE</span><h3>Time is the main question.</h3><ol><li>Student → Web client: choose diagram</li><li>Web client → Learning service: request content</li><li>Learning service → Content store: retrieve lesson</li><li>Learning service → Web client: render lesson</li></ol></article><article><span>COLLABORATION</span><h3>Object links are the main question.</h3><p>Student ↔ Web client ↔ Learning service ↔ Content store</p><ol><li>1: chooseDiagram()</li><li>1.1: requestContent()</li><li>1.1.1: retrieveLesson()</li><li>1.2: renderLesson()</li></ol></article></div>}
    {view === 'state' && <div className="state-machine"><span>DIAGRAM REVISION SHEET</span><div className="state-track">{Object.keys(transitions).map((item) => <button className={state === item ? 'active' : ''} type="button" key={item} onClick={() => setState(item)}>{item}</button>)}</div><article><strong>Current state: {state}</strong><p>Event: <code>{transitions[state]}</code> → next state: <code>{nextStates[state]}</code></p><button type="button" onClick={() => setState(nextStates[state])}>Trigger event <ArrowRight aria-hidden="true" /></button></article><p>A state describes the condition of one object. An activity diagram describes a wider flow of work.</p></div>}
    {view === 'architecture' && <div className="architecture-map"><div>{components.map((item) => <button className={activeComponent === item ? 'active' : ''} type="button" key={item} onClick={() => setActiveComponent(item)}>{item}</button>)}</div><article><span>SELECTED COMPONENT</span><h3>{activeComponent}</h3><p>{activeComponent === 'Web client' ? 'Runs in the browser and requests learning content.' : activeComponent === 'UML learning service' ? 'Coordinates lesson content and interactive diagrams.' : activeComponent === 'Diagram content store' ? 'Persists lesson and diagram data.' : 'Turns a revision selection into a downloadable document.'}</p><small>Component view: responsibility and interfaces. Deployment view: browser, application service, storage and renderer nodes.</small></article></div>}
  </>;
}
