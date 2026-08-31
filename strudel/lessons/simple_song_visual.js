// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.

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

// ---- Movement                       one LFO each, named once

const lfoBass = isaw  .slow(8)         // 1..0
const lfoPad  = sine  .slow(4)         // 0..1
const lfoLead = perlin.slow(4)         // 0..1, wandering
const lfoZoom = sine  .slow(4)         // 0..1, picture only

const modBass = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modPad  = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(1).midi(WS)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // bass filter opens
  modPad (lfoPad .range(0,1).segment(32)),   // pad reverb mix
  modLead(lfoLead.range(1,0).segment(32)),   // lead filter wanders
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
  .rotate(H(lfoBass.range(0, 6.28)))   // the bass sweep spins the frame
  .kaleid(H(lfoLead.range(3, 7)))      // the wandering one opens the kaleidoscope
  .modulate(noise(3))
  .scale(H(lfoZoom.range(1, 1.4)))     // a steady zoom pulse
  .out()
