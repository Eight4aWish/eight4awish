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
const prog = "<0 3 4 0>"
const bass = n("0 _ _ _ 3 _ 5 _".add(prog)).scale("C2:minor").midichan(1).midi(WS)
const pad  = n("<0 3 5 4>".add(prog))       .scale("C4:minor").midichan(3).midi(OC)
const lead = n("0 2 3 5 7 5 3 2 | 0 3 5 7 9 7 5 3".add(prog)).scale("C5:minor").midichan(2).midi(WS)
const kick=36, snare=38, closedHat=40
const drums = stack(
  note(kick    ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare   ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).euclid(5,8),
).midichan(10).midi(OC)

// ---- Movement: a signal -> CC42 -> a control voltage --------
// A signal is a continuous shape: sine / tri / saw / isaw / square.
//   ccn(42)       which CC to send (our mod is 42)
//   .ccv(SIGNAL)  the value — ccv runs -1..1, with 0 = centre
// Shape it:  .range(lo,hi) = depth   .slow()/.fast() = speed   .segment(n) = CC msgs/cycle.
//
// One helper per destination — because each mod has exactly ONE source. (Two CC
// patterns aimed at the same channel just overwrite each other.)
const modBass = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(3) .midi(OC)
const modBus  = v => ccn(42).ccv(v).midichan(10).midi(OC)
// The O&C mods are positive-only (0..1) — perfect for a cutoff. The Workshop's swing
// both ways (-1..1) if you want through-zero modulation.

// ---- Sections OWN their movement ---------------------------
// A .slow(4) signal inside a 4-bar section sweeps exactly ONCE across it.
// And a CC holds its last value — so the intro's reveal stays open all the way
// through the middle of the song, until the outro closes it again.
const intro  = stack(pad,
  modPad (saw .range(0,0.7)  .slow(4).segment(32)))   // REVEAL — filter opens, the highs appear
const verse  = stack(drums, bass, pad,
  modBass(sine.range(0.2,0.5).slow(4).segment(32)))   // BREATHE — gentle and cyclic
const chorus = stack(drums, bass, pad, lead,
  modLead(tri .range(0.6,1)  .slow(2).segment(32)),   // BRIGHT — the lead sings
  modBus (isaw.range(0.2,1)  .fast(4).segment(32)))   // PUMP — a per-beat pluck on the drums
const bridge = stack(bass, pad, lead,
  modBass(saw .range(0,1)    .slow(4).segment(32)))   // RISER — one climb across 4 bars
const outro  = stack(pad, bass,
  modPad (isaw.range(0,0.7)  .slow(4).segment(32)))   // CONCEAL — the filter closes again

arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],   // the build...
  [8, chorus],   // ...and the drop — the chorus mod simply takes over
  [4, outro],
).swing(4).cpm(30)

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - by hand:      swap a signal for a fader ->  modBass(slider(0, -1, 1))
//   - bigger build: widen the riser -> saw.range(0,1) vs saw.range(0.3,0.8)
//   - longer build: make it [8, bridge] and the riser .slow(8)
//   - new shape:    swap saw for tri / square / isaw
//   - open further: intro reveal saw.range(0,1) instead of (0,0.7)
// ------------------------------------------------------------
