// Techno Groove Template
// Driving techno beat with modulation

stack(
  // Kick pattern
  sound("bd*4")
    .bank('RolandTR909')
    .gain(0.9),
  
  // Clap/Snare
  sound("~ cp ~ cp")
    .bank('RolandTR909')
    .gain(0.7),
  
  // Hi-hats with variation
  sound("hh*16")
    .bank('RolandTR909')
    .gain("<0.5 0.6 0.4 0.7>")
    .speed(perlin.range(0.9, 1.1)),
  
  // Percussive sounds
  sound("~ ~ oh ~")
    .bank('RolandTR909')
    .gain(0.5),
  
  // Acid bass
  note("c1 [c1 eb1] [g1 f1] c1")
    .sound("sawtooth")
    .lpf(sine.range(200, 2000).slow(4))
    .resonance(15)
    .gain(0.6)
)
.cpm(128)
