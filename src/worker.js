/**
 * Xavier AI Global Conference Demo — Cloudflare Worker ($0 Workers Free + D1 Free)
 * Bound to D1 database: xavier-ai-global-conf-db (b85fd8c0-b02b-4da6-86e2-012ae7ff743d)
 */

const RUN_PLAN = [
  { run: 1, surface: "Copilot CLI", session: "KEY-01", role: "Keynote Host", note: "Run 1: Live conference canvas bootstrap from Copilot CLI" },
  { run: 2, surface: "Copilot App", session: "TRK-02", role: "Solutions Architect", note: "Run 2: Live upvote + pulse from GitHub Copilot App shared MCP" },
  { run: 3, surface: "Copilot Canvas", session: "TRK-03", role: "Product Designer", note: "Run 3: Interactive canvas state sync & track filter check" },
  { run: 4, surface: "Copilot CLI", session: "TRK-04", role: "Security Lead", note: "Run 4: OAuth scope boundary probe (D1 allowed, Workers Scripts 403)" },
  { run: 5, surface: "Copilot App", session: "TRK-05", role: "Workshop Facilitator", note: "Run 5: Final rehearsal verification under Cloudflare Free quota" }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({
        ok: true,
        service: "xavier-ai-global-conference-demo",
        plan: "Cloudflare Workers Free + D1 Free ($0)",
        databaseId: "b85fd8c0-b02b-4da6-86e2-012ae7ff743d",
        colo: request.cf?.colo || "SYD"
      }), { headers: cors });
    }

    if (url.pathname === "/api/state" && request.method === "GET") {
      const [sessions, runs, pulses] = await env.DB.batch([
        env.DB.prepare("SELECT * FROM sessions ORDER BY id"),
        env.DB.prepare("SELECT * FROM demo_runs ORDER BY run_number"),
        env.DB.prepare("SELECT * FROM attendee_pulses ORDER BY id DESC LIMIT 12")
      ]);
      return new Response(JSON.stringify({
        ok: true,
        sessions: sessions.results,
        demoRuns: runs.results,
        pulses: pulses.results
      }), { headers: cors });
    }

    if (url.pathname === "/api/run" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const runNum = Number(body.runNumber || 1);
      const plan = RUN_PLAN.find(r => r.run === runNum) || RUN_PLAN[0];
      const colo = request.cf?.colo || "SYD";

      const batchRes = await env.DB.batch([
        env.DB.prepare("UPDATE sessions SET upvotes = upvotes + 1 WHERE id = ?1").bind(plan.session),
        env.DB.prepare("INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface) VALUES (?1, ?2, ?3, ?4)")
          .bind(plan.session, plan.role, plan.note, plan.surface),
        env.DB.prepare(
          "INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms) VALUES (?1, ?2, ?3, ?4, ?5, 13, 4, 0.52)"
        ).bind(plan.run, plan.surface, plan.note, plan.session, colo)
      ]);

      return new Response(JSON.stringify({
        ok: true,
        executedRun: plan,
        meta: batchRes.map(r => r.meta)
      }), { headers: cors });
    }

    return new Response(JSON.stringify({
      ok: true,
      message: "Xavier AI Global Conference Demo API. Open canvas/index.html or launch the Copilot Canvas extension."
    }), { headers: cors });
  }
};
