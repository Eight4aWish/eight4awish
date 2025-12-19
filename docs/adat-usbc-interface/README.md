# ADAT to USB-C Interface for Expert Sleepers ES-10

This directory contains comprehensive documentation for connecting the Expert Sleepers ES-10 8-channel Eurorack module to a computer via USB-C using commercial USB audio interfaces with ADAT optical I/O.

## Quick Start

The simplest solution is to use a commercial USB audio interface with ADAT I/O capabilities:

1. **Get a USB Audio Interface with ADAT I/O**
   - Recommended: Focusrite Scarlett 18i20 (3rd Gen) - native USB-C
   - Budget: Behringer U-PHORIA UMC1820 with USB-A to USB-C cable
   - Premium: RME Fireface UCX II

2. **Connect the Hardware**
   - ES-10 ADAT OUT → Interface ADAT IN (optical cable)
   - ES-10 ADAT IN → Interface ADAT OUT (optical cable)
   - Interface → Computer (USB-C)

3. **Configure Software**
   - Set interface to Internal clock (master)
   - Set sample rate to 44.1 kHz or 48 kHz
   - Enable ADAT channels in your DAW

## What You Get

- 8 channels of DC-coupled audio I/O
- Suitable for both audio and CV signals
- Low latency performance
- Professional audio quality
- Native USB-C connectivity (with recommended interfaces)

## Documentation

See `index.html` for complete documentation including:
- Detailed hardware recommendations
- Connection diagrams
- Software configuration steps
- DAW-specific setup instructions
- Troubleshooting guide
- Shopping list

## Files in This Directory

- `index.html` - Main documentation page with comprehensive guide
- `README.md` - This file
- `images/` - Directory for connection diagrams and photos (to be added)

## Technical Specifications

**ADAT Standard:**
- 8 channels at 44.1/48 kHz
- Optical transmission (TOSLINK)
- Maximum cable length: ~5 meters

**ES-10 Specifications:**
- 8 inputs, 8 outputs
- DC-coupled (0-20kHz+ bandwidth)
- ±10V maximum signal level
- 6HP Eurorack module

## Why Not DIY?

While technically possible to build a custom ADAT to USB interface, the complexity involved includes:
- USB audio driver development
- Clock domain management
- Multi-layer PCB design
- Firmware development for USB controllers
- Extensive testing requirements

Commercial solutions are more reliable, cost-effective, and provide better support.

## Community Resources

- [Expert Sleepers Official Website](https://expert-sleepers.co.uk/)
- [ModWiggler Forums](https://www.modwiggler.com/)
- r/modular on Reddit

## License

This documentation is provided as-is for educational purposes.

---

**Eight4aWish** | [GitHub](https://github.com/Eight4aWish) | [Website](https://eight4awish.github.io/eight4awish/)
