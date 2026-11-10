# 3-Minute Stage Run-Sheet — Xavier AI Global Conference Demo

**Audience:** AI engineers, solution architects, technical leads  
**Length:** 3:00 (4 scripted beats)  
**Cost:** $0.00 (Cloudflare Workers Free + D1 Free Tier, no credit card required)  
**One command:**

```powershell
.\go.ps1 -Manual
```

---

## Beat Sheet

### 0:00 — Beat 1: One MCP Config for Both Copilot CLI & Copilot App *(40s)*
Open `C:\Users\xaviermorris\.copilot\mcp-config.json` or run `/mcp get cloudflare`.

> "GitHub Copilot CLI and the GitHub Copilot App share `~/.copilot/mcp-config.json`. Adding `"cloudflare": { "type": "http", "url": "https://mcp.cloudflare.com/mcp", "tools": ["*"] }` connects both our terminal agent and desktop app to Cloudflare's remote MCP server via browser OAuth—zero local SDKs or static API keys required."

### 0:40 — Beat 2: Build & Open the Main Canvas in CLI or App *(50s)*
Open the **Xavier AI Global Conference Canvas** (`canvas/index.html` via `.\go.ps1`, or via `open_canvas` from `.github/extensions/xavier-ai-global-conference-canvas/extension.mjs`).

> "This repository contains a Copilot Canvas extension in `.github/extensions/`. Whether I'm driving from **GitHub Copilot CLI** or **GitHub Copilot App**, Copilot loads the same canvas surface and renders our live AI Global Conference agenda, attendee pulse feed, and real-time Free-Tier quota telemetry."

### 1:30 — Beat 3: 5 Live Rehearsal Runs Under Cloudflare Free Quota *(60s)*
Click **↺ Reset to Baseline**, then click **▶ Run 1** through **▶ Run 5** (or **⚡ Replay All 5 Free Runs**), and show the live D1 query results from `xavier-ai-global-conf-db` (`b85fd8c0-b02b-4da6-86e2-012ae7ff743d`, `SYD`).

> "Every run updates session upvotes, records an attendee pulse, and logs its execution telemetry into Cloudflare D1 in Sydney (`SYD`). Look at the quota bar: across all **5 runs**, we consumed **65 rows read** out of **5,000,000 free per day** (`0.0013%`) and **20 rows written** out of **100,000 free per day** (`0.02%`), in half a millisecond per run."

### 2:30 — Beat 4: Built-in OAuth Scope Guardrails *(30s)*
Point at **Run #4 (`TRK-04`)** in the table.

> "And it's governed: our OAuth session is scoped to D1, so if an agent tries to modify Worker scripts without `workers-scripts.write`, Cloudflare MCP blocks it with HTTP 403 and names the exact scope required. Fast, zero-cost, and least-privilege by default."
