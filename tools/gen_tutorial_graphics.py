import numpy as np, struct, os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.expanduser("~/GitHub/eight4awish/public/renders")
ASM = os.path.expanduser("~/GitHub/build123d/render/out/daisy_braids")
RED = (208, 32, 42)

# ============================================================ 3D panel (from STLs)
PART_COLOUR = {
    "panel":           (44, 46, 50),
    "labels":          (240, 240, 242),
    "jack_body":       (62, 64, 68),
    "nut_black":       (48, 50, 54),
    "nut_red":         RED,
    "nut_silver":      (178, 181, 186),
    "bolt":            (172, 175, 180),
    "trimmer":         (228, 229, 232),
    "trimmer_pointer": RED,
    "led":             RED,
    "led_dome":        (232, 96, 100),
    "switch_cap":      (202, 204, 208),
    "sd_card":         (150, 153, 158),
}

def load_stl(path):
    with open(path, "rb") as f:
        f.read(80)
        n = struct.unpack("<I", f.read(4))[0]
        data = f.read(n * 50)
    a = np.frombuffer(data, dtype=np.uint8).reshape(n, 50)
    v = np.ascontiguousarray(a[:, 12:48]).view("<f4").reshape(n, 3, 3)
    return v.astype(np.float32)

def rot(yaw, pitch, roll):
    cy, sy = np.cos(np.radians(yaw)), np.sin(np.radians(yaw))
    cp, sp = np.cos(np.radians(pitch)), np.sin(np.radians(pitch))
    cr, sr = np.cos(np.radians(roll)), np.sin(np.radians(roll))
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], np.float32)   # about vertical
    Rx = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]], np.float32)   # tilt
    Rz = np.array([[cr, -sr, 0], [sr, cr, 0], [0, 0, 1]], np.float32)   # roll in view plane
    return Rz @ Rx @ Ry

def render_panel(W=1000, H=560, ss=2, yaw=-34, pitch=16, roll=-16):
    tris, cols = [], []
    for name, c in PART_COLOUR.items():
        p = os.path.join(ASM, name + ".stl")
        if not os.path.exists(p): continue
        t = load_stl(p)
        tris.append(t); cols.append(np.tile(np.array(c, np.float32), (len(t), 1)))
    T = np.concatenate(tris); C = np.concatenate(cols)
    R = rot(yaw, pitch, roll)
    V = T.reshape(-1, 3) @ R.T
    V = V.reshape(-1, 3, 3)
    # normals + backface cull
    e1 = V[:, 1] - V[:, 0]; e2 = V[:, 2] - V[:, 0]
    N = np.cross(e1, e2)
    ln = np.linalg.norm(N, axis=1); ln[ln == 0] = 1
    N = N / ln[:, None]
    front = N[:, 2] > 0
    V, C, N = V[front], C[front], N[front]
    # light
    L = np.array([-0.35, 0.45, 0.82], np.float32); L /= np.linalg.norm(L)
    lam = np.clip(N @ L, 0, 1)
    shade = (0.34 + 0.66 * lam)[:, None]
    C = np.clip(C * shade, 0, 255)

    w, h = W * ss, H * ss
    mn, mx = V.reshape(-1, 3).min(0), V.reshape(-1, 3).max(0)
    ctr = (mn + mx) / 2
    scale = 0.90 * min(w / (mx[0] - mn[0]), h / (mx[1] - mn[1]))
    px = (V[:, :, 0] - ctr[0]) * scale + w / 2
    py = h / 2 - (V[:, :, 1] - ctr[1]) * scale
    pz = V[:, :, 2]

    img = np.full((h, w, 3), 255, np.float32)
    zb = np.full((h, w), -1e9, np.float32)
    x0 = np.clip(np.floor(px.min(1)).astype(int), 0, w - 1)
    x1 = np.clip(np.ceil(px.max(1)).astype(int), 0, w - 1)
    y0 = np.clip(np.floor(py.min(1)).astype(int), 0, h - 1)
    y1 = np.clip(np.ceil(py.max(1)).astype(int), 0, h - 1)
    for i in range(len(V)):
        ax, ay = px[i, 0], py[i, 0]; bx, by = px[i, 1], py[i, 1]; cx, cy = px[i, 2], py[i, 2]
        d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
        if abs(d) < 1e-9: continue
        xs = np.arange(x0[i], x1[i] + 1); ys = np.arange(y0[i], y1[i] + 1)
        if xs.size == 0 or ys.size == 0: continue
        X, Y = np.meshgrid(xs + 0.5, ys + 0.5)
        w0 = ((by - cy) * (X - cx) + (cx - bx) * (Y - cy)) / d
        w1 = ((cy - ay) * (X - cx) + (ax - cx) * (Y - cy)) / d
        w2 = 1 - w0 - w1
        m = (w0 >= 0) & (w1 >= 0) & (w2 >= 0)
        if not m.any(): continue
        z = w0 * pz[i, 0] + w1 * pz[i, 1] + w2 * pz[i, 2]
        sub = zb[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]
        better = m & (z > sub)
        if not better.any(): continue
        sub[better] = z[better]
        img[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1][better] = C[i]
    im = Image.fromarray(img.astype(np.uint8)).resize((W, H), Image.LANCZOS)
    im.save(os.path.join(OUT, "tut_panels.png"), optimize=True)
    print("tut_panels.png", im.size, len(V), "tris")

# ====================================================== hydra frame (ch7 chain) + code
def vnoise(X, Y, freq, seed=3):
    rng = np.random.default_rng(seed)
    g = rng.random((freq + 2, freq + 2)).astype(np.float32)
    u, v = (X % 1.0) * freq, (Y % 1.0) * freq
    i, j = np.floor(u).astype(int), np.floor(v).astype(int)
    fu, fv = u - i, v - j
    su, sv = fu * fu * (3 - 2 * fu), fv * fv * (3 - 2 * fv)
    i = np.clip(i, 0, freq); j = np.clip(j, 0, freq)
    a = g[j, i]; b = g[j, i + 1]; c = g[j + 1, i]; d = g[j + 1, i + 1]
    return (a * (1 - su) * (1 - sv) + b * su * (1 - sv) + c * (1 - su) * sv + d * su * sv)

def render_hydra(W=1000, H=560):
    # the Chapter 7 chain, evaluated at one instant:
    #   osc(20,0.05,0.6).color(..).rotate(H(sine)).modulate(noise(..)).kaleid(..).scale(..)
    t = 1.7
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    st_x = xx / W; st_y = yy / H
    # .scale(1.2)
    s = 1.2
    st_x = (st_x - .5) / s + .5; st_y = (st_y - .5) / s + .5
    # .kaleid(5)
    k = 5
    dx, dy = st_x - .5, st_y - .5
    r = np.hypot(dx, dy); a = np.arctan2(dy, dx)
    a = np.mod(a, 2 * np.pi / k); a = np.abs(a - np.pi / k)
    st_x, st_y = r * np.cos(a) + .5, r * np.sin(a) + .5
    # .modulate(noise(2.4))
    n = vnoise(st_x, st_y, 6)
    st_x = st_x + (n - .5) * 0.28; st_y = st_y + (vnoise(st_y, st_x, 6, 9) - .5) * 0.28
    # .rotate(0.7)
    th = 0.7
    dx, dy = st_x - .5, st_y - .5
    st_x = dx * np.cos(th) - dy * np.sin(th) + .5
    st_y = dx * np.sin(th) + dy * np.cos(th) + .5
    # osc(20, 0.05, 0.6)
    freq, sync, off = 20.0, 0.05, 0.6
    R_ = np.sin((st_x - off / freq + t * sync) * freq) * .5 + .5
    G_ = np.sin((st_x + t * sync) * freq) * .5 + .5
    B_ = np.sin((st_x + off / freq + t * sync) * freq) * .5 + .5
    # .color(...) — pushed to the brand red on near-black
    img = np.stack([R_ * 1.00, G_ * 0.16, B_ * 0.22], -1)
    img = np.clip(img ** 1.45, 0, 1)
    im = Image.fromarray((img * 255).astype(np.uint8))

    # --- the code, sitting on the visual (as it does in the REPL) ---
    # feathered scrim so the visual bleeds through behind the code
    g = np.clip((0.72 - np.linspace(0, 1, W)) / 0.30, 0, 1) ** 0.85
    scrim = np.zeros((H, W, 4), np.uint8)
    scrim[..., :3] = (10, 10, 12)
    scrim[..., 3] = (g * 205).astype(np.uint8)[None, :]
    im = Image.alpha_composite(im.convert("RGBA"), Image.fromarray(scrim, "RGBA")).convert("RGB")
    d = ImageDraw.Draw(im, "RGBA")
    try:
        f = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 17)
        fb = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 17, index=1)
    except Exception:
        f = fb = ImageFont.load_default()
    lines = [
        ("osc", "(20, 0.05, 0.6)"),
        ("  .color", "(() => .5 + a.fft[1]*.8, .2, ...)"),
        ("  .rotate", "(H(sine.slow(8)))"),
        ("  .modulate", "(noise(() => 1 + a.fft[2]*3))"),
        ("  .kaleid", "(() => 3 + a.fft[0]*4)"),
        ("  .scale", "(H(saw.range(1,1.4).slow(4)))"),
        ("  .out", "()"),
    ]
    y = 96
    for meth, rest in lines:
        d.text((34, y), meth, font=fb, fill=(255, 92, 98))
        d.text((34 + d.textlength(meth, font=fb), y), rest, font=f, fill=(226, 228, 232))
        y += 30
    d.text((34, 46), "chapter 7 — visuals", font=f, fill=(150, 152, 158))
    d.text((34, y + 16), "the kick opens the kaleidoscope", font=f, fill=(150, 152, 158))
    im.save(os.path.join(OUT, "tut_music.png"), optimize=True)
    print("tut_music.png", im.size)

render_hydra()
render_panel()
