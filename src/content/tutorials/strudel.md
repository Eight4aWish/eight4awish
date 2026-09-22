---
title: Strudel — live-code your rack
eyebrow: Music as code
date: 2026-07-10
summary: >-
  Sequence your rack by typing. One track, built twice — a song, then the same
  song made to wander while it moves the filters.
graphic: /renders/tut_music.png
chips:
  - Strudel
  - Live Coding
repo: https://github.com/Eight4aWish
cta: /tutorials/strudel/
order: 1
draft: false
songs:
  - title: 1 · The song
    blurb: >-
      Three voices, a drum kit and an arrangement — the whole track on one
      screen, and not a note of it made in the browser.
    download: /lessons/recorded_short.js
    blocks:
      - label: Devices
        code: |-
          const WS = 'Workshop System MIDI'
          const OC = 'Phazerville'
        note: >-
          Two MIDI destinations, named once: the **Workshop Computer** and the
          **O&C** (its firmware reports as *Phazerville*). Every part below aims
          at one of them with `.midi(WS)` or `.midi(OC)`.
      - label: The progression, and the first voice
        code: |-
          const prog = "<0 0 3 5 0 0 5 4>"

          const bass = n("0 ~ ~ ~ 0 ~ 3 ~".add(prog))
            .scale("A2:minor").midichan(4).midi(OC)
        note: >-
          `n()` plays **scale degrees**, not fixed notes — `0` is the root, so
          with `.scale("A…:minor")` everything lands in key. `prog` is a chord
          move in `< >`, one per cycle, and `.add(prog)` walks the part through
          it. That is the difference between a song and a loop, and it costs one
          word.
      - label: Pad and lead
        code: |-
          const pad  = n("0 ~ ".add(prog))
            .scale("A3:minor").midichan(3).midi(OC)

          const lead = n("0 3 5 3 0 3 5 3".add(prog))
            .scale("A5:minor").midichan(1).midi(WS)
        note: >-
          The same idea twice more — same notation, an octave apart each time.
          Note where they go: the pad joins the bass on the O&C, but the lead is
          addressed to the Workshop Computer. Strudel drives both boxes at once
          and does not care that they are different machines.
      - label: Drums
        code: |-
          const kick=36, snare=37, closedHat=38, openHat=39
          const drums = stack(
            note(kick     ).struct("x x"),
            note(snare    ).struct("~ x"),
            note(closedHat).struct("x x x ~ x x x ~"),
            note(openHat  ).struct("~ ~ ~ ~ ~ ~ ~ x")
          ).midichan(10).midi(OC)
        note: >-
          Drums are the exception to the scale-degree rule: these are raw MIDI
          notes, because a kick is not a pitch, it is a jack. `.struct()` is a
          **step grid** — `x` a hit, `~` a rest — which reads like a drum machine
          and keeps the rhythm separate from the sound. All on channel 10, into
          Beatsi.
      - label: Sections & arrange
        code: |-
          const intro  = stack(drums, pad)
          const verse  = stack(drums, bass, pad)
          const chorus = stack(drums, bass, pad, lead)
          const outro  = stack(bass, pad)

          arrange(
            [4, intro],
            [8, verse],
            [8, chorus],
            [4, outro],
          ).cpm(35)
        note: >-
          `stack()` layers parts into sections, and `arrange()` plays the
          sections in order as `[bars, section]`. `cpm(35)` sets the tempo — 35
          cycles a minute. Twenty-four bars, and the track is finished.
  - title: 2 · Movement
    blurb: >-
      The same song, now it never plays the same way twice — and the filters on
      the rack move while it does.
    download: /lessons/recorded_long.js
    blocks:
      - label: The bass gains a second bar
        code: |-
          const bass = n("0 _ ~ ~ 0 ~ 3 ~ | 0 _ ~ ~ 3 ~ ~ 5".add(prog))
            .scale("A2:minor").midichan(4).midi(OC)
        note: >-
          `|` means **pick one of these each cycle**, so the bass stops repeating
          exactly. `_` holds the note before it for another step — which only
          sounds different if the voice reads gate *length*, so on this rig it
          depends which way the A-142-3's AD/AR toggle is set.
      - label: The lead mutates
        code: |-
          const lead = n("0 3 5 3 0 3 5 3 | 0 3 4 5 3 2 1 5".add(prog)
            .sometimesBy(0.4, x => x.add(choose(5,7))))
            .scale("A5:minor").degradeBy(slider(0.313, 0, 1)).midichan(1).midi(WS)
        note: >-
          `.sometimesBy(0.4, …)` takes a chance on each note — about 40% of them
          jump up a 5th or a 7th, whichever `choose()` picks. `.degradeBy()`
          drops notes entirely, and `slider()` puts a **fader in the code** so
          you can thin the melody out by hand while it plays.
      - label: A busier kit
        code: |-
          const drums2 = stack(
            note(kick     ).struct("x x x x"),
            note(snare    ).struct("x x"),
            note(closedHat).struct("x x x*2 ~ x*2 x x ~"),
            note(openHat  ).struct("~ ~ ~ x ~ ~ ~ x*2 | ~ ~ ~ x ~ ~ ~ x*4"),
          ).midichan(10).midi(OC)
        note: >-
          A second kit for the chorus. `x*2` fits two hits into one step, which
          is how the hats get their double-time feel without a second grid.
      - label: Name the shapes
        code: |-
          const lfo1 = isaw  .slow(4)
          const lfo2 = perlin.slow(4)
        note: >-
          A **signal** is a value that is always moving. There are no brackets
          after `isaw` because you are not calling it — you are naming a shape: a
          ramp that falls from 1 to 0. `.slow(4)` stretches one fall over four
          cycles. `perlin` is smooth random, so it wanders instead of marching.
      - label: Send them as CC
        code: |-
          const mod1 = v => ccn(42).ccv(v).midichan(2).midi(WS)
          const mod2 = v => ccn(42).ccv(v).midichan(1).midi(WS)

          const mods = stack(
            mod1(lfo1.range(1,0).segment(32)),
            mod2(lfo2.range(0,1).segment(32)),
          )
        note: >-
          **Nothing here makes a voltage.** Strudel sends a MIDI message and the
          module turns it into volts. `v => …` is a small function — a recipe
          with a hole in it — and everything after the arrow is an address that
          never changes: controller 42, a channel, a device. Then `.range()`
          sets depth and direction, and `.segment(32)` takes 32 snapshots a
          cycle, because a continuously moving value has to be chopped up before
          MIDI can carry it. At `cpm(35)` that is about 19 messages a second.
      - label: The bridge
        code: |-
          const lead2 = n(irand(8).segment(16)).degradeBy(0.6)
            .scale("A5:minor").midichan(1).midi(WS)

          const bridge = stack(drums2, pad, lead2, mods)
        note: >-
          `irand(8)` is pure chance and `.segment(16)` takes sixteen of them a
          cycle — the same idea as the LFOs above, sampling something continuous
          into countable events. It only plays in the bridge, so that lift is
          different every pass.
---
Strudel is a live-coding language that runs in a browser. Here it is **not** making the sound — your
modules are. Strudel sends MIDI notes and CC; the rack does the rest.

Below is the actual code from the video: **one track, two passes**. The first lays down three voices,
a drum kit and an arrangement. The second lets the notes wander and sends CC42 out to sweep real
filters on the rack. Both files are downloadable above — paste one into [strudel.cc](https://strudel.cc)
in Chrome, point the device names at your own gear, and it will play.
