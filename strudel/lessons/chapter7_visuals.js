// ============================================================
// CHAPTER 7 — Visuals
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// The finale: your Chapter 6 track, now with visuals. Strudel's inline ._pianoroll()
// draws the NOTES; Hydra draws graphics you can drive TWO ways — from the rack AUDIO
// (a.fft, via the Scarlett) and from a Strudel SIGNAL (H(), synced to the beat).
//
// HYDRA SETUP: Hydra needs to HEAR the rack — set the Scarlett as Chrome's mic for
// strudel.cc (address-bar site settings) and route the rack mix to Scarlett ins 1&2.
// (Strudel's own ._scope/._spectrum stay blank — Strudel isn't the one making sound.)
// ============================================================

// initHydra({detectAudio:true}) starts Hydra and creates `a`, the audio analyser.
// a.fft[0..3] = live levels of 4 bands (lows..highs) off the Scarlett.
await initHydra({detectAudio:true})
a.setBins(4)
a.setSmooth(0.85)

// ---- the familiar Chapter 6 track ($: lets it play under the visual below) ----
const WS = 'Workshop System MIDI'
const OC = 'Phazerville'
const modBass = v => ccn(42).ccv(v).midichan(1) .midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(2) .midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(3) .midi(OC)
const modBus  = v => ccn(42).ccv(v).midichan(10).midi(OC)

const prog = "<0 3 4 0>"
const bass = n("0 _ _ _ 3 _ 5 _".add(prog)).scale("C2:minor").midichan(1).midi(WS)
const pad  = n("<0 3 5 4>".add(prog))       .scale("C4:minor").midichan(3).midi(OC)
const lead = n("0 2 3 5 7 5 3 2 | 0 3 5 7 9 7 5 3".add(prog))
  .sometimesBy(0.25, x => x.add(7))
  .scale("C5:minor").midichan(2).midi(WS)
const kick=36, snare=38, closedHat=40, openHat=41
const drums = stack(
  note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
  note(closedHat).euclid(7,8).degradeBy("<0.2 0.5>"),
  note(openHat  ).euclid(7,8).undegradeBy("<0.2 0.5>"),
).midichan(10).midi(OC)

const intro  = stack(pad,  modPad (saw .range(0,0.7)  .slow(4).segment(32)))   // reveal
const verse  = stack(drums, bass, pad, modBass(sine.range(0.2,0.5).slow(4).segment(32)))
const chorus = stack(drums, bass, pad, lead)
const bridge = stack(bass, pad, lead,  modBass(saw .range(0,1)    .slow(4).segment(32)))  // riser
const outro  = stack(pad, bass,        modPad (isaw.range(0,0.7)  .slow(4).segment(32)))  // conceal
const song = arrange(
  [4, intro], [8, verse], [8, chorus], [4, bridge], [8, chorus], [4, outro],
).swing(4)

$: stack(
  song,
  modLead(perlin.range(0.3,0.9).slow(16).segment(32)),   // drift, across the whole song
  modBus (perlin.range(0,0.6)  .slow(24).segment(32)),
).cpm(30)._pianoroll()

// ---- the Hydra visual (NEW) — driven TWO ways --------------------------------
// AUDIO-reactive: a.fft[...] pulses to the rack sound coming back on the Scarlett.
// SIGNAL-driven:  H(signal) pipes a Strudel LFO straight into a Hydra param — the
//   SAME kind of signal that sweeps your filters, now moving the picture (no mic).
osc(20, 0.05, 0.6)
  .color(() => 0.5 + a.fft[1]*0.8, 0.2, () => 0.5 + a.fft[3]*0.8)  // audio: mids/highs -> colour
  .rotate(H(sine.slow(8)))                                        // signal: a slow LFO spins it
  .modulate(noise(() => 1 + a.fft[2]*3))                          // audio: mids warp the texture
  .kaleid(() => 3 + a.fft[0]*4)                                   // audio: kick opens the kaleidoscope
  .scale(H(saw.range(1,1.4).slow(4)))                             // signal: a steady zoom pulse
  .out()

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - react harder:  .scale(() => 1 + a.fft[0]*3)     (back to audio-driven zoom)
//   - all signal:    drive .kaleid with H(tri.range(3,7).slow(8)) instead of a.fft
//   - drift the look: .rotate(H(perlin.slow(16)))     (the picture wanders too)
//   - different look: swap osc(...) for voronoi(8,0.3) or noise(3) or shape(6)
//   - other viz:     swap ._pianoroll() for ._spiral() or ._pitchwheel()
// ------------------------------------------------------------
