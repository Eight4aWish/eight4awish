---
tags: [skill-creator]
max_turns: 60
timeout_seconds: 1800
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebSearch, WebFetch]
---

I'm building a 6HP eurorack module around a Raspberry Pi Pico 2. The gate input is: jack -> 100k -> base of an MMBT3904, emitter to ground, collector straight to a GPIO with the Pico's internal pull-up turned on. Nothing else on it. Before I send the board to JLC can you check it against how other modules do gate inputs? Put the review in gate_review.md
