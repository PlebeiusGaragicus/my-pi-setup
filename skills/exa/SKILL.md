---
name: exa
description: Search the web and read pages with Exa, or find pages similar to a known URL. Use for research, finding sources, and pulling specific facts out of pages.
---

# Exa web search

Run the script with the bash tool. It lives in this skill's folder: use the full path, `<this skill's directory>/scripts/exa`.

```bash
scripts/exa search "your question or keywords"
scripts/exa extract https://example.com/page
scripts/exa extract https://example.com/page --focus "pricing and limits"
scripts/exa similar https://example.com/good-article
```

- `search` prints titles, URLs, dates, and the most relevant passages (5 results by default; `--num N`, max 10).
- `extract` prints a page's text (up to 10,000 characters). Add `--focus "..."` to get only the passages about that topic, which is much shorter.
- `similar` finds pages like the one you give it.

## How to use it

1. Search first. Answer from the passages if they are enough.
2. Extract only the pages you need; prefer `--focus` when you want one fact.
3. Cite the URLs you used.
4. Do not repeat the same search; each call costs credits.

If the script prints `Error:`, read it. A missing key means the user must run `/my-pi-api-keys`; stop and tell them.
