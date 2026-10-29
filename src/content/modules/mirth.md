---
title: Mirth (amps)
date: 2026-10-03
summary: >-
  Neural network amp modelling on a Daisy patch.Init() — and nineteen not-amps,
  captures bent inside the network to create unique effects.
platform: Patch Submodule
tags:
  - Effect
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
    Mirth runs from the Daisy's QSPI chip through the Daisy bootloader: a
    one-time bootloader install, then the firmware goes on with an SD card. The
    same card then holds the captures. No compiler needed.
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
      well, the `notamps` folder included. The not-amps are built from these
      files, by name.
    - >-
      Insert the card and power-cycle. The bootloader flashes the firmware if it
      differs from what is installed, and boots.
  extrasNote: >-
    The firmware is for a patch.Init() with the OLED fitted; Mirth Lite is for a
    stock patch.Init(), no screen. Both flash the same way and both take the
    same card: the zip holds the twelve starter captures, the five files the
    not-amps need in `notamps`, the seven filters, their credits, and these
    card instructions. Coming from v1.0.0? See "Updating from v1.0.0" below.
  links:
    - label: Daisy Web Programmer
      url: https://flash.daisy.audio
    - label: TONE3000 (filter for A2)
      url: https://www.tone3000.com/
  note: >-
    On a Mac, Finder writes a hidden twin of every file — ._mirth.bin,
    ._n02_ORANGE_TH.a2nb. The .bin twin confuses the bootloader and the capture
    twins fail their checksum. After copying, delete them in Terminal with `rm
    -f /Volumes/DAISY/._* /Volumes/DAISY/notamps/._*` — the usual `cp -X` no
    longer prevents them on current macOS.
draft: false
---
## Overview

**Mirth** runs neural amp modelling captures on a Daisy patch.Init(). It comes in two
builds: **Mirth Lite**, for an unmodified patch.Init(), and **Mirth**, which adds a small
screen (see Hardware).

A capture is a small neural network trained to behave like one particular amp. For Mirth we use NAM's A2-Lite neural network: 23 layers, each a dilated causal convolution with a LeakyReLU activation, joined by residual and skip connections — 1,871 parameters in all. Small enough for a Eurorack module, and a format TONE3000's library lets you filter for.

That is the first bank, **AMPS**. The second, **NOT-AMPS**, takes the same amps but messes with the parameters to create effects that are definitely not real amps.

The third, **FILTERS**, plays two real filters from the rack as neural networks — a
Doepfer A-124 Wasp and a Behringer Swords — with cutoff and resonance as knobs. It has
its own page, [Mirth (filters)](/modules/mirth-filters/): the same firmware and card.

Named — like everything here — after the nursery rhyme, in the version that runs *one*
*for sorrow, two for mirth*. Not affiliated with, or endorsed by, Neural Amp Modeler,
TONE3000, Electrosmith, Doepfer or Behringer.

## The not-amps

Nineteen not-amps: fifteen built from the starter captures, four from random numbers.
Each is changed in one way while it plays, with one control, **STEER**, that you can turn
or patch. They were chosen by measurement first: every candidate was compared with 236
real amp captures, by audio descriptors and by a neural model of how things sound, and
only those that leave the region where amps sit were kept — then by ear.

| Screen | Built from | What changes | The control |
| --- | --- | --- | --- |
| `SINE BUG` | Bugera G5 | every neuron becomes a sine — a wavefolder inside the network | how hard it folds |
| `TANH BJT` | DIY BJT drive | every neuron becomes a soft clipper | how hard it clips |
| `LINEAR TR` · `LINEAR TRY` · `LINEAR ORG` | Two Rock · Traynor TS 120 B · Orange TH100 | every neuron loses its bend, toward a straight line | trained → linear |
| `RECT ORG` | Orange TH100 | every neuron bends the other way, toward a full-wave rectifier | trained → rectified |
| `FB100 F57` | Fender 57 | its output fed back into its input, at 100 Hz | loop gain |
| `FRZ M F57` · `FRZ M KAY` | Fender 57 · Kay 703 | one layer's output held, mid-network | how long it holds |
| `FOLD ORG` | Orange TH100 | a wavefolder inside the network | how hard it folds |
| `RATE SVT` · `RATE F57` | SVT-2 Pro · Fender 57 | the network run at a fraction of the sample rate | ÷1, 2, 3, 4, 6 |
| `PAST BLU` · `PAST PLX` | Bluesbreaker · pLEXI-LORE | pushed past itself, away from another amp | how far past |
| `MUTATE KAY` | Kay 703 | every weight nudged the same random way | how far |
| `RND1 SCALE` · `RND4 SCALE` · `RND6 SCALE` · `RND7 SCALE` | random numbers, no amp at all | every weight scaled | ×1.5 to ×3 |

The four RND not-amps and MUTATE KAY need the five files in the zip's `notamps` folder;
AMPS never lists them, since they are not amps.

## The filters

Seven, on the same card: FLT1 to FLT7, a Wasp and a Swords learned from recordings of
the real modules, with FREQ and RES, and RES goes to 11. What each one is, how they
were trained and how they sound: [Mirth (filters)](/modules/mirth-filters/).

## Controls

The knobs and jacks are the same on both builds. Each knob is summed with the CV jack
under it.

| Control | AMPS | NOT-AMPS | FILTERS |
| --- | --- | --- | --- |
| **CV\_1** (+ CV_5) | MIX, dry to wet | MIX | MIX |
| **CV\_2** (+ CV_6) | — | STEER, the not-amp's control | FREQ, the cutoff; the jack adds its volts, as on the real filter |
| **CV\_3** (+ CV_7) | — | — | RES, 0 to 11 |
| **CV\_4** (+ CV_8) | DRIVE into the network, −20 to +20 dB, unity at noon | DRIVE | DRIVE |
| **B7** short | the next patch in the bank | | |
| **B7** held 1.5 s | the next bank: AMPS → NOT-AMPS → FILTERS | | |

Audio in on IN_L; the same mixed signal on both outputs. MIX fully down is the dry input
alone, for comparing. DRIVE changes the sound far more than the level: most of the
captures, and the filters, grow more harmonics as it rises while their output hardly
moves. Each bank remembers its place, so going round the banks comes back to where you
were.

### Mirth Lite — no screen

| Control | Job |
| --- | --- |
| **B7** short | the next patch in the bank |
| **B7** held 1.5 s | the next bank |
| **B8** toggle | unused |
| **LED** | on every change: the bank as one, two or three quick flickers (AMPS, NOT-AMPS, FILTERS), a pause, then the patch's number — a long blink is five, so 7 is long-short-short — then lit. A fast flicker that never stops: no captures on the card |

### Mirth — with the screen

The screen shows what is playing and its place in the bank (`AMP 2/12`), an input meter
(before the drive), the CPU load, and the knobs' values laid out as the knobs sit on
the panel: the mix, the steer or cutoff, the resonance, the drive. The splash shows the
build.

## Hardware

**Bill of materials:** Mirth Lite runs on Daisy patch.Init(). For full Mirth add a 64×48 SSD1306 OLED (I²C) screen · a few hook-up wires · and a printed panel. The same screen and wiring as Joy: replacing the B8 toggle with the OLED for more feedback during use.

## Captures

Mirth comes with twelve captures, the **starter set**, in the card files beside the
firmware: eight CC BY and four CC0, by their creators on TONE3000. Each is credited —
creator, source, licence and the changes made — in `STARTER_CAPTURES.md`, which is in the
download and in the firmware repo. The not-amps are built from them, so copy all twelve to
the card. They are levelled to one loudness as the ear hears it (A-weighted), so the
bass amps do not sound quiet. The Orange TH100 is also built into the firmware, so a
module with no card still plays.

**More captures:** download A2 captures from TONE3000 — filter by architecture — and copy
the `.nam` file to the root of the card. At the next boot Mirth converts it: it takes
the A2-Lite network, names it from the file, levels it with the rest and writes the
capture beside it, about three seconds a file, then moves the `.nam` into `nam_done`, or
into `nam_refused` with the reason on the screen if it is not an A2 capture.
`tools/nam_to_a2nb.py` in the firmware repo does the same on a computer. Up to 32 on a
card. Most captures on TONE3000 are licensed for your own use, so they can go on your
card but not be passed on.

## Updating from v1.0.0

- **Replace the firmware** with v1.1.0's `.bin`.
- **Replace the twelve starter captures** with the zip's: the same networks, now
  levelled by A-weighted loudness rather than RMS (v1.0.0's SVT played about 2 dB quiet,
  its Sun Bender 4 dB loud).
- **Copy the `notamps` folder** to the card: without it the four RND not-amps and
  MUTATE KAY show `N need cap`.
- **The knobs have moved.** Knob 1 is MIX, 2 STEER (FREQ in FILTERS), 3 RES, 4 DRIVE; B7
  now steps through the patches, so a patch can no longer be chosen by CV, and there is
  no bypass (MIX fully down is the dry input). On Mirth Lite the B8 toggle no longer
  picks the bank: hold B7. FRZ E TR has gone, and the not-amps have new numbers.

## Credits

The A2 engine is Keith Shepherd's, from
[DaisySeedProjects](https://github.com/bkshepherd/DaisySeedProjects) (MIT), based on code
nadavb shared on the Daisy forum. The twelve captures are their creators', credited in
[`STARTER_CAPTURES.md`](https://github.com/Eight4aWish/eurorack_daisy_patch_init/blob/main/daisy_neural/STARTER_CAPTURES.md).
The filter networks were trained on recordings of the rack's own Wasp and Swords, credited
in `FILTERS.md` and described on [Mirth (filters)](/modules/mirth-filters/).
Built on Electrosmith's libDaisy. Mirth itself is MIT.
