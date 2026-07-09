# Eight4aWish — Module Ideas Backlog

*Living log of new module concepts not yet built. Last updated: 2026-06-26.*

---

## Hydra Screen — live-coded visuals as a eurorack module

**Captured:** 2026-06-26.

A eurorack module with an onboard screen running **Hydra** (the browser-based live-coding
visual synth), driven by CV / gate / audio inputs and synced to clock. Live-codeable visuals
that live in the rack as a first-class citizen — the hardware embodiment of the channel's
Strudel + Hydra visual identity.

### Why it fits the brand
- Direct hardware expression of the "vibe-coded music *and* visuals" angle (CHANNEL_PLAN §9,
  intro-sting idea). The video writes itself.
- VJ / reactive-visual eurorack is an underserved niche.
- Reuses patterns already proven in the catalogue (see below), so it's a credible build.

### Concept
- **Brain:** Hydra is WebGL/JS — needs a GPU + browser runtime, so a **Raspberry Pi-class
  SBC** (Pi 4/5 or Zero 2 W) running Chromium in kiosk mode with Hydra. ESP32-S3 can't run
  WebGL Hydra; keep it for the CV front-end if needed.
- **Screen:** small HDMI/DSI LCD on the panel, and/or **HDMI-out to an external display /
  projector** for actual VJ use.
- **CV → visuals:** panel CV/gate inputs → ADC → bridge (OSC/serial) → Hydra variables
  (`osc` speed, `.modulate()` amount, `.rotate()`, colour). Audio-in → FFT/level → reactive.
- **Sync:** clock-in and/or **Ableton Link** for beat-reactive visuals — reuse the
  ESP32 ClkLink work.
- **Live-coding:** edit Hydra code over WiFi via a module web UI — reuse the **CortHex**
  web-interface pattern.

### Leverages existing assets
- Web-UI-over-WiFi control pattern → **CortHex** (`nanoesp32_corthex`).
- Ableton Link / clock sync → **ESP32 ClkLink/ClkLinkRec**.
- Strudel + Hydra content angle already in the plan.

### Open questions
- Pi power draw on eurorack rails — +12V → 5V regulation, current budget, noise.
- Onboard panel screen vs HDMI-out-only (cost, depth, HP).
- Cleanest CV→Hydra path: Pi-native ADC HAT vs a small MCU front-end sending OSC.
- Boot time / reliability for a rack module (kiosk autostart, read-only FS?).
- Name: HydraVision / VJrack / 84W Hydra — TBD.

### Content potential
- Flagship-tier "wow" demo (visuals + sound, both live-coded).
- Pairs naturally with the Strudel course and the Strudel+Hydra intro-sting video.
