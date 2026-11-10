import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { spawn } from "node:child_process";

const directory = dirname(fileURLToPath(import.meta.url));
const snapshotPath = join(directory, "..", "results", "history", "conference-d1-snapshot-2026-11-10.json");

export function readSnapshot() {
    return JSON.parse(readFileSync(snapshotPath, "utf8"));
}

export async function startServer(version = 3) {
    if (version !== 2 && version !== 3) {
        throw new RangeError("Canvas version must be 2 or 3.");
    }
    const pages = new Map([2, 3].map(number => [
        number, readFileSync(join(directory, `v${number}`, "index.html"), "utf8")
    ]));
    readSnapshot();
    const server = createServer((req, res) => {
        res.setHeader("Cache-Control", "no-store");
        if (req.method !== "GET") {
            res.writeHead(405, { Allow: "GET", "Content-Type": "text/plain; charset=utf-8" });
            res.end("Read-only snapshot. Execute live D1 work separately through MCP.");
            return;
        }
        const path = new URL(req.url, "http://127.0.0.1").pathname;
        if (path === "/v2" || path === "/v3") {
            res.writeHead(302, { Location: `${path}/` });
            res.end();
            return;
        }
        try {
            if (["/state.json", "/v2/state.json", "/v3/state.json"].includes(path)) {
                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify(readSnapshot()));
            } else if (path === "/" || path === "/v2/" || path === "/v3/") {
                const selected = path === "/" ? version : Number(path[2]);
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(pages.get(selected));
            } else {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Not found");
            }
        } catch (error) {
            console.error("Conference canvas asset unavailable:", error);
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Conference snapshot unavailable. Check the server log.");
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });
    return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const { values } = parseArgs({
        options: { version: { type: "string", default: "3" }, open: { type: "boolean" } }
    });
    if (values.open && process.platform !== "win32") {
        throw new Error("--open is Windows-only; omit it and open the printed URL.");
    }
    const { server, url } = await startServer(Number(values.version));
    console.log(`Conference canvas v${values.version}: ${url}`);
    console.log(`v2 dashboard: ${url}v2/ | v3 story: ${url}v3/`);
    console.log("Recorded snapshot only; no Cloudflare requests. Press Ctrl+C to stop.");
    if (values.open) {
        const browser = spawn("powershell.exe", ["-NoProfile", "-Command", `Start-Process '${url}'`], { stdio: "inherit" });
        browser.on("error", error => console.error("Browser launch failed; open the printed URL:", error));
        browser.on("exit", code => {
            if (code) console.error(`Browser launch exited with ${code}; open the printed URL.`);
        });
    }
    process.once("SIGINT", () => server.close());
    process.once("SIGTERM", () => server.close());
}
