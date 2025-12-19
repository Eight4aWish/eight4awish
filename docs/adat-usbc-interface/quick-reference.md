# Quick Reference Guide - ADAT to USB-C Interface

## Essential Equipment
- [ ] Expert Sleepers ES-10
- [ ] USB Audio Interface with ADAT I/O
- [ ] 2x TOSLINK optical cables
- [ ] USB-C cable

## Setup Checklist

### 1. Hardware Setup
- [ ] Connect ES-10 to Eurorack power supply
- [ ] Connect ES-10 ADAT OUT → Interface ADAT IN (optical)
- [ ] Connect ES-10 ADAT IN → Interface ADAT OUT (optical)
- [ ] Connect interface to computer via USB-C
- [ ] Power on Eurorack and interface

### 2. Interface Configuration
- [ ] Set sample rate to 44.1 kHz or 48 kHz
- [ ] Set clock source to "Internal" (master)
- [ ] Enable ADAT input and output
- [ ] Set buffer size to 128-256 samples

### 3. DAW Setup
- [ ] Select USB audio interface as audio device
- [ ] Enable ADAT channels in audio preferences
- [ ] Create tracks assigned to ADAT channels
- [ ] Test signal flow (record from ES-10)
- [ ] Test playback (send audio to ES-10)

## Signal Levels
- 0dBFS in DAW = 10V peak in Eurorack
- -6dBFS = 5V peak
- Adjust gains accordingly for CV vs audio

## Troubleshooting Quick Fixes
1. **No signal:** Check optical cables, verify ADAT enabled
2. **Crackling:** Increase buffer size
3. **Wrong levels:** Check interface gains, use calibration tool
4. **Clock issues:** Verify interface is set to Internal clock

## Sample Rates
- 44.1 kHz: 8 channels (standard ADAT)
- 48 kHz: 8 channels (standard ADAT)
- 88.2/96 kHz: 4 channels (S/MUX mode)

**Recommendation:** Use 48 kHz for best compatibility

## Channel Count by Sample Rate
| Sample Rate | ADAT Channels | Notes |
|-------------|---------------|-------|
| 44.1 kHz | 8 in / 8 out | Standard, recommended |
| 48 kHz | 8 in / 8 out | Standard, recommended |
| 88.2 kHz | 4 in / 4 out | S/MUX mode |
| 96 kHz | 4 in / 4 out | S/MUX mode |

## Common DAW Settings
- **Ableton Live:** Preferences → Audio → Input/Output Config
- **Logic Pro:** Preferences → Audio → Devices
- **Reaper:** Options → Preferences → Audio → Device
- **Bitwig:** Settings → Audio → Audio Device

## Interface Recommendations by Budget

### Budget (~$200-300)
- Behringer U-PHORIA UMC1820

### Mid-Range (~$400-600)
- Focusrite Scarlett 18i20 (3rd Gen)
- PreSonus Studio 1810c
- Audient iD44

### Premium (~$1000+)
- RME Fireface UCX II
- Universal Audio Apollo x6

## Cable Length Limits
- TOSLINK optical: Up to 5 meters (16 feet)
- USB-C: Up to 2 meters recommended (active cables for longer)

## Power Requirements
- ES-10: +12V: 60mA, -12V: 50mA
- USB Interface: Bus powered or external PSU (varies by model)

## Common Pitfalls to Avoid
❌ Using interface as clock slave (should be master)
❌ Forgetting to enable ADAT channels in DAW
❌ Using damaged optical cables (no light transmission)
❌ Buffer size too small causing dropouts
❌ Wrong sample rate causing sync issues

## Software Tools
- Expert Sleepers Silent Way (calibration)
- VCV Rack (virtual modular with ES-10 support)
- Interface-specific control software

## Resources
- Full documentation: `index.html`
- Connection diagrams: `connection-diagram.md`
- ES-10 manual: expert-sleepers.co.uk
