---
title: Tiliqua
date: 2026-09-04
summary: >-
  Two instruments on one membrane for the apf.audio Tiliqua — a stereo struck
  drum head and a scanned wavetable, sharing under four hundred lines of
  gateware, with the mesh drawn live on the screen.
platform: Tiliqua
tags:
  - FPGA
  - Physical modelling
  - Scanned synthesis
panel: /renders/tiliqua_orbita_flat.png
status: built
firmware: https://github.com/Eight4aWish/tiliqua
binary: https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/lacuna-48x48-1280x720p60.tar.gz
firmwareVersion: "— LACUNA, 1280×720"
extraBinaries:
  - label: ORBITA, 1280×720
    url: https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/orbita-48x48-1280x720p60.tar.gz
  - label: LACUNA, 720×720 round panel
    url: https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/lacuna-48x48-720x720p60r2.tar.gz
  - label: ORBITA, 720×720 round panel
    url: https://github.com/Eight4aWish/tiliqua/releases/download/mesh-0.4/orbita-48x48-720x720p60r2.tar.gz
flash:
  intro: >-
    Tiliqua ships with its bootloader already on, so there is nothing to install
    once. A bitstream archive goes into one of eight slots and is chosen from the
    front panel — no compiler needed if you take a release archive.
  steps:
    - Take the archive for the instrument you want and the screen you have.
    - Connect the module to your computer with the debug USB-C port.
    - >-
      Run `pdm flash archive <archive>.tar.gz --slot 3`, picking any free slot.
      `pdm flash status` shows what is in the slots already.
    - >-
      Power-cycle, then turn the encoder to the slot and push to boot it. An
      RP2040 reconfigures the FPGA over JTAG — a couple of seconds.
  warn: >-
    Two video modes are built. Take `1280x720p60` for a capture card or a
    monitor, and `720x720p60r2` only for the round Waveshare panel — a cheap
    HDMI dongle will not lock to 720×720, because it is not a standard timing.
  links:
    - label: All releases
      url: https://github.com/Eight4aWish/tiliqua/releases
    - label: Tiliqua documentation
      url: https://apfaudio.github.io/tiliqua/
  note: >-
    If you build rather than download, pin the placer seed. These designs sit
    close enough to the ECP5's routing limit that identical source places very
    differently run to run.
draft: true   # needs the video and the first-hand review notes
---

## Overview

**LACUNA** and **ORBITA** are two bitstreams for the [apf.audio
Tiliqua](https://apf.audio/), an open-hardware FPGA module for Eurorack. They are the same
48×48 finite-difference membrane — the same file, under four hundred lines of gateware —
and they sound nothing alike. One is a drum head you hit. The other updates the same mesh
once every 64 samples instead of every one, and reads a circle through it as a wavetable.
Not affiliated with, or endorsed by, apf.audio.

An FPGA is not a microcontroller with more headroom — and the difference is not that
everything happens at once. The membrane is walked in raster order here too: 2304 nodes in
1165 of the 1250 cycles a 48 kHz sample allows. What changes is what a single tick buys. The four neighbours, the Laplacian, the tension multiply, the boundary
test and the clamp all resolve together, so a node costs **one** tick where a processor
needs a couple of dozen. Spend that saving and you get the two things below: geometry you
can modulate at audio rate, and a screen that costs no time at all.

At 48×48 it buys one thing more. 2304 nodes will not fit in 1250 cycles one at a time, so
the update retires **two per tick** — two cells packed into each memory word, the delay
line shifting by a word, two lanes of identical arithmetic. That is the step with no
equivalent on a processor: you cannot ask a CPU for a second copy of its own datapath.

## The membrane, and why the hole matters

Each node's next position comes from its four neighbours' current ones, for every node,
every sample. That much is textbook. The part that is not is the boundary.

**The mask is a comparator, not an array.** On a CPU the shape of the drum is 2304 elements
you rebuild whenever it changes, so shape is a control-rate parameter at best and usually a
setting you pick once. Here it is two comparisons re-evaluated for every node of every
scan — the geometry costs the same whether it is still or moving. So the hole in the middle
of the drum becomes a **modulation destination**, patchable at audio rate. A CPU can run
the same two comparisons inline rather than rebuilding an array, so this is a question of
what it costs rather than what is possible — but the cost lands on a per-node budget that
is already the tight thing.

It is not free. Geometry FM uses a hard mask, and the discontinuity is broadband noise. An
energy-conserving moving boundary is an open problem rather than a coding task.

## LACUNA — a struck membrane

The mesh runs at 48 kHz and you listen to a single node of it, the way a pickup sits on a
drum head. Tension is pitch and it tracks 1 V/oct.

| jack | |
| --- | --- |
| in 0 | strike — rising edge above ~1 V |
| in 1 | tension — 1 V/oct, 27.5–440 Hz |
| in 2 | position — strike position, hub to rim |
| in 3 | geometry — audio-rate modulation of the hole radius |
| out 0 / out 1 | mesh L and R |

Strike position is the timbre control, and it is doing something physical rather than
filtering: where you hit a drum decides which modes get energy. Hit a node sitting on a
mode's antinode and that mode rings; hit its nodal line and it stays silent.

**It is stereo, and the second pickup's position is the whole trick.** It sits 45° round
from the first, at the same radius, and the two obvious alternatives are both
wrong: a *mirrored* point reads identically on every symmetric preset — correlation 1.00,
which is mono with extra steps — and +x sits inside the slit on the slit preset, where it
would be silent. At 45° the angular modes differ between the channels while the radially
symmetric ones stay common, which is what a struck drum actually does. Correlation runs
0.50–0.60 on the solid heads and around zero once there is a hole.

All modes decay together, as real membranes do not — a diffusion term was tried and
measurably did nothing. The single-node strike is a choice rather than an omission: it is
brighter and slightly harsher, which suits something heard through a pickup.

## ORBITA — the same mesh, as a wavetable

Update the membrane once every 64 samples — **750 Hz**, against LACUNA's 48 kHz — and its
own fundamental drops to about **1 Hz**, far below hearing. It stops being a sound and
becomes a surface. Read a circular path around it at audio rate and the scan is
the oscillator. Pitch is the scan rate, not the tension.

| jack | |
| --- | --- |
| in 0 | drive — a gate edge plucks, a held level drones |
| in 1 | pitch — 1 V/oct, 0 V is 27.5 Hz, eight octaves to 7040 Hz |
| in 2 | radius — the left scan circle, inner edge to outer edge, 256 steps |
| in 3 | damping — how long the surface holds its shape; a 0–5 V slider takes it from ringing for ever to a thud |
| out 0 / out 1 | scan L, and scan R a quarter of the annulus further out |

The scan path is a circle rather than a line, which turns out to decide the whole
instrument. A concentric circle never crosses a concentric hole, so the **asymmetric**
geometries are the interesting ones: a slit gives one notch per revolution and a full
harmonic series, a square hole gives four notches and a fourth-harmonic emphasis. The
symmetry order of the hole picks the harmonics.

**The scan reads between the cells, not on them.** It carries its position in Q4 cells and
blends the four around it rather than snapping to the nearest, and the angle is
interpolated between adjacent table entries too. That matters more than it sounds: on a
smooth field, nearest-cell addressing measures 0.14 roughness against 0.039 for bilinear,
and on the real thing it measured 0.579. After bilinear the same test gives 0.029–0.094 —
the difference between an instrument that wants reverb over it and one that does not.
Because the circle no longer has to land on a cell, the radius CV also gets 256 steps
across the membrane instead of sixteen.

What is left is a real limit rather than a defect: a finite table per revolution — 64
points at 32×32, 128 at 48×48 — so above a few kHz the table's own harmonics begin to
fold. It is audible as character. There is no tension control either — λ² is a per-preset
constant, and all four jacks are spoken for.

**The two panels are the argument, and so is the one place they differ.** The first three
inputs are the same kind of thing on both — a gate, 1 V/oct, a radial position hub to rim —
and both are stereo, so the panels read `GTE V/O RAD` over two outputs either way.

The fourth is where the shared membrane stops being shared. On LACUNA the hole is the
instrument, so in3 opens and closes it at audio rate: `GEO`. On ORBITA a concentric scan
circle never crosses a concentric hole, so that same control did nothing at all on five of
the eight presets; in3 became damping instead — how long the surface holds its shape, which
is the control scanned synthesis has had since Verplank: `DCY`. Same membrane, same three
controls, and a fourth that had to become a different parameter because of how each
instrument reads the surface.

## The screen, which costs almost nothing

Both draw the membrane live, and it is worth saying why that is not a gimmick. **There is
no framebuffer, no PSRAM and no CPU involved.** The audio scan already carries every node
past one point once per sample, so a second narrow memory written from the same address and
strobe is a free snapshot, and each pixel is coloured from it a few microseconds before it
goes down the cable. About 620 LUTs and one block RAM.

Blue and red are the two signs of displacement, so what is on screen is the mode pattern
rather than a brightness envelope. That is the difference that matters: the mesh's most
characteristic behaviour is mode beating between near-degenerate pairs, and it appears as
the pattern **precessing** — which no waveform display can show you.

ORBITA additionally draws the scan circle over the membrane, and the same circle unrolled
as a waveform strip beneath it, phase-locked by construction, so a feature at an angle on
the ring sits directly above the sample it produced.

## The module itself

Tiliqua is 6HP, built around a Lattice ECP5 with 25K LUTs and 28 18×18 multipliers,
32 MB of PSRAM and a GPDI video socket. Two things about it matter more than the numbers.

**There is no separate CV path.** All four inputs and four outputs are channels on one
four-channel audio codec, so CV arrives at the audio rate, sample by sample, and there is
no difference between a CV and a signal — patch an oscillator into a CV input and it is
just audio. A microcontroller module reads audio through its codec and CV through the
chip's own converter on a slower scan, once a block: fine for a knob, coarse for modulation
you want to hear.

**It becomes a different module.** The bootloader holds eight bitstreams at once, chosen
from the front panel, and apf.audio ships eleven of their own. You buy one module and it is
eight modules, and the list is open — which is what these two are.

## Provenance

Both were built in about two days, in heavy collaboration with an AI assistant. The design
decisions, the musical judgements and the testing on hardware are mine; much of the
gateware, the tests and the documentation were written with assistance. Upstream has [a
policy on AI
contributions](https://github.com/apfaudio/tiliqua/blob/main/CONTRIBUTING.md), and
**nothing here has been proposed for upstream inclusion.**

Everything, upstream's and mine, is CERN-OHL-S-2.0 — the strongly reciprocal open hardware
licence, which applies to bitstreams as much as to boards.
