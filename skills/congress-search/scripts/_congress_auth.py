#!/usr/bin/env python3
"""Load the Congress.gov API key from the shell environment or ~/.pi/my-pi-setup/.env."""

from __future__ import annotations

import os
import sys
from pathlib import Path

ENV_KEY = "CONGRESS_GOV_API_KEY"
SIGNUP_URL = "https://api.congress.gov/sign-up/"


def _runtime_env_path() -> str:
    override = os.environ.get("MY_PI_ENV_FILE", "").strip()
    if override:
        return str(Path(override).expanduser().resolve())
    return str(Path.home() / ".pi" / "my-pi-setup" / ".env")


def fail_missing_api_key() -> None:
    config_path = _runtime_env_path()

    print("Error: Congress.gov API key not configured.", file=sys.stderr)
    print("", file=sys.stderr)
    print(f"Get a key: {SIGNUP_URL}", file=sys.stderr)
    print(f"Set {ENV_KEY} in {config_path} or run /my-pi-api-keys set {ENV_KEY} <key>", file=sys.stderr)
    print("", file=sys.stderr)
    print("In Pi: run /my-pi-api-keys for setup.", file=sys.stderr)
    print("", file=sys.stderr)
    print("Agents: do not retry until the key is set.", file=sys.stderr)

    raise SystemExit(1)


def _read_env_file_value(key: str) -> str:
    """Read KEY from the my-pi-setup .env file (same format lib/env.js writes)."""
    try:
        lines = Path(_runtime_env_path()).read_text(encoding="utf-8").splitlines()
    except OSError:
        return ""
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):].lstrip()
        name, sep, raw = line.partition("=")
        if not sep or name.strip() != key:
            continue
        raw = raw.strip()
        if len(raw) >= 2 and raw[0] == raw[-1] and raw[0] in "\"'":
            raw = raw[1:-1]
        return raw.strip()
    return ""


def get_api_key() -> str:
    value = os.environ.get(ENV_KEY, "").strip() or _read_env_file_value(ENV_KEY)
    if value:
        return value
    fail_missing_api_key()
