'use client';

import { Check, RotateCcw, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type Question = {
  module: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    module: 'Process and Agile',
    prompt: 'A project has changing requirements and the team can get weekly feedback from users. What is the most defensible starting model?',
    options: ['Waterfall', 'Agile or iterative development', 'V-model', 'Big-bang delivery'],
    answer: 1,
    explanation: 'Short iterations make feedback usable and keep the cost of change lower. This does not mean there is no planning.',
  },
  {
    module: 'Requirements',
    prompt: '“The portal must show a searched course in under 2 seconds for 95% of requests.” What is it?',
    options: ['Functional requirement', 'Non-functional requirement', 'Use case', 'Technical task'],
    answer: 1,
    explanation: 'It sets a measurable performance target. A functional requirement would describe the search behaviour itself.',
  },
  {
    module: 'DFD',
    prompt: 'Which direct flow is invalid in a DFD?',
    options: ['External entity to process', 'Process to data store', 'External entity to data store', 'Process to external entity'],
    answer: 2,
    explanation: 'Data must pass through a process before it reaches a store or leaves it. The process represents transformation or controlled handling.',
  },
  {
    module: 'UML',
    prompt: 'Which diagram is best when the question is “what message happens first, then next”?',
    options: ['Class diagram', 'Sequence diagram', 'Component diagram', 'DFD'],
    answer: 1,
    explanation: 'A sequence diagram makes order in time visible through messages along lifelines.',
  },
  {
    module: 'UML',
    prompt: 'A relationship must happen every time another use case runs. Which notation fits?',
    options: ['extend', 'include', 'association', 'inheritance'],
    answer: 1,
    explanation: 'Use include for required, reusable behaviour. Extend represents optional or conditional behaviour added to a base use case.',
  },
  {
    module: 'Class diagrams',
    prompt: 'Which statement best describes composition?',
    options: ['It shows messages in time order.', 'It means the whole owns a part whose lifetime depends on it.', 'It labels data travelling through a system.', 'It means any two classes are connected.'],
    answer: 1,
    explanation: 'Composition is a strong whole-part relationship. Do not use it when the part can realistically exist independently.',
  },
];

const lengths = [
  { label: '5 min', count: 3, copy: 'Fast concept check.' },
  { label: '15 min', count: 5, copy: 'Balanced revision run.' },
  { label: '25 min', count: 6, copy: 'Full core check.' },
];

export function Ucs503Revision() {
  const [count, setCount] = useState(5);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const activeQuestions = useMemo(() => questions.slice(0, count), [count]);
  const attempted = Object.keys(answers).length;
  const correct = activeQuestions.filter((question, index) => answers[index] === question.answer).length;

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
          <footer>{isRevealed ? <p><strong>{selected === question.answer ? 'Correct.' : 'Review this one.'}</strong> {question.explanation}</p> : <button type="button" disabled={selected === undefined} onClick={() => setRevealed((value) => ({ ...value, [index]: true }))}>Check answer</button>}</footer>
        </article>;
      })}
    </div>
  </section>;
}
