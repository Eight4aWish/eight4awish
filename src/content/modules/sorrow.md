---
title: Sorrow
date: 2026-06-28
summary: >-
  A Mutable Instrument Grids based drum machine for the Daisy Patch.Init — with
  internal drum sounds, not just triggers.
platform: Patch.Init
tags:
  - drums
  - Daisy Patch Init
panel: /renders/daisy_grids_flat.png
photo: /images/daisypigrids.jpeg
photoCaption: Sorrow in the rack.
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/sorrow-v1.0.1/sorrow.bin
firmwareVersion: v1.0.1
flashWith: daisy-direct
draft: false
---
**Sorrow** is a drum machine for the Daisy Patch.Init. The module it's based on only puts out
triggers; Sorrow also **makes the sounds** — three drum voices synthesised on the Daisy itself — so
it works as a self-contained beatbox with no separate drum modules to patch.

It's based on **Mutable Instruments Grids** by Émilie Gillet, and named — like everything here —
after the magpie counting rhyme: *one for sorrow, two for joy*. Not affiliated with, or endorsed by,
Mutable Instruments or Electrosmith.

## The sounds

Grids' job is rhythm: it reads a map of drum patterns and decides *when* the kick, snare and hat
fire. Sorrow keeps that pattern brain intact and feeds each trigger into a voice synthesised live
from Electrosmith's **DaisySP** drum models (themselves ports of Mutable's Plaits drums):

- **Kick** — a `SyntheticBassDrum`: an FM-enveloped, analog-style bass drum with tone, "dirtiness"
  and FM-depth controls.
- **Snare** — a `SyntheticSnareDrum`: a tone-versus-noise "snappy" balance with a touch of FM.
- **Hi-hat** — an 808-style `HiHat`: six square oscillators through a band-pass filter.

The three mix down to the Patch.Init audio outputs, and pattern accents lift a hit's level. There
are no samples anywhere — every sound is generated on the chip.

A toggle sets how Sorrow behaves. In **external** it runs exactly like an ordinary Grids — no
internal sound at all, just 5V kick, snare and hi-hat triggers to fire other drum modules. Switch to
**internal** and the on-board voices take over, mixing straight to the audio outputs. Every switch
into internal also rolls a fresh **kit** — so an internal → external → internal round-trip
re-randomises the three voices' tuning and character, a quick way to shuffle the drum sounds until
one clicks.
