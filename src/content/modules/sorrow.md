---
title: Sorrow
date: 2026-08-27
summary: >-
  A Mutable Instruments Grids based drum machine for the Daisy patch.Init() —
  with its own drum voices, a pool of models to roll between, and four pattern
  banks.
platform: Patch Submodule
tags:
  - Drums
  - Daisy Patch Init
panel: /renders/daisy_grids_flat.png
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/sorrow-v2.4.1/sorrow-v2.4.1.bin
extraBinaries: []
firmwareVersion: v2.4.1
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

Each of the three slots is filled from a pool of ten DaisySP models rather than one fixed voice: based on Mutable's synthetic and 808-lineage drum models, the metallic hi-hats, and physical-modelling voices for something stranger. **Wildness** is the single control over how far the randomiser may go, and it is two knobs in one. Below noon it opens each parameter's range and lets the three slots disagree about which family they come from — fully counter-clockwise is a coherent, safe kit; noon is genuinely random and is as far as the ranges ever open. Past noon the ranges stop growing and the *odds* change instead: values get pushed toward the ends of their ranges rather than the middle, and both the family and the model choice tilt toward the strange ones. An analog kick under a modal snare and a ring-mod hat is a noon result. Past noon it stops being polite.

Don't like the kit — randomise.

## Four pattern banks

Grids is a morphing lookup table — 25 hand-authored patterns, where X/Y controls interpolate between four of them at a time. All the musicality is in about 2.4 KB of data. The Grids classics are here but fresh banks have been added for extra variation. **Hold B7** to cycle banks. The module — synthetic Dan — lets you know which has been selected.

- **Original** — Émilie's Grids map, rendered onto Sorrow's grid. Hers is one bar of 32nds and Sorrow steps in 16ths, so each 32nd pair is merged onto one 16th and the bar repeats — it plays at her tempo rather than half of it, keeping 409 of her 415 hits
- **Club** — derived here from the Groove MIDI Dataset, selected by *rhythmic signature* rather than by genre: four-to-the-floor with offbeat hats, breakbeats and half-time patterns, regardless of what the drummer was told they were playing
- **Traditional** — derived from the Groove MIDI Dataset: human drummers, rock through jazz
- **Latin** — the same dataset filtered to latin, jazz, afro-cuban, afrobeat, New Orleans, reggae and highlife. The one that sounds least like a drum machine

All three derived banks are **real patterns, not averages**. Twenty-five are picked out of a
few thousand two-bar windows by farthest-point sampling — each one the least like everything
already picked — then fitted to Grids' own loudness distribution, then arranged on the 5×5 so
neighbours are related and X/Y has somewhere to travel. Choosing and arranging are
deliberately separate: only the arranging wants things to be alike, and it has to happen
last, or the map ends up laid out for values the nodes no longer hold.

Each node is fitted against one of Émilie's rather than a lane at a time across the whole
map, which is what stops a node losing a drum: 62% of her values are zero, so a node quieter
than its neighbours used to collect the bottom of that distribution and fall silent in one
voice. She never leaves a drum out, in any of her 75 node-lanes.

An earlier version used a self-organising map, whose nodes are averages of thousands of
patterns and whose objective is literally to make neighbours similar. It measured well and
played flat. The [notes page](/notes/grids-patterns/) has the full story and the numbers.
The bank maker [tooling is in the repo](https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_grids/tools/groove_nodes),
so you can point it at your own MIDI library and derive a bank of your own genres.

**Others have been here.** [Rich Heslip's MIDI2Drums](https://github.com/rheslip/2HPico-Sketches/tree/master/Grids_Drums)
does the same job for his Pico drum machine, and [Phazerville's](https://github.com/djphazer/O_C-Phazerville)
DrumMap applet for Ornament & Crime already runs a non-Mutable map.

Real Grids hardware uses the same 25 nodes of the same 96 bytes, so these banks drop into it
unchanged. There is [firmware for that too](/notes/grids-patterns/) — built and checked as far
as it can be without a module, and looking for someone with the hardware to try it.

## Controls

**Home page** — X and Y move around the pattern map, master density decides how many hits within a pattern actually play, and chaos perturbs the groove. CV inputs modulate all four. The LED marks the bar so you can see where you are.

**Kit page** (short press B7) — the first three pots adjust the density per drum, the fourth dials in some wildness. The sequencer keeps running while you set them, so you hear the change as you make it.

**Clock** — send it 16th notes. One pulse, one step, and nothing in between interpreting the timing, so it holds at any tempo and **swing passes straight through**: a swung clock from Pam's gives you a swung pattern. A 32-step pattern is two bars. Unpatched it runs at 120 BPM. Reset on the second gate input.

**Outputs** — the internal kit plays the audio outs while kick, snare and hat triggers fire from the
gate outputs and CV out, from the same pattern, all the time.
