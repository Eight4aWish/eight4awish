// ============================================================
// CHAPTER 6 — Generative
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// Let the track evolve on its own. The NOTES thin and mutate, and the MOVEMENT
// wanders. Chapter 5's sectional mods still serve the song (reveal, riser, conceal);
// now two more mods DRIFT across the whole track, driven by a random signal instead
// of a shape. ._pianoroll() lets you watch it happen.
//
// HOW TO RUN: paste into strudel.cc (Chrome). Both boxes connected (same as Ch 5).
// ============================================================

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'
const modBass = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(3) .midi(OC)
const modBus  = v => ccn(42).ccv(v).midichan(10).midi(OC)

const prog = "<0 3 4 0>"
const bass = n("0 _ _ _ 3 _ 5 _".add(prog)).scale("C2:minor").midichan(1).midi(WS)
const pad  = n("<0 3 5 4>".add(prog))       .scale("C4:minor").midichan(3).midi(OC)

// .sometimesBy(p, fn) applies fn to a fraction p of events. Here the lead jumps up
// an octave (add 7 scale steps) about a quarter of the time — an occasional surprise.
const lead = n("0 2 3 5 7 5 3 2 | 0 3 5 7 9 7 5 3".add(prog))
  .sometimesBy(0.25, x => x.add(7))
  .scale("C5:minor").midichan(2).midi(WS)

// .degradeBy(x) randomly DROPS events (x = chance to drop), fresh every cycle, so the
// groove keeps shifting. Patterning the amount (<...>) is your "how random" knob.
// .undegradeBy(x) keeps exactly what degradeBy(x) drops — so the two hats INTERLOCK:
// whatever the closed hat skips, the open hat fills.
const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).euclid(7,8).degradeBy("<0.2 0.5>"),
  note(openHat  ).euclid(7,8).undegradeBy("<0.2 0.5>"),
).midichan(10).midi(OC)

// ---- Sectional movement (Chapter 5) — still serves the song ----
const intro  = stack(pad,
  modPad (saw .range(0,0.7)  .slow(4).segment(32)))   // REVEAL
const verse  = stack(drums, bass, pad,
  modBass(sine.range(0.2,0.5).slow(4).segment(32)))   // BREATHE
const chorus = stack(drums, bass, pad, lead)          // the drifting mods carry it now
const bridge = stack(bass, pad, lead,
  modBass(saw .range(0,1)    .slow(4).segment(32)))   // RISER
const outro  = stack(pad, bass,
  modPad (isaw.range(0,0.7)  .slow(4).segment(32)))   // CONCEAL

const song = arrange(
  [4, intro], [8, verse], [8, chorus], [4, bridge], [8, chorus], [4, outro],
).swing(4)

// ---- Drift: random signals, ACROSS the whole song --------------
// Same mod slot you learned in Chapter 5 — but feed it a RANDOM signal and it
// wanders instead of repeating. perlin GLIDES (smooth random); rand JUMPS (stepped).
// Smooth is what a filter wants. These sit OUTSIDE arrange(), so they run through
// every section, indifferent to the song — colour, not choreography.
stack(
  song,
  modLead(perlin.range(0.3,0.9).slow(16).segment(32)),   // organic, never repeats
  modBus (perlin.range(0,0.6)  .slow(24).segment(32)),   // a very slow tide
).cpm(30)._pianoroll()

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - more chaos:    raise the degrade amounts, e.g. .degradeBy("<0.4 0.8>")
//   - by hand:       .degradeBy(slider(0.3, 0, 1))    (drag the randomness live)
//   - jump, don't glide: swap perlin for rand.segment(8) on a drift mod — hear the steps
//   - mutate more:   .sometimesBy(0.5, x => x.add(2)) on the lead
//   - lock it down:  set the hats to .degradeBy(0)    (no drops = the plain groove)
// ------------------------------------------------------------
