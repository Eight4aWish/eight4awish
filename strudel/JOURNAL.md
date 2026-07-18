# Strudel/Hydra Learning Journal

*Honest running log of learning Strudel + Hydra while building the course. The mistakes and
discoveries here are course/video material — see [COURSE.md](COURSE.md). Newest at top.*

---

## 2026-07-10 — THE COURSE IS PROVEN. Bucket C (rig) all green ✅
Ran the rig checklist end to end. Everything works:
- **C1** — `_` (note length) **does** drive the MIDI gate length, so Chapter 4's sustained bass is
  genuinely sustained. This was the last thing that could have forced a chapter rewrite. `.legato()`
  stays an optional articulation refinement, not a fallback.
- **C2** — all four CC42 mods alive. The **sectional handoff** works (intro reveal → holds → bridge
  riser → chorus drop → outro conceal) and the **drift** wanders straight through section boundaries
  without resetting. Sectional and drifting mods coexist cleanly — one destination, one source.
- **C3** — `slider()` moves a mod CV by hand, in real time.
- **C4** — `a.fft` reacts to the rack via the Scarlett.
- **C5** — Chapter 7 runs end to end: song + sectional mods + drift + Hydra + pianoroll.

**Every claim across all seven chapters is now verified — docs, browser and rig — and nothing
needed changing.** VERIFY.md keeps the tests as a regression check. The course is ready for the
video process.

## 2026-07-09 — Ch5/Ch6 redesigned: "modulation IS arrangement" + drift. B6 confirmed.
David: mods running continuously outside `arrange()` make no musical sense — you can't build a
cutoff riser into a bridge if the LFO doesn't know the bridge exists. Correct, and it reshaped two
chapters (nothing had *failed* — the design was just wrong).

- **Ch5 Movement — sectional.** Every mod now lives INSIDE a section's `stack()`, so `arrange()`
  sequences the movement: intro **reveals** (`saw` up), verse **breathes** (`sine`), chorus
  **bright** + drum-bus **pump**, bridge **riser** (`saw.slow(4)` = one climb over 4 bars), outro
  **conceals** (`isaw` down). The drop is free — the chorus mod takes over from the riser. And a
  **CC holds its last value**, so the intro's reveal stays open until the outro closes it.
- **Ch6 Generative — drift.** Randomness extends from the NOTES to the MOVEMENT: the same mod slot
  from Ch5, fed a random signal. **`perlin` glides** (what a filter wants), **`rand` jumps**. Drift
  mods stack OUTSIDE `arrange()`, running across the whole song — colour, not choreography.
  Sectional (pad, bass) and drifting (lead, bus) coexist. No new command needed.
- **Rule enforced:** *one destination, one source.* Two CC patterns on the same channel+CC just
  overwrite each other; to combine, sum the signals with `.add()`.
- **The hardware difference finally earns its keep:** O&C mods are unipolar (0→6V) = ideal cutoff;
  Workshop mods are bipolar (±5V) = through-zero. Not a quirk any more, a reason to choose.
- **Ch7** inherits the new track.

**B6 confirmed in the browser:** a `.slow(4)` signal inside a 4-cycle `arrange()` section sweeps
exactly once, phased from the section's start. The whole sectional-mod design rests on this.
Everything a browser can answer is now answered — only Bucket C (rig) remains.

## 2026-07-09 — Command verification: buckets A + B done, nothing needs rewriting
Worked the outstanding Strudel-command questions (see `VERIFY.md`).

**Bucket A (docs/source) — all 9 green:**
- `.add(prog)` composes over `_` (duration) and `|` (choice) — they're orthogonal to value.
- `degradeBy` is **patternified** (`register('degradeBy', fn, true, true)`) → amount can be
  `"<0.2 0.5>"` or a `slider`. Driven by `rand`, a **time-based signal**, so it re-rolls each cycle.
- `undegradeBy(x)` keeps **exactly** what `degradeBy(x)` drops — a true complement.
- `sometimesBy(probability, fn)` takes a lambda. Degree **7** wraps to the root an octave up.
- `H()` is used *as a Hydra parameter* in the docs' own `shape(H(pattern))`, so `.rotate(H(…))` is fine.

**Big find:** Strudel's transpiler turns every **double-quoted** string into a mini-notation
**pattern**; single-quoted strings stay plain JS. So `const prog = "<0 3 4 0>"` really is a pattern
(hence `.add(prog)` works), and device names must stay single-quoted (`.midi('Phazerville')`).
Now recorded in COMMANDS.md — it was load-bearing and undocumented anywhere in our notes.

**Bucket B (browser) — all 5 confirmed on the rig-less REPL**, including Chapters 4–7 running clean.
The riskiest item passed: **`arrange()` stacked with continuous CC patterns** (B3) — Chapters 5–7
all rest on that structure.

**Nothing in Chapters 1–7 required changing.** Remaining: Bucket C (rig only) — `_` → MIDI gate
length, the four CC42 mods sweeping CV, `slider()` by hand, and `a.fft` off the Scarlett.

## 2026-07-04 — All 7 chapters drafted; reframed as "one lesson, seven chapters"
Course restructured from a loose lesson set into **one lesson in seven chapters**, each file
opening with the previous chapter's result and adding one layer (the cumulative "watch it grow"
arc). Files renamed `chapterN_title.js`; drafting rules locked in COURSE.md (standard header,
every new command introduced, learner-facing only = NO production notes, ends with "Try this").

**The seven chapters** (beat → track → drums → melody → movement → generative → visuals):
1. **Setup** — kick (O&C ch10) + snare (Workshop ch1, gate→snare) — both boxes, proves the chain.
2. **Arrangement** — that beat grows into a full track; the Workshop snare voice becomes the bass.
3. **Drums** — `.euclid()`, `.swing()`, `.fast()`/`.slow()`.
4. **Melody** — `.add(prog)` (whole ensemble follows a progression, in key), `_`, `|`, full song.
5. **Movement** — 4× CC42 mods (LFO signals + `slider`) sweep real filters.
6. **Generative** — `degradeBy`/`undegradeBy`/`sometimesBy` + varied amount; `._pianoroll()` to see it.
7. **Visuals** — Hydra reacting two ways: `a.fft` (rack audio via Scarlett) AND `H(signal)` (a
   Strudel LFO piped into a Hydra param, beat-synced, no mic).

**RIG-TEST CHECKLIST** (drafted best-known; confirm 1→7 on the rig, esp. 4–7):
- [ ] Ch2/5/6/7: `.add(prog)` layered over `_` (held) and `|` (random) notes — the progression composition.
- [ ] Ch5/6/7: `stack(song, …CC42 mods…)` with mods riding alongside an `arrange()`; tempo via `.cpm()`.
- [ ] Ch6: `degradeBy` evolves per cycle; `.degradeBy("<…>")` and `.degradeBy(slider(...))` patterning;
      exact `undegradeBy` / `sometimesBy(p, x=>x.add(n))` forms.
- [ ] Ch7: `await initHydra` → `$:` track → `osc().out()` all coexisting and playing.
- [ ] Ch7: `H(signal)` used inside `.rotate()`/`.scale()` (docs show `shape(H(pattern))` — confirm the form).
- [ ] Ch7: `a.fft` reacts on the current O&C/Workshop rig (proven before on the old TeensyMove setup).

## 2026-07-01 — O&C CC# is unipolar BY DESIGN (not a missed menu setting)
Phazerville MIDI-Input docs: each mode's polarity is fixed. **CC#** = "Positive CV from assigned
CC#" (UNIPOLAR); **Bend** = "Bipolar CV from Pitch Bend" is the only bipolar mode. There is NO
per-map output-range/polarity parameter — so the O&C's 0..+ behaviour is by design, not a missed
setting. For a bipolar CC-driven CV you'd route through the **AttenOff** applet (scale + offset),
or use Bend. Not needed: unipolar 0..+5V suits filter sweeps; the Workshop covers true through-zero.
Hardware isn't the limit either — ORN8 outs are +-10V capable. Corrected the note in lesson4.

## 2026-07-01 — ccv is BIPOLAR (-1..1); the two boxes have different CV ranges
Ran the mod test on the rig. **Strudel `ccv` maps -1..1 -> CC 0..127** (0 = centre = CC64), NOT
0..1. Workshop confirms cleanly: ccv -1/0/+1 -> -5V/0V/+5V (bipolar, symmetric).
The O&C is DIFFERENT: its CC map is unipolar (~0..+6V) — it uses only ccv 0..1 and clamps <=0 to
0V (measured -1->0V, 0->0V, 0.5->3V, 1->6V). Same CC, different CV response per box.
Fix path: set the O&C CC map output range to bipolar +-5V to match the Workshop; meanwhile drive
Workshop through-zero mods with `.range(-1,1)` and O&C mods with `.range(0,1)`. Updated lesson4.
Open: where the O&C map's output-range/polarity is set (research Phazerville CC-map params).

## 2026-07-01 — O&C "constraint" was a red herring: it's virtual MIDI maps (M1-M32)
Correction to my earlier panic: the O&C does NOT force one channel/CC per quadrant. Each OUTPUT
is its own **virtual MIDI map (M1-M32)** with independent channel / CC# / mode / note-range /
voice. The bug: both NE outputs had been set to the SAME map (M4), which locks them together —
that produced the false "can't have 2 CCs / must share a channel" symptom. Fix: set them to M3
and M4. The four quadrants use maps **M1/2, M3/4, M5/6, M7/8**. So the ORIGINAL layout stands and
works: **4 mods, all CC42** — Workshop ch1 (bass) & ch2 (lead); O&C **ch3 & ch10** (mods A/B).
Gotcha to avoid: two outs on the same map #. Reverted lesson1/lesson4/COURSE.md to this.

## 2026-07-01 — Lesson 1 PROVEN on the two-box rig ✅
Both modules drive their respective outputs from a **single `arrange()`** — per-block `.midi()`
propagates through stack/arrange, so no two-arrange fallback needed. Drum allocation
**36/38/40/41 (C2/D2/E2/F2) confirmed correct** on the O&C (standard C4=60 convention). So the
full 3-voice + 4-drum two-box track works end to end. Only untested piece left: the **CC42 mods**
(both boxes) → that's the "make it move" lesson.

## 2026-07-01 — O&C actually programmed; note-number convention to confirm
David programmed the O&C MIDI-In quadrants: **NW** = ch3 pad (Note+Gate); **NE** = ch3 CC42 +
ch10 CC42 (the 2 O&C mods — so all 4 mods across both boxes are now CC42); **SW/SE** = ch10 drum
notes **C2/D2/E2/F2**. Synced lesson + COURSE.md to this exact layout.
Open q: those note numbers depend on octave convention — standard (C4=60) → **36/38/40/41**
(C2=36=classic kick, D2=38=snare, which matches), Yamaha (C3=60) → 48/50/52/53. Lesson uses
36/38/40/41 with a one-line REPL test in WATCH (`note(36).midichan(10).midi('Phazerville')`).

## 2026-07-01 — Workshop mod out CONFIRMED = CC42, bipolar ±5V (from source)
Read the Simple MIDI card source (`releases/00_Simple_MIDI/Arduino Code/Simple_Midi_0_6_6/`).
`CCHandler`: **ch1 CC42 → voice-1 mod out, ch2 CC42 → voice-2 mod out**, value mapped
`map(value, 0, 127, DAClow, DAChigh)` → **0 = −5V, 64 = 0V, 127 = +5V** (through-zero bipolar;
127 is the max, not 128). Per voice: Note → pitch CV, gate → pulse out. So each Workshop voice
= pitch + gate + bipolar mod. Closes the "what does the Workshop mod respond to" open item.
→ "make it move" lesson: `ccn(42).ccv(<signal>).midichan(1|2).midi('Workshop System MIDI')`.
Still to check in REPL: whether Strudel `ccv()` is normalized 0–1 or raw 0–127.

## 2026-07-01 — Two-box rig: Workshop (2 voices) + O&C (8 outs). Lesson 1 uses the outs.
MIDI liftoff on the O&C (port name **`Phazerville`**) and the Workshop Computer (port name
**`Workshop System MIDI`**). Key discovery: the Workshop's **Simple MIDI card is fixed** —
2 voices only, voice1=ch1 / voice2=ch2, each pitch+gate+mod (not the flexible drum box I'd
guessed). So the split is: **Workshop = 2 pitched voices (bass, lead)**; **O&C = pad + pluck +
drums + mod** on its 8 flexible Maps.

Rewrote `lesson1_first_track.js` as a **two-device** track — Strudel drives both at once via
per-block `.midi('Phazerville')` / `.midi('Workshop System MIDI')`. Dropped the timid 2-voice
MVP: Lesson 1 now runs **4 pitched voices + 3 drums** (bass/lead + pad/pluck + kick/snare/hat).
COURSE.md rig section updated to the two-box layout.

**To verify on the rig:**
- [ ] Per-block `.midi()` reaches the right box through `stack`/`arrange` (fallback: two
      separate `arrange().midi()` calls — noted in the lesson's WATCH section).
- [ ] O&C Maps set so pad(ch3)/pluck(ch4)/drums(ch10 + Note Range) hit the intended jacks.
- [ ] What the Workshop's per-voice "mod" out responds to (mod-wheel CC1? velocity?) — for
      the "make it move" lesson.

---

## 2026-06-30 — Reframe: shorts + a 10-min primer; o_C as hero rig; Hydra parked
Big tidy of COURSE.md after a planning pass:
- **Format:** this is ONE topic delivered as **shorts (one idiom each) → a 10-minute primer**
  (the dense capstone), NOT a 7-lesson course. Matches the channel shorts→long funnel.
- **Hero hardware = o_C 4.1 / O.R.N.8 running Phazerville 2.0 → Quadrants** (relatable, popular,
  open, single USB cable). The bespoke TeensyMove is demoted to "creator's alt rig" — `lesson1`
  is still *proven* on it, so I did NOT rewrite it to o_C (would break the "proven" status).
- **8-out allocation (David's call):** 2 pitch/gate voices + 2 drum gates + 2 mod CVs. Mapped to
  Phazerville MIDI-In Maps (Note / Gate+NoteRange / CC# auto-learn) — all modes VERIFIED in docs.
- **Hydra PARKED** — no room in a 10-min primer; revisit as its own short. Removed the Hydra
  block from `lesson1`; the proven Hydra work stays documented here + in `lesson0`.
- **Added ONE note idiom: subdivision brackets** `n("0 2 [4 5]")` — now in lesson1 + house style.

**Corrected my own bad assumptions this session (logged for honesty):** o_C *does* do MIDI
(Captain MIDI / Quadrants MIDI-In, over USB, no mod); the ES-10 is a real Expert Sleepers 8-ch
DC-coupled ADAT interface. I'd asserted both wrong from memory before checking — verify first.

**Still to prove on the unit (good video material):**
- [ ] Quadrants UI: how the 32 MIDI-Map slots bind to the 8 physical ORN8 jacks.
- [ ] Strudel `ccn`/`ccv` CC syntax for the two mod CVs (verify in REPL).
- [ ] Degree 7 → next-octave roll with scale degrees.

---

## 2026-06-26 — Workflow constraint: run lessons in the browser REPL
The course runs in the **strudel.cc web REPL in Google Chrome** — NOT the VSCode extension.
Reason: MIDI needs the Web MIDI API (Chrome has it; the VSC extension webview doesn't expose
it to hardware ports, so it can't route to `Teensy MIDI`). Chrome also gives Hydra the Web
Audio input access for the Scarlett. The repo `.js` files are the source of truth / support
material; the REPL does NOT read them off disk — **copy file contents, paste into strudel.cc**.
Lesson 0 should state this. (Possible later nicety: host lessons / load via URL or gist.)

## 2026-06-26 — Lesson 1: first full track — WORKING ✅ ("lots of fun")
`lessons/lesson1_first_track.js` ran on the rig. Confirms:
- [x] `.midi()` / `.cpm()` applied AFTER `arrange()` DOES reach every voice (no per-block midi
      needed). Big one — keeps the arrangement clean.
- [x] Scale-degree octaves (C2/C4/C5) separate bass/pad/lead registers as intended.
- [x] All 4 voices + drums hit the right TeensyMove channels (1/2/3/10).
Top-down approach validated: a real verse/chorus track with reactive visuals in one lesson.

**Visuals upgraded:** mapped all 4 FFT bands to different Hydra params (rotate/color/modulate/
kaleid/scale) + a "VISUAL VARIATIONS" swap menu. Needs a run to taste-check.

## 2026-06-26 — Lesson 0: prove the rig + Hydra reacting to the beat
**Confirmed working:** the MIDI chain — Strudel → `Teensy MIDI` → TeensyMove → modular makes
sound (David's existing template plays the rack). Drum notes 36/37/38/39 on ch10 confirmed.

**Active experiment:** `lessons/lesson0_setup.js` — point Hydra at the rack audio coming back
via the **Scarlett 16i16** (Mac default input) and make a visual pulse on the kick
(`a.fft[0]`). Written best-effort; needs a real run. Watch for:
- Does this Strudel build support `await initHydra()` and expose the audio `a` object?
- With `a.show()`, do the FFT bars move on each kick? (flat = audio not reaching Hydra.)
- Fallback if `a` undefined: run the visual in standalone hydra.ojack.xyz, MIDI from Strudel.

**Result (run 1):** Strudel threw **`a is not defined`**. Cause: `initHydra()` does NOT expose
the audio object by default — you must call **`initHydra({detectAudio:true})`**. (You do NOT
install Hydra; it's built in.) Fixed in the lesson file. Confirmed via Strudel Hydra docs:
https://strudel.cc/learn/hydra/ — `a.fft[0]` reacts to input once `detectAudio` is on.
→ Great teachable moment for the video: "the error that means you forgot one flag."
Also brought Lesson 0 drums into house style (named consts + `struct` step grid).

**Result (run 2):** After adding `detectAudio`, `a.show()` works but it was FFT-ing the
**laptop microphone**, not the Scarlett. Cause: **Chrome keeps its own per-site mic device**
separate from the macOS default input. Fix order: (1) macOS Sound input = Scarlett + allow
Chrome in Privacy>Microphone; (2) at strudel.cc, address-bar site-info > Microphone > pick the
Scarlett, reload + re-allow; (3) route rack to Scarlett **inputs 1&2** (getUserMedia only grabs
the first stereo pair). Verify: mute rack -> bars drop; clap at laptop -> no movement.
→ Another strong teachable moment: "why your visuals react to you talking, not your music."

**Result (run 3) — WORKING ✅** After patching the rack to Scarlett inputs 1&2 + selecting the
Scarlett as Chrome's per-site mic, the visual pulses on the beat. **`a.fft[0]` (low band) jumps
the most** — correct, that's where the kick energy is. Lesson 0 proven end to end:
Strudel→MIDI→TeensyMove→rack→Scarlett→Hydra. Also confirms the house-style `struct` step-grid
drums trigger correctly on ch10.

**Lesson 0 done.** Next: build the real Lesson 1 track (drums + bass + pad + lead, verse/chorus
via `arrange()`), reusing this proven Hydra block.

---

## 2026-06-26 — Design decisions locked (before touching the REPL)
Captured the house style and structure *on paper* first. Still need to prove it all in the
actual REPL — these are decisions, not yet verified facts.

**Decided:**
- Notes = scale degrees: `n("0 2 4").scale("C4:minor")`. Vanilla, no custom libs, no samples.
- Output = MIDI only to the TeensyMove rig (ch1–4 voices, ch10 drums 36–39).
- Drums = boolean step grid: `note(kick).struct("x ~ x ~").midichan(10)`.
- Song structure = named blocks → sections → `arrange([n, section], ...)`.
- Pacing = top-down: a full verse/chorus track (drums+bass+pad+lead) by end of Lesson 1.
- Hydra visuals from Lesson 1, **audio-reactive to the real rack via the Scarlett 16i16**.

**Open questions to verify in the REPL (these become teachable moments):**
- [x] Does `note(kick).struct("x ~ x ~")` trigger drum notes correctly on ch10? — YES (Lesson 0).
- [x] Exact drum note mapping — 36 kick / 37 stick / 38 snare / 39 clap on ch10 (CONFIRMED).
- [ ] Does `.midi()` / `.midichan()` propagate through `arrange()` and `stack()`?
- [x] `await initHydra()` setup — needs `{detectAudio:true}` to expose `a` (CONFIRMED).
- [x] Pin Hydra's FFT to the Scarlett — via Chrome per-site mic + rack on inputs 1&2 (CONFIRMED).
- [ ] Turing-style lockable randomness — exact vanilla API (`irand`/`segment`/looping window?).
- [ ] Octave handling with scale degrees (does degree 7 roll to next octave cleanly?).

**Next:** write the Lesson 1 patch and start ticking these off.
