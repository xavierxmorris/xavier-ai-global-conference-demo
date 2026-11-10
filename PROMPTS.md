# Prompts — GitHub Copilot CLI & GitHub Copilot App

Use these prompts in either **GitHub Copilot CLI** (`copilot`) or **GitHub Copilot App** after opening `C:\Users\xaviermorris\Documents\xavier-ai-global-conference-demo`.

---

## Prompt 1 — Verify Cloudflare MCP Connection & D1 Database
```text
Use cloudflare-whoami and cloudflare-execute to verify my Cloudflare account and inspect the D1 database xavier-ai-global-conf-db (b85fd8c0-b02b-4da6-86e2-012ae7ff743d).
```

## Prompt 2 — Open the Main Conference Canvas (CLI or App)
```text
Open the xavier-ai-global-conference-canvas canvas and call get_conference_state to summarize the 5 conference tracks and current Cloudflare D1 Free Tier quota usage.
```

## Prompt 3 — Execute All 5 Free-Quota Runs Live on Cloudflare D1
```text
Using cloudflare-execute on D1 database b85fd8c0-b02b-4da6-86e2-012ae7ff743d, reset to the baseline in sql/schema.sql, execute all 5 runs in sql/five-runs.sql, and display a table of run_number, surface, voted_session_id, colo, rows_read, rows_written, and sql_duration_ms.
```

## Prompt 4 — Add a Live Audience Vote & Pulse From Chat
```text
Using cloudflare-execute on D1 database b85fd8c0-b02b-4da6-86e2-012ae7ff743d, increment upvotes for session KEY-01 by 1, insert an attendee_pulses row from surface 'Copilot Live Q&A' with takeaway 'Zero-cost edge MCP demo verified live on stage', and return the updated session leaderboard.
```

## Prompt 5 — Demonstrate Least-Privilege OAuth Scope Boundary
```text
Using cloudflare-execute, attempt GET /accounts/07a1d926b6f5652ec24ee8979839e6c6/workers/scripts and show which OAuth scope is granted (D1) versus restricted (Workers Scripts).
```
