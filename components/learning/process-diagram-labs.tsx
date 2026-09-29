'use client';

import { useMemo, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

import {
  buildActivityFlow,
  buildSwimlaneFlow,
  type ActivityNode,
  type SwimlaneStep,
} from '@/lib/process-diagram-engine';
import type { DepthActor, DepthCase, DepthScenario } from '@/lib/uml-depth-lab';

function CasePicker({
  cases,
  value,
  onChange,
}: {
  cases: DepthCase[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="process-case-picker">
      <span>Use case carried into this diagram</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {cases.map((item) => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProcessDetails({ item }: { item: ActivityNode | null }) {
  if (!item)
    return (
      <aside className="depth-detail-panel empty-depth-detail">
        <span>SELECT A NODE</span>
        <h2>Every activity needs a reason.</h2>
        <p>
          Select a node to inspect whether it is an action, decision, fork,
          join, start or end state.
        </p>
      </aside>
    );
  return (
    <aside className="depth-detail-panel">
      <div className="detail-panel-kicker">{item.kind.toUpperCase()}</div>
      <h2>{item.label}</h2>
      <p>{item.detail}</p>
      <dl className="depth-facts">
        <div>
          <dt>Why it exists</dt>
          <dd>
            {item.kind === 'decision'
              ? 'The outgoing guards represent mutually understood outcomes.'
              : item.kind === 'fork'
                ? 'Independent work may begin from this point.'
                : item.kind === 'join'
                  ? 'Required parallel work must be synchronized here.'
                  : 'It advances the selected use-case goal.'}
          </dd>
        </div>
        <div>
          <dt>Knowledge label</dt>
          <dd>{item.confidence}</dd>
        </div>
      </dl>
    </aside>
  );
}

export function ActivityDiagramLab({
  scenario,
  cases,
}: {
  scenario: DepthScenario;
  cases: DepthCase[];
}) {
  const [caseId, setCaseId] = useState(cases[0]?.id ?? '');
  const [selected, setSelected] = useState<ActivityNode | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const item = cases.find((candidate) => candidate.id === caseId) ?? cases[0];
  const flow = useMemo(() => (item ? buildActivityFlow(item) : null), [item]);
  if (!item || !flow) return <p>No use case is available at this depth.</p>;
  return (
    <>
      <section className="process-controls">
        <CasePicker
          cases={cases}
          value={item.id}
          onChange={(id) => {
            setCaseId(id);
            setSelected(null);
          }}
        />
        <div>
          <strong>{flow.nodes.length}</strong> main nodes
          <strong>{flow.alternate.length}</strong> alternate or exception paths
          <strong>{flow.parallel.length}</strong> supporting branches
        </div>
      </section>
      <section
        className={`depth-workbench ${fullscreen ? 'diagram-fullscreen' : ''}`}
      >
        <div className="depth-diagram-surface">
          <div className="depth-surface-heading">
            <div>
              <span>UML ACTIVITY LAYER</span>
              <h3>{item.name}</h3>
              <p className="diagram-focus-note">
                Main flow, guarded alternatives and supporting work come from
                the selected use-case specification.
              </p>
            </div>
            <button
              type="button"
              className="process-fullscreen"
              onClick={() => setFullscreen((value) => !value)}
            >
              {fullscreen ? (
                <Minimize2 aria-hidden="true" />
              ) : (
                <Maximize2 aria-hidden="true" />
              )}
              {fullscreen ? 'Exit full screen' : 'Full screen'}
            </button>
          </div>
          <div
            className="activity-canvas"
            aria-label={`${scenario.name} activity diagram`}
          >
            <div className="activity-main-flow">
              {flow.nodes.map((node, index) => (
                <div className="activity-node-wrap" key={node.id}>
                  <button
                    type="button"
                    className={`activity-node activity-${node.kind} ${selected?.id === node.id ? 'selected' : ''}`}
                    onClick={() => setSelected(node)}
                  >
                    <small>{node.kind}</small>
                    <strong>{node.label}</strong>
                  </button>
                  {index < flow.nodes.length - 1 && (
                    <span className="activity-arrow">↓</span>
                  )}
                </div>
              ))}
            </div>
            <aside className="activity-branches">
              <div>
                <span>GUARDED ALTERNATIVES</span>
                {flow.alternate.length ? (
                  flow.alternate.map((branch) => (
                    <article key={branch.label}>
                      <strong>{branch.label}</strong>
                      <p>{branch.steps.join(' ')}</p>
                      <small>
                        {branch.returnsToMain
                          ? 'Returns to the main flow'
                          : 'Ends or reports failure'}
                      </small>
                    </article>
                  ))
                ) : (
                  <p>No alternate path is stated for this use case.</p>
                )}
              </div>
              <div>
                <span>PARALLEL OR SUPPORTING WORK</span>
                {flow.parallel.length ? (
                  flow.parallel.map((branch) => (
                    <article key={branch.label}>
                      <strong>{branch.label}</strong>
                      <p>{branch.steps.join(' → ')}</p>
                    </article>
                  ))
                ) : (
                  <p>No parallel supporting work is stated.</p>
                )}
              </div>
              <p className="process-rule">
                Loop detected from the written flow:{' '}
                <strong>{flow.hasLoop ? 'yes' : 'no'}</strong>. Do not draw a
                loop only because the symbol is available.
              </p>
            </aside>
          </div>
        </div>
        <ProcessDetails item={selected} />
      </section>
    </>
  );
}

function SwimlaneDetails({
  item,
  lane,
}: {
  item: SwimlaneStep | null;
  lane?: { label: string; reason: string };
}) {
  if (!item)
    return (
      <aside className="depth-detail-panel empty-depth-detail">
        <span>SELECT AN ACTIVITY</span>
        <h2>A lane means responsibility.</h2>
        <p>
          Select an activity to inspect why that participant owns it and where
          the next handoff occurs.
        </p>
      </aside>
    );
  return (
    <aside className="depth-detail-panel">
      <div className="detail-panel-kicker">OWNER</div>
      <h2>{lane?.label}</h2>
      <p>{lane?.reason}</p>
      <dl className="depth-facts">
        <div>
          <dt>Activity</dt>
          <dd>{item.label}</dd>
        </div>
        <div>
          <dt>Assignment reason</dt>
          <dd>{item.detail}</dd>
        </div>
      </dl>
    </aside>
  );
}

export function SwimlaneDiagramLab({
  scenario,
  cases,
  actors,
}: {
  scenario: DepthScenario;
  cases: DepthCase[];
  actors: DepthActor[];
}) {
  const [caseId, setCaseId] = useState(cases[0]?.id ?? '');
  const [selected, setSelected] = useState<SwimlaneStep | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const item = cases.find((candidate) => candidate.id === caseId) ?? cases[0];
  const flow = useMemo(
    () => (item ? buildSwimlaneFlow(item, actors) : null),
    [item, actors],
  );
  if (!item || !flow) return <p>No use case is available at this depth.</p>;
  const lane = flow.lanes.find((candidate) => candidate.id === selected?.lane);
  return (
    <>
      <section className="process-controls">
        <CasePicker
          cases={cases}
          value={item.id}
          onChange={(id) => {
            setCaseId(id);
            setSelected(null);
          }}
        />
        <div>
          <strong>{flow.lanes.length}</strong> responsibility lanes
          <strong>{flow.steps.length}</strong> activities
          <strong>{flow.handoffs}</strong> ownership handoffs
        </div>
      </section>
      <section
        className={`depth-workbench ${fullscreen ? 'diagram-fullscreen' : ''}`}
      >
        <div className="depth-diagram-surface">
          <div className="depth-surface-heading">
            <div>
              <span>UML SWIMLANE LAYER</span>
              <h3>{item.name}</h3>
              <p className="diagram-focus-note">
                Read downward for time and across lanes for responsibility
                changes.
              </p>
            </div>
            <button
              type="button"
              className="process-fullscreen"
              onClick={() => setFullscreen((value) => !value)}
            >
              {fullscreen ? (
                <Minimize2 aria-hidden="true" />
              ) : (
                <Maximize2 aria-hidden="true" />
              )}
              {fullscreen ? 'Exit full screen' : 'Full screen'}
            </button>
          </div>
          <div className="swimlane-scroll">
            <div
              className="swimlane-canvas"
              style={{
                gridTemplateColumns: `72px repeat(${flow.lanes.length}, minmax(210px, 1fr))`,
              }}
              aria-label={`${scenario.name} swimlane diagram`}
            >
              <div className="swimlane-corner">STEP</div>
              {flow.lanes.map((item) => (
                <div className="swimlane-header" key={item.id}>
                  <strong>{item.label}</strong>
                  <small>{item.id}</small>
                </div>
              ))}
              {flow.steps.map((step, row) => (
                <div className="swimlane-row" key={step.id}>
                  <div className="swimlane-number">
                    {String(row + 1).padStart(2, '0')}
                  </div>
                  {flow.lanes.map((candidate) => (
                    <div className="swimlane-cell" key={candidate.id}>
                      {candidate.id === step.lane && (
                        <button
                          type="button"
                          className={selected?.id === step.id ? 'selected' : ''}
                          onClick={() => setSelected(step)}
                        >
                          {step.label}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <SwimlaneDetails item={selected} lane={lane} />
      </section>
      <section className="relationship-teaching">
        <div>
          <span>OWNERSHIP CHECK</span>
          <h2>A handoff is where coordination risk appears.</h2>
        </div>
        <div>
          <article>
            <h3>Actor lane</h3>
            <p>Contains choices or actions performed outside the software.</p>
          </article>
          <article>
            <h3>Boundary lane</h3>
            <p>Accepts input and presents visible feedback.</p>
          </article>
          <article>
            <h3>Service lane</h3>
            <p>Applies domain rules and coordinates state.</p>
          </article>
          <article>
            <h3>External lane</h3>
            <p>
              Contains behaviour owned by a supporting system or organization.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
