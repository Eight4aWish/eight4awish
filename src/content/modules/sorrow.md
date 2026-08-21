---
title: Sorrow
date: 2026-06-28
summary: >-
  A Mutable Instruments Grids based drum machine for the Daisy patch.Init() —
  with its own drum voices, a pool of models to roll between, and three
  pattern banks.
platform: Patch Submodule
tags:
  - Drums
  - Daisy Patch Init
panel: /renders/daisy_grids_flat.png
photo: /images/daisypigrids.jpeg
photoCaption: Sorrow in the rack.
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/sorrow-v2.0.0/sorrow-v2.0.0.bin
extraBinaries: []
firmwareVersion: v2.0.0
flash:
  intro: >-
    Version 2 runs from SRAM via the Daisy bootloader rather than internal flash,
    because the drum models no longer fit in 128 KB. That means a one-time
    bootloader install, then the firmware goes on with an SD card. Still no
    compiler needed. If you flashed v1 the old way, the bootloader step is new —
    the v2 binary will not run without it.
  stepsTitle: One time per module — install the bootloader
  bootSteps:
    - Plug the Daisy Patch.Init in with a USB-C data cable.
    - Hold BOOT, tap RESET, then release BOOT.
    - Open the Daisy Web Programmer and go to its Bootloader section.
    - >-
      Click Flash. That is the bootloader on — you never have to do this again.
  steps:
    - Download the .bin above.
    - >-
      Copy it to the root of a FAT32 SD card. It must be the only .bin file on
      the card — the bootloader flashes the first one it finds.
    - Insert the card and power-cycle the module.
    - >-
      The bootloader compares the file with what is already in QSPI, flashes it
      if it differs, and boots. Two slow LED blinks means the firmware started.
  note: >-
    Needs Chrome or Edge for the bootloader step — it uses WebUSB, which Safari
    and Firefox do not support. The card must be FAT32, not exFAT.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
draft: false
---
## **Overview**

**Sorrow** is a drum machine for the Daisy patch.Init(). It has its own drum voices, so it works as
a self-contained beatbox with nothing else patched — and it drives external modules at the same
time, rather than instead. It's based on **Mutable Instruments Grids** by Émilie Gillet, and named,
like everything here, after the nursery rhyme: *one for sorrow, two for joy*. Not affiliated with,
or endorsed by, Mutable Instruments or Electrosmith.

## Rolling a kit

Sorrow is a dice machine. **Flip the B8 toggle out and back and you get a new kit** — that gesture
is the instrument, and it's the main way you change the sound.

Each of the three slots is filled from a pool of ten DaisySP models rather than one fixed voice:
Émilie's synthetic and 808-lineage drum models, the metallic hi-hats, and physical-modelling voices
for something stranger. **Wildness** is the single control over how far a roll may go — which models
are eligible, how far their parameters roam, and whether the three slots agree on a family or clash.
Low, and you get a coherent kit from tame ranges. High, and an analog kick can sit under a modal
snare and a ring-mod hat.

There's no per-drum editing. That was tried and removed: rolling the dice was always more rewarding
than dialling in a sound.

## Three pattern banks

Grids is a lookup table, not an algorithm — 25 hand-authored patterns, and X/Y interpolates between
four of them at a time. All the musicality is in about 2.4 KB of data, which means a different bank
is a different instrument for no extra processing at all.

**Hold B7** to cycle banks. The module says which one it's switched to.

- **Original** — Émilie's Grids map, derived from electronic music
- **Club** — derived here from the Lakh MIDI Dataset, selected by *rhythmic signature* rather than by
  genre: four-to-the-floor with offbeat hats, breakbeats and half-time patterns, whoever happened to
  play them
- **Traditional** — derived from the Groove MIDI Dataset: human drummers, rock through jazz

Both derived banks come from a 5×5 self-organising map over tens of thousands of two-bar patterns,
so neighbouring points on the map are musically related and X/Y morphs rather than jumps. The
[tooling is in the repo](https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_grids/tools/groove_nodes),
so you can point it at your own MIDI library and derive a bank of your own genres.

## Controls

**Home page** — X and Y move around the pattern map, master density decides how much plays, and
chaos perturbs the groove. CV inputs modulate all four. The LED marks the bar so you can see where
you are.

**Kit page** (short press B7) — density trim per drum, and wildness. The sequencer keeps running
while you set them.

**Clock** — feed it anything. Sorrow measures the incoming pulse and works out whether you're
sending 24, 8, 4, 2 or 1 ppqn, so it locks to a MIDI clock divider, a Pam's output or a quarter-note
trigger without being told which. Unpatched it runs at 120 BPM. Reset on the second gate input.

**Outputs** — the internal kit plays the audio outs while kick, snare and hat triggers fire from the
gate outputs and CV out, from the same pattern, all the time.
