---
tags: [skill-creator]
max_turns: 60
timeout_seconds: 1800
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebSearch, WebFetch]
---

here's my CV out stage for a teensy 4.1 based eurorack sequencer. MCP4822 running at 5V, internal 2.048V ref with the 2x gain bit set so 0-4.096V out. That goes into a TL072 on +-12V as a non-inverting amp with gain 2.44, and there's a 100k from the inverting input to -12V to shift it down to roughly +-5V. Op amp output goes straight to the jack. I want 1V/oct good enough for pitch. Can you review this block before I order PCBs? Put the review in cv_out_review.md
