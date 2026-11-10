import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import { readSnapshot, startServer } from "../../../canvas/server.mjs";

const servers = new Map();

function conferenceCanvas(version, id, displayName) {
    return createCanvas({
        id,
        displayName,
        description: `Read-only conference ${version === 2 ? "dashboard" : "story"} with five recorded Cloudflare D1 runs.`,
        actions: [{
            name: "get_conference_state",
            description: "Return the recorded D1 snapshot, not live account usage.",
            handler: async () => readSnapshot()
        }],
        open: async ctx => {
            let entry = servers.get(ctx.instanceId);
            if (!entry) {
                entry = await startServer(version);
                servers.set(ctx.instanceId, entry);
            }
            return { title: displayName, url: entry.url };
        },
        onClose: async ctx => {
            const entry = servers.get(ctx.instanceId);
            if (entry) {
                servers.delete(ctx.instanceId);
                await new Promise(resolve => entry.server.close(resolve));
            }
        }
    });
}

await joinSession({
    canvases: [
        conferenceCanvas(3, "xavier-ai-global-conference-canvas", "Xavier AI Global Conference - v3 Story"),
        conferenceCanvas(2, "xavier-ai-global-conference-canvas-v2", "Xavier AI Global Conference - v2 Dashboard")
    ]
});
