---
title: Capture your module with me
date: 2026-11-08
eyebrow: Call for modules
summary: >-
  Mirth plays two filters from my rack as networks, cutoff and resonance
  included. I would like to capture more Eurorack classics, and yours could be
  next.
graphic: /images/capture-rig.jpg
chips:
  - Call for modules
  - Mirth
  - Neural capture
repo: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/blob/main/daisy_neural/CAPTURE.md
ask: >-
  If you own a module whose character lives in its circuit, a filter, a folder,
  a drive, and would like to capture it with me, email info@eight4awish.com.
  You can run the recordings yourself with the guide, and I will help train and
  compare the networks. Or, if you are in the UK, lend me the module for a
  fortnight and I will capture it and send it back. Either way, tell me whether
  you would use a shared library of Eurorack captures.
draft: false
---
## What Mirth's filters showed

Guitarists share captures of amps and pedals by the thousand. Every capture I could find was
an amp or a pedal. So for [Mirth (filters)](/modules/mirth-filters/) I recorded two filters
from my own rack, a Doepfer Wasp and a Behringer Swords, and trained a small network for
each, with the filter's cutoff and resonance as inputs, so the knobs still work on the
module. Each is a GRU of about a thousand parameters, running on a Daisy patch.init.

The test that mattered was a setting no network heard: Res 5 on the Wasp was held back from
training altogether, and the networks scored an ESR of 0.031 there, inside what Neural Amp
Modeler calls "not bad". One network covers the whole dial, gaps included.

## What makes a good candidate

- **It repeats itself.** A network can only learn what a module does every time. Play the
  same input four times: the Wasp matched itself up to Res 7 and went its own way from 8,
  where Mirth puts the wildness back with a layer taken from the recordings.
- **Self-oscillation is a special case.** Where an oscillation starts in its cycle changes
  from take to take, and no network can learn that. Swords was trained below its threshold,
  and its oscillation was built from measurements instead.
- **Controls under CV are easiest.** They can be swept while the recording plays. A control
  that is only a knob means one recording session per position, set by hand.

Filters, wavefolders and drive circuits are the obvious next ones: anything whose character
lives in its circuit rather than in a program.

## What it takes

| | |
|---|---|
| **An interface** | DC-coupled, so it can send CV: three outputs and three inputs, and one cable from an output straight back to an input. Mine is an Expert Sleepers ES-10; an ES-8 or ES-9 should do. |
| **Time** | Half an hour of warm-up, then roughly 75 to 85 minutes of recording per series. Training took 144 minutes per run on a Mac mini, with three runs side by side. |
| **Disk** | 27 to 36 GB per module, recordings and training together. |
| **A terminal** | The scripts are Python. |

The whole path, from the rig to a file on the card, is in
[CAPTURE.md](https://github.com/Eight4aWish/eurorack_daisy_patch_init/blob/main/daisy_neural/CAPTURE.md),
with every command. The capture scripts were written for the Wasp and Swords, so a new
module means adapting one of them; the guide says which parts change.

## Three ways in

1. **Run it yourself** with the guide, and I will help train and compare the networks.
2. **Lend me the module**, if you are in the UK, for a fortnight.
3. **Tell me whether you would use a shared library** of Eurorack captures. And if you know
   of anyone else capturing Eurorack modules like this, I would like to hear about that too.
