const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high
const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5".add(prog))
  .scale("A2:minor").midichan(4).midi(OC)

const pad  = n("0 ~ ".add(prog))
  .scale("A3:minor").midichan(3).midi(OC)

const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A5:minor").degradeBy(slider(0.313, 0, 1)).midichan(1).midi(WS)

const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A5:minor").midichan(1).midi(WS)

const kick=36, snare=37, closedHat=38, openHat=39
const drums = stack(
  note(kick     ).struct("x x"),
  note(snare    ).struct("~ x"),
  note(closedHat).struct("x x x ~ x x x ~"),
).midichan(10).midi(OC)

const drums2 = stack(
  note(kick     ).struct("x x x x"),
  note(snare    ).struct("x x"),
  note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
  note(openHat  ).struct("~ ~ ~ x ~ ~ ~ x*2 | ~ ~ ~ x ~ ~ ~ x*4"),
).midichan(10).midi(OC)

// ---- Movement                       
const lfo1  = isaw  .slow(4)         // 0..1
const lfo2 = perlin.slow(4)         // 0..1, wandering

const mod1 = v => ccn(42).ccv(v).midichan(2).midi(WS)
const mod2 = v => ccn(42).ccv(v).midichan(1).midi(WS)

const mods = stack(
  mod1 (lfo1 .range(1,0).segment(32)), 
  mod2(lfo2.range(0,1).segment(32)),   
)

// ---- Sections and Arrangement
const intro  = stack(drums, pad)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums2, pad, lead2, mods)
const outro  = stack(bass, pad)

arrange(     
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(35)