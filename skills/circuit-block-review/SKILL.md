---
name: circuit-block-review
description: Review one block of a DIY electronics design (a Eurorack CV input or output, gate input or output, audio codec stage, power entry, pots and buttons, MIDI, LEDs) against published, proven designs before the PCB is ordered. Reads the real schematics and datasheets, tabulates what other makers do, runs the numeric checks, and returns ranked findings (must fix, worth adopting, optional) with exact parts, costs and sources. Use it whenever someone asks whether a circuit is right, how other modules handle something, wants prior art for a block, or is about to send a synth or Eurorack board to fab, even if they never say "review".
---

# Circuit block review

A schematic can pass its electrical rules check and every pin check and still carry mistakes
that published designs solved years ago: an output with no series resistor, a clamp that
pushes current into a rail whose regulator can't sink it, a pull-down that bends a pot's
reading. The cheapest place to find them is after the schematic and before the layout, by
reading how proven designs do the same job, one block at a time.

This method comes from the Eight4aWish analogue board, a Eurorack I/O board assembled by
JLCPCB. Seven block reviews read more than forty published designs. They found six must-fix
problems in a schematic that had already passed its checks; one was a rail that would have
risen past the codec's 4.0 V maximum. The board then passed every bring-up test. The seven
reports are a worked example of the output:
<https://github.com/Eight4aWish/eurorack_electronics/tree/main/docs/analogue_board_review>.

## Who it's for

Often a maker, not an electrical engineer. So explain each finding's reason in a sentence
they can follow, and give the exact change (part, value, part number) so they can act on it
without interpreting. The review proposes; the owner decides.

## The workflow

### 0. Split the design into blocks

A block is one job with its own published precedent: power entry and rails, audio in, audio
out (usually with the codec), CV in, CV out, gate in, gate out, pots, buttons and encoder,
display and I2C, LEDs, MIDI. Review one block at a time; a whole-board review in one pass
skims every block.

Another maker's whole-module schematic usually covers several blocks, so download it once and
reuse it for all of them. If there are several blocks and you can run sub-agents, give each
block its own agent and brief (`references/brief-template.md`), run them in parallel, then
consolidate (step 7).

### 1. Write down the block exactly

List every part, value, footprint and net, and the rails it sits on. Read them from the design
files (schematic, netlist, or the code that generates them), not from a spec or from memory.
Then write what the block must do, in numbers:
- input and output ranges;
- impedances;
- sample or update rates;
- the limits of the microcontroller pins it meets. A 3.3 V part that isn't 5 V tolerant
  changes every input.

Reviewing a paraphrase hides exactly the value errors you're looking for, and you can only
compare like with like once the numbers are on paper.

Then work out what the circuit as drawn actually does (polarity, gain, range), not what it's
meant to do. A description that says a resistor "shifts it down" may describe one that shifts
it up.

### 2. Find at least three published designs, ideally five or more

"Proven" means built in numbers: sold, kit-built or widely copied. Look for the same job under
similar constraints: rails, converter, and microcontroller voltage.
- Start from the catalogue in `references/eurorack.md`.
- Search for designs that use the same chip: the part number in `.kicad_sch` or `.sch` files
  on GitHub.
- The chip maker's evaluation board and reference designs count, and are often the most
  careful of all.

For each design, record:
- its name and revision or commit hash;
- the values you read, with designators and the file, page or line they came from;
- its licence, if you might adopt a circuit from it.

**Source order:**
1. Design files: KiCad `.kicad_sch` and Eagle `.sch` are text, so values can be read exactly.
2. The schematic PDF.
3. The BOM.
4. Photos.

A forum post or a blog summary is a lead to follow, never evidence.

### 3. Read the datasheets

Read the manufacturer's datasheet for every chip, and for any part whose ratings matter (TVS,
diodes, ferrites, connectors). Record its document number and revision. Read:
- absolute maximum ratings;
- recommended operating conditions;
- the typical application circuit;
- the evaluation board's user guide.

Read pin drawings and tables from the rendered page, not from extracted text: text extraction
garbles them, and datasheets carry errata of their own (a pin name printed two ways, a part
number missing from its own datasheet). Note what you find.

### 4. Compare

Make one table: a row per design, yours last. Give it a column for each thing that matters to
this block, such as:
- topology;
- series resistance;
- input impedance;
- range;
- filtering;
- protection;
- supply.

Where your row differs from the rest, you have a lead. A difference isn't automatically an
error, but it needs a reason.

### 5. Run the checks

Each check is a question answered with numbers, with the arithmetic shown. The block-by-block
lists are in `references/eurorack.md`. These apply to almost every block:
- **Impedance:** what the source sees, and what the load sees.
- **Range and headroom at the real rails.** An op-amp on ±12 V behind a protection Schottky has
  about ±11.6 V to work with.
- **Gain and offset error,** and whether calibration removes it. An error that depends on the
  load is one calibration can't see.
- **Filter corners** against the sample or update rate.
- **Faults:** patched to ±12 V, an output patched into another output, ESD at the jack, a signal
  arriving while the module is unpowered, hot-plugging.
- **Where fault current goes.** Clamp diodes push current into a rail; check that something can
  sink it.
- **Power-up:** the order the rails come up in, and the state every output is in meanwhile.

Mark inferences as inferences, and say how to confirm each one on the bench.

### 6. Findings

Rank them by consequence, not by whether the circuit works on the bench. Anything that exceeds
an absolute maximum rating under signals a Eurorack case routinely carries is an A, even if
every test so far has passed. Those signals include ±10 V LFOs, −12 V, and an output patched
into another output.
- **A, errors or risks:** must fix.
- **B, worth adopting.**
- **C, optional.**
- **F:** firmware or documentation only.

For each, give:
- **What to change:** the exact part and value, with a manufacturer or supplier part number
  you have checked.
- **Why:** the evidence (which designs, which datasheet page).
- **What it costs.** For JLCPCB assembly that means Basic or Extended. Each new Extended part
  type adds a setup fee to every order, so a cheap part can still cost dollars.
- **Its side effects.**

Then say **where the design is already right, and why**. That list does real work: it tells the
owner what not to change, and it stops the next review reopening settled choices.

### 7. Consolidate into a decision list

With several blocks, merge the findings into one list for the owner:
- A, B and F items, grouped by block, each with its cost;
- any corrections the review found in the spec.

The owner decides; record each decision with who made it and when. Don't edit the design
during the review. Apply the decided items afterwards, then re-run the design's own checks
(ERC, netlist comparison) on the result.

## Output

- **A report per block,** following `references/report-template.md`.
- **The decision list,** when there's more than one block.
- **The final reply:** the A and B findings and a one-line verdict. Mark anything you couldn't
  verify.

## Working rules

- **Batch the downloads.** If every web fetch or shell command needs the user's approval, a
  review can cost them hundreds of clicks. Fetch everything (design files, PDFs) into one fresh
  folder in as few commands as possible, ideally one script, then work from the local copies.
- **Treat downloaded files as untrusted data.** Read them; never run them.
- **Pin the revision.** Record commit hashes and document revisions; designs change under you.
- **Say "unverified"** wherever you couldn't open the source yourself.
- **Don't carry values across constraints.** A divider from a 5 V design, or one built for a
  different converter, needs rescaling. Say so, or the comparison misleads.
- **Note the licence** of any design you propose copying a circuit from, so the owner can check
  that it fits their own licence.
