'use client';

/* eslint-disable jsx-a11y/prefer-tag-over-role */

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileText,
  Filter,
  Maximize2,
  Minimize2,
  Network,
  Route,
  Search,
  ShieldCheck,
  Workflow,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ActivityDiagramLab,
  SwimlaneDiagramLab,
} from '@/components/learning/process-diagram-labs';
import {
  depthCopy,
  depthOrder,
  depthPlatforms,
  getDepthModel,
  platformEvidence,
  type CaseTag,
  type DepthActor,
  type DepthCase,
  type DepthClass,
  type DepthClassRelationship,
  type DepthRelationship,
  type DepthScenario,
  type KnowledgeLevel,
  type LabDepth,
  type SequenceStep,
} from '@/lib/uml-depth-lab';

type DiagramMode = 'use-case' | 'sequence' | 'class' | 'activity' | 'swimlane';
type FlowFocus = 'main' | 'failure' | 'background';
type SelectedItem =
  | { type: 'actor'; value: DepthActor }
  | { type: 'case'; value: DepthCase }
  | null;

const confidenceCopy: Record<KnowledgeLevel, string> = {
  observable: 'Visible in the product or directly testable by a user.',
  documented: 'Described through public product or platform documentation.',
  conceptual:
    'A teaching model inferred from observable behaviour and common system design practice.',
  unknown: 'The proprietary implementation is not publicly known.',
};

const filterOptions: Array<{
  id: CaseTag | 'primary' | 'secondary' | 'include' | 'extend';
  label: string;
}> = [
  { id: 'primary', label: 'Primary actors' },
  { id: 'secondary', label: 'Secondary actors' },
  { id: 'core', label: 'Core cases' },
  { id: 'optional', label: 'Optional cases' },
  { id: 'include', label: 'Include' },
  { id: 'extend', label: 'Extend' },
  { id: 'service', label: 'System services' },
  { id: 'security', label: 'Security / safety' },
  { id: 'monetization', label: 'Monetization' },
  { id: 'intelligence', label: 'ML / ranking' },
  { id: 'administration', label: 'Administration' },
  { id: 'integration', label: 'External integration' },
];

function packageFor(item: DepthCase) {
  if (item.tags.includes('security')) return 'Safety, security and privacy';
  if (item.tags.includes('monetization')) return 'Monetization and entitlement';
  if (item.tags.includes('intelligence'))
    return 'Recommendation and intelligence';
  if (item.tags.includes('administration'))
    return 'Administration and operations';
  if (item.tags.includes('integration')) return 'External integration';
  if (item.tags.includes('service')) return 'Supporting platform behaviour';
  return 'Actor goals';
}

function splitLabel(label: string, limit = 21, maxLines = 2) {
  if (label.length <= limit) return [label];
  const words = label.split(' ');
  const lines: string[] = [];
  let current = '';
  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > limit && current) {
      lines.push(current);
      current = word;
    } else current = `${current} ${word}`.trim();
  });
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function Confidence({ value }: { value: KnowledgeLevel }) {
  return (
    <span
      className={`knowledge-label knowledge-${value}`}
      title={confidenceCopy[value]}
    >
      {value}
    </span>
  );
}

function UseCaseDiagram({
  scenario,
  depth,
  visibleCases,
  visibleActors,
  relationships,
  activeFilters,
  selected,
  onSelect,
  zoom,
}: {
  scenario: DepthScenario;
  depth: LabDepth;
  visibleCases: DepthCase[];
  visibleActors: DepthActor[];
  relationships: DepthRelationship[];
  activeFilters: Set<string>;
  selected: SelectedItem;
  onSelect: (item: SelectedItem) => void;
  zoom: number;
}) {
  const primary = visibleActors.filter((item) => item.role === 'primary');
  const secondary = visibleActors.filter((item) => item.role === 'secondary');
  const groups = Array.from(new Set(visibleCases.map(packageFor))).map(
    (label) => ({
      label,
      items: visibleCases.filter((item) => packageFor(item) === label),
    }),
  );
  const casePositions = new Map<string, { x: number; y: number }>();
  const packages: Array<{ label: string; y: number; height: number }> = [];
  let nextY = 85;
  groups.forEach((group) => {
    const rows = Math.ceil(group.items.length / 3);
    const height = 78 + rows * 125;
    packages.push({ label: group.label, y: nextY, height });
    group.items.forEach((item, index) =>
      casePositions.set(item.id, {
        x: 450 + (index % 3) * 310,
        y: nextY + 86 + Math.floor(index / 3) * 125,
      }),
    );
    nextY += height + 24;
  });
  const height = Math.max(
    nextY + 20,
    primary.length * 165 + 180,
    secondary.length * 165 + 180,
    720,
  );
  const actorPositions = new Map<string, { x: number; y: number }>();
  primary.forEach((item, index) =>
    actorPositions.set(item.id, { x: 105, y: 140 + index * 165 }),
  );
  secondary.forEach((item, index) =>
    actorPositions.set(item.id, { x: 1395, y: 140 + index * 165 }),
  );
  const selectedId = selected?.value.id;
  const focusLinks = selectedId
    ? relationships.filter(
        (item) => item.source === selectedId || item.target === selectedId,
      )
    : relationships;
  return (
    <div className="uml-canvas-scroll depth-canvas-scroll">
      <svg
        className="depth-use-case-canvas"
        viewBox={`0 0 1500 ${height}`}
        style={{ width: `${(1500 * zoom) / 100}px` }}
        aria-label={`${scenario.name} use case diagram`}
      >
        <defs>
          <marker
            id="depth-open-arrow"
            markerHeight="7"
            markerWidth="9"
            orient="auto"
            refX="8"
            refY="3.5"
          >
            <path d="M0,0 L8,3.5 L0,7" fill="none" stroke="currentColor" />
          </marker>
          <marker
            id="depth-triangle"
            markerHeight="10"
            markerWidth="12"
            orient="auto"
            refX="11"
            refY="5"
          >
            <path d="M0,0 L11,5 L0,10 Z" fill="white" stroke="currentColor" />
          </marker>
        </defs>
        <rect
          className="depth-system-boundary"
          x="260"
          y="28"
          width="980"
          height={height - 55}
        />
        <text className="depth-boundary-label" x="285" y="58">
          {scenario.name} / {depthCopy[depth].label}
        </text>
        {packages.map((item) => (
          <g key={item.label}>
            <rect
              className="uml-package"
              x="300"
              y={item.y}
              width="900"
              height={item.height}
            />
            <text className="uml-package-label" x="325" y={item.y + 30}>
              {item.label}
            </text>
          </g>
        ))}
        {focusLinks.map((link, index) => {
          if (link.type === 'association') {
            const actorPosition = actorPositions.get(link.source);
            const casePosition = casePositions.get(link.target);
            if (!actorPosition || !casePosition) return null;
            return (
              <line
                className="depth-association"
                key={`${link.source}-${link.target}-${index}`}
                x1={
                  actorPosition.x < 250
                    ? actorPosition.x + 62
                    : actorPosition.x - 62
                }
                y1={actorPosition.y}
                x2={casePosition.x + (actorPosition.x < 250 ? -126 : 126)}
                y2={casePosition.y}
              />
            );
          }
          if (link.type === 'generalization') {
            const from = actorPositions.get(link.source);
            const to = actorPositions.get(link.target);
            if (!from || !to) return null;
            return (
              <line
                className="depth-generalization"
                key={`${link.source}-${link.target}`}
                x1={from.x}
                y1={from.y - 35}
                x2={to.x}
                y2={to.y + 35}
                markerEnd="url(#depth-triangle)"
              />
            );
          }
          if (
            (link.type === 'include' && !activeFilters.has('include')) ||
            (link.type === 'extend' && !activeFilters.has('extend'))
          )
            return null;
          const from = casePositions.get(link.source);
          const to = casePositions.get(link.target);
          if (!from || !to) return null;
          return (
            <g key={`${link.source}-${link.target}-${index}`}>
              <line
                className={`depth-case-link link-${link.type}`}
                x1={from.x}
                y1={from.y + 32}
                x2={to.x}
                y2={to.y - 32}
                markerEnd="url(#depth-open-arrow)"
              />
              <text
                className="depth-link-label"
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 5}
                textAnchor="middle"
              >
                «{link.type}»
              </text>
            </g>
          );
        })}
        {visibleActors.map((item) => {
          const position = actorPositions.get(item.id)!;
          const actorLines = splitLabel(item.label, 18, 3);
          return (
            <g
              className={`depth-actor ${selectedId === item.id ? 'selected' : ''}`}
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`Explain ${item.label}`}
              onClick={() => onSelect({ type: 'actor', value: item })}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ')
                  onSelect({ type: 'actor', value: item });
              }}
            >
              {item.kind === 'person' ? (
                <>
                  <circle cx={position.x} cy={position.y - 25} r="11" />
                  <line
                    x1={position.x}
                    y1={position.y - 14}
                    x2={position.x}
                    y2={position.y + 15}
                  />
                  <line
                    x1={position.x - 17}
                    y1={position.y - 2}
                    x2={position.x + 17}
                    y2={position.y - 2}
                  />
                  <line
                    x1={position.x}
                    y1={position.y + 15}
                    x2={position.x - 14}
                    y2={position.y + 33}
                  />
                  <line
                    x1={position.x}
                    y1={position.y + 15}
                    x2={position.x + 14}
                    y2={position.y + 33}
                  />
                </>
              ) : (
                <rect
                  x={position.x - 62}
                  y={position.y - 34}
                  width="124"
                  height="68"
                  rx="3"
                />
              )}
              {actorLines.map((line, index) => (
                <text
                  className="depth-actor-label"
                  x={position.x}
                  y={position.y + 58 + index * 17}
                  textAnchor="middle"
                  key={line}
                >
                  {line}
                </text>
              ))}
              <text
                className={`depth-role role-${item.role}`}
                x={position.x}
                y={position.y + 65 + actorLines.length * 17}
                textAnchor="middle"
              >
                {item.role}
              </text>
            </g>
          );
        })}
        {visibleCases.map((item) => {
          const position = casePositions.get(item.id)!;
          const lines = splitLabel(item.name, 28, 3);
          return (
            <g
              className={`depth-case ${selectedId === item.id ? 'selected' : ''} case-tier-${item.tier}`}
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`Explain ${item.name}`}
              onClick={() => onSelect({ type: 'case', value: item })}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ')
                  onSelect({ type: 'case', value: item });
              }}
            >
              <ellipse cx={position.x} cy={position.y} rx="132" ry="43" />
              {lines.map((line, index) => (
                <text
                  x={position.x}
                  y={position.y + (index - (lines.length - 1) / 2) * 17 + 5}
                  textAnchor="middle"
                  key={line}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ActorDetails({
  actor,
  scenario,
  cases,
}: {
  actor: DepthActor;
  scenario: DepthScenario;
  cases: DepthCase[];
}) {
  const related = cases.filter((item) =>
    [...item.primaryActors, ...item.secondaryActors].includes(actor.id),
  );
  return (
    <aside className="depth-detail-panel">
      <div className="detail-panel-kicker">
        <span>ACTOR</span>
        <span>{actor.kind}</span>
      </div>
      <h2>{actor.label}</h2>
      <p>{actor.description}</p>
      <dl className="depth-facts">
        <div>
          <dt>Role in this boundary</dt>
          <dd>
            {actor.role === 'primary'
              ? 'Primary. This actor starts a goal in this scenario.'
              : "Secondary. The platform calls or uses this external actor to finish another actor's goal."}
          </dd>
        </div>
        <div>
          <dt>Can the role change?</dt>
          <dd>
            Yes. Classification is relative to the selected system boundary and
            use case. The same external system may become primary in an
            integration or webhook scenario.
          </dd>
        </div>
        <div>
          <dt>Connected use cases</dt>
          <dd>{related.length} visible at this depth</dd>
        </div>
      </dl>
      <section>
        <h3>Goals</h3>
        <ul>
          {actor.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Connected cases</h3>
        <div className="connected-case-list">
          {related.slice(0, 18).map((item) => (
            <span key={item.id}>{item.name}</span>
          ))}
        </div>
      </section>
      <section>
        <h3>Related scenario</h3>
        <p>{scenario.name}</p>
      </section>
    </aside>
  );
}

function CaseDetails({
  item,
  actors,
  scenario,
}: {
  item: DepthCase;
  actors: DepthActor[];
  scenario: DepthScenario;
}) {
  const actorNames = (ids: string[]) =>
    ids
      .map((id) => actors.find((actor) => actor.id === id)?.label ?? id)
      .join(', ') || 'None in this boundary';
  return (
    <aside className="depth-detail-panel case-detail-panel">
      <div className="detail-panel-kicker">
        <span>{item.id}</span>
        <Confidence value={item.confidence} />
      </div>
      <h2>{item.name}</h2>
      <p>{item.detailedDescription}</p>
      <dl className="depth-facts">
        <div>
          <dt>Primary actor</dt>
          <dd>{actorNames(item.primaryActors)}</dd>
        </div>
        <div>
          <dt>Secondary actors</dt>
          <dd>{actorNames(item.secondaryActors)}</dd>
        </div>
        <div>
          <dt>Trigger</dt>
          <dd>{item.trigger}</dd>
        </div>
        <div>
          <dt>Knowledge label</dt>
          <dd>{confidenceCopy[item.confidence]}</dd>
        </div>
      </dl>
      <section>
        <h3>Preconditions</h3>
        <ul>
          {item.preconditions.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Main flow</h3>
        <ol>
          {item.mainFlow.map((value, index) => (
            <li key={value}>
              <span>{index + 1}</span>
              {value}
            </li>
          ))}
        </ol>
      </section>
      <section className="alternate-flow">
        <h3>Alternate and exception flows</h3>
        <ul>
          {[...item.alternateFlows, ...item.exceptionFlows].map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Postconditions</h3>
        <ul>
          {item.postconditions.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>
      <div className="case-metadata-grid">
        <div>
          <h3>Includes</h3>
          <p>{item.includes.join(', ') || 'None required'}</p>
        </div>
        <div>
          <h3>Extends</h3>
          <p>{item.extends.join(', ') || 'None in this scope'}</p>
        </div>
        <div>
          <h3>Data</h3>
          <p>{item.dataObjects.join(', ')}</p>
        </div>
        <div>
          <h3>Supporting services</h3>
          <p>
            {item.supportingServices.join(', ') ||
              'Kept outside Classroom mode'}
          </p>
        </div>
        <div>
          <h3>Security</h3>
          <p>{item.security.join(' ')}</p>
        </div>
        <div>
          <h3>Privacy</h3>
          <p>{item.privacy.join(' ')}</p>
        </div>
      </div>
      <section>
        <h3>Related scenarios</h3>
        <div className="connected-case-list">
          {item.relatedScenarios.map((id) => (
            <span key={id}>
              {scenario.id === id ? scenario.name : id.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function EmptyDetails() {
  return (
    <aside className="depth-detail-panel empty-depth-detail">
      <CircleHelp aria-hidden="true" />
      <span>SELECT AN ACTOR OR USE CASE</span>
      <h2>The explanation is part of the diagram.</h2>
      <p>
        Select an actor to see why its role is primary or secondary. Select an
        oval to open its complete use case description.
      </p>
    </aside>
  );
}

function ClassDiagram({
  scenario,
  depth,
  classes,
  relationships,
  selected,
  onSelect,
  zoom,
}: {
  scenario: DepthScenario;
  depth: LabDepth;
  classes: DepthClass[];
  relationships: DepthClassRelationship[];
  selected: DepthClass | null;
  onSelect: (item: DepthClass) => void;
  zoom: number;
}) {
  const boxWidth = 330;
  const columnGap = 95;
  const rowGap = 105;
  const columns = Math.min(3, Math.max(1, classes.length));
  const positions = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();
  const rowHeights: number[] = [];
  classes.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const height =
      115 +
      Math.max(1, item.attributes.length) * 24 +
      item.operations.length * 24;
    rowHeights[row] = Math.max(rowHeights[row] ?? 0, height);
  });
  const rowStarts: number[] = [];
  rowHeights.forEach((height, index) => {
    rowStarts[index] =
      index === 0 ? 105 : rowStarts[index - 1] + rowHeights[index - 1] + rowGap;
  });
  classes.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const height =
      115 +
      Math.max(1, item.attributes.length) * 24 +
      item.operations.length * 24;
    positions.set(item.id, {
      x: 90 + column * (boxWidth + columnGap),
      y: rowStarts[row],
      width: boxWidth,
      height,
    });
  });
  const width = 180 + columns * boxWidth + (columns - 1) * columnGap;
  const height = (rowStarts.at(-1) ?? 105) + (rowHeights.at(-1) ?? 240) + 120;
  const focusedRelationships = selected
    ? relationships.filter(
        (item) => item.source === selected.id || item.target === selected.id,
      )
    : relationships;
  return (
    <div className="uml-canvas-scroll class-depth-scroll">
      <svg
        className="depth-class-canvas"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: `${(width * zoom) / 100}px` }}
        aria-label={`${scenario.name} class diagram`}
      >
        <defs>
          <marker
            id="class-open-arrow"
            markerHeight="8"
            markerWidth="10"
            orient="auto"
            refX="9"
            refY="4"
          >
            <path d="M0,0 L9,4 L0,8" fill="none" />
          </marker>
          <marker
            id="class-inheritance"
            markerHeight="11"
            markerWidth="13"
            orient="auto"
            refX="12"
            refY="5.5"
          >
            <path d="M0,0 L12,5.5 L0,11 Z" fill="white" />
          </marker>
          <marker
            id="class-aggregation"
            markerHeight="12"
            markerWidth="15"
            orient="auto-start-reverse"
            refX="2"
            refY="6"
          >
            <path d="M1,6 L7,1 L13,6 L7,11 Z" fill="white" />
          </marker>
          <marker
            id="class-composition"
            markerHeight="12"
            markerWidth="15"
            orient="auto-start-reverse"
            refX="2"
            refY="6"
          >
            <path d="M1,6 L7,1 L13,6 L7,11 Z" />
          </marker>
        </defs>
        <text className="class-canvas-title" x="90" y="58">
          {scenario.name} / {depthCopy[depth].label}
        </text>
        {focusedRelationships.map((item, index) => {
          const source = positions.get(item.source);
          const target = positions.get(item.target);
          if (!source || !target) return null;
          const sourceCenterX = source.x + source.width / 2;
          const targetCenterX = target.x + target.width / 2;
          const sameRow = Math.abs(source.y - target.y) < 20;
          const sourceOnLeft = sourceCenterX < targetCenterX;
          const x1 = sameRow
            ? sourceOnLeft
              ? source.x + source.width
              : source.x
            : sourceCenterX;
          const y1 = sameRow
            ? source.y + source.height / 2
            : source.y + source.height;
          const x2 = sameRow
            ? sourceOnLeft
              ? target.x
              : target.x + target.width
            : targetCenterX;
          const y2 = sameRow ? target.y + target.height / 2 : target.y;
          const middle = sameRow ? (x1 + x2) / 2 : (y1 + y2) / 2;
          const path = sameRow
            ? `M ${x1} ${y1} H ${middle} V ${y2} H ${x2}`
            : `M ${x1} ${y1} V ${middle} H ${x2} V ${y2}`;
          const labelX = sameRow ? middle : x2;
          const labelY = sameRow ? Math.min(y1, y2) - 12 : middle - 10;
          return (
            <g
              className={`class-relation relation-${item.type}`}
              key={`${item.source}-${item.target}-${index}`}
            >
              <path
                d={path}
                markerStart={
                  item.type === 'composition'
                    ? 'url(#class-composition)'
                    : item.type === 'aggregation'
                      ? 'url(#class-aggregation)'
                      : undefined
                }
                markerEnd={
                  item.type === 'inheritance'
                    ? 'url(#class-inheritance)'
                    : item.type === 'dependency'
                      ? 'url(#class-open-arrow)'
                      : undefined
                }
              />
              <text
                className="class-relation-label"
                x={labelX}
                y={labelY}
                textAnchor="middle"
              >
                {item.label}
              </text>
              <text
                className="class-multiplicity"
                x={x1}
                y={y1 - 9}
                textAnchor="middle"
              >
                {item.sourceMultiplicity}
              </text>
              <text
                className="class-multiplicity"
                x={x2}
                y={y2 - 9}
                textAnchor="middle"
              >
                {item.targetMultiplicity}
              </text>
            </g>
          );
        })}
        {classes.map((item) => {
          const position = positions.get(item.id)!;
          const headerHeight = 70;
          const attributesHeight =
            Math.max(1, item.attributes.length) * 24 + 20;
          return (
            <g
              className={`uml-class-box class-${item.stereotype.replace(' ', '-')} ${selected?.id === item.id ? 'selected' : ''}`}
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`Explain class ${item.label}`}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(item);
              }}
            >
              <rect
                x={position.x}
                y={position.y}
                width={position.width}
                height={position.height}
              />
              <rect
                className="uml-class-header"
                x={position.x}
                y={position.y}
                width={position.width}
                height={headerHeight}
              />
              <line
                x1={position.x}
                y1={position.y + headerHeight}
                x2={position.x + position.width}
                y2={position.y + headerHeight}
              />
              <line
                x1={position.x}
                y1={position.y + headerHeight + attributesHeight}
                x2={position.x + position.width}
                y2={position.y + headerHeight + attributesHeight}
              />
              <text
                className="uml-class-stereotype"
                x={position.x + position.width / 2}
                y={position.y + 23}
                textAnchor="middle"
              >
                «{item.stereotype}»
              </text>
              <text
                className="uml-class-name"
                x={position.x + position.width / 2}
                y={position.y + 51}
                textAnchor="middle"
              >
                {item.label}
              </text>
              {item.attributes.length ? (
                item.attributes.map((member, index) => (
                  <text
                    className="uml-class-member"
                    x={position.x + 18}
                    y={position.y + headerHeight + 29 + index * 24}
                    key={`${member.name}-${index}`}
                  >
                    {member.visibility} {member.name}: {member.type}
                  </text>
                ))
              ) : (
                <text
                  className="uml-class-member muted"
                  x={position.x + 18}
                  y={position.y + headerHeight + 29}
                >
                  no persistent attributes shown
                </text>
              )}
              {item.operations.map((member, index) => (
                <text
                  className="uml-class-member"
                  x={position.x + 18}
                  y={
                    position.y +
                    headerHeight +
                    attributesHeight +
                    28 +
                    index * 24
                  }
                  key={`${member.name}-${index}`}
                >
                  {member.visibility} {member.name}: {member.type}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ClassDetails({
  item,
  relationships,
  classes,
}: {
  item: DepthClass | null;
  relationships: DepthClassRelationship[];
  classes: DepthClass[];
}) {
  if (!item)
    return (
      <aside className="depth-detail-panel empty-depth-detail">
        <Boxes aria-hidden="true" />
        <span>SELECT A CLASS</span>
        <h2>Read the structure, not only the boxes.</h2>
        <p>
          Select a class to inspect its responsibility, state, behaviour,
          invariants, multiplicities and relationship reasons.
        </p>
      </aside>
    );
  const related = relationships.filter(
    (relation) => relation.source === item.id || relation.target === item.id,
  );
  const className = (id: string) =>
    classes.find((candidate) => candidate.id === id)?.label ?? id;
  return (
    <aside className="depth-detail-panel class-detail-panel">
      <div className="detail-panel-kicker">
        <span>«{item.stereotype}»</span>
        <Confidence value={item.confidence} />
      </div>
      <h2>{item.label}</h2>
      <p>{item.responsibility}</p>
      <section>
        <h3>Attributes</h3>
        <ul>
          {item.attributes.map((member) => (
            <li key={member.name}>
              {member.visibility} {member.name}: {member.type}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Operations</h3>
        <ul>
          {item.operations.map((member) => (
            <li key={member.name}>
              {member.visibility} {member.name}: {member.type}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Invariants</h3>
        <ul>
          {item.invariants.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Relationships</h3>
        <div className="class-relation-list">
          {related.map((relation, index) => (
            <article key={`${relation.source}-${relation.target}-${index}`}>
              <strong>
                {className(relation.source)} {relation.type}{' '}
                {className(relation.target)}
              </strong>
              <span>
                {relation.sourceMultiplicity} to {relation.targetMultiplicity}
              </span>
              <p>{relation.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

function SequenceDiagram({
  scenario,
  depth,
  focus,
  selectedIndex,
  onSelect,
  zoom,
}: {
  scenario: DepthScenario;
  depth: LabDepth;
  focus: FlowFocus;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  zoom: number;
}) {
  const tier = depthOrder[depth];
  const participants = scenario.sequenceParticipants.filter(
    (item) => item.tier <= tier,
  );
  const ids = new Set(participants.map((item) => item.id));
  const messages = scenario.sequence[focus].filter(
    (item) => item.tier <= tier && ids.has(item.from) && ids.has(item.to),
  );
  const width = Math.max(1040, participants.length * 155);
  const height = 165 + messages.length * 68;
  const gap = (width - 120) / Math.max(1, participants.length - 1);
  const positions = new Map(
    participants.map((item, index) => [item.id, 60 + gap * index]),
  );
  return (
    <div className="uml-canvas-scroll sequence-depth-scroll">
      <svg
        className="depth-sequence-canvas"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: `${(width * zoom) / 100}px` }}
        aria-label={`${scenario.name} ${focus} sequence`}
      >
        <defs>
          <marker
            id="depth-sequence-arrow"
            markerHeight="7"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="3.5"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" />
          </marker>
        </defs>
        {participants.map((item) => {
          const x = positions.get(item.id)!;
          return (
            <g key={item.id}>
              <rect
                className={`sequence-head head-${item.type}`}
                x={x - 62}
                y="22"
                width="124"
                height="50"
              />
              <text
                className="sequence-head-label"
                x={x}
                y="43"
                textAnchor="middle"
              >
                {splitLabel(item.label, 15).map((line, index) => (
                  <tspan x={x} dy={index ? 13 : 0} key={line}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text
                className="sequence-head-type"
                x={x}
                y="91"
                textAnchor="middle"
              >
                {item.type}
              </text>
              <line
                className="depth-lifeline"
                x1={x}
                y1="103"
                x2={x}
                y2={height - 22}
              />
            </g>
          );
        })}
        {messages.map((item, index) => {
          const y = 132 + index * 68;
          const x1 = positions.get(item.from)!;
          const x2 = positions.get(item.to)!;
          return (
            <g
              className={`depth-message ${selectedIndex === index ? 'selected' : ''}`}
              key={`${item.from}-${item.to}-${index}`}
              tabIndex={0}
              role="button"
              aria-label={`Explain message ${index + 1}: ${item.label}`}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(index);
              }}
            >
              {item.fragment && (
                <>
                  <rect
                    className={`sequence-fragment fragment-${item.fragment}`}
                    x="16"
                    y={y - 27}
                    width={width - 32}
                    height="54"
                  />
                  <text className="sequence-fragment-label" x="27" y={y - 10}>
                    {item.fragment} [{item.guard}]
                  </text>
                </>
              )}
              <text className="sequence-step-number" x="25" y={y + 4}>
                {index + 1}
              </text>
              <line
                className={`depth-message-line line-${item.style}`}
                x1={x1}
                y1={y}
                x2={x2 + (x2 > x1 ? -8 : 8)}
                y2={y}
                markerEnd="url(#depth-sequence-arrow)"
              />
              <text
                className="depth-message-label"
                x={(x1 + x2) / 2}
                y={y - 8}
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SequenceDetails({
  item,
  scenario,
  depth,
  focus,
}: {
  item: SequenceStep | null;
  scenario: DepthScenario;
  depth: LabDepth;
  focus: FlowFocus;
}) {
  if (!item)
    return (
      <aside className="depth-detail-panel empty-depth-detail">
        <Route aria-hidden="true" />
        <span>{focus.toUpperCase()} FLOW</span>
        <h2>{scenario.name}</h2>
        <p>
          Time moves downward. Select a message to see why the participant
          receives it, what data crosses the line, what can fail and how certain
          the model is.
        </p>
        <dl className="depth-facts">
          <div>
            <dt>Depth</dt>
            <dd>{depthCopy[depth].purpose}</dd>
          </div>
          <div>
            <dt>Important rule</dt>
            <dd>
              Internal services and data stores may appear as lifelines in a
              sequence diagram. They are not UML actors in the use case diagram.
            </dd>
          </div>
        </dl>
      </aside>
    );
  return (
    <aside className="depth-detail-panel">
      <div className="detail-panel-kicker">
        <span>SELECTED MESSAGE</span>
        <Confidence value={item.confidence} />
      </div>
      <h2>{item.label}</h2>
      <p>{item.why}</p>
      <dl className="depth-facts">
        <div>
          <dt>From</dt>
          <dd>
            {
              scenario.sequenceParticipants.find(
                (part) => part.id === item.from,
              )?.label
            }
          </dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>
            {
              scenario.sequenceParticipants.find((part) => part.id === item.to)
                ?.label
            }
          </dd>
        </div>
        <div>
          <dt>Message type</dt>
          <dd>
            {item.style === 'async'
              ? 'Asynchronous message. The sender does not wait for completion.'
              : item.style === 'return'
                ? 'Return message or result.'
                : 'Synchronous request in this teaching model.'}
          </dd>
        </div>
        <div>
          <dt>Data crossing</dt>
          <dd>{item.data}</dd>
        </div>
        <div>
          <dt>Failure behaviour</dt>
          <dd>{item.failure}</dd>
        </div>
        {item.fragment && (
          <div>
            <dt>{item.fragment} guard</dt>
            <dd>{item.guard}</dd>
          </div>
        )}
        <div>
          <dt>Knowledge label</dt>
          <dd>{confidenceCopy[item.confidence]}</dd>
        </div>
      </dl>
    </aside>
  );
}

export function SystemDesignLab({
  courseSlug,
  thapar,
  initialMode = 'use-case',
}: {
  courseSlug: string;
  thapar: boolean;
  initialMode?: DiagramMode;
}) {
  const [platformId, setPlatformId] = useState('instagram');
  const [scenarioId, setScenarioId] = useState('overview');
  const [depth, setDepth] = useState<LabDepth>('classroom');
  const [mode, updateMode] = useState<DiagramMode>(initialMode);
  function setMode(next: DiagramMode) {
    updateMode(next);
    const url = new URL(window.location.href);
    url.searchParams.set('diagram', next);
    window.history.pushState(null, '', url);
  }
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedPlatform = depthPlatforms.find(
        (item) => item.id === params.get('platform'),
      );
      const nextPlatform = requestedPlatform ?? depthPlatforms[0];
      const requestedScenario = nextPlatform.scenarios.find(
        (item) => item.id === params.get('scenario'),
      );
      const requestedDepth = params.get('depth');
      const value = params.get('diagram');
      setPlatformId(nextPlatform.id);
      setScenarioId(
        requestedScenario?.id ?? nextPlatform.scenarios[0]?.id ?? 'overview',
      );
      setDepth(
        requestedDepth === 'system' || requestedDepth === 'exhaustive'
          ? requestedDepth
          : 'classroom',
      );
      updateMode(
        value === 'sequence' ||
          value === 'class' ||
          value === 'activity' ||
          value === 'swimlane'
          ? value
          : 'use-case',
      );
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const [focus, setFocus] = useState<FlowFocus>('main');
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [selectedClass, setSelectedClass] = useState<DepthClass | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [diagramFullscreen, setDiagramFullscreen] = useState(false);
  const [zoom, setZoom] = useState(130);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(filterOptions.map((item) => item.id)),
  );
  const platform =
    depthPlatforms.find((item) => item.id === platformId) ?? depthPlatforms[0];
  const scenario =
    platform.scenarios.find((item) => item.id === scenarioId) ??
    platform.scenarios[0];
  const model = getDepthModel(scenario, depth);
  const visibleActors = model.actors.filter((item) =>
    activeFilters.has(item.role),
  );
  const visibleCases = model.cases.filter((item) => {
    const matchesQuery =
      !query ||
      `${item.id} ${item.name}`.toLowerCase().includes(query.toLowerCase());
    const tagMatch = item.tags.some((tag) => activeFilters.has(tag));
    return matchesQuery && tagMatch;
  });
  const visibleIds = new Set([
    ...visibleActors.map((item) => item.id),
    ...visibleCases.map((item) => item.id),
  ]);
  const visibleRelationships = model.relationships.filter(
    (item) => visibleIds.has(item.source) && visibleIds.has(item.target),
  );
  const tier = depthOrder[depth];
  const sequenceMessages = scenario.sequence[focus].filter(
    (item) =>
      item.tier <= tier &&
      model.participants.some((part) => part.id === item.from) &&
      model.participants.some((part) => part.id === item.to),
  );
  const selectedSequence =
    selectedMessage === null
      ? null
      : (sequenceMessages[selectedMessage] ?? null);
  const visibleClasses = model.classes.filter(
    (item) =>
      !query ||
      `${item.label} ${item.stereotype} ${item.responsibility}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const visibleClassIds = new Set(visibleClasses.map((item) => item.id));
  const visibleClassRelationships = model.classRelationships.filter(
    (item) =>
      visibleClassIds.has(item.source) && visibleClassIds.has(item.target),
  );
  const evidence =
    platformEvidence[platform.id]?.[scenario.id] ??
    platformEvidence[platform.id]?.overview ??
    [];
  function changePlatform(nextId: string) {
    const next =
      depthPlatforms.find((item) => item.id === nextId) ?? depthPlatforms[0];
    setPlatformId(next.id);
    setScenarioId(next.scenarios[0].id);
    setSelected(null);
    setSelectedClass(null);
    setSelectedMessage(null);
    setQuery('');
    const url = new URL(window.location.href);
    url.searchParams.set('platform', next.id);
    url.searchParams.set('scenario', next.scenarios[0].id);
    window.history.pushState(null, '', url);
  }
  function changeScenario(nextId: string) {
    setScenarioId(nextId);
    setSelected(null);
    setSelectedClass(null);
    setSelectedMessage(null);
    setQuery('');
    const url = new URL(window.location.href);
    url.searchParams.set('scenario', nextId);
    window.history.pushState(null, '', url);
  }
  function toggleFilter(id: string) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelected(null);
    setSelectedClass(null);
  }
  function changeDepth(next: LabDepth) {
    setDepth(next);
    setSelected(null);
    setSelectedClass(null);
    setSelectedMessage(null);
    const url = new URL(window.location.href);
    url.searchParams.set('depth', next);
    window.history.pushState(null, '', url);
  }
  return (
    <main className="depth-lab-page">
      <header className="depth-lab-header">
        <a href={`/courses/${courseSlug}`}>
          <ArrowLeft aria-hidden="true" />
          {thapar ? 'UCS503' : 'Software Engineering'}
        </a>
        <div>
          <span>INTERACTIVE UML EXPLORER</span>
          <strong>USE CASE / SEQUENCE / CLASS / ACTIVITY / SWIMLANE</strong>
        </div>
        <a
          href="https://app.notion.com/p/3c5d9c83df008141b765e2b8b2f021ed"
          target="_blank"
          rel="noreferrer"
        >
          Teaching notes <BookOpen aria-hidden="true" />
        </a>
      </header>
      <section className="depth-control-deck">
        <label>
          <span>Platform</span>
          <div>
            <select
              value={platform.id}
              onChange={(event) => changePlatform(event.target.value)}
            >
              {depthPlatforms.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" />
          </div>
        </label>
        <div className="depth-switch">
          <span>Depth</span>
          <div>
            {(['classroom', 'system', 'exhaustive'] as LabDepth[]).map(
              (item) => (
                <button
                  type="button"
                  className={depth === item ? 'active' : ''}
                  onClick={() => changeDepth(item)}
                  key={item}
                >
                  {depthCopy[item].label}
                  <small>
                    {item === 'classroom' ? 'A' : item === 'system' ? 'B' : 'C'}
                  </small>
                </button>
              ),
            )}
          </div>
        </div>
        <label className="diagram-picker">
          <span>Diagram</span>
          <div>
            <select
              value={mode}
              onChange={(event) => {
                const next = event.target.value as DiagramMode;
                setMode(next);
                setSelected(null);
                setSelectedClass(null);
                setSelectedMessage(null);
              }}
            >
              <option value="use-case">Use Case Diagram</option>
              <option value="sequence">Sequence Diagram</option>
              <option value="class">Class Diagram</option>
              <option value="activity">Activity Diagram</option>
              <option value="swimlane">Swimlane Diagram</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </div>
        </label>
      </section>
      <section className="depth-platform-strip">
        <div>
          <span>{platform.category}</span>
          <h1>{platform.name}</h1>
          <p>{platform.description}</p>
          <small>
            Individual product model with scenario-specific actors and official
            source notes.
          </small>
        </div>
        <div>
          <strong>{platform.scenarios.length}</strong>
          <span>functional scenarios</span>
        </div>
        <div>
          <strong>
            {mode === 'class'
              ? model.classes.length
              : mode === 'activity' || mode === 'swimlane'
                ? model.cases.length
                : model.actors.length}
          </strong>
          <span>
            {mode === 'class'
              ? 'classes in this model'
              : mode === 'activity' || mode === 'swimlane'
                ? 'available processes'
                : 'actors in this model'}
          </span>
        </div>
        <div>
          <strong>
            {mode === 'class'
              ? model.classRelationships.length
              : model.cases.length}
          </strong>
          <span>
            {mode === 'class'
              ? 'class relationships'
              : 'use cases in this model'}
          </span>
        </div>
        <div>
          <strong>
            {mode === 'class'
              ? model.classes.reduce(
                  (total, item) => total + item.operations.length,
                  0,
                )
              : mode === 'activity' || mode === 'swimlane'
                ? model.cases.reduce(
                    (total, item) => total + item.mainFlow.length,
                    0,
                  )
                : model.relationships.length}
          </strong>
          <span>
            {mode === 'class'
              ? 'operations shown'
              : mode === 'activity' || mode === 'swimlane'
                ? 'main flow actions'
                : 'relationships'}
          </span>
        </div>
      </section>
      <div className="depth-lab-layout">
        <div className="depth-lab-main">
          <section className="scenario-picker-bar">
            <label>
              <span>Scenario</span>
              <div>
                <select
                  value={scenario.id}
                  onChange={(event) => changeScenario(event.target.value)}
                >
                  {platform.scenarios.map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {String(index + 1).padStart(2, '0')} {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </label>
            <p>
              {String(
                platform.scenarios.findIndex(
                  (item) => item.id === scenario.id,
                ) + 1,
              ).padStart(2, '0')}{' '}
              of {platform.scenarios.length} verified scenario groups
            </p>
          </section>
          <section className="scenario-heading">
            <div>
              <span>{scenario.id.toUpperCase()}</span>
              <h2>{scenario.name}</h2>
              <p>{scenario.description}</p>
            </div>
            <aside>
              <strong>{depthCopy[depth].label}</strong>
              <p>{depthCopy[depth].purpose}</p>
            </aside>
          </section>
          {mode === 'use-case' ? (
            <>
              <section className="filter-deck">
                <div className="filter-heading">
                  <Filter aria-hidden="true" />
                  <span>Diagram filters</span>
                </div>
                <div className="filter-search">
                  <Search aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find a use case or ID"
                    aria-label="Find a use case or ID"
                  />
                </div>
                <div className="filter-action-row">
                  <div className="filter-toggles">
                    {filterOptions.map((item) => (
                      <button
                        type="button"
                        className={activeFilters.has(item.id) ? 'active' : ''}
                        onClick={() => toggleFilter(item.id)}
                        key={item.id}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="reset-filters"
                    onClick={() => {
                      setActiveFilters(
                        new Set(filterOptions.map((item) => item.id)),
                      );
                      setQuery('');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              </section>
              <section
                className={`depth-workbench ${diagramFullscreen ? 'diagram-fullscreen' : ''}`}
              >
                <div className="depth-diagram-surface">
                  <div className="depth-surface-heading">
                    <div>
                      <span>UML USE CASE LAYER</span>
                      <h3>{visibleCases.length} visible use cases</h3>
                      <p className="diagram-focus-note">
                        All visible actors are connected to their goals. Select
                        one actor or use case to focus its associations. Actor
                        count follows participation, not a classroom quota.
                      </p>
                    </div>
                    <div className="diagram-view-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.max(80, value - 15))
                        }
                        aria-label="Zoom out"
                      >
                        <ZoomOut aria-hidden="true" />
                      </button>
                      <strong>{zoom}%</strong>
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.min(170, value + 15))
                        }
                        aria-label="Zoom in"
                      >
                        <ZoomIn aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiagramFullscreen((value) => !value)}
                      >
                        {diagramFullscreen ? (
                          <Minimize2 aria-hidden="true" />
                        ) : (
                          <Maximize2 aria-hidden="true" />
                        )}
                        {diagramFullscreen ? 'Exit full screen' : 'Full screen'}
                      </button>
                    </div>
                  </div>
                  <UseCaseDiagram
                    scenario={scenario}
                    depth={depth}
                    visibleCases={visibleCases}
                    visibleActors={visibleActors}
                    relationships={visibleRelationships}
                    activeFilters={activeFilters}
                    selected={selected}
                    onSelect={setSelected}
                    zoom={zoom}
                  />
                </div>
                {selected?.type === 'actor' ? (
                  <ActorDetails
                    actor={selected.value}
                    scenario={scenario}
                    cases={visibleCases}
                  />
                ) : selected?.type === 'case' ? (
                  <CaseDetails
                    item={selected.value}
                    actors={model.actors}
                    scenario={scenario}
                  />
                ) : (
                  <EmptyDetails />
                )}
              </section>
              <section className="relationship-teaching">
                <div>
                  <span>RELATIONSHIP TYPES</span>
                  <h2>Every line needs a modelling reason.</h2>
                </div>
                <div>
                  <article>
                    <i className="legend-solid" />
                    <h3>Association</h3>
                    <p>
                      An actor communicates with a use case across the boundary.
                    </p>
                  </article>
                  <article>
                    <i className="legend-dashed" />
                    <h3>«include»</h3>
                    <p>
                      The base normally requires reusable behaviour in the
                      stated scope.
                    </p>
                  </article>
                  <article>
                    <i className="legend-dashed" />
                    <h3>«extend»</h3>
                    <p>
                      Optional or conditional behaviour extends a base goal that
                      can finish without it.
                    </p>
                  </article>
                  <article>
                    <i className="legend-triangle" />
                    <h3>Generalization</h3>
                    <p>
                      A specialized actor inherits the goals and associations of
                      a broader actor.
                    </p>
                  </article>
                </div>
              </section>
            </>
          ) : mode === 'sequence' ? (
            <>
              <section className="sequence-controls">
                <div>
                  <span>FLOW FOCUS</span>
                  <div>
                    {(['main', 'failure', 'background'] as FlowFocus[]).map(
                      (item) => (
                        <button
                          type="button"
                          className={focus === item ? 'active' : ''}
                          onClick={() => {
                            setFocus(item);
                            setSelectedMessage(null);
                          }}
                          key={item}
                        >
                          {item === 'main'
                            ? 'Main success'
                            : item === 'failure'
                              ? 'Alternate and failure'
                              : 'Async effects'}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <aside>
                  <span>SCENARIO CONTRACT</span>
                  <p>
                    <strong>Precondition:</strong>{' '}
                    {model.cases[0]?.preconditions[0]}
                  </p>
                  <p>
                    <strong>Trigger:</strong> {model.cases[0]?.trigger}
                  </p>
                  <p>
                    <strong>Postcondition:</strong>{' '}
                    {model.cases[0]?.postconditions[0]}
                  </p>
                </aside>
              </section>
              <section
                className={`depth-workbench ${diagramFullscreen ? 'diagram-fullscreen' : ''}`}
              >
                <div className="depth-diagram-surface">
                  <div className="depth-surface-heading">
                    <div>
                      <span>SEQUENCE LAYER / {focus.toUpperCase()}</span>
                      <h3>
                        {model.participants.length} lifelines,{' '}
                        {sequenceMessages.length} messages
                      </h3>
                    </div>
                    <div className="diagram-view-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.max(80, value - 15))
                        }
                        aria-label="Zoom out"
                      >
                        <ZoomOut aria-hidden="true" />
                      </button>
                      <strong>{zoom}%</strong>
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.min(170, value + 15))
                        }
                        aria-label="Zoom in"
                      >
                        <ZoomIn aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiagramFullscreen((value) => !value)}
                      >
                        {diagramFullscreen ? (
                          <Minimize2 aria-hidden="true" />
                        ) : (
                          <Maximize2 aria-hidden="true" />
                        )}
                        {diagramFullscreen ? 'Exit full screen' : 'Full screen'}
                      </button>
                    </div>
                  </div>
                  <SequenceDiagram
                    scenario={scenario}
                    depth={depth}
                    focus={focus}
                    selectedIndex={selectedMessage}
                    onSelect={setSelectedMessage}
                    zoom={zoom}
                  />
                </div>
                <SequenceDetails
                  item={selectedSequence}
                  scenario={scenario}
                  depth={depth}
                  focus={focus}
                />
              </section>
            </>
          ) : mode === 'class' ? (
            <>
              <section className="class-controls">
                <div>
                  <Search aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSelectedClass(null);
                    }}
                    placeholder="Find a class, stereotype or responsibility"
                    aria-label="Find a class, stereotype or responsibility"
                  />
                </div>
                <p>
                  The class count follows the scenario. It is not forced to a
                  fixed number.
                </p>
              </section>
              <section
                className={`depth-workbench ${diagramFullscreen ? 'diagram-fullscreen' : ''}`}
              >
                <div className="depth-diagram-surface">
                  <div className="depth-surface-heading">
                    <div>
                      <span>UML CLASS LAYER</span>
                      <h3>
                        {visibleClasses.length} classes,{' '}
                        {visibleClassRelationships.length} relationships
                      </h3>
                      <p className="diagram-focus-note">
                        Select a class to isolate its structural relationships
                        and modelling reason.
                      </p>
                    </div>
                    <div className="diagram-view-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.max(80, value - 15))
                        }
                        aria-label="Zoom out"
                      >
                        <ZoomOut aria-hidden="true" />
                      </button>
                      <strong>{zoom}%</strong>
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((value) => Math.min(170, value + 15))
                        }
                        aria-label="Zoom in"
                      >
                        <ZoomIn aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiagramFullscreen((value) => !value)}
                      >
                        {diagramFullscreen ? (
                          <Minimize2 aria-hidden="true" />
                        ) : (
                          <Maximize2 aria-hidden="true" />
                        )}
                        {diagramFullscreen ? 'Exit full screen' : 'Full screen'}
                      </button>
                    </div>
                  </div>
                  <ClassDiagram
                    scenario={scenario}
                    depth={depth}
                    classes={visibleClasses}
                    relationships={visibleClassRelationships}
                    selected={selectedClass}
                    onSelect={setSelectedClass}
                    zoom={zoom}
                  />
                </div>
                <ClassDetails
                  item={selectedClass}
                  relationships={visibleClassRelationships}
                  classes={visibleClasses}
                />
              </section>
              <section className="relationship-teaching class-relationship-teaching">
                <div>
                  <span>CLASS RELATIONSHIPS</span>
                  <h2>Ownership and multiplicity must be defendable.</h2>
                </div>
                <div>
                  <article>
                    <i className="legend-solid" />
                    <h3>Association</h3>
                    <p>Objects know or communicate with each other.</p>
                  </article>
                  <article>
                    <i className="legend-diamond" />
                    <h3>Aggregation</h3>
                    <p>The part may continue without the whole.</p>
                  </article>
                  <article>
                    <i className="legend-filled-diamond" />
                    <h3>Composition</h3>
                    <p>The whole controls the lifecycle of the part.</p>
                  </article>
                  <article>
                    <i className="legend-dashed" />
                    <h3>Dependency</h3>
                    <p>One class temporarily uses another abstraction.</p>
                  </article>
                </div>
              </section>
            </>
          ) : mode === 'activity' ? (
            <ActivityDiagramLab
              key={`${platform.id}-${scenario.id}-${depth}-activity`}
              scenario={scenario}
              cases={model.cases}
            />
          ) : (
            <SwimlaneDiagramLab
              key={`${platform.id}-${scenario.id}-${depth}-swimlane`}
              scenario={scenario}
              cases={model.cases}
              actors={model.actors}
            />
          )}
          <section className="evidence-deck">
            <div className="evidence-heading">
              <div>
                <span>OFFICIAL EVIDENCE AND SCOPE</span>
                <h2>What supports this model.</h2>
              </div>
              <p>
                Public product behaviour is shown as fact. Internal services are
                labelled as teaching models unless the product owner documents
                them.
              </p>
            </div>
            <div className="evidence-grid">
              {evidence.map((item) => (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  key={item.url}
                >
                  <small>{item.confidence}</small>
                  <h3>{item.label}</h3>
                  <p>{item.proves}</p>
                  <span>
                    Open official source <ExternalLink aria-hidden="true" />
                  </span>
                </a>
              ))}
              <a
                href="https://app.notion.com/p/3c5d9c83df008141b765e2b8b2f021ed"
                target="_blank"
                rel="noreferrer"
                className="teaching-note-card"
              >
                <small>course material</small>
                <h3>Teaching notes</h3>
                <p>
                  Open the current Notion teaching pack. PDF notes can be
                  attached here when finalized.
                </p>
                <span>
                  Open notes <FileText aria-hidden="true" />
                </span>
              </a>
            </div>
            {platform.id === 'instagram' && scenario.id === 'overview' && (
              <aside>
                Logged-out behaviour can vary by content eligibility, session,
                region and the current web experience. This model therefore
                limits Visitor to eligible public previews and account entry. It
                never grants Visitor registered-user actions.
              </aside>
            )}
          </section>
          <section className="architecture-bridge">
            <div className="architecture-heading">
              <div>
                <span>SYSTEM DESIGN LAYER</span>
                <h2>How this capability may be implemented.</h2>
              </div>
              <p>
                Conceptual representation based on observable product behaviour
                and common large-scale architecture. Proprietary internals are
                not presented as fact.
              </p>
            </div>
            <div className="architecture-flow">
              {scenario.architecture.map((item, index) => (
                <article key={item.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Boxes aria-hidden="true" />
                  <h3>{item.label}</h3>
                  <p>{item.responsibility}</p>
                  <small>{item.technology}</small>
                  <Confidence value={item.confidence} />
                </article>
              ))}
            </div>
            <aside>
              <ShieldCheck aria-hidden="true" />
              <p>
                <strong>Do not turn these into actors.</strong> Services,
                databases, queues and algorithms are inside the system boundary.
                They belong here or as sequence lifelines, not as stick figures
                in the UML use case layer.
              </p>
            </aside>
          </section>
          <section className="knowledge-key">
            <div>
              <span>KNOWLEDGE LABELS</span>
              <h2>What we know, and what we are modelling.</h2>
            </div>
            {(
              [
                'observable',
                'documented',
                'conceptual',
                'unknown',
              ] as KnowledgeLevel[]
            ).map((item) => (
              <article key={item}>
                <Confidence value={item} />
                <p>{confidenceCopy[item]}</p>
              </article>
            ))}
          </section>
          <section className="depth-roadmap">
            <div className="active">
              <Network aria-hidden="true" />
              <span>01</span>
              <h3>Use Case</h3>
              <p>Who wants what from the system?</p>
            </div>
            <div className="active">
              <Route aria-hidden="true" />
              <span>02</span>
              <h3>Sequence</h3>
              <p>How do participants collaborate over time?</p>
            </div>
            <div className="active">
              <Boxes aria-hidden="true" />
              <span>03</span>
              <h3>Class</h3>
              <p>Which structures support the messages?</p>
            </div>
            <div>
              <Workflow aria-hidden="true" />
              <span>04</span>
              <h3>Activity</h3>
              <p>Which choices and parallel paths exist?</p>
            </div>
          </section>
        </div>
      </div>
      <section className="depth-final-note">
        <div>
          <span>DEPTH PROGRESSION</span>
          <h2>The scenario stays fixed. The model grows.</h2>
        </div>
        <p>
          Switch between Classroom, System Design and Near Exhaustive while
          keeping the same scenario selected. Actors, use cases, relationships,
          sequence lifelines and domain classes expand in place.
        </p>
        <Button
          onClick={() => {
            setMode(
              mode === 'use-case'
                ? 'sequence'
                : mode === 'sequence'
                  ? 'class'
                  : 'use-case',
            );
            setSelected(null);
            setSelectedClass(null);
            setSelectedMessage(null);
          }}
        >
          {mode === 'use-case'
            ? 'Open the sequence view'
            : mode === 'sequence'
              ? 'Open the class view'
              : 'Return to the use case view'}
        </Button>
      </section>
    </main>
  );
}
