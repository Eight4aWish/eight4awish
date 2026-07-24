await initHydra()   // starts Hydra (background canvas)

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts

const prog = "<0 0 3 5 0 0 5 4>"

const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A5:minor").degradeBy(slider(0.344, 0, 1)).midichan(1).midi(WS)
._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(1).midi(WS)
  ._pianoroll()
const pad  = n("0 ~".add(prog))
  .scale("A4:minor").midichan(2).midi(WS)
._pianoroll()
const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5"
  .add(prog)).scale("A2:minor").midichan(3).midi(OC)
._pianoroll()

const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ ~ ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(kick).struct("~ x x x"),
  note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
  note(openHat).struct("~ ~ ~ x ~ ~ ~ x*2 | ~ ~ ~ x ~ ~ ~ x*4 "),
).midichan(10).midi(OC)

// ---- Movement — define each LFO ONCE, then use it in TWO places ----
// lfoLead is perlin: a smooth RANDOM signal. lfoPad/lfoBass are shape LFOs.

const lfoPad  = sine  .slow(4)   // 0..1
const lfoLead = perlin.slow(4)   // ~0..1, wanders (the random one)
const lfoBass = isaw  .slow(8)   // 1..0

const modLead = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modBass = v => ccn(42).ccv(v).midichan(3) .midi(OC)

const mods = stack(
  modPad (lfoPad .range(0,1).segment(32)), // reverb mix
  modLead(lfoLead.range(1,0).segment(32)), // smoothed random filter
  modBass(lfoBass.range(1,0).segment(32)), // bass filter opening
)

// ---- Sections ----
const intro  = stack(mods, pad)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(lead2, drums, pad, mods)
const outro  = stack(pad, bass, mods)

$: arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)

// ---- Visualisation ----

osc(18, 0.08, 0.6)
  .color(H(lfoPad), 0.25, H(lfoLead))     // pad + lead mods tint it
  .rotate(H(lfoBass.range(0, 6.28)))      // the bass filter sweep spins the whole frame
  .kaleid(H(lfoLead.range(3, 7)))         // perlin (random) opens/closes the kaleidoscope
  .modulate(noise(3))
  .scale(H(sine.range(1, 1.4).slow(4)))   // a steady zoom pulse
  .out()