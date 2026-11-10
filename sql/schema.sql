-- Xavier AI Global Conference Demo — Cloudflare D1 Schema & Seed ($0 Workers Free Tier)
-- Verified on Cloudflare D1 database: xavier-ai-global-conf-db (b85fd8c0-b02b-4da6-86e2-012ae7ff743d), Region: OC (SYD)

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  track TEXT NOT NULL,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  room TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  status TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendee_pulses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  attendee_role TEXT NOT NULL,
  takeaway TEXT NOT NULL,
  surface TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS demo_runs (
  run_number INTEGER PRIMARY KEY,
  surface TEXT NOT NULL,
  scenario TEXT NOT NULL,
  voted_session_id TEXT NOT NULL,
  colo TEXT NOT NULL,
  rows_read INTEGER NOT NULL,
  rows_written INTEGER NOT NULL,
  sql_duration_ms REAL NOT NULL,
  executed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

DELETE FROM sessions;
DELETE FROM attendee_pulses;
DELETE FROM demo_runs;

INSERT INTO sessions (id, track, title, speaker, room, starts_at, status, upvotes) VALUES
  ('KEY-01', 'Keynote', 'Agentic Engineering at Global Scale: CLI, App & Edge MCP', 'Xavier X. Morris', 'Main Hall A', '09:00 AEDT', 'LIVE NOW', 42),
  ('TRK-02', 'MCP & Tooling', 'Zero-Cost Edge Data Planes with Cloudflare D1 & Copilot MCP', 'Xavier X. Morris', 'Harbour Theatre', '10:15 AEDT', 'UP NEXT', 31),
  ('TRK-03', 'Canvas & UX', 'Interactive Canvases in GitHub Copilot CLI and Copilot App', 'Guest Architecture Panel', 'Room 204', '11:30 AEDT', 'SCHEDULED', 24),
  ('TRK-04', 'Governance', 'Scoped OAuth & Least-Privilege MCP Guardrails in Production', 'Security Engineering Track', 'Room 102', '13:30 AEDT', 'SCHEDULED', 19),
  ('TRK-05', 'Live Lab', '5-Run Repeatable Edge Rehearsal Under Free Quota', 'Workshop Facilitators', 'Lab Arena', '15:00 AEDT', 'SCHEDULED', 28);

INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface) VALUES
  ('KEY-01', 'Principal Engineer', 'Shared ~/.copilot/mcp-config.json across CLI and App avoids duplicate setup.', 'Copilot CLI'),
  ('TRK-02', 'Cloud Architect', 'D1 Free tier gives 5M reads/day and 100k writes/day—5 demo runs use <0.05% of daily quota.', 'Copilot App'),
  ('TRK-03', 'Staff Developer', 'The local/edge Conference Canvas renders live D1 rows with zero paid compute.', 'Copilot Canvas');
