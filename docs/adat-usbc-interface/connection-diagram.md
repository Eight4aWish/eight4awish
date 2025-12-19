# ADAT to USB-C Connection Diagram

## Basic Connection Setup

```
┌─────────────────────┐
│   Your Computer     │
│                     │
│  (macOS/Windows/    │
│      Linux)         │
└──────────┬──────────┘
           │
           │ USB-C Cable
           │
           ▼
┌─────────────────────┐
│  USB Audio          │
│  Interface          │
│  (with ADAT I/O)    │
│                     │
│  Examples:          │
│  - Focusrite 18i20  │
│  - RME Fireface     │
│  - PreSonus 1810c   │
└──────┬──────┬───────┘
       │      │
       │      │ TOSLINK Optical Cables
       │      │
   ADAT OUT   ADAT IN
       │      │
       ▼      ▼
┌─────────────────────┐
│  Expert Sleepers    │
│      ES-10          │
│                     │
│  8 Channel I/O      │
│  Eurorack Module    │
└──────┬──────┬───────┘
       │      │
   [1-8 IN]  [1-8 OUT]
       │      │
       ▼      ▼
┌─────────────────────┐
│   Eurorack          │
│   Modular Synth     │
│                     │
│   (Oscillators,     │
│    Filters, etc)    │
└─────────────────────┘
```

## Signal Flow

### Recording (Modular → Computer)
```
Eurorack Modules → ES-10 Inputs (1-8) → ADAT OUT → 
USB Interface ADAT IN → USB → Computer DAW
```

### Playback (Computer → Modular)
```
Computer DAW → USB → USB Interface ADAT OUT → 
ES-10 ADAT IN → ES-10 Outputs (1-8) → Eurorack Modules
```

## Clock Synchronization

```
USB Interface (MASTER)
    │
    │ Clock embedded in ADAT signal
    │
    ▼
ES-10 (SLAVE)
```

**Important:** The USB interface must be set as the clock master (Internal clock source). The ES-10 automatically syncs to the ADAT clock signal.

## Voltage Levels

```
DAW Signal (0dBFS) ←→ ES-10 (±10V) ←→ Eurorack (±10V peak)

Examples:
- 0dBFS = 10V peak
- -6dBFS = 5V peak
- -∞dBFS = 0V
```

## Channel Mapping Example

For Focusrite Scarlett 18i20:

```
DAW Inputs      ADAT        ES-10
Ch 9     ←──── ADAT 1 ←──── IN 1
Ch 10    ←──── ADAT 2 ←──── IN 2
Ch 11    ←──── ADAT 3 ←──── IN 3
Ch 12    ←──── ADAT 4 ←──── IN 4
Ch 13    ←──── ADAT 5 ←──── IN 5
Ch 14    ←──── ADAT 6 ←──── IN 6
Ch 15    ←──── ADAT 7 ←──── IN 7
Ch 16    ←──── ADAT 8 ←──── IN 8

DAW Outputs     ADAT        ES-10
Ch 9     ────→ ADAT 1 ────→ OUT 1
Ch 10    ────→ ADAT 2 ────→ OUT 2
Ch 11    ────→ ADAT 3 ────→ OUT 3
Ch 12    ────→ ADAT 4 ────→ OUT 4
Ch 13    ────→ ADAT 5 ────→ OUT 5
Ch 14    ────→ ADAT 6 ────→ OUT 6
Ch 15    ────→ ADAT 7 ────→ OUT 7
Ch 16    ────→ ADAT 8 ────→ OUT 8
```

*Note: Channel numbers vary by interface. Some interfaces use channels 1-8 for ADAT if no analog I/O is present.*
