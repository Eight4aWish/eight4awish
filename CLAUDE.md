# eight4awish

Astro site for eight4awish.com. `src/content/modules/` is the published module collection; `docs/` is the build output, not source.

## The README and the site stay in step

`README.md` is my GitHub profile page, so it's the front door to every repo. **Any change to
the website brings the README up to date with it**, and new work reaches both.

- The blocks between `<!-- generated:x -->` markers come from the site's content, through
  `tools/build-readme.mjs`. Change the content (`src/content/`), not the block: the next
  build or deploy would overwrite it. A build regenerates it, so `npm run deploy` carries it.
- `.github/workflows/readme.yml` catches what skips a deploy, every day and on every push
  to the content: a new public repo, a missing image, a dead source link, or a release newer
  than the one its page offers. A failed run means something needs a person.
- The hand-written parts, and `REPO_NOTES` in the script, are mine to keep true: when a
  change makes them wrong, fix them in the same commit.
- A new module gets a `src/content/modules/` page (with `draft: true` until it's released)
  and a line in `MODULES.md`. Give a draft its `firmware:` link, and it's listed on the README
  as built.
- Pull before pushing: the workflow can commit the README to `main`.

Every firmware or gateware app has its own README (`docs/<APP>.md` in `eurorack_modules`,
`SILVER.md` and `GOLD.md` in `tiliqua`), and its repo's README lists it, both written when the
app is created and updated when it changes.

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
