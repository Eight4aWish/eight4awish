// ============================================================
// CHAPTER 3 — Drums
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// You've got a 4-piece kit (Chapters 1-2). This chapter gives it life — euclidean
// hats, swing, and half/double-time — all on the O&C's drum channel (ch10).
//
// HOW TO RUN: paste into strudel.cc (Chrome). 'Phazerville' (O&C) connected, with
// ch10 gating the four drum notes.
//
// KEYS (new): Shift+Opt+Down = duplicate a line — copy a drum row, then tweak it.
// ============================================================

const OC = 'Phazerville'
const kick=36, snare=38, closedHat=40, openHat=41

// .euclid(hits, steps) spreads N hits evenly across the bar — an instant groove
// with no grid to draw. Here the closed hat gets 5 hits over 8 steps.
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).euclid(5,8),                 // <- euclid, not a hand-drawn grid
  note(openHat  ).struct("~ x ~ x ~ x ~ x"),   // offbeats
).midichan(10).midi(OC)

// .swing(n) adds shuffle: it splits each bar into n slices and nudges the offbeat
// half slightly late — that classic bounce. .swing(4) suits an 8-step grid.
drums.swing(4).cpm(30)

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - a snare roll:    note(snare).struct("x x x x").fast(2)   (.fast squeezes time)
//   - half-time feel:  drums.slow(2)                           (.slow stretches it)
//   - euclid the kick: note(kick).euclid(3,8)                  (a tresillo)
//   - heavier swing:   drums.swingBy(0.5, 4)                   (0.5 > swing's 1/3)
//   - busier hats:     note(closedHat).euclid(7,8)
// ------------------------------------------------------------
