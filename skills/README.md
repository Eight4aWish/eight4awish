# Skills

Skills for Claude that came out of building Eurorack modules for
[Eight4aWish](https://eight4awish.com). A skill is a folder of instructions, with any
references and scripts it needs, that Claude loads when a task matches it.

| Skill | What it does |
|---|---|
| [circuit-block-review](circuit-block-review/) | Reviews one block of a circuit (CV in, gate out, power, MIDI…) against published, proven designs before a PCB order: real schematics, datasheets, the arithmetic, and ranked findings with parts and costs |

## Using one

- **Claude Code:** copy the skill's folder into `~/.claude/skills/` to use it in every project,
  or into `.claude/skills/` inside one project. Claude uses it when a task fits its
  description, or you can ask for it by name.
- **The Claude apps:** zip the skill's folder and upload it as a custom skill in Settings.

Each skill has an `evals/` folder with the test cases it was checked against. Claude Code can run
them with `claude plugin eval`.

## Licence

MIT ([LICENSE](LICENSE)). These are the skills as we use them, shared as they are.
