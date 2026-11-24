---
name: arxiv
description: Search arXiv for research papers and read a paper's full text. Use for academic papers, machine learning and physics research, and questions about a specific arXiv paper.
---

# arXiv

Run the script with the bash tool. It lives in this skill's folder: use the full path, `<this skill's directory>/scripts/arxiv`. No API key is needed.

```bash
scripts/arxiv search "rotary position embedding"
scripts/arxiv search "diffusion language models" --recent
scripts/arxiv read 2104.09864
```

- `search` prints title, arXiv ID, date, authors, and the start of the abstract (5 results by default; `--num N`, max 30).
- `--recent` sorts newest first instead of most relevant.
- `read` prints the whole paper as text, with `#` section headings. It accepts an ID or an arxiv.org link.
- For precise searches you may use field prefixes: `ti:` title, `au:` author, `abs:` abstract, e.g. `"au:hinton AND ti:capsule"`.

## How to use it

1. Search, then pick the best paper from the results.
2. Read a paper only when the abstract is not enough. Papers are long; focus on the sections that answer the question.
3. Lead with what the paper does and finds, not its authors or dates. Mention section names when you cite details.
4. Search at most once per question unless the query changes; arXiv asks for gentle use.

If `read` says there is no HTML version, tell the user. Do not download the PDF unless they ask.
