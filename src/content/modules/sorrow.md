---
title: Sorrow
date: 2026-06-28
summary: >-
  A Mutable Instruments Grids based drum machine for the Daisy patch.Init() —
  with its own drum voices, a pool of models to roll between, and three pattern
  banks.
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
    Sorrow runs from SRAM via the Daisy bootloader, so there is a one-time
    bootloader install and then the firmware goes on with an SD card. No
    compiler needed.
  stepsTitle: One time per module — install the bootloader
  bootSteps:
    - Plug the Daisy Patch.Init in with a USB-C data cable.
    - Hold BOOT, tap RESET, then release BOOT.
    - Open the Daisy Web Programmer and go to its Bootloader section.
    - Click Flash. That is the bootloader on — you never have to do this again.
  steps:
    - Download the .bin above.
    - >-
      Copy it to the root of a FAT32 SD card. It must be the only .bin file on
      the card — the bootloader flashes the first one it finds.
    - Insert the card and power-cycle the module.
    - >-
      The bootloader compares the file with what is already in QSPI, flashes it
      if it differs, and boots. Two slow LED blinks means the firmware started.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
  note: >-
    Needs Chrome or Edge for the bootloader step — it uses WebUSB, which Safari
    and Firefox do not support. The card must be FAT32, not exFAT.
draft: false
---
## **Overview**

**Sorrow** is a drum machine for the Daisy patch.Init(). It's based on **Mutable Instruments Grids** by Émilie Gillet, and named, like everything here, after the nursery rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by, Mutable Instruments or Electrosmith. Unlike Grids it has its own drum voices — lots of them, covering different styles — so it works as a self-contained beatbox with nothing else patched. It can also drive external modules, or both at once.

## Rolling a kit

Sorrow is a randomised drum machine. **Flip the B8 toggle down and up and you get a new kit** — that gesture is the instrument, and it's the main way you change the sound.

Each of the three slots is filled from a pool of ten DaisySP models rather than one fixed voice: based on Mutable's synthetic and 808-lineage drum models, the metallic hi-hats, and physical-modelling voices for something stranger. **Wildness** is the single control over how far the randomiser may go — which models are eligible, how far their parameters roam, and whether the three slots agree on a family or clash. Low, and you get a coherent, safe kit from tame ranges. High, and an analog kick can sit under a modal snare and a ring-mod hat.

Don't like the kit — randomise.

## Three pattern banks

Grids is a morphing lookup table — 25 hand-authored patterns, where X/Y controls interpolate between four of them at a time. All the musicality is in about 2.4 KB of data. The Grids classics are here but fresh banks have been added for extra variation. **Hold B7** to cycle banks. The module — synthetic Dan — lets you know which has been selected.

- **Original** — Émilie's Grids map, derived from electronic music
- **Club** — derived here from the Lakh MIDI Dataset, selected by *rhythmic signature* rather than by genre: four-to-the-floor with offbeat hats, breakbeats and half-time patterns, regardless of who played them
- **Traditional** — derived from the Groove MIDI Dataset: human drummers, rock through jazz

The additional banks come from a 5×5 self-organising map trained on more than ten thousand two-bar
patterns each, so neighbouring points on the map are musically related and X/Y morphs smoothly between patterns. The bank maker [tooling is in the repo](https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_grids/tools/groove_nodes),
so you can point it at your own MIDI library and derive a bank of your own genres.

## Controls

**Home page** — X and Y move around the pattern map, master density decides how many hits within a pattern actually play, and chaos perturbs the groove. CV inputs modulate all four. The LED marks the bar so you can see where you are.

**Kit page** (short press B7) — the first three pots adjust the density per drum, the fourth dials in some wildness. The sequencer keeps running while you set them, so you hear the change as you make it.

**Clock** — feed it anything. Sorrow measures the incoming pulse and works out whether you're most likely sending 24, 8, 4, 2 or 1 ppqn, so it locks to a MIDI clock divider, a Pam's output or a quarter-note trigger without being told which. Unpatched it runs at 120 BPM. Reset on the second gate input.

**Outputs** — the internal kit plays the audio outs while kick, snare and hat triggers fire from the
gate outputs and CV out, from the same pattern, all the time.
