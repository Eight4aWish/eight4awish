---
title: New pattern banks for Mutable Grids
date: 2026-08-22
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
      Latin, jazz, afro-cuban, afrobeat, New Orleans. The most coherent map of
      the three, and the furthest from anything Grids does out of the box.
  - label: grids_groove.wav
    url: /firmware/grids/grids_groove.wav
    note: Human drummers, rock through jazz, from the Groove MIDI Dataset.
  - label: grids_club.wav
    url: /firmware/grids/grids_club.wav
    note: >-
      Four-to-the-floor, breakbeat and half-time, picked out of the Lakh dataset
      by rhythmic signature.
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

So I built a pipeline that derives a bank from any folder of MIDI: quantises to 16ths, cuts two-bar windows, boils the result down to 25 patterns arranged on a 5×5 grid, then matches each lane's loudness distribution back onto Grids' own so that density and accent behave exactly as they did before.

The arranging is the interesting part, and it is why this uses a **self-organising map** rather than ordinary clustering. Clustering would give you 25 sensible piles of patterns in arbitrary order — so pile 3 might be nothing like pile 4. A self-organising map sorts *and* arranges at once: it finds the cell closest to each pattern, nudges that cell towards it, and nudges its neighbours a little too. Do that a few thousand times and neighbouring cells end up genuinely alike.

Which is exactly what Grids needs, because X and Y slide *between* adjacent cells. Arbitrary order and the knobs jump between unrelated beats; a proper map and they morph.

Then, somewhere near the end of video planning, I realised the obvious thing: **the real Grids uses exactly the same**
**structure.** Same 25 nodes, same 96 bytes, same `drum_map[5][5]`. Which means these banks
are *portable* to real hardware — they are a byte-for-byte data substitution. Same size, no code change, nothing to fit into the flash budget. I just don't own the real hardware to test it out.

## The three banks

Coherence below is a *ratio*: how far apart neighbouring cells are, against how far apart
any two cells are. It says the map is ordered rather than scrambled — the same twenty-five
patterns in a random arrangement score far lower.

It does **not** mean the knob morphs more smoothly, which is what I first assumed and it is
worth stating plainly. That is governed by the neighbour distance on its own, and all four
banks sit within a few per cent of each other there. A high ratio mostly means the far
corners of the map are far apart — more ground covered, not a smoother path across it.

| bank | corpus | patterns | coherence |
| --- | --- | --- | --- |
| **Latin** | Groove MIDI, filtered to latin, jazz and afro styles | 4,793 | **41.9%** |
| **Traditional (Rock, Blues etc)** | Groove MIDI, all styles | 11,155 | 38.8% |
| **Club** | Lakh, by rhythmic signature | 60,000 | 34.9% |
| *Grids' own, for comparison* | Émilie's 25 hand-authored patterns | — | 14.8% |

Émilie's map scoring lowest is not a defect and not something to beat. Her twenty-five
patterns are a tight family — any two of them differ by 42 where any two of Latin's differ
by 59 — so the denominator is small and the ratio comes out low. Her *neighbours* are 36
apart against Latin's 34, which is to say her map covers slightly more ground per turn of
the knob, not less.

Her hand-ordering is worth 9.6 points on its own: the same patterns in declaration order
score 5.2%, arranged on her 5×5 they score 14.8%. She ordered it by ear and it measurably
works.


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
to know whether the jazz/latin bank is as good to play as it measures — coherence is a
number, and a number is not a groove.

Grids is GPL-3.0, so anything I distribute ships with complete corresponding source. The
tooling, the tables and the derivation scripts are all in the repo linked below — point
`groove_nodes` at your own MIDI folder and it will derive a bank of your own genres.
