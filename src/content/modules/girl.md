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
  https://github.com/Eight4aWish/eurorack_modules/releases/download/girl-v1.2.0/girl.bin
extraBinaries: []
firmwareVersion: v1.2.0
flashWith: ksoloti
draft: false
---
## Overview

**Girl** is a modal-synthesis voice — a physical-modelling resonator — running on **Ksoloti Big**
**Genes** hardware. It's based on **Mutable Instruments Elements** by Émilie Gillet, and named, like
everything here, after the nursery rhyme: *three for a girl*. Not affiliated with, or
endorsed by, Mutable Instruments.

## Running Elements on Ksoloti

Elements is one of the most demanding things Mutable made — its resonator can pin a processor on its own. It is a bank of tuned filters, and how many of them you run is the single biggest thing you can spend CPU on. Mutable run **52**. Girl runs **44** - a number derived by experiment. We trade a little of the original's ceiling for a build that simply runs on the hardware.

## Signal flow, and where the controls sit

Three Exciters — bow, blow and strike — are summed and fed into the Resonator, then into Space. Each exciter owns one pot, with **S4** used to cycle between: level, meta, and timbre, the order Elements uses across its own panel. Space is one knob doing three jobs as you turn it up: dry bleed, then stereo spread, then reverb.

![Elements signal path: bow, blow and strike summed into the resonator, then Space, with
the Girl pot that drives each parameter](/images/girl-signal-flow.webp)

Everything the diagram doesn't cover:

- **CV-X** — V/oct pitch, centred on middle C, trimmable on the board.
- **CV-Y** — pitch modulation, bipolar, and zero when nothing is patched. Worth being
  precise about the depth: it adds at most **±1 semitone**, applied once per block, so it
  is vibrato and fine detune rather than FM in the timbral sense. CV-X, by contrast, spans
  ±30 semitones.
- **CV-D** — gate and strength together: above 0.2 V it opens, and the voltage itself sets
  how hard the note is struck.
- **CV P1–P4** — summed with the pots in hardware, so each one adds straight into geometry,
  brightness, damping and position. No assignment needed, and no separate ADC.
- **CV-A, CV-B, CV-C** — the assignable three, ±0.5 around whatever the pot is set to.
  **S2** steps which slot you are editing, **E2** chooses what it drives. Eleven targets,
  including five with no knob of their own: signature, modulation frequency and offset,
  and the two reverb controls. Defaults are Flow on A and Mallet on B.
- **S1** — cycles the resonator model: modal, then string, then chords.
- **S3** — play. A manual gate at fixed strength, so you can hear the voice without
  patching anything. CV-D takes over when it is patched.

## It's firmware, not a Patcher patch

Girl is **not** loaded through the Ksoloti Patcher as a live patch. It's flashed as **firmware** — you upload the `.bin` to the board — so it boots straight into the voice with nothing to open, compile or run in the Patcher. Flashing steps are below.
