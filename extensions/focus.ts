/**
 * Focus mode — hide tool calls and their output so the transcript shows only
 * your messages and the assistant's replies.
 *
 *   /focus            toggle
 *   /focus on|off     set explicitly
 *   pi --focus        start with focus mode on
 *
 * While focus mode is on, the working indicator names the tool currently
 * running, and a "focus" badge shows in the footer. Turning it off redraws
 * every hidden tool row with its normal renderer; nothing is lost. Display-only:
 * the model sees the same context either way.
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Container, Text } from "@earendil-works/pi-tui";

const STATUS_KEY = "focus";

export default function registerFocus(pi: ExtensionAPI): void {
	let focus = false;

	pi.registerFlag("focus", {
		type: "boolean",
		default: false,
		description: "Start in focus mode (hide tool calls and output)",
	});

	// Wrap every tool's renderer: empty while focused, the normal one otherwise.
	// The flag is checked at render time, so toggling affects existing rows too.
	pi.registerToolRenderer((toolName, next) => {
		const base = next();
		return {
			...base,
			// "self" drops the default padded Box, so a hidden row takes no space.
			get renderShell() {
				return focus ? "self" : base?.renderShell;
			},
			renderCall(args, theme, context) {
				if (focus) return new Container();
				if (base?.renderCall) return base.renderCall(args, theme, context);
				return new Text(theme.fg("toolTitle", theme.bold(toolName)), 0, 0);
			},
			renderResult(result, options, theme, context) {
				if (focus) return new Container();
				if (base?.renderResult) return base.renderResult(result, options, theme, context);
				const text = result.content
					.filter((c) => c.type === "text")
					.map((c) => (c as { text: string }).text)
					.join("\n");
				return new Text(theme.fg("toolOutput", text), 0, 0);
			},
		};
	});

	// Blank out visible thinking blocks while focused (display-only).
	pi.registerMarkdownTransformer((markdown) => (focus ? "" : markdown), {
		messageTypes: ["assistant-thinking"],
	});

	function apply(ctx: ExtensionContext, on: boolean): void {
		focus = on;
		if (!ctx.hasUI) return;
		ctx.ui.setStatus(STATUS_KEY, on ? ctx.ui.theme.fg("accent", "focus") : undefined);
		if (on) ctx.ui.setHiddenThinkingLabel("");
		else {
			ctx.ui.setHiddenThinkingLabel();
			ctx.ui.setWorkingMessage();
		}
		// Force tool rows to re-render with the new mode.
		const expanded = ctx.ui.getToolsExpanded();
		ctx.ui.setToolsExpanded(!expanded);
		ctx.ui.setToolsExpanded(expanded);
	}

	pi.on("session_start", async (_event, ctx) => {
		const flag = pi.getFlag("focus");
		if (flag === true || flag === "true") apply(ctx, true);
		else if (focus) apply(ctx, true);
	});

	pi.on("tool_execution_start", async (event, ctx) => {
		if (focus && ctx.hasUI) ctx.ui.setWorkingMessage(`Running ${event.toolName}…`);
	});

	pi.on("tool_execution_end", async (_event, ctx) => {
		if (focus && ctx.hasUI) ctx.ui.setWorkingMessage();
	});

	pi.on("agent_end", async (_event, ctx) => {
		if (focus && ctx.hasUI) ctx.ui.setWorkingMessage();
	});

	pi.registerCommand("focus", {
		description: "Toggle focus mode: hide tool calls and output (/focus [on|off])",
		getArgumentCompletions: (prefix) => {
			const matches = ["on", "off"].filter((item) => item.startsWith(prefix));
			return matches.length ? matches.map((value) => ({ value, label: value })) : null;
		},
		handler: async (args, ctx) => {
			const arg = args.trim().toLowerCase();
			const on = arg === "on" ? true : arg === "off" ? false : !focus;
			apply(ctx, on);
			if (ctx.hasUI) ctx.ui.notify(on ? "Focus mode on — tool calls hidden" : "Focus mode off", "info");
		},
	});
}
