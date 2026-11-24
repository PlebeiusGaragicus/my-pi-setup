---
name: congress
description: Look up U.S. bills and laws on Congress.gov. Use for questions about legislation, what a bill does, its status, sponsors, and recent actions.
---

# Congress.gov

Run the script with the bash tool. It lives in this skill's folder: use the full path, `<this skill's directory>/scripts/congress`.

```bash
scripts/congress search postal service
scripts/congress search veterans health --congress 118
scripts/congress bill 118 hr 3076
```

- `search` finds bills whose **title** contains all the words you give (current Congress by default; `--congress N` for another, `--type hr` or `--type s` to narrow). Each result shows the exact `bill` command to get details.
- `bill CONGRESS TYPE NUMBER` prints the title, sponsor, status, the official CRS summary, recent actions, and cosponsors. Types: `hr`, `s`, `hjres`, `sjres`, `hconres`, `sconres`, `hres`, `sres`.

## How to use it

1. If you know the bill (e.g. "H.R. 3076 in the 118th Congress"), go straight to `bill`.
2. Otherwise `search` with 1–3 distinctive title words. Search only matches titles, so try short keywords, not sentences.
3. Cite bills like "118 HR 3076" with the congress.gov link from the output.

If the script prints `Error:`, read it. A missing key means the user must run `/my-pi-api-keys`; stop and tell them.
