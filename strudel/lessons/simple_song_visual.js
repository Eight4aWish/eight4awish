// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.
//
// The rack, and what each channel wants:
//
//   ch1  Workshop v1  pitch + gate → Joy  on ZLPF    — the bass
//   ch2  Workshop v2  pitch + gate → Plaits          — the pad
//   ch3  O&C NW       pitch + gate → Ogham           — the lead
//   ch10 O&C SW/SE    gates        → Beatsi  kick snare hat crash
//
//   CC42 ch1  → Joy CV_6           (Timbre — which on ZLPF *is* the cutoff)
//   CC42 ch2  → Plaits TIMBRE
//   CC42 ch3  → Ogham CV_A         (timbre, 0–255, sums with the knob)
//                                   CV_B stays unpatched on purpose — see below
//   CC42 ch10 → Alchemy Lab        (echo feedback, across the whole mix)
//
// Ogham is a stereo pair, not a mono voice — Out1 is L and Out2 is R, one bytebeat voice
// each. Patch both into the Alchemy Lab's J1/J2 rather than multing one. Neither Echoa nor
// Spagyros will widen a mono signal for you: Echoa's four routings all keep each line to
// its own channel, and the jacks are plain codec inputs with no normalling.
//
// Three voices that need no help. Joy, Plaits and Ogham each carry their own envelope,
// so nothing here needs an external VCA — which is the whole reason the bass line below
// can use rests.
//
// Joy on ZLPF (bank 4, FLT+VOX) is a filter you play notes on: Timbre is cutoff
// frequency, Color is waveshape. So `modBass` is a real filter sweep happening inside
// the oscillator, not a separate module. Two things to set on the module first — patch
// a gate to GATE IN 1, because unpatched it drones and the rests do nothing; and leave
// the Timbre knob near the middle, because CV_6 modulates ±50% around wherever it sits.
// Knobs 3 and 4 are the attack and decay: short decay for a plucked bass, long for a pad.
//
// Ogham needs its Clock jack switched to V/oct. In that mode the engine hard-syncs, so
// the formula restarts every cycle and the thing plays in tune — but each formula has
// its own pitch ceiling, above which it falls silent. 31 of the 101 are silent at every
// playable pitch (the free-running drones), so pick a melodic one and check it sounds at
// the top of the part. "Hidden Melody" holds to 4 kHz, which covers this lead twice over.
//
// Ogham's envelope has one control, and it is not on a knob. In the FX menu, the `Lp`
// field is the internal LPG: `Lp.oF` is off (the voice runs continuously), `Lp.01`–`Lp.99`
// is on with that decay. The curve has a knee at field 40 so the useful range is spread
// out — 0–30 covers 2 ms to 126 ms, 30–50 covers 126 ms to 934 ms, 50–99 covers 934 ms to
// 20 s. At cpm(30) a step of this lead is 250 ms, so **Lp.37** makes each note last about
// one step. Lower for a pluck, higher to let the line blur into itself.
//
// There is no attack setting. It is derived — 15% of the decay, clamped to 1 ms — so every
// note starts inside a millisecond and Ogham cannot fade in. It is a struck voice.
//
// The GATE jack does both jobs at once: each rising edge hard-syncs the formula *and*
// plucks the LPG, off the same interrupt. That is also why the gate is a trigger and not a
// gate — note length is ignored, so `_` lengthens the MIDI gate but not the sound. Use the
// Lp field for note length, not the pattern. (The same is true of Joy: an AD envelope is
// struck, not sustained, so its Decay knob is what holds a note.)
//
// Only one of Ogham's two parameters is driven from here, because moving one of A or B is
// enough to get somewhere good — Steve's own demo of the module is the source of that, and
// it is his module. So A takes the LFO and B is left on the knob, which turns the one
// parameter the sequence never touches into the thing your hand does on camera.
//
// The T01 VCO and the A-121d are spare now. Joy does both jobs in one module.

await initHydra()

const WS = 'Workshop System MIDI'
const OC = 'Phazerville'

// ---- Parts                          bass, pad, lead — low to high, an octave apart

const prog = "<0 0 3 5 0 0 5 4>"

const bass = n("0 _ ~ ~ 0 ~ 3 ~".add(prog))
  .scale("A2:minor").midichan(1).midi(WS)
  ._pianoroll()
const pad  = n("0 ~".add(prog))
  .scale("A3:minor").midichan(2).midi(WS)
  ._pianoroll()
const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
  .sometimesBy(0.4, x => x.add(choose(5,7))))
  .scale("A4:minor").degradeBy(slider(0, 0, 1)).midichan(3).midi(OC)
  ._pianoroll()
const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
  .scale("A4:minor").midichan(3).midi(OC)
  ._pianoroll()

const kick=36, snare=38, hat=40, crash=41
const drums = stack(
  note(kick ).struct("x ~ ~ ~ x ~ ~ ~"),
  note(snare).struct("~ ~ ~ ~ x ~ ~ ~"),
).midichan(10).midi(OC)
const drums2 = stack(
  drums,
  note(kick ).struct("~ ~ x ~ ~ ~ x ~"),
  note(hat  ).struct("x x x*2 ~ x*2 x x ~ | x x x*2 ~ x*2 x x*4 ~"),
  note(crash).struct("x ~ ~ ~ ~ ~ ~ ~").slow(8),   // once at the top of the chorus
).midichan(10).midi(OC)

// ---- Movement                       name each shape once, reuse it everywhere

const lfoBass = isaw  .slow(8)
const lfoPad  = sine  .slow(4)
const lfoLead = perlin.slow(4)
const lfoEcho = sine  .slow(16)        // the slowest one — the echo swells across the song
const lfoZoom = sine  .slow(4)         // the one signal the rack never hears — picture only

const modBass = v => ccn(42).ccv(v).midichan(1).midi(WS)
const modPad  = v => ccn(42).ccv(v).midichan(2).midi(WS)
const modLead = v => ccn(42).ccv(v).midichan(3).midi(OC)
const modEcho = v => ccn(42).ccv(v).midichan(10).midi(OC)

const mods = stack(
  modBass(lfoBass.range(1,0).segment(32)),   // ZLPF's cutoff closes across each phrase
  modPad (lfoPad .range(0,1).segment(32)),   // Plaits' timbre moves
  modLead(lfoLead.range(1,0).segment(32)),   // Ogham's formula param wanders
  modEcho(lfoEcho.range(0,1).segment(16)),   // the echo feedback swells
)

// ---- Sections

const intro  = stack(pad, mods)
const verse  = stack(drums, bass, pad, mods)
const chorus = stack(drums2, bass, pad, lead, mods)
const bridge = stack(drums, pad, lead2, mods)
const outro  = stack(bass, pad, mods)

$: arrange(                            // $: names the pattern, so the picture can follow it
  [4, intro],
  [8, verse],
  [8, chorus],
  [4, bridge],
  [8, chorus],
  [4, outro],
).cpm(30)

// ---- Picture                        the same LFOs, now driving Hydra

osc(18, 0.08, 0.6)
  .color(H(lfoPad), 0.25, H(lfoLead))
  .rotate(H(lfoBass.range(0, 6.28)))          // the bass sweep spins the frame
  .kaleid(H(lfoLead.range(3, 7)))             // the wandering one opens the kaleidoscope
  .modulate(noise(3), H(lfoEcho.range(0.1, 0.6)))  // the echo's swell warps the image
  .scale(H(lfoZoom.range(1, 1.4)))            // a steady zoom pulse
  .out()

// ---- Try this
//
// * Drag the `slider` in `lead` from 0 up to 1 while it plays — the melody thins out.
// * Swap `sine` for `perlin` in `lfoEcho` and the echo drifts instead of swelling.
// * Move a line in `arrange()` with Opt+↑/↓ to reorder the song.
// * Swap Joy from ZLPF to ZHPF. Same notes, same CV, and the bass becomes a hi-hat.
// * Turn Ogham's B knob while the A sweep runs. Nothing in the code moves and the lead
//   still changes character — that is the half of the module the sequencer never touches.
// * Comment out `modBass(...)` (Cmd+/) and the filter stops moving — and the frame stops
//   spinning, because the picture is reading the very same signal.
