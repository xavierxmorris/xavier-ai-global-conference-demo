# Reusable Copilot prompts

Open the repository as your workspace first. The first three prompts require no Cloudflare access.

## Open the story canvas

```text
Open the xavier-ai-global-conference-canvas canvas and call get_conference_state. Explain that this is a committed historical snapshot, not today's account usage.
```

## Open the preserved v2 dashboard

```text
Open the xavier-ai-global-conference-canvas-v2 canvas alongside the story canvas. Show the five recorded runs and filter the agenda to Governance. Do not execute SQL.
```

## Reuse the material

```text
Read HISTORY.md, canvas/README.md, and results/history/README.md. Reuse v2 for detailed evidence and v3 for the story. Keep both versions and the before/after captures; distinguish workload totals, telemetry overhead, and account-wide usage. Never publish credentials or raw private session logs.
```

## Optional: query fresh D1 state (authenticated Cloudflare MCP required)

```text
Using my authenticated Cloudflare MCP connection, resolve xavier-ai-global-conf-db in my chosen account. Read all demo_runs ordered by run_number, sessions ordered by id, and attendee_pulses ordered by id descending. Report the retrieval UTC time and query metadata. Do not write, reset, or substitute replay constants for live values.
```

## Optional: execute a fresh rehearsal (writes and consumes quota)

```text
Inspect sql/schema.sql and sql/five-runs.sql first. In my chosen Cloudflare account, resolve xavier-ai-global-conf-db. Do not reset existing data. Execute the three workload statements for Runs 1-5, capturing actual per-statement D1 response metadata instead of trusting literal telemetry in the SQL file. Persist measured telemetry separately, count that overhead separately, and verify final records. Report workload, telemetry, verification, and account-wide usage as separate boundaries; say unknown if a boundary is unavailable. Scenario surface labels are not proof that different clients executed the workloads.
```

Each fresh rehearsal adds votes/pulses and replaces the five run records. Do not present it as idempotent.

## Optional: inspect OAuth scope boundaries

```text
Using the chosen account's current Cloudflare MCP connection, attempt the read-only Workers Scripts list endpoint. Report the actual response and required scopes if denied. Do not modify scripts or expand permissions automatically. Treat the captured historical 403 as context, not a guaranteed outcome for this connection.
```

## Optional: refresh the reusable snapshot

```text
After a fresh read of the chosen D1 database, preserve the current capture under a dated history filename and update results/history/conference-d1-snapshot-2026-11-10.json only as an explicitly documented replacement. Prefer a new dated snapshot and update canvas/server.mjs to point at it. Export only demo data and usage evidence, omit account profile/routing identifiers where unnecessary, and keep source timestamps and measurement boundaries explicit. Validate both canvas versions before committing.
```
