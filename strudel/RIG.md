# Rig setup for the Strudel lesson

Production notes — the module settings the lesson `.js` files cannot express. Not
learner-facing; the lesson files stay clean per drafting rule 3 in `COURSE.md`.

## Channel map

| Ch | From | To | Carries |
|---|---|---|---|
| 1 | Workshop voice 1 | Joy on `ZLPF` | pitch + gate — the bass |
| 2 | Workshop voice 2 | Plaits | pitch + gate — the pad |
| 3 | O&C quadrant NW | Ogham | pitch + gate — the lead |
| 10 | O&C quadrants SW/SE | Beatsi | gates: kick 36, snare 38, hat 40, crash 41 |

| CC42 on | Goes to | Does |
|---|---|---|
| ch1 | Joy `CV_6` | Timbre — which on `ZLPF` *is* the cutoff |
| ch2 | Plaits `TIMBRE` | |
| ch3 | Ogham `CV_A` | shared timbre param, 0–255, sums with the knob |
| ch10 | Alchemy Lab | echo feedback, across the whole mix |

Ogham's two audio outs go to the Alchemy Lab's `J1`/`J2` as a stereo pair —
`Out1 = L`, `Out2 = R`. Do not mult one: neither Echoa nor Spagyros will widen a
mono signal, and the jacks are plain codec inputs with no normalling.

The T01 VCO and the A-121d are spare. Joy does both jobs in one module.

## Joy

- Model **`ZLPF`** (bank 4, FLT+VOX). Timbre = cutoff frequency, Color = waveshape.
  `ZPKF` / `ZBPF` / `ZHPF` are the same filter in peaking / band / high-pass.
- **Patch a gate to GATE IN 1.** Unpatched it drones and the rests do nothing, and the
  first gate edge hands the VCA to the AD envelope for the rest of the power cycle.
- **Leave the Timbre knob mid-travel** — `CV_6` modulates ±50% around wherever it sits.
- Knobs 3 and 4 are Attack and Decay, 1 ms to 6 s. An AD envelope is struck, not
  sustained, so **Decay is what holds a bass note** — `_` in the pattern lengthens the
  MIDI gate but not the sound.

## Ogham

### The module UI — one encoder, two modes

| Action | In SELECT | In FX |
|---|---|---|
| **Turn** | change the selected voice's formula | step through the fields |
| **Short press** | swap which voice you are editing (Out1 ↔ Out2) | toggle navigate / edit |
| **Long press** | enter FX | leave FX, from anywhere including mid-edit |

Inside a field: short-press to edit, turn to change, short-press back. Turning fast
accelerates the step (×2 medium, ×3 fast). The field you were on survives leaving and
re-entering the menu, but not a power cycle — that resets to field 0.

So both halves of the stereo pair are chosen in SELECT: pick Out1's formula, short-press,
pick Out2's.

### Fields that matter here

| Display | Field | Set to |
|---|---|---|
| `Lp.` | 18 — internal LPG | **`Lp.37`**. `Lp.oF` is off; `Lp.01`–`Lp.99` is on with that decay |
| `d.` | 21 — Out2 decouple | `d.oFF` coupled (stereo pair), `d.on` drone. CW = on |
| — | 19 — CV→Timbre route | normal / CV A / CV B. Leave normal; only `CV_A` is patched |

**Decay** is exponential in two segments with a knee at field 40, so the resolution sits
where the plucks and swells are:

```
field  0..30 : 2 ms .. 126 ms     14.8% / step
field 30..50 : 126 ms .. 934 ms   10.5% / step
field 50..99 : 934 ms .. 20 s      6.5% / step
```

The figure is the real length of the note — the envelope reaches true zero at the set
time rather than trailing off. At `cpm(30)` a step of the lead is 250 ms, hence `Lp.37`.

**There is no attack setting.** It is derived — 15% of the decay, clamped to 1 ms — so
Ogham cannot fade in. It is a struck voice.

### V/oct, and the formula ceiling

Switch the Clock jack to **V/oct** with the mode toggle. The engine then hard-syncs, which
is what puts it in tune — but the formula is only ever evaluated over `t = 0 .. baseSR/f`,
so one whose output is flat across that opening window is silent however lively it is
free-running.

**31 of the 101 formulas are silent at every playable pitch; 35 are silent at C3 and
above.** Pick a melodic one and check it sounds at the *top* of the part, not just the
bottom. `tools/voct_range.cpp` in the `ogham` repo prints the ceiling for all 101:

```bash
g++ -O2 -I src -o /tmp/voct_range tools/voct_range.cpp src/formulas.cpp && /tmp/voct_range
```

"Hidden Melody" holds to 4 kHz. At A4 with the lesson's leaps, anything rated ≥ 2 kHz is safe.

### Both jacks are spoken for

`EXTI2_IRQHandler` calls `SyncReset()` *and* `LpgTrigger()` off the same rising edge, so
the GATE jack hard-syncs the formula and plucks the envelope together, sample-accurate.
Clock carries V/oct; Gate carries trigger-and-sync.

It is a **trigger, not a gate** — nothing reads the falling edge, so note length is ignored.
Note length lives in `Lp`.

### A and B are shared

They are not the two voices. `bytebeat_engine.h`: *"Shared parameters A and B (both voices
use these)."* The voices are `formula1 → Out1` and `formula2 → Out2`, chosen separately,
and both read the same A and B — so CC42 on `CV_A` moves the timbre of both at once.

**Coupled** (`d.oFF`): Out2 rides the master phase, reads live A/B, follows V/oct, Rate and
gate, and takes the same LPG coefficient as Out1. Two formulas plucked in lockstep — a
genuine stereo pair rather than a doubled mono.

**Decoupled** (`d.on`): Out2 forks. It snapshots phase, rate and A/B at that instant, then
free-runs, and bypasses Lo-Fi, FX *and* the LPG — "it stays a free-run drone under a
plucked Out1". The frozen state persists to flash, so a drone you like survives a power
cycle. Switching mid-take is a performance move: coupled for the chorus, `d.on` for the
bridge to freeze the right channel while the left keeps playing.

## Alchemy Lab

Echoa or Spagyros, as a stereo send on Ogham. Neither has a mono-to-stereo mode — Echoa's
four routings (Series stereo, Parallel stereo, Isolated mono, Spectral stereo) all keep
each line to its own channel, and there is no cross-line feedback to borrow. If you ever
do need to widen a genuinely mono source, mult it to both inputs and use Echoa's **Spectral
stereo**, which splits by frequency between the lines, or Spagyros' **Space**.
