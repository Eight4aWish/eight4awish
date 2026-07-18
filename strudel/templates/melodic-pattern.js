// Melodic Pattern Template
// Layered melody with bass and chords

stack(
  // Bass line
  note("c2 eb2 g2 f2")
    .sound("sawtooth")
    .lpf(800)
    .gain(0.6),
  
  // Melody
  note("c4 d4 eb4 g4 f4 eb4 d4 c4")
    .sound("triangle")
    .slow(2)
    .room(0.5)
    .gain(0.4),
  
  // Chords
  note("<[c3,eb3,g3] [bb2,d3,f3]>")
    .sound("square")
    .slow(4)
    .lpf(1200)
    .gain(0.3)
)
