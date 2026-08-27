---
title: New pattern banks for Mutable Grids
date: 2026-08-27
eyebrow: Call for testers
summary: >-
  Sorrow's derived drum maps are the same data structure Grids uses, so they
  drop straight into the real module. Three new banks, but no hardware to test
  them on.
graphic: /renders/daisy_grids_flat.png
chips:
  - Call for testers
  - Mutable Grids
  - Drums
repo: >-
  https://github.com/Eight4aWish/eurorack_daisy_patch_init/tree/main/daisy_grids/tools/grids_firmware
downloads:
  - label: grids_latin.wav
    url: /firmware/grids/grids_latin.wav
    note: >-
      Latin, jazz, afro-cuban, afrobeat, New Orleans. The furthest of the
      three from anything Grids does out of the box.
  - label: grids_groove.wav
    url: /firmware/grids/grids_groove.wav
    note: Human drummers, rock through jazz, from the Groove MIDI Dataset.
  - label: grids_club.wav
    url: /firmware/grids/grids_club.wav
    note: >-
      Four-to-the-floor, breakbeat and half-time, picked out of the Groove MIDI
      Dataset by rhythmic signature rather than by genre label.
ask: >-
  I do not own a Grids, and I have not run any of this on real hardware. If you
  have one — or a clone that accepts Grids firmware updates — I would love to
  know whether it works and what it sounds like. Even better, if you are in the
  UK and would lend me one for a fortnight, I will upload the firmware, film the
  result and send it back refreshed with the original firmware.
draft: false
---
## In making the Sorrow video, I had an idea

[**Sorrow**](/modules/sorrow/) is a Grids port for the Daisy patch.Init(), with its own drum voices and drum patterns. In developing the port I learnt that Grids' patterns are a lookup table — machine-learned from a big pile of drum loops, then arranged by hand. Twenty-five hand-selected patterns, 96 bytes each, and X/Y interpolates between the four nearest. All the musicality lives in about 2.4 KB of data. But if you change the data you can have a different instrument running the same engine.

So I built a pipeline that derives a bank from any folder of MIDI: quantises to 16ths, cuts one-bar windows, picks 25 of them and arranges them on a 5×5 grid, then matches each lane's loudness distribution back onto Grids' own so that density and accent behave exactly as they did before.

**The first version of this was wrong, and it is worth saying how.** It used a self-organising map — an algorithm that sorts patterns into 25 piles *and* arranges the piles so neighbours are alike. That sounds exactly right for Grids, because X and Y slide between adjacent cells. It is exactly wrong, for two reasons I did not see until I listened to it properly:

- A self-organising map's whole objective is to *minimise the difference between neighbouring cells*. An algorithm that makes neighbours similar is an algorithm that makes the knob boring.
- Its 25 cells are averages of thousands of patterns, and averages regress toward one another. Twenty-five averages are less distinctive than twenty-five archetypes.

So the banks are now real patterns, which is what Émilie did by hand. Twenty-five are chosen by **farthest-point sampling** — each pick the one least like everything picked so far, measured on which steps fire rather than on raw velocity — and then *arranged* on the 5×5 by swapping cells until neighbours are as related as they can be. Choosing and arranging are separate steps, and only the second one wants similarity.

Then, somewhere near the end of video planning, I realised the obvious thing: **the real Grids uses exactly the same**
**structure.** Same 25 nodes, same 96 bytes, same `drum_map[5][5]`. Which means these banks
are *portable* to real hardware — they are a byte-for-byte data substitution. Same size, no code change, nothing to fit into the flash budget. I just don't own the real hardware to test it out.

## The three banks

The number that matters is how much the pattern actually changes when you move X or Y by
one cell. Measured as steps that flip between silent and sounding, at mid density:

| bank | corpus | one-bar patterns | steps changed per cell move | map ratio |
| --- | --- | ---: | ---: | ---: |
| **Latin** | Groove MIDI, filtered to latin, jazz and afro styles | 9,458 | 17.9 | 84% |
| **Traditional (Rock, Blues etc)** | Groove MIDI, all styles | 21,945 | 17.5 | 83% |
| **Club** | Groove MIDI, by rhythmic signature | 3,663 | 16.8 | 81% |
| *Grids' own factory map, for scale* | *hand-made* | — | *15.5* | *91%* |

None of the three has a **dead edge** — a neighbour pair so alike that the knob move is
inaudible. The self-organising map versions these replace scored 9.4 to 10.9, which is
where "not much seems to be happening" comes from.

The second column is the one I got wrong for a while. It compares how much *neighbours*
differ against how much *distant cells* differ, and it wants to be well under 100%. At 100%
neighbouring cells differ as much as opposite corners — which is a shuffle, not a map:
every knob move jumps to something unrelated, and since X/Y blends the four cells around
you, blending four unrelated patterns averages to much the same mush wherever you stand.
The banks were at 86–89% because the arranging step ran *before* the values were fitted to
Grids' distribution, so the map had been laid out for numbers the nodes no longer held.

**Every node now plays all three drums.** Fitting our patterns onto Grids' value
distribution used to be done a lane at a time across the whole map, and 62% of Grids' values
are zero — so a node quieter than its 24 neighbours collected the bottom of that
distribution and lost a drum outright. Three, five and four of 25 nodes were missing a
voice. Émilie loses none in 75 node-lanes; she does not leave a drum out. Fitting each node
against one of hers instead fixes it by construction.

I used to publish a *coherence* figure here instead. It was a ratio — neighbour distance
against any-pair distance — and I had been reading it as "how smoothly X/Y morphs", which
it is not. Worse, a map of 25 identical patterns scores near 100% on it. It measured the
thing I should have been trying to avoid.

## Getting it onto a module

Grids' bootloader accepts firmware as **FSK-encoded audio through the CLOCK input** — no
programmer, no opening the case.

1. **Hold RESET** while you power the module on. The LEDs flash to confirm the bootloader is listening.
1. Patch an audio output — phone, laptop, interface — into **CLOCK IN**.
1. Play the `.wav` at **full volume**, no EQ, no effects, no Bluetooth. It runs about thirty seconds.
1. The LEDs march along as pages are written, then flash, and the module boots into the new bank.

It is Mutable's own official update path, which means **it is reversible**. Mutable still
publish the stock firmware as an audio file —
[grids_1.0.wav](https://pichenettes.github.io/mutable-instruments-documentation/modules/grids/downloads/grids_1.0.wav) —
and playing that in by exactly the same steps puts the module back as it was. Worth
downloading it before you start, so getting back is not conditional on a website still
being up. There is a `.hex` of each build alongside the audio here if you would rather use
a programmer.

## What I could check without a module

I don't own a Grids, so this is everything that can be established without one — which turned out to be more than I expected:

- **The code is untouched.** All four builds — stock, and the three banks — come out at precisely 12,122 bytes of code and 58 of data. Diff the stock binary against a bank build and every difference sits inside a 2,399-byte span. That is the pattern table and nothing else. Not one byte of program logic changes.
- **The tables are genuinely drop-in.** Fed Grids' own data, the table generator reproduces the block in `resources.cc` byte for byte, whitespace included.
- **The audio carries what it should.** I wrote a decoder that reads each `.wav` back the way the bootloader does — 96 packets, each 128 bytes of firmware plus a CRC32. Every checksum is valid and the recovered bytes match the compiled firmware exactly.
- **And the encoding is checked against a file known to work.** The same decoder reads Mutable's own `grids_1.0.wav` — the one they publish for reverting a module to stock — and recovers all 99 of its packets cleanly. That matters more than the point above: it pins the format to something that has flashed real hardware, rather than to my own assumptions about it. It also caught a real error. My first encode used the encoder's default symbol timings, and Mutable's file measures different ones; against the module's decoder every zero would have read as a one. Those files would never have flashed.

None of which proves it flashes and plays on a real module. That is the ask.

## What is not done

What is missing is somebody to try it on a module that actually exists. I would also like
to know whether these are as good to play as they now measure. A number is not a groove,
and the last time I trusted one over my ears it took a rebuild to find out.

Grids is GPL-3.0, so anything I distribute ships with complete corresponding source. The
tooling, the tables and the derivation scripts are all in the repo linked below — point
`groove_nodes` at your own MIDI folder and it will derive a bank of your own genres.
