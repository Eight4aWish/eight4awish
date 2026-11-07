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

The first bank, **AMPS**, plays twelve of those captures. The second, **NOT-AMPS**, takes the same amps but messes with the parameters to create effects that are definitely not real amps. A third bank, **FILTERS**, has its own page: [Mirth (filters)](/modules/mirth-filters/).

Named — like everything here — after the nursery rhyme, in the version that runs *one*
*for sorrow, two for mirth*. Not affiliated with, or endorsed by, Neural Amp Modeler,
TONE3000, Electrosmith, or the makers of the amps and pedals captured. Product names
describe what was captured.

## The amps

Mirth comes with twelve captures, the **starter set**, in the card files beside the
firmware. They are amps and pedals, some with a speaker in the capture and some without.
Their creators share them on TONE3000, eight under CC BY and four under CC0, and each is
credited, with the changes made, in `STARTER_CAPTURES.md`.

| # | Screen | Captured from | By | Licence |
| --- | --- | --- | --- | --- |
| 1 | `SVT-2 PRO` | [Ampeg SVT-2 Pro](https://www.tone3000.com/tones/ampeg-svt-2-pro-5728) | [cobraska](https://www.tone3000.com/cobraska) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 2 | `ORANGE TH` | [Orange TH100](https://www.tone3000.com/tones/orange-th100-6554) | [tupalosa](https://www.tone3000.com/tupalosa) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 3 | `FENDER 57` | [Fender '57 Custom Deluxe A1 Conversion](https://www.tone3000.com/tones/fender-57-custom-deluxe-a1-conversion-5590) | [danielnguyen](https://www.tone3000.com/danielnguyen) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 4 | `BLUESBRKR` | [Marshall Bluesbreaker Pedal (Original)](https://www.tone3000.com/tones/marshall-bluesbreaker-pedal-original-1778) | [chrisedmo](https://www.tone3000.com/chrisedmo) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 5 | `KLON` | [Klon Centaur (Silver)](https://www.tone3000.com/tones/klon-centaur-silver-2599) | [seanashe](https://www.tone3000.com/seanashe) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 6 | `PLEXI LORE` | [pLEXI-LORE](https://www.tone3000.com/tones/plexi-lore-1863) | [greyback05](https://www.tone3000.com/greyback05) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 7 | `SUNBENDER` | [Analogman Sun Bender MKIV (3 NOS Mullard)](https://www.tone3000.com/tones/analogman-sun-bender-mkiv-3-nos-mullard-5609) | [danielnguyen](https://www.tone3000.com/danielnguyen) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 8 | `TWO ROCK` | [Two Rock Studio Signature + OX Box 2x12 Two Rock Cab (V2)](https://www.tone3000.com/tones/two-rock-studio-signature-ox-box-2x12-two-rock-cab-v2-5367) | [danielnguyen](https://www.tone3000.com/danielnguyen) | [CC BY](https://creativecommons.org/licenses/by/4.0/) |
| 9 | `KAY 703` | [Kay 703](https://www.tone3000.com/tones/kay-703-6302) | [aazuspan](https://www.tone3000.com/aazuspan) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| 10 | `TRAYNOR` | [Traynor TS 120 B](https://www.tone3000.com/tones/traynor-ts-120-b-6333) | [rbrt](https://www.tone3000.com/rbrt) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| 11 | `BUGERA G5` | [Bugera G5 Infinium Pack](https://www.tone3000.com/tones/bugera-g5-infinium-pack-6151) | [durchschnittsmusiker](https://www.tone3000.com/durchschnittsmusiker) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| 12 | `DIY BJT` | [DIY drive pedal (BJT silicon) + Celestion Eight 15 IR](https://www.tone3000.com/tones/diy-drive-pedal-bjt-silicon-celestion-eight-15-ir-5700) | [test98425988](https://www.tone3000.com/test98425988) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |

Each one is a single setting of the real thing, so there are no tone knobs: you play it
with **DRIVE**, into the network, and **MIX**. They are levelled to one loudness as the ear
hears it (A-weighted), so the bass amps do not sound quiet. The Orange TH100 is also built
into the firmware, so a module with no card still plays. The not-amps are built from
these twelve, so copy them all to the card. With a capture running, the processor sits at
about 64%.

## An amp as a patch

So what actually is an amp and a speaker, as a patch? Take it apart, and there are only a
few kinds of module in there. The tone controls, and the capacitors between the stages, are
filters. The valves are waveshapers: close to linear around the middle, then they flatten
the peaks of the wave, and not evenly, as if there is an offset going in. On a big note, many amps
pull their own power supply down, and that is a compressor. And the speaker is a cone on a
spring, so it has a resonance: hit it and it rings on. That is a resonant band-pass filter,
with some more flattening when it reaches the end of its travel. Some captures include the
speaker, and some are the amp alone.

### Why a network can copy it

Each neuron reads the current sample of audio and some earlier ones. That reaching back in
time is a delay, and by the last layer it reaches about 132 milliseconds, long enough to
catch a speaker ringing on and an amp recovering from a big note. Each of those samples is
multiplied by a weight and they are added up, and the weights are what make a filter.

Put the delay and the filter together and some frequencies cancel while others are
amplified. With enough of them lined up at one frequency, it keeps going after the input
stops. That is the resonance, the ringing.

Then the activation squashes the values, flattening anything below zero almost to nothing,
and that makes it a waveshaper, like the valves. A fixed amount added just before it, called the bias,
moves where the squashing starts, which is where the unevenness comes from.

An amp and a cab have many elements that affect the sound, so the network has to be big
enough to capture the nuance. A2-Lite has 23 layers, three lanes side by side, and 1,871
parameters, the weights and biases: big enough for that, and small enough for a Eurorack
module. Training plays the same signal through the real amp and the network, and adjusts
those numbers until the two match.

### What a capture cannot do

The network only sees the last 132 milliseconds, so anything slower cannot be in a capture.
It learns one setting of the amp, so the amp's own knobs are frozen: on Mirth you can drive a capture harder or softer and mix it with the dry signal, but not turn the amp's gain or tone. And amps flatten,
they do not fold: turn every neuron into a wavefolder, and it stops sounding like an amp.
Which is where the second bank starts.

## The not-amps

Nineteen not-amps: fifteen built from the starter captures, four from random numbers.
Each is changed in one way while it plays, with one control, **STEER**, that you can turn
or patch. They were chosen by measurement first: every candidate was compared with 236
real amp captures, by audio descriptors and by a neural model of how things sound, and
only those that leave the region where amps sit were kept — then by ear.

| Screen | Built from | What changes | The control |
| --- | --- | --- | --- |
| `SINE BUG` | Bugera G5 | every neuron becomes a sine — a wavefolder inside the network | how hard it folds |
| `TANH BJT` | DIY BJT drive | every neuron becomes a softer waveshaper, a tanh curve | how hard it squashes |
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

## Controls

The knobs and jacks are the same on both builds. Each knob is summed with the CV jack
under it.

| Control | AMPS | NOT-AMPS |
| --- | --- | --- |
| **CV\_1** (+ CV_5) | MIX, dry to wet | MIX |
| **CV\_2** (+ CV_6) | — | STEER, the not-amp's control |
| **CV\_3** (+ CV_7) | — | — |
| **CV\_4** (+ CV_8) | DRIVE into the network, −20 to +20 dB, unity at noon | DRIVE |
| **B7** short | the next patch in the bank | |
| **B7** held 1.5 s | the next bank: AMPS → NOT-AMPS → FILTERS | |

Audio in on IN_L; the same mixed signal on both outputs. MIX fully down is the dry input
alone, for comparing. DRIVE changes the sound far more than the level: most of the
captures grow more harmonics as it rises while their output hardly moves. It matters more
than I expected: set too high, it brings in a harsh digital edge. The artifacts I cut from
my first rack recording came from DRIVE, not from the captures, so set it by ear. Each bank
remembers its place, so going round the banks comes back to where you were. In FILTERS,
knobs 2 and 3 are FREQ and RES: see [Mirth (filters)](/modules/mirth-filters/).

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
the panel. The splash shows the build.

## Hardware

**Bill of materials:** Mirth Lite runs on Daisy patch.Init(). For full Mirth add a 64×48 SSD1306 OLED (I²C) screen · a few hook-up wires · and a printed panel. The same screen and wiring as Joy: replacing the B8 toggle with the OLED for more feedback during use.

### Build your own patch.Init()

The patch.Init() is often out of stock, but it is easy to build your own. Daisy Audio
publishes the design on its [patch.Init() page](https://docs.daisy.audio/product/Daisy-Patch-Init/):
one download holds the control board's Gerbers and KiCad files, a PCB front panel and a
parts list. Order the boards, add a Daisy Patch Submodule, and the rest is easy to get: 13
jacks, 4 pots, a button, a toggle, an LED and a microSD socket. My Joy is built this way,
with a printed panel.

Two things to watch on the parts list: it shows one 2×5 socket, but the board takes four,
and it doesn't include knobs.

## More captures

Download A2 captures from TONE3000 — filter by architecture — and copy
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
- **The knobs have moved.** Knob 1 is MIX, 2 STEER, 4 DRIVE; B7
  now steps through the patches, so a patch can no longer be chosen by CV, and there is
  no bypass (MIX fully down is the dry input). On Mirth Lite the B8 toggle no longer
  picks the bank: hold B7. FRZ E TR has gone, and the not-amps have new numbers.

## Similar work, not the same

Other people have done something similar, but not the same:

- [roccoagain/nam-seed3](https://github.com/roccoagain/nam-seed3): A2-Lite on a Daisy Seed.
- [oyama/pico-neural-amp-modeler-demo](https://github.com/oyama/pico-neural-amp-modeler-demo):
  A2-Lite on an RP2350.
- [Damskägg, Juvela, Thuillier and Välimäki, ICASSP 2019](https://research.aalto.fi/en/publications/deep-learning-for-tube-amplifier-emulation/):
  WaveNet-style tube amp emulation.
- [Steinmetz and Reiss, 2020](https://arxiv.org/abs/2010.04237): random networks tend to
  delay and resonance.

If I have got any of this wrong, tell me.

## Credits

Mirth plays captures from [Neural Amp Modeler](https://www.neuralampmodeler.com/), Steven
Atkinson's open-source project. The A2 engine is Keith Shepherd's, from
[DaisySeedProjects](https://github.com/bkshepherd/DaisySeedProjects) (MIT), based on code
nadavb shared on the Daisy forum. The twelve captures are their creators', credited in
[`STARTER_CAPTURES.md`](https://github.com/Eight4aWish/eurorack_daisy_patch_init/blob/main/daisy_neural/STARTER_CAPTURES.md).
The filters are credited on [Mirth (filters)](/modules/mirth-filters/). Built on
Electrosmith's libDaisy. Mirth itself is MIT.
