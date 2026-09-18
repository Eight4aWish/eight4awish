# Module inventory

Every module across every repo, in one place — the reference to hand to Claude at the
start of a session, since no single repo sees them all.

**This file is the canonical copy.** It lives here, at the top of the tree, because this
is the site repo the other repos hang off. Every repo's `CLAUDE.md` points at it.

Source of truth for anything published is `eight4awish/src/content/modules/*.md`
(that collection drives the website). This file is the superset: it also carries the
modules that have no page yet, and the repo/firmware mapping that the site frontmatter
does not record.

**Repos:** `eurorack_modules` (firmware monorepo) · `eurorack_daisy_patch_init` (Daisy) ·
`eurorack_electronics` (analog + layout tooling) · `tiliqua` (FPGA, fork of apfaudio) ·
`eight4awish` (site) · `eight4awish-video` (Remotion motion graphics) ·
`seeed-recorder` (RP2040 module + Mac app) · `eurorack_electronics_private` (third-party
reference material only) · `eight4awish_private` (strategy/roadmap, private)

---

## Released — the rhyme-named family

Named after *"one for sorrow, two for joy…"*. These have a site page, a panel STL, a
tagged release and a downloadable binary.

| Module | Repo | Firmware | Platform | Version | Based on | Licence |
|---|---|---|---|---|---|---|
| **Sorrow** | `eurorack_daisy_patch_init` | `daisy_grids/` | Daisy Patch Submodule | v2.4.1 | MI Grids | GPL-3.0-or-later |
| **Joy** | `eurorack_daisy_patch_init` | `daisy_braids_oled/` | Daisy Patch Submodule | v1.4.0 | MI Braids | MIT |
| **Joy Lite** | `eurorack_daisy_patch_init` | `daisy_joy_lite/` | Daisy Patch Submodule | v1.4.0 | MI Braids | MIT |
| **Girl** | `eurorack_modules` | `src/ksoloti_elements/` | Ksoloti Big Genes | v1.2.3 | MI Elements | MIT |
| **Silver** | `tiliqua` | `gateware/src/top/silver/` | Tiliqua (FPGA) | mesh-0.5 | original | — |
| **Gold** | `tiliqua` | `gateware/src/top/gold/` | Tiliqua (FPGA) | mesh-0.5 | original | — |

Notes:
- **Joy / Joy Lite** are one macro-oscillator generation on shared DSP and calibration,
  so they carry the same version. Joy is the 48-model OLED version; Joy Lite is
  screenless, a curated 16 models. Joy Lite has no page of its own — it ships as an
  extra binary on Joy's page.
- **Silver / Gold** share the `mesh/` 2D-mesh base and ship as one site page
  (`tiliqua.md`, titled "Silver/Gold"). Silver is a stereo struck drum head, Gold a
  stereo scanned wavetable. Working names during development were LACUNA and ORBITA.
- **Sorrow is GPL-3.0-or-later** (Grids is copyleft, unlike most MI sources) and runs
  `BOOT_SRAM`, so it needs the Daisy bootloader.

## Built, page drafted

Have a `src/content/modules/*.md` entry with `draft: true` — awaiting write-up + video.

| Module | Repo | Firmware | Platform | Page |
|---|---|---|---|---|
| **Boy** | `eurorack_modules` | `src/teensy_move/` | Teensy 4.1 | `boy.md` |
| **Chaos** | `eurorack_modules` | `src/teensy_chaos/` | Teensy 4.1 | `chaos.md` |
| **CortHex** | `eurorack_modules` | `src/nanoesp32_corthex/` | Arduino Nano ESP32 (NORA-W106 / ESP32-S3) | `corthex.md`. CV6 is a 0–5 V gain CV that drives **either** the Behringer Four Play or a Thonk T03, whichever is patched — `main.cpp:1048` and `proxy.py` name different ones and both are valid. |
| **Daisy MultiOsc** | `eurorack_daisy_patch_init` | `daisy_multiosc/` | Daisy Patch Submodule | `daisy-multiosc.md` |
| **Daisy MultiFX** | `eurorack_daisy_patch_init` | `daisy_multifx_oled/` | Daisy Patch Submodule | `daisy-multifx.md` |
| **Pico2W OnC Lite** | `eurorack_modules` | `src/pico2w_oc/` | Pico 2 W | `pico2w-onclite.md`. Same board as the EuroPi, so board-level findings transfer between them. |
| **ESP32 ClkLinkRec** | `eurorack_modules` | `src/esp32_clklinkrec/` | XIAO ESP32-C5 | `esp32-clklinkrec.md` — the **HTTP/WiFi** trigger path into Seeed Recorder, for a rig that moves. Protocol v2.0, mDNS `_recorder._tcp.local.` on port 8765, with a `RECORDER_HOST` fallback in `secrets.h`. |
| **AMYboard PatchBank** | `eurorack_modules` | `src/amyboard_patchbank/` | shorepine AMYboard (ESP32-S3) | `amyboard.md` |
| **Dual Pingable LPG** | `eurorack_electronics` | `docs/lpg_*` | analog (Buchla 292 path) | `dual-lpg.md` |

## Built, no page yet

Nothing in `src/content/modules/` covers these.

| Module | Repo | Firmware / docs | Platform | What it is |
|---|---|---|---|---|
| **Daisy MultiFX (Seed)** | `eurorack_daisy_patch_init` | `daisy_multifx_seed/` | bare Daisy Seed + home-built Eurorack front end | Sibling of Daisy MultiFX on different hardware. Same `multifx_core` DSP/UI, 16 effects in 4×4. Migrated off DaisyDuino onto libDaisy + current DaisySP. |
| **Seeed Recorder (RP2040)** | `seeed-recorder` | `firmware/` | Seeed Xiao RP2040 | Capture trigger for the Retrospective Mac app over **USB-MIDI** (button → Note On; Note On → LED). Momentary switch on `D5`, LED on `D0`. **USB-powered — no Eurorack bus power in v1.** Built with arduino-pico + Adafruit TinyUSB. Any MIDI controller sending the same Note triggers it too. |
| **ESP32 ClkLink** | `eurorack_modules` | `src/esp32_clklink/` | ESP32-Dev + MCP4728 | The original Ableton Link clock/reset generator; predecessor to ClkLinkRec. OFF / INTERNAL / LINK switch. **GPL-2.0-or-later** (links Ableton Link). |
| **MOD2 / Melon** | `eurorack_electronics` | `docs/mod2_*` | mixed-signal, n8synth 6HP | Dual-firmware-compatible board running 25 published HAGIWO voices — every MOD2 *and* Melon firmware unmodified. 7805 from +12V, both indicator types populated, JP1/JP2 promoted to panel switches. |

## Companion software

Not modules, but first-party and part of how the modules are used.

| Software | Repo | What it is |
|---|---|---|
| **Retrospective** | `seeed-recorder` (`mac-app/`) | Menu-bar Mac app (SwiftUI `MenuBarExtra`, macOS 14+). Continuously buffers **every channel** of the CoreAudio input to per-channel circular files, so a capture writes the last 30 s – 30 min (default 60 s) as 32-bit float WAVs — for when the best take just happened and nothing was recording. Joins Ableton Link as a **follower**, baking the live tempo into filenames and WAV metadata: `YYYY-MM-DD_HH-MM-SS[_<bpm>bpm]_ch<NN>.wav`. |
| **LLM proxy** | `eurorack_modules` (`tools/llm-proxy/`) | FastAPI service translating prompts into six named patches for CortHex. |

**Three trigger paths, one capture engine** — the RP2040 module over USB-MIDI, ClkLinkRec
over HTTP/WiFi, and the menu bar itself. Identical output from all three.

## Not modules

Worth recording so they don't get re-counted:

- **`daisy_fm4op` / `daisy_interval_osc` / `daisy_scanned` / `daisy_bytebeat`** — these are
  *engines inside* Daisy MultiOsc, not separate modules. MultiOsc boots a chooser and
  hosts FM4OP, INTVL, SCAN, BYTEBEAT and a SINE test voice behind one universal panel.
  `daisy_fm4op` and `daisy_interval_osc` also have standalone builds; `daisy_scanned` and
  `daisy_bytebeat` are engine source only.
- **`tiliqua` `beamrace/`, `xbeam/`, `polysyn/`, `macro_osc/`, `sid/`, `sampler/`, etc.** —
  upstream apf.audio gateware (Seb Holzapfel, CERN-OHL-S-2.0), inherited by the fork.
  Only `mesh/`, `silver/` and `gold/` are original work.
- **`eight4awish-video`** — Remotion motion graphics for the channel, not a module.
- **`seeed-recorder/mac-app/`** — the Retrospective Mac app; see Companion software above.
  The repo *does* also hold a real module in `firmware/`, so the repo as a whole is not
  software-only.
- **`eurorack_electronics` `tools/`** — n8layout templates, the layout visualiser and the
  schematic generator. Tooling that produced the LPG and MOD2, not modules themselves.
- **`eurorack_electronics_private`** — third-party reference only: published schematics
  (DAFx Buchla 292, AI017, NLC LPG, Doepfer A-101-2, Bergmann's redrawn 292), photographs
  of the assembled Dual LPG boards, and the MKI x ES drum material. Private because it
  redistributes other people's work, not because it is secret. **No original designs and
  no modules of its own** — it was checked, and it adds none.

## Platform vocabulary

The site's `platform:` frontmatter field. Keep these spellings consistent:

`Daisy Patch Submodule` · `Teensy 4.1` · `Arduino Nano ESP32` · `Pico 2W` · `XIAO ESP32-C5` ·
`AMYboard` · `Ksoloti` · `Tiliqua` · `analog`

Note the site currently writes the Daisy platform as `Patch Submodule` (no "Daisy"
prefix) — that is the string in the frontmatter today.

---

# Purchased gear

Everything here is bought, not built. **The list of modules is David's own, given
2026-09-18** — that is the authority for *what is owned*. Maker and function are
verified or high-confidence; **HP is the weak column** and is marked per row.

HP key: **✓** verified against manufacturer or retailer · **◆** confirmed by David directly.
Sizes for the ten modules marked ✓ from `eight4awish-video/src/rigModules.ts` come from
panels modelled against the real hardware, so those are the most trustworthy of all.

## In the rack

| Module | Maker | HP | Function | Notes |
|---|---|---|---|---|
| **Ornament & Crime v4.1** ("O.R.N.8") | CCTV | 12 ✓ | sequencer / quantizer / CV / MIDI-to-CV | Teensy 4.1. Runs **Phazerville 2.0**; four MIDI-In quadrants programmed. One of three clock sources. |
| **Plaits** | CCTV | 12 ✓ | macro oscillator | Mutable clone on **Plaits 1.2 alt firmware**. The oscillator in the CortHex voice. |
| **Rings** | CCTV | 14 ✓ | resonator | Mutable clone (Immutable Rings), Thonk DIY kit. Why no Rings engine was written for MultiOsc. |
| **Peaks** | CCTV | 8 ✓ | envelope / LFO / drum | Mutable clone (Immutable Peaks). Four functions in 8HP: ADSR, LFO, tap-tempo LFO, drum synth. |
| **Swords** | Behringer | 18 ◆ | dual multimode filter | **Mutable Blades clone.** Two 12 dB state-variable filters, Mode morphs LP→BP→HP, Routing blends single/parallel/series, plus drive and a two-stage wavefolder. Self-oscillates above ~+3 V. The filter in the CortHex voice. |
| **Steps** ×2 | Behringer | 14 ✓ | function generator / sequencer | **Mutable Stages clone.** Six stages each; two units chain to 36 segments, which is presumably why there are two. |
| **Four Play** | Behringer | 12 ✓ | quad VCA + mixer | Coolaudio V2164A. DC-coupled, cascaded outs so Mix alone makes it a 4-in VC mixer. **See the CV6 note below.** |
| **Four LFO** | Behringer | 12 ◆ | quad LFO | **Xaoc Batumi clone.** Fader per LFO, assignable waveforms, 500 Hz down to ~28 hours. |
| **Chaos** | Behringer | 18 ✓ | random gates + random CV | Analog random sampler, two chained sub-sections. **Name collides with your own Chaos**, the Teensy 4.1 attractor voice — unrelated modules, both in the rack. |
| **Abacus** | Behringer | 20 ✓ | function generator / CV maths | Modelled on Buchla 257 + 281. Four CV ins with depth and direction; lag / slew / portamento. |
| **Waves** | Behringer | 14 ✓ | function generator / tidal modulator | **Mutable Tides clone** — three generator modes, AR and AD envelopes, looping VC-LFO and VCDO, morphing waveforms. Its **Smoothness** control is a wavefolder clockwise of centre (and a 2-pole low-pass counter-clockwise), so `ROADMAP.md:48` is right to count it alongside Chopping Kinky as West-Coast folding. |
| **Workshop Computer** | Music Thing Modular | 8 ✓ | programmable CV / MIDI | Runs the **Simple MIDI** program card for two fixed voices. MIDI port `Workshop System MIDI`. |
| **Turing Machine Mk II** | Music Thing Modular | 10 ✓ | random looping sequencer | A 16-bit shift register producing clocked random CV that can be locked into repeating loops by the Length control. Steerable, not programmable — sequences cannot be saved or returned to once changed. Host for the three expanders below. |
| **Turing Pulses** | Music Thing Modular | 4 ✓ | trigger / gate expander | Eleven rhythmic pulse-train outputs derived from the sequence. Connects at the back by 16-way ribbon; works with Mk2, or Mk1 with the backpack. |
| **Turing Volts** | Music Thing Modular | 4 ✓ | CV expander | A variable 5-bit DAC: five bits off the GATES expansion port through five pots to one summed CV out. |
| **Turing Voltages** | Music Thing Modular | 12 ✓ | CV expander | Two CV outputs set by 8 faders. |
| **Random8** | Befaco / Mylar Melodies | 8 ✓ | random CV | Eight channels (PRESET / DIVIDR / PROB / STYLE / OFFSET / SCALE / SLIDE / STEPS). Three wander Girl's resonator: P2 brightness, P3 damping, P4 position. |
| **Output Bus** | Befaco / DivKid | 8 ✓ | stereo output mixer | The 8HP mixing version, **not** the 4HP "OUT". Everything lands here except Joy. |
| **Chopping Kinky** | Befaco | 8 ✓ | dual wavefolder | Voltage-controllable, two channels, with a chop output that picks between them via zero-cross detector or external gate. Almost certainly the unnamed "Befaco folder" of `ROADMAP.md:48`. |
| **A*B+C** | Befaco | 6 ✓ | dual four-quadrant multiplier | Multiply, offset, invert; works as a VCA for CV or audio. |
| **Instrument Interface (I4)** | Befaco | 8 ✓ | preamp / envelope follower | Mic (with +48 V phantom), instrument and line up to modular level. Envelope follower and gate/trigger extractor with positive and inverted outs. |
| **Mutes (MK2)** | Befaco / DivKid | 24 ✓ | mute / routing utility | **Fitted with its Intellijel-format 1U panel**, which mounts the board sideways — so it is 24HP in 1U, where the same module on its 3U panel is 4HP. VCA-based, click-free, with performable 3-way switches and cascading normalled inputs. |
| **T01 VCO** | Thonk | 4 ✓ | oscillator | SQR → T03 VCA A. |
| **T03 Dual VCA** ×2 | Thonk | 6 ✓ | dual VCA | A left, B right. One is the VCA in the CortHex voice. |
| **BUF (T06)** | Thonk | 4 ◆ | buffered multiple | Precision multiple: three channels of 1-in / 3-out. |
| **A-121d** | Doepfer | 8 ◆ | dual multimode filter | Shared Frequency with a Delta spread control; VCF1 has HP, VCF2 has LP, both have BP. Series or parallel. |
| **A-124** | Doepfer | 8 ✓ | multimode filter (Wasp) | VCF 5, after the EDP Wasp. Note the variants: A-124 SE, and the A-124-2 SE mini at 4HP. |
| **A-142-3** | Doepfer | 4 ✓ | AD/AR envelope + VCA | Toggle picks A/D or A/R, a second toggle picks envelope or free-running LFO. Envelope drives a linear VCA. 555 timer + CEM3381. |
| **A-148** | Doepfer | 4 ✓ | dual sample & hold | S/H or T/H per sub-module by jumper. |
| **A-138a** | Doepfer | 8 ✓ | 4-channel linear mixer | |
| **Scales** | Intellijel | 8 ✓ | dual quantizer + sequencer | 35 factory scales, 35 storable sequences up to 128 steps, one-octave keyboard for live scale selection. Shift/Interval on output 2 for harmonies. |
| **Steppy 1U** | Intellijel | 28 ✓ | gate sequencer | **Intellijel-format 1U tile.** Four tracks, 64 gates, eight memory slots. Per-track length, gate length, clock divider, swing, delay offset and probability. (The 3U Steppy is a different module at 8HP.) |
| **Beatsi** | Omni-tone | 8 ✓ | drum voice | Six trigger ins. Fed by O&C outs e/f/g/h → KICK / SNARE / HI-HAT / CRASH. |
| **Rhythmi** | Omni-tone | 14 ✓ | generative drum sequencer | Built-in generative algorithm driving up to five voices. Designed to pair with Beatsi. |
| **DivSkip** | Making Sound Machines / DivKid | 8 ✓ | trigger / gate processor | Four channels, eight modes: Bernoulli, clock divider, Turing, Euclidean (split + classic), ramp/gate length, retrigger, 64-step patterns. |
| **FX Aid 1U** | Happy Nerding | 24 ◆ | DSP effects | **Intellijel-format 1U tile**, not a 3U module — it lives in a 1U row. Spin FV-1 based: 32 effects in 4 banks of 8, three controls plus analog dry/wet with CV, four storable presets, reflashable. |
| **Alchemy Lab** | Hermetic Modular | 12 ✓ | open DSP platform | **Electrosmith Daisy inside** (STM32H750, 64 MB SDRAM), MIT-licensed SDK, six firmware-controllable CV jacks, microSD, 102 addressable LEDs. |
| **Monsoon** | Jakplugg | 12 ✓ | granular / texture | Clouds redesigned to 12HP with bi-colour illuminated faders for the four granular parameters. **Typhoon is Jakplugg's *expanded* Monsoon**, so `ROADMAP.md:49`'s "Typhoon = Clouds" is the same family, not a different module. |
| **Ogham** | Keeos | 10 ✓ | dual bytebeat oscillator | Two formulas from a pool of 100, CV over the A and B parameters plus sync and timing. **You own the module whose code became your BYTEBEAT engine** — `daisy_bytebeat` is ported from keeos-io/ogham (MIT), and the 100-formula bank is the same one. |
| **EuroPi** | Allen Synthesis | 8 ✓ | clock / CV (programmable) | **Built with a Pico 2 W** (RP2350 + wifi). Reprogrammable in MicroPython; config lives at `/config/EuroPiConfig.json` on the Pico. Runs a Pamela's-style firmware; the repos call it "Pam's clone". One of four clock sources — a swung clock from it gives a swung Sorrow pattern. |
| **ES-10** | Expert Sleepers | 12 ✓ | audio interface | 8-channel DC-coupled ADAT. End of the chain; every audio out terminates here. |
| **ADSR** | N8Synth | 4 ✓ | envelope | Single column: IN, A, D, S, R, OUT. |

### 1U tiles

Three modules sit in a 1U row rather than the 3U rows, all **Intellijel 1U format** —
which is not interchangeable with the Pulp Logic / Synthrotek 1U "tile" format. **76HP
of 1U in total.** Note that a module's 1U width is not its 3U width: Mutes mounts
sideways on its 1U panel and goes from 4HP to 24HP.

| Module | HP (1U) |
|---|---|
| **Steppy 1U** (Intellijel) | 28 |
| **FX Aid 1U** (Happy Nerding) | 24 |
| **Mutes MK2** (Befaco / DivKid) | 24 |

## Kit and home builds in the rack

Bought as kits or built from published designs rather than as finished modules, so they
sit between the two halves of this file.

| Module | Source | Function |
|---|---|---|
| **mkikick** | home build | kick drum |
| **Hi-Hat** | MKI x es.edu (Erica Synths / es.edu DIY) | hi-hat |

Working material for the kick lives in **`eurorack_electronics_private`** under
`docs/refs/mki_x_es/` — netlists, breadboard placements and visualiser layouts
transcribed from the *MKI x ES EDU DIY Modular* book.

## Host hardware for own firmware

Purchased, but the platform rather than the instrument.

| Hardware | Maker | HP | Hosts |
|---|---|---|---|
| **Big Genes** | Ksoloti | 20 ✓ | Girl |
| **Tiliqua** | apf.audio | 6 ✓ | Silver, Gold |
| **Patch Init / Patch Submodule** | Electrosmith | — | Sorrow, Joy, Joy Lite, MultiOsc, MultiFX |
| **AMYboard** | shorepine | — | AMYboard PatchBank |
| **Solderable breadboard platform** (4/6/10HP + 10HPS) | N8Synth | 4–10 | Dual LPG, MOD2/Melon, and the board geometry the layout visualiser validates against |

## Case and power

| Item | Maker | Notes |
|---|---|---|
| **Cases** | home build | Built on **Tiptop Audio Z-Rails**. |
| **Zeus** ×2 | Tiptop Audio | Bus power. |
| **CP1A** | Behringer | Bus power. |

## Outside the rack

| Gear | Maker | What it does |
|---|---|---|
| **Proton** | Behringer | Semi-modular. Dual VCF, dual LFO, 2 ADSR + 2 ASR, wavefolder, 40-in/24-out patchbay. Reference: `eurorack_modules/docs/PROTON_SIGNAL_ROUTING.md`. |
| **Neutron** | Behringer | Semi-modular. One VCF (dual output tap), one LFO, 2 ADSR, BBD delay, overdrive, 32-in/24-out patchbay. Reference: `NEUTRON_SIGNAL_ROUTING.md`. **Do not infer Proton routing from Neutron or vice versa.** |
| **Move** | Ableton | Groovebox. Boy is its Eurorack bridge — MIDI-to-CV plus audio FX on the Move's output. |
| **Scarlett 16i16** | Focusrite | USB interface, Mac default input. Rack patches to inputs 1&2. The capture source in the recorder protocol. |

---

Sources: manufacturer and retailer pages, checked 2026-09-18. doepfer.de and
modulargrid.net are blocked by this session's proxy, so Doepfer figures come from
retailers and are the least certain of the ✓ set.
