// ============================================================
// CHAPTER 4 — Melody
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// The pitched voices go deeper: make them follow a chord progression (all still in
// key), hold notes longer, add a dash of randomness, and arrange the whole thing
// into a proper song — intro, verse, chorus, bridge, outro.
//
// HOW TO RUN: paste into strudel.cc (Chrome). Both boxes connected:
//   'Workshop System MIDI' -> bass (ch1), lead (ch2)
//   'Phazerville'          -> pad (ch3), drums (ch10)
// ============================================================

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// PROGRESSION. .add() shifts scale degrees by SCALE STEPS (so it stays in key).
// Add the SAME pattern to every voice and they move together through the changes.
// <0 3 4 0> = home, up a third, up a fourth, home — one chord per bar.
const prog = "<0 3 4 0>"

// _ holds a note for longer (each _ = one more step). The bass now sustains
// instead of the short Chapter-2 line.
const bass = n("0 _ _ _ 3 _ 5 _".add(prog)).scale("C2:minor").midichan(1).midi(WS)
const pad  = n("<0 3 5 4>".add(prog))       .scale("C4:minor").midichan(3).midi(OC)

// | picks ONE option at random each cycle — instant lead variation, still in key.
const lead = n("0 2 3 5 7 5 3 2 | 0 3 5 7 9 7 5 3".add(prog)).scale("C5:minor").midichan(2).midi(WS)

// Drums from Chapter 3.
const kick=36, snare=38, closedHat=40
const drums = stack(
  note(kick    ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare   ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).euclid(5,8),
).midichan(10).midi(OC)

// SECTIONS — more of them now, for a real song shape.
const intro  = stack(pad)                 // ease in on the pad alone
const verse  = stack(drums, bass, pad)
const chorus = stack(drums, bass, pad, lead)
const bridge = stack(bass, pad, lead)     // drums drop out for a lift
const outro  = stack(pad, bass)

// ARRANGE the whole song — [bars, section].
arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).swing(4).cpm(30)

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - new progression:  prog = "<0 4 5 3>"
//   - hold the bass:    n("0 _ _ _ _ _ _ _")   (one note all bar)
//   - more variation:   add a third "| ..." phrase to the lead
//   - reshape the song: move [4, bridge] earlier, or add another [8, chorus]
// ------------------------------------------------------------
