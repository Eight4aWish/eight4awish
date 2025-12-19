# ADAT to USB-C Interface for Mac

A portable ADAT optical interface solution for use with Expert Sleepers ES-10 and other ADAT-compatible Eurorack modules. This project provides a lightweight alternative to using an Ableton Push 3 as an audio interface.

## Overview

This project documents a USB-C ADAT interface solution for Mac users who want a compact, portable way to connect their Expert Sleepers ES-10 (or similar ADAT-enabled Eurorack modules) to their computer without relying on large, heavy hardware like the Ableton Push 3.

### Why This Project?

The Expert Sleepers ES-10 is a powerful DC-coupled audio interface in Eurorack format that uses ADAT optical connectivity to send/receive up to 8 channels of CV and audio to/from a computer. While devices like the Ableton Push 3 include ADAT connectivity, they're bulky and not ideal for portable setups.

## Hardware Requirements

### Recommended USB-C ADAT Interfaces

The following USB-C compatible ADAT interfaces work well with Mac and Expert Sleepers modules:

1. **Focusrite Scarlett 18i20 (3rd Gen)** - USB-C, ADAT I/O, excellent Mac compatibility
2. **MOTU M4** - USB-C, compact, with optical I/O (via adapter)
3. **Audient iD44** - USB-C, 2x ADAT I/O, professional quality
4. **PreSonus Studio 1810c** - USB-C, ADAT I/O, affordable option
5. **RME Babyface Pro FS** - USB-C, ADAT I/O, premium choice with excellent drivers

### Expert Sleepers ES-10 Compatibility

All of the above interfaces support ADAT optical at 44.1/48 kHz sample rates, providing 8 channels in each direction. For higher channel counts, some interfaces support ADAT S/MUX modes at higher sample rates.

## Connection Setup

### Hardware Connections

1. **ADAT Optical Cables**
   - Connect ADAT OUT from your USB interface to ADAT IN on the ES-10
   - Connect ADAT OUT from the ES-10 to ADAT IN on your USB interface
   - Use quality optical cables (Toslink) - cable quality matters for reliable data transmission

2. **USB-C Connection**
   - Connect the interface to your Mac via USB-C
   - Use a quality USB-C cable (USB 2.0 is sufficient for ADAT audio)
   - For best results, connect directly to a Mac port rather than through a hub

3. **Word Clock Sync**
   - Set your USB interface as the master clock (internal clock mode)
   - Configure ES-10 to sync to ADAT input (optical sync)
   - Proper sync is critical for noise-free operation

### Software Configuration

#### macOS Audio MIDI Setup

1. Open **Audio MIDI Setup** (Applications > Utilities)
2. Select your USB audio interface
3. Configure sample rate: **48 kHz** (recommended) or 44.1 kHz
4. Verify ADAT channels appear as available inputs/outputs
5. Create an aggregate device if using multiple interfaces

#### DAW Configuration (Ableton Live, etc.)

1. Open your DAW preferences/settings
2. Select your USB interface as the audio device
3. Enable ADAT channels in the audio routing preferences
4. Map ES-10 ADAT channels to your DAW tracks
5. Set buffer size appropriately (128-256 samples typical)

## Expert Sleepers ES-10 Configuration

The ES-10 provides 8 DC-coupled channels (CV and audio) via ADAT:

- **Channels 1-8**: Can be configured as inputs or outputs
- **CV Range**: ±10V (with proper calibration)
- **Sample Rate**: 44.1 or 48 kHz
- **Jumper Settings**: Configure input/output direction per channel pair

Refer to the [Expert Sleepers ES-10 documentation](https://www.expert-sleepers.co.uk/es10.html) for detailed calibration and configuration instructions.

## Comparison: USB-C Interface vs. Push 3

| Feature | USB-C ADAT Interface | Ableton Push 3 |
|---------|---------------------|----------------|
| **Weight** | 0.5-2 lbs | 6.6 lbs |
| **Portability** | Highly portable | Bulky |
| **ADAT I/O** | ✓ (8 channels) | ✓ (8 channels) |
| **Standalone** | Computer required | Standalone or computer mode |
| **Price Range** | $200-$800 | $1,999 |
| **Primary Use** | Audio/CV interface | Controller + interface |

## Troubleshooting

### No Audio/CV Signal

- Check optical cables are fully inserted and clean
- Verify word clock sync (ES-10 should sync to interface)
- Check sample rates match on interface and in DAW
- Confirm ADAT channels are enabled in software

### Clicking/Popping Sounds

- Usually indicates clock sync issues
- Verify interface is set as master clock
- Check for consistent sample rate throughout signal chain
- Try increasing audio buffer size in DAW

### High Latency

- Reduce audio buffer size in DAW preferences
- Use direct monitoring on interface if available
- Check for other USB devices causing bus contention
- Close unnecessary background applications

## Recommended Workflow

1. **Power on sequence**: Interface → ES-10 → Eurorack → Computer
2. **Set sample rate** on interface before launching DAW
3. **Verify sync** - ES-10 LED should indicate locked sync
4. **Launch DAW** and configure routing
5. **Test signal** - send test tone through to verify connectivity

## Additional Resources

- [Expert Sleepers ES-10 Manual](https://www.expert-sleepers.co.uk/es10.html)
- [Expert Sleepers Forum](https://www.expert-sleepers.co.uk/forum/)
- Mac Audio MIDI Setup Guide
- DAW-specific ADAT configuration tutorials

## Notes

- DC coupling is maintained through the digital ADAT connection
- Latency is minimal (typically 3-6ms round-trip at 128-256 sample buffers)
- This solution is ideal for studio and portable performance setups
- Consider a powered USB-C hub if using multiple USB devices

## License

This documentation is provided as-is for the DIY community. Use at your own discretion.

## Contributing

Found a better interface option or have tips to share? Feel free to contribute to this documentation!

---

*Part of the Eight4aWish Eurorack DIY collection*
