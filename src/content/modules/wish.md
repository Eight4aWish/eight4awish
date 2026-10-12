---
title: Wish
date: 2026-10-12
summary: >-
  Mutable Instruments Beads on the Alchemy Lab — granular textures, freeze
  and seed.
platform: Alchemy Lab
tags:
  - Granular
  - Effect
panel: /renders/alchemy_wish_flat.png
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_beads
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/wish-v1.0.0/wish-v1.0.0.bin
extraBinaries: []
firmwareVersion: v1.0.0
flash:
  intro: >-
    The Alchemy Lab ships with Hermetic Modular's own bootloader, so there is
    nothing to install first and no SD card involved. The firmware goes on over
    the front-panel USB-C from a web page. No compiler needed.
  warn: >-
    Not the Daisy route. There is a Daisy Seed inside, but do not use the Daisy
    Web Programmer or a .bin on an SD card — the Alchemy Lab has its own
    bootloader, and its own programmer.
  bootSteps: []
  steps:
    - Download the .bin above.
    - Connect the Alchemy Lab's front-panel USB-C to your computer.
    - >-
      Power on while holding B3. The rings spin a warm-white comet, then breathe
      slowly: the module is waiting for firmware.
    - Open the Hermetic Modular Web Programmer and load the .bin.
    - >-
      When it finishes, power-cycle. B2's LEDs breathe amber — the internal
      clock is seeding grains.
  links:
    - label: Hermetic Modular Web Programmer
      url: https://hermeticmodular.com/program
  note: >-
    Building from source? `make program-live` reflashes a running Wish over
    USB with no buttons at all. It needs node and dfu-util 0.11 or later; the
    firmware README has the rest.
draft: true
---
## Overview

**Wish** is Mutable Instruments **Beads** — Émilie Gillet's granular texture synthesiser,
the successor to Clouds — running on the **Hermetic Modular Alchemy Lab**. Mutable
published the Beads source on 11 October 2026; the DSP here is that code, with one
build flag changed (see dirty tape, below). What is new is everything around it: the panel, the jacks, the buttons and
the saved settings, rebuilt for a module with six knobs, three buttons and six CV jacks.

Beads records whatever comes in, and plays it back as grains — short slices, each with
its own pitch, length and envelope. **FREEZE** stops recording and holds the buffer.
**SEED** fires grains: by hand, latched to the internal clock, or from triggers on the
SEED jack. With nothing patched in, Beads plays grains from its own wavetables instead.

Named — like everything here — after the nursery rhyme: *eight for a wish*, the line
the channel takes its name from. Not affiliated with, or endorsed by, Mutable Instruments
or Hermetic Modular.

## Controls

The six knobs are Beads' six big ones. Hold **B3** and they become the second layer:
Beads' four attenuverters, as randomisers, plus two of its small knobs.

| Knob | Job | Held B3 | Job |
| --- | --- | --- | --- |
| **TIME** | where in the buffer grains start; plus CV on J6 | **TIME random** | how far TIME wanders |
| **SIZE** | grain length; plus CV on J7 | **SIZE random** | how far SIZE wanders |
| **SHAPE** | grain envelope | **SHAPE random** | how far SHAPE wanders |
| **DENSITY** | noon is no grains; anticlockwise regular, clockwise random; plus CV on J8 | **FEEDBACK** | how much of the output goes back into the buffer |
| **PITCH** | grain pitch, snapping through 0, 1, 3, 4, 7, 12 and 24 semitones; plus V/oct on J3 | **PITCH random** | how far PITCH wanders |
| **DRY/WET** | the mix | **REVERB** | reverb amount |

A randomiser at noon does nothing. Clockwise it is a smooth random walk; anticlockwise,
a fresh random value for every grain. The second layer is saved, and picks up a knob
once you turn it past its saved value.

| Button | Job |
| --- | --- |
| **B1** | **FREEZE**, on and off |
| **B2** | **SEED**: press for a grain, hold to keep seeding. Hold 4 s, or hold B2 and press B1, to latch the internal clock — how Wish starts |
| **B3** | tap for **QUALITY**: Beads' four recording media, digital, vintage digital, clean tape and dirty tape. Hold for the second layer |
| **B3 + B1** | input: Mono (J1 only), Stereo, or Synth (no input, Beads' wavetables) |
| **B3 + B2** | J10 carries Beads' grain gates instead of audio R |

| In | Job | In / out | Job |
| --- | --- | --- | --- |
| **J1** | audio in L | **J6** | TIME CV |
| **J2** | audio in R | **J7** | SIZE CV |
| **J3** | V/oct | **J8** | DENSITY CV |
| **J4** | SEED trigger | **J9** | audio out L |
| **J5** | FREEZE gate | **J10** | audio out R, or grain gates |

B3's top LED shows the quality in Beads' own colours; the one beneath it is the input
level, blinking while the automatic gain is still settling.

## Differences from Beads

- **The input mode is a setting.** Beads hears whether a cable is in its inputs; the
  Alchemy Lab cannot, so Mono, Stereo and Synth are chosen with B3 + B1.
- **SEED counts as patched while triggers arrive**, and for a few seconds after. DENSITY
  then divides or thins them as on Beads, and the internal clock comes back once they stop.
- **CV is always added at full depth**, so the randomisers stay randomisers whether a
  jack is patched or not. What is lost is Beads' patched-and-anticlockwise case, where
  CV sets the amount of randomness.
- **No SHAPE CV and no ASSIGN jack** — there are no jacks left.
- **Input gain is automatic only**, through Beads' own AGC. Hold B3 for 1.5 s and let go
  without turning anything to restart it.
- **Dirty tape runs at 48 kHz.** Beads slows its codec to 24 kHz for it; the Daisy's
  codec has no such rate, so it takes Beads' own 48 kHz path.
- **A frozen buffer is not kept** through a power cycle.

## Provenance

The DSP is **Mutable Instruments Beads** by Émilie Gillet, MIT-licensed, from
[pichenettes/eurorack](https://github.com/pichenettes/eurorack). Built on Hermetic
Modular's MIT-licensed Alchemy SDK and Electrosmith's libDaisy. Wish itself is MIT.
Thanks to Émilie for opening the code up, and to Luke Pendergrass at Hermetic Modular
for the Alchemy SDK.
