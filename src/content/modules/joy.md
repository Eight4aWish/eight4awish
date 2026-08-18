---
title: Joy
date: 2026-07-05
summary: >-
  A Mutable Instruments Braids based oscillator for the Daisy patch.Init() -
  with a screen added to facilitate patch selection.
platform: Patch Submodule
tags:
  - Oscillator
  - Daisy Patch Init
panel: /renders/daisy_braids_flat.png
photo: /images/daisypibraids.jpeg
photoCaption: The Joy build, with the OLED fitted for patch selection.
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy-v1.4.0/joy.bin
extraBinaries:
  - label: Joy Lite
    url: >-
      https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy_lite-v1.4.0/joy_lite.bin
    version: v1.4.0
firmwareVersion: v1.4.0
flashWith: daisy-qspi
flash:
  bootSteps: []
  steps: []
  note: >-
    On a Mac, copying to the card also writes a hidden twin of your file — ._joy.bin. That
    also ends in .bin, and it confuses the bootloader’s scanner, so it has to go. Either
    press Cmd-Shift-. (period) in Finder to reveal hidden files and drag ._joy.bin to the
    Trash, or if you are happy in Terminal run dot_clean /Volumes/YOURCARD, which clears them
    in one go. Windows and Linux are unaffected.
video: qR6oma1cY7w
draft: false
---
## **Overview**

**Joy** is an oscillator for the Daisy patch.Init(), with an OLED added so you can see and select the model and bank. It runs on stock hardware, so the build is the screen, the wiring and the printed panel — no custom PCB to fabricate.

It's based on **Mutable Instruments Braids** by Émilie Gillet, and named — like everything here —
after the nursery rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by,
Mutable Instruments or Electrosmith.

## Hardware

**Bill of materials:** Daisy patch.Init() · 64×48 SSD1306 OLED (I²C) · a few hook-up wires · the printed panel. The OLED shows the current model and bank, so you select by name rather than counting clicks.

The front panel is written in Python (build123d); the same file exports the STL you print.

### Calibration, on the module

The oscillator is digital, but its V/oct CV input is analog and needs calibrating.

1. Hold **B7 while powering up** to enter calibration.
1. The screen reads `CALIBRATE 1V` — patch a **1 V** reference (C1) to V/Oct and press **B7**.
1. It reads `CALIBRATE 3V` — patch **3 V** (C3, two octaves up) and press **B7**.
1. `DONE`. The result is solved, saved to flash and used immediately.

It persists across power cycles, stored alongside your last-used patch. A bad capture — nothing patched, or the wrong voltage — is rejected and the previous calibration kept, so the routine can't leave the module mistracking. If you never calibrate, sensible measured defaults are used.

### Patching tips

**Leave GATE unpatched and Joy drones.** The internal AD envelope only closes the VCA when something is patched, so with nothing plugged in the oscillator runs continuously — which is what you want when you are auditioning models or using Joy as a drone voice.

**CV\_8 is an FM input.** There is no onboard attenuverter but presumably all racks will have the means to tweak signal depth so the input signal lands at the depth Braids gives it with the it's attenuverter fully clockwise — about ±30 semitones across ±5V, so roughly 6 semitones per volt. It is deliberately *not* 1V/oct: this is a depth control, not a second pitch input, so it takes the raw CV rather than the calibrated V/Oct path. Like Braids, it is applied once per render block, so it is control-rate FM.

## Joy Lite — screenless variant

Joy Lite is a subset of the Braids models which can be flashed and used on a regular, unmodified Daisy Patch Init. It is the same Braids engine and the same knobs. What changes is how many models you get and how you move between them.

### Why sixteen models, and these sixteen

Anyone running a Daisy patch.Init() possibly already owns Plaits. So Joy Lite skips everything Plaits already does well — virtual analog, FM, additive, wavetables, speech, noise, physical models, drums — and ships the sounds that are distinctively *Braids* instead. Two banks of
eight, chosen on the toggle Joy had to sacrifice:

- **Bank A** — CSAW · Saw-Sync · Ring-Mod · VOSIM · Digi-Filter BP · Chaotic-FM · QPSK · TOY
- **Bank B** — Square-Sync · Buzz · Saw-Comb · Digi-Filter LP · Digi-Filter HP · Clocked-Noise ·
  Twin-Peaks · ????

### Finding your way without a screen

The panel tells you where you are. **B8** flips between banks, and each bank remembers the model
you left it on. A **short press of B7** steps to the next model, wrapping 1 → 8, and the **LED**
**blinks the model number** back at you. Hold B7 to re-blink the current number if you lose your
place.

Joy Lite is flashed exactly like Joy — same SD-card route, so the steps below apply to both.
The only difference is which file you copy to the card: use the **Download Joy Lite** button
above to get `joy_lite.bin` instead of `joy.bin`.
