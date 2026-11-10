import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { readSnapshot, startServer } from "../canvas/server.mjs";

const escape = text => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function render(version, data = readSnapshot(), ok = true) {
    const elements = new Map();
    const element = () => ({
        textContent: "", markup: null, style: {},
        set innerHTML(value) { this.markup = value; },
        get innerHTML() { return this.markup ?? escape(this.textContent); }
    });
    const document = {
        createElement: element,
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, element());
            return elements.get(id);
        }
    };
    const html = readFileSync(new URL(`../canvas/v${version}/index.html`, import.meta.url), "utf8");
    const requests = [];
    const context = {
        document, console,
        fetch: async path => {
            requests.push(path);
            return { ok, json: async () => structuredClone(data) };
        }
    };
    for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
        runInNewContext(script[1], context);
    }
    await new Promise(resolve => setImmediate(resolve));
    return { elements, context, requests, html };
}

test("v2 preserves five rows, recorded totals, read-only votes, and track filtering", async () => {
    const { elements, context, requests, html } = await render(2);
    assert.deepEqual(requests, ["state.json"]);
    assert.equal(elements.get("run-status-badge").textContent, "5 / 5 Runs Recorded");
    assert.equal(elements.get("reads-used").textContent, 15);
    assert.equal(elements.get("writes-used").textContent, 20);
    assert.equal((elements.get("runs-tbody").innerHTML.match(/<tr>/g) ?? []).length, 5);
    assert.ok(!html.includes('onclick="triggerRun('));
    assert.ok(!html.includes('onclick="upvoteSession('));
    runInNewContext('setTrackFilter("Governance")', context);
    assert.ok(elements.get("sessions-container").innerHTML.includes("TRK-04"));
    assert.ok(!elements.get("sessions-container").innerHTML.includes("KEY-01"));
});

test("v3 renders five story chapters, attendee roles, and distinct account usage", async () => {
    const { elements, requests } = await render(3);
    assert.deepEqual(requests, ["state.json"]);
    const story = elements.get("story").innerHTML;
    assert.equal((story.match(/class="chapter"/g) ?? []).length, 5);
    for (const role of ["Keynote Host", "Solutions Architect", "Product Designer", "Security Lead", "Workshop Facilitator"]) {
        assert.ok(story.includes(role));
    }
    assert.ok(elements.get("bill-text").innerHTML.includes("15 reads"));
    assert.ok(elements.get("bill-text").innerHTML.includes("20 writes"));
    assert.ok(elements.get("reads-out").textContent.includes("187 / 5,000,000"));
    assert.ok(elements.get("writes-out").textContent.includes("68 / 100,000"));
});

test("both versions escape snapshot content and expose load failures", async () => {
    const data = structuredClone(readSnapshot());
    data.sessions[0].title = "<img src=x onerror=alert(1)>";
    for (const version of [2, 3]) {
        const { elements } = await render(version, data);
        const markup = [...elements.values()].map(e => e.innerHTML).join("");
        assert.ok(markup.includes("&lt;img"));
        assert.ok(!markup.includes("<img"));
        const failed = await render(version, data, false);
        const error = version === 2 ? failed.elements.get("runs-tbody") : failed.elements.get("story");
        assert.ok(error.innerHTML.includes("Could not load the D1 snapshot"));
    }
});

test("HTTP serves both portable versions, rejects writes, and does not expose arbitrary files", async t => {
    const { server, url } = await startServer(2);
    t.after(() => new Promise(resolve => server.close(resolve)));
    assert.equal(server.address().address, "127.0.0.1");
    for (const path of ["", "v2/", "v3/"]) {
        const response = await fetch(url + path);
        assert.equal(response.status, 200);
        assert.ok((await response.text()).includes(path === "v3/" ? "One show day" : "D1 Snapshot"));
        assert.deepEqual(await (await fetch(url + path + "state.json")).json(), readSnapshot());
    }
    const before = readSnapshot();
    for (const path of ["state.json", "run", "reset", "v2/", "v3/"]) {
        assert.equal((await fetch(url + path, { method: "POST" })).status, 405);
    }
    assert.deepEqual(readSnapshot(), before);
    assert.equal((await fetch(url + "results/history/v1-extension.mjs")).status, 404);
    const redirect = await fetch(url + "v2", { redirect: "manual" });
    assert.equal(redirect.headers.get("location"), "/v2/");
    await assert.rejects(startServer(1), /version must be 2 or 3/);
});

test("project extension registers and opens v3 and v2 with the same persisted snapshot", async t => {
    const file = new URL("../.github/extensions/xavier-ai-global-conference-canvas/extension.mjs", import.meta.url);
    const source = readFileSync(file, "utf8").replace(/^import .*;\r?\n/gm, "");
    let canvases;
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction("joinSession", "createCanvas", "readSnapshot", "startServer", source)(
        async config => { canvases = config.canvases; }, config => config, readSnapshot, startServer
    );
    assert.deepEqual(canvases.map(c => c.id), [
        "xavier-ai-global-conference-canvas", "xavier-ai-global-conference-canvas-v2"
    ]);
    for (const [index, canvas] of canvases.entries()) {
        const ctx = { instanceId: `version-${index}` };
        const opened = await canvas.open(ctx);
        t.after(() => canvas.onClose(ctx));
        assert.equal((await canvas.open(ctx)).url, opened.url);
        assert.ok((await (await fetch(opened.url)).text()).includes(index === 0 ? "One show day" : "D1 Snapshot"));
        assert.deepEqual(await canvas.actions[0].handler(), readSnapshot());
    }
});
