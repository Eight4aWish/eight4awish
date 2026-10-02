---
title: Mirth
date: 2026-10-01
summary: >-
  Neural amp captures on a Daisy patch.Init() — and nine not-amps, real
  captures bent inside the network.
platform: Patch Submodule
tags:
  - Effect
  - Neural
  - Daisy Patch Init
# TO MAKE: render from build123d's patch_init_oled template, as Joy's was.
panel: /renders/daisy_neural_flat.png
status: in progress
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_neural
# At release, Joy-style: one release per binary, both sharing a version.
# binary: https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/mirth-v1.0.0/mirth-v1.0.0.bin
# firmwareVersion: v1.0.0
# extraBinaries:
#   - label: Mirth Lite
#     url: https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/mirth_lite-v1.0.0/mirth_lite-v1.0.0.bin
#     version: v1.0.0
flash:
  intro: >-
    Mirth runs from the Daisy's QSPI chip through the Daisy bootloader: a one-time
    bootloader install, then the firmware goes on with an SD card. The same card
    then holds the captures. No compiler needed.
  warn: >-
    The card must be one FAT32 partition of 2 GB or less, with the rest of the card
    left unallocated. A full-size FAT32 volume on a big card fails at start-up, and
    exFAT is not read at all.
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
      `diskutil partitionDisk /dev/diskN MBR "MS-DOS FAT32" DAISY 2G "Free Space" REST R`.
    - >-
      Copy the .bin above to the root of the card. It must be the only .bin on
      the card.
    - Copy your `.a2nb` captures to the root as well.
    - >-
      Insert the card and power-cycle. The bootloader flashes the firmware if it
      differs from what is installed, and boots.
  note: >-
    On a Mac, Finder writes a hidden twin of every file — ._mirth.bin, ._0_JCM800.a2nb.
    The .bin twin confuses the bootloader and the capture twins fail their checksum.
    After copying, delete them in Terminal with `rm -f /Volumes/DAISY/._*` — the
    usual `cp -X` no longer prevents them on current macOS.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
    - label: TONE3000 (filter for A2)
      url: https://www.tone3000.com/
draft: true
---
## Overview

**Mirth** runs neural amp captures on a Daisy patch.Init(), with the same OLED Joy
added so you can see which one is playing.

A capture is a small neural network trained to behave like one particular amp. This
one is NAM's A2-Lite: 23 layers, each a dilated causal convolution with a LeakyReLU
activation, joined by residual and skip connections — 1,871 parameters in all. Small
enough for a Eurorack module, and a format TONE3000's library lets you filter for.

That is the first bank, **AMPS**. The second, **NOT-AMPS**, is the reason it exists.

Named — like everything here — after the nursery rhyme, in the version that runs *one
for sorrow, two for mirth*. Not affiliated with, or endorsed by, Neural Amp Modeler,
TONE3000 or Electrosmith.

## The not-amps

Twelve real captures, each changed in one way while it plays, with one control you can
turn or patch. They were chosen by measurement first: every candidate was compared with
236 real amp captures, by audio descriptors and by a neural model of how things sound,
and only those that leave the region where amps sit were kept — then by ear.

| Screen | Built from | What changes | The control |
|---|---|---|---|
| `SINE PLX` · `SINE BUG` | pLEXI-LORE · Bugera G5 | every neuron becomes a sine — a wavefolder inside the network | how hard it folds |
| `LINEAR TR` | Two Rock | every neuron loses its bend, toward a straight line | trained → linear |
| `RECT ORG` | Orange TH100 | every neuron bends the other way, toward a full-wave rectifier | trained → rectified |
| `FB100 F57` | Fender 57 | its output fed back into its input, at 100 Hz | loop gain |
| `FB PCH PLX` | pLEXI-LORE | the same loop, at a fixed gain | the loop's pitch |
| `FRZ E TR` · `FRZ M F57` · `FRZ M KAY` | Two Rock · Fender 57 · Kay 703 | one layer's output held, early or mid-network | how long it holds |
| `FOLD ORG` | Orange TH100 | a wavefolder inside the network | how hard it folds |
| `RATE SVT` | SVT-2 Pro | the network run at a fraction of the sample rate | ÷1, 2, 3, 4, 6 |
| `PAST BLU` | Bluesbreaker | pushed past itself, away from the Bugera | how far past |

Each has its own level correction, so the control changes the sound rather than the
volume.

## Controls

| Control | Job |
|---|---|
| **CV_1** (+ CV_5) | input trim, −20 to +20 dB, unity at noon |
| **CV_2** (+ CV_6) | MIX, dry to wet |
| **CV_3** (+ CV_7) | which capture, within the bank |
| **CV_4** (+ CV_8) | the not-amp's control. Does nothing on a real amp, on purpose |
| **B7** short | bypass: the dry input alone |
| **B7** held 1.5 s | change bank, AMPS ↔ NOT-AMPS |
| **LED** | lit when the network is in circuit |

Audio in on IN_L; the same mixed signal on both outputs.

## Hardware

**Bill of materials:** Daisy patch.Init() · 64×48 SSD1306 OLED (I²C) · a few hook-up
wires · the printed panel. The same screen and wiring as Joy: it goes where the B8
toggle was.

## Getting captures

Download A2 captures from TONE3000 — filter by architecture — and convert them with
`tools/nam_to_a2nb.py`. Straight from download to card: no rebuild, no reflash. Up to
32 on a card.

<!-- TO DECIDE before release: which captures ship. The five used in development are
other people's work under TONE3000's T3K licence (no redistribution without the
author's permission), and NOT-AMPS is built from exactly those
five, by name. -->
