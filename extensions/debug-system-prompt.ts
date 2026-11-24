/**
 * Debug the effective system prompt.
 *
 * - `/debug-system-prompt` or Ctrl+Q: show the last applied system prompt in a
 *   notification (untruncated). Needs at least one user/assistant message on the
 *   current branch; before that Pi has not built the turn prompt yet.
 * - `pi --debug-system-prompt -p <msg>`: print the turn's prompt and system prompt
 *   as JSON and exit before calling the model.
 *
 * Keep this LAST in package.json's extension list: before_agent_start handlers run
 * in load order, each threading its systemPrompt rewrite to the next, so printing
 * from an earlier extension would miss later rewrites.
 */

import type { ExtensionAPI, ExtensionContext, SessionMessageEntry } from "@earendil-works/pi-coding-agent";

const NO_TURNS_NOTICE = "No turns yet — system prompt is not built until you send a message.";

function hasConversationOnBranch(ctx: ExtensionContext): boolean {
	for (const e of ctx.sessionManager.getBranch()) {
		if (e.type !== "message") continue;
		const role = (e as SessionMessageEntry).message.role;
		if (role === "user" || role === "assistant") return true;
	}
	return false;
}

async function showSystemPrompt(ctx: ExtensionContext): Promise<void> {
	if (!ctx.hasUI) return;
	if (!hasConversationOnBranch(ctx)) {
		ctx.ui.notify(NO_TURNS_NOTICE, "info");
		return;
	}
	ctx.ui.notify(ctx.getSystemPrompt(), "info");
}

export default function debugSystemPrompt(pi: ExtensionAPI): void {
	pi.registerCommand("debug-system-prompt", {
		description: "Debug: show full system prompt (notification)",
		handler: async (_args, ctx) => {
			await showSystemPrompt(ctx);
		},
	});

	pi.registerShortcut("ctrl+q", {
		description: "Debug: show full system prompt (notification)",
		handler: async (ctx) => {
			await showSystemPrompt(ctx);
		},
	});

	pi.registerFlag("debug-system-prompt", {
		type: "boolean",
		default: false,
		description: "Print the effective system prompt for the turn and exit before calling the model",
	});

	pi.on("before_agent_start", async (event) => {
		const enabled = pi.getFlag("debug-system-prompt");
		if (enabled !== true && enabled !== "true") return undefined;
		const ev = event as { prompt: string; systemPrompt: string };
		process.stdout.write(
			`${JSON.stringify({ type: "debug_system_prompt", prompt: ev.prompt, systemPrompt: ev.systemPrompt }, null, 2)}\n`,
		);
		process.exit(0);
	});
}
