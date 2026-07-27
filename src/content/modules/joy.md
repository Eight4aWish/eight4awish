---
title: Joy
date: 2026-07-05
summary: >-
  A Mutable Instruments Braids based oscillator for the Daisy Patch.Init - with
  a screen added to facilitate patch selection.
platform: Patch.Init
tags:
  - oscillator
  - Daisy Patch Init
panel: /renders/daisy_braids_flat.png
photo: /images/daisypibraids.jpeg
photoCaption: The Joy build, with the OLED fitted for patch selection.
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/joy-v1.1.0/joy.bin
firmwareVersion: v1.1.0
flashWith: daisy-qspi
draft: false
---
**Joy** is an oscillator for the Daisy Patch.Init, with an OLED added so you can see and select the
model and bank. It runs on stock hardware, so the build is the screen, the wiring and the printed
panel — no custom PCB to fabricate.

It's based on **Mutable Instruments Braids** by Émilie Gillet, and named — like everything here —
after the magpie counting rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by,
Mutable Instruments or Electrosmith.

## The screen

The OLED shows the current model and bank, so you select by name rather than counting clicks.

## Build

The front panel is written in Python (build123d); the same file exports the STL you print.

**Bill of materials:** Daisy Patch.Init · 64×48 SSD1306 OLED (I²C) · a few hook-up wires · the
printed panel. A small breakout PCB tidies the OLED wiring.

## Bring-up and tuning

The oscillator is digital, but its V/oct CV input is analog and needs calibrating. Instead of a
boot-time routine, you can measure the error and set two constants in the firmware:

1. Play a C at several octaves from a calibrated source and note the cents error at each.
1. The error is a straight line — an offset plus a slope.
1. Solve for a scale and a centre, reflash, and every C lands within about a cent.

Worth knowing: although it is digital, the input drifts a few cents as the board warms up, so
calibrate warm and give it a warm-up minute like an analog VCO.
