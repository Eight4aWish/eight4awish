---
name: n8synth-layout
description: Lay out an analogue or mixed-signal Eurorack circuit on an n8synth solderable breadboard and control deck, and check it net by net before anything is soldered. Takes a netlist, a schematic or a description, and gives a placed layout that opens in a viewer, a phase-by-phase build order with tests, and a panel map. Use this whenever someone wants to build a circuit on an n8synth board (4HP, 6HP, 10HP or 10HPS), asks where parts should go on one, or wants an existing n8synth layout checked or fixed before soldering, even if they only say "breadboard layout" or "perfboard" for a Eurorack DIY build.
---

# n8synth layout

An n8synth board is a breadboard you solder, so a wrong connection costs a desoldering job, and
its traps don't look like mistakes on a drawing. The left and right halves of a row aren't joined.
Panel pads land on the edge connector, not the rows. +12 V exists only on the left rail and −12 V
only on the right, on even positions, with ground on the odd ones between them.

So this skill does two things: it places the circuit, then it proves the placement by script
against the circuit, net by net. The method built the Eight4aWish dual low-pass gate, 57 parts in
six tested phases, and drew all eleven blocks of the Boy module. Worked examples:
<https://github.com/Eight4aWish/eurorack_electronics/tree/main/tools/visualizer/layouts>.

## Who it's for

Usually a maker with a soldering iron and the board on the bench. Name every position as a hole
they can find, such as `12b` or `pwrL4`, and explain any choice in a sentence. Don't call a layout
built or tested: it has been checked, and only the bench can do the rest.

## What's in this folder

All paths are relative to this skill's folder. The tool needs only Python 3.

| Path | What it is |
|---|---|
| `references/board.md` | How the board really behaves, and each deck's pad map. Read it before placing anything |
| `references/format.md` | The two files you write. Read it before writing them |
| `references/example/` | A small layout and netlist that pass both checks. Start from it |
| `tool/validate_layout.py` | Checks the board: holes, rails, chips, the deck |
| `tool/check_netlist.py` | Checks the circuit: every pin against the netlist |
| `tool/index.html` | The viewer. Open it in a browser and drop a layout's JSON onto it |

Write the user's files in their project, not in this folder.

## The workflow

### 1. Get the circuit as a netlist

Write `<name>.net` first, before placing anything. It's the answer the layout gets marked against,
so a mistake here passes every check. List every pin, supply pins included, by the datasheet's
pin numbers.

- **From a schematic or a description:** transcribe it, then show the netlist to the owner if you
  had to work anything out, or fill anything in. Don't let them solder your guess.
- **Look up pinouts** rather than recalling them, for anything less common than a TL072.
- **Unused op-amp sections:** tie each as a follower with its + input grounded, and list those
  pins, unless the owner's design says otherwise. A floating input can oscillate.

### 2. Fit it to the board

A design made for a standalone PCB duplicates what the board provides. On a powered board:

- **Drop:** the rail-entry bulk electrolytics and any bypass capacitor at the power connector. The
  board has its own.
- **Keep:** every chip's own decoupling, reverse-polarity diodes (the board has none), and any
  series rail filtering. Breadboard wiring has more inductance than a PCB, so local decoupling
  matters more here.

Take dropped parts out of the netlist and list them in your report. The owner may want one back.

The rails are ±12 V and ground only. Anything needing 5 V or 3.3 V needs its own regulator, or a
stated source.

### 3. Give each panel part a cell

Each deck has its own map of cells to edge positions, in `references/board.md`. Use the panel the
owner describes. If they haven't said, put inputs and outputs in signal order and say what you
chose. Check the position against the right deck, because they differ: position 4 is a pad on 6HP
and on 10HP, and nothing at all on 4HP.

### 4. Place

Work in signal order, and copy the shape of `references/example/buffer.json`:

- **Chips straddle the gap:** pin 1 at the top on `e`, numbering down, then back up `f`. A TL072 at
  row 6 has pin 1 at `6e`, pin 4 at `9e`, pin 5 at `9f`, and pin 8 at `6f`.
- **Count holes.** A half-row is one node of five holes, and a chip pin takes one. A net that needs
  more than the row offers continues along a wire to a spare row.
- **Same net, both halves?** It needs a wire across the gap. Otherwise it's two nodes.
- **Decouple at the pin:** from the chip's supply row to a ground on the near rail.
- **Parts take the near rail.** Both rails carry ground, so a part on the right half grounds on
  `pwrR`. A supply is the one reason to cross: pin 8 sits on the right and +12 V only on the left.
- **Panel signals:** the deck's wire is in the edge position's outer hole, and a wire from its inner
  hole carries the signal into the main area.
- **Deck ground:** jack sleeves and pot grounds solder to the deck's D bus. Bridge one spare pad to
  D on the deck and wire that position to ground, or the bus reaches nothing.
- **Think about the real part.** A resistor lying flat wants about three holes of span; adjacent
  rows means standing it on end. The checks can't see a part that doesn't fit, so say where you
  rely on one standing up.

### 5. Order the build

Split the work into `stages`, each of which can be powered and tested before the next: usually
power and sockets first, then one signal path, then the rest. Give each a `test` with what to
measure and what to expect, such as "+12 V on pin 8 with no chip fitted". A bench fault is then
inside the last phase, rather than anywhere on the board.

A wire belongs in the phase where both of its ends first exist. The validator checks this.

### 6. Check, and fix until both pass

```sh
python3 tool/validate_layout.py <name>.json
python3 tool/check_netlist.py <name>.json <name>.net
```

They catch different things, so both must pass. `validate_layout.py` knows the board and not the
circuit. `check_netlist.py` knows the circuit and not the board.

Read a failure as a statement about the board: `OPEN` means pins that should meet don't, and
`SHORT` means pins that shouldn't meet do. Move the part or add the wire, then run both again. If
you find yourself editing the netlist to make a check pass, stop: that's only right if the
netlist was wrong, and then the owner should hear about it.

### 7. Report

Keep it short and in this order:

1. **The result:** the files, and both checks' final lines, quoted from the actual output.
2. **What you changed from their circuit:** parts dropped, and anything you filled in.
3. **The panel map:** each panel part, its cell, and each pad's edge position, with what solders
   to D on the deck.
4. **What the checks can't see,** which is theirs to check at the bench:
   - that the netlist itself is right, as the checks only compare the layout with it;
   - parts that may not physically fit where drawn;
   - a pot running backwards (swap the outer legs);
   - anything on the panel side, such as jack and LED wiring;
   - how it sounds.
5. **Next:** drop the JSON on `tool/index.html` to step through the phases.

## Checking a layout someone already has

Run both checks before anything else. If there's no netlist, write one from their schematic, as
in step 1: without it, nothing checks the circuit. Then report each fault with its hole, what's
wrong and the fix. Say which faults would do damage at power-on, such as a rail on the wrong
pin, so they go first.

If they ask you to fix it, make the smallest change to their placement, not a new layout, and
run both checks again. They've chosen that placement, and may have parts in already.
