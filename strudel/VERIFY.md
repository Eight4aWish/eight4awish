# Verification checklist

*Confirming the drafted chapters behave as written.*

## ✅ FULLY VERIFIED
- **Bucket A** (docs/source) — 2026-07-09
- **Bucket B** (browser, incl. B6 section-phase) — 2026-07-09
- **Bucket C** (rig) — 2026-07-10

All seven chapters are proven end to end: MIDI gates, real CV, sectional mods and drift, and the
Scarlett → Hydra chain. **Nothing needed changing.** Findings live in `COMMANDS.md`; the story is
in `JOURNAL.md`.

The tests below are kept as a **regression check** — rerun them if you change hardware, firmware,
or Strudel version.

---

## C1 ✅ — `_` (note length) drives the MIDI **gate** length
*Confirmed: a held note keeps the gate high. Chapter 4's sustained bass is genuinely sustained, and
`.legato(x)` stays an optional articulation refinement rather than a required fallback.*

Patch the Workshop voice-1 **gate** to an envelope/VCA (or a scope), then:
```js
$: n("0 ~ ~ ~ 0 _ _ _").scale("C3:minor").midichan(1).midi('Workshop System MIDI')
```
**Look for:** the first `0` is a **blip** (one step); the second is **held ~4× as long**.

- ✅ gate lengthens → `_` works as taught; nothing to change.
- ❌ both gates the same → note duration isn't reaching the gate. Fallback: teach `.legato(x)`
  instead (0.5 = staccato, 1 = fills the step, 2 = overlaps):
  ```js
  $: n("0 0 0 0").scale("C3:minor").legato(2).midichan(1).midi('Workshop System MIDI')
  ```

---

## C2 — the CC42 mods: alive, sectional, and drifting

Voltage variation is already proven (static `ccv` gave **−5/0/+5V** on the Workshop, **0/3/6V** on
the O&C). What's new is the Chapter 5/6 design: **mods inside sections**, plus **drift across the
whole song**.

### C2a — each destination alive
*Park a static value and meter it. Don't stare at a moving LFO.*
```js
$: ccn(42).ccv(sine.range(1,1).segment(4)).midichan(2).midi('Workshop System MIDI')
```
Expect **+5V**; `(0,0)` → 0V; `(-1,-1)` → −5V. Repeat on the O&C (`.midichan(3)` / `.midichan(10)`,
`.midi('Phazerville')`) with `(0,0)/(0.5,0.5)/(1,1)` → **0V / 3V / 6V**.

- *Shortcut:* the Workshop's Simple MIDI card does `analogWrite(leds[0], value << 1)` — its **LED
  brightness tracks CC42** (leds[0] = ch1, leds[1] = ch2). Dark and static = nothing arriving.
- *O&C:* set its CC map back to `CC#-1` auto-learn; if it locks onto **42**, delivery is proven.

### C2b — sectional handoff  (run **Chapter 5**)
Meter the **pad** mod (O&C ch3) and the **bass** mod (Workshop ch1) through a whole pass.

**Look for:**
- **intro** — pad ramps 0 → ~0.7 (≈4.2V) across 4 bars. The *reveal*.
- **verse / chorus / bridge** — nothing drives the pad, so it **holds ~4.2V**. This is the point:
  a CC holds its last value.
- **bridge** — bass climbs 0 → 1 across 4 bars. The *riser*.
- **chorus after the bridge** — nothing drives the bass, so it **holds wide open**. That's the
  *drop*. Listen hard here: is "bass stays open" the payoff you want, or should the chorus pull it
  back down? (If the latter, give the chorus its own `modBass`.)
- **outro** — pad ramps back 0.7 → 0. The *conceal*.

Each section's mod must **stop cleanly** when its section ends and the next take over. That
handoff is what makes the drop land.

### C2c — drift runs through everything  (run **Chapter 6**)
Meter the **lead** mod (Workshop ch2).

**Look for:** a slow `perlin` wander that **never resets at section boundaries** and never repeats —
it ignores the arrangement entirely, by design. Sectional and drift mods coexist without fighting
(one destination, one source).

Finally: check `.segment(32)` is smooth enough — raise it if the CV steps audibly.

---

## C3 — `slider()` driving a mod by hand
```js
$: ccn(42).ccv(slider(0, -1, 1)).midichan(1).midi('Workshop System MIDI')
```
**Look for:** an inline fader appears; dragging it moves the mod CV **−5V…+5V in real time**.
Patch it to a VCF cutoff and sweep by hand.

---

## C4 — `a.fft` reacting to the **rack** via the Scarlett
Setup: Scarlett = Chrome's mic for strudel.cc (address-bar site settings); rack mix → Scarlett
**inputs 1 & 2** (getUserMedia only grabs the first stereo pair).

```js
await initHydra({detectAudio:true})
a.setBins(4)
a.show()                                  // FFT meter, for debugging
osc(20).scale(() => 1 + a.fft[0]*2).out()
```
**Look for:** with the rack playing, the bars **jump on the kick** (`a.fft[0]` = lows). Then the two
proofs it's hearing the *rack*, not the room:
- **mute the rack** → bars drop.
- **clap at the laptop** → bars should **not** move.

Remove `a.show()` once confirmed; the visual should pulse with the kick.

---

## C5 — the finale, end to end
Run **Chapter 7** whole: song + sectional mods + drift + Hydra + pianoroll, on the rig.

**Look for:** music from the rack, the filter arc breathing with the sections (reveal → riser →
drop → conceal), the drift wandering underneath, the picture reacting, the notes scrolling.
