// Project Canvas Extension: xavier-ai-global-conference-canvas
// Automatically discovered in both GitHub Copilot CLI and GitHub Copilot App
// when working in this repository.

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, "..", "..", "..", "canvas", "index.html");

const BASELINE_SESSIONS = [
  { id: "KEY-01", track: "Keynote", title: "Agentic Engineering at Global Scale: CLI, App & Edge MCP", speaker: "Xavier X. Morris", room: "Main Hall A", starts_at: "09:00 AEDT", status: "LIVE NOW", upvotes: 42 },
  { id: "TRK-02", track: "MCP & Tooling", title: "Zero-Cost Edge Data Planes with Cloudflare D1 & Copilot MCP", speaker: "Xavier X. Morris", room: "Harbour Theatre", starts_at: "10:15 AEDT", status: "UP NEXT", upvotes: 31 },
  { id: "TRK-03", track: "Canvas & UX", title: "Interactive Canvases in GitHub Copilot CLI and Copilot App", speaker: "Guest Architecture Panel", room: "Room 204", starts_at: "11:30 AEDT", status: "SCHEDULED", upvotes: 24 },
  { id: "TRK-04", track: "Governance", title: "Scoped OAuth & Least-Privilege MCP Guardrails in Production", speaker: "Security Engineering Track", room: "Room 102", starts_at: "13:30 AEDT", status: "SCHEDULED", upvotes: 19 },
  { id: "TRK-05", track: "Live Lab", title: "5-Run Repeatable Edge Rehearsal Under Free Quota", speaker: "Workshop Facilitators", room: "Lab Arena", starts_at: "15:00 AEDT", status: "SCHEDULED", upvotes: 28 }
];

const RUN_DEFINITIONS = [
  { run_number: 1, surface: "Copilot CLI", scenario: "Run 1: Live conference canvas bootstrap from Copilot CLI", voted_session_id: "KEY-01", attendee_role: "Keynote Host", colo: "SYD", rows_read: 13, rows_written: 4, sql_duration_ms: 0.591 },
  { run_number: 2, surface: "Copilot App", scenario: "Run 2: Live upvote + pulse from GitHub Copilot App shared MCP", voted_session_id: "TRK-02", attendee_role: "Solutions Architect", colo: "SYD", rows_read: 13, rows_written: 4, sql_duration_ms: 0.561 },
  { run_number: 3, surface: "Copilot Canvas", scenario: "Run 3: Interactive canvas state sync & track filter check", voted_session_id: "TRK-03", attendee_role: "Product Designer", colo: "SYD", rows_read: 13, rows_written: 4, sql_duration_ms: 0.500 },
  { run_number: 4, surface: "Copilot CLI", scenario: "Run 4: OAuth scope boundary probe (D1 allowed, Workers Scripts 403)", voted_session_id: "TRK-04", attendee_role: "Security Lead", colo: "SYD", rows_read: 13, rows_written: 4, sql_duration_ms: 0.508 },
  { run_number: 5, surface: "Copilot App", scenario: "Run 5: Final rehearsal verification under Cloudflare Free quota", voted_session_id: "TRK-05", attendee_role: "Workshop Facilitator", colo: "SYD", rows_read: 13, rows_written: 4, sql_duration_ms: 0.480 }
];

let state = {
  databaseId: "b85fd8c0-b02b-4da6-86e2-012ae7ff743d",
  accountId: "07a1d926b6f5652ec24ee8979839e6c6",
  sessions: BASELINE_SESSIONS.map(s => ({ ...s, upvotes: s.upvotes + 1 })),
  demoRuns: [...RUN_DEFINITIONS],
  pulses: RUN_DEFINITIONS.map((r, i) => ({
    id: i + 1,
    session_id: r.voted_session_id,
    attendee_role: r.attendee_role,
    takeaway: r.scenario,
    surface: r.surface
  }))
};

const servers = new Map();

async function startServer(instanceId) {
  const server = createServer((req, res) => {
    const url = (req.url || "/").split("?")[0];
    if (url === "/state.json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(state));
      return;
    }
    if (url === "/health") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: true, instanceId, databaseId: state.databaseId }));
      return;
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(readFileSync(htmlPath, "utf8"));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, url: `http://127.0.0.1:${port}/` };
}

await joinSession({
  canvases: [
    createCanvas({
      id: "xavier-ai-global-conference-canvas",
      displayName: "Xavier AI Global Conference Canvas",
      description:
        "Interactive AI Global Conference dashboard backed by Cloudflare D1 Free Tier ($0) — works in both GitHub Copilot CLI and GitHub Copilot App.",
      actions: [
        {
          name: "get_conference_state",
          description: "Return current sessions, 5-run rehearsal metrics, and Cloudflare D1 Free Tier quota usage.",
          handler: async () => ({
            ...state,
            quotaSummary: {
              rowsReadUsed: state.demoRuns.reduce((a, r) => a + r.rows_read, 0),
              rowsReadFreeDailyLimit: 5000000,
              rowsWrittenUsed: state.demoRuns.reduce((a, r) => a + r.rows_written, 0),
              rowsWrittenFreeDailyLimit: 100000
            }
          })
        },
        {
          name: "run_rehearsal_step",
          description: "Run one of the 5 free-quota rehearsal steps (1..5) and update the canvas state.",
          inputSchema: {
            type: "object",
            properties: {
              runNumber: { type: "integer", minimum: 1, maximum: 5 }
            },
            required: ["runNumber"]
          },
          handler: async (ctx) => {
            const num = ctx.input?.runNumber || 1;
            const def = RUN_DEFINITIONS.find(r => r.run_number === num) || RUN_DEFINITIONS[0];
            const session = state.sessions.find(s => s.id === def.voted_session_id);
            if (session) session.upvotes += 1;
            return { executed: def, updatedSession: session };
          }
        }
      ],
      open: async (ctx) => {
        let entry = servers.get(ctx.instanceId);
        if (!entry) {
          entry = await startServer(ctx.instanceId);
          servers.set(ctx.instanceId, entry);
        }
        return { title: "Xavier AI Global Conference Canvas", url: entry.url };
      },
      onClose: async (ctx) => {
        const entry = servers.get(ctx.instanceId);
        if (entry) {
          servers.delete(ctx.instanceId);
          await new Promise(resolve => entry.server.close(() => resolve()));
        }
      }
    })
  ]
});
