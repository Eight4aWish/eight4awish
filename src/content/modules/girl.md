---
title: Girl
date: 2026-05-24
summary: >-
  A Mutable Instruments Elements based modal synthesis voice for the Ksoloti Big
  Genes hardware.
platform: Ksoloti
tags:
  - resonator
  - Ksoloti
panel: /renders/ksoloti_elements_flat.png
photo: /images/elements.jpeg
photoCaption: Girl running on the Ksoloti Big Genes.
status: built
firmware: https://github.com/Eight4aWish/eurorack_modules
binary: >-
  https://github.com/Eight4aWish/eurorack_modules/releases/download/girl-v1.0.1/girl.bin
firmwareVersion: v1.0.1
flashWith: ksoloti
draft: false
---
**Girl** is a modal-synthesis voice — a physical-modelling resonator — running on **Ksoloti Big
Genes** hardware. It's based on **Mutable Instruments Elements** by Émilie Gillet, and named, like
everything here, after the nursery rhyme: *three for a girl*. Not affiliated with, or
endorsed by, Mutable Instruments.

## Running Elements on Ksoloti

Elements is one of the most demanding things Mutable made — its resonator can pin a processor on its
own. To keep it solid on the Ksoloti, the settings are deliberately **conservative** next to the
original: a few of Elements' parameters are dialled back from stock so the CPU keeps some headroom
and the voice never overruns, glitches or drops out. It trades a little of the original's ceiling for
a build that simply runs.

## It's firmware, not a Patcher patch

This is the part that surprises Ksoloti users: Girl is **not** loaded through the Ksoloti Patcher as
a live patch. It's flashed as **firmware** — you upload the `.bin` to the board — so it boots
straight into the voice with nothing to open, compile or run in the Patcher. Flashing steps are
below.
