// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.
//
// The rack, and what each channel wants:
//
//   ch3  O&C NW       pitch        → Thonk T01 VCO → A-121d  — the bass
//   ch2  Workshop v2  pitch + gate → Plaits                  — the pad
//   ch1  Workshop v1  pitch + gate → Ogham                   — the lead
//   ch10 O&C SW/SE    gates        → Beatsi  kick snare hat crash
//
//   CC42 ch3  → A-121d cutoff      (the bass has no VCA — this is its articulation)
//   CC42 ch2  → Plaits TIMBRE
//   CC42 ch1  → Ogham CV_A         (timbre, 0–255, sums with the knob)
//   CC42 ch10 → Alchemy Lab        (echo feedback, across the whole mix)
//
// Two things about this rack shape the parts below.
//
// The bass drones. A bare T01 VCO has no VCA and no envelope in this patch, so a rest
// in the bass line would just hold the previous pitch. It is written as a continuous
// stepped line instead, and the A-121d opening and closing on CC42 is what articulates
// it. Put a VCA and an envelope in front of it and the rests come back for free.
//
// Note 41 is a CRASH, not an open hat — Beatsi's four are kick / snare / hi-hat / crash.
// So it is placed once per chorus rather than played as a rhythm part.
//
// Ogham needs its Clock jack switched to V/oct. In that mode the engine hard-syncs, so
// the formula restarts every cycle and the thing plays in tune — but each formula has
// its own pitch ceiling, above which it falls silent. 31 of the 101 are silent at every
// playable pitch (the free-running drones), so pick a melodic one and check it sounds at
// the top of the part. "Hidden Melody" holds to 4 kHz, which covers this lead twice over.
// If Ogham is more trouble than it is worth on the day, Joy drops onto ch1 unchanged.

await initHydra()

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high, an octave apart

const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ _ _ 5 _ 3 _".add(prog))
  .scale("A2:minor").midichan(3).midi(OC)
  ._pianoroll()
const pad  = n("0 ~".add(prog))
  .scale("A3:minor").midichan(2).midi(WS)
  ._pianoroll()
const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A4:minor").degradeBy(slider(0, 0, 1)).midichan(1).midi(WS)
  ._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(1).midi(WS)
  ._pianoroll()

const kick=36, snare=38, hat=40, crash=41
const drums = stack(
  note(kick ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(kick ).struct("~ ~ x ~ ~ ~ x ~"),
  note(hat  ).struct("x x x*2 ~ x*2 x x ~ | x x x*2 ~ x*2 x x*4 ~"),
  note(crash).struct("x ~ ~ ~ ~ ~ ~ ~").slow(8),   // once at the top of the chorus
).midichan(10).midi(OC)

// ---- Movement                       name each shape once, reuse it everywhere

const lfoBass = isaw  .slow(8)
const lfoPad  = sine  .slow(4)
const lfoLead = perlin.slow(4)
const lfoEcho = sine  .slow(16)        // the slowest one — the echo swells across the song
const lfoZoom = sine  .slow(4)         // the one signal the rack never hears — picture only

const modBass = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modPad  = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(1).midi(WS)
const modEcho = v => ccn(42).ccv(v).midichan(10).midi(OC)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // the A-121d opens and closes on the bass
  modPad (lfoPad .range(0,1).segment(32)),   // Plaits' timbre moves
  modLead(lfoLead.range(1,0).segment(32)),   // Ogham's formula param wanders
  modEcho(lfoEcho.range(0,1).segment(16)),   // the echo feedback swells
)

// ---- Sections

const intro  = stack(pad, mods)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums, pad, lead2, mods)
const outro  = stack(bass, pad, mods)

$: arrange(                            // $: names the pattern, so the picture can follow it
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)

// ---- Picture                        the same LFOs, now driving Hydra

osc(18, 0.08, 0.6)
  .color(H(lfoPad), 0.25, H(lfoLead))
  .rotate(H(lfoBass.range(0, 6.28)))          // the bass sweep spins the frame
  .kaleid(H(lfoLead.range(3, 7)))             // the wandering one opens the kaleidoscope
  .modulate(noise(3), H(lfoEcho.range(0.1, 0.6)))  // the echo's swell warps the image
  .scale(H(lfoZoom.range(1, 1.4)))            // a steady zoom pulse
  .out()

// ---- Try this
//
// * Drag the `slider` in `lead` from 0 up to 1 while it plays — the melody thins out.
// * Swap `sine` for `perlin` in `lfoEcho` and the echo drifts instead of swelling.
// * Move a line in `arrange()` with Opt+↑/↓ to reorder the song.
// * Turn Ogham's Func knob mid-take. The part keeps its rhythm and changes instrument.
// * Comment out `modBass(...)` (Cmd+/) and the bass stops breathing — and the frame
//   stops spinning, because the picture is reading the very same signal.
