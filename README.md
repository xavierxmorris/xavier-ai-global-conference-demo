# Xavier AI Global Conference Demo — Copilot CLI & App Canvas + Cloudflare Free Tier ($0)

A live, reproducible conference demo showing how **GitHub Copilot CLI** and **GitHub Copilot App** share a single **Cloudflare MCP server** (`https://mcp.cloudflare.com/mcp`) and a project **Copilot Canvas extension** (`.github/extensions/xavier-ai-global-conference-canvas/extension.mjs`) to build, query, and rehearse a live conference agenda and attendee pulse board on **Cloudflare's $0 Free Tier**.

```powershell
.\go.ps1          # Timed walkthrough + opens the interactive Conference Canvas
.\go.ps1 -Manual  # Presenter-paced walkthrough (press Enter per beat)
.\go.ps1 -Check   # Deterministic verification of all files + 5-run free quota math
```

- **Step-by-step presenter click-through:** [CLICK-THROUGH.md](CLICK-THROUGH.md)
- **3-minute stage run-sheet:** [RUN-SHEET.md](RUN-SHEET.md)
- **Copy-paste prompts for Copilot CLI & Copilot App:** [PROMPTS.md](PROMPTS.md)
- **Captured live evidence (10 Nov 2026, Sydney edge `SYD`):** [results/live-5-runs-2026-11-10.md](results/live-5-runs-2026-11-10.md)

---

## Architecture: One Canvas & One MCP Across Copilot CLI + Copilot App

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  Shared Config: ~/.copilot/mcp-config.json                                 │
│  "cloudflare": { "type": "http", "url": "https://mcp.cloudflare.com/mcp" } │
└───────────────────┬────────────────────────────────────┬───────────────────┘
                    │                                    │
                    ▼                                    ▼
     ┌──────────────────────────────┐     ┌──────────────────────────────┐
     │      GitHub Copilot CLI      │     │      GitHub Copilot App      │
     │   (Terminal agent + Canvas)  │     │    (Desktop UI + Canvas)     │
     └──────────────┬───────────────┘     └──────────────┬───────────────┘
                    │                                    │
                    ├─────────────────┬──────────────────┘
                    ▼                 ▼
     ┌─────────────────────────┐   ┌─────────────────────────────────────────┐
     │ Project Canvas Surface  │   │ Cloudflare MCP (cloudflare-execute)     │
     │ .github/extensions/...  │   │ D1 DB: xavier-ai-global-conf-db         │
     │ + canvas/index.html     │   │ UUID: b85fd8c0-b02b-4da6-86e2-... (SYD) │
     └─────────────────────────┘   └─────────────────────────────────────────┘
```

### How the Main Canvas builds & runs in both surfaces

1. **Copilot CLI & Copilot App Canvas Extension** (`.github/extensions/xavier-ai-global-conference-canvas/extension.mjs`):
   - Uses `@github/copilot-sdk/extension` (`joinSession` + `createCanvas`) to register the `xavier-ai-global-conference-canvas` canvas.
   - Serves `canvas/index.html` over an ephemeral loopback listener (`127.0.0.1:<port>`) whenever `open_canvas` is called in either **Copilot CLI** or **Copilot App**.
   - Exposes `get_conference_state` and `run_rehearsal_step` canvas actions so the agent can inspect and advance the 5 rehearsal runs directly from chat.
2. **Standalone / Offline Browser Replay** (`canvas/index.html` via `.\go.ps1`):
   - Opens straight from disk with zero paid services or local build steps required, preloaded with the 5 verified runs from Cloudflare D1 (`SYD`).

---

## Verified 5 Free Runs on Cloudflare D1 (`SYD`, 10 November 2026)

All 5 runs were executed live against Cloudflare account `07a1d926b6f5652ec24ee8979839e6c6` (`xavierxie31@gmail.com`) and D1 database `xavier-ai-global-conf-db` (`b85fd8c0-b02b-4da6-86e2-012ae7ff743d`, region `OC`, served by Sydney edge `SYD`):

| Run # | Surface | Voted Session | Scenario | Colo | Rows Read | Rows Written | SQL Duration |
|---|---|---|---|---|---|---|---|
| **Run 1** | Copilot CLI | `KEY-01` (42 → 43) | Live conference canvas bootstrap from Copilot CLI | `SYD` | 13 | 4 | `0.591 ms` |
| **Run 2** | Copilot App | `TRK-02` (31 → 32) | Live upvote + pulse from GitHub Copilot App shared MCP | `SYD` | 13 | 4 | `0.561 ms` |
| **Run 3** | Copilot Canvas | `TRK-03` (24 → 25) | Interactive canvas state sync & track filter check | `SYD` | 13 | 4 | `0.500 ms` |
| **Run 4** | Copilot CLI | `TRK-04` (19 → 20) | OAuth scope boundary probe (D1 allowed, Workers Scripts 403) | `SYD` | 13 | 4 | `0.508 ms` |
| **Run 5** | Copilot App | `TRK-05` (28 → 29) | Final rehearsal verification under Cloudflare Free quota | `SYD` | 13 | 4 | `0.480 ms` |
| **Total (5 Runs)** | **CLI + App + Canvas** | **All 5 tracks** | **Complete 5-run conference rehearsal** | **`SYD`** | **65** | **20** | **`2.640 ms`** |

---

## Why 5 Runs Cost $0.00 (Cloudflare Free Quota Headroom)

Source: [Cloudflare Workers & D1 Pricing](https://developers.cloudflare.com/workers/platform/pricing/) (updated Oct 2, 2026, checked 10 Nov 2026).

| Metric | Cloudflare Free Tier Limit | Used by 1 Run | Used by 5 Runs | % of Daily Free Quota | Max 5-Run Rehearsals / Day |
|---|---|---|---|---|---|
| **D1 Rows Read** | `5,000,000 / day` | 13 rows | **65 rows** | **0.0013%** | ~76,923 rehearsals/day |
| **D1 Rows Written** | `100,000 / day` | 4 rows | **20 rows** | **0.0200%** | **5,000 rehearsals/day** |
| **D1 Storage** | `5 GB total` | 32 KB | **32 KB** (`32,768 B`) | **0.0006%** | Persistent across runs |
| **Worker Requests** | `100,000 / day` | 2 requests | **10 requests** | **0.0100%** | 10,000 rehearsals/day |

---

## Honesty notes

- **What ran live on Cloudflare on 10 Nov 2026:** Account discovery (`GET /accounts`), D1 database provisioning (`POST /accounts/.../d1/database` -> `b85fd8c0-b02b-4da6-86e2-012ae7ff743d`), schema creation, seed rows, and all **5 rehearsal runs** (`sql/five-runs.sql`) ran live on Cloudflare D1 in Oceania (`served_by_colo: "SYD"`) via the `cloudflare` MCP server.
- **Measured OAuth scope boundary:** During browser OAuth sign-in to `https://mcp.cloudflare.com/mcp`, the token was granted `D1 Read` and `D1 Write`, while `GET /accounts/.../workers/subdomain` and `GET /accounts/.../workers/scripts` returned HTTP 403 (`Reconnect and grant one of: workers-scripts.read, workers-scripts.write`). We intentionally keep and document this finding in Run 4 as a live demonstration of Cloudflare MCP's least-privilege OAuth scopes.
- **How the Canvas runs today:** The interactive Conference Canvas (`canvas/index.html` and `.github/extensions/xavier-ai-global-conference-canvas/extension.mjs`) runs locally in **GitHub Copilot CLI**, **GitHub Copilot App**, or any browser with zero paid cloud compute, while reading/writing live state to Cloudflare D1 via MCP (or deploying to `.workers.dev` via `src/worker.js` + `wrangler.jsonc` once `workers-scripts.write` is granted).
