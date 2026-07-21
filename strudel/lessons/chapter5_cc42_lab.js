// ============================================================
// CHAPTER 5 — CC#42 LAB
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// One idea, isolated: what can a single CC#42 do? The whole band loops forever so
// there's music to listen against — but only ONE mod is live at a time, aimed at the
// bass filter. You change ONE line (the MOD), press play, and hear the difference.
//
// HOW TO RUN: paste into strudel.cc (Chrome). Both boxes connected. Patch the mod out
// (Workshop ch1, CC42) to the BASS VCF cutoff so you can hear every tweak. All other
// instruments play clean (no mod) so the bass is the thing that moves.
// ============================================================

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- The band, looping (unchanged, no movement) ------------
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

// ============================================================
// THE MOD — edit this ONE line, then press play
// ============================================================
// Anatomy:  ccn(42)      = which CC number to send   (42 = our mod bus)
//           .ccv(SIGNAL) = the value to send it       (a signal, 0..1 here)
//           .midichan(1).midi(WS) = out the Workshop, channel 1 -> bass filter
//
// Everything interesting happens to SIGNAL. Swap it for any line from the MENU below.

const MOD = saw.range(0, 1).slow(4).segment(32)   // <-- CHANGE ME

const modBass = ccn(42).ccv(MOD).midichan(1).midi(WS)

stack(drums, bass, pad, lead, modBass).swing(4).cpm(30)


// ============================================================
// THE MENU — copy any line up into MOD and press play again
// ============================================================
//
// 1) SHAPE — the raw contour of the LFO (all run 0..1 before .range):
//      sine    .range(0,1).slow(4).segment(32)   smooth up-and-down, no corners
//      tri     .range(0,1).slow(4).segment(32)   straight up, straight down
//      saw     .range(0,1).slow(4).segment(32)   ramp UP, snap back   (a riser)
//      isaw    .range(0,1).slow(4).segment(32)   ramp DOWN, snap up    (a fall / pluck)
//      square  .range(0,1).slow(4).segment(1)    hard on/off — gate, not a sweep
//      rand    .range(0,1).segment(8)            sample & hold — new random step each 1/8
//      perlin  .range(0,1).slow(2).segment(32)   smooth drifting noise, never repeats
//
// 2) DEPTH & OFFSET — .range(lo, hi) sets how far and around what centre it moves:
//      saw.range(0, 1)     .slow(4).segment(32)  full sweep, filter fully closed->open
//      saw.range(0.3, 0.8) .slow(4).segment(32)  narrower — stays in the mid, subtler
//      saw.range(0.6, 0.6) .slow(4).segment(32)  no movement — a fixed value (a knob)
//      saw.range(1, 0)     .slow(4).segment(32)  FLIP it — hi,lo reverses the direction
//
// 3) SPEED — .slow(n) = slower LFO, .fast(n) = faster. n is in cycles:
//      sine.range(0,1).slow(8) .segment(32)      one breath every 8 bars (very slow)
//      sine.range(0,1).slow(4) .segment(32)      once per 4-bar phrase
//      sine.range(0,1)         .segment(32)      once per bar
//      sine.range(0,1).fast(4) .segment(32)      4x per bar — a per-beat wobble
//
// 4) RESOLUTION — .segment(n) = how many CC messages get sent per cycle:
//      saw.range(0,1).slow(4).segment(64)        very smooth (lots of messages)
//      saw.range(0,1).slow(4).segment(32)        smooth enough, lighter on MIDI
//      saw.range(0,1).slow(4).segment(8)         audibly STEPPED — a staircase
//      saw.range(0,1).slow(4).segment(4)         4 big steps — quantised, arpy
//    (No .segment = continuous but VERY chatty. Always segment a MIDI CC.)
//
// 5) PHASE — .early(n)/.late(n) shift WHERE in the cycle the sweep sits:
//      saw.range(0,1).slow(4).early(2).segment(32)   start the ramp 2 bars in
//
// 6) STACKING — add a slow shape to a fast one for two moves at once:
//      sine.range(0.2,0.6).slow(4).add(sine.range(0,0.2).fast(8)).segment(32)
//      // slow swell + fast shimmer on top   (keep the total roughly within 0..1)
//
// 7) BY HAND — replace the signal with a live control instead of an LFO:
//      slider(0.5, 0, 1)                         an on-screen fader you drag
//      "0 0.5 1 0.5".segment(4)                  a written-out step sequence
//      "<0 1>".segment(1)                        alternate low/high each bar
//
// ------------------------------------------------------------
// WHY 0..1 HERE:  ccv runs -1..1 with 0 = centre. The Workshop mod out is bipolar
// (it can swing negative). This lab uses 0..1 because a filter cutoff only wants
// positive voltage. Want through-zero? Try  .range(-1, 1)  on a bipolar destination.
// ------------------------------------------------------------
