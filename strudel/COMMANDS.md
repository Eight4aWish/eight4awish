# Command Budget — essentials only

*Log of the Strudel commands introduced per lesson. See `COURSE.md`.*

**The rule:** each lesson introduces **no more than 5 new commands** (Lesson 1 gets 6 — the
one-time output "plumbing"). Nothing is taught that isn't reused. If a lesson wants a 6th new
command, something has to be cut or deferred. This keeps the whole course to a **~20-command
essentials set**.

"Command" = a Strudel function/method. Mini-notation tokens (`x ~ [ ] < >`) are listed
separately — they're learning load too, but lighter.

---

## Per-lesson budget

| Chapter | New commands (functions/methods) | New notation | New | Running |
|---|---|---|---|---|
| **1 — Setup** (prove the chain) | `note()`, `.struct()`, `stack()`, `.midichan()`, `.midi()`, `.cpm()` | `x` hit, `~` rest, space = next step | 6 | 6 |
| **2 — Arrangement** | `n()`, `.scale()`, `arrange()` | `[ ]` subdivide, `< >` alternate | 3 | 9 |
| **3 — Drums** | `.euclid()`, `.slow()`, `.fast()`, `.swing()` | — | 4 | 13 |
| **4 — Melody** | `.add()` (transpose in-key) | `\|` random, `_` note-length | 1 | 14 |
| **5 — Movement** | `ccn()`, `ccv()`, `.range()`, `.segment()`, mod sources* | — | 5 | 19 |
| **6 — Generative** | `.degradeBy()`, `.undegradeBy()`, `.sometimesBy()` — **vary the amount** (`<…>`/slider) = "how random" knob; + `._pianoroll()`/`._punchcard()` (viz — *see* it) | — | 3 | 22 |
| **7 — Visuals** | **Hydra** (separate lang): `initHydra`, `osc`, `.color/.rotate/.modulate/.kaleid/.scale/.out`, `a.fft`; + aesthetic viz `._spiral()`/`._pitchwheel()` | — | +viz | 22 |

\* **mod sources** = the *automatic* LFO family (`sine / tri / saw / isaw / square / perlin / rand`)
plus the *manual* **`slider(v,min,max)`** fader — one concept: a changing value feeding `ccv`,
whether an LFO drives it or your hand does. (The LFO family counts as one, not seven.)

**Total Strudel commands ≈ 22** across chapters 1–6 — **all verified** — **+ 7 notation tokens.**
Chapter 7 is **Hydra** — a separate visual language (~8 functions), tracked apart from the count.

### Keyboard shortcuts (introduced across the chapters)
Hands-on-keyboard is the whole point of live coding. Each shortcut lands in the chapter where it
first earns its keep — front-loaded like the commands (2 in Ch1, 2 in Ch2, 1 in Ch3).

| Action | Ch | Mac | Win/Linux | Use |
|---|---|---|---|---|
| **Play / update** | 1 | Ctrl+Enter | Ctrl+Enter | run the code / apply an edit |
| **Stop** (hush) | 1 | Ctrl+. | Ctrl+. | silence everything |
| **Mute a line** | 2 | Cmd+/ | Ctrl+/ | comment a voice out to hear the rest |
| **Move line** | 2 | Opt+↑/↓ | Alt+↑/↓ | reorder the `arrange()` sections |
| **Duplicate line** | 3 | Shift+Opt+↓ | Shift+Alt+↓ | copy a drum/voice row into a variation |

**Play & Stop are `Ctrl+Enter` / `Ctrl+.` on every platform — Mac included, NOT Cmd** (confirmed on
the rig). Only **Mute** uses Cmd on Mac (`Cmd+/`), because it's the editor's comment toggle;
Duplicate/Move are CodeMirror's Opt/Alt combos. (AZERTY: Stop can be Ctrl+:.)

**L4 depth = craft + arrangement, not command volume.** Its meat is writing in-key bass/lead
lines, register separation, following a progression with `.add()`, varying with `|`, and
extending the L2 verse/chorus into a full **intro / verse / chorus / bridge / outro** song — using
the SAME `arrange()` (no new command). A consolidation lesson with one new command is fine by
design: the budget is a ceiling, not a quota.

### Command clarifications
- **`note` vs `n` — NOT the same.** `note(36)` = a *literal* MIDI note (drums). `n("0 2").scale(...)`
  = a *scale degree* (melody, always in key). `note("0 2")` would play MIDI 0/2 (subsonic), not the
  tune. Both essential, different jobs — hence `note` in L1 (drums), `n` in L2 (melody).
- **Double quotes = pattern, single quotes = plain string.** Strudel's transpiler turns every
  **double-quoted** string (and backticks) into a mini-notation **pattern**; **single-quoted**
  strings are left as ordinary JS strings. So `n("0 2 4")`, `.scale("C4:minor")` and even
  `const prog = "<0 3 4 0>"` are *patterns* — which is exactly why `.add(prog)` works. Device
  names must stay single-quoted: `.midi('Phazerville')`.
- **`.slow()` / `.fast()`** — `.slow(n)` stretches a pattern over n cycles (slower); `.fast(n)`
  squeezes it into 1/n (faster). Reciprocals: `.fast(2)` == `.slow(0.5)`. Introduced together in
  **L3** (L2 is already busy); reused by L5's LFOs.
- **No `.velocity()`** — dropped. Nothing on this rig maps to it (Workshop = pitch/gate/CC42;
  O&C maps = Note/Gate, not Veloc). Add back only if a module actually uses velocity.
- **`|` (random choice)** — `n("0 2 | 5 7")` picks one alternative at random each cycle. A melodic
  variation tool that introduces randomness, so it bridges toward L6 (generative).
- **`_` (note length)** — the complement to `[ ]`: `n("0 _ _ 2")` holds `0` for 3 steps, `2` for 1
  (each `_` extends the previous note by a step; `@n` is the numeric form). On the rig a note's
  length IS the gate length, so `_` = sustained vs staccato in the rack. `.legato(x)` is an optional
  articulation refinement (0.5 staccato … 2 held). **Verified on the rig:** note length *does* drive
  the MIDI gate length.
- **`slider(v, min, max, step?)` (L5)** — inlines a draggable fader in the code, kept in sync with
  the value; returns a pattern, so `ccn(42).ccv(slider(0,-1,1))` = a hands-on mod CV (−5…+5V). The
  *manual* counterpart to the LFOs (folded into "mod sources", no extra command slot) — great for
  fade-ins and live performance. Can drive any param, e.g. `.slow(slider(4,1,8,1))`.
- **Inline visualisers** — pattern-based work MIDI-only: **`._pianoroll()`** (scrolling note bars) and
  **`._punchcard()`** (same, but reflects downstream transforms and is lighter — reuses the mini-notation
  highlight data). Introduced in **L6** to *see* generative/random patterns. `._pitchwheel()`/`._spiral()`
  are more aesthetic (L7). Audio-based `._scope()`/`._spectrum()` show nothing for us (Strudel makes no
  sound) — Hydra's `a.fft` on the Scarlett reacts to the real rack audio instead. `_` prefix = inline;
  no prefix = page background.

---

## Why this works with top-down Lesson 2
The worry: a top-down "full track in Lesson 2" looks command-heavy. It isn't, *because Lesson 1
front-loads the plumbing* (`note/struct/stack/midichan/midi/cpm`). By Lesson 2 those are known,
so a full drums+bass+pad+lead+arrangement track only spends **3 new commands** (`n`, `scale`,
`arrange`). The budget and the top-down hook don't fight.

## Notes / open items
- **Lesson 1 done** — now the plumbing-only MIDI-chain proof (Hydra stripped, velocity gone,
  drum beat on the O&C 'Phazerville'). Matches the 6-command budget exactly.
- **Confirmed on the rig:** L1/L2 commands (two-box track proven); L5 `ccn/ccv/.range/.segment`
  + signals (mods proven; `ccv` is bipolar −1..1).
- **`.add()` (L4) — verified:** on `n` degrees (before `.scale()`) it adds **scale steps** →
  transposes in-key, e.g. `n("0 2 4".add("<0 3 4 0>")).scale("C:minor")` = an in-key progression.
  On `note()` it adds semitones instead. Harmony = `.add()` + `superimpose` (a 2nd command → aside/L6).
- **`.swing()` / `.swingBy()` (L3) — verified:** `.swing(n)` = shorthand for `.swingBy(1/3, n)`,
  the classic shuffle — splits each cycle into n slices and delays the offbeat half by 1/3. Use
  **`.swing(4)`** on the 8-step grids. `.swingBy(amount, n)` is the same with an adjustable amount
  (0 = none, 1/3 = shuffle, 0.5 = hard). Teach `.swing()` as the idiom; `.swingBy()` is the knob.
- **Deliberately NOT in the essentials** (would blow the budget / off-house-style): raw
  mini-notation drums, comma-stack chords `[0,4]`, `cat`/`pick` alternation, sample playback,
  `.gain()`/effects (sound is the rack), and **harmony/`superimpose`** — the rig's voices are
  **mono** (one pitch CV each), so simultaneous notes on a channel just retrigger, no chord.
- **Perform is NOT a lesson — it's a running technique.** Mute/swap live = comment a `$:` line
  out (or prefix it `_$:`) and re-run; build-from-silence = add lines one at a time. `.hush()` isn't
  an essential (it stops everything; commenting mutes one part). Woven through + demoed in the primer.
- **L7 Hydra** reuses the proven audio-reactive block (git history of the old `lesson0`/`lesson1`):
  `initHydra({detectAudio:true})` + `a.fft[...]` on the Scarlett. A separate visual language, kept
  OUT of L2/the primer (parked there), now its own final visuals lesson.
- **Turing randomness — resolved (pragmatic).** Don't build a literal Turing machine. Use
  **`degradeBy` + varying its amount** (patterned `<…>` or a `slider`) as the "how random" knob —
  captures the Turing *feel* (controllable, evolving density). `undegradeBy` = the complementary
  stream (keeps what degrade drops → split a line across two voices); `sometimesBy(p, fn)` = the
  occasional *mutation*. Honest caveat for the video: this is density/probability, NOT a locked
  melody that mutates one note. A true locked/looping sequence is possible via Strudel's `seed`
  system — an optional advanced aside, not core.
- **Generative family — VERIFIED** (source + browser): `degradeBy` is patternified, so its amount can
  be a pattern (`"<0.2 0.5>"`) or a `slider`; it's driven by `rand`, a **time-based signal**, so it
  re-rolls every cycle; `undegradeBy(x)` keeps **exactly** what `degradeBy(x)` drops (true complement,
  same random values); `sometimesBy(probability, fn)` takes a lambda, e.g. `x => x.add(7)`.
