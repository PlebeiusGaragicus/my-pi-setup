# my-pi-setup

My personal Pi package: themes, status line, notifications, TTS, prompt templates, and skills.

## Install

```sh
pi install https://github.com/PlebeiusGaragicus/my-pi-setup.git
# or, from a local clone:
pi install ./my-pi-setup
```

## Features

**Themes** (`themes/`) — GitHub Dark Default, Midnight Ocean, Night Owl, Ocean Breeze, Rosé Pine, Synthwave, Tokyo Night. `Ctrl+Option+R` cycles through installed themes.

**Status line** — live per-turn run timer (`Running: MM:SS`, then `Trajectory time`) and tokens-per-second.

**Finish notification** — desktop notification with a preview of the reply when the agent finishes (macOS `osascript`, Linux `notify-send`, else Kitty/OSC 777).

**Commands**

| Command | What it does |
| --- | --- |
| `/my-pi-api-keys` | Edit API keys in `~/.pi/my-pi-setup/.env` (menu, or `path` / `list` / `set KEY VALUE` / `unset KEY`) |
| `/save` | Save the last assistant reply as a markdown file |
| `/say`, `/stop-speaking`, `/tts-toggle`, `/tts-wpm` | Text-to-speech: Piper if installed (voice and speed from `~/.config/say/config`: `PIPER_MODEL`, `SAY_SPEED`; else the first voice in `~/.local/share/piper/`), otherwise macOS `say` or `espeak-ng`. `/tts-wpm` applies to `say`/`espeak-ng` only. `--tts-enable` turns auto-speak on |
| `/focus` (`on`/`off`) | Focus mode: hide tool calls, tool output, and thinking so the transcript shows only messages and replies; `pi --focus` starts with it on |
| `/debug-system-prompt` (`Ctrl+Q`) | Show the full effective system prompt |

`pi --debug-system-prompt -p "<msg>"` prints the turn's system prompt as JSON and exits without calling the model.

**Prompt templates** (`prompts/`) — development-process shortcuts:

| Template | Purpose |
| --- | --- |
| `/is` | Turn an idea or bug into an issue/spec |
| `/pl` | Plan implementation from an issue or request |
| `/im` | Implement an approved plan without committing |
| `/wr` | Wrap up: checks, changelog, commit, optional push |
| `/pr` | Review a PR's merge readiness |
| `/cl` | Audit changelog coverage |
| `/re` | Prepare a release |

**Skills** (`skills/`) — each skill is one folder: a short `SKILL.md` plus one Python 3 standard-library script in `scripts/`. No pip packages, no shared code, nothing added to `PATH`; the agent runs scripts by their full path.

| Skill | Script | Needs |
| --- | --- | --- |
| `tavily` | `tavily search` / `extract` | `TAVILY_API_KEY` |
| `exa` | `exa search` / `extract` / `similar` | `EXA_API_KEY` |
| `arxiv` | `arxiv search` / `read` | — |
| `congress` | `congress search` / `bill` | `CONGRESS_GOV_API_KEY` |
| `courtlistener` | `courtlistener search` / `case` / `cite` | `COURTLISTENER_API_TOKEN` |
| `btc-price` | `btc-price [currency ...]` | — |
| `humanizer` | — (writing guide: remove signs of AI-generated text) | — |
| `how-to-debate` | — (structure debate notes into evidence-based arguments) | — |

## API keys

All runtime values live in one file, `~/.pi/my-pi-setup/.env` (override with `MY_PI_ENV_FILE`). It is created from [`.env.example`](.env.example) on first use with mode `0600`. Edit it with `/my-pi-api-keys` or any editor. Scripts read it on every run, and a non-empty shell variable of the same name takes precedence. Values are never put into the system prompt or Pi's environment.

TTS speed (`SAY_TTS_WPM`) is stored in the same file by `/tts-wpm`.
