---
title: Wish on Daisy patch.Init()
date: 2026-10-11
summary: >-
  Granular textures for a stock Daisy patch.Init(), based on Mutable
  Instruments Beads.
platform: Patch Submodule
tags:
  - Granular
  - Effect
  - Daisy patch.Init()
panel: /renders/daisy_wish_patch_init_flat.png
status: built
firmware: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_beads_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/wish_patch_init-v1.0.0/wish_patch_init-v1.0.0.bin
extraBinaries: []
firmwareVersion: v1.0.0
flash:
  intro: >-
    Wish runs from the Daisy's SRAM through the Daisy bootloader: a one-time
    bootloader install, then the firmware goes on with an SD card. No compiler
    needed, and no hardware changes — it runs on a stock patch.Init().
  warn: >-
    The card must be one FAT32 partition of 2 GB or less, with the rest of the
    card left unallocated. A full-size FAT32 volume on a big card fails at
    start-up, and exFAT is not read at all.
  stepsTitle: One time per module — install the bootloader
  bootSteps:
    - Plug the Daisy Patch.Init in with a USB-C data cable.
    - Hold BOOT, tap RESET, then release BOOT.
    - Open the Daisy Web Programmer and go to its Bootloader section.
    - Click Flash. That is the bootloader on — you never have to do this again.
  steps:
    - >-
      Format the card: one FAT32 partition of 2 GB or less. On a Mac, check the
      disk number with `diskutil list external` first — this erases it — then
      `diskutil partitionDisk /dev/diskN MBR "MS-DOS FAT32" DAISY 2G "Free
      Space" REST R`.
    - >-
      Copy the .bin above to the root of the card. It must be the only .bin on
      the card.
    - >-
      Insert the card and power-cycle. The bootloader flashes the firmware if it
      differs from what is installed, and boots. The LED stays dark until you
      freeze.
    - Take the card out. Wish doesn't use it.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
  note: >-
    On a Mac, Finder writes a hidden twin of the file — ._wish_patch_init-v1.0.0.bin
    — and it confuses the bootloader. After copying, delete it in Terminal with
    `rm -f /Volumes/DAISY/._*`. Building from source? `make program-dfu` flashes
    over USB during the bootloader's two-second window after a reset.
video: D-5XmIFGvwI
draft: false
---
## Overview

*On a Hermetic Modular Alchemy Lab? Wish started there:
[Wish on Alchemy Lab](/modules/wish/).*

**Wish** is a granular texture synthesiser for a stock Daisy patch.Init(), based on
Mutable Instruments **Beads** — Émilie Gillet's successor to Clouds. Mutable published
the Beads source on 12 October 2026. The DSP here is that code, built exactly as Wish
builds it for the Alchemy Lab. Same chip, same
clock: the Patch Submodule is the same STM32H750 at 480 MHz. What changes is the panel:
four knobs, one button, one toggle and one LED in place of Beads' twelve knobs and four
buttons.

Beads records whatever comes in, and plays it back as grains — short slices, each with
its own pitch, length and envelope. **FREEZE** stops recording and holds the buffer.
Grains come from the internal clock, or from triggers on the SEED jack. In Synth mode,
chosen in SETTINGS, Beads plays grains from its own wavetables instead: FEEDBACK picks
one of twelve banks, and TIME sweeps through it.

Named — like everything here — after the nursery rhyme: *eight for a wish*, the line
the channel takes its name from. Not affiliated with, or endorsed by, Mutable Instruments
or Electrosmith.

## Controls

Four knobs, three layers. The toggle picks **PLAY** or **TONE**; holding **B7** gives
**RANDOM**. The four PLAY knobs are the four with jacks.

| Layer | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
| --- | --- | --- | --- | --- |
| **PLAY** — toggle down | TIME | SIZE | DENSITY | PITCH |
| **TONE** — toggle up | SHAPE | DRY/WET | FEEDBACK | REVERB |
| **RANDOM** — B7 held | TIME random | SIZE random | SHAPE random | PITCH random |

A knob takes a parameter over only once it reaches the parameter's value, so changing
layer never makes anything jump.

| Knob | Job |
| --- | --- |
| **TIME** | where in the buffer grains start; plus CV on CV_6 |
| **SIZE** | grain length: shortest at about half past ten; clockwise of that grains play forwards and grow to four seconds, anticlockwise they play backwards and grow too; plus CV on CV_7 |
| **DENSITY** | noon is no grains; anticlockwise regular, clockwise random; plus CV on CV_8 |
| **PITCH** | grain pitch, snapping through 0, 1, 3, 4, 7, 12 and 24 semitones; plus V/oct on CV_5 |
| **SHAPE** | grain envelope |
| **DRY/WET** | the mix |
| **FEEDBACK** | how much of the output goes back into the buffer |
| **REVERB** | reverb amount |
| **randomisers** | noon none; clockwise, every grain gets the same degree of randomness, set by the knob; anticlockwise the degree is itself random, so some grains stay put and others land anywhere. In delay mode, a smooth random wander |

| Button | Job |
| --- | --- |
| **B7 tap** | **FREEZE**, on and off. The LED is lit while frozen |
| **B7 held** | the RANDOM layer, while held |
| **B7 held 2 s** | turning nothing: SETTINGS. The LED breathes; tap B7 to leave |
| **B7 at power-on** | V/oct calibration |

| Jack | Job |
| --- | --- |
| **CV_5** | V/oct |
| **CV_6** | TIME CV |
| **CV_7** | SIZE CV |
| **CV_8** | DENSITY CV |
| **Gate in 1** | SEED: triggers start grains |
| **Gate in 2** | FREEZE, while high |
| **Gate out 1** | Beads' grain gates, when turned on in SETTINGS |
| **In L / In R** | audio in. In R follows In L when unpatched |
| **Out L / Out R** | audio out |

The LED is lit while frozen, and flashes on each trigger at gate in 1.

## Settings

Hold B7 for two seconds without turning a knob. A knob changes its setting only once it
is turned, and the LED blinks the new value's number.

| Knob | Setting | Anticlockwise to clockwise |
| --- | --- | --- |
| **Knob 1** | Quality | 1 digital · 2 vintage digital · 3 clean tape · 4 dirty tape |
| **Knob 2** | Input | 1 mono (In L, twice the buffer) · 2 stereo · 3 synth (no input: Beads' wavetables) |
| **Knob 3** | Gate out | 1 off · 2 on: grain gates on gate out 1, and Beads' mono mix on both audio outs |

A new quality or input waits while frozen, as on Beads. The settings, the knobs of the
two layers not under the hand, and the calibration are saved, and come back at power-on.

## Making a capture to play

1. Patch a sound into **In L** and play the phrase you want.
2. **Tap B7** at the moment you want to keep it. The buffer now holds the audio just
   before the tap.
3. Play it as a texture: DENSITY clockwise of noon for a cloud, TIME to choose where
   in the capture, SIZE for grain length, PITCH to transpose.
4. Or play it from a sequencer: gates into **gate in 1**, pitch into **CV_5**. Each
   trigger plays one grain at that pitch. DENSITY fully clockwise plays every trigger,
   noon none, and anticlockwise divides them.

Turn DRY/WET fully clockwise to hear only the capture, and tap B7 again to record a new
one.

## Delay mode

Turn SIZE fully clockwise and Beads stops making grains and becomes a delay. Clocked
from triggers on gate in 1, it follows their tempo, and DENSITY picks the division. SIZE
random (hold B7, knob 2) becomes the delay's filter: anticlockwise low-pass, clockwise
high-pass, noon none.

## Calibration

Hold B7 through power-on. LED solid: patch 1 V into CV_5 and press B7. LED blinking:
patch 3 V and press. A flurry means done. Until then it uses a sensible default.

## Differences from Beads

- **Twelve knobs become four on three layers**, and four buttons become one.
- **There is no SEED button.** The internal clock runs, and DENSITY sets it. Triggers
  on gate in 1 take over, as on Beads, and the internal clock comes back a few seconds
  after they stop.
- **The input mode is a setting.** Beads hears whether a cable is in its inputs; the
  patch.Init() cannot.
- **CV is always added at full depth**, so the randomisers stay randomisers whether a
  jack is patched or not. What is lost is Beads' patched-and-anticlockwise case, where
  CV sets the amount of randomness.
- **The grain gates have their own jack**, so they no longer take audio R. As on Beads,
  the audio is mono while the gate output is on.
- **No SHAPE CV and no ASSIGN jack**, and input gain is automatic only.
- **Dirty tape runs at 48 kHz.** Beads slows its codec to 24 kHz for it; the Daisy's
  audio library has no 24 kHz setting, so it takes the 48 kHz path Beads also has.
- **The heaviest settings thin themselves.** Digital stereo with dense grains and random
  pitch asks for more than the chip has, so past that point fewer new grains start, and
  the module stays responsive.
- **A frozen buffer is not kept** through a power cycle.

## Provenance

The DSP is **Mutable Instruments Beads** by Émilie Gillet, MIT-licensed, from
[pichenettes/eurorack](https://github.com/pichenettes/eurorack). Built on Electrosmith's
libDaisy. Wish on Daisy patch.Init() itself is MIT. Thanks to Émilie for opening the code up.
