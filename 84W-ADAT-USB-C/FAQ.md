# FAQ and Troubleshooting - ADAT to USB-C Interface

## Frequently Asked Questions

### General Questions

#### Q: Why not just use the Ableton Push 3?
**A:** The Push 3 is an excellent device but it's heavy (6.6 lbs) and bulky, making it less ideal for portable setups. A dedicated USB-C ADAT interface is lighter, more compact, and often less expensive while providing the same ADAT connectivity for the ES-10.

#### Q: Will this work with other ADAT-enabled Eurorack modules?
**A:** Yes! This setup works with any Eurorack module that has ADAT I/O, including:
- Expert Sleepers ES-3, ES-6, ES-8, ES-9
- Other ADAT-equipped modules from various manufacturers
- Any device with standard Toslink ADAT optical I/O

#### Q: Do I need the Expert Sleepers software?
**A:** Not required, but highly recommended! The Silent Way software provides advanced CV control, calibration, and expert-level features. The ES-10 works fine without it for basic audio/CV routing, but Silent Way unlocks its full potential.

#### Q: Can I use USB-A to USB-C adapter?
**A:** Yes! If your Mac only has USB-A ports, you can use a quality adapter or hub. However:
- Use a powered hub for best results
- Avoid cheap adapters that might cause power or timing issues
- USB 3.0 to USB-C adapters work better than USB 2.0

#### Q: What sample rates are supported?
**A:** 
- **44.1 kHz and 48 kHz:** Full 8 channels via ADAT
- **88.2 kHz and 96 kHz:** 4 channels via ADAT S/MUX II
- **176.4 kHz and 192 kHz:** 2 channels via ADAT S/MUX IV (rare)

Most users stick with 48 kHz for full 8-channel support.

#### Q: Is this setup low-latency enough for live performance?
**A:** Absolutely! With a 128-256 sample buffer, you'll typically get 4-8ms round-trip latency, which is imperceptible for most applications. This is suitable for:
- Live performance
- Recording
- Real-time CV control of modular synthesizers
- Interactive sound design

#### Q: Can I use this with Windows or Linux?
**A:** Yes! This guide focuses on Mac, but the same hardware works on Windows and Linux. Just check that your chosen interface has drivers for your OS (most modern interfaces are class-compliant and work on all platforms).

### Hardware Questions

#### Q: Which interface should I buy?
**A:** It depends on your budget and needs:
- **Budget:** PreSonus Studio 1810c (~$450)
- **Best Value:** Focusrite Scarlett 18i20 (~$550) 
- **Compact:** RME Babyface Pro FS (~$750)
- **Most Portable:** MOTU M4 (~$250, requires adapter)

All work great with ES-10!

#### Q: Do I need expensive optical cables?
**A:** Not necessarily. Mid-range cables ($10-15) work fine for ADAT. Avoid the cheapest cables under $5 as they may have reliability issues. Expensive "audiophile" optical cables don't improve sound quality (it's digital data).

#### Q: Can I daisy-chain multiple ES-10 modules?
**A:** Yes, but you'll need an interface with multiple ADAT I/O pairs or an ADAT expander. Each ES-10 requires one ADAT pair (8 channels in + 8 channels out). Some interfaces support 2x ADAT I/O (16 channels each way).

#### Q: My interface doesn't have USB-C, only USB-B. Will it work?
**A:** Yes! You can use a USB-B to USB-C cable or adapter. USB-C is mentioned in this guide because it's the modern standard on Macs, but the connection type doesn't affect audio quality or performance.

### Setup Questions

#### Q: What's the correct power-on sequence?
**A:**
1. Power on USB audio interface
2. Power on Eurorack (including ES-10)
3. Wait 5-10 seconds for sync lock
4. Start your DAW

This sequence ensures proper clock sync from the start.

#### Q: How do I know if ADAT sync is working?
**A:** Check these indicators:
- ES-10 sync LED should be steady (not flashing)
- Your interface may show ADAT lock status (check manual)
- You should see ADAT channels available in your DAW
- Red light visible through optical cable when connected

#### Q: Should I use an external word clock?
**A:** For a simple ES-10 + interface setup, no. The interface's internal clock transmitted via ADAT is sufficient. External word clock is only needed for complex multi-device studios.

#### Q: Can I use WiFi while recording?
**A:** Technically yes, but it's not recommended. WiFi can cause:
- CPU interruptions
- USB bus timing issues
- Potential audio dropouts

For critical recordings, disable WiFi and Bluetooth.

### Software Questions

#### Q: Which DAW works best?
**A:** All major DAWs work fine:
- **Ableton Live:** Excellent for ES-10, great Silent Way integration
- **Logic Pro:** Native Mac, good ADAT support
- **Bitwig Studio:** Modern, great for modular integration
- **Reaper:** Affordable, highly configurable
- **Max/MSP:** Advanced users, complete control

Choose based on your workflow preferences.

#### Q: How do I route audio from one ADAT channel to another?
**A:** In your DAW:
1. Create an audio track
2. Set input to ADAT channel (e.g., ADAT 1)
3. Set output to different ADAT channel (e.g., ADAT 5)
4. Enable monitoring or record arm the track
5. Signal will pass through (with your DAW buffer latency)

#### Q: Can I process modular audio with plugins before sending back?
**A:** Yes! This is one of the best features:
1. Receive modular audio on ADAT input channels
2. Route to track with your favorite plugins
3. Send processed audio back to ADAT output channels
4. Patch back into your modular for further processing

Create hybrid digital/analog signal chains!

## Troubleshooting Guide

### Problem: No ADAT Sync (Flashing LED on ES-10)

**Symptoms:**
- ES-10 sync LED flashing or off
- No ADAT channels visible in DAW
- No audio transfer

**Solutions:**
1. **Check optical cable connections**
   - Ensure cables are fully inserted
   - Try removing and reinserting cables
   - Look for red light through cable
   - Try different optical cables

2. **Verify sample rate consistency**
   - Check Audio MIDI Setup: should be 44.1 or 48 kHz
   - Check DAW preferences: must match Audio MIDI Setup
   - Check interface hardware settings (if applicable)

3. **Check interface is set as clock master**
   - Interface should use internal clock, not external
   - Check interface manual for clock source settings
   - ES-10 should slave to ADAT clock (this is automatic)

4. **Try different USB port**
   - Use a different USB port on your Mac
   - Avoid USB hubs if possible
   - USB 3.0 ports sometimes work better

5. **Power cycle everything**
   - Turn off interface
   - Power down Eurorack
   - Wait 30 seconds
   - Power on in correct sequence

### Problem: Audio Dropouts or Clicking

**Symptoms:**
- Intermittent clicks or pops
- Audio cutting in and out
- Glitchy sound

**Solutions:**
1. **Increase buffer size**
   - In DAW preferences, try 512 or 1024 samples
   - Trade latency for stability
   - Reduce buffer after troubleshooting

2. **Check CPU usage**
   - Close unnecessary applications
   - Disable or freeze heavy plugins
   - Check Activity Monitor for CPU hogs

3. **USB power/bandwidth issues**
   - Use powered USB hub
   - Disconnect other USB devices
   - Try different USB port
   - Check for USB bus contention

4. **Sample rate mismatch**
   - Verify all devices use same sample rate
   - Check Audio MIDI Setup
   - Check DAW settings
   - Check interface hardware settings

5. **Cable quality**
   - Try different optical cables
   - Try different USB cable
   - Check for cable damage

### Problem: No Audio Signal (But ADAT Synced)

**Symptoms:**
- ES-10 sync LED solid
- ADAT channels visible in DAW
- No audio transfer or meter activity

**Solutions:**
1. **Check DAW routing**
   - Verify ADAT channels are enabled in preferences
   - Check track input/output assignments
   - Enable input monitoring on tracks
   - Check track arm status

2. **Check ES-10 configuration**
   - Verify jumper settings for input/output direction
   - Ensure cables patched to correct ES-10 jacks
   - Check modular signal levels (should be visible on scope)

3. **Test with tone generator**
   - Send test tone from DAW to ADAT output
   - Should see signal on ES-10 output with scope/meter
   - Send tone from modular to ES-10 input
   - Should see DAW meter activity

4. **Check mute/solo status**
   - Ensure tracks not muted in DAW
   - Check mix console routing
   - Verify interface mixer settings (if applicable)

### Problem: CV Not Tracking Pitch Accurately

**Symptoms:**
- V/Oct input on VCO doesn't track correctly
- Pitch drift or inaccuracy
- Notes out of tune

**Solutions:**
1. **Calibrate ES-10**
   - Download Expert Sleepers calibration software
   - Follow calibration procedure in manual
   - Store calibration to ES-10 memory

2. **Check sample rate**
   - Higher sample rates = better CV resolution
   - 48 kHz minimum recommended for CV
   - 96 kHz even better (but only 4 channels)

3. **Use Silent Way (recommended)**
   - Expert Sleepers' Silent Way software
   - Provides DC-accurate CV generation
   - Better than raw audio for pitch CV

### Problem: High Latency

**Symptoms:**
- Noticeable delay between playing and hearing
- Sluggish response to controls
- Difficult to perform in real-time

**Solutions:**
1. **Reduce buffer size**
   - Try 128 or 64 samples in DAW preferences
   - Monitor CPU usage - don't go too low
   - Balance latency vs. stability

2. **Use direct monitoring**
   - If available on interface
   - Bypasses computer for zero-latency monitoring
   - Not available on all interfaces

3. **Optimize Mac performance**
   - Close background applications
   - Disable Spotlight indexing temporarily
   - Turn off WiFi/Bluetooth
   - Disable visual effects

4. **Check plugins**
   - Some plugins add latency
   - Check plugin latency compensation
   - Use low-latency versions if available

### Problem: Hum or Noise

**Symptoms:**
- Audible hum or buzz
- Noise floor higher than expected
- Interference sounds

**Solutions:**
1. **Ground loop issues**
   - Try different power outlet
   - Use ground lift on interface (if available)
   - Separate computer and audio power circuits

2. **USB noise**
   - Try powered USB hub with good isolation
   - Use ferrite cores on USB cable
   - Try different USB port

3. **Eurorack power supply**
   - Check power supply quality
   - Filter power with capacitors
   - Ensure adequate current capacity

4. **Cable routing**
   - Keep audio/USB cables away from power cables
   - Use shielded cables where possible
   - Route cables away from power supplies

### Problem: ES-10 Not Appearing in DAW

**Symptoms:**
- Interface works for other audio
- ADAT channels missing in DAW
- Can't select ADAT inputs/outputs

**Solutions:**
1. **Enable ADAT channels in DAW**
   - Check input/output configuration
   - Some DAWs require explicit enabling
   - Restart DAW after enabling

2. **Check Audio MIDI Setup**
   - Verify ADAT channels visible here
   - Configure interface properly
   - Try creating aggregate device

3. **Update drivers**
   - Check manufacturer website
   - Install latest interface firmware
   - Restart Mac after updates

4. **Check interface hardware**
   - Some interfaces have switches/buttons for ADAT
   - Check hardware menu/display
   - Refer to interface manual

## Performance Tips

### Minimize Latency
- Use 128 sample buffer for low latency (<5ms)
- Disable unnecessary plugins
- Freeze tracks you're not actively editing
- Use direct monitoring when possible

### Maximize Stability
- Use 512 sample buffer for stability
- Close background applications
- Connect interface to dedicated USB port
- Update to latest macOS version

### Best Audio Quality
- Use 48 kHz sample rate (sweet spot)
- Calibrate ES-10 properly
- Use quality optical cables
- Keep optical connectors clean

### Save CPU
- Bounce/freeze tracks when not editing
- Use efficient plugins
- Increase buffer size when not performing
- Disable unused inputs/outputs

## When to Contact Support

Contact manufacturer support if:
- Interface not recognized after driver installation
- Persistent audio dropouts despite troubleshooting
- Hardware damage suspected
- Firmware update fails

Contact Expert Sleepers support if:
- ES-10 calibration issues
- Silent Way software problems
- Module hardware issues

## Additional Resources

### Official Documentation
- [Expert Sleepers ES-10 Manual](https://www.expert-sleepers.co.uk/downloads/ES-10UserManual.pdf)
- [Expert Sleepers Forum](https://www.expert-sleepers.co.uk/forum/)
- Your audio interface manufacturer's support site

### Community Resources
- ModWiggler forum (modular synth community)
- Gearspace (recording forum)
- Reddit r/modular
- Lines forum (modular and electronic music)

### Video Tutorials
- Search YouTube for "Expert Sleepers ES-10 setup"
- Search for your specific interface tutorials
- DAW-specific ADAT configuration videos

---

*Part of the Eight4aWish Eurorack DIY collection*

**Still having issues?** Feel free to reach out to the modular community - we're always happy to help!
