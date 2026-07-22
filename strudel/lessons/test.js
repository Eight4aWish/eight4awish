const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts

const prog = "<0 0 3 5 0 0 5 4>"
const bass = n("0 _ ~ ~ 0 ~ 3 ~".add(prog)).scale("A2:minor").midichan(3).midi(OC)
const pad  = n("0 ~".add(prog))       .scale("A4:minor").midichan(2).midi(WS)
const lead = n("0 3 5 3 0 3 5 3".add(prog)).scale("A5:minor").midichan(1).midi(WS)
const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(closedHat).struct("x x [x x] ~ [x x] x x ~"),
  note(openHat).struct("~ ~ ~ x ~ ~ ~ [x x]"),  
).midichan(10).midi(OC)

// ---- Movement

const modBass = v => ccn(42).ccv(v).midichan(3) .midi(OC)
const modLead = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const mods = stack(
  modPad (sine .range(0,1)  .slow(4).segment(32)), // adjusts reverb mix 
  modBass(isaw.range(1,0).slow(8).segment(32)),   // bass filter opening
  modLead(isaw.range(1,0)  .slow(4).segment(32)), // filter changes
)

// ---- Sections

const intro  = stack(pad, mods)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums,pad, mods)
const outro  = stack(pad, bass, mods)

arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)