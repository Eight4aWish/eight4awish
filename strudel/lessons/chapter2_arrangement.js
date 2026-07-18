// ============================================================
// CHAPTER 2 — Arrangement
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// You'll build a whole track — bass, lead, pad and a drum kit — arranged into a
// verse and chorus, all in one key. Top-down: run the whole thing first; the
// later chapters unpack each piece.
//
// HOW TO RUN: paste into the strudel.cc REPL in Chrome. Two MIDI outs connected
// (Chapter 1 set these up):
//   'Workshop System MIDI'  -> two voices on ch1 & ch2
//   'Phazerville'           -> pad on ch3, drums on ch10
//
// KEYS (new): Cmd+/ (Ctrl+/ on Win) = comment a line out to mute a voice; Opt+Up/Down = move a line.
// ============================================================

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// Same step grid as Chapter 1 — but now all four drums live together on the O&C
// (ch10), which frees the Workshop up for the pitched voices below.
const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).struct("x ~ x ~ x ~ x ~"),
  note(openHat  ).struct("~ x ~ x ~ x ~ x"),
).midichan(10).midi(OC)

// n() plays SCALE DEGREES, not fixed notes: 0 = the root, 1 = the next step up, etc.
// .scale() sets the key/mode, so every number lands in key — you can't play a wrong note.
const bass = n("0 ~ 0 ~ 3 ~ 5 ~")   .scale("C2:minor").midichan(1).midi(WS)  // ch1: Chapter 1's snare voice, now the bass
const lead = n("0 2 3 5 7 5 3 [2 0]").scale("C5:minor").midichan(2).midi(WS)
// the [2 0] is subdivision brackets: two notes squeezed into a single beat.
const pad  = n("<0 3 5 4>").scale("C4:minor").midichan(3).midi(OC)
// < > is alternation: one of these per cycle, so the pad chord changes bar to bar.
// Bass/pad/lead sit in different octaves (C2/C4/C5) to stay out of each other's way.

// Combine blocks into sections...
const verse  = stack(drums, bass, pad)
const chorus = stack(drums, bass, pad, lead)   // the lead drops in for the chorus

// ...then arrange() plays the sections in order — each entry is [bars, section].
arrange(
  [8, verse],
  [8, chorus],
  [8, verse],
  [8, chorus],
).cpm(30)

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - change key:          "C2:minor" -> "C2:major" or "D2:dorian" (match every voice)
//   - widen the lead:      n("0 2 3 5 7 9 7 5")
//   - two notes in a beat: n("0 [2 3] 5 [7 9]")
//   - busier kick:         note(kick).struct("x ~ x ~ x ~ x ~")
//   - re-order the song:   put a [4, chorus] first as an intro
// ------------------------------------------------------------
