# Report template: one block

Use these sections in this order. A reader who opens only §6 should still be able to act.

```markdown
# <Block>: review against published designs

<One paragraph: what the block is, what it feeds, the date, and the design revision reviewed.>

## 1. Our design, exactly
<Every part: designator, value, footprint, the nets it joins, and the rails. Read from the
design files, and say which files.>

## 2. What the block must do, in numbers
<Ranges, impedances, rates, the microcontroller's pin limits, and the levels it meets at the
panel.>

## 3. Reference designs, with evidence
### 3.1 <Design name, revision or commit, licence>
<Its version of this block: designators and values as read, with file and page or line.
What it does differently from ours, and why it might.>
### 3.2 ...

## 4. Comparison
<One table: a row per design, ours last; a column for each parameter that matters to this
block.>

## 5. The checks
### 5.1 <A question, such as "What does the source see?">
<The arithmetic, the datasheet figures with page numbers, and the answer. Mark inferences.>
### 5.2 ...

## 6. Findings
### A: errors or risks, must fix
**A1. <Title>**
- What: <the exact change: part, value, part number>
- Why: <the evidence>
- Cost: <for JLCPCB, Basic or Extended; otherwise the price and any new part type>
- Side effects: <what else it touches>
### B: worth adopting
### C: optional
### F: firmware or documentation only

## 7. Where the design is already right
<Each choice the review confirms, and the evidence. This stops the next review reopening it.>

## 8. Sources
<Every design file, datasheet (document number and revision) and page used, with URLs and
commit hashes. Mark anything unverified.>
```

## The decision list (several blocks)

```markdown
# <Project>: block review, decision list

<Date, the blocks reviewed, and a one-line verdict.>

## <Block>
| | Change | Cost |
|---|---|---|
| A | **<change>**: <why, in one line> | <Basic / Extended / none> |
| B | ... | ... |
| F | ... | — |

## Spec corrections
- <Anything the spec or notes said that the review found wrong.>

## Decided by <owner>, <date>
1. <Decision, and anything it left open.>
```
