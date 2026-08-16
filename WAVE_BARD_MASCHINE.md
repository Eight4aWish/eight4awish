# Getting Maschine expansions onto the Bastl Wave Bard

Research notes, August 2026. Covers the Kastle 2 Wave Bard and the Citadel Wave Bard,
which share the Sample Loader web app and firmware family.

## The short version

1. **The Bard holds 7.5 MB.** That is 89 seconds of mono or 44 seconds of stereo at
   44.1 kHz, 178 seconds mono at 22 kHz. Whatever route you take, the job is *curating
   50–250 short one-shots*, not porting a library. This constraint decides more than
   any tooling choice.
2. **You are right that the samples aren't the sound.** A Maschine kit is
   sample → Sound-level FX → Group FX → Master FX. Only a route that *renders audio out
   of Maschine* keeps the patch. Everything that reads files off disk gives you the dry
   source material.
3. **Recommended route:** render one-shots from Maschine (manually via a bar-grid group
   render for a handful of kits, or scripted in a DAW when you want the whole library),
   curate to banks of 8, then build the draft with `tools/wavebard_pack.py` and generate
   the `.uf2` in Bastl's web app.
4. There is a decent shortcut worth knowing about: **NI's own `.previews` files are
   rendered from the patch, so they already contain the FX** — bulk-convertible with
   NITools, no DAW involved.

---

## 1. The target, measured

Read out of `bastl-instruments/kastle2-webapps` (MIT) rather than marketing copy:

| Property | Value | Source |
| --- | --- | --- |
| Sample memory | 7.5 MB (7,864,320 bytes), everything included | `config.js` `memorySize` |
| Bit depth | 16-bit only | `config.js`, and the reader throws on anything else |
| Sample rates | 44.1 kHz, 22.05 kHz, 11.025 kHz | `config.js` `sampleRates` |
| Banks | 1–32 (6 in the factory pack) | `config.js` `minBanks`/`maxBanks` |
| Samples per bank | 3–32, **and every bank must hold the same number** | `config.js`; the writer throws otherwise |
| Channels | per sample, mono or stereo | sample header, 1 byte |
| Labels | 8 bytes for bank names *and* sample names | `writeString(..., 8)` |
| Scales / rhythms | 3–32 scales, 3–64 rhythms, sequencer length 5–64 | `config.js`, `sequencer.js` |
| Upload formats | wav, aiff, mp3, ogg, aac, m4a | `config.js` `allowedFormats` |
| Firmware | RP2040 UF2, family `0xE48BFF56`, samples at `0x10080000` | `uf2Utils.js` |

Time budget, which is the number that actually bites:

| | 44.1 kHz | 22.05 kHz | 11.025 kHz |
| --- | --- | --- | --- |
| **mono** | 89 s | 178 s | 357 s |
| **stereo** | 45 s | 89 s | 178 s |

Per slot, mono, for common layouts:

| Layout | 44.1 kHz | 22.05 kHz | 11.025 kHz |
| --- | --- | --- | --- |
| 6 banks × 8 = 48 | 1.86 s | 3.7 s | 7.4 s |
| 8 × 8 = 64 | 1.39 s | 2.8 s | 5.6 s |
| 16 × 8 = 128 | 0.70 s | 1.4 s | 2.8 s |
| 32 × 8 = 256 | 0.35 s | 0.70 s | 1.4 s |

For calibration, Bastl's own packs: the factory pack is 6 banks × 8 samples averaging
1.24 s; Oliver Torr's Citadel pack is 9 × 6 averaging 0.96 s. **One expansion kit ≈ one
bank** is the natural unit, and 8–16 kits is a full Bard.

## 2. How the Bard toolchain actually works

The [Sample Loader](https://apps.bastl-instruments.com/wave-bard-sample-loader/) is a
React/Vite app, MIT licensed, everything client-side, installable as a PWA and usable
offline. Source: [`bastl-instruments/kastle2-webapps`](https://github.com/bastl-instruments/kastle2-webapps)
(actively maintained — firmware 1.7 landed in the repo two days before these notes).

Two file types matter:

**`.wavebard` (draft).** A ZIP containing a single `data.json`: settings, scales,
rhythms, and the banks with each sample's **original, unconverted audio** embedded as a
byte array. Conversion to 16-bit/target-rate/mono happens at build time, not at import
time — so a draft is a lossless project file. Keep drafts as your source of truth; they
re-open in the app and you can re-target the sample rate later without re-rendering
anything.

**`.uf2` (firmware).** The app fetches a base firmware (`kastle2-wave-bard-1.7-no-samples.uf2`),
serialises the banks into a `k2wb` blob, wraps that blob as UF2 blocks at `0x10080000`,
merges the two and validates the result. Flash it the way Bastl documents (RP2040
bootloader → drag onto the `RPI-RP2` drive). The app can also *import* a `.uf2` and
recover the banks from it, which is a useful insurance policy.

In-app processing, applied at build time and worth using: fade in / fade out (5 ms
default, kills clicks), trim below a dB threshold, normalise to a dB ceiling. Typing
`idkfa` (or `?advanced=1`) unlocks advanced mode, which adds a raw `SAMPLES.bin` export.

Two consequences for automation, both verified here:

- **Drafts can be generated offline.** `tools/wavebard_pack.py` in this repo builds a
  valid `.wavebard` from folders of WAVs, enforces the equal-samples-per-bank rule,
  applies the app's own filename-cleaning rules, and reports memory use at every
  rate/channel combination before you commit.
- **Whole firmwares can be built headlessly.** Their binary writer and UF2 merger are
  plain JS with no DOM dependency. I ran a generated draft through the real
  `WaveBardBinaryWriter`, `WaveBardBinaryReader`, `generateUf2`, `mergeUf2` and
  `validateUf2` in Node: it produced a valid 10 MB UF2 with `k2wb` sitting at the
  user-data offset, and the size matched the Python estimate to the byte. Only the audio
  *conversion* step needs replacing (it uses Web Audio), and ffmpeg covers that. So a
  fully scripted "expansion in, firmware out" build is achievable if the manual step
  becomes annoying.

### Binary layout (`k2wb`)

| Offset | Field |
| --- | --- |
| 0 | magic `k2wb` |
| 4 | total size, u32 LE |
| 8 | sample rate, u32 |
| 12 | bit depth, banks, samples-per-bank, scales, rhythms, sequencer length, 2 reserved (u8 each) |
| 20 | scales, u32 each (12-bit semitone mask) |
| … | rhythms, u32 each (16-bit step mask, MSB first) |
| … | per bank: 8-byte label, RGB, 1 reserved |
| … | per sample: padded size u32, channels u8, 8-byte label, 3 reserved, then int16 LE data padded to 4 bytes |
| end | marker `ahoj` |

## 3. What's actually in a Maschine expansion

| Content | Format | Carries the FX? |
| --- | --- | --- |
| Maschine kits | `.mxgrp` (group), `.mxsnd` (sound) | Yes — references samples *plus* the Sound and Group FX chains |
| Raw samples & loops | plain `.wav` under the expansion's `Samples/` | No — dry source |
| Battery kits | `.nbkt` | Battery's own FX |
| Synth presets | Massive / Monark / Reaktor Prism | No samples at all |
| Patterns | MIDI | n/a |
| Previews | `.ogg` inside hidden `.previews` folders | **Yes** — rendered from the patch |

`.mxgrp`/`.mxsnd` are Boost serialization archives, sometimes zlib-compressed, with
sample references stored as `Samples/…​.wav` paths relative to the expansion root. That's
how NITools reads them without any NI code.

The signal chain that defeats a straight file copy: **sample → Sound-level insert FX,
amp/filter/pitch → Group FX bus → Master FX**. NI's own marketing is explicit that
Maschine kits are "pre-mapped and enhanced by Maschine's FX chains". Exporting at Sound
level is reported to include the Sound's own FX but *not* Group or Master FX — worth
confirming with one 30-second test on a kit with an obvious group reverb before you
commit to a route.

## 4. The options

### A. Copy the raw samples

Either straight off disk from `Samples/`, or with
[NITools](https://github.com/joanroig/nitools) — a GUI/CLI suite whose Groups Exporter
scans a library folder, parses every `.mxgrp`, and exports each kit's samples in pad
order, with normalisation, silence trimming, sample-rate/bit-depth conversion, a pad
reorder matrix, and blank-pad filling. Built originally to get Maschine kits onto an
SP-404.

- **Fidelity:** dry source only — its own README says it ignores internal VSTs and FX.
- **Effort:** minutes, for an entire library.
- **Verdict:** ideal for drums where the sample *is* most of the sound, and for building
  raw material you'll shape on the Bard's terms. Not a way to keep the expansion's
  character on melodic or heavily-processed patches.

### B. Harvest NI's previews

Every kit and instrument ships with an audition preview (`.previews/Something.mxgrp.ogg`)
which NI rendered *through the patch*, FX included. NITools' Previews Exporter converts
them in bulk to WAV with the same normalise/trim/rate options, and can skip Maschine
folders, Battery kits or the browser preview library.

- **Fidelity:** the real processed sound, minus Ogg lossiness — which matters far less at
  22 kHz mono on a 7.5 MB device than it would in a mix.
- **Catch:** previews are musical phrases, one per kit/instrument, not per-pad one-shots.
  Naming is by internal ID unless you pass `--find_real_instrument_folder`.
- **Verdict:** the fastest way to get FX-laden material, and excellent Bard food if you
  chop it — a 2-second phrase pitched ±2 octaves is exactly what this instrument enjoys.
  Not a substitute for per-pad renders when you want a playable kit.

### C. Render from Maschine standalone — the accurate manual route

`File → Export Audio`, with **Loop Optimize unchecked** so reverb and delay tails
survive (NI's own guidance for one-shot exports).

- Export **Sounds** → one file per pad, Sound-level FX included, Group/Master FX not.
- Export **Groups** → one file per group, everything included.

The trick that gets you both: **build a pattern that hits pad 1 in bar 1, pad 2 in bar 2,
and so on, then export the Group as a single file and slice on the bar lines.** One
render per kit, all FX intact, deterministic slicing with ffmpeg or sox, and the tails
of each hit land inside the following bar rather than being clipped. (The alternative —
solo one sound, export the group, repeat 16× — is equally accurate and 16× the clicking.)

- **Fidelity:** complete.
- **Effort:** a few minutes per kit, no DAW, no scripting.
- **Verdict:** the right route for 6–16 kits, which is a full Bard anyway. This is where
  I'd start.

### D. Resample inside Maschine

`Sampling → Record → Source: Internal`, pick a Group or Sound, and record its output back
into a Sound slot with FX applied.

- **Verdict:** the fastest way to grab one or two signature sounds while you're already
  playing, and it stays in the box. Too manual for bulk work, but the natural companion
  to Option C when something catches your ear.

### E. Batch-render in a DAW — the automatable route

Maschine as a plugin, one instance per group. A group's pads sit on MIDI notes C1–D#2
(36–51 with middle C as C3), so:

1. Load the expansion group into the Maschine plugin.
2. Lay 16 notes on a grid, spaced generously enough for tails (2 bars each is safe).
3. Create a named region per note.
4. Batch render regions → 16 named WAVs, with Sound + Group + Master FX, because you're
   rendering the plugin's output.

In Reaper, [`ez999/reaper-sample-utilities-lua`](https://github.com/ez999/reaper-sample-utilities-lua)
does steps 2–4 — `ExplodeMidiToNotesAndCreateNamedRegions.lua` explodes a MIDI item into
one note per item with matching named regions, then the render matrix does the rest.
"Render selected media items via master" is the manual equivalent and captures any
post-plugin FX chain too. Once the template exists, pointing it at another group is a
preset load.

- **Fidelity:** complete.
- **Effort:** an hour to set up, then minutes per kit.
- **Verdict:** the route if you want to work through a whole shelf of expansions, or
  expect to re-render as your taste changes.

**For melodic patches, one note is enough.** The Bard pitches samples ±2 octaves with
optional scale quantisation, so render each instrument Sound once at C3 with a fixed
note length and let the hardware transpose. Multisampling would eat the entire memory for
one instrument.

### F. Auto-samplers

Logic Pro's Auto Sampler, AutoSimpler or Resampler Pro (Max for Live — Ableton still has
no built-in autosampler), SampleRobot. These produce mapped multisample instruments.

- **Verdict:** worth knowing if you also want these patches in a soft sampler, but they
  solve a problem the Bard doesn't have. Skip for this project.

### Comparison

| | Keeps FX | Per-pad | Bulk-able | Effort | Best for |
| --- | --- | --- | --- | --- | --- |
| A. Raw samples / NITools | ✗ | ✓ | ✓✓ | minutes | drums, raw material |
| B. NI previews | ✓ | ✗ | ✓✓ | minutes | textures, chop fodder |
| C. Maschine group render | ✓ | ✓ (slice) | ~ | minutes/kit | **start here** |
| D. Internal resampling | ✓ | ✓ | ✗ | manual | one-off grabs |
| E. DAW batch render | ✓ | ✓ | ✓ | setup then fast | whole library |
| F. Auto-sampler | ✓ | n/a | ✓ | high | other targets |

## 5. End-to-end pipeline

```bash
# 1. Render. Option C: one Maschine group render per kit, Loop Optimize off,
#    one pad hit per bar. Say 8 kits at 120 bpm, 16 bars = 32 s each.

# 2. Slice on the bar grid (2 s per bar at 120 bpm).
ffmpeg -i kit.wav -f segment -segment_time 2 -c copy pads/pad_%02d.wav

# 3. Convert to what the Bard will store anyway — mono, 22.05 kHz, 16-bit —
#    so you audition what you'll actually hear. (Or skip and let the app do it.)
for f in pads/*.wav; do
  ffmpeg -i "$f" -ac 1 -ar 22050 -sample_fmt s16 "banks/KIT01/$(basename "$f")"
done

# 4. Curate to exactly 8 per bank, one folder per bank. Name so the FIRST 8
#    CHARACTERS are unique — that is all the Bard displays.
#    e.g. 1kick.wav 2snare.wav 3hatcl.wav 4hatop.wav ...

# 5. Build the draft and check the budget.
python3 tools/wavebard_pack.py banks/* -o maschine.wavebard --mono --rate 22050

# 6. Drop the draft on apps.bastl-instruments.com/wave-bard-sample-loader,
#    check levels, generate the UF2, flash it.
```

`wavebard_pack.py --dry-run` reports per-bank seconds and total memory at every
rate/channel combination before writing anything, which is the fastest way to find out
that your 16 kits need to be 8.

## 6. Curating for eight slots

- **Tails are free character.** You can't add reverb on the Bard, so render the FX-laden
  tail *into* the sample. The LENGTH knob and its reversing envelope reward samples with
  something happening after the transient.
- **One-shots beat loops.** Pitch and speed are linked, so a tempo-locked loop only works
  at one knob position; a one-shot works everywhere.
- **Mono unless the stereo is the point.** It literally doubles what fits.
- **22.05 kHz is the sweet spot.** It doubles capacity and the aliasing/HF loss reads as
  character on this instrument. Reserve 44.1 kHz for a bank of hats and detail.
- **Build banks as playable sets of 8**, not as inventory: kick, snare, two hats, two
  percs, one tonal, one texture. Remember all banks must hold the same count.

## 7. Licensing

NI's terms allow the samples to be used freely in your own productions, commercial
included, but explicitly prohibit redistributing or repackaging them as sounds — which
is what a shared `.wavebard` or `.uf2` would be. So: render, convert and flash for your
own Bard freely; don't publish the banks, the drafts or the firmware. Bastl's own factory
samples are "all rights reserved" too, so a merged firmware containing both is doubly
un-shareable. Some expansion content is third-party licensed on top of that.

## 8. Confidence

**Verified directly** — everything in §1, §2 and the binary layout, by reading the MIT
source and round-tripping a generated draft through Bastl's own writer, reader, UF2
generator, merger and validator in Node. The generated firmware validated and the sample
blob landed at `0x10080000`; `tools/wavebard_pack.py`'s size estimates matched the real
writer's output exactly at both 44.1 kHz stereo and 22.05 kHz mono.

**From secondary sources** — the Maschine behaviours (export options, Loop Optimize, pad
MIDI mapping, internal resampling) and the 89 s/44 s capacity figures. Sound-level export
excluding Group FX is the one claim I'd test yourself before building a workflow on it.

**Not reachable from this environment** — `bastl-instruments.com`, `native-instruments.com`
and several gear sites are blocked by the proxy here, so the Bard helpline page, the
official manual and the flashing procedure came via search summaries and the repo rather
than first-hand. Check the helpline page for the bootloader button combo.

## 9. Next steps

- Test the Sound-vs-Group FX question on one kit with an obvious group effect.
- Try Option B first for a quick win: NITools previews → chop → one bank, an hour's work,
  and it tells you how the expansion's character survives 22 kHz mono.
- If Option C proves too slow at scale, build the Reaper template (Option E).
- If the web-app step becomes the bottleneck, finish the headless builder — the binary and
  UF2 halves are proven, only ffmpeg-based conversion is missing.

## Links

- [bastl-instruments/kastle2-webapps](https://github.com/bastl-instruments/kastle2-webapps) — Sample Loader source (MIT)
- [Wave Bard Sample Loader](https://apps.bastl-instruments.com/wave-bard-sample-loader/)
- [Wave Bard helpline](https://bastl-instruments.com/support/helpline/wave-bard) · [Kastle 2 FAQ](https://bastl-instruments.com/support/helpline/kastle2-wave-bard)
- [joanroig/nitools](https://github.com/joanroig/nitools) — Maschine group and NKS preview exporters
- [monomadic/ni-file](https://github.com/monomadic/ni-file) · [maxton/nkxtract](https://github.com/maxton/nkxtract) — NI format reverse engineering
- [ez999/reaper-sample-utilities-lua](https://github.com/ez999/reaper-sample-utilities-lua) — MIDI-to-regions batch sampling
- [Exporting sounds and groups in Maschine](https://maschinetutorials.com/how-to-export-your-audio-from-scenes-groups-and-individual-sounds/) · [NI export guide](https://support.native-instruments.com/hc/en-us/articles/4409431986705-How-to-Export-Audio-from-Maschine-to-a-DAW-Track)
- [NI EULA](https://www.native-instruments.com/en/company/legal-information/end-user-license-agreement/) · [commercial use FAQ](https://support.native-instruments.com/hc/en-us/articles/210264205-Can-I-Use-Native-Instruments-Sounds-for-Commercial-Music-Production)
