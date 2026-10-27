---
title: Behringer's KICK on a Mac, and what its source code reveals
date: 2026-10-27
eyebrow: Teardown
summary: >-
  Behringer published the KICK's source before it is on sale. It did not
  build, so I filled the gaps, and their app now runs on my Mac. The code also
  shows eight CV outputs, and no code for the AI camera.
graphic: /renders/kick_app_on_mac.png
chips:
  - Teardown
  - Behringer KICK
  - Source code
repo: https://github.com/Eight4aWish/0700-AAM
video: mxko71HaekE
ask: >-
  Uli, your new open-source organisation says Music Tribe makes the hardware
  and the community builds on it, and you have talked about people using AI to
  write that firmware. That is what this channel does, and your app already
  runs on my Mac. Send me a KICK and I will take it the rest of the way, in
  public: put this build on the real hardware, test all eight CV outputs into
  my rack, look for the camera, and port my own modules onto it, open source
  like yours. Everyone else: if you know which panel
  microcontroller or CV converter this is, which Variscite module is inside,
  or what "az01" was, email info@eight4awish.com.
draft: false
---
## A groovebox I could reprogram

On 14 October Behringer put the source code for the KICK (BE 0700-AAM) on GitHub: the JUCE application, the audio engine, the protocol for the front panel and a complete Buildroot Linux image. The KICK is not on sale yet, and it is laid out like an Akai MPC One.

I have owned MPCs and Maschine hardware, and I never got on with either. A groovebox whose code I can change is a different proposition, so I wanted to know what is inside it and whether my own modules could run on it. As released, the code does not build, so I filled in the missing pieces, and Behringer's own KICK app now runs on my Mac.

I did not read 15,002 files myself. Claude cloned the repository and searched every file and all 14 commits, and I checked each finding against the file and line it came from. Most of the files are the stock Buildroot tree; about 3,200 are the app, the audio engine and the protocol. Six of Behringer's own release commits list Claude as a co-author, so this was one AI checking another's work.

## No AI camera in the code

The headline feature is "AI camera for gesture control". There is no code for it.

- The app, the audio engine and the protocol never mention a camera or gesture, in any commit. The only hits for camera, gesture, V4L2, OpenCV or TensorFlow are in bundled third-party libraries.
- The panel protocol has message types for system, buttons, LEDs, pads, knobs, MIDI, CV and a slider. None is for a camera.
- The Linux image has no camera software: no GStreamer, no OpenCV.
- The OV5640 and USB webcam drivers in the kernel configuration are line for line the same as Variscite's own configuration at the same commit. The one camera in the device tree is Variscite's evaluation-board camera, which Behringer's changes leave untouched.
- The i.MX 8M Mini has no neural accelerator; the i.MX 8M Plus does. Hand tracking would need its own AI chip in the camera module, or would have to run on the Arm cores.

So either this code predates the camera, or the camera's code is not published yet.

## The hardware the code describes

| Part | What the code shows | Where |
| --- | --- | --- |
| Main computer | NXP i.MX 8M Mini, Cortex-A53 at up to 1.8 GHz, on a Variscite module. The code does not say how many cores; the chip comes with one, two or four. The first README said DART-MX8M-MINI; the build uses Variscite's device tree for the VAR-SOM-MX8M-MINI on their Symphony evaluation board | `Linux/buildroot/configs/KTKick_defconfig` |
| Audio | Coolaudio V4220M, a 24-bit stereo codec, two in and two out, at 48 kHz. Linux has no driver for it, so the patch borrows the Bluetooth dummy codec, gives it a Wolfson WM8804's sample rates and comments out three error exits in the sound core | `patches/linux/001.imx8mm_dtsi.patch`, `002.fsl_sai_codec.patch` |
| Panel | A separate microcontroller on a serial line at 230,400 baud, reflashed by Linux from `Kick_MCU.hex`. A reset command named `EN_SYS_RESET_GD` hints at a GigaDevice GD32, which is a guess | `Kick/modules/input_events/input_events.cpp`, `ComProtocol/PktMgr/PktMgr.hpp` |
| CV and gate | An eight-channel, 12-bit converter on I²C at 0x0C, 0 to 5 V, calibrated at every volt, with a 61-note table: five octaves of 1 V/oct. Its command bytes match Analog Devices' AD5671R, an inference rather than a part number. Four stereo jacks labelled 1/5 to 4/8 carry two outputs each, and any output can be pitch, gate, mod wheel or velocity. I found no CV inputs | `Kick/modules/hardware/source/kick_I2c.cpp`, `kick_I2c.h` |
| Screen | 1024 × 600 LVDS. The Goodix GT911 touch controller is still set to 800 × 480 | `001.imx8mm_dtsi.patch` |
| Controls | 16 pads with aftertouch in banks A to H, Q-Link knobs, an encoder and a touch strip with three LED modes. The button names (Full Level, 16 Levels, Note Repeat, Prog Edit, Track Mute, Pad Mute, Next Seq, Erase, Overdub, TC) are the MPC One's | `Kick/modules/contracts/dcl/dcl_contracts.h` |
| Not on the feature list | Broadcom Wi-Fi and Bluetooth firmware and a Wi-Fi settings page; updates from SD, a USB stick, a computer or over the air | `kick_WifiFirmware.cpp`, `kick_Hwcommon.h` |

The audio engine's "over 300 effects" are Chris Johnson's open-source Airwindows collection: 329 of them. My favourite comment in the repository is on the screen timing: "tried 1366 & 1000 as well.. 1024 works..".

## What the commit history shows

- The first README called the KICK "an MPC-style groove box / sampler that was not finished" and said development had stopped. A commit 39 minutes later removed every status line.
- The AI camera first appears the next day, with the product photos. Three minutes later a commit titled "Remove processor and module details from READMEs" took out the chip line. The build files still name it.
- The last commit renamed everything called "az01", an earlier codename, to kick-storage. The partition IDs it replaced are version-1 UUIDs, which carry a timestamp, and they decode to 26 May 2021 at 06:34 UTC.
- Every app is version 0.3.3, Behringer's copyright headers run from 2021 to 2024, and a second build configuration is called "7th_July".

It reads as a project that was shelved and has been brought back for launch, in public, where anyone can watch it happen.

## Could my modules run on it?

I have built modules on five platforms: the Daisy, the Teensy 4.1, the Ksoloti, the Pico 2 W and the Tiliqua. The four microcontrollers run at 150 to 600 MHz with no operating system, between 520 KB and 64 MB of memory, and audio from 32 to 96 kHz; the Tiliqua is an FPGA. The sound code is not tied to any of those chips. Beads, the MultiOsc engines and Mirth's neural networks already build and run on my Mac, which is how the animations for my videos are made. The KICK is a Linux computer at up to 1.8 GHz, with stereo audio at 48 kHz.

What would change is everything around the sound: audio through ALSA or JACK (both are in the image), the controls through the panel protocol, and CV out through the converter, whose byte format is in `kick_I2c.cpp`. None of it needs Behringer's app. What I would try first:

- [**Wish**](/modules/wish/), Beads on the KICK's sampler and stereo input.
- [**Mirth**](/modules/mirth/)'s neural captures as an effect, with more room for bigger networks than the Daisy has.
- [**Sorrow**](/modules/sorrow/)'s Grids patterns out of the CV jacks into the drum modules in my rack.
- [**Joy**](/modules/joy/) and the MultiOsc engines as voices on the pads.

Two things will not cross: [**Silver and Gold**](/modules/tiliqua/), which are FPGA gateware rather than code for a processor, and anything that needs CV in.

## It builds, and it runs

As published, the repository does not build. Two modules the app includes were never released, nor was the CMake file that registers them with the build, and the serial-port library for the panel was removed because it had no licence. With the two modules stubbed out, [issue #9](https://github.com/MusicTribeOpenSource/0700-AAM/issues/9) counted about 4,500 errors.

So Claude and I wrote a stand-in for each piece, working from how the rest of the code uses it, and Behringer's own KICK app now builds on a Mac and opens its Projects screen at the KICK's 1024 × 600:

![The KICK app's Projects screen, running on a Mac](/renders/kick_app_on_mac.png)

It took about 820 lines:

- **AudIO_constants**: the ranges for MIDI, channels, polyphony, gain, pan and the meter floor, and the audio engine's sample rate and bus counts. Most of the values can be read straight off the code: `MIDI::SCALER` maps 0–127 onto 0–1, so it is 1/127, and `MIDI::NUMERIC_MAX` sizes the pad-colour arrays, so it is 128. The few that are guesses are marked as guesses.
- **AudIO_juce**, the glue between the audio engine and JUCE. The recorder and looper the app expects fit neatly over a recorder that AudIO already publishes but leaves switched off. The audio device drives AudIO's engine from JUCE. The drum voice's filter is a state-variable filter covering all 27 types in its menu.
- **juce_serialport**: a small POSIX serial port, which is also what the panel link on the real KICK needs.
- A handful of one-line fixes where macOS is stricter than Linux about includes.

None of this is Music Tribe's original code, and it is not finished. I have not heard a note out of it yet, the panel simulator still predates the current protocol, and nothing has been built for the KICK itself. The build, with notes on every stand-in, is the `macos-build` branch of [my fork](https://github.com/Eight4aWish/0700-AAM). Since then, another developer, HeyMoustache, has [confirmed on GitHub](https://github.com/MusicTribeOpenSource/0700-AAM/issues/9#issuecomment-6445051910) that the same branch builds and runs on Linux, with no changes.

## For hardware hackers

The device tree says what Linux is told exists, not what the board brings out to a header, but it is suggestive:

- The CV converter sits alone on the chip's fourth I²C bus, at 400 kHz. The app writes to it directly from user space, so the device tree declares nothing on that bus.
- A spare SPI device node is left in from Variscite's defaults.
- The Linux login console is on the fourth serial port, and on this development build root has no password. The first serial port runs the panel and the third runs MIDI.

## What the code cannot tell me

- Where the camera code is.
- Which Variscite module is inside: the DART the README named, or the VAR-SOM the build is set up for.
- Which microcontroller runs the panel, and which converter drives the CV.
- What az01 was.
- Whether this is the shipping firmware. Version 0.3.3, the commented-out error checks and a root account with no password all say prototype.
- The price and ship date, neither of which has been announced.

Everything here is from the public source and history as of 27 October 2026, and the hardware that ships may differ.
