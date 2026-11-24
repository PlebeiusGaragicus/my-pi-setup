---
name: tavily
description: Search the live web and read web pages with Tavily. Use for current events, news, documentation, and any question that needs up-to-date sources.
---

# Tavily web search

Run the script with the bash tool. It lives in this skill's folder: use the full path, `<this skill's directory>/scripts/tavily`.

```bash
scripts/tavily search "your question or keywords"
scripts/tavily search "latest news on X" --news
scripts/tavily extract https://example.com/page
```

- `search` prints titles, URLs, dates, and a snippet for each result (5 by default; `--num N` for more, max 20).
- `--news` limits results to news from the past week.
- `extract` prints the text of one or more pages (up to 10,000 characters each).

## How to use it

1. Search first. Answer from the snippets if they are enough.
2. Extract only the one or two pages that look most useful.
3. Cite the URLs you used.
4. Do not repeat the same search; each call costs credits.

If the script prints `Error:`, read it. A missing key means the user must run `/my-pi-api-keys`; stop and tell them.
