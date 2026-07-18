# Eight4aWish — Strudel-for-Eurorack

*Living design doc. Last updated: 2026-07-04.*
*Companion to the Eight4aWish channel — see `~/GitHub/eight4awish/CHANNEL_PLAN.md`.*
*Per-lesson command budget: see `COMMANDS.md`.*

This is **one lesson in seven chapters** (not a multi-part course): live-coding plain Strudel as a
**brain for the eurorack rig**. Sound comes from the **modules**, not Strudel (MIDI out only). The skill is
also a *production technique* — once it's second nature it can carry demos and beds in other
videos too, but not exclusively.

## Delivery format — shorts → a 10-minute primer
- **Shorts:** one idea each (one idiom, one "wait, you can do that?" moment). Punchy, harvested.
- **The 10-minute primer (long-form):** the dense capstone that stitches the idioms into a
  single live-coded track, top to bottom. This is the funnel target the shorts point to.
- **No multi-part padding.** Depth lives in support materials (this repo, the lesson `.js`
  files, a per-topic web page), not in extra video parts.
- **Hydra visuals = Lesson 7 (its own visuals lesson), kept OUT of L2/the primer** — reactive
  visuals would compete with the core "Strudel → CV → rack" wow, so they're deferred to a dedicated
  final lesson rather than diluting the hook. Proven audio-reactive groundwork (`a.fft` on the
  Scarlett) is in `JOURNAL.md` and the git history of the old `lesson0`/`lesson1`.

## House style (non-negotiable)
- **Notes = scale degrees + octave**: `n("0 2 4").scale("C4:minor")`. The scale IS the
  quantiser — you can't play out of key. No raw note numbers (`36`) or names (`C`).
- **One extra note idiom allowed: subdivision brackets** — `n("0 2 [4 5]")` fits a couple of
  notes into a single beat. This is the *only* second notation; everything else stays single.
- **Plain vanilla Strudel** — no custom language extensions (unlike Switch Angel's personal lib).
- **No samples** — MIDI out only (`.midi(...)`); sound is the rack. This is the USP.
- **One canonical idiom per concept**, reused verbatim across every short.
- **MVP ethos** — shortest path to something *impressive* (in-key, multi-voice, evolving).
- **Capture the journey.** David is learning Strudel *while* building this — that honest
  beginner→competent arc IS the content (fits the channel's "clueless but keen" brand). Show
  real mistakes and discoveries; don't pose as an expert. Running log: `JOURNAL.md`.

## Lesson drafting rules (all 7 lessons follow these)
Consistency so the seven lesson `.js` files feel like one course:
1. **Standard header** — every file opens: `LESSON N — Title`, one line on what you'll make, how to
   run (paste into strudel.cc in Chrome; which devices/channels), then the code.
2. **Every new command gets an introduction** — a plain one-liner the first time it appears; only the
   lesson's *budgeted* new commands (see `COMMANDS.md`) are introduced.
3. **Learner-facing only — no production notes.** No `WATCH`/`TO PROVE`/verify/`JOURNAL`/"David's rig"
   notes in the lesson files; those live here and in `JOURNAL.md`.
4. **End with "Try this"** — a short list of tweak-and-run suggestions.
5. **House style throughout** — scale degrees, one idiom per concept, MIDI-only.

## Canonical idioms
| Concept | The one idiom |
|---|---|
| Notes / scale-lock | `n("0 2 4").scale("C4:minor")` |
| **Two notes in one beat** | **subdivision brackets:** `n("0 2 [4 5]")` |
| Probability | `.degradeBy(0.3)` |
| Mod/CV → patch | `ccn(42).ccv(sine.range(-1,1).slow(4).segment(32))` → MIDI CC → real CV (patch to a VCF). **ccv is −1..1** (0 = centre) |
| **Drums (preferred beat method)** | **step grid:** `note(kick).struct("x ~ x ~").midichan(10)` |
| Euclidean rhythm (variation only) | `.euclid(3,8)` for fills/variation, not the primary beat |
| Voices | `stack(...)` on per-voice `.midichan(...)` |
| Song structure | named blocks → sections → `arrange([n, section], ...)` |
| Turing-ish variation | vary `.degradeBy()` amount (`<…>`/slider) = "how random" knob; `undegradeBy` = complement; `sometimesBy` = mutation. (Not a literal Turing machine.) |

### Beat-laying — the one preferred approach
A **boolean step grid** per drum (`x` = hit, `~` = rest), drum as a named constant. Reads like
a drum-machine grid (no theory) and separates rhythm from sound:
```js
const kick=36, stick=37, snare=38   // the only place raw numbers appear
stack(
  note(kick ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(stick).struct("x x x x x x x x"),
).midichan(10).midi(OUT)
```
Other approaches (raw mini-notation, comma-stacked layers) are deliberately NOT taught.
`.euclid()` appears later only as a variation tool.

### Song structure — the one preferred approach (3 layers)
**Named blocks → sections → `arrange()`.** Reorder = edit one list; scales to generative/ambient
(same skeleton, longer sections). NOT taught: `cat`/`<>` alternation, `pick` by label, manual
live-swapping (live-swapping returns only as a *performance* move, last short).

---

## The rig — TWO relatable boxes, addressed by name from Strudel
Strudel drives **two USB-MIDI devices at once** (`.midi('name')` per block). Both are current,
open, replicable DIY builds — "you might already own these" beats the bespoke TeensyMove.
Confirmed port names: **`Phazerville`** and **`Workshop System MIDI`**.

**Box 1 — Workshop System (Music Thing Computer, Simple MIDI card): 2 fixed voices.**
Fixed mapping — voice 1 = **ch1**, voice 2 = **ch2**, each giving pitch + gate + mod. Not
flexible, but perfect for the two expressive pitched voices. → **bass (ch1), lead (ch2)**.

**Box 2 — Ornament & Crime 4.1 / Phazerville → Quadrants: 8 flexible outs.**
The configurable box: 1 pad voice + a 4-piece drum kit + 2 mods, in a clean 2-2-2-2 split that
maps one-to-one onto the four Quadrants (each quadrant drives a fixed output pair):

| Quadrant | O&C MIDI-In Map | Strudel sends |
|---|---|---|
| NW — A / B | ch 3, **Note** + **Gate** | pad — `.midichan(3)` |
| NE — C / D | ch 3 **CC42** + ch 10 **CC42** | 2 O&C mods (each out = its own virtual map) — "make it move" |
| SW — E / F | ch 10, **Gate** + Note Range = C2 (36) / D2 (38) | kick / snare — `note(36/38).midichan(10)` |
| SE — G / H | ch 10, **Gate** + Note Range = E2 (40) / F2 (41) | closed / open hat — `note(40/41).midichan(10)` |

Verified the Phazerville MIDI-In applet has the needed modes — Note/Pitch, Gate (+ **Note
Range** to split drums to their own jack), and **CC# auto-learn**. Sources:
firmware.phazerville.com/MIDI-Input, /Quadrants.

**Total live outs in Lesson 2:** 3 voices (bass/lead on the Workshop, pad on the O&C) + a
4-piece drum kit — a proper track, not the timid 2-voice MVP. **4 mods** available, all **CC42**,
bipolar ±5V/64=0V — Workshop ch1 (bass) & ch2 (lead); O&C ch3 & ch10. Each O&C output is its own
virtual MIDI map (M1–M8), so both outs of a quadrant carry independent channel/CC. For "make it move".

**PROVEN / open (good JOURNAL/video material):**
- [x] **Two-device routing works** — both boxes sound from a single `arrange()`; per-block
      `.midi()` propagates through `stack`/`arrange` (no two-arrange fallback needed).
- [x] **O&C quadrants built & driving outputs** — 4 MIDI-In quadrants programmed on the unit.
- [x] **Drum notes = 36/38/40/41** (C2/D2/E2/F2) — confirmed correct; O&C uses standard C4=60.
- [x] Workshop mod = **CC42**, ch1/ch2, bipolar ±5V (64=0V) — confirmed from card source.
- [x] CC42 mods sweep real CV on both boxes; `ccv` is bipolar −1..1 — verified on the rig.
- [x] `_` (note length) drives the MIDI gate length — verified on the rig.
- [x] Degree 7 rolls cleanly to the root an octave up (negative degrees wrap down) — verified.

**Creator's alternate rig:** the bespoke **TeensyMove** (4 voices ×(gate/mod/pitch) on ch1–4,
4 drums on ch10). A one-off viewers can't clone, so the two boxes above are what the videos lead with.

---

## The arc — shorts (one idiom each) → the primer
Top-down: hand them the impressive thing first, then unpack it. Each short is a slice of the
primer track; nothing is taught that wasn't already heard working.

1. **Setup** — prove the chain: Strudel → USB MIDI → O&C → CV → the rack makes sound. Tempo, MIDI out.
2. **Arrangement** — a near-complete patch across both boxes: bass + lead (Workshop) and
   pad + drums (O&C), verse/chorus via `arrange()`, one key. A real track in minutes. ← the hook.
3. **Drums** — the step grid, `.euclid()` for variation, `.slow()`/`.fast()`, `.swing()`.
4. **Melody** — scale degrees + octaves, following a progression with `.add()`, note length
   (`_`), variation (`|`), and a fuller song (intro/verse/chorus/bridge/outro via `arrange()`).
5. **Movement** — *modulation IS arrangement*. Mods live **inside sections**, so `arrange()`
   sequences them: intro **reveals**, verse **breathes**, bridge **builds**, chorus **drops**,
   outro **conceals**. (A CC holds its last value, so the reveal stays open.) Plus `slider`.
6. **Generative** — the track evolves on its own. `degradeBy`/`undegradeBy`/`sometimesBy` thin and
   mutate the **notes**; random signals (`perlin`) **drift the mods across the whole song**, outside
   `arrange()` — colour, not choreography. `perlin` glides, `rand` jumps. See it on `._pianoroll()`.
7. **Visuals** — **Hydra** audio-reactive off the rack (Scarlett → `a.fft`), a separate language, plus
   aesthetic inline viz (`._spiral()`/`._pitchwheel()`). (Pattern feedback `._pianoroll()` is introduced
   in L6.) Strudel's own `._scope`/`._spectrum` stay blank — it makes no audio; that's the rack's job.

**10-min primer** = the dense capstone: build the whole track live, drawing on 1–6 (visuals are their own lesson).
*Performance craft — build-from-silence, mute by commenting, destroy/rebuild — is woven through and
shown in the primer, not a standalone lesson.*

---

## Techniques to call out & credit
**Inspired by**, **attributed by name** in the videos — we never copy their code, custom
libraries, or specific arrangements (techniques aren't copyright; their patches are). Crediting
is also soft outreach.

| # | Technique (as we teach it, vanilla/MIDI) | Credit | Moment |
|---|---|---|---|
| 1 | **Commit to scale-degrees** (`n().scale()`) so you're always in key | **Switch Angel** | Setup / first track |
| 2 | **Signals/LFOs as modulation** — ours drives a MIDI CC → real filter | **glossing** (LFO tutorial in Strudel docs) | Make it move |
| 3 | **Euclidean rhythms** (`.euclid(3,8)`) for instant groove | **Alex McLean / TidalCycles lineage** | Drums |
| 4 | **Layered stacks with distinct roles**, each its own rhythm | **Switch Angel** | First track |
| 5 | **Destroy-and-rebuild / live mutation** — `degradeBy`, swapping lines live | **Switch Angel** | Generative + primer |
| 6 | **Build from silence, one line at a time** (pacing) | **DJ_Dave**, **Lucy Cheesman (Heavy Lifting)** | Woven through + primer pacing |
| 7 | **Generative / probabilistic variation** — `degradeBy` + controllable randomness | **Renick Bell** | Generative |
| 8 | **Visual feedback while you play** (`._pianoroll`/`._punchcard`) | **Switch Angel** | habit; featured in L6 |

(The Hydra visual angle — credit **Char Stiles** — is **Lesson 7**.)

**Recurring teaching beat:** when a creator sweeps a filter *in Strudel's synth*, we show the
eurorack version — pattern a MIDI CC, patch it to a real VCF. Same idea, our hardware, our USP.

**Format inspiration (meta):** Groovin in G's beginner tutorials; Char's short punchy format.

## Sources
- Phazerville MIDI Input: https://firmware.phazerville.com/MIDI-Input
- Phazerville Quadrants: https://firmware.phazerville.com/Quadrants
- djphazer discussions (for the open hardware questions): https://github.com/djphazer/O_C-Phazerville/discussions
- Hackaday — Live Coding Techno With Strudel (Switch Angel): https://hackaday.com/2025/10/16/live-coding-techno-with-strudel/
- glossing LFO tutorial (in Strudel docs): https://strudel.cc/learn/lfo/
- awesome-strudel community list: https://github.com/terryds/awesome-strudel
