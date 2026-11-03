# Eurorack: conventions, checks by block, and published designs

Contents: [Conventions](#conventions) · [Checks by block](#checks-by-block) ·
[Published designs](#published-designs)

The figures marked "seen in" come from reading these designs' own files in October 2026. Re-read
the design itself before relying on one.

## Conventions

Eurorack has no formal standard. Doepfer's A-100 pages are the nearest thing, and every maker
works from them: <https://doepfer.de/a100_man/a100t_e.htm>.

**What Doepfer says:**
- **Gates, triggers and clocks:**
  - "typical voltage levels of 0/+5 V";
  - "any voltage beyond about +3V is treated as 'high' … any voltage below 1V is treated as
    'low'";
  - "all A-100 modules will withstand gate/trigger/clock signals up to +12V".
- **Signal levels:**
  - audio about ±5 V;
  - LFOs about ±2.5 V;
  - envelopes 0 to 8 V;
  - pitch at 1 V per octave.
- **Power:**
  - ±12 V on a ribbon with the red stripe at −12 V;
  - "applying other than the described voltages or changing the polarity will result in the
    module's instant destruction". Reversed ribbons happen, so protect against them.
- **No hot-plugging:** take the case's plug out first
  (<https://www.doepfer.de/a100_man/a100m_e.htm>).
- **Rail order at power-on:** the PSU's rails "appear not exactly at the same time after power
  on" (<https://doepfer.de/a100z_e.htm>), so the design must survive any rail order.

**What published designs do (convention, not standard):**
- **Input impedance about 100 kΩ:** seen in Mutable, Electrosmith, Befaco Lich, EuroPi and O&C.
  Others use 120 kΩ (Workshop Computer), 147 kΩ (4ms) or 470 kΩ (Ogham). Doepfer gives no
  figure.
- **Outputs through a series resistor,** usually 1 kΩ (Mutable's value; Performer uses 220 Ω),
  so an output patched into another output survives.
  - Inside the op-amp's feedback loop, it doesn't sag under load.
  - Outside the loop, a 100 kΩ input pulls the output down 1 %: about 12 cents an octave at
    1 V/oct, and calibration with no load attached can't see it.
- **Hot audio:** modern modules put out up to about 20 V p-p (Mutable Beads), twice Doepfer's
  figure. Size audio inputs for it.
- **CV output ranges seen:**
  - ±5 V: Performer, Marbles, Alchemy Lab;
  - ±6 V: Workshop Computer;
  - ±8 V: Stages;
  - 0–10 V: EuroPi;
  - 0–5 V: Daisy Patch SM.

  Envelopes want 0–8 V, so a ±5 V output can't make a full one.

## Checks by block

These are the questions each kind of block raised in practice. Answer them with numbers.

### Power entry and rails
- **Reverse polarity:** a Schottky or ideal diode on each rail. Note the headroom it costs every
  op-amp behind it.
- **Hot-plug ringing:** ferrites and bulk capacitance on the rails. Ceramic-only input capacitors
  can ring to about twice the step when plugged in live (Linear Technology AN-88).
- **A buck for digital:**
  - Use forced PWM, or a pulse-skipping converter puts bursts into the audio band at light load.
  - Keep its input ripple off the ±12 V the op-amps use: a ferrite and capacitors at its input.
- **Linear regulators for analogue.** LDOs can't sink current. Anything clamped into their rail
  (gate-input clamp diodes, say) needs a minimum load, or the rail rises past the chips' maximum.
- **Power-up order:** check what each chip needs (codecs often want analogue before digital),
  and that every rail order the PSU might produce is safe.

### Audio in
- **Full scale:** against hot Eurorack audio (about 20 V p-p) and the codec's input range.
- **Bias:** the codec's own (VCOM or VREF), and whether the op-amp stage sits on it.
- **Coupling:** does the codec already high-pass its input?
- **Input impedance,** and clamps for faults rather than for normal levels.

### Audio out
- **Filtering:**
  - the reconstruction filter the codec's datasheet asks for; second order is the norm;
  - an on-chip filter the maker calls insufficient.
- **Gain to the target level.**
- **DC or AC coupling:**
  - DC lets the output carry CV;
  - check for a bias the codec puts on its output. The SGTL5000's line out sits on about
    1.5 V and needs AC coupling before any gain.
- **Output resistor:** its power rating when patched into another output at ±12 V. An 0402
  runs at several times its rating.
- **Polarity:** whether the stage inverts.

### CV in
- **Impedance and range.**
- **Gain error:** from the series resistor and the pull-down, and whether calibration removes it.
- **The converter's input filter** against the scan rate.
- **Protection:**
  - patched to ±12 V;
  - a ±15 V fault;
  - ESD at the jack. Use a TVS when there's little series resistance in front of the chip.
  - A signal arriving while the module is unpowered.
- **An unpatched input:** what it reads, and how firmware tells that from 0 V.
- **Bidirectional jacks:** a switch's leakage and charge injection into the reading.

### CV out
- **Resolution for 1 V/oct:**
  - 12-bit over a 10 V span is about 2.9 cents a step;
  - 16-bit is about 0.2.
- **Range:** can the extremes be reached inside the DAC's specified codes?
- **The offset:**
  - taken from the DAC's own reference, its drift cancels;
  - taken from a supply rail, the rail's noise and drift go straight into the pitch.
- **The series resistor:** inside or outside the feedback loop.
- **The op-amp's swing** at the real rails.
- **The output resistor's power** into a short.
- **The DAC's reference at start-up:** a glitch when it's enabled.
- **Logic levels:** a 5 V DAC driven from a 3.3 V microcontroller may not see a valid high.
  Check VIH.

### Gate in
- **Thresholds against Doepfer:** high above about 3 V, low below 1 V.
  - A bare transistor switches near 0.6 V, inside Doepfer's "low".
  - Hysteresis stops a slow edge chattering.
- **Speed:** short triggers (about 100 µs), and edge speed into the input.
- **Input impedance.**
- **Negative inputs:**
  - A bipolar LFO or −12 V reverse-biases a transistor's base-emitter junction. Check VEBO
    (often 5–6 V).
  - Clamp diodes push current into a rail (see Power).
- **State at power-up.**

### Gate out
- **Level:** 5 V or more. A 74HCT part at 5 V reads 3.3 V logic as high (VIH 2.0 V).
- **Series resistor and clamps;** the fault current when shorted or patched to ±12 V.
- **State before the firmware runs:** hold output-enable off.

### Pots
- **Ratiometric reading:** the pot's top is the converter's reference, so a sagging supply moves
  both.
- **Wiper loading:** a pull-down near the pot's value bends its law. A 100 kΩ pull-down on
  100 kΩ pots bends it by up to 12 %; 1 MΩ doesn't.
- **The reference:** filtered, so long hand-wired leads can't disturb the converter.

### Buttons and encoders
- **Debounce:** an RC, or in software.
- **Don't read an encoder over a bus that something slow can hold.** A full 128×64 OLED frame
  holds a 400 kHz I2C bus for about 23 ms, long enough to lose steps.
- **A smaller capacitor** on lines an encoder might use, so quick turns aren't smoothed away.

### MIDI
- **The specs:**
  - the MIDI Association's electrical spec, CA-033;
  - its TRS spec, RP-054 (Type A and Type B wiring).
- **The receiver:** an opto-isolator (H11L1 and 6N137 are common) at the microcontroller's
  voltage.
- **The sender's resistors,** per the spec.
- **5 V tolerance:** if the receiving device pulls the line to 5 V, the sending pin must be 5 V
  tolerant, or the sender needs a 5 V buffer.

### LEDs (WS2812-type)
- **Data level:** 5 V LEDs want about 0.7 × VDD, so buffer a 3.3 V microcontroller's data line
  (a 74AHCT1G125, say).
- **The data line's series resistor,** the current budget, and a bulk capacitor. Adafruit's
  NeoPixel guide covers all three:
  <https://learn.adafruit.com/adafruit-neopixel-uberguide/best-practices>.

## Published designs

Proven designs whose schematics or design files are public. Each repository states its own
licence, from permissive to share-alike and non-commercial, so check it before copying a
circuit.

| Design | Good for | Files |
|---|---|---|
| **Mutable Instruments**, every module | Beads: codec, audio in and out, CV in, power. Plaits, Marbles: CV in, power. Marbles, Stages: CV out. Yarns: MIDI. Braids: encoder | Eagle `.sch` (text) in each module's `hardware_design/pcb/`: <https://github.com/pichenettes/eurorack>. PDFs: <https://pichenettes.github.io/mutable-instruments-documentation/modules/marbles/downloads/marbles_v70.pdf> (swap in the module and version) |
| **Electrosmith Daisy**: Patch SM, Daisy Patch, Pod, Field, Seed2 | Codec, CV in and out, gates, MIDI, power | Schematic PDFs and datasheets: <https://docs.daisy.audio/hardware> |
| **Electrosmith Seed3 DevKit Eurorack** | MIDI (TRS in, out, thru), power | <https://github.com/daisyaudio/Seed3-DevKit-Eurorack> |
| **4ms** MP153 carrier and brainboard | CV in, codec, power | <https://github.com/4ms/mp153-devboard>, <https://github.com/4ms/mp153-brainboard-pcb> (KiCad) |
| **4ms** STS | Gates | <https://github.com/4ms/STS> |
| **Befaco** Lich, Oneiroi, Iroi | CV in, gates, codec | <https://befaco.org/docs/Lich/Lich_V1_sch.pdf>, <https://befaco.org/docs/Oneiroi/Oneiroi_0_1_THT.pdf>, <https://befaco.org/docs/Iroi/Iroi_V1_THT_Schematic.pdf> |
| **Music Thing Modular** Workshop System Computer (RP2040) | CV in and out, audio, gates, calibration in EEPROM | <https://github.com/TomWhitwell/Workshop_Computer>, `documentation/computer_Rev_1_0_0_Schematic.pdf` |
| **Allen Synthesis** EuroPi (Pico) | 0–10 V CV out, inputs, panel | <https://github.com/Allen-Synthesis/EuroPi>, `hardware/surface-mount/` (KiCad) |
| **Ornament & Crime** (Teensy 3.2) | 16-bit CV out (DAC8565), encoders | <https://github.com/mxmxmx/O_C>, `hardware/o_c_rev2e_schematic.pdf` |
| **Westlicht Performer** | 16-bit CV out (DAC8568), gates | <https://github.com/westlicht/performer-hardware> |
| **Hermetic Modular** Alchemy Lab SDK | Bidirectional jacks (the software side) | <https://github.com/hermetic-modular/alchemy-sdk> |
| **AMYboard** | MIDI | <https://github.com/shorepine/tulipcc/tree/main/docs/pcbs/amyboard> |
| **Adafruit** MIDI FeatherWing | MIDI | <https://github.com/adafruit/Adafruit-MIDI-FeatherWing-PCB> |
| **The MIDI Association** | MIDI electrical and TRS specs | <https://midi.org/5-pin-din-electrical-specs>, <https://midi.org/specification-for-use-of-trs-connectors-with-midi-devices> |
| **MIDI in Eurorack**, Doudoroff's survey | Which modules use TRS Type A or B | <https://doudoroff.com/midi/> |
| **The chip maker's evaluation board** | The chip itself, as its maker drives it | Search "<part number> EVM user's guide". TI's ADS8688EVM, for example: <https://www.ti.com/lit/ug/sbau230c/sbau230c.pdf> |

**To find more,** search GitHub for the chip's part number in `.kicad_sch` and `.sch` files.
Designs that use the same converter are the closest comparison there is.
