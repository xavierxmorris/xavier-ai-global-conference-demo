# Click-Through Guide: Xavier AI Global Conference Demo (Copilot CLI + Copilot App + Cloudflare Free Tier)

A step-by-step presenter guide showing **what to click**, **what to point at**, **what to say**, and **what each step proves**. Every step was verified on **10 November 2026** against Cloudflare account `07a1d926b6f5652ec24ee8979839e6c6` (`xavierxie31@gmail.com`) and D1 database `xavier-ai-global-conf-db` (`b85fd8c0-b02b-4da6-86e2-012ae7ff743d`, Sydney edge `SYD`).

---

## What this demo proves

| # | Claim | Step |
|---|---|---|
| **C1** | **One MCP config serves both GitHub Copilot CLI and GitHub Copilot App** (`~/.copilot/mcp-config.json` -> `https://mcp.cloudflare.com/mcp`). | Step 1 |
| **C2** | **The main Conference Canvas builds and opens in both Copilot CLI and Copilot App** via `.github/extensions/xavier-ai-global-conference-canvas/extension.mjs` (plus offline via `canvas/index.html`). | Step 2 |
| **C3** | **5 full demo runs execute live on Cloudflare D1 (`SYD`) for $0.00**, consuming only `65 rows_read` (`0.0013%` of 5M/day) and `20 rows_written` (`0.02%` of 100k/day). | Step 3 |
| **C4** | **Cloudflare MCP enforces least-privilege OAuth scopes**: D1 queries succeed while ungranted scopes (`workers-scripts.write`) fail with an explicit remediation message. | Step 4 |
| **C5** | **Deterministic reset & replay**: You can reset and replay all 5 runs up to **5,000 times per day** without leaving Cloudflare's free tier. | Step 5 |

---

## Live Instance Reference

| Component | Identifier / Path |
|---|---|
| **GitHub Repo** | <https://github.com/xavierxmorris/xavier-ai-global-conference-demo> |
| **Shared MCP Config** | `C:\Users\xaviermorris\.copilot\mcp-config.json` (`"cloudflare"` HTTP MCP) |
| **Cloudflare Account** | `Xavierxie31@gmail.com's Account` (`07a1d926b6f5652ec24ee8979839e6c6`) |
| **Cloudflare D1 Database** | `xavier-ai-global-conf-db` (`b85fd8c0-b02b-4da6-86e2-012ae7ff743d`), Region `OC` (`SYD`) |
| **Project Canvas Extension** | `.github/extensions/xavier-ai-global-conference-canvas/extension.mjs` |
| **Standalone Canvas UI** | `canvas/index.html` (launched via `.\go.ps1`) |

---

## Step-by-Step Click-Through (8–10 minutes)

### Step 1. Verify the shared Cloudflare MCP connection (1.5 min) — *Proves C1*

**In GitHub Copilot CLI (or GitHub Copilot App):**
1. Open the repo folder:
   ```powershell
   cd C:\Users\xaviermorris\Documents\xavier-ai-global-conference-demo
   copilot
   ```
2. **Type or click:**
   - Run `/mcp get cloudflare` to show the connected server (`https://mcp.cloudflare.com/mcp`).
   - Send prompt:
     ```text
     Check my Cloudflare MCP identity and list the D1 database for the Xavier AI Global Conference demo.
     ```

**Point at:**
- `cloudflare-whoami` returning `xavierxie31@gmail.com` (`user:2c502b98bcfe70e77f6e56ef31913e8c`).
- `GET /accounts/07a1d926b6f5652ec24ee8979839e6c6/d1/database` returning `xavier-ai-global-conf-db` (`b85fd8c0-b02b-4da6-86e2-012ae7ff743d`, `created_in_region: "OC"`).

**Say:** *"Both GitHub Copilot CLI and the GitHub Copilot App read the same `~/.copilot/mcp-config.json`. We added nine lines of JSON pointing to `https://mcp.cloudflare.com/mcp`, signed in via browser OAuth, and both surfaces immediately share live access to Cloudflare in Sydney."*

---

### Step 2. Open the Main Conference Canvas in Copilot CLI or Copilot App (2 min) — *Proves C2*

**Option A — Inside GitHub Copilot App or Copilot CLI (via Canvas Extension):**
1. **Send prompt:**
   ```text
   Open the xavier-ai-global-conference-canvas canvas and get the current conference state.
   ```
2. If you just edited the extension, run `/extensions reload` (or call `extensions_reload`) first.
3. **Click:** When the **Xavier AI Global Conference Canvas** side panel opens, click through the track filters (**All**, **Keynote**, **MCP**, **Canvas**, **Governance**).

**Option B — From PowerShell (`.\go.ps1`):**
1. Run:
   ```powershell
   .\go.ps1
   ```
2. **Point at:** The browser tab opening `canvas/index.html` with the header badge `Cloudflare D1 Free ($0)` and `Copilot CLI + Copilot App Canvas`.

**Say:** *"The repo includes `.github/extensions/xavier-ai-global-conference-canvas/extension.mjs` built with `@github/copilot-sdk/extension`. Whether we are in the terminal with Copilot CLI or in the desktop GitHub Copilot App, Copilot discovers the same canvas extension, starts a loopback listener on `127.0.0.1`, and opens the interactive conference board."*

---

### Step 3. Execute the 5 Free-Quota Runs Live on Cloudflare D1 (2.5 min) — *Proves C3*

**Click (in the Canvas UI):**
1. Click **↺ Reset to Baseline** to clear the local run table (`0 / 5 Free Runs Executed`).
2. Click **▶ Run 1 (CLI)**, **▶ Run 2 (App)**, **▶ Run 3 (Canvas)**, **▶ Run 4 (Guardrail)**, and **▶ Run 5 (Final)** one by one—or click **⚡ Replay All 5 Free Runs**.

**Live D1 Verification (in Copilot Chat):**
Send this prompt in Copilot CLI or Copilot App to execute or verify all 5 runs directly on Cloudflare D1 in Sydney:
```text
Run the 5 rehearsal runs in sql/five-runs.sql against D1 database b85fd8c0-b02b-4da6-86e2-012ae7ff743d using cloudflare-execute and show the rows_read, rows_written, and sql_duration_ms for each run.
```

**Point at:**
- Each run takes **0.48–0.59 ms** at the `SYD` edge colo.
- Each run reads **13 rows** and writes **4 rows**.
- All 5 runs combined use **65 reads** (`0.0013%` of the 5,000,000/day free limit) and **20 writes** (`0.0200%` of the 100,000/day free limit).

**Say:** *"You asked to make sure we can do 5 free runs under Cloudflare's free quota. Five complete runs read 65 rows out of 5 million free daily reads and write 20 rows out of 100,000 free daily writes. We can run this entire 5-step conference rehearsal 5,000 times a day for zero dollars."*

---

### Step 4. Show the Least-Privilege OAuth Scope Boundary (1.5 min) — *Proves C4*

**Send prompt in Copilot Chat:**
```text
Using cloudflare-execute, check GET /accounts/07a1d926b6f5652ec24ee8979839e6c6/workers/scripts and explain what the response proves about OAuth scopes.
```

**Point at:**
- The structured HTTP 403 error message returned by the Cloudflare MCP server:
  `This connection was not granted a scope this endpoint accepts. Reconnect and grant one of: workers-scripts.read, workers-scripts.write.`

**Say:** *"Notice that our OAuth token can create and query D1 databases (`d1.read` / `d1.write`), but cannot overwrite Worker scripts until we explicitly grant `workers-scripts.write` via `/mcp auth cloudflare`. That gives us verifiable least-privilege guardrails out of the box."*

---

### Step 5. Run the Deterministic Pre-Flight Check (1 min) — *Proves C5*

**Run in PowerShell:**
```powershell
.\go.ps1 -Check
```

**Point at:**
- `CHECK PASSED: All 11 files verified. 5 runs use 65/5,000,000 reads (0.0013%) and 20/100,000 writes (0.0200%) on Cloudflare D1 Free Tier.`
