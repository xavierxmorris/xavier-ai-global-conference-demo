# Captured D1 evidence and measurement boundaries

These are historical captures from 10 November 2026 UTC, not live API responses. No D1 work is performed when these files or the canvases are opened.

| File | Meaning |
|---|---|
| `conference-d1-before-rerun-2026-11-10.json` | Five stored run records before this conversation's rerun: 12 reads / 3 writes each, eight pulses |
| `conference-d1-snapshot-2026-11-10.json` | After rerun: five sessions, five updated run records, thirteen pulses, captured daily quota |
| `v1-extension.mjs` | Exact original project extension retained as source history, not auto-loaded or standalone runnable |

Account/database routing IDs were omitted from the two exported snapshots; demo rows and measurements were retained. No credentials, account profile export, browser state, private system prompts, or raw session logs are included. The original v1 extension already existed publicly; its hard-coded routing IDs are retained for provenance, not authentication.

## The rerun

Each workload incremented one vote, inserted one attendee pulse, and inserted/replaced its run record. D1 response metadata was captured and then written back in a separate telemetry update.

| Run | Scenario surface label | Session | Final votes | Colo | Workload reads | Workload writes | Workload SQL ms | Execution UTC |
|---|---|---|---:|---|---:|---:|---:|---|
| 1 | Copilot CLI | KEY-01 | 44 | SYD | 3 | 4 | 0.3703 | 22:37:03 |
| 2 | Copilot App | TRK-02 | 33 | SYD | 3 | 4 | 0.5441 | 22:37:56 |
| 3 | Copilot Canvas | TRK-03 | 26 | SYD | 3 | 4 | 0.4276 | 22:37:56 |
| 4 | Copilot CLI | TRK-04 | 21 | SYD | 3 | 4 | 0.3379 | 22:37:57 |
| 5 | Copilot App | TRK-05 | 30 | SYD | 3 | 4 | 0.3936 | 22:37:57 |
| Total | | | | | 15 | 20 | 2.0735 | |

The `surface` values are preserved scenario labels. All five rerun workloads were submitted through the same Copilot App Cloudflare MCP connection. They do not independently prove execution from CLI/App/Canvas clients. Run 4's scenario refers to the earlier OAuth scope probe; replaying its SQL does not repeat that probe.

## Do not mix these counters

| Boundary | Reads | Writes | Meaning |
|---|---:|---:|---|
| Five workload batches | 15 | 20 | The values in `demoRuns`; excludes saving their measured telemetry |
| Separate telemetry persistence | 5 | 5 | One metadata update per run |
| Preflight and verification | 41 | 0 | Queries around execution |
| Full measured operation | 61 | 25 | Workload + telemetry + verification |
| Native account-wide day | 187 | 68 | All D1 activity that UTC day, including earlier activity |

The snapshot data was retrieved at 22:39 UTC. Native D1 and account analytics matched at 187 reads / 68 writes by 22:43 UTC. The quota date is **2026-11-10**, not the viewer's current day. Database storage observed then was 32,768 bytes.

Free daily allowances recorded at the time were 5,000,000 reads and 100,000 writes, resetting at 00:00 UTC. Account-wide usage was 0.00374% and 0.068% respectively. The full operation used 0.00122% and 0.025%. These observations fit the free quota; they are not a future pricing guarantee or a complete billing statement.

Source: [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), checked 10 November 2026 (page updated 30 October 2026 in the original investigation). This publication does not re-query billing or consume more D1 quota.

## Earlier figures

The original repository claimed 13 reads / 4 writes per run (65 / 20 total). The first live read instead found stored values of 12 / 3 per run (60 / 15 total). The fresh rerun measured 3 / 4 per workload batch.

These are different captures and measurement boundaries, not values to silently overwrite as if they were one execution. The original report remains at [live-5-runs-2026-11-10.md](../live-5-runs-2026-11-10.md), explicitly marked historical/superseded. `sql/five-runs.sql` also contains the old literal telemetry; executing it does not measure new usage by itself.

The signed-in native dashboard showed no custom dashboards and no Workers/Pages projects in the inspected account. The conference canvases were local Copilot/browser views, not deployed Cloudflare dashboards. The Worker source remains a deployment option, not proof of deployment.
