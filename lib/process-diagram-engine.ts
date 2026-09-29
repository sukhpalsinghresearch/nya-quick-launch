import type { DepthActor, DepthCase } from './uml-depth-lab';

export type ActivityNode = {
  id: string;
  kind: 'start' | 'action' | 'decision' | 'fork' | 'join' | 'end';
  label: string;
  detail: string;
  confidence: 'observable' | 'conceptual';
};

export type ActivityBranch = {
  label: string;
  steps: string[];
  returnsToMain: boolean;
};

export type ActivityFlow = {
  nodes: ActivityNode[];
  alternate: ActivityBranch[];
  parallel: ActivityBranch[];
  hasLoop: boolean;
};

export function buildActivityFlow(item: DepthCase): ActivityFlow {
  const scenarioText = [
    ...item.mainFlow,
    ...item.alternateFlows,
    ...item.exceptionFlows,
  ]
    .join(' ')
    .toLowerCase();
  const hasExplicitParallelWork =
    /parallel|concurrent|asynchronously|in the background|at the same time/.test(
      scenarioText,
    );
  const nodes: ActivityNode[] = [
    {
      id: 'start',
      kind: 'start',
      label: item.trigger,
      detail: 'The event that starts this activity.',
      confidence: 'observable',
    },
  ];
  if (item.preconditions.length)
    nodes.push({
      id: 'preconditions',
      kind: 'decision',
      label: 'Are the preconditions satisfied?',
      detail: item.preconditions.join(' '),
      confidence: 'observable',
    });
  item.mainFlow.forEach((step, index) =>
    nodes.push({
      id: `main-${index}`,
      kind: 'action',
      label: step,
      detail: `Main success flow, step ${index + 1}.`,
      confidence: 'observable',
    }),
  );
  if (hasExplicitParallelWork && item.supportingServices.length) {
    nodes.splice(Math.max(2, nodes.length - 1), 0, {
      id: 'fork',
      kind: 'fork',
      label: 'Start supporting work',
      detail:
        'The main goal can trigger supporting work. Only model it as parallel when the scenario does not require the result immediately.',
      confidence: 'conceptual',
    });
    nodes.splice(Math.max(3, nodes.length), 0, {
      id: 'join',
      kind: 'join',
      label: 'Required work completes',
      detail:
        'A join is required only for supporting work that must finish before the postcondition.',
      confidence: 'conceptual',
    });
  }
  nodes.push({
    id: 'end',
    kind: 'end',
    label: item.postconditions[0] ?? 'The goal reaches a visible outcome.',
    detail: item.postconditions.join(' '),
    confidence: 'observable',
  });
  const alternate = [
    ...item.alternateFlows.map((step, index) => ({
      label: `Alternate ${index + 1}`,
      steps: [step],
      returnsToMain: true,
    })),
    ...item.exceptionFlows.map((step, index) => ({
      label: `Exception ${index + 1}`,
      steps: [step],
      returnsToMain: false,
    })),
  ];
  return {
    nodes,
    alternate,
    parallel: hasExplicitParallelWork
      ? item.supportingServices.map((service) => ({
          label: service,
          steps: [`Perform ${service.toLowerCase()} work`, 'Record its outcome'],
          returnsToMain: true,
        }))
      : [],
    hasLoop: /retry|repeat|again|resume|reconnect|next item/.test(scenarioText),
  };
}

export type Swimlane = {
  id: 'actor' | 'boundary' | 'service' | 'external';
  label: string;
  reason: string;
};

export type SwimlaneStep = {
  id: string;
  lane: Swimlane['id'];
  label: string;
  detail: string;
};

export function buildSwimlaneFlow(item: DepthCase, actors: DepthActor[]) {
  const names = (ids: string[]) =>
    ids
      .map((id) => actors.find((actor) => actor.id === id)?.label)
      .filter(Boolean)
      .join(' / ');
  const primary = names(item.primaryActors) || 'Initiating actor';
  const secondary = names(item.secondaryActors);
  const lanes: Swimlane[] = [
    {
      id: 'actor',
      label: primary,
      reason: 'Initiates the goal and responds to visible choices.',
    },
    {
      id: 'boundary',
      label: 'Application boundary',
      reason: 'Accepts input and presents the system response.',
    },
    {
      id: 'service',
      label: item.supportingServices[0] ?? 'Domain service',
      reason: 'Applies the rules and coordinates stored state.',
    },
  ];
  if (secondary)
    lanes.push({
      id: 'external',
      label: secondary,
      reason: 'Supports the goal from outside the system boundary.',
    });
  const steps: SwimlaneStep[] = [
    {
      id: 'trigger',
      lane: 'actor',
      label: item.trigger,
      detail: 'The initiating event belongs to the goal actor.',
    },
  ];
  item.mainFlow.forEach((step, index) => {
    const lower = step.toLowerCase();
    const external =
      secondary &&
      /payment|provider|device|partner|merchant|driver|restaurant|store|gateway|identity/.test(
        lower,
      );
    const lane: SwimlaneStep['lane'] = external
      ? 'external'
      : index === 0 || /show|display|select|enter|choose|confirm/.test(lower)
        ? 'boundary'
        : 'service';
    steps.push({
      id: `step-${index}`,
      lane,
      label: step,
      detail: `Responsibility assignment for main-flow step ${index + 1}.`,
    });
  });
  steps.push({
    id: 'outcome',
    lane: 'boundary',
    label: item.postconditions[0] ?? 'Show the completed outcome',
    detail: 'The application boundary makes the result visible.',
  });
  const handoffs = steps
    .slice(1)
    .filter((step, index) => step.lane !== steps[index].lane).length;
  return { lanes, steps, handoffs };
}
