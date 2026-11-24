---
name: courtlistener
description: Search U.S. case law, court dockets, judges, and oral arguments with CourtListener, read court opinions, and check whether legal citations are real. Use for legal research and verifying case citations.
---

# CourtListener (U.S. case law)

Run the script with the bash tool. It lives in this skill's folder: use the full path, `<this skill's directory>/scripts/courtlistener`.

```bash
scripts/courtlistener search "fourth amendment cell phone search"
scripts/courtlistener search "Apple v. Epic" --type dockets
scripts/courtlistener case 2680354
scripts/courtlistener cite "Roe v. Wade, 410 U.S. 113 (1973)"
```

- `search` finds court opinions by default (5 results; `--num N`, max 20). Use `--type dockets`, `--type judges`, or `--type oral-arguments` for other records. Opinion results include a **Cluster ID**.
- `case CLUSTER_ID` prints the case name, date, citation, and the full opinion text.
- `cite "text"` finds every legal citation in the text and says whether each one exists and which case it names. Use it to verify citations before relying on them.

## How to use it

1. Search, then read the one or two cases that matter with `case`.
2. Verify any citation you plan to give the user with `cite`.
3. Link to the courtlistener.com URLs from the output.

If the script prints `Error:`, read it. A missing token means the user must run `/my-pi-api-keys` (free token at courtlistener.com); stop and tell them.
