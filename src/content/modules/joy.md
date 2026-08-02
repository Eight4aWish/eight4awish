---
title: Joy
date: 2026-07-05
summary: >-
  A Mutable Instruments Braids based oscillator for the Daisy Patch.Init - with
  a screen added to facilitate patch selection.
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
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy-v1.3.0/joy.bin
firmwareVersion: v1.3.0
extraBinaries:
  - label: Joy Lite
    url: >-
      https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy_lite-v1.3.0/joy_lite.bin
    version: v1.3.0
flashWith: daisy-qspi
draft: false
---
**Joy** is an oscillator for the Daisy Patch.Init, with an OLED added so you can see and select the
model and bank. It runs on stock hardware, so the build is the screen, the wiring and the printed
panel — no custom PCB to fabricate.

It's based on **Mutable Instruments Braids** by Émilie Gillet, and named — like everything here —
after the nursery rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by,
Mutable Instruments or Electrosmith.

## The screen

The OLED shows the current model and bank, so you select by name rather than counting clicks.

## Build

The front panel is written in Python (build123d); the same file exports the STL you print.

**Bill of materials:** Daisy Patch.Init · 64×48 SSD1306 OLED (I²C) · a few hook-up wires · the
printed panel. A small breakout PCB tidies the OLED wiring.

## Calibration, on the module

The oscillator is digital, but its V/oct CV input is analog and needs calibrating. Early
versions meant measuring the error, solving for a scale and a centre, editing two constants
and reflashing — fine for me, useless for anybody else. Since **v1.3** the module does it
itself, with no toolchain and no reflash:

1. Hold **B7 while powering up** to enter calibration.
1. The screen reads `CALIBRATE 1V` — patch a **1 V** reference (C1) to V/Oct and press **B7**.
1. It reads `CALIBRATE 3V` — patch **3 V** (C3, two octaves up) and press **B7**.
1. `DONE`. The result is solved, saved to flash and used immediately.

It persists across power cycles, stored alongside your last-used patch. A bad capture —
nothing patched, or the wrong voltage — is rejected and the previous calibration kept, so the
routine can't leave the module mistracking. If you never calibrate, sensible measured
defaults are used.

Worth knowing: although it is digital, the input drifts a few cents as the board warms up, so
calibrate warm and give it a warm-up minute like an analog VCO.

## No screen? Build Joy Lite instead

Joy asks you to wire an OLED to the Daisy's expansion header and give up the B8 toggle to make
panel space for it. That is a fair thing to refuse — so the repo also builds **Joy Lite**, a
screenless version that runs on completely stock hardware. No soldering, nothing removed.

It is the same Braids engine and the same knobs. What changes is how many models you get and
how you move between them.

### Why sixteen models, and these sixteen

Anyone running a Daisy Patch.Init probably already owns Plaits. So Joy Lite skips everything
Plaits already does well — virtual analog, FM, additive, wavetables, speech, noise, physical
models, drums — and ships the sounds that are distinctively *Braids* instead. Two banks of
eight, chosen on the toggle Joy had to sacrifice:

- **Bank A** — CSAW · Saw-Sync · Ring-Mod · VOSIM · Digi-Filter BP · Chaotic-FM · QPSK · TOY
- **Bank B** — Square-Sync · Buzz · Saw-Comb · Digi-Filter LP · Digi-Filter HP · Clocked-Noise ·
  Twin-Peaks · ????

### Finding your way without a screen

The panel tells you where you are. **B8** flips between banks, and each bank remembers the model
you left it on. A **short press of B7** steps to the next model, wrapping 1 → 8, and the **LED
blinks the model number** back at you. Hold B7 to re-blink the current number if you lose your
place.

Joy Lite is flashed exactly like Joy — same SD-card route, so the steps below apply to both.
The only difference is which file you copy to the card: use the **Download Joy Lite** button
above to get `joy_lite.bin` instead of `joy.bin`.
