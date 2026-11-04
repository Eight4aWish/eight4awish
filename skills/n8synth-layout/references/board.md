# How the n8synth board behaves

From the builder, with the physical boards in hand. The full reference is
<https://github.com/Eight4aWish/eurorack_electronics/blob/main/docs/n8synth_platform.md>.

Don't work this out from n8synth's `.n8layout` templates: they describe a drawing. Reasoning from
them got the row count wrong three times.

## Three different things, working in from either edge

| | Positions | What's joined |
|---|---|---|
| **Edge connector** | 1–40 | Each position is two holes, outer and inner, joined to each other and to nothing else |
| **Power rail** | 1–40 | Odd positions are ground; even positions are the supply |
| **Main area** | see below | Five holes in a row are joined. Left (`a`–`e`) and right (`f`–`j`) are **not** joined to each other |

**Rails:** `pwrL` is ground on odd and **+12 V** on even. `pwrR` is ground on odd and **−12 V** on even.

## Board variants

| | Main-area rows | Power conditioning |
|---|---|---|
| **Powered** (the 4HP, 6HP and 10HP kits) | 1–36 | 100 nF and 10 µF or more on each rail |
| **Plain** (the second board of a 10HPS) | 1–40 | None |

On a powered board, the 10 µF capacitors fill power-rail positions 37 and 38. Positions 39 and 40
are free, as are 1 and 2. Those four exist for jumping power between stacked boards, so on a
single board they're ordinary rail holes. Edge positions 37–40 work normally, though no main-area
row sits beside them.

## Hole names

| Name | Hole |
|---|---|
| `12b` | Main area, row 12, column b |
| `pwrL4` | Left power rail, position 4 (+12 V) |
| `ctrlLo5` | Left edge connector, position 5, outer hole (nearer the board's edge) |
| `ctrlLi5` | The same position, inner hole (nearer the power rail) |
| `ctrlRo5`, `ctrlRi5` | The same on the right |

## The control deck

Each panel cell has pads **A, B and C**, which land on edge positions, not on main-area rows, and
pad **D**. All the D pads are joined across the deck into one ground bus.

**The outer hole** carries the deck's connection, and **the inner hole** is free on a single board.
So a panel signal arrives at the outer hole, and you run a wire from the inner hole to wherever
it's needed. Two things at one position, one in each hole, is normal. Two in one hole is a collision.

**Positions with no pad** are isolated pairs of holes, so they're free tie points for routing. They
carry no panel signal. Inside the header footprints (1–10, 16–25 and 31–40), a header pin occupies
the outer hole, so use the inner one.

**Which edge:** 4HP and 6HP use one edge connector, by convention the left, and never both. 10HP uses
both.

### Pad maps

The three numbers after each cell are its pads A, B and C.

**4HP, left edge:** JPS1 1,2,3 · JPS2 8,9,10 · JPS3 15,16,17 · JPS4 22,23,24 · JPS5 30,31,32 · JPS6 38,39,40

**6HP, left edge:** JPS1 1,2,3 · JPS2 4,5,6 · JPS3 7,8,9 · JPS4 10,11,12 · JPS5 13,14,15 · JPS6 16,17,18 ·
JPS7 23,24,25 · JPS8 26,27,28 · JPS9 29,30,31 · JPS10 32,33,34 · JPS11 35,36,37 · JPS12 38,39,40

**10HP, left edge:** JPS1 1,2,3 · JPS2 4,5,6 · JPS4 7,8,9 · JPS7 17,18,19 · JPS8 20,21,22 · JPS10 23,24,25 ·
JPS13 32,33,34 · JPS14 35,36,37 · JPS16 38,39,40

**10HP, right edge:** JPS3 1,2,3 · JPS5 4,5,6 · JPS6 7,8,9 · JPS9 17,18,19 · JPS11 20,21,22 · JPS12 23,24,25 ·
JPS15 32,33,34 · JPS17 35,36,37 · JPS18 38,39,40

### Panel parts on a cell

These are how the dual low-pass gate was wired. Check them against your own parts.

- **A jack:** the tip on pad A, the sleeve on D. Pads B and C stay free.
- **A pot:** the three legs on A, B and C: left, wiper, right, with the knob facing you. Swap the outer
  legs if it runs backwards.
- **An LED:** one leg on each of two pads, usually A and B. Say which leg is on which, because the
  panel side is where it gets soldered.
- **Getting the D bus to ground:** bridge a spare pad to D on the deck, then wire that pad's edge
  position to a ground. One wire is enough. Choosing a position towards the middle of the board
  leaves `pwrL39` free for something near the bottom.

## Moving a design onto the board

| Drop | Keep |
|---|---|
| Rail-entry bulk electrolytics, typically 10–47 µF | Each chip's 100 nF at its supply pins |
| A bypass capacitor at the power connector | Reverse-polarity protection diodes: the board has only capacitors |
| | Series rail resistors, which also act as slow fuses |
| | Input and output capacitors on any regulator you add |

Dropping is the low-risk direction: a bulk capacitor can go back near the chips in seconds if a
bench test shows ripple on a long run.

## Stacking

A design that outgrows one board stacks a second over it. The stacking connectors are awkward in
practice, so jump signals along pin headers on the inside of the connector rails, using the inner
holes: deck, first board, second board. Jump power using rail positions 1, 2, 39 and 40.

Whether a stacked board is conventionally mounted flipped, left for right, hasn't been confirmed.
Ask the owner.
