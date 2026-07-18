// MIDI Template - Pad, Bass, Lead, Drums
// Channels: 1=Pad, 2=Bass, 3=Lead, 10=Drums
// Drum notes: 36=Kick, 37=Side Stick, 38=Snare, 39=Clap

// Use "Ableton Move Standalone Port" to send to Ableton Live

// Choose your MIDI output device:
//const midiDevice = 'Teensy MIDI/Audio'  // Using Standalone Port (confirmed working)
const midiDevice = 'Ableton Move Standalone Port'  // Using Standalone Port (confirmed working)
// Other options:
// const midiDevice = 'Ableton Move Live Port'
// const midiDevice = 'Ableton Move User Port'
// const midiDevice = 'Ableton Move External Port'
// const midiDevice = 'IAC Driver Bus 1'  // For virtual MIDI bus

stack(
  // Channel 1 - Pad
  note("c3 f3 g3 f3")
    .velocity(0.6)
    .transpose(-12)
    .midichan(1)  // Channel 1
    .midi(midiDevice)
    .slow(8)
    .sustain(0.9),
  
  // Channel 2 - Bass
  note("c2 c2 <f2 g3> g2 c2 c2 <f2 g3> g2*2")
    .midichan(2)  // Channel 2
    .midi(midiDevice)
    .slow(4)
    .sustain(0.3),
  
  
  // Channel 10 - Drums (GM standard)
  // 36=Kick, 38=Snare, 37=Side Stick, 39=Clap
  note("36 36 36 36, ~ 37 ~ 37, 38*8, 39 39 39 39/3?")
    .velocity(0.7)
    .midichan(10)  // Channel 10 (drums)
    .midi(midiDevice)
)
.cpm(44)  // 40 cycles per minute (adjust to taste: 30-60 typical range)