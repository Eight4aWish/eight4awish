# The two files

`example/buffer.json` and `example/buffer.net` are a complete pair that pass both checks. Copy
their shape.

## The netlist, `<name>.net`

Plain text, one net per line, `#` for comments. Keep each pin on exactly one net.

```text
+12V: rail:+12V U1.8 C1.1
GND: rail:GND C1.2 R1.2 J1.C
OUT: U1.1 R3.1
JACK: R3.2 J2.A
NC: U2.5                  # a pin that must connect to nothing
```

| Member | Means | In the layout |
|---|---|---|
| `U1.8` | A chip's pin, by datasheet number | `ics[].id`, `pins[].n` |
| `R3.1` | A two-pin part's first or second end | `twoPins[]`: `r1`/`c1` is 1, `r2`/`c2` is 2 |
| `D1.A`, `D1.K` | A diode's anode and cathode | A is `r1`/`c1`. K, the band, is `r2`/`c2` |
| `C1.+`, `C1.-` | An electrolytic's leads | + is `r1`/`c1`. − is `r2`/`c2` |
| `Q1.E`, `Q1.B`, `Q1.C` | A transistor's legs | `transistors[]` |
| `J1.A`, `LED1.B` | A panel part's pad, whatever the part: a jack, pot, LED or switch | `jpsWires[].ref`, `pad` |
| `rail:+12V`, `rail:-12V`, `rail:GND` | The board's own rail | Any hole with that polarity: +12 V is even on `pwrL`, −12 V is even on `pwrR`, ground is odd on either |

A net that lists a rail must reach it. A net on a rail must list it. A protected supply is two nets:
`+12V: rail:+12V D1.A` and `VCC: D1.K U1.8 C1.1`.

Jack sleeves aren't listed, as they solder to D on the deck. List the one pad you bridge to D as a
member of `GND`, such as `J1.C`.

## The layout, `<name>.json`

Every part has a `stage`, the id of the phase it's fitted in.

```json
{
  "title": "Three-input mixer",
  "board": "n8synth (single board, rows 1-36)",
  "boardId": "n8synth-6hp",
  "revision": "drawn, not built",
  "notes": "Anything the builder should know.",
  "stages": [
    {"id": 1, "name": "Power and sockets", "desc": "What gets fitted.",
     "test": "+12 V on pin 8 with no chip fitted.", "color": "#e74c3c"}
  ],
  "ics": [
    {"id": "U1", "value": "TL072", "label": "TL072", "stage": 1, "pins": [
      {"n": 1, "r": 6, "c": "e", "net": "OUT"},
      {"n": 8, "r": 6, "c": "f", "net": "VCC"}
    ]}
  ],
  "twoPins": [
    {"id": "R1", "type": "R", "value": "100k", "r1": 2, "c1": "b", "r2": 3, "c2": "pwrL", "stage": 2}
  ],
  "transistors": [
    {"id": "Q1", "subtype": "NPN", "value": "2N3904", "stage": 2,
     "eR": 10, "eC": "b", "bR": 11, "bC": "b", "cR": 12, "cC": "b"}
  ],
  "jumpers": [
    {"id": "W1", "r1": 1, "c1": "ctrlLi", "r2": 2, "c2": "a", "label": "IN", "stage": 2}
  ],
  "powerWires": [
    {"id": "P1", "r1": 6, "c1": "g", "r2": 6, "c2": "pwrL", "label": "U1 pin 8: +12V", "stage": 1}
  ],
  "jpsWires": [
    {"id": "J1.A", "ref": "J1", "pad": "A", "label": "IN", "lbl": "IN", "row": 1, "col": "ctrlLo", "stage": 2}
  ],
  "netLabels": [
    {"r": 2, "side": "L", "name": "IN", "stage": 2}
  ]
}
```

- **`boardId`:** `n8synth-4hp`, `n8synth-6hp`, `n8synth-10hp` or `n8synth-10hps`. It tells the
  validator which deck's pads and rows to check against, so a wrong one gives wrong answers.
- **`ics`:** list every pin, all of them, even unused ones. A single-in-line part, such as a
  three-pin regulator, counts along one column. `net` on a pin is its label in the viewer.
- **`twoPins`:** `type` is `R`, `C`, `D` or `L`. A long part is drawn dashed.
- **`transistors`:** `subtype` is `NPN` or `PNP`. Check the legs against the datasheet's pinout.
- **`jumpers`:** add `"side": "back"` for a wire run underneath, between tinned edge holes.
- **`powerWires`:** a wire with one end on a rail.
- **`jpsWires`:** the deck's wire at the edge position, on the outer hole. It's the only entry that
  uses `row` and `col`.
- **`netLabels`:** `side` is `L` or `R`. Labels are for reading: they connect nothing, and two rows
  with one label are still two nodes.
