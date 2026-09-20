// LESSON 3 — Visual
// The generative song, plus a Hydra picture driven by the very same signals.
// Paste into strudel.cc in Chrome. MIDI out only — the sound is the rack.
//
//   ch1  Workshop voice 1  → Joy      the bass      CC42 → its filter cutoff
//   ch2  Workshop voice 2  → Plaits   the pad       CC42 → its timbre
//   ch3  O&C quadrant NW   → Ogham    the lead      CC42 → its timbre
//   ch10 O&C quadrants SW/SE → Beatsi  kick 36, snare 38, hat 40, crash 41
//
// Three voices that need no help: each carries its own envelope, so nothing here wants
// an external VCA — which is why the bass line below can use rests.

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
//   still changes character — B is the one parameter the sequence never reaches for.
// * Comment out `modBass(...)` (Cmd+/) and the filter stops moving — and the frame stops
//   spinning, because the picture is reading the very same signal.
