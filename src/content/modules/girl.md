---
title: Girl
date: 2026-05-24
summary: >-
  A Mutable Instruments Elements based modal synthesis voice for the Ksoloti Big
  Genes hardware.
platform: Ksoloti
tags:
  - Resonator
  - Ksoloti
panel: /renders/ksoloti_biggenes_flat.png
photo: /images/elements.jpeg
photoCaption: Girl running on the Ksoloti Big Genes.
status: built
firmware: https://github.com/Eight4aWish/eurorack_modules
binary: >-
  https://github.com/Eight4aWish/eurorack_modules/releases/download/girl-v1.2.3/girl.bin
extraBinaries: []
firmwareVersion: v1.2.3
flash:
  intro: >-
    You need the .bin above and one free tool — dfu-util. No coding, no Patcher,
    no build environment.
  warn: >-
    This is firmware, not a patch. If you have used a Ksoloti before you will
    expect a script you open in the Patcher and upload — this is not that.
    Instead it replaces the Ksoloti firmware entirely and boots straight into
    Girl, so the Patcher is not involved at any point. You can put the stock
    firmware back whenever you like (see below).
  bootSteps: []
  steps:
    - Download girl.bin above.
    - >-
      Install dfu-util — on a Mac: brew install dfu-util. (Windows:
      dfu-util.sourceforge.net, add it to PATH. Linux: sudo apt install
      dfu-util.)
    - >-
      Put the Big Genes in DFU mode: unplug the USB-C cable from the prog
      socket, hold the E1/S1 encoder button in (push the left encoder shaft),
      plug USB-C back into prog while still holding, then release.
    - >-
      The screen and LEDs will stay off — that is normal, it means you are in
      DFU mode. Your computer should now see a DFU device.
    - Run the command below in a terminal, from wherever girl.bin is.
    - >-
      When it says “File downloaded successfully” the module restarts into Girl.
      The top line of the OLED should read “S1:Mod”.
  command: dfu-util -d 0483:df11 -a 0 -s 0x08000000:leave -D girl.bin
  links: []
  note: >-
    Nothing here is one-way. To go back to a stock Ksoloti, flash the original
    firmware. The easiest way to do this is using the Ksoloti desktop app. Put
    the board back into DFU mode, then choose "Board - Firmware - Flash
    (Rescue)" from the menu.
draft: false
---
## Overview

**Girl** is a modal-synthesis voice — a physical-modelling resonator — running on **Ksoloti Big**
**Genes** hardware. It's based on **Mutable Instruments Elements** by Émilie Gillet, and named, like
everything here, after the nursery rhyme: *three for a girl*. Not affiliated with, or
endorsed by, Mutable Instruments.

## Running Elements on Ksoloti

Elements is one of the most demanding things Mutable made — its resonator can pin a processor on its own. It is a bank of tuned filters, and how many of them you run is the single biggest thing you can spend CPU on. Mutable run **52**. Girl runs **40** - a number derived by experiment. 52 and 48 dropped out on this board; 44 ran clean, and 40 is 44 with margin. We trade a little of the original's ceiling for a build that simply runs on the hardware.

## Signal flow, and where the controls sit

Three Exciters — bow, blow and strike — are summed and fed into the Resonator, then into Space. Each exciter owns one pot, with **S4** used to cycle between: level, meta, and timbre, the order Elements uses across its own panel. Space is one knob doing three jobs as you turn it up: dry bleed, then stereo spread, then reverb.

![Elements signal path: bow, blow and strike summed into the resonator, then Space, with
the Girl pot that drives each parameter](/images/girl-signal-flow.webp)

Everything the diagram doesn't cover:

| Control |  |
|---|---|
| Gate | CV-D — voltage also sets strength |
| Pitch | CV-X — 1V/oct, centred on middle C |
| Model | S1 — modal, string, chords |
| Play | S3 — manual gate, no patching needed |
| Resonator CV | P1–P4, summed with the pots |
| Assignable CV | A, B, C — S2 selects, E2 assigns |
| FM | CV-Y — ±49.5 semitones; attenuate at the source |

Pin map, CV targets and full behaviour are in the
[repo docs](https://github.com/Eight4aWish/eurorack_modules/blob/main/docs/KSOLOTI_ELEMENTS.md).

## It's firmware, not a Patcher patch

Girl is **not** loaded through the Ksoloti Patcher as a live patch. It's flashed as **firmware** — you upload the `.bin` to the board — so it boots straight into the voice with nothing to open, compile or run in the Patcher. Flashing steps are below.
