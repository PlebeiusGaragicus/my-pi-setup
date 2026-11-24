---
name: todo
description: Use bash for the todo utility for shared task list management with the user.
disable-model-invocation: true
---

# Todo CLI

Run `scripts/todo` with the **bash** tool. Each is a script in this skill's directory, not Pi tools and not on PATH: resolve `scripts/…` against the directory containing this SKILL.md and run the absolute path.

`todo` is a simple cli utility used to manage shared todo lists with the user.  Todo lists are project-scoped `todo.jsonl` files not meant to be viewed or edited except via the `todo` utility.

Before using, always run `scripts/todo` with no arguments to see the built-in usage:

```bash
scripts/todo
```

## Project-scoped todo lists

Work in the **intended project root** (the directory where the task list should live—usually the repo or workspace cwd). Run `todo which`. The active file is always that path.

Prefer **`./todo.jsonl` in the project root** for coding work so tasks do not silently attach to a parent repo or the global fallback file.

## Leave destructive actions to the user

Avoid destructive actions (eg. `todo del`, `todo rm`, `todo tidy`) unless explicitly instructed by the user. The user is expected to co-manage the list along with the agent. If cleanup is needed, **ask the user** or provide the suggestion to the user.

**`todo file`** is appropriate to run if the user has not yet started a project-level todo list and instructions don't clarify.  A system-wide `~/.todo/todo.jsonl` may also exist and is used by `todo` unless a project-level file is found.