# Quick Start Guide - ADAT to USB-C Interface Setup

## Prerequisites

- [ ] Mac with USB-C port (or USB-A with adapter)
- [ ] USB-C audio interface with ADAT I/O
- [ ] Expert Sleepers ES-10 (or compatible ADAT Eurorack module)
- [ ] 2x Toslink optical cables
- [ ] Powered Eurorack system
- [ ] DAW software installed (Ableton Live, Logic Pro, etc.)

## Step-by-Step Setup

### Part 1: Hardware Connection (10 minutes)

#### 1. Connect the USB Interface to Your Mac

```
Mac USB-C Port → USB-C Cable → Audio Interface
```

- Use a direct connection if possible (avoid hubs for best performance)
- Wait for macOS to recognize the device (check System Preferences → Sound)

#### 2. Connect ADAT Optical Cables

```
[Audio Interface ADAT OUT] → Optical Cable → [ES-10 ADAT IN]
[ES-10 ADAT OUT] → Optical Cable → [Audio Interface ADAT IN]
```

**Important:**
- Toslink connectors have a specific orientation - don't force them
- Remove the dust caps from optical ports
- You should see a red light through the cable when connected properly
- Keep cables away from sharp bends

#### 3. Configure ES-10 Hardware

- Set ES-10 jumpers according to your input/output needs
- Refer to ES-10 manual for jumper configuration
- Common setup: 4 inputs (channels 1-4), 4 outputs (channels 5-8)

#### 4. Power On Sequence

1. Turn on your audio interface
2. Power up your Eurorack case
3. Wait 5-10 seconds for sync to establish
4. Boot your Mac (if not already on)

**LED Indicators:**
- ES-10 should show a steady sync LED (indicating clock lock)
- Audio interface may show ADAT sync status (check manual)

### Part 2: macOS Configuration (5 minutes)

#### 1. Open Audio MIDI Setup

```
Applications → Utilities → Audio MIDI Setup
```

Or use Spotlight: `Cmd + Space`, type "Audio MIDI Setup"

#### 2. Configure Your Audio Interface

- Select your USB audio interface from the list
- Click "Configure Speakers" (if needed)
- Set Sample Rate: **48000 Hz** (recommended)
  - Alternative: 44100 Hz also works fine
  - Higher rates (96k) use S/MUX and reduce ADAT to 4 channels

#### 3. Verify ADAT Channels

- Your interface should show ADAT channels as available
- Typical naming: "ADAT 1-8" or "Optical 1-8"
- If not visible, check:
  - Optical cables are connected properly
  - Interface firmware is up to date
  - Sample rate is set to 44.1 or 48 kHz

#### 4. Set Permissions (if needed)

If prompted, allow your DAW to access the audio interface:
```
System Preferences → Security & Privacy → Privacy → Microphone
```

### Part 3: DAW Configuration (5 minutes)

#### For Ableton Live

1. Open Ableton Live
2. Go to `Preferences → Audio`
3. Driver Type: **CoreAudio**
4. Audio Device: Select your USB interface
5. Sample Rate: **48000 Hz** (must match Audio MIDI Setup)
6. Buffer Size: Start with **256 samples**
   - Lower = less latency, but may cause audio dropouts
   - Higher = more latency, but more stable

7. **Enable ADAT Channels:**
   - Click "Input Config" button
   - Enable ADAT channels 1-8
   - Click "Output Config" button  
   - Enable ADAT channels 1-8

8. **Test Configuration:**
   - Create an audio track
   - Set input to "Ext. In" → ADAT channel
   - Arm the track for recording
   - Send a test signal from ES-10
   - You should see input meter activity

#### For Logic Pro

1. Open Logic Pro
2. Go to `Preferences → Audio`
3. **Devices tab:**
   - Core Audio: Enable
   - Input Device: Your USB interface
   - Output Device: Your USB interface

4. **I/O Assignments:**
   - Go to `Mix → I/O Labels`
   - Configure ADAT channels 1-8 with meaningful names
   - Example: "ES-10 CV 1", "ES-10 CV 2", etc.

5. **Test:**
   - Create audio track
   - Set input from ADAT channels
   - Monitor input signal

### Part 4: Expert Sleepers ES-10 Setup

#### Channel Routing

The ES-10 provides 8 channels via ADAT:

**Typical Configuration:**
- **Channels 1-4:** Inputs (from modular to computer)
  - Patch modular signals to ES-10 input jacks 1-4
  - These appear in your DAW as ADAT Input channels 1-4

- **Channels 5-8:** Outputs (from computer to modular)
  - Route DAW tracks to ADAT Output channels 5-8
  - These appear on ES-10 output jacks 5-8
  - Patch to your modular VCOs, filters, etc.

#### Calibration

For accurate CV (especially v/oct tracking):

1. Download Expert Sleepers calibration software
2. Run calibration procedure per ES-10 manual
3. Store calibration settings in module

**Note:** This is crucial for pitch-accurate CV!

### Part 5: Testing & Verification (5 minutes)

#### Test Input (Modular → Computer)

1. **Generate a test tone in your modular:**
   - Use VCO or noise source
   - Patch to ES-10 input (e.g., Input 1)

2. **Monitor in your DAW:**
   - Create audio track with ADAT 1 as input
   - Enable monitoring
   - You should hear the modular audio

#### Test Output (Computer → Modular)

1. **Create test tone in DAW:**
   - Generate sine wave or play audio file
   - Route to ADAT Output channel 5

2. **Monitor from ES-10:**
   - Patch ES-10 Output 5 to your modular mixer or scope
   - Adjust output level in DAW
   - You should see/hear the signal

#### Test CV Control

1. **Send CV from DAW:**
   - Use a MIDI-to-CV plugin (or ES-10 software)
   - Route to ADAT output channel
   - Patch ES-10 output to VCO v/oct input

2. **Verify pitch tracking:**
   - Play chromatic scale
   - VCO should track accurately (if calibrated)

### Troubleshooting

#### No Sync / Red LED Flashing on ES-10

- Check optical cables are properly inserted
- Verify interface is set as clock master
- Confirm sample rates match
- Try different USB port

#### No Audio Signal

- Check ADAT channels are enabled in DAW
- Verify input/output routing
- Check ES-10 jumpers configuration
- Ensure modular signals are within ±10V range

#### Clicking/Popping Noises

- Clock sync issue - check sample rate consistency
- Increase buffer size in DAW
- Check USB cable quality
- Close other CPU-intensive applications

#### High Latency

- Reduce buffer size (try 128 samples)
- Use direct monitoring if available
- Check for USB bus contention
- Update audio interface drivers

### Tips for Best Performance

- **Always set sample rate first**, then launch DAW
- **Match sample rates** across all devices
- **Use quality cables** - cheap cables cause problems
- **Keep firmware updated** on your audio interface
- **Disable WiFi/Bluetooth** if experiencing dropouts
- **Use USB 3.0 ports** when possible (even though USB 2.0 works)
- **Close unnecessary apps** to reduce CPU load

### Power-On Procedure

Every time you start a session:

1. Power interface first
2. Power Eurorack second
3. Wait for sync lock (10 seconds)
4. Launch DAW
5. Verify sample rates match
6. Test signal flow

### Shutdown Procedure

1. Save your work in DAW
2. Close DAW
3. Power off Eurorack
4. Power off interface (or leave on)

## You're Ready!

Your ADAT to USB-C interface is now configured. You have a lightweight, portable alternative to the Push 3 for connecting your ES-10 to your Mac.

## Next Steps

- Explore Expert Sleepers' Silent Way software for advanced CV control
- Set up templates in your DAW with ADAT routing preconfigured
- Experiment with sending audio from DAW to modular for processing
- Join the Expert Sleepers forum for tips and tricks

## Resources

- [Expert Sleepers ES-10 Manual](https://www.expert-sleepers.co.uk/downloads/ES-10UserManual.pdf)
- [Expert Sleepers Silent Way](https://www.expert-sleepers.co.uk/silentway.html)
- [Focusrite Getting Started Guide](https://support.focusrite.com/)
- Your audio interface's user manual

---

*Part of the Eight4aWish Eurorack DIY collection*
*Having issues? Check the full README.md for detailed troubleshooting*
