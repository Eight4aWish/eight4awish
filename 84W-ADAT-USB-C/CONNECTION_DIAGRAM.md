# Connection Diagram - ADAT to USB-C Interface

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR SETUP                               │
└─────────────────────────────────────────────────────────────────┘

╔═════════════════╗
║   MacBook Pro   ║
║    (or Mac)     ║
╚═════════════════╝
        │
        │ USB-C Cable
        ↓
┌───────────────────┐
│  USB-C Audio      │
│  Interface with   │◄─────┐
│  ADAT I/O         │      │
│  (e.g. Scarlett   │      │
│   18i20)          │      │
└───────────────────┘      │
        │                  │
        │ Toslink          │ Toslink
        │ Optical          │ Optical
        │ ADAT OUT         │ ADAT IN
        ↓                  │
┌───────────────────┐      │
│  Expert Sleepers  │      │
│      ES-10        │──────┘
│  (Eurorack Module)│
└───────────────────┘
        │
        │ Patch Cables
        ↓
┌───────────────────┐
│   Your Eurorack   │
│   Modular System  │
│ (VCOs, VCFs, etc.)│
└───────────────────┘
```

## Detailed Connection Diagram

```
PHYSICAL CONNECTIONS:
────────────────────

┌─────────────────────────────────────────────────────────┐
│ Mac                                                      │
│  └─ USB-C Port                                          │
│      └─ [USB-C Cable] ─────────────────────┐           │
└─────────────────────────────────────────────│───────────┘
                                               │
┌──────────────────────────────────────────────│───────────┐
│ USB-C Audio Interface                        │           │
│                                              ↓           │
│  ┌─ USB-C Input ◄────────────────────── [Cable]        │
│  │                                                       │
│  ├─ ADAT Optical OUT (Toslink)                         │
│  │   └─ [Optical Cable] ────────────────────┐          │
│  │                                            │          │
│  └─ ADAT Optical IN (Toslink)                │          │
│      ↑                                        │          │
│      └──────────────── [Optical Cable] ◄──┐  │          │
└───────────────────────────────────────────│──│──────────┘
                                            │  │
┌───────────────────────────────────────────│──│──────────┐
│ Expert Sleepers ES-10 (Eurorack)          │  │          │
│                                            │  │          │
│  ┌─ ADAT IN (Optical) ◄──────────────────┘  │          │
│  │                                            │          │
│  └─ ADAT OUT (Optical) ────────────────────┘           │
│                                                          │
│  ┌─ CV/Audio Inputs 1-4 (3.5mm jacks)                  │
│  │   ↑                                                   │
│  │   └── [Patch cables from modular]                   │
│  │                                                       │
│  └─ CV/Audio Outputs 5-8 (3.5mm jacks)                 │
│      │                                                   │
│      └── [Patch cables to modular]                     │
└──────────────────────────────────────────────────────────┘
```

## Signal Flow Diagram

### Recording from Modular (Input Path)

```
Modular Synth Output
        │
        │ 3.5mm Patch Cable
        ↓
ES-10 Input Jacks (1-4)
        │
        │ Analog to Digital Conversion
        │ DC-Coupled (±10V)
        ↓
ES-10 ADAT Encoder
        │
        │ ADAT Optical (8 channels @ 48kHz)
        ↓
USB Interface ADAT IN
        │
        │ ADAT Decoder
        ↓
USB Interface → USB-C
        │
        │ USB Audio (Class Compliant)
        ↓
Mac USB-C Port
        │
        │ Core Audio Driver
        ↓
DAW (Ableton/Logic)
        │
        │ Record to Track
        ↓
Audio/CV Recording
```

### Playing to Modular (Output Path)

```
DAW Audio/CV Track
        │
        │ Track Output
        ↓
Core Audio Driver
        │
        │ USB Audio
        ↓
Mac USB-C Port
        │
        │ USB-C Connection
        ↓
USB Interface → ADAT Encoder
        │
        │ ADAT Optical (8 channels @ 48kHz)
        ↓
ES-10 ADAT IN
        │
        │ ADAT Decoder
        │ Digital to Analog Conversion
        │ DC-Coupled (±10V)
        ↓
ES-10 Output Jacks (5-8)
        │
        │ 3.5mm Patch Cable
        ↓
Modular Synth Input (VCO, VCF, etc.)
```

## Clock Sync Diagram

```
MASTER CLOCK (USB Interface)
        │
        │ Sets Sample Rate (48kHz)
        │ Internal Crystal Oscillator
        │
        ├─ Generates Audio Samples
        │
        └─ Embeds Clock in ADAT Stream
                │
                │ ADAT Optical Signal
                │ (Audio + Clock Data)
                ↓
        ES-10 ADAT DECODER
                │
                ├─ Extracts Audio Samples
                │
                └─ Locks to ADAT Clock (SLAVE)
                        │
                        └─ "Sync" LED ON when locked
```

**Important:** The USB interface must always be the clock master!

## Channel Mapping Example

```
┌─────────────────────────────────────────────────────────────┐
│              DAW CHANNEL MAPPING                             │
└─────────────────────────────────────────────────────────────┘

Computer (DAW)          ADAT           ES-10         Eurorack
──────────────────────────────────────────────────────────────

INPUT (Recording from Modular):
Track 1 Input      →  ADAT 1  ←  ES-10 In 1  ←  VCO 1 Out
Track 2 Input      →  ADAT 2  ←  ES-10 In 2  ←  VCO 2 Out
Track 3 Input      →  ADAT 3  ←  ES-10 In 3  ←  Filter Out
Track 4 Input      →  ADAT 4  ←  ES-10 In 4  ←  ENV Out

OUTPUT (Playing to Modular):
Track 5 Output     →  ADAT 5  →  ES-10 Out 5  →  VCO 1 V/Oct
Track 6 Output     →  ADAT 6  →  ES-10 Out 6  →  VCO 2 V/Oct
Track 7 Output     →  ADAT 7  →  ES-10 Out 7  →  Filter FM
Track 8 Output     →  ADAT 8  →  ES-10 Out 8  →  VCA CV
```

## Power Requirements

```
┌────────────────┐
│ Mac Power      │ ─ Battery or AC adapter
└────────────────┘

┌────────────────┐
│ USB Interface  │ ─ USB Bus Powered (typical)
└────────────────┘   or DC Power Supply

┌────────────────┐
│ ES-10          │ ─ Eurorack Power (+12V, -12V)
└────────────────┘   Current: ~120mA +12V, ~50mA -12V

┌────────────────┐
│ Eurorack Case  │ ─ AC Power Supply
└────────────────┘   Typical: 4A @ +12V, 2A @ -12V
```

## Cable Reference

```
Cable Type           Length      Purpose                 Notes
────────────────────────────────────────────────────────────────
USB-C Cable          3-6 ft      Mac ↔ Interface        USB 2.0 sufficient
Toslink Optical #1   3-6 ft      Interface → ES-10      Clean connectors
Toslink Optical #2   3-6 ft      ES-10 → Interface      Avoid bending
3.5mm Patch Cables   Variable    ES-10 ↔ Modular        Standard Eurorack
```

## Rack Space Requirements

```
DESKTOP LAYOUT:
═══════════════

┌──────────────────────────────────────┐
│          Mac Laptop                  │
└──────────────────────────────────────┘
              ↓ USB-C
┌──────────────────────────────────────┐
│    USB Interface (Desktop Unit)      │
│    ~10" × 7" × 2"                    │
└──────────────────────────────────────┘
              ↓ Optical Cables
┌──────────────────────────────────────┐
│    Eurorack Case                     │
│    └─ ES-10 Module (14HP width)     │
│       Other Modules...               │
└──────────────────────────────────────┘


PORTABLE LAYOUT:
═══════════════

┌──────────┐  ┌─────────────────┐
│   Mac    │  │ Compact Interface│
│ Laptop   │  │  (e.g. Babyface)│
└──────────┘  └─────────────────┘
     │              │
     └──── USB-C ───┘
              │
       Optical Cables
              │
    ┌─────────────────┐
    │ Portable Eurorack│
    │ └─ ES-10        │
    └─────────────────┘
```

## Comparison: Before & After

```
BEFORE (Using Ableton Push 3):
══════════════════════════════

┌──────────┐
│   Mac    │
└──────────┘
     │ USB
     ↓
┌──────────────┐
│ Ableton      │
│ Push 3       │ ← Heavy (6.6 lbs)
│ (Interface + │   Bulky
│  Controller) │   $1,999
└──────────────┘
     │ Optical
     ↓
┌──────────────┐
│   ES-10      │
└──────────────┘


AFTER (USB-C ADAT Interface):
═════════════════════════════

┌──────────┐
│   Mac    │
└──────────┘
     │ USB-C
     ↓
┌──────────────┐
│ Compact USB-C│ ← Light (1-2 lbs)
│ Interface    │   Portable
│ (ADAT I/O)   │   $250-$750
└──────────────┘
     │ Optical
     ↓
┌──────────────┐
│   ES-10      │
└──────────────┘
```

## Latency Path

```
ROUND-TRIP LATENCY BREAKDOWN:
═════════════════════════════

DAW Processing          ~0.5 ms (depends on buffer)
    ↓
USB Transfer            ~1 ms
    ↓
Interface A/D           ~1 ms
    ↓
ADAT Encoding           ~0.5 ms
    ↓
Optical Transmission    ~0.01 ms (negligible)
    ↓
ES-10 ADAT Decode       ~0.5 ms
    ↓
ES-10 D/A Conversion    ~1 ms
    ↓
→ TO MODULAR ←
    ↓
→ FROM MODULAR ←
    ↓
ES-10 A/D Conversion    ~1 ms
    ↓
ES-10 ADAT Encode       ~0.5 ms
    ↓
Optical Transmission    ~0.01 ms
    ↓
Interface ADAT Decode   ~0.5 ms
    ↓
USB Transfer            ~1 ms
    ↓
DAW Input Buffer        ~0.5 ms
    ↓
────────────────────────────────
TOTAL: ~7-8 ms typical @ 256 sample buffer

Lower buffers (128 samples) = ~4-5 ms
Higher buffers (512 samples) = ~12-15 ms
```

---

*Part of the Eight4aWish Eurorack DIY collection*
*See README.md for detailed setup instructions*
