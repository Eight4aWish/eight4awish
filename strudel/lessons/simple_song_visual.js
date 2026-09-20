// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.
//
// The rig, and what each channel wants:
//
//   ch1  Workshop voice 1   lead      pitch + gate   (tracks 1V/oct)
//   ch2  Workshop voice 2   pad       pitch + gate   (tracks 1V/oct)
//   ch3  O&C quadrant NW    bass      pitch + gate   (tracks 1V/oct)
//   ch10 O&C quadrants SW/SE  drums   gates only     36/38/40/41
//
//   CC42 on ch1 / ch2 / ch3 / ch10 → four independent CVs. The first three open
//   a filter on their own voice. The fourth belongs to no pitched voice at all:
//   it drives a timbre knob on a free-running oscillator (here an Ogham bytebeat,
//   which is why it is never sent a note — it does not track pitch).

await initHydra()

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high

const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5".add(prog))
  .scale("A2:minor").midichan(3).midi(OC)
  ._pianoroll()
const pad  = n("0 ~".add(prog))
  .scale("A4:minor").midichan(2).midi(WS)
  ._pianoroll()
const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A5:minor").degradeBy(slider(0, 0, 1)).midichan(1).midi(WS)
  ._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(1).midi(WS)
  ._pianoroll()

const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(kick     ).struct("~ ~ x ~ ~ ~ x ~"),
  note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
  note(openHat  ).struct("~ ~ ~ x ~ ~ ~ x*2 | ~ ~ ~ x ~ ~ ~ x*4"),
).midichan(10).midi(OC)

// ---- Movement                       name each shape once, reuse it everywhere

const lfoBass = isaw  .slow(8)
const lfoPad  = sine  .slow(4)
const lfoLead = perlin.slow(4)
const lfoText = sine  .slow(16)        // the slowest one — a timbre that swells across the song
const lfoZoom = sine  .slow(4)         // the one signal the rack never hears — picture only

const modBass = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modPad  = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(1).midi(WS)
const modText = v => ccn(42).ccv(v).midichan(10).midi(OC)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // bass filter opens
  modPad (lfoPad .range(0,1).segment(32)),   // pad reverb mix
  modLead(lfoLead.range(1,0).segment(32)),   // lead filter wanders
  modText(lfoText.range(0,1).segment(16)),   // the bytebeat formula bends
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
  .modulate(noise(3), H(lfoText.range(0.1, 0.6)))  // the bytebeat's swell warps the image
  .scale(H(lfoZoom.range(1, 1.4)))            // a steady zoom pulse
  .out()

// ---- Try this
//
// * Drag the `slider` in `lead` from 0 up to 1 while it plays — the melody thins out.
// * Swap `sine` for `perlin` in `lfoText` and the bytebeat drifts instead of swelling.
// * Move a line in `arrange()` with Opt+↑/↓ to reorder the song.
// * Comment out `modText(...)` (Cmd+/) and the picture stops warping too — one signal, two places.
