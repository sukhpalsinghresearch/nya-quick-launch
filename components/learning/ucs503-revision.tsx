'use client';

import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Question = {
  module: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  lesson: string;
};

const questions: Question[] = [
  {
    module: 'Process and Agile',
    prompt: 'A project has changing requirements and the team can get weekly feedback from users. What is the most defensible starting model?',
    options: ['Waterfall', 'Agile or iterative development', 'V-model', 'Big-bang delivery'],
    answer: 1,
    explanation: 'Short iterations make feedback usable and keep the cost of change lower. This does not mean there is no planning.',
    lesson: 'agile-model',
  },
  {
    module: 'Process models',
    prompt: 'A safety-critical project has high technical risk and needs explicit risk analysis before each major commitment. Which model fits best?',
    options: ['Incremental', 'Prototyping', 'Spiral', 'Scrum'],
    answer: 2,
    explanation: 'Spiral development makes risk analysis a repeated activity. A prototype may be used inside a spiral, but it is not the complete risk-driven lifecycle.',
    lesson: 'process-models',
  },
  {
    module: 'Software engineering',
    prompt: 'Which statement correctly separates verification from validation?',
    options: ['Verification checks user value; validation checks code style.', 'Verification asks whether we built the product right; validation asks whether we built the right product.', 'They are two names for testing.', 'Validation happens only after deployment.'],
    answer: 1,
    explanation: 'Verification checks conformance to specifications. Validation checks whether the resulting system meets real user needs.',
    lesson: 'software-engineering-basics',
  },
  {
    module: 'User stories',
    prompt: 'Which addition makes “As a student, I want search” testable?',
    options: ['A longer title', 'A wireframe only', 'Acceptance criteria with observable outcomes', 'The developer name'],
    answer: 2,
    explanation: 'Acceptance criteria define observable conditions for success, including important alternatives and boundaries.',
    lesson: 'user-stories',
  },
  {
    module: 'Requirements',
    prompt: '“The portal must show a searched course in under 2 seconds for 95% of requests.” What is it?',
    options: ['Functional requirement', 'Non-functional requirement', 'Use case', 'Technical task'],
    answer: 1,
    explanation: 'It sets a measurable performance target. A functional requirement would describe the search behaviour itself.',
    lesson: 'non-functional-requirements',
  },
  {
    module: 'Requirements gathering',
    prompt: 'Users perform a complex task correctly but struggle to explain their actual steps. Which elicitation technique is most useful first?',
    options: ['Observation', 'A yes-or-no survey', 'Code inspection', 'Deployment modeling'],
    answer: 0,
    explanation: 'Observation reveals tacit work, exceptions and workarounds that people may omit in an interview. Follow it with questions to confirm your interpretation.',
    lesson: 'requirements-gathering',
  },
  {
    module: 'Requirement modeling',
    prompt: 'You need to show how order data moves between a customer, processes and data stores. Which model should lead?',
    options: ['State diagram', 'DFD', 'Class diagram', 'Deployment diagram'],
    answer: 1,
    explanation: 'A DFD focuses on data movement, transformation, external entities and stores. Choose the model from the question you need to answer.',
    lesson: 'requirement-modeling',
  },
  {
    module: 'DFD',
    prompt: 'Which direct flow is invalid in a DFD?',
    options: ['External entity to process', 'Process to data store', 'External entity to data store', 'Process to external entity'],
    answer: 2,
    explanation: 'Data must pass through a process before it reaches a store or leaves it. The process represents transformation or controlled handling.',
    lesson: 'dfd',
  },
  {
    module: 'UML',
    prompt: 'Which diagram is best when the question is “what message happens first, then next”?',
    options: ['Class diagram', 'Sequence diagram', 'Component diagram', 'DFD'],
    answer: 1,
    explanation: 'A sequence diagram makes order in time visible through messages along lifelines.',
    lesson: 'interaction-diagrams',
  },
  {
    module: 'UML',
    prompt: 'A relationship must happen every time another use case runs. Which notation fits?',
    options: ['extend', 'include', 'association', 'inheritance'],
    answer: 1,
    explanation: 'Use include for required, reusable behaviour. Extend represents optional or conditional behaviour added to a base use case.',
    lesson: 'use-case-activity',
  },
  {
    module: 'Class diagrams',
    prompt: 'Which statement best describes composition?',
    options: ['It shows messages in time order.', 'It means the whole owns a part whose lifetime depends on it.', 'It labels data travelling through a system.', 'It means any two classes are connected.'],
    answer: 1,
    explanation: 'Composition is a strong whole-part relationship. Do not use it when the part can realistically exist independently.',
    lesson: 'class-diagrams',
  },
  {
    module: 'Activity diagrams',
    prompt: 'Two activities begin in parallel and both must finish before the next step. Which pair of nodes expresses this?',
    options: ['Decision and merge', 'Fork and join', 'Initial and final', 'Send and receive'],
    answer: 1,
    explanation: 'A fork creates concurrent flows. A join synchronizes them. A decision selects one guarded path instead of starting every path.',
    lesson: 'use-case-activity',
  },
  {
    module: 'Swimlanes',
    prompt: 'What information should a swimlane add to an activity diagram?',
    options: ['Database columns', 'Responsibility for each activity and visible handoffs', 'Message numbering', 'Server IP addresses'],
    answer: 1,
    explanation: 'Swimlanes assign activities to responsible roles or systems. Cross-lane flows expose handoffs and ownership gaps.',
    lesson: 'use-case-activity',
  },
  {
    module: 'State diagrams',
    prompt: 'Which label best describes a transition in a state machine?',
    options: ['Actor : use case', 'event [guard] / action', 'source -> process -> store', 'class.method()'],
    answer: 1,
    explanation: 'A transition may show the triggering event, a guard that must be true and an action caused by the transition.',
    lesson: 'state-diagrams',
  },
  {
    module: 'Components',
    prompt: 'A component diagram should primarily explain which concern?',
    options: ['The physical machines running instances', 'Software units, provided interfaces and dependencies', 'The order of messages in one request', 'The emotional state of an actor'],
    answer: 1,
    explanation: 'Component diagrams show replaceable software units and their dependencies. Deployment diagrams map artifacts or instances to physical or virtual nodes.',
    lesson: 'component-deployment',
  },
  {
    module: 'Case studies',
    prompt: 'A use case says “Pay” while its activity flow ends after choosing a payment method. What is the main modeling problem?',
    options: ['Too many actors', 'The diagrams disagree about the system behaviour', 'The class names are missing', 'The DFD has too many stores'],
    answer: 1,
    explanation: 'Different diagrams are views of the same system. Their scope, vocabulary and outcomes must remain consistent across the case study.',
    lesson: 'case-studies',
  },
];

const lengths = [
  { label: '5 min', count: 4, copy: 'Fast concept check.' },
  { label: '15 min', count: 10, copy: 'Balanced revision run.' },
  { label: '25 min', count: questions.length, copy: 'Complete syllabus check.' },
];

export function Ucs503Revision() {
  const [count, setCount] = useState(10);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const activeQuestions = useMemo(() => questions.slice(0, count), [count]);
  const attempted = activeQuestions.filter((_, index) => revealed[index]).length;
  const correct = activeQuestions.filter((question, index) => revealed[index] && answers[index] === question.answer).length;

  const reset = () => {
    setAnswers({});
    setRevealed({});
  };

  const chooseLength = (newCount: number) => {
    setCount(newCount);
    reset();
  };

  return <section className="revision-workbench">
    <header className="revision-workbench-head">
      <span>UCS503 REVISION CHECK</span>
      <h1>Find what needs one more pass.</h1>
      <p>Choose a short run, answer without notes, then use the explanation to decide which lesson to revisit.</p>
    </header>
    <fieldset className="revision-lengths">
      <legend className="sr-only">Revision length</legend>
      {lengths.map((length) => <button className={count === length.count ? 'active' : ''} type="button" onClick={() => chooseLength(length.count)} key={length.label}><strong>{length.label}</strong><small>{length.copy}</small></button>)}
    </fieldset>
    <div className="revision-score" aria-live="polite"><span>PROGRESS</span><strong>{attempted} / {activeQuestions.length} answered</strong><span>SCORE</span><strong>{correct} correct</strong><button type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Start again</button></div>
    <div className="revision-questions">
      {activeQuestions.map((question, index) => {
        const selected = answers[index];
        const isRevealed = revealed[index];
        return <article key={question.prompt}>
          <header><span>{String(index + 1).padStart(2, '0')} / {question.module.toUpperCase()}</span><h2>{question.prompt}</h2></header>
          <div className="revision-options">
            {question.options.map((option, optionIndex) => {
              const chosen = selected === optionIndex;
              const correctOption = optionIndex === question.answer;
              const state = isRevealed ? correctOption ? 'correct' : chosen ? 'wrong' : '' : chosen ? 'selected' : '';
              return <button className={state} type="button" disabled={isRevealed} onClick={() => setAnswers((value) => ({ ...value, [index]: optionIndex }))} key={option}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{isRevealed && correctOption && <Check aria-label="Correct answer" />}{isRevealed && chosen && !correctOption && <X aria-label="Incorrect answer" />}</button>;
            })}
          </div>
          <footer>{isRevealed ? <div className="revision-feedback"><p><strong>{selected === question.answer ? 'Correct.' : 'Review this one.'}</strong> {question.explanation}</p><Link href={`/learn/${question.lesson}`}>Open the lesson <ArrowRight aria-hidden="true" /></Link></div> : <button type="button" disabled={selected === undefined} onClick={() => setRevealed((value) => ({ ...value, [index]: true }))}>Check answer</button>}</footer>
        </article>;
      })}
    </div>
  </section>;
}
