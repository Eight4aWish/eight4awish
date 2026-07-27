---
title: Breadboard layouts for the N8Synth
eyebrow: Circuits as code
date: 2026-07-12
summary: >-
  Turn a netlist into a solderable breadboard layout, then solder that exact
  board — no PCB, no fab, no waiting.
graphic: /renders/tut_circuits.png
chips:
  - netlist to layout
  - no PCB
repo: https://github.com/Eight4aWish/eurorack_electronics
order: 3
draft: true
songs: []
---
## From netlist to soldered, without a PCB

The N8Synth board is a solderable breadboard: the same row-and-rail topology as a solderless one, but
you keep it. That makes the layout — which part goes in which row — the real design work, and the
thing most likely to go wrong at 11pm with a hot iron in your hand.

So make the layout a **file**. A netlist goes in, a placement comes out, and it can be drawn and
checked before anything is soldered. Because the layout is data rather than a sketch on paper, it can
also be validated against the netlist — every connection the circuit needs, confirmed present on the
board you're about to build.

The picture at the top of this page is one of those layouts, drawn straight from its own JSON: the
ICs, resistors, transistors and jumper wires are exactly where they go on the real board.

## Build it in stages, test as you go

The layout carries its own build order. Each stage is a group of parts with a test at the end of it —
install the op-amps and their decoupling, then check the rails; wire the gate-to-trigger front end,
then probe for a clean trigger pulse. You power up and prove each block as you place it, rather than
soldering the whole board and discovering at the end that it does nothing.

That's the real argument for describing a circuit as code: not the drawing, the **checking**.

## The tools

The layout, the validators and the netlists live in
[eurorack_electronics](https://github.com/Eight4aWish/eurorack_electronics). They're the working tools
behind the boards on this site — a kick, a snare, an FM drum and the dual low-pass gate — rather than
a polished product, so treat them as a workshop you're welcome to look around, not an app.
