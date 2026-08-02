---
title: Strudel — live-code your rack
eyebrow: Music as code
date: 2026-07-10
summary: >-
  Sequence your rack by typing. One track, built three ways — a basic song, a
  generative one, and a visual one that shares its signals with the picture.
graphic: /renders/tut_music.png
chips:
  - Strudel
  - Live Coding
repo: https://github.com/Eight4aWish
cta: /tutorials/strudel/
order: 1
draft: false
songs:
  - title: 1 · Basic
    blurb: >-
      Parts, drums and CC42 movement, arranged into a song — the whole track on
      one screen.
    download: /lessons/simple_song.js
    blocks:
      - label: Devices
        code: |-
          const WS = 'Workshop System MIDI'
          const OC = 'Phazerville'
        note: >-
          Two MIDI destinations, named once: the **Workshop System** and the
          **O&C** (its firmware reports as *Phazerville*). Every part below is
          aimed at one with `.midi(WS)` or `.midi(OC)`.
      - label: Parts
        code: |-
          const prog = "<0 0 3 5 0 0 5 4>"

          const lead = n("0 3 5 3 0 3 5 3".add(prog))
            .scale("A5:minor").midichan(1).midi(WS)
          const pad  = n("0 ~".add(prog))
            .scale("A4:minor").midichan(2).midi(WS)
          const bass = n("0 _ ~ ~ 0 ~ 3 ~".add(prog))
            .scale("A2:minor").midichan(3).midi(OC)
        note: >-
          `n()` plays **scale degrees**, not fixed notes — `0` is the root, so
          with `.scale("A…:minor")` every number lands in key. `prog` is a chord
          move in `< >` (one per cycle) and `.add(prog)` walks all three voices
          through it together. Lead, pad and bass sit in octaves A5 / A4 / A2 on
          channels 1 / 2 / 3 to stay clear of each other. (`~` rest, `_` hold.)
      - label: Drums
        code: |-
          const kick=36, snare=38, closedHat=40, openHat=41
          const drums = stack(
            note(kick     ).struct("x ~ ~ ~ x ~ ~ ~"),
            note(snare    ).struct("~ ~ ~ ~ x ~ ~ ~"),
          ).midichan(10).midi(OC)
          const drums2 = stack(
            drums,
            note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
            note(openHat).struct("~ ~ ~ x ~ ~ ~ x*2"),
          ).midichan(10).midi(OC)
        note: >-
          Drums use raw note numbers and `.struct()` — a **step grid** where `x`
          is a hit, `~` a rest, `x*2` two hits in one step. `drums` is the
          kick+snare backbone; `drums2` layers hats on top for the busier
          sections. All on channel 10, the O&C's drum bus.
      - label: Movement
        code: |-
          const modLead = v => ccn(42).ccv(v).midichan(1) .midi(WS)
          const modPad  = v => ccn(42).ccv(v).midichan(2) .midi(WS)
          const modBass = v => ccn(42).ccv(v).midichan(3) .midi(OC)

          const mods = stack(
            modLead(isaw.range(1,0)  .slow(4).segment(32)), // filter changes
            modPad (sine .range(0,1)  .slow(4).segment(32)), // adjusts reverb mix
            modBass(isaw.range(1,0).slow(8).segment(32)),   // bass filter opening
          )
        note: >-
          The CC42 movement. Each helper sends **CC42** on a voice's channel —
          on the rig that becomes a control voltage (a filter, a reverb mix).
          Feed it a signal shaped by `.range()` (depth), `.slow()` (speed) and
          `.segment(32)` (CC messages per cycle). One helper per destination —
          two CCs on one channel would just overwrite each other.
      - label: Sections & arrange
        code: |-
          const intro  = stack(pad, mods)
          const verse  = stack(drums, bass, pad, mods)
          const chorus = stack(drums2, bass, pad, lead, mods)
          const bridge = stack(drums,pad, mods)
          const outro  = stack(pad, bass, mods)

          arrange(
            [4, intro],
            [8, verse],
            [8, chorus],
            [4, bridge],
            [8, chorus],
            [4, outro],
          ).cpm(30)
        note: >-
          `stack()` layers parts into sections, and `mods` rides inside every
          one so the movement plays throughout. `arrange()` runs the sections in
          order as `[bars, section]`. `cpm(30)` sets the tempo — 30 cycles/min,
          about 120 bpm at eight steps.
  - title: 2 · Generative
    blurb: >-
      The same track, now it never plays the same way twice. Only the pieces
      that change are shown — everything else is the basic song.
    download: /lessons/simple_song_generative.js
    blocks:
      - label: Parts — now they mutate
        code: |-
          const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
            .sometimesBy(0.4, x => x.add(choose(5,7))))
            .scale("A5:minor").degradeBy(slider(0, 0, 1)).midichan(1).midi(WS)
            ._pianoroll()
          const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
            .scale("A4:minor").midichan(1).midi(WS)
            ._pianoroll()
        note: >-
          The lead grows a second bar (`|` = one per cycle) and mutates:
          `sometimesBy(0.4, …choose(5,7))` leaps about 40% of notes up a 5th or
          7th, and `degradeBy(slider(0,0,1))` drops notes by an amount you
          **drag live** — the slider appears in the editor. `lead2` is pure
          chance, `irand(8)` picking random degrees, held back for the bridge.
          `._pianoroll()` draws the notes as they play.
      - label: Movement — perlin drift
        code: |-
          const mods = stack(
            modPad (sine .range(0,1)  .slow(4).segment(32)), // adjusts reverb mix
            modLead(perlin.range(1,0)  .slow(4).segment(32)), // smoothed random filter changes
            modBass(isaw.range(1,0).slow(8).segment(32)), // bass filter opening
          )
        note: >-
          One change from the basic song: the lead's filter mod swaps its `isaw`
          shape for **`perlin`**, a smooth random signal — so the filter now
          wanders instead of repeating. Same CC42 slot, different character;
          `sine` and `isaw` still drive the pad and bass to a plan.
      - label: A generative bridge
        code: const bridge = stack(lead2, drums,pad, mods)
        note: >-
          The only section that changes: the bridge trades the written lead for
          **`lead2`**, the random line, so that lift is different every pass.
          Drums, bass, pad and `arrange()` are exactly the basic song.
  - title: 3 · Visual
    blurb: >-
      The generative song, plus a Hydra picture driven by the very same signals
      that move the filters.
    download: /lessons/simple_song_visual.js
    blocks:
      - label: Define each LFO once
        code: |-
          await initHydra()   // starts Hydra (background canvas)

          // define each LFO ONCE, then use it in TWO places
          const lfoPad  = sine  .slow(4)   // 0..1
          const lfoLead = perlin.slow(4)   // ~0..1, wanders (the random one)
          const lfoBass = isaw  .slow(8)   // 1..0
        note: >-
          `initHydra()` starts Hydra, a visual layer behind the code. The trick
          of this version: define each LFO **once** as a named signal, so the
          same movement can drive both the sound and the picture. `lfoLead` is
          `perlin` (smooth random); the others are plain shape LFOs.
      - label: The mods use them
        code: |-
          const mods = stack(
            modPad (lfoPad .range(0,1).segment(32)), // reverb mix
            modLead(lfoLead.range(1,0).segment(32)), // smoothed random filter
            modBass(lfoBass.range(1,0).segment(32)), // bass filter opening
          )
        note: >-
          The CC42 mods are the generative song's — but written in terms of the
          named LFOs. `.range()` and `.segment()` still set depth and message
          rate. (Parts, drums and `arrange()` are the generative song, run with
          `$:` so they play alongside the visual.)
      - label: The same signals drive the picture
        code: |-
          osc(18, 0.08, 0.6)
            .color(H(lfoPad), 0.25, H(lfoLead))     // pad + lead mods tint it
            .rotate(H(lfoBass.range(0, 6.28)))      // the bass filter sweep spins the whole frame
            .kaleid(H(lfoLead.range(3, 7)))         // perlin (random) opens/closes the kaleidoscope
            .modulate(noise(3))
            .scale(H(sine.range(1, 1.4).slow(4)))   // a steady zoom pulse
            .out()
        note: >-
          `H()` pipes a Strudel signal into a Hydra parameter, so the **same**
          `lfoPad` / `lfoLead` / `lfoBass` that move your filters now move the
          image: pad and lead tint the colour, the bass sweep spins the frame,
          and the random `lfoLead` opens the kaleidoscope. Sound and picture
          breathe together because they share one set of signals.
---
Strudel is a live-coding language that runs in a browser. Here it is **not** making the sound — your
modules are. Strudel sends MIDI notes and CC; the rack does the rest.

Below is the actual code from the video: **one track, three passes**. The **basic** song lays down
parts, drums and CC42 movement, arranged into a shape. The **generative** pass lets the notes and
filters wander. The **visual** pass shares those same signals with a Hydra graphic. The full files
live in the repo linked at the foot of the page.
