---
name: exa-search
description: Search and retrieve web content with Exa via bash using exa-search, exa-contents, and exa-similar. Use for live web research, source discovery, similar-page discovery, and token-efficient page excerpts.
disable-model-invocation: false
---

# Exa CLI

Run `scripts/exa-search`, `scripts/exa-contents`, `scripts/exa-similar` with the **bash** tool. Each is a script in this skill's directory, not Pi tools and not on PATH: resolve `scripts/…` against the directory containing this SKILL.md and run the absolute path.

The scripts are intentionally verbose on failure: missing keys, unknown options, missing option values, and Exa HTTP errors print a specific `Error:` line to stderr and exit nonzero.

## Commands

```bash
scripts/exa-search "query" --num 8
scripts/exa-contents https://example.com --highlights "what to extract"
scripts/exa-similar https://example.com --num 8
```

Add `--json` to any command when raw machine-readable output is more useful than the default readable text.

## Search

Use **`exa-search`** first to find candidate sources:

```bash
scripts/exa-search "recent AI search APIs" --num 5
scripts/exa-search "transformer architecture survey" --category "research paper"
scripts/exa-search "AI regulation update" --category news --date-after 2026-01-01
```

Options:

- `--num N`: result count, default 10, max 10.
- `--type TYPE`: `auto`, `fast`, `instant`, `deep-lite`, `deep`, or `deep-reasoning`.
- `--category TYPE`: Exa category such as `news`, `research paper`, `company`, `people`, `personal site`, or `financial report`.
- `--date-after YYYY-MM-DD` / `--date-before YYYY-MM-DD`: publication-date filters.
- `--highlights "query"`: include focused excerpts in search results.
- `--text`: include page text capped to 10000 characters per result.
- `--json`: print the raw Exa API response.

## Contents

Use **`exa-contents`** after search to inspect only the URLs that matter:

```bash
scripts/exa-contents https://url1.example https://url2.example --highlights "pricing limits"
scripts/exa-contents https://url.example --text
```

Prefer `--highlights` for targeted facts and multi-source research. Use `--text` when the full page context matters.

## Similar Pages

Use **`exa-similar`** to find related sources from a known-good URL:

```bash
scripts/exa-similar https://example.com/article --num 5
```

## Workflow

1. Search with 6-10 results unless the task clearly needs broader coverage.
2. Fetch highlights for the most relevant URLs instead of fetching full text by default.
3. Fetch full text only for sources worth reading deeply.
4. Cite URLs from the script output in the final answer.
5. Stop when results converge; repeated Exa calls cost credits.

## Failure Handling

- If a script exits nonzero, read stderr before retrying.
- If Exa returns an HTTP error, report the status and provider message to the user.
- If output is too verbose, retry with fewer results or use `--highlights` instead of `--text`.
