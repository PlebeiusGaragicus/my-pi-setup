// One dotenv file for my-pi-setup runtime values (API keys, TTS speed).
//
// Default location: ~/.pi/my-pi-setup/.env (override with MY_PI_ENV_FILE).
// Created lazily from the repo's .env.example on first use, mode 0600.
// Skill scripts and extensions read it directly; nothing is injected into
// process.env or the system prompt. A non-empty shell variable still wins.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXAMPLE_PATH = path.join(PACKAGE_ROOT, ".env.example");
const DEFAULT_ENV_PATH = path.join(os.homedir(), ".pi", "my-pi-setup", ".env");
const VALID_KEY = /^[A-Z_][A-Z0-9_]*$/;

export function resolveEnvPath() {
	const override = process.env.MY_PI_ENV_FILE?.trim();
	if (override) return path.resolve(override);
	return DEFAULT_ENV_PATH;
}

function parseValue(raw) {
	const trimmed = String(raw ?? "").trim();
	if (!trimmed) return "";
	if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
		try {
			return JSON.parse(trimmed);
		} catch {
			return trimmed.slice(1, -1);
		}
	}
	if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}

export function parseEnv(raw) {
	const env = {};
	for (const line of String(raw ?? "").split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const body = trimmed.startsWith("export ") ? trimmed.slice("export ".length).trimStart() : trimmed;
		const equals = body.indexOf("=");
		if (equals <= 0) continue;
		const key = body.slice(0, equals).trim();
		if (!VALID_KEY.test(key)) continue;
		env[key] = parseValue(body.slice(equals + 1));
	}
	return env;
}

/** Keys declared in .env.example, in file order. */
export function knownEnvKeys() {
	if (!fs.existsSync(EXAMPLE_PATH)) return [];
	return Object.keys(parseEnv(fs.readFileSync(EXAMPLE_PATH, "utf8")));
}

function chmod600(file) {
	try {
		fs.chmodSync(file, 0o600);
	} catch {
		/* platform may not support it */
	}
}

export function ensureEnvFile() {
	const envPath = resolveEnvPath();
	if (fs.existsSync(envPath)) return envPath;
	fs.mkdirSync(path.dirname(envPath), { recursive: true, mode: 0o700 });
	const body = fs.existsSync(EXAMPLE_PATH) ? fs.readFileSync(EXAMPLE_PATH, "utf8") : "";
	fs.writeFileSync(envPath, body, { encoding: "utf8", mode: 0o600 });
	chmod600(envPath);
	return envPath;
}

export function readEnv() {
	const envPath = ensureEnvFile();
	try {
		return parseEnv(fs.readFileSync(envPath, "utf8"));
	} catch {
		return {};
	}
}

export function writeEnv(env) {
	const envPath = resolveEnvPath();
	fs.mkdirSync(path.dirname(envPath), { recursive: true, mode: 0o700 });
	const keys = new Set([...knownEnvKeys(), ...Object.keys(env).sort()]);
	const body =
		[...keys]
			.filter((key) => VALID_KEY.test(key))
			.map((key) => `${key}=${JSON.stringify(String(env[key] ?? ""))}`)
			.join("\n") + "\n";
	const tmp = `${envPath}.tmp.${process.pid}`;
	fs.writeFileSync(tmp, body, { encoding: "utf8", mode: 0o600 });
	fs.renameSync(tmp, envPath);
	chmod600(envPath);
}

/** Shell value if set and non-empty, else the file value, else "". */
export function envValue(key, env = readEnv()) {
	const fromProcess = process.env[key]?.trim();
	if (fromProcess && fromProcess !== `$${key}`) return fromProcess;
	return env[key]?.trim() ?? "";
}
