const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high
const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 ~ ~ ~ 0 ~ 3 ~".add(prog))
  .scale("A2:minor").midichan(4).midi(OC)

const pad  = n("0 ~ ".add(prog))
  .scale("A3:minor").midichan(3).midi(OC)

const lead = n("0 3 5 3 0 3 5 3".add(prog))
  .scale("A5:minor").midichan(1).midi(WS)

const kick=36, snare=37, closedHat=38, openHat=39
const drums = stack(
  note(kick     ).struct("x x"),
  note(snare    ).struct("~ x"),
  note(closedHat).struct("x x x ~ x x x ~"),
  note(openHat  ).struct("~ ~ ~ ~ ~ ~ ~ x")
).midichan(10).midi(OC)


// ---- Sections and Arrangement
const intro  = stack(drums, pad)
const verse  = stack(drums, bass, pad)
const chorus = stack(drums, bass, pad, lead)
const outro  = stack(bass, pad)

arrange(     
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, outro],
).cpm(35)