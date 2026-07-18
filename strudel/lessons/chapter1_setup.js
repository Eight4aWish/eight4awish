// ============================================================
// CHAPTER 1 — Setup
// Eight4aWish: live-coding eurorack with Strudel. See ../COURSE.md
//
// Goal: prove the whole chain works — Strudel sends MIDI, your modules make sound.
// You'll play a two-part beat across BOTH boxes: a kick from the O&C and a snare
// from the Workshop, so both MIDI links are proven before Chapter 2 adds to it.
//
// HOW TO RUN: paste into the strudel.cc REPL in Chrome. Two MIDI outs connected —
// check the JS console for their names: 'Phazerville' (O&C) and
// 'Workshop System MIDI' (Workshop Computer).
//
// KEYS: Ctrl+Enter = play/update, Ctrl+. = stop  (Ctrl on Mac too — not Cmd).
// ============================================================

// A drum is a named note + a STEP GRID: x = hit, ~ = rest, space = next step.
const kick=36, snare=38   // note numbers (the only place raw numbers appear)

// note() sends the note, .struct() is the rhythm, .midichan() the MIDI channel,
// .midi() picks the device by name, and .cpm() sets the tempo for everything.
stack(
  // kick -> the O&C's drum channel (ch10)
  note(kick ).struct("x ~ ~ ~ x ~ ~ ~").midichan(10).midi('Phazerville'),
  // snare -> the Workshop's voice 1 (ch1); patch that voice's GATE to a snare module.
  // A "voice" is just a gate — aim it at a drum now, or a VCO for melody later.
  note(snare).struct("~ ~ ~ ~ x ~ ~ ~").midichan(1).midi('Workshop System MIDI'),
).cpm(30)   // 30 cycles/min; 8 steps/cycle ~= 120 bpm

// ------------------------------------------------------------
// TRY THIS — change a number and press play again:
//   - busier kick:    note(kick).struct("x ~ x ~ x ~ x ~")
//   - move the snare: note(snare).struct("~ ~ x ~ ~ ~ x ~")
//   - change tempo:   .cpm(24) slower, .cpm(36) faster
//
// If a drum is silent: check its device name shows in the JS console, and that the
// module's trigger/gate input is patched. (Full rig setup is in ../COURSE.md.)
// ------------------------------------------------------------
