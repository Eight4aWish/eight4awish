// DRAFT — the long song, with a picture that knows where it is in it.
//
// The old Hydra block was driven entirely by slow LFOs, so the intro and the chorus looked
// the same: it breathed and nothing else. Two things change that.
//
// 1. THE PICTURE GETS THE SAME ARRANGEMENT AS THE SONG. Every `v` pattern below uses the
//    bar counts of arrange() - 4, 8, 8, 4, 8, 4 - so the image changes at exactly the
//    moments the music does. That is the whole fix: not more movement, but movement that
//    lands on the structure.
//
// 2. IT LISTENS TO THE RACK. initHydra({detectAudio:true}) opens the audio input, and
//    a.fft[0..2] are bass / mid / treble energy off what is actually coming back. So the
//    kick pumps the zoom and the hats flicker the edge, which no LFO can fake because no
//    LFO knows when the kick landed.
//
// The two halves are independent, which matters with the rig dismantled. The sectional half
// runs off Strudel's own clock and needs no audio and no hardware — open this, press play,
// and the picture moves through the song on its own. The fft half needs sound arriving at
// the browser's audio input; with none it reads 0 and does nothing, harmlessly.
//
// To feed it the rack without the rack: route a recorded take's audio to an input with a
// loopback device (BlackHole is the usual free one), pick that as the browser's microphone,
// and play the take. Hydra is then reacting to the real rack, just recorded rather than live.

await initHydra({ detectAudio: true })

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
const lfo1 = isaw  .slow(4)
const lfo2 = perlin.slow(4)

const mod1 = v => ccn(42).ccv(v).midichan(2).midi(WS)
const mod2 = v => ccn(42).ccv(v).midichan(1).midi(WS)

const mods = stack(
  mod1(lfo1.range(1,0).segment(32)),
  mod2(lfo2.range(0,1).segment(32)),
)

// ---- Sections and Arrangement
const intro  = stack(drums, pad)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums2, pad, lead2, mods)
const outro  = stack(bass, pad)

$: arrange(
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(35)

// ---- The picture's arrangement
//
// Same bar counts as arrange() above: 4 intro, 8 verse, 8 chorus, 4 bridge, 8 chorus,
// 4 outro. Change a number in arrange() and you change it here too — that is the price of
// the picture knowing where it is, and it is worth paying.
//
//                intro   verse  chorus  bridge  chorus  outro
const vKal   = "<  2@4     4@8    8@8     5@4     8@8    2@4  >"  // kaleidoscope segments
const vHue   = "<  0.6@4   0.5@8  0.05@8  0.75@4  0.05@8 0.6@4>"  // blue → red in the chorus
const vBlend = "<  0@4     0.1@8  0.55@8  0.8@4   0.55@8 0@4  >"  // how much voronoi bleeds in
const vSpin  = "<  0.02@4  0.05@8 0.2@8   -0.3@4  0.2@8  0.02@4>" // the bridge turns back

// Audio reactivity, if there is any audio. With no input a.fft reads 0 and every one of
// these collapses to 1, which is a no-op rather than a crash — so the sectional picture
// above works with nothing patched in, and the rack (or a recording of it) only ever adds.
const amp = (bin, depth) => () => 1 + (((typeof a !== 'undefined' && a.fft) ? a.fft[bin] : 0) || 0) * depth

// ---- The picture

osc(18, 0.08, 0.6)
  .color(H(vHue), 0.6, 0.9)
  .rotate(() => time * 0.1, H(vSpin))            // spin rate is sectional; bridge reverses
  .blend(voronoi(6, 0.3, 0.2), H(vBlend))        // a different SHAPE per section, not a tweak
  .kaleid(H(vKal))
  .modulate(noise(3), H(lfo2.range(0.05, 0.4)))  // the one place the old slow drift survives
  .scale(amp(0, 0.45))                           // the kick pumps the zoom
  .contrast(amp(2, 2))                           // the hats flicker the edges
  .out()

// ---- Try this
//
// * Comment out the .scale() line and the picture stops moving with the drums entirely.
//   That one line is the difference between reacting and decorating.
// * Put -0.3 in more of vSpin and the whole piece feels like it is unwinding.
// * a.fft[0] is bass, [1] mid, [2] treble. Swap which drives which and the image changes
//   its mind about what the song is about.
