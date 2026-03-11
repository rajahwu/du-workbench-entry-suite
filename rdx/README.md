# RDX — Radiant Execution System

## Purpose

RDX is the operational execution layer for Radiant Systems.

Rdxt conducts inspection, execution, maintenance, validation, and reporting across the working environment.

RDX supports continuity of build operations by giving each action a clear trace:

* what was inspected
* what was executed
* what changed
* what remains
* what follows next

Intel comes from outside. Rdxt acts inside the system.

## Operational Role

Rdxt functions as the maintenance and execution arm of the system.

Primary activities include:

* inspect current state
* execute assigned task
* validate result
* record outcome
* hand findings back to operator or team

RDX operates through the CLI, scripts, and report artifacts.

## Directory Structure

```text
RDX/
├── README.md
├── REPORTS/       — Time-stamped records for inspections, executions, validations, repairs, sweeps, and AARs
├── RUNBOOK/       — Current procedures, mission state, operating notes, and doctrine
├── TODOS/         — Work items, owners, status, and next actions
├── SUGGESTIONS/   — Proposals, refactors, and future ideas for later review
├── DATA/          — Manifests, caches, scan artifacts, and supporting operational data
└── SCRIPTS/       — Executable utilities that support Rdxt activity
```

## Reporting Doctrine

Each Rdxt action produces a report.

Reports carry: timestamp, agent, action type, target, status, summary, findings, next action.

Filename pattern: `YYYY-MM-DD_HHMM_agent_action_target.md`

## Action Types

* inspection — observed current state
* execution — performed a task or script
* validation — checked result against expected behavior
* repair — fixed a defect or broken state
* sweep — broad scan across system area
* handoff — package of findings for another team or session
* aar — after action review

## Operating Posture

Rdxt works in clear, affirmative language. Inspect first, act with clarity, record outcome, hand off cleanly.
