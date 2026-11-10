# Xavier AI Global Conference Demo

Five captured Cloudflare D1 runs, GitHub Copilot canvas extensions, and a reusable presenter walkthrough. The older evidence dashboard is preserved as **v2**; the simplified story-led canvas is **v3**, the default. The original **v1** local replay is retained.

```powershell
.\go.ps1                    # Open v3 story; Ctrl+C stops its read-only server
.\go.ps1 -CanvasVersion 2   # Open the preserved v2 dashboard
.\go.ps1 -CanvasVersion 1   # Original historical file-based replay
.\go.ps1 -Check             # Check packaged assets and captured workload totals
```

v2/v3 require Node.js 22+, with no npm dependencies or build step. They work without Cloudflare credentials. For a plain browser, run `node .\canvas\server.mjs` and open its printed loopback URL.

## Choose a canvas

| Version | Purpose | Copilot canvas ID / source |
|---|---|---|
| v1 | Historical interactive local replay, not live D1 execution | `canvas/index.html` |
| v2 | Preserved run table, agenda filters, recorded upvotes and pulses | `xavier-ai-global-conference-canvas-v2` / `canvas/v2/index.html` |
| v3 | Five story chapters, measured receipts, daily usage context, expandable votes | `xavier-ai-global-conference-canvas` / `canvas/v3/index.html` |

Open this repository in a canvas-capable Copilot workspace, load its project extension, and ask to open the corresponding canvas ID. The extension serves pages on `127.0.0.1` and exposes `get_conference_state`. v2/v3 are read-only: opening them never executes SQL.

## Reusable content

- [Canvas setup, standalone preview, and retargeting](canvas/README.md)
- [Version and conversation-derived history](HISTORY.md)
- [Presenter click-through](CLICK-THROUGH.md) and [three-minute run sheet](RUN-SHEET.md)
- [Copy-paste reuse prompts](PROMPTS.md)
- [Before/after D1 captures and measurement boundaries](results/history/README.md)
- [Original evidence report, marked superseded](results/live-5-runs-2026-11-10.md)

## Captured results, not current usage

The rerun occurred on **10 November 2026 UTC**, served from `SYD`. Both current canvases use the same committed post-rerun snapshot: five sessions, five run records, thirteen attendee pulses.

| Measurement boundary | Reads | Writes |
|---|---:|---:|
| Five workload batches, displayed in run receipts | 15 | 20 |
| Separate telemetry persistence | 5 | 5 |
| Preflight and verification queries | 41 | 0 |
| Full measured operation | 61 | 25 |
| Captured account-wide UTC day, including earlier activity | 187 | 68 |
| Recorded free daily allowances | 5,000,000 | 100,000 |

The captured operation fit the free quota. These counters are not interchangeable, a future pricing guarantee, or a full billing statement. [Evidence, per-run timings, and pricing source](results/history/README.md).

## Architecture

```text
Copilot workspace
  .github/extensions/xavier-ai-global-conference-canvas/extension.mjs
    -> canvas/server.mjs (read-only, loopback)
       -> canvas/v2/index.html or canvas/v3/index.html
       -> results/history/conference-d1-snapshot-2026-11-10.json

Separate live work: Copilot -> authenticated Cloudflare MCP -> D1
Optional deployment source: src/worker.js + wrangler.jsonc
```

## Honesty notes

- v1's replay controls and archived extension mutate local/in-memory state, not D1. v2/v3 remove write controls and reject HTTP writes.
- The stored surface names are scenario labels. All five latest rerun workloads used one Copilot App MCP connection; they do not prove execution from five different clients. Story beats are editorial retellings.
- The original report/SQL literals said 65 reads / 20 writes. A subsequent read found stored totals of 60 / 15; the fresh rerun measured workload totals of 15 / 20. Both snapshots and the discrepancy are preserved rather than silently conflated.
- `sql/five-runs.sql` still contains historical literal telemetry. Capture fresh D1 response metadata when running it; do not present its literals as new measurements.
- Native inspection found no custom dashboards or Workers/Pages projects in the inspected account. These canvases are local, not deployed Cloudflare dashboards.
- An earlier Workers Scripts probe returned 403 for ungranted scopes while D1 worked. Its historical outcome is not a new check on every replay.
- The public history is curated. No credentials, OAuth caches, raw private chat, browser state, or internal instructions are included.

## Checks

```powershell
.\go.ps1 -Check
node --test .\tests\canvas.test.mjs
```
