const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts

const prog = "<0 0 3 5 0 0 5 4>"

const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A5:minor").degradeBy(slider(0, 0, 1)).midichan(1).midi(WS)
  ._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(1).midi(WS)
  ._pianoroll()
const pad  = n("0 ~".add(prog))
  .scale("A4:minor").midichan(2).midi(WS)
  ._pianoroll()
const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5".add(prog))
  .scale("A2:minor").midichan(3).midi(OC)
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

// ---- Movement

const modLead = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modBass = v => ccn(42).ccv(v).midichan(3) .midi(OC)

const mods = stack(
  modPad (sine .range(0,1)  .slow(4).segment(32)), // adjusts reverb mix 
  modLead(perlin.range(1,0)  .slow(4).segment(32)), // smoothed random filter changes
  modBass(isaw.range(1,0).slow(8).segment(32)), // bass filter opening
)

// ---- Sections

const intro  = stack(mods, pad)   
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(lead2, drums,pad, mods)
const outro  = stack(pad, bass, mods)

arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)