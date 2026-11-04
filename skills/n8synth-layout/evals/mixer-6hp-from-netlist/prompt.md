---
tags: [skill-creator]
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I'm building a three-input mixer on a 6HP n8synth board and control deck, and I'll solder it this weekend. This is the circuit from my KiCad sheet:

Power entry: +12V from the bus goes through D1 (1N5817, anode to the bus) to VCC. -12V from the bus goes through D2 (1N5817, cathode to the bus) to VEE. C1 10uF from VCC to GND and C2 10uF from GND to VEE are the rail bulk caps, and C3 100nF across VCC to GND and C4 100nF across GND to VEE are the bypass at the power connector.

U1 is a TL072 (pin 8 VCC, pin 4 VEE). C5 100nF from pin 8 to GND and C6 100nF from pin 4 to GND are at the chip.

U1A is an inverting summer: jacks J1, J2 and J3 go through R1, R2 and R3 (100k each) to pin 2. R4 100k goes from pin 2 to pin 1. Pin 3 is grounded. Pin 1 goes through R5 (1k) to the output jack J4.

U1B isn't used. Do whatever you'd normally do with it.

Save the layout as mixer.json and the netlist as mixer.net in this folder.
