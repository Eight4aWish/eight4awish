// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.
//
// The rack, and what each channel wants:
//
//   ch1  Workshop voice 1  pitch + gate  → Joy (Braids)   — the bass
//   ch2  Workshop voice 2  pitch + gate  → Ogham          — the lead
//   ch10 O&C SW/SE         gates only    → Peaks kick + snare, mki Hi-Hat
//
//   CC42 ch1  → Daisy MultiFX cutoff     (the filter on Joy)
//   CC42 ch2  → Ogham CV_A               (timbre, 0–255, sums with the knob)
//   CC42 ch3  → Ogham CV_B               (second timbre)
//   CC42 ch10 → Alchemy Lab              (Echoa feedback, on Ogham's output)
//
// Two oscillators, three drums, no pad. The progression is carried by the two
// lines themselves — which is what `.add(prog)` is for.
//
// Ogham needs its Clock jack switched to V/oct. In that mode the engine hard-syncs,
// so the formula restarts every cycle and the thing plays in tune — but each formula
// has its own pitch ceiling, above which it falls silent. 31 of the 101 are silent at
// every playable pitch (the free-running drones), so pick a melodic one and check it
// sounds at the top of the part before you record. "Hidden Melody" holds to 4 kHz,
// which covers this lead with room to spare.

await initHydra()

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, lead — low to high

const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5".add(prog))
  .scale("A2:minor").midichan(1).midi(WS)
  ._pianoroll()
const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A4:minor").degradeBy(slider(0, 0, 1)).midichan(2).midi(WS)
  ._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(2).midi(WS)
  ._pianoroll()

const kick=36, snare=38, hat=40
const drums = stack(
  note(kick ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(kick ).struct("~ ~ x ~ ~ ~ x ~"),
  note(hat  ).struct("x x x*2 ~ x*2 x x ~ | x x x*2 ~ x*2 x x*4 ~"),
).midichan(10).midi(OC)

// ---- Movement                       name each shape once, reuse it everywhere

const lfoBass = isaw  .slow(8)
const lfoTimA = sine  .slow(4)
const lfoTimB = perlin.slow(4)
const lfoEcho = sine  .slow(16)        // the slowest one — the echo swells across the song
const lfoZoom = sine  .slow(4)         // the one signal the rack never hears — picture only

const modBass = v => ccn(42).ccv(v).midichan(1).midi(WS)
const modTimA = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modTimB = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modEcho = v => ccn(42).ccv(v).midichan(10).midi(OC)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // the filter on Joy opens
  modTimA(lfoTimA.range(0,1).segment(32)),   // Ogham's first formula param sweeps
  modTimB(lfoTimB.range(1,0).segment(32)),   // its second one wanders
  modEcho(lfoEcho.range(0,1).segment(16)),   // the echo feedback swells
)

// ---- Sections

const intro  = stack(lead, mods)
const verse  = stack(drums, bass, mods)
const chorus = stack(drums2, bass, lead, mods)
const bridge = stack(drums, lead2, mods)
const outro  = stack(bass, mods)

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
  .color(H(lfoTimA), 0.25, H(lfoTimB))
  .rotate(H(lfoBass.range(0, 6.28)))          // the bass sweep spins the frame
  .kaleid(H(lfoTimB.range(3, 7)))             // the wandering one opens the kaleidoscope
  .modulate(noise(3), H(lfoEcho.range(0.1, 0.6)))  // the echo's swell warps the image
  .scale(H(lfoZoom.range(1, 1.4)))            // a steady zoom pulse
  .out()

// ---- Try this
//
// * Drag the `slider` in `lead` from 0 up to 1 while it plays — the melody thins out.
// * Swap `sine` for `perlin` in `lfoEcho` and the echo drifts instead of swelling.
// * Move a line in `arrange()` with Opt+↑/↓ to reorder the song.
// * Turn Ogham's Func knob mid-take. The part keeps its rhythm and changes instrument.
// * Comment out `modTimB(...)` (Cmd+/) and the kaleidoscope stops too — one signal, two places.
