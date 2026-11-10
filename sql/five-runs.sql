-- 5 Repeatable Rehearsal Runs under Cloudflare D1 Free Quota
-- Total cost across all 5 runs: 65 rows_read (0.0013% of 5M/day free limit) + 20 rows_written (0.02% of 100k/day free limit)

-- Run 1 (Copilot CLI)
UPDATE sessions SET upvotes = upvotes + 1 WHERE id = 'KEY-01';
INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface)
VALUES ('KEY-01', 'Keynote Host', 'Run 1: Live conference canvas bootstrap from Copilot CLI', 'Copilot CLI');
INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms)
VALUES (1, 'Copilot CLI', 'Run 1: Live conference canvas bootstrap from Copilot CLI', 'KEY-01', 'SYD', 13, 4, 0.591);

-- Run 2 (Copilot App)
UPDATE sessions SET upvotes = upvotes + 1 WHERE id = 'TRK-02';
INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface)
VALUES ('TRK-02', 'Solutions Architect', 'Run 2: Live upvote + pulse from GitHub Copilot App shared MCP', 'Copilot App');
INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms)
VALUES (2, 'Copilot App', 'Run 2: Live upvote + pulse from GitHub Copilot App shared MCP', 'TRK-02', 'SYD', 13, 4, 0.561);

-- Run 3 (Copilot Canvas)
UPDATE sessions SET upvotes = upvotes + 1 WHERE id = 'TRK-03';
INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface)
VALUES ('TRK-03', 'Product Designer', 'Run 3: Interactive canvas state sync & track filter check', 'Copilot Canvas');
INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms)
VALUES (3, 'Copilot Canvas', 'Run 3: Interactive canvas state sync & track filter check', 'TRK-03', 'SYD', 13, 4, 0.500);

-- Run 4 (Copilot CLI)
UPDATE sessions SET upvotes = upvotes + 1 WHERE id = 'TRK-04';
INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface)
VALUES ('TRK-04', 'Security Lead', 'Run 4: OAuth scope boundary probe (D1 allowed, Workers Scripts 403)', 'Copilot CLI');
INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms)
VALUES (4, 'Copilot CLI', 'Run 4: OAuth scope boundary probe (D1 allowed, Workers Scripts 403)', 'TRK-04', 'SYD', 13, 4, 0.508);

-- Run 5 (Copilot App)
UPDATE sessions SET upvotes = upvotes + 1 WHERE id = 'TRK-05';
INSERT INTO attendee_pulses (session_id, attendee_role, takeaway, surface)
VALUES ('TRK-05', 'Workshop Facilitator', 'Run 5: Final rehearsal verification under Cloudflare Free quota', 'Copilot App');
INSERT OR REPLACE INTO demo_runs (run_number, surface, scenario, voted_session_id, colo, rows_read, rows_written, sql_duration_ms)
VALUES (5, 'Copilot App', 'Run 5: Final rehearsal verification under Cloudflare Free quota', 'TRK-05', 'SYD', 13, 4, 0.480);

SELECT id, track, title, upvotes FROM sessions ORDER BY id;
SELECT * FROM demo_runs ORDER BY run_number;
