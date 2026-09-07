---
title: Orbita/Lacuna
date: 2026-09-04
summary: >-
  Two bitstream instruments for the apf.audio Tiliqua — a stereo struck drum
  head and stereo scanned wavetable which share a 2D mesh base.
platform: Tiliqua
tags:
  - FPGA
  - Physical modelling
  - Scanned synthesis
panel: /renders/tiliqua_orbita_flat.png
status: built
firmware: https://github.com/Eight4aWish/tiliqua
binary: >-
  https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/lacuna-48x48-1280x720p60.tar.gz
extraBinaries:
  - label: ORBITA, 1280×720
    url: >-
      https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/orbita-48x48-1280x720p60.tar.gz
  - label: LACUNA, 720×720 round panel
    url: >-
      https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/lacuna-48x48-720x720p60r2.tar.gz
  - label: ORBITA, 720×720 round panel
    url: >-
      https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/orbita-48x48-720x720p60r2.tar.gz
firmwareVersion: — LACUNA, 1280×720
flash:
  intro: >-
    Tiliqua ships with its bootloader already loaded, so there is no additional
    install. A bitstream archive is uploaded into one of eight slots and then
    chosen from the front panel — no compiler needed if you take a release
    archive.
  warn: >-
    Two video modes are built. Take `720x720p60r2` for a round Waveshare or
    Tiliqua screen and `1280x720p60` for a capture card or monitor that favours
    this screen resolution.
  bootSteps: []
  steps:
    - Take the archive for the instrument you want and the screen you have.
    - Connect the module to your computer with the debug USB-C port.
    - >-
      Run `pdm flash archive <archive>.tar.gz --slot [YOUR CHOICE HERE]`,
      picking any free slot. `pdm flash status` shows what is in the slots
      already.
    - Power-cycle, then turn the encoder to the slot and push to boot it.
  links:
    - label: All releases
      url: https://github.com/Eight4aWish/tiliqua/releases
    - label: Tiliqua documentation
      url: https://apfaudio.github.io/tiliqua/
  note: >-
    If you build rather than download, pin the placer seed. These designs sit
    close enough to the ECP5's routing limit that identical source places very
    differently run to run.
draft: false
---
## Overview

**LACUNA** and **ORBITA** are two bitstreams for the [apf.audio](https://apf.audio/)
[Tiliqua](https://apf.audio/), an open-hardware FPGA module for Eurorack. They are based on the same 48×48 finite-difference membrane — the same shared source code file of under four hundred lines of gateware. They sound nothing alike. One is a drum head you hit. The other reads circles through the mesh as wavetables. Not affiliated with, or endorsed by, apf.audio.

The bitstreams share a family of 2D mesh designs based on a drum head but with holes or slits. These modifications add to the range and complexity of the vibration modes established when the membrane is excited.

## LACUNA — a struck membrane

The mesh runs at 48 kHz and you listen to the sound at two nodes, the way contact pickups sit on a drum head. The tension of the mesh sets the pitch which tracks 1 V/oct.

| jack |  |
| --- | --- |
| in 0 | strike — rising edge above ~1 V |
| in 1 | tension — 1 V/oct, 27.5–440 Hz |
| in 2 | position — strike position, hub to rim |
| in 3 | geometry — modulation of the hole radius |
| out 0 / out 1 | mesh L and R |

Strike position is the timbre control and where you hit a drum decides which modes get energy. Hit a node sitting on a mode's antinode and that mode rings; hit its nodal line and it stays silent. LACUNA is stereo, with the pickups positioned to ensure that the angular modes differ between the channels while the radially symmetric ones stay common.

## ORBITA — the same mesh, as a wavetable

Update the membrane once every 64 samples — **750 Hz**, against LACUNA's 48 kHz — and its
own fundamental drops to about **1 Hz**, far below hearing. It stops being a sound and becomes a surface. Read a circular path around it at audio rate and the scan is an oscillation. In this case pitch is the scan rate, not the tension.

| jack |  |
| --- | --- |
| in 0 | drive — a gate edge plucks, a held level drones |
| in 1 | pitch — 1 V/oct, 0 V is 27.5 Hz, eight octaves to 7040 Hz |
| in 2 | radius — the left scan circle, inner edge to outer edge, 256 steps |
| in 3 | damping — how long the surface holds its shape; a 0–5 V slider takes it from ringing for ever to a thud |
| out 0 / out 1 | scan L, and scan R a quarter of the annulus further out |

The scan path is a circle or depending on radius, a broken circle. Asymmetric geometries like the slit provide one notch per revolution and a full harmonic series. Alternatively, a square hole gives four notches and a fourth-harmonic emphasis. The symmetry order of the hole picks the harmonics.

## Visualisation

Node status is piped directly to the video socket so you can watch a 2D map showing current node status and the strike, scan position and/or geometry adjusted through CV controls. Blue and red are the two signs of positive and negative displacement. The mesh's most characteristic behaviour is mode beating between near-degenerate pairs, and it appears as pattern **precessing**.

## The module itself

Tiliqua is 6HP, built around a Lattice ECP5 with 25K LUTs and 28 18×18 multipliers, 32 MB of PSRAM and a GPDI video socket. All four inputs and four outputs are channels on one four-channel audio codec, so CV arrives at the audio rate, sample by sample, and there is no difference between a CV and a signal — patch an oscillator into a CV input and it is just audio. The onboard bootloader holds eight bitstreams at once, chosen from the front panel, and apf.audio ships eleven of their own.

## Provenance

Both bitstreams were built in about five days, in heavy collaboration with an AI assistant. The design decisions, the musical judgements and the testing on hardware are mine; much of the gateware, the tests and the documentation were written with assistance.

Everything, upstream's and mine, is CERN-OHL-S-2.0 — the strongly reciprocal open hardware
licence, which applies to bitstreams as much as to boards.
