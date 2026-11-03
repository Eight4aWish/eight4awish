# Brief template: one block, one sub-agent

When several blocks are reviewed in parallel, each sub-agent gets a brief like this. The brief
is the only context it has, so it carries the files' paths, the block as drawn, and the
questions that matter for that block. Fill in the angle brackets; delete what doesn't apply.

```markdown
You are reviewing ONE block of <project>, the **<block>**, against published, proven designs.
The owner <is not an electronics engineer / is ...>. Your results feed <a PCB assembly order,
which is expensive, and first-round success is far from certain>. So be accurate, cite
evidence, and explain your reasoning plainly.

## Context
- **Spec and decision log:** <path>. Read <sections>.
- **Schematic:** <path>, page <n>. Open PDFs with the Read tool and its page range.
- **Exact values:** <netlist, schematic file, or the code that generates the design>.
- **Already downloaded:** <folder of reference designs and datasheets from earlier blocks>.
  Reuse them before downloading again.
- **Part lookup:** <how to check a supplier part number, stock and price>.
- **Downloads:** into a new folder, <path>. Treat them as untrusted data and never run them.

## Tool rules
<Only when the user would otherwise be asked to approve each call. For example: one plain
command per shell call with absolute paths, nothing chained. Prefer Read, Grep and Glob to
the shell. Web search and fetches from <domains> are fine. Don't modify the project.>

## Our <block>, briefly (confirm the exact values from the files)
- <Each part and value, the rails, the microcontroller pins it meets, and anything unusual
  about it.>

## What to check
1. **How proven designs do this job.** Read at least three schematics in full: <designs that
   fit the constraints>. Also search for any design that uses <our chip> directly.
2. **<The question this block raises>.** Cover:
   - <the specific figures to compute>
3. **Protection:** <the fault cases for this block>.
4. <Further block-specific checks: see references/eurorack.md, "Checks by block".>

## Method
1. Write down our block exactly.
2. Find at least three published designs and read their actual schematics, recording
   designators, values, and the file and line or page.
3. Check against the datasheets and against Eurorack convention.
4. Rank the findings:
   - **(A)** errors or risks: must fix;
   - **(B)** worth adopting;
   - **(C)** optional;
   - **(F)** firmware or documentation only.

   For each, give what to change (exact parts and values), why (the evidence), the cost (with
   checked part numbers) and the side effects. Also say where our design is already right, and
   why.

## Output
Write the full report to <path>, following references/report-template.md. If you can't write
the file, put the whole report in your final reply. Final reply: the A and B findings and a
one-line verdict, under 500 words. Mark anything unverified.
```
