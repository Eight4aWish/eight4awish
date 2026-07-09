# Eight4aWish — Non-Module Video Backlog

*Living log of topic/technique videos (Pillars B, C, D — not single-module build-alongs).*
*Last updated: 2026-06-26.*

These run *between* the flagship module videos (Elements → Braids → Link …) to bring in
strangers via search and keep a sustainable cadence. See [CHANNEL_PLAN.md](CHANNEL_PLAN.md).

**Comment-steering device:** end most videos with a fork — *"Should I do X or Y next? Let me
know in the comments."* It steers the roadmap and farms the comments the algorithm rewards.
Suggested pairings are noted per idea below.

---

## 🔥 In the hopper — three strong, ready to develop

### 1. Eurorack Circuit Building Blocks *(Pillar C — series opener)*
The fundamental analog blocks every module is made of: VCO, VCF, VCA, LPG, mixer,
attenuverter, comparator, S&H. What each does, the canonical circuit, and *why*.
- **Hook:** "Every eurorack module is just a handful of the same building blocks. Learn these
  eight and you can read — and build — almost anything."
- **Grounded in your assets:** Dual Pingable LPG, kick/snare/FM-drum breadboards in
  `eurorack_electronics`.
- **Why strong:** evergreen, huge long-tail SEO, positions you as a teacher, seeds a series.
- **Shorts:** one block per short ("What's a VCA, in 30 seconds").
- **Steer:** "Next building-blocks episode — VCFs or envelopes/LPGs?"

### 2. Schematic → Breadboard → Soldered Module: the Dual LPG on N8Synth *(Pillar B/C)* ⭐
The full hardware pipeline on one real analog module — the **Dual Pingable LPG**. Generate
the schematic from code (Schemdraw), turn it into a breadboard layout (`netlist_to_layout.py`
+ visualiser), then solder that exact layout permanently onto an **N8Synth solderable
breadboard**. N8Synth uses standard breadboard topology you can *solder*, so the prototype
layout and the finished build are the same — no PCB step.
- **Hook:** "Schematic, breadboard, finished module — same layout the whole way, no PCB.
  Here's the Dual LPG from code to soldered."
- **Grounded in:** `eurorack_electronics` — Dual LPG schematic generator (`tools/schematic`),
  `tools/n8layout`, `tools/visualizer`, `netlist_to_layout.py`.
- **Why strong:** the complete vibe-coded-hardware story in one dense video; lowers the
  barrier for the target audience; natural N8Synth in-road (tag them — value-first
  relationship builder, CHANNEL_PLAN §8).
- **Shorts:** "Netlist → breadboard layout in 20 seconds"; "breadboard vs the soldered board,
  side by side"; "what a low-pass gate actually does."
- **Steer:** "Which circuit should I take from code to soldered next — a kick drum or a VCA?"

### 3. Vibe-Code Your Front Panel — Eurorack Panels by Typing *(Pillar B)* ⭐ USP
Design a printable/manufacturable eurorack front panel in `build123d` — describe it in
Python, get an STL + render. The single most differentiated topic on the channel.
- **Hook:** "I designed this front panel by typing, not drawing. Let me show you."
- **Grounded in:** `build123d` (115 renders, STL/STEP exports, Gridfinity).
- **Why strong:** almost nobody shows hardware-as-code; pure embodiment of the brand USP.
- **Shorts:** panel generating in fast-forward; "change one number, panel resizes."
- **Steer:** "Want the schematic-from-code episode (Schemdraw) next, or the patch-from-text
  one (CortHex)?"

---

## 📋 Deeper backlog (grouped by pillar)

### Pillar B — Vibe-coding craft
- **Schematics from code** — deep-dive on Schemdraw build-phase schematics (standalone cut of the Dual LPG story, idea #2).
- **Patches from plain English** — how CortHex turns natural language into CV (the LLM angle).
- **Vibe-coding firmware on Daisy** — taking a Mutable source and porting/adapting it with AI.
- **Coding music *and* visuals in the browser** — Strudel + Hydra reactive intro sting.
- **From netlist to PCB** — where vibe coding helps and where it doesn't (honest limits).

### Pillar C — General education
- **Top 10 circuit design tips for eurorack** (beginner gotchas: power, decoupling, ground, CV ranges).
- **Choosing your module's brain** — Daisy vs Teensy vs Pico vs ESP32, for your first DIY module.
- **Power, voltage & CV standards** — the 0–5V / ±5V / 1V-oct stuff nobody explains plainly.
- **Reading a eurorack schematic** when you're not an engineer.
- **Cheapest path to your first DIY module** — tools, BOM, where to buy.
- **Daisy Patch.Init explained** — the platform behind half the catalogue.
- **Ksoloti / Big Genes for beginners** — what it is, why it's a great DIY brain.

### Pillar D — Music & demos
- **Patch-from-scratch** — build a track using only your own modules.
- **Strudel live-coding a track** that becomes a video bed.
- **Generative jam** — CortHex + sequencer, hands-off.

---

## Content principle: dense videos + strong support materials
Keep each video **dense and complete** — don't stretch a topic across multiple parts to pad
runtime. Offload depth to **support materials** instead, so the video stays watchable while
the full detail lives where people can actually use it:
- Per-topic web page (CHANNEL_PLAN Phase 0 resource hub): full write-up, schematic, BOM,
  STL/STEP downloads, code links, step-by-step.
- Pinned-comment / description links to the repo, layout files, and parts list.
- Timestamps/chapters so a dense video stays navigable.
This way the video earns attention with pace; the materials let viewers actually build along.

## Notes
- Cadence target: alternate one backlog (B/C) topic with each flagship module video.
- Each long video → 3–5 shorts harvested from the same footage.
- Keep three "ready" ideas warm in the hopper at all times; promote from backlog as you film.
