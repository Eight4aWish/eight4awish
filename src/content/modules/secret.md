---
title: Secret
date: 2026-10-02
summary: >-
  A chaotic oscillator for the Alchemy Lab — twelve strange attractors, with
  V/oct and one knob from free chaos to a locked note.
platform: Alchemy Lab
tags:
  - Oscillator
  - Chaos
panel: /renders/alchemy_lab_secret_flat.png
status: built
firmware: https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_chaos
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/secret-v1.1.0/secret-v1.1.0.bin
extraBinaries: []
firmwareVersion: v1.1.0
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
      When it finishes, power-cycle. B1's LED lights orange — Rössler, the first
      model.
  links:
    - label: Hermetic Modular Web Programmer
      url: https://hermeticmodular.com/program
  note: >-
    Building from source? `make program-live` reflashes a running Secret over
    USB with no buttons at all. It needs node and dfu-util 0.11 or later; the
    firmware README has the rest.
draft: false
---
## Overview

**Secret** is a chaotic oscillator. It runs strange attractors — sets of equations
that never quite repeat — fast enough to hear, and plays them from a V/oct input like
any other voice.

The problem with a chaotic oscillator is the word *oscillator*. Left alone, most of
these systems have no steady pitch. Secret runs each one at a speed set by V/oct, so it
plays near the note from the start, and adds one control, **TAME**. At zero the
attractor runs free. Turn it up and the module steers it onto one of its own orbits
that repeats at the note — keeping its grit at first, then settling into a clean,
periodic tone. The interesting part is the middle.

It runs on the **Hermetic Modular Alchemy Lab**, an open DSP platform with a Daisy
inside, six knobs with LED rings, three buttons and six CV jacks.

Named — like everything here — after the nursery rhyme: *seven for a secret, never to*
*be told*. A system that is completely determined, and still can't be predicted. Not
affiliated with, or endorsed by, Hermetic Modular.

## Tame — from noise to a note

TAME is **delayed feedback control**, from the chaos-control literature (Kęstutis
Pyragas, 1992). Secret compares the voice with itself one note-period ago, and nudges
one of its equations towards repeating. Once the system is on an orbit of its own that
repeats at the note, the nudge falls to nothing — so the tone TAME settles on is the
attractor's own, not a waveform laid over it.

How much that does depends on the system:

- **Spirals** (Rössler, Coupled Rössler, Moore–Spiegel) settle most easily: a small
  nudge finds their orbit.
- **Driven systems** (Duffing, the pendulum) have their subharmonics drawn onto the
  note. Hindmarsh–Rose's bursts become regular.
- **Van der Pol and the Brusselator** are periodic already, so TAME has little to do.
- **Lorenz, Chua and Lorenz–Lü–Chen** have no orbit it can find, so TAME leaves them
  wild. That is their nature.

## Twelve models

**B1** steps through all twelve. Both its LEDs show the current model's colour.

|  | First six |  | Second six |
| --- | --- | --- | --- |
| **orange** | Rössler | **red** | Driven pendulum |
| **yellow** | Van der Pol | **cyan** | Lorenz–Lü–Chen |
| **blue** | Lorenz | **violet** | Moore–Spiegel |
| **magenta** | Chua | **lime** | Forced Brusselator |
| **green** | Duffing | **pink** | Chaotic Colpitts |
| **white** | Coupled Rössler | **teal** | Hindmarsh–Rose |

The first six came from the Teensy. The second six were picked by ear from nine
measured candidates — and none of them, as far as I could find, has been played
as a V/oct voice in Eurorack hardware before.

## Controls

| Control | Job | Control | Job |
| --- | --- | --- | --- |
| **TUNE** | 27.5–880 Hz, plus V/oct on J3 | **CHAOS** | the main parameter — how chaotic; plus CV on J5 |
| **CHAR** | the second parameter — the character within it | **TAME** | free chaos (0) to the model's own repeating orbit (1); plus CV on J6 |
| **AD** | envelope attack and decay | **SR** | envelope sustain and release |
| **B1** | model | **B2** | unused for now (TAME's mode in v1.0.0) |
| **B3** | Drone (always open) or Gated by J4 |  |  |

| In | Job | Out | Job |
| --- | --- | --- | --- |
| **J3** | V/oct | **J7** | X CV — the raw attractor, for a scope |
| **J4** | gate: in Gated mode it opens the envelope, and restarts the attractor if the last note has died away | **J8** | Y CV |
| **J5** | CHAOS CV, ±5 V across the knob's travel | **J9** | audio L (X) |
| **J6** | TAME CV, ±5 V across the knob's travel | **J10** | audio R (Y) |

The rings show each knob plus its CV.

## Seeing it

Patch **J7/J8** into an X/Y scope and you see the shape the sound is making: Rössler's
spiral, Lorenz's butterfly, Chua's double scroll. It is also the best tuning aid there
is — a locked note draws a figure that stands still, and a slipping one turns.

## Known limits

- **Four models top out inside the playing range** at mid settings — Hindmarsh–Rose
  around 190 Hz, Chua 520, Colpitts 660 and Moore–Spiegel 880. Above that the note
  stops rising rather than the module overloading.
- **On Colpitts, the orbit TAME finds** sits about three semitones from the free voice.
- **V/oct uses the board's own calibration**, which sets each jack's zero but not its
  scale.
- **CV is read at 1 kHz**, so there is no audio-rate FM.
- **No presets.** The button choices reset at power-on.

## Provenance

Joranalogue's **Orbit 3** is an analogue double scroll with V/oct and a tame/wild switch, and there
is a long line of attractors as slow CV. TAME is Kęstutis Pyragas's delayed feedback
control, with the delay set by the note.

Built on Hermetic Modular's MIT-licensed Alchemy SDK and Electrosmith's libDaisy.
Secret itself is MIT. Thanks to Luke Pendergrass at Hermetic Modular for the Alchemy SDK.
