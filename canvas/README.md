# Reusing the conference canvases

| Version | Content | Entry point |
|---|---|---|
| v1 | Original interactive local replay, including historical hard-coded figures | `index.html` |
| v2 | Preserved pre-redesign dashboard: run table, track filters, recorded votes and pulse feed | `v2/index.html` |
| v3 | Current story-led timeline: five chapters, receipts, quota context, expandable votes | `v3/index.html` |

v2 was recovered from the pre-redesign session renderer, not recreated from memory. Its layout is preserved; its snapshot fetch is now relative so it works under `/v2/`. v3 preserves the story design and adds a factual clarification about scenario labels.

## Open in Copilot App or a canvas-capable CLI

Open this repository as the workspace and let Copilot load its project extensions. After changing extension files, ask Copilot to reload extensions.

```text
Open the xavier-ai-global-conference-canvas canvas.
```

```text
Open the xavier-ai-global-conference-canvas-v2 canvas.
```

The original canvas ID now selects v3. v2 has a separate ID, so both can be open at once. Each offers `get_conference_state`; neither offers a write/replay action. This replaces the original extension's in-memory `run_rehearsal_step`, which never executed D1 SQL.

The extension imports the shared `canvas/server.mjs`. Keep the repository structure intact when reusing it: copying only `extension.mjs` is insufficient. The Copilot runtime resolves `@github/copilot-sdk`; do not install it for this extension. Canvas APIs are experimental; this wiring was checked against the installed SDK on 11 November 2026.

## Open without Copilot or Cloudflare authentication

Requires Node.js 22+; no npm dependencies or build step.

```powershell
node .\canvas\server.mjs
node .\canvas\server.mjs --version=2
```

Open the loopback URL printed by the server. `/` selects the requested version; `/v2/` and `/v3/` always select their named versions. Press Ctrl+C to stop.

On Windows, `.\go.ps1` opens v3 and keeps the server in the foreground. Use `.\go.ps1 -CanvasVersion 2` for v2. Both need HTTP; do not double-click their HTML files. `.\go.ps1 -CanvasVersion 1` opens the original file-based replay. Use `-NoBrowser` for a non-serving walkthrough, or `-NoBrowser -Live` to launch Copilot directly.

The UI works without Cloudflare access; v3 optionally loads Google Fonts and falls back to local fonts if unavailable.

## Data and safety

Both current versions read `results/history/conference-d1-snapshot-2026-11-10.json`. That file survives restarts and is shared by every panel; panel instance IDs do not own the data. A fresh clone displays the same evidence without rerunning anything.

Servers bind only to `127.0.0.1` with an OS-assigned port. Only the two pages and snapshot endpoints are served. Non-GET requests return 405. Unknown paths return 404. Loading, filtering, and reopening cannot change D1.

To retarget the demo, use your own Cloudflare account/database in the live-workflow configuration, collect new results, and replace the snapshot deliberately. Do not copy tokens or OAuth caches. Keep historical evidence immutable and label the new capture date.

For provenance and measurement boundaries, see [history](../HISTORY.md) and [run evidence](../results/history/README.md).

## Local checks

```powershell
.\go.ps1 -Check
node --test .\tests\canvas.test.mjs
```
