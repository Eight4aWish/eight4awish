// ============================================================
// CHAPTER 5 — Movement
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// Modulation IS arrangement. A signal sent as a MIDI CC becomes a control voltage in
// your rack — patch it to a filter cutoff and the song breathes. Put that mod INSIDE
// a section and it only runs when that section plays: the intro reveals, the bridge
// builds, the chorus drops, the outro closes.
//
// HOW TO RUN: paste into strudel.cc (Chrome). Both boxes connected. Patch each mod
// out to a VCF cutoff. Mod outs (all CC42):
//   Workshop ch1 (bass), ch2 (lead)   |   O&C ch3 (pad), ch10 (drum bus)
// ============================================================

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- the Chapter 4 song (unchanged) ------------------------
const prog = "<0 0 3 5 0 0 5 4>"
const bass = n("0 ~ ~ ~ 0 ~ 3 ~".add(prog)).scale("A2:minor").midichan(3).midi(OC)
const pad  = n("0".add(prog))       .scale("A4:minor").midichan(2).midi(WS)
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

// ---- Movement: a signal -> CC42 -> a control voltage --------
// A signal is a continuous shape: sine / tri / saw / isaw / square.
//   ccn(42)       which CC to send (our mod is 42)
//   .ccv(SIGNAL)  the value — ccv runs -1..1, with 0 = centre
// Shape it:  .range(lo,hi) = depth   .slow()/.fast() = speed   .segment(n) = CC msgs/cycle.
//
// One helper per destination — because each mod has exactly ONE source. (Two CC
// patterns aimed at the same channel just overwrite each other.)
const modBass = v => ccn(42).ccv(v).midichan(3) .midi(OC)
const modLead = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modDrum  = v => ccn(42).ccv(v).midichan(10).midi(OC)
// The O&C mods are positive-only (0..1) — perfect for a cutoff. The Workshop's swing
// both ways (-1..1) if you want through-zero modulation.
const mods = stack(
  modPad (saw .range(0,1)  .slow(4).segment(32)),   
  modBass(tri.range(0.65,0.85).slow(4).segment(32)),   
  modLead(tri .range(0,1)  .slow(4).segment(32)),   
  modDrum (saw.range(0,1)  .fast(4).segment(32))  
)
// ---- Sections OWN their movement ---------------------------
// A .slow(4) signal inside a 4-bar section sweeps exactly ONCE across it.
// And a CC holds its last value — so the intro's reveal stays open all the way
// through the middle of the song, until the outro closes it again.
const intro  = stack(pad, mods)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums,pad, mods)
const outro  = stack(pad, bass, mods)

arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],   // the build...
  [8, chorus],   // ...and the drop — the chorus mod simply takes over
  [4, outro],
).cpm(30)

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - by hand:      swap a signal for a fader ->  modBass(slider(0, -1, 1))
//   - bigger build: widen the riser -> saw.range(0,1) vs saw.range(0.3,0.8)
//   - longer build: make it [8, bridge] and the riser .slow(8)
//   - new shape:    swap saw for tri / square / isaw
//   - open further: intro reveal saw.range(0,1) instead of (0,0.7)
// ------------------------------------------------------------
