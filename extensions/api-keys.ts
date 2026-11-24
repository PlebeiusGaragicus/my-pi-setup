/**
 * /my-pi-api-keys — view and edit ~/.pi/my-pi-setup/.env (API keys and other
 * runtime values used by skill scripts and extensions).
 *
 *   /my-pi-api-keys                  pick a key from a menu and enter its value
 *   /my-pi-api-keys path             show the file path
 *   /my-pi-api-keys list             show every key (secrets shown as <set>)
 *   /my-pi-api-keys set KEY VALUE    set a value
 *   /my-pi-api-keys unset KEY        clear a value
 *
 * You can also edit the file directly in any editor; scripts re-read it on every run.
 */

import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { knownEnvKeys, readEnv, resolveEnvPath, writeEnv } from "../lib/env.js";

const SUBCOMMANDS = ["path", "list", "set", "unset"];

function isSecret(key: string): boolean {
	return /PASSWORD|API_KEY|TOKEN|SECRET/.test(key);
}

function shown(key: string, value: string): string {
	if (!value) return "<unset>";
	return isSecret(key) ? "<set>" : value;
}

function allKeys(env: Record<string, string>): string[] {
	return [...new Set([...knownEnvKeys(), ...Object.keys(env).sort()])];
}

function setValue(key: string, value: string): void {
	const env = readEnv();
	env[key] = value;
	writeEnv(env);
}

async function interactive(ctx: ExtensionCommandContext): Promise<void> {
	const env = readEnv();
	const rows = [...allKeys(env).map((key) => `${key} = ${shown(key, env[key] ?? "")}`), "Show file path"];
	const choice = await ctx.ui.select("my-pi-setup .env", rows);
	if (!choice) return;
	if (choice === "Show file path") {
		ctx.ui.notify(resolveEnvPath(), "info");
		return;
	}
	const key = choice.split(" = ", 1)[0];
	const value = await ctx.ui.input(`Value for ${key} (empty clears it)`);
	if (value === undefined || value === null) return;
	setValue(key, value.trim());
	ctx.ui.notify(value.trim() ? `${key} saved` : `${key} cleared`, "info");
}

export default function registerApiKeys(pi: ExtensionAPI): void {
	pi.registerCommand("my-pi-api-keys", {
		description: "View or edit API keys in ~/.pi/my-pi-setup/.env",
		getArgumentCompletions: (prefix) => {
			const matches = SUBCOMMANDS.filter((item) => item.startsWith(prefix));
			return matches.length ? matches.map((value) => ({ value, label: value })) : null;
		},
		handler: async (args, ctx: ExtensionCommandContext) => {
			if (!ctx.hasUI) return;
			const [command, key, ...rest] = args.trim().split(/\s+/).filter(Boolean);
			if (!command) return interactive(ctx);
			if (command === "path") return ctx.ui.notify(resolveEnvPath(), "info");
			if (command === "list") {
				const env = readEnv();
				const lines = allKeys(env).map((k) => `${k}=${shown(k, env[k] ?? "")}`);
				return ctx.ui.notify([resolveEnvPath(), ...lines].join("\n"), "info");
			}
			if (command === "set" && key) {
				const value = rest.join(" ");
				setValue(key, value);
				return ctx.ui.notify(value ? `${key} saved` : `${key} cleared`, "info");
			}
			if (command === "unset" && key) {
				setValue(key, "");
				return ctx.ui.notify(`${key} cleared`, "info");
			}
			ctx.ui.notify(`Usage: /my-pi-api-keys [path|list|set KEY VALUE|unset KEY]\nFile: ${resolveEnvPath()}`, "info");
		},
	});
}
