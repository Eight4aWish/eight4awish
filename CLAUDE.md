# eight4awish

Astro site for eight4awish.com. `src/content/modules/` is the published module collection; `docs/` is the build output, not source.

## Committing here

**Commit and push straight to `main`.** Do not develop on a per-session `claude/*` branch,
and do not open a pull request unless I ask for one.

Claude Code on the web assigns an outcome branch of its own, derived from the session
title — treat this file as overriding it. If work has already been committed to such a
branch, fast-forward `main` onto it and push `main`.

The reason is one-way: the git proxy in those sessions accepts pushes that create or update
a ref but hangs up on a deletion, and the GitHub MCP server has no delete-branch tool. So a
branch created in a session cannot be removed from inside it — it is left for me to delete
by hand afterwards. Committing to `main` in the first place avoids that entirely.

## Module inventory

Before answering anything about which modules exist, what hardware is in the rack, or
which repo a module lives in, read the canonical inventory:

**`MODULES.md`** in the [`eight4awish`](https://github.com/Eight4aWish/eight4awish) repo
— <https://github.com/Eight4aWish/eight4awish/blob/main/MODULES.md>

It is in this repo, at the root.

It covers all ten repos: the released modules, the built-but-undrafted ones, the
purchased rack with HP and function, companion software, and what is deliberately *not*
a module. No single repo sees all of it, so do not infer the full picture from this one.
