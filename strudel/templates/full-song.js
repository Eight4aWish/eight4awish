// Full Song Template
// A complete composition with drums, bass, and melody

stack(
  // Kick and Snare
  sound("bd*2, ~ sd ~ sd")
    .bank('RolandTR808')
    .gain(0.8),
  
  // Hi-hats
  sound("hh*8")
    .bank('RolandTR808')
    .gain("[0.6 0.4]*4")
    .pan(sine.range(0.3, 0.7)),
  
  // Bass line
  note("c2 c2 eb2 g2")
    .sound("sawtooth")
    .lpf(400)
    .cutoff(sine.range(300, 800).slow(8))
    .gain(0.5),
  
  // Lead melody
  note("c4 eb4 g4 bb4 c5 bb4 g4 eb4")
    .sound("triangle")
    .slow(2)
    .room(0.4)
    .delay(0.25)
    .delaytime(0.125)
    .delayfeedback(0.3)
    .gain(0.35),
  
  // Pads
  note("<[c3,eb3,g3,bb3] [f2,ab2,c3,eb3]>")
    .sound("sine")
    .slow(8)
    .attack(0.5)
    .release(1)
    .room(0.8)
    .gain(0.2)
)
.cpm(90) // tempo: 90 cycles per minute
