import json, os
from PIL import Image, ImageDraw

OUT = os.path.expanduser("~/GitHub/eight4awish/public/renders")
RED   = (208, 32, 42)
DARK  = (32, 34, 38)
GREY  = (150, 154, 160)
LGREY = (228, 229, 232)
BG    = (255, 255, 255)

# ---------------------------------------------------------------- 1. music as code
def pianoroll():
    W, H, steps, lanes = 960, 430, 16, 24
    ml, mt, mr, mb = 26, 18, 18, 18
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    gw = (W - ml - mr) / steps
    gh = (H - mt - mb) / lanes
    for s in range(steps + 1):
        x = ml + s * gw
        d.line([(x, mt), (x, H - mb)], fill=(203, 205, 210) if s % 4 == 0 else LGREY, width=1)
    for l in range(lanes + 1):
        y = mt + l * gh
        d.line([(ml, y), (W - mr, y)], fill=(244, 244, 246), width=1)

    def note(step, lane, length=1, col=DARK):
        x0 = ml + step * gw + 2.5
        y0 = mt + (lanes - 1 - lane) * gh + 2.5
        x1 = ml + (step + length) * gw - 2.5
        y1 = y0 + gh - 5
        d.rounded_rectangle([x0, y0, x1, y1], radius=3, fill=col)

    for s in [0, 4, 8, 12]: note(s, 0)                      # kick
    for s in [4, 12]: note(s, 1)                            # snare
    for s in range(0, 16, 2): note(s, 2)                    # closed hat
    for s in range(1, 16, 2): note(s, 3, 1, GREY)           # open hat
    # bass — held notes
    for base in (0, 8):
        note(base + 0, 6, 4, RED); note(base + 4, 9, 2, RED); note(base + 6, 11, 2, RED)
    # pad — long chords
    note(0, 15, 8, (196, 199, 204)); note(8, 17, 8, (196, 199, 204))
    # lead
    for s, l in [(0,19),(1,21),(2,22),(3,20),(4,23),(5,21),(6,19),(7,20),
                 (8,20),(9,22),(10,23),(11,21),(12,19),(13,22),(14,20),(15,19)]:
        note(s, l, 1, RED)
    im.save(os.path.join(OUT, "tut_music.png"), optimize=True)
    print("tut_music.png", im.size)

# ------------------------------------------------------------- 2. circuits as code
def breadboard():
    p = os.path.expanduser("~/GitHub/eurorack_electronics/tools/visualizer/layouts/kick_drum.json")
    L = json.load(open(p))
    R0, R1 = 3, 32
    order = ['-12v','gndL','a','b','c','d','e','GAP','f','g','h','i','j','gndR','+12v']
    ci = {c: i for i, c in enumerate(order)}
    cell, ml, mt = 26, 34, 30
    W = ml * 2 + (R1 - R0 + 1) * cell
    H = mt * 2 + len(order) * cell
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)

    def xy(r, c):
        return (ml + (r - R0) * cell + cell / 2,
                mt + ci[str(c)] * cell + cell / 2)

    d.rounded_rectangle([ml - 14, mt - 12, W - ml + 14, H - mt + 12],
                        radius=10, fill=(248, 248, 249), outline=LGREY, width=1)
    for r in range(R0, R1 + 1):
        for c in order:
            if c == 'GAP': continue
            x, y = xy(r, c)
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(215, 217, 221))
    for rail, col in [('-12v', (140,144,150)), ('gndL', (140,144,150)),
                      ('gndR', (140,144,150)), ('+12v', (226,150,154))]:
        (x0, y) = xy(R0, rail); (x1, _) = xy(R1, rail)
        d.line([(x0 - 8, y), (x1 + 8, y)], fill=col, width=2)

    for t in L['twoPins']:                                   # resistors / caps
        x0, y0 = xy(t['r1'], t['c1']); x1, y1 = xy(t['r2'], t['c2'])
        d.line([(x0, y0), (x1, y1)], fill=(120, 124, 130), width=2)
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        d.rounded_rectangle([mx - 8, my - 5, mx + 8, my + 5], radius=2,
                            fill=(208, 210, 215), outline=(120, 124, 130))
    for t in L['transistors']:
        x, y = xy(t['bR'], t['bC'])
        d.pieslice([x - 9, y - 9, x + 9, y + 9], start=0, end=180, fill=DARK)
    for ic in L['ics']:                                      # DIPs across the channel
        rs = [q['r'] for q in ic['pins']]
        x0, _ = xy(min(rs), 'a'); x1, _ = xy(max(rs), 'a')
        _, yt = xy(min(rs), 'e'); _, yb = xy(min(rs), 'f')
        d.rounded_rectangle([x0 - 10, yt - 5, x1 + 10, yb + 5], radius=3, fill=(40, 42, 46))
    for j in L['jumpers']:                                   # wires in brand red
        x0, y0 = xy(j['r1'], j['c1']); x1, y1 = xy(j['r2'], j['c2'])
        d.line([(x0, y0), (x1, y1)], fill=RED, width=2)
    for w in L['powerWires']:
        x0, y0 = xy(w['r1'], w['c1']); x1, y1 = xy(w['r2'], w['c2'])
        d.line([(x0, y0), (x1, y1)], fill=(198, 66, 72), width=2)

    im.save(os.path.join(OUT, "tut_circuits.png"), optimize=True)
    print("tut_circuits.png", im.size)

# --------------------------------------------------------------- 3. panels as code
def panels():
    names = ["daisy_braids", "ksoloti_elements", "daisy_grids"]
    ims = [Image.open(os.path.join(OUT, n + "_flat.png")).convert("RGB") for n in names]
    Ht, gap, pad = 470, 30, 26
    sc = [i.resize((round(i.size[0] * Ht / i.size[1]), Ht), Image.LANCZOS) for i in ims]
    W = sum(s.size[0] for s in sc) + gap * (len(sc) - 1) + pad * 2
    im = Image.new("RGB", (W, Ht + pad * 2), BG)
    x = pad
    for s in sc:
        im.paste(s, (x, pad)); x += s.size[0] + gap
    im.save(os.path.join(OUT, "tut_panels.png"), optimize=True)
    print("tut_panels.png", im.size)

pianoroll(); breadboard(); panels()
