---
title: Joy Lite
date: 2026-08-01
summary: >-
  A screenless Braids oscillator for the Daisy Patch.Init — sixteen models Plaits
  doesn't cover, on completely stock hardware.
platform: Patch Submodule
tags:
  - Oscillator
  - Daisy Patch Init
panel: /renders/daisy_braids_flat.png
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy_lite-v1.3.0/joy_lite.bin
firmwareVersion: v1.3.0
flashWith: daisy-qspi
draft: true
---
**Joy Lite** is the screenless sibling of **[Joy](/modules/joy/)**. Joy asks you to wire an OLED
to the Daisy's expansion header and give up the B8 toggle to make panel space for it. That is a
fair thing to refuse — so this build runs on completely stock hardware, with no soldering and
nothing removed.

It's based on **Mutable Instruments Braids** by Émilie Gillet, and named after the nursery
rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by, Mutable Instruments
or Electrosmith.

## Why sixteen models, and these sixteen

Anyone running a Daisy Patch.Init probably already owns Plaits. So Joy Lite skips everything
Plaits already does well — virtual analog, FM, additive, wavetables, speech, noise, physical
models, drums — and ships the sounds that are distinctively *Braids* instead.

Two banks of eight, selected with the toggle:

- **Bank A** — CSAW · Saw-Sync · Ring-Mod · VOSIM · Digi-Filter BP · Chaotic-FM · QPSK · TOY
- **Bank B** — Square-Sync · Buzz · Saw-Comb · Digi-Filter LP · Digi-Filter HP · Clocked-Noise ·
  Twin-Peaks · ????

## Finding your way without a screen

The panel tells you where you are. **B8** flips between banks, and each bank remembers the
model you left it on. A **short press of B7** steps to the next model, wrapping 1 → 8, and the
**LED blinks the model number** back at you. Hold B7 to re-blink the current number if you have
lost your place.

Knobs are as Joy: Timbre, Color, Attack, Decay — with V/Oct, Timbre and Color CV, a gate for
the envelope and a second gate for hard sync.
