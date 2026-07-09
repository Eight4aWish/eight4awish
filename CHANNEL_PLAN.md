# Eight4aWish — Channel & Brand Plan

*Living strategy doc. Last updated: 2026-06-26.*

**End goal:** build a YouTube + website following around vibe-coded eurorack DIY large
enough that manufacturers (N8Synth, Tiliqua, Befaco, Ksoloti, etc.) send kit free of
charge to have a module built around it — and, longer term, pocket money to supplement
the pension.

---

## 0. The core insight

The real USP is **full-stack vibe coding**, not just firmware:

- **Firmware** designed with AI (the whole `eurorack_*` / `daisy_patch_init` catalogue)
- **Panels** generated from Python — `build123d` (115 renders, STL exports, Gridfinity)
- **Schematics** generated from code — Schemdraw generator in `eurorack_electronics`
- **Breadboard layouts** from netlists — n8synth visualiser + `netlist_to_layout.py`
- **Patches** from natural language — **CortHex** (LLM → CV)

Almost nobody in eurorack DIY shows the *whole pipeline as code*. That is the channel.

## 1. Positioning

**Identity:** *"I'm not an engineer — I'm a trainer who tinkers. I use AI to design eurorack
modules end-to-end (code, panels, schematics, patches), and I'll teach you to do the same."*

- Lack of formal EE knowledge is the **feature**: it makes the content accessible to the
  target audience — keen tinkerers with time but no degree.
- Be transparent: "Here's how I got it working without really knowing what I'm doing — and
  here's where a real engineer would do it differently." Honesty builds trust and disarms
  the "well actually" crowd.
- **Moat:** professional training background. Most DIY synth content is made by engineers
  who can't teach.

**Tagline candidates:** "Eurorack, vibe-coded." / "DIY synth modules without the engineering degree."

## 2. Content pillars

| Pillar | What | Why it serves the goal |
|---|---|---|
| **A. Build-alongs** | Full module projects, flagship-led | Proof to manufacturers you ship polished things |
| **B. Vibe-coding craft** | *How* you use AI: firmware, build123d panels, Schemdraw schematics, CortHex patches | The USP. Nobody owns this niche |
| **C. General education** | "Top 10 circuit tips," "Daisy vs Teensy vs Pico," gotchas | SEO + broad reach funnel |
| **D. Music & demos** | Strudel live-coding + modules in real patches | Forces music-making; gives every video a payoff |

## 3. Flagship asset inventory

**Hero modules:** CortHex (LLM patch generator), DaisyBraids OLED, Ksoloti Elements,
ESP32 ClkLink/ClkLinkRec (Ableton Link), build123d panel design.

**Supporting catalogue:** TeensyMove (Ableton Move bridge), Pico2W OnC Lite, AMYboard
PatchBank, Daisy Grids, Daisy MultiFX (OLED + Seed), Daisy MultiOsc, FM4OP, Interval Osc,
Daisy Harmoniqs, Dual Pingable LPG (analog), kick/snare/FM-drum breadboards, Seeed
Recorder (Retrospective Mac app + modules), Strudel templates.

**Natural manufacturer in-roads already in hand:** using the **n8synth** breadboard
platform; porting to **Ksoloti Big Genes**. Tiliqua (FPGA) and Befaco are aspirational.

## 4. Launch campaign — first three videos

Deliberate ordering (smallest risk first, biggest-payoff last):

1. **Ksoloti Elements** — *software only.* Lowest barrier to produce, no build risk, proves
   the format. Establishes credibility with the Ksoloti / Big Genes community.
2. **DaisyBraids OLED** — *the mod anyone can do.* Visually gorgeous, beloved source
   material (Braids), clear "I added a screen" hook. The accessible build-along that invites
   viewers to follow along.
3. **ESP32 Ableton Link (ClkLink/ClkLinkRec)** — *the big one.* More complex, much larger
   potential audience (Ableton + eurorack crossover), strong "clever idea" hook with the
   Retrospective recorder tie-in. **Held back on purpose** — too important to burn before
   the channel has footing; this is the candidate to go viral.

Each long video harvests **3–5 shorts** from the same footage.

## 5. Video architecture (shorts → long-form funnel)

- **Long-form (10–18 min):** hook → what we're building → the interesting bit → result/demo
  → "your turn" CTA. Tight structure = the training strength.
- **Shorts (15–45s):** harvested, not separately filmed — power-on money shot, a "wait, you
  can do *that* with AI?" moment, panel generating in fast-forward, a 10-sec patch demo, one
  sharp tip. Each short's end-screen/pinned comment points to the long video.

## 6. Phased roadmap

**Phase 0 — Foundation (~4 weeks, don't launch yet)**
- Lock branding, channel art, a 20-sec intro sting (compose in Strudel).
- Upgrade the website from repo-list into "the site I wish I'd had": per-module pages with
  BOM, STL downloads, code links, and a beginner pathway.
- Bank the 3 launch videos before going live.

**Phase 1 — Launch & cadence (months 1–3)**
- Publish Elements → Braids → Link, then hold a sustainable rhythm: **1 long every 2 weeks
  + 2–3 shorts/week.** Alternate flagship build-alongs with Pillar-C education videos.

**Phase 2 — Reach & community (months 4–9)**
- Seed awareness (section 7). Begin value-first manufacturer contact (no asks yet).
- Double down on whatever overperforms; make sequels.

**Phase 3 — The goal (months 9–18)**
- Make the collaboration approach once metrics justify it (section 8).

## 7. Community / awareness touchpoints

Contribute value, never drip-spam. Rotate:
- ModWiggler, r/synthdiy, r/eurorack
- Electrosmith Daisy forum + Discord (natural home — most builds are Daisy)
- Ksoloti community, n8synth community
- lines (llllllll.co), relevant Facebook DIY synth groups
- Tiliqua / Befaco Discords (lurk + contribute long before pitching)

Pattern: post finished result + what you learned, link the long video, answer generously.

## 8. Manufacturer path (the end goal)

Works one direction: **make them look good first, then ask.**
1. Build a polished module *featuring their kit* (Elements-on-Big-Genes already is one).
2. Make a great video. Tag them, send it, **ask for nothing.**
3. Repeat; build the relationship over months.
4. Once audience metrics make it worth *their* while, propose the collab with reach + track record.

## 9. Music angle

Strudel live-coding for the intro sting, demo beds, and a few signature shorts — on-brand
(live coding = vibe coding), low-effort, and the forcing function to actually write music.

## 10. Metrics that unlock Phase 3

Roughly: consistent back catalogue (15–20 longs), 1k+ subs, ≥1 clear overperformer (proof of
pull), and evidence you drive action (comments saying "I built this," forum threads, BOM/STL
download counts).

---

## Open threads / next actions

- [ ] Phase 0 website restructure (gallery → resource hub with per-module guide pages)
- [ ] Script + shot list for video 1 (Ksoloti Elements, software-only)
- [ ] Channel/launch checklist (naming, art, SEO, upload settings)
- [ ] Strudel intro sting
