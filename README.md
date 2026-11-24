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
| `/say`, `/stop-speaking`, `/tts-toggle`, `/tts-wpm` | Text-to-speech via macOS `say` or Linux `espeak-ng`; `--tts-enable` turns auto-speak on |
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

**Skills** (`skills/`)

| Skill | Purpose | Needs |
| --- | --- | --- |
| `tavily-search` | Web search and page extraction | `TAVILY_API_KEY` |
| `exa-search` | Web search, similar pages, page contents | `EXA_API_KEY` |
| `arxiv-search` | arXiv search and paper fetch | `pandoc` |
| `congress-search` | Bills, laws, members, votes from congress.gov | `CONGRESS_GOV_API_KEY` |
| `btc-price` | Bitcoin spot price (CoinGecko) | — |
| `ntfy` | Push notifications | `NTFY_BASE_URL` (+ optional user/password) |
| `todo` | Shared project todo list (`todo.jsonl`) | `jq` |
| `humanizer` | Remove signs of AI-generated writing | — |
| `how-to-debate` | Structure debate notes into evidence-based arguments | — |
| `courtlistener` | U.S. case law via the CourtListener API | — |
| `random-number` | Random numbers in bash | — |

`todo` and `courtlistener` set `disable-model-invocation: true`, so they are hidden from the model's skill list and load only when you invoke them explicitly.

Skill scripts live in each skill's `scripts/` folder and are run by path; nothing is added to `PATH`.

## API keys

All runtime values live in one file, `~/.pi/my-pi-setup/.env` (override with `MY_PI_ENV_FILE`). It is created from [`.env.example`](.env.example) on first use with mode `0600`. Edit it with `/my-pi-api-keys` or any editor. Scripts read it on every run, and a non-empty shell variable of the same name takes precedence. Values are never put into the system prompt or Pi's environment.

TTS speed (`SAY_TTS_WPM`) is stored in the same file by `/tts-wpm`.
