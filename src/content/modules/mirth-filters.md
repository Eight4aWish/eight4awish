---
title: Mirth (filters)
date: 2026-10-29
summary: >-
  Two filters from my rack, a Doepfer Wasp and a Behringer Swords, as neural
  networks with cutoff and resonance as knobs, on a Daisy patch.Init().
platform: Patch Submodule
tags:
  - Filter
  - Neural Networks
  - Daisy patch.Init()
panel: /renders/daisy_neural_flat.png
status: built
firmware: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_neural
binary: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/mirth-v1.1.0/mirth-v1.1.0.bin
extraBinaries:
  - label: Mirth Lite
    url: >-
      https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/mirth_lite-v1.1.0/mirth_lite-v1.1.0.bin
    version: v1.1.0
  - label: card files
    url: >-
      https://github.com/Eight4aWish/eurorack_daisy_patch_init/releases/download/mirth-v1.1.0/mirth-v1.1.0-card.zip
firmwareVersion: v1.1.0
flash:
  intro: >-
    The filters are a bank of Mirth, the same firmware as Mirth (amps). It runs
    from the Daisy's QSPI chip through the Daisy bootloader: a one-time
    bootloader install, then the firmware goes on with an SD card. The same
    card then holds the filters. No compiler needed.
  warn: >-
    The card must be one FAT32 partition of 2 GB or less, with the rest of the
    card left unallocated. A full-size FAT32 volume on a big card fails at
    start-up, and exFAT is not read at all.
  stepsTitle: One time per module — install the bootloader
  bootSteps:
    - Plug the Daisy Patch.Init in with a USB-C data cable.
    - Hold BOOT, tap RESET, then release BOOT.
    - Open the Daisy Web Programmer and go to its Bootloader section.
    - Click Flash. That is the bootloader on — you never have to do this again.
  steps:
    - >-
      Format the card: one FAT32 partition of 2 GB or less. On a Mac, check the
      disk number with `diskutil list external` first — this erases it — then
      `diskutil partitionDisk /dev/diskN MBR "MS-DOS FAT32" DAISY 2G "Free
      Space" REST R`.
    - >-
      Copy the Mirth or Mirth Lite .bin above to the root of the card. It must
      be the only .bin on the card.
    - >-
      Unzip the card files and copy everything in the folder to the root as
      well, the `notamps` folder included. The seven `f1_` to `f7_` files are
      the filters.
    - >-
      Insert the card and power-cycle. The bootloader flashes the firmware if it
      differs from what is installed, and boots. Hold B7 for 1.5 s, twice, to
      reach FILTERS.
  extrasNote: >-
    The firmware is for a patch.Init() with the OLED fitted; Mirth Lite is for a
    stock patch.Init(), no screen. Both flash the same way and both take the
    same card: the zip holds the seven filters, the amps and not-amps of Mirth
    (amps), their credits, and these card instructions.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
  note: >-
    On a Mac, Finder writes a hidden twin of every file — ._mirth.bin,
    ._f3_WASP_LP_16.grnb. The .bin twin confuses the bootloader and the filter
    twins fail their checksum. After copying, delete them in Terminal with `rm
    -f /Volumes/DAISY/._* /Volumes/DAISY/notamps/._*` — the usual `cp -X` no
    longer prevents them on current macOS.
draft: false
---
## Overview

**Mirth** plays neural networks on a Daisy patch.Init(). [Mirth (amps)](/modules/mirth/)
covers its first two banks, AMPS and NOT-AMPS: NAM's A2-Lite captures, the same kind people
share by the thousand for guitar amps and pedals. Every capture I could find was an amp or
a pedal. I wanted something from my own rack.

So the third bank, **FILTERS**, plays two of my filters: a **Doepfer A-124 Wasp** and a
**Behringer Swords**, each learned from recordings of the real module. This page is how they
were made, and how to play them.

The Wasp is Doepfer's take on the filter from the EDP Wasp, the late-70s synth whose filter
uses CMOS logic chips as amplifiers. That is where its dirt comes from, and dirt is what
makes a module worth capturing. It also has a property that turned out to shape everything:
only the cutoff is under CV. Resonance is a knob.

## The seven filters

| Screen | The filter | FREQ | RES |
| --- | --- | --- | --- |
| `FLT1` | the Wasp's low-pass at one setting, as an amp-style capture | — | — |
| `FLT2` | the Wasp's low-pass, learned at one resonance | cutoff | feedback from 9 |
| `FLT3` | the Wasp's low-pass, cutoff and resonance | cutoff | resonance |
| `FLT4` | FLT3 with the Wasp's own unpredictability above Res 8, as a granular layer | cutoff | resonance |
| `FLT5` | the Wasp's high-pass | cutoff | resonance |
| `FLT6` | Swords, cutoff and resonance | cutoff, V/oct | resonance |
| `FLT7` | FLT6 with Swords' self-oscillation added | cutoff, V/oct | resonance; oscillates from 10 |

## Controls

The same knobs as the other banks. Each knob is summed with the CV jack under it.

| Control | FILTERS |
| --- | --- |
| **CV\_1** (+ CV_5) | MIX, dry to wet |
| **CV\_2** (+ CV_6) | FREQ, the cutoff; the jack adds its volts, as on the real filter |
| **CV\_3** (+ CV_7) | RES, 0 to 11 |
| **CV\_4** (+ CV_8) | DRIVE into the network, −20 to +20 dB, unity at noon |
| **B7** short | the next filter |
| **B7** held 1.5 s | the next bank: AMPS → NOT-AMPS → FILTERS |

Audio in on IN_L; the same mixed signal on both outputs. On Mirth the screen shows the
cutoff in volts and the Res dial; on Mirth Lite the LED flickers three times for FILTERS,
then blinks the filter's number. The full controls for both builds are on
[Mirth (amps)](/modules/mirth/).

## A2 first, and why it is not enough

NAM's easy trainer only accepts its own input file. To my ear it is a guitar riff sped up
and repitched, veering into synth territory. So I recorded that file through the Wasp at
one setting (Res 6, the cutoff held at +5 V) and trained an A2-Lite capture of it. It is
on the card as **FLT1**.

The score here is **ESR**, error-to-signal ratio: the share of the real Wasp's output the
network fails to reproduce. NAM's grades are under 0.01 great, under 0.035 not bad and under
0.1 might sound ok.

On NAM's own validation passage, A2-Lite scored 0.048. On a synth riff it never trained on,
two detuned saws at the same setting, it scored **0.105**. NAM's file does not drive the
Wasp the way a sustained oscillator does. And an A2 has no knob: it is one setting,
frozen. FREQ and RES do nothing on FLT1.

**The riff, 4 seconds, Res 6, cutoff held at +5 V:**

<p><strong>Real Wasp</strong><br><audio controls preload="none" src="/audio/wasp/wasp-riff_real-wasp.mp3" style="width:100%"></audio></p>
<p><strong>A2-Lite</strong>, ESR 0.105<br><audio controls preload="none" src="/audio/wasp/wasp-riff_a2-lite.mp3" style="width:100%"></audio></p>
<p><strong>A GRU with the cutoff as a knob</strong> (below), ESR 0.008<br><audio controls preload="none" src="/audio/wasp/wasp-riff_gru24-cutoff.mp3" style="width:100%"></audio></p>

## Recording the Wasp

An Expert Sleepers ES-10 on my audio interface plays audio and a cutoff CV into the Wasp
and records its outputs, with a loopback cable so every take lines up to the sample.
Because resonance is a knob, I recorded a session at each of the eleven marks on the Res
dial, sweeping the cutoff by CV inside each take: about four minutes of synth material per
mark, for low-pass and again for high-pass. **Res 5 was recorded and then kept back**, so
there would be a test of whether a network can fill in a setting it never heard.

## A network with knobs

A **GRU**, a gated recurrent unit, reads the audio one sample at a time and carries a small
history forward: 16 numbers, updated every sample, with learned gates deciding what to keep.
The cutoff CV and the Res position go in alongside the audio, so the history depends on them
too. That is 1,025 parameters, against A2-Lite's 1,871.

I trained a larger size too, 24 numbers of history and 2,113 parameters. On the Daisy it
needs 10,330 processor cycles a sample, against a budget of 10,000, so the module runs the
16s. The clips on this page come from the 24s, which score a little better (0.012 against
0.017 at Res 6).

## The first version was badly designed, and it is worth saying how

To compare A2 with a GRU, I first trained a set of GRUs on the same NAM take. On NAM's
passage they scored around 0.001, forty times better than A2, and I nearly believed it. On
the synth riff they fell to between 0.05 and 0.25, and the ranking changed completely. Every
network had been chosen on a quiet nine-second passage of guitar-like plucks, which told me
almost nothing about synth material. My family could not tell the best of them from the real
Wasp on the riff, which says something about ESR too.

So I started again from the question. Train on synth material: about 31 minutes of sweeps
across the ten trained Res marks. Choose each network on synth material spread through every
take, at its beginning, middle and end, in case the Wasp drifts as it warms. Test once, at
the end, on a riff no network trained on. And train every design several times from
different random starts, so a lucky run cannot pass for a better design.

## What it learned

The cutoff, in every run. With the cutoff alone at Res 6, the riff scored **0.012**, and
the same 4 seconds A2-Lite scored 0.105 on scored 0.008.

<p><strong>Real Wasp</strong>, Res 6, the cutoff stepping from 2 to 10 V<br><audio controls preload="none" src="/audio/wasp/wasp-res6_real-wasp.mp3" style="width:100%"></audio></p>
<p><strong>The cutoff as a knob</strong>, ESR 0.010<br><audio controls preload="none" src="/audio/wasp/wasp-res6_gru24-cutoff.mp3" style="width:100%"></audio></p>
<p><strong>Leftover</strong>: the real Wasp minus the network, at the same gain<br><audio controls preload="none" src="/audio/wasp/wasp-res6_leftover.mp3" style="width:100%"></audio></p>

With cutoff and resonance, one network across the whole dial. ESR on the held-out riff, the
average of three training runs of the 16 that went on the card:

| Res | 0 | 1 | 2 | 3 | 4 | **5** | 6 | 7 | 8 | 9 | 10 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ESR | 0.014 | 0.014 | 0.009 | 0.011 | 0.020 | **0.031** | 0.067 | 0.17 | 0.30 | 0.51 | 0.72 |

The bold one is the setting it never heard. It lands between its neighbours, so one network
fills the gap in the resonance dial.

<p><strong>Real Wasp</strong>, Res 5<br><audio controls preload="none" src="/audio/wasp/wasp-res5_real-wasp.mp3" style="width:100%"></audio></p>
<p><strong>Cutoff and resonance</strong>, never trained at Res 5, ESR 0.047<br><audio controls preload="none" src="/audio/wasp/wasp-res5_gru24-cutoff-res.mp3" style="width:100%"></audio></p>
<p><strong>Leftover</strong><br><audio controls preload="none" src="/audio/wasp/wasp-res5_leftover.mp3" style="width:100%"></audio></p>

**Then I played it on the module, and Res did almost nothing.** The cutoff worked perfectly.
Measured, at a cutoff of 6 V, the real Wasp grows by 8 to 18 dB across the spectrum from Res
6 to 10; the network fell by 2 to 4 dB. ESR counts the phase of every wiggle, which the ear
ignores, so a network can keep its score low while getting the control wrong. Nothing in my
tests had checked that the knob does what the real knob does. Now they do.

The network keeps pace with the Wasp's resonance up to Res 7, then falls behind. So on the
module the dial lifts its Res input above 7, and from 9 feeds the network's output back into
its input. **RES goes to 11**: from 10 it rings and holds a tone of its own, which the real
Wasp never does.

## The Wasp never does the same thing twice

At high resonance the Wasp goes wild. I recorded the same input four times at each of Res 6
to 10. Up to Res 7 the takes match each other almost exactly (ESR 0.0015 between them). At 8
they start to part (0.073), and from 9, at and above the cutoff, the difference between takes
is most of what there is.

A network trained to get as close as possible to every sample cannot predict which way the
next wiggle goes, so the closest it can get is the average of the possibilities. That is
tamer than any of them.

<p><strong>Real Wasp</strong>, Res 10<br><audio controls preload="none" src="/audio/wasp/wasp-res10_real-wasp.mp3" style="width:100%"></audio></p>
<p><strong>Cutoff and resonance</strong>, ESR 0.64<br><audio controls preload="none" src="/audio/wasp/wasp-res10_gru24-cutoff-res.mp3" style="width:100%"></audio></p>
<p><strong>Leftover</strong><br><audio controls preload="none" src="/audio/wasp/wasp-res10_leftover.mp3" style="width:100%"></audio></p>

## Borrowing the misbehaviour back

So the network plays the average Wasp, and the wildness goes back on top, taken from the
recordings. No sound is added. The four takes give a record of how each one lifts and dips
against their average, band by band, measured at each distance from the cutoff. On the
module, grains of that record, about 117 ms each, drawn at random, boost and cut the
network's output at the same distance from wherever the cutoff is now.

I chose the settings by ear, over three rounds of listening: gentler grains cured a digital
edge the first ones had. The layer fades in from Res 8 to 9, where the Wasp stops repeating
itself, and there is no knob for it. That is **FLT4**: FLT3's network with the layer.

It is not a perfect copy of the Wasp, but it has some of its own character, and that is
audibly interesting: a beating in the mid-range, and at a low cutoff a rumble that sounds as
if it is coming from a cave.

The first build glitched. I had estimated what the layer would cost instead of measuring it,
and its worst moments came in at 2.7 times the estimate. Spread over ten blocks of audio
instead of three, it fits: 70% of the processor, and at its busiest about 8,600 cycles a
sample of the 10,000. It runs 54 ms late to make room for its grains, and the dry side is
delayed to match, so MIX stays in time.

## Swords: the same question, with Res under CV

On the Wasp every Res mark was a separate session, set by hand. Maybe that was why the
networks learned Res weakly. On Swords, Res is under CV, so I recorded an hour with the
cutoff and Res swept together.

The cutoff was learned in all twelve runs. Res was not. Above about 4 V on its Res CV, Swords
self-oscillates, and three quarters of what training heard was that oscillation, which
never repeats. Trained on Res 0 to 4 V only, the same data and the same recipe, Res moved the
way Swords' does, by about twice as much as before. That is **FLT6**.

## Swords' oscillation, built from measurements

Past that threshold Swords is not like the Wasp. It sings one clean, stable tone at the
filter's own frequency, and from take to take only the phase changes: where each take's
oscillation starts in its cycle. Everything you hear repeats. The Wasp's wildness changes
its spectrum from take to take, which is why it needs a random layer.

So Swords' oscillation is built part by part, from measurements I had already made, and
added to FLT6's network as **FLT7**:

- **when it sounds:** it starts above a threshold that depends on the cutoff, and stops a
  little lower than it starts;
- **its pitch:** 169 Hz at V/OCT 4 V, close to an octave per volt;
- **its level:** about 7 V peak, ducked when the input is loud, since the two share Swords'
  clipping;
- **its shape:** almost a sine at the start, odd harmonics growing with Res;
- **locking:** it pulls to the input when a note is near its pitch;
- **its start:** a random phase each time.

On the module the dial's 10 to 11 takes the oscillation from its onset to 6 V on Swords'
Res CV, at up to 76% of the processor. It sounds good to me there; I have not yet set it
side by side with Swords.

## The high-pass

The Wasp's high-pass, trained with exactly the low-pass recipe, learned Res far better than
the low-pass did. I have not tested why. It is **FLT5**.

## Hardware

The same module as [Mirth (amps)](/modules/mirth/): Mirth Lite runs on a stock Daisy
patch.Init(), and full Mirth adds a 64×48 SSD1306 OLED (I²C) in place of the B8 toggle, a
few hook-up wires and a printed panel.

## Capture your module with me

I would like to capture more Eurorack classics this way: filters, folders, drive circuits,
anything whose character lives in its circuit. If you own one and would like to capture it
with me, email info@eight4awish.com. You could run the recordings yourself, with a
DC-coupled interface such as an Expert Sleepers ES-8 or ES-9 and the scripts in the repo
(written for my rig, but not tied to it), and I will help train and compare the networks.
Or, if you are in the UK, lend me the module for a fortnight and I will capture it and send
it back. And if you know of anyone else capturing Eurorack modules like this, I would like
to hear about that too.

## Similar work, not the same

Other people have done something similar, but not the same:

- [GuitarML NeuralSeed](https://github.com/GuitarML/NeuralSeed): amp and pedal captures on a
  Daisy Seed, a GRU with knobs as inputs.
- [Wright, Damskägg and Välimäki, DAFx 2019](https://dafx.de/paper-archive/details/tieFMcaohHBxl_2yPyIGFA):
  recurrent networks modelling amps and pedals in real time.
- [Wright and Välimäki, JAES 2021](https://research.aalto.fi/fi/publications/neural-modeling-of-phaser-and-flanging-effects/):
  phaser and flanger models with the LFO as an input.
- [Simionato and Fasciani, 2025](https://arxiv.org/abs/2405.04124): networks modelling analog
  effects with their controls as inputs, a synth's filter among them.
- Serra and Smith's Spectral Modeling Synthesis (1990) and
  [DDSP](https://arxiv.org/abs/2001.04643) (2020): sound split into a repeatable part and a
  random part, the idea behind putting the wildness back on top.

If I have got any of this wrong, tell me.

## Credits

Recorded and trained by me in October 2026, on the rack's own Wasp and Swords. The seven
filter files are CC BY 4.0, credited in `FILTERS.md` in the card zip: use them, bend them
and share them, with credit. The training scripts and the module's GRU engine are in the
[firmware repo](https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_neural);
Mirth itself is MIT. Not affiliated with, or endorsed by, Doepfer or Behringer.
