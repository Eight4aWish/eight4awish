// Ambient Soundscape Template
// Atmospheric and evolving sounds

stack(
  // Drone layer
  note("c2")
    .sound("sine")
    .gain(perlin.range(0.1, 0.3).slow(16))
    .room(0.9)
    .roomsize(0.9),
  
  // Evolving pads
  note("<[c3,e3,g3] [d3,f3,a3] [e3,g3,b3] [c3,eb3,g3]>")
    .sound("triangle")
    .slow(8)
    .attack(2)
    .release(3)
    .room(0.8)
    .lpf(sine.range(400, 1200).slow(12))
    .gain(0.25),
  
  // Sparse melodic notes
  note("c4 ~ g4 ~ e4 ~ ~ f4")
    .sound("sine")
    .slow(4)
    .delay(0.5)
    .delaytime(0.375)
    .delayfeedback(0.6)
    .room(0.7)
    .gain(0.2),
  
  // Textural layer
  sound("~ ~ pluck ~")
    .speed(rand.range(0.5, 1.5))
    .delay(0.8)
    .room(0.9)
    .gain(0.15)
)
.slow(2)
.cpm(60)
