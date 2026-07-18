# Strudel Music Live Coding Templates

Welcome to your Strudel music live coding workspace! Strudel is a powerful JavaScript-based live coding environment for creating music patterns.

## Getting Started

1. Open [index.html](index.html) in your web browser to use the web-based editor
2. Alternatively, use the online Strudel REPL at https://strudel.cc/
3. Check out the template files in the `templates/` folder for inspiration

## Template Files

### Basic Templates
- **[basic-beat.js](templates/basic-beat.js)** - Simple drum pattern to get started
- **[melodic-pattern.js](templates/melodic-pattern.js)** - Layered melody with bass and chords
- **[full-song.js](templates/full-song.js)** - Complete composition structure

### Genre Templates
- **[techno-groove.js](templates/techno-groove.js)** - Driving techno beat with modulation
- **[ambient-soundscape.js](templates/ambient-soundscape.js)** - Atmospheric and evolving sounds

## Core Concepts

### Mini-Notation
```javascript
sound("bd sd hh cp")  // plays sounds in sequence
sound("bd*4")         // plays bd 4 times per cycle
sound("bd sd, hh*8")  // layered patterns (comma separates)
sound("bd ~ sd ~")    // ~ is a rest/silence
sound("<bd sd>")      // alternates between bd and sd each cycle
sound("[bd sd] hh")   // [] groups into one step
```

### Pattern Functions
```javascript
.fast(2)              // double the speed
.slow(2)              // half the speed
.rev()                // reverse the pattern
.echo(4, 0.125, 0.5)  // echo effect
.jux(rev)             // apply function to right channel only
```

### Sound Manipulation
```javascript
.gain(0.8)            // volume (0-1)
.pan(0.5)             // stereo position (0=left, 1=right)
.speed(2)             // playback speed
.lpf(1000)            // low-pass filter
.hpf(200)             // high-pass filter
.room(0.5)            // reverb amount
.delay(0.5)           // delay amount
```

### Synthesis
```javascript
note("c3 d3 e3 f3")   // MIDI notes
  .sound("sawtooth")  // waveform: sine, square, triangle, sawtooth
  .lpf(800)           // filter cutoff
  .resonance(10)      // filter resonance
  .attack(0.1)        // envelope attack
  .decay(0.2)         // envelope decay
  .sustain(0.5)       // envelope sustain
  .release(0.3)       // envelope release
```

### Stacking Patterns
```javascript
stack(
  sound("bd sd"),
  sound("hh*4"),
  note("c3 e3 g3").sound("triangle")
)
```

### Control Patterns
```javascript
.cpm(120)             // cycles per minute (tempo)
.slow(4)              // slow down by 4x
.struct("x ~ x x")    // apply rhythmic structure
```

### Modulation
```javascript
sine.range(0, 1)      // sine wave LFO
perlin.range(0, 1)    // smooth random values
rand.range(0, 1)      // random values
```

## Sound Banks

Common drum machines:
- `RolandTR808` - Classic 808 sounds
- `RolandTR909` - Classic 909 sounds
- `RolandTR707` - 707 drum machine

Example:
```javascript
sound("bd sd hh cp").bank('RolandTR808')
```

## Tips for Live Coding

1. **Start Simple** - Begin with a basic beat and add layers gradually
2. **Use Comments** - Mark sections with `//` for easy navigation
3. **Save Often** - Keep versions of patterns you like
4. **Experiment** - Try different combinations of effects
5. **Listen** - Let the music guide your next change

## Common Patterns

### Four-on-the-Floor
```javascript
sound("bd*4, ~ sd ~ sd, hh*8")
```

### Breakbeat
```javascript
sound("bd ~ sd [~ bd] bd ~ sd ~")
```

### Euclidean Rhythm
```javascript
sound("bd(3,8), sd(5,8)")  // 3 kicks in 8 steps, 5 snares in 8 steps
```

## Resources

- **Official Strudel Site**: https://strudel.cc/
- **Tutorial**: https://strudel.cc/learn/
- **Pattern Reference**: https://strudel.cc/learn/mini-notation/
- **Community Discord**: Join the Strudel community for help and inspiration

## Quick Reference Card

| Syntax | Description |
|--------|-------------|
| `a b c` | Sequence |
| `a*4` | Repeat 4 times |
| `a/4` | Slow down by 4 |
| `a,b` | Layer/stack |
| `~` | Rest/silence |
| `<a b>` | Alternate each cycle |
| `[a b]` | Group into one step |
| `a!4` | Replicate 4 times |
| `a(3,8)` | Euclidean rhythm |

## Example: Building a Track

```javascript
// Start with drums
sound("bd sd bd sd")

// Add hi-hats
sound("bd sd bd sd, hh*8")

// Add variation
sound("bd sd bd <sd cp>, hh*8")
  .gain(0.8)

// Add bass
stack(
  sound("bd sd bd <sd cp>, hh*8").gain(0.8),
  note("c2 c2 eb2 g2").sound("sawtooth").lpf(600)
)

// Add melody
stack(
  sound("bd sd bd <sd cp>, hh*8").gain(0.8),
  note("c2 c2 eb2 g2").sound("sawtooth").lpf(600),
  note("c4 eb4 g4 bb4").slow(2).sound("triangle").room(0.5)
)
```

Happy live coding! 🎵
