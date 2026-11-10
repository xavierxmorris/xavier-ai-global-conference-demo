# Conference demo and canvas history

This is the reusable, task-relevant history of the conference demonstration, through 11 November 2026 (Sydney local date). It is a curated account of user requests, implementation choices, outcomes, and limitations, not a verbatim export of private chat or tool logs.

## Version map

| Version | Origin | Preserved content | Use |
|---|---|---|---|
| v1 | Original repository, commit `68c0832` | `canvas/index.html`; original extension at `results/history/v1-extension.mjs`; original SQL and evidence | Historical local interactive replay |
| v2 | First read-only session canvas, before story simplification | `canvas/v2/index.html` | Dense evidence dashboard with filters, recorded votes, five runs, pulses |
| v3 | Story-focused simplification | `canvas/v3/index.html` | Current default, five narrative chapters with run receipts and quota context |

The preceding session dashboard is **v2**, as requested. The newer story design is **v3**. v2/v3 share a portable read-only server and a captured snapshot. v1 remains available rather than being renamed or overwritten.

## 1. Original demonstration

The initial repository combined a D1 schema, seed data, five SQL run definitions, a proposed Worker API, an interactive HTML replay, presenter guides, and a project canvas extension.

The original HTML's run/upvote/reset buttons changed local state. The original extension's `run_rehearsal_step` changed only in-memory votes. Neither was a live D1 execution mechanism. Some original prose described those controls too strongly. Preserve that implementation for comparison, but do not use it as current proof of live SQL or account usage.

The original source remains in [commit 68c0832](https://github.com/xavierxmorris/xavier-ai-global-conference-demo/tree/68c0832).

## 2. Open the canvas and inspect five runs

User request:

> Open the xavier-ai-global-conference-canvas canvas and show the 5 Cloudflare D1 runs.

The conversation was outside the repository workspace, so the project extension was not discovered there. A session-scoped extension was created to serve the repository layout, patched into a read-only snapshot view. This became v2.

Changes from v1: load D1 snapshot JSON; remove replay/reset/run buttons; render votes as text; escape displayed content; retain track filters; relabel totals as recorded values rather than account usage; reject HTTP writes.

## 3. Query D1, not the hard-coded replay

User request:

> Query xavier-ai-global-conf-db via Cloudflare MCP for all 5 demo_runs and sessions.

The read returned five sessions and five stored run records. Stored run values were 12 reads / 3 writes per run, versus the repository's 13 / 4. Votes were 43, 32, 25, 20, and 29. This pre-rerun state is preserved in `results/history/conference-d1-before-rerun-2026-11-10.json`.

The discrepancy established why replay constants, stored telemetry, and fresh D1 API metadata must be identified separately.

## 4. Execute Runs 1-5 and report free-quota usage

User request:

> Execute Run 1 through Run 5 on xavier-ai-global-conf-db and report D1 free quota used.

All five workloads were submitted through Cloudflare MCP. Each added one vote and one pulse, then replaced its run record. Separate updates persisted the measured API telemetry. Final votes were 44, 33, 26, 21, and 30; the pulse feed grew from eight rows to thirteen.

The work measured 15 workload reads / 20 writes, plus 5 / 5 for telemetry, plus 41 reads for preflight/verification: **61 reads / 25 writes** overall. The captured account-wide day eventually showed **187 reads / 68 writes**. See [the full boundary table](results/history/README.md).

The scenario labels still say CLI, App, and Canvas. They describe the intended narrative, not distinct clients proven by this rerun.

## 5. Check the native Cloudflare dashboard

The signed-in browser showed the D1 database and daily usage. No custom dashboards and no Workers/Pages projects existed in the inspected account at that time. The conference board was local, not a deployed Cloudflare dashboard.

An earlier Workers Scripts API probe returned 403 because its OAuth scope was not granted, while D1 was accessible. That outcome is historical and scope-specific, not proof that every future connection is restricted or a generic security guarantee.

## 6. Simplify around stories

User request:

> Can you simplifed the Xavier AI global conference canvas and make it more focus with stories

The story-led v3 replaced the busy dashboard as the active session view without changing the repository at that point. It kept the D1 facts but led with five narrative chapters:

1. The keynote opens the canvas.
2. The App joins the same data.
3. The canvas keeps up.
4. The guardrails hold.
5. The rehearsal closes under quota.

Each chapter includes an attendee role, scenario surface, UTC timestamp, voted session, recorded vote count, and measured workload receipt. Daily account usage is separate; final votes are collapsed by default. Dark/light themes, reduced motion, escaped content, and an explicit snapshot failure state are retained.

The story beats are editorial retellings, not additional execution evidence. A clarification in the published v3 makes the single-connection and earlier-scope-probe limitations explicit.

## 7. Preserve v2 and publish reusable content

The user asked to keep the older canvas as v2 and push the canvases and history into this repository.

The pre-redesign renderer was recovered from the session's earlier file patch and applied to the unchanged v1 HTML. Its resulting v2 page is preserved, with only a relative snapshot URL for portability. The v3 story page is retained alongside it.

The project extension now exposes the existing canvas ID for v3 and `xavier-ai-global-conference-canvas-v2` for v2. A plain Node server provides the same pages without Copilot authentication, paid services, npm packages, or D1 calls. Both captures, version notes, presenter steps, prompts, and focused checks are included.

Excluded from this public package: OAuth material, account profile exports, raw chat/tool transcripts, browser state, local filesystem/session identifiers, internal instructions, and unrelated work. Existing public v1 content remains historical evidence; it is not promoted to current truth.

## Reuse

Start with [canvas instructions](canvas/README.md), then [presenter click-through](CLICK-THROUGH.md), [prompts](PROMPTS.md), and [captured run evidence](results/history/README.md).
