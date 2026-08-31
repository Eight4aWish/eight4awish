// LESSON 1 — Basic
// One track: parts, drums, movement, arranged into a song.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high

const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ ~ ~ 0 ~ 3 ~".add(prog))
  .scale("A2:minor").midichan(3).midi(OC)
const pad  = n("0 ~".add(prog))
  .scale("A4:minor").midichan(2).midi(WS)
const lead = n("0 3 5 3 0 3 5 3".add(prog))
  .scale("A5:minor").midichan(1).midi(WS)

const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
  note(openHat  ).struct("~ ~ ~ x ~ ~ ~ x*2"),
).midichan(10).midi(OC)

// ---- Movement                       one LFO each, named once

const lfoBass = isaw  .slow(8)         // 1..0
const lfoPad  = sine  .slow(4)         // 0..1
const lfoLead = isaw  .slow(4)         // 1..0

const modBass = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modPad  = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(1).midi(WS)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // bass filter opens
  modPad (lfoPad .range(0,1).segment(32)),   // pad reverb mix
  modLead(lfoLead.range(1,0).segment(32)),   // lead filter
)

// ---- Sections

const intro  = stack(pad, mods)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums, pad, mods)
const outro  = stack(bass, pad, mods)

arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)
