---
name: ntfy
description: Send push notifications via ntfy using bash and ntfy-send (default topic bot; override with --topic when the user names another topic.
disable-model-invocation: false
---

# ntfy notifications

Use when the user wants **push notifications** on phone or desktop via [ntfy](https://ntfy.sh/).

Run `scripts/ntfy-send` with the **bash** tool. Each is a script in this skill's directory, not Pi tools and not on PATH: resolve `scripts/…` against the directory containing this SKILL.md and run the absolute path.

## Default topic (`bot`)

Notifications use topic **`bot`** unless you pass **`--topic <name>`** (when the user asks for a different topic).

## Commands

```bash
scripts/ntfy-send "Hello from the agent"
scripts/ntfy-send "Deploy OK" --title "Production" --priority 5 --tags warning,deploy
scripts/ntfy-send --topic alerts "Pager message"
echo "Build finished" | ntfy-send
```

The message is all remaining arguments (or stdin when piped).

- **`--topic NAME`** — default **`bot`**
- **`--title TEXT`** — notification title
- **`--priority N`** — **1** (lowest) through **5** (highest)
- **`--tags LIST`** — comma-separated tags

If something goes wrong, the script prints a clear **`Error:`** line to stderr.
