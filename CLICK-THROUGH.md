# Presenter click-through: story first, evidence second

Use the committed historical capture for a safe, repeatable demo. Opening either current canvas makes no Cloudflare requests and changes no votes.

## 1. Open v3

In the repository, run `.\go.ps1 -Manual`, or ask Copilot:

```text
Open the xavier-ai-global-conference-canvas canvas.
```

For the PowerShell runner, Node.js 22+ is required. Advance the introductory beats with Enter; the read-only server then opens the browser. Keep that terminal running.

**Point at:** "One show day, five runs, one edge database."

**Say:** "This is a story told from a recorded D1 capture, not a live Cloudflare dashboard."

**Proves:** A fresh checkout can replay the evidence locally without authentication or paid compute.

## 2. Follow the five chapters

Scroll from keynote bootstrap through shared data, canvas, scope boundary, and final rehearsal. Each chapter pairs an attendee role with a session vote and its measured D1 receipt.

**Point at:** 3 reads / 4 writes per workload, `SYD`, UTC timestamps, and individual SQL timings.

**Say:** "The surface names describe our scenarios. The latest five workloads were all submitted from one App MCP connection; these labels are not proof of five separate clients. The guardrail chapter recalls an earlier scope probe."

**Proves:** All five captured run records and their associated sessions can be inspected without claiming additional execution.

## 3. Explain what it cost

Scroll to **What it cost**.

**Point at:** 15 workload reads / 20 writes versus 187 account-wide reads / 68 writes on **10 November 2026 UTC**.

**Say:** "The counters have different scopes. Saving telemetry added 5 reads / 5 writes. With verification, our measured operation was 61 / 25. Daily account totals include earlier work."

**Proves:** Captured usage was below the recorded daily free allowances, not that today's usage or all future bills are zero.

## 4. Expand the final votes

Click **Where the votes ended up**.

**Point at:** Final counts 44, 33, 26, 21, and 30 for the five session IDs.

**Proves:** The final leaderboard agrees with the post-rerun capture.

## 5. Compare the preserved v2

Ask Copilot:

```text
Open the xavier-ai-global-conference-canvas-v2 canvas.
```

Or, using the browser server already running, change the URL path to `/v2/`. From a separate terminal, `.\go.ps1 -CanvasVersion 2` also starts it.

Click **Governance**, then **All**. Inspect the run table and pulse feed.

**Say:** "This is the older dashboard, preserved as version 2. Version 3 changes the storytelling, not the captured data. Votes are recorded values; no run or reset buttons execute SQL."

**Proves:** Both versions remain reusable and share the same persisted snapshot.

## 6. Show provenance

Open [HISTORY.md](HISTORY.md) and [results/history/README.md](results/history/README.md). Compare the before/after JSON files.

**Proves:** Historical discrepancies and measurement boundaries are visible, with v1 retained for comparison.

For optional live D1 work, use [PROMPTS.md](PROMPTS.md). That requires separately authenticated Cloudflare MCP access and consumes quota. Do not reset the database or replay writes merely to demonstrate the UI.

## 7. Stop the browser server

Press Ctrl+C in its terminal. Copilot-owned canvas servers close when their panels close.

The original click-through and its superseded claims remain in [commit 68c0832](https://github.com/xavierxmorris/xavier-ai-global-conference-demo/blob/68c0832/CLICK-THROUGH.md).
