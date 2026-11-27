# -*- coding: utf-8 -*-
"""Vector decorations for the Christmas skin and film (drawn by code, no generated art).

    python make_xm_vectors.py   ->  assets/xm_sleigh.svg, xm_sprig.svg, xm_bauble.svg, xm_snow_a.svg, xm_snow_b.svg
                                    (copied to film/public/xm/skin/ as well)
"""
import math, os, random, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "assets")
FILM = os.path.join(os.path.dirname(HERE), "film", "public", "xm", "skin")

NIGHT = "#06111d"
GOLD = "#ffd98a"


def f(x):
    return f"{x:.2f}".rstrip("0").rstrip(".")


# ── Santa's sleigh and three reindeer, small enough to cross the moon's disc ──
DEER = (
    '<path d="M-14 0C-14-6-6-8.5 4-7.5 10-7 14.5-4 14.5 0 14.5 4 8 6 0 6-8 6-14 4-14 0Z"/>'
    '<path d="M8.5-4.5 14.5-15.5 22-18 24.5-14.5 18.5-12 14.5-2Z"/>'
    '<g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M16-16.5 13-25M14.6-20.6 10.4-22.6M18.2-17 19.4-26M18.8-21.6 22.8-24"/>'
    '<path d="M10 3 20 9.5 26.5 8M6.5 4 15 12 21.5 13.5M-10 3-19.5 10-26.5 8.5M-6.5 4-15 12-22.5 14.5" stroke-width="2.3"/>'
    '<path d="M-14-2-18.5-5.5" stroke-width="2"/></g>'
)
SLEIGH = (
    '<path d="M-24 12C-10 14.5 14 14.5 23 10.5 28.5 8 29 1 24.5-1" fill="none" stroke-width="2.2" stroke-linecap="round"/>'
    '<path d="M-19 9-22-7C-13-5-5-3 4-3L12-3C16-9 20-11.5 23.5-11.5L19 9Z"/>'
    '<circle cx="-12" cy="-10" r="7.5"/>'  # sack
    '<path d="M-3-4-3-13C-3-17 4-17 4-13L4-4Z"/><circle cx="0.5" cy="-17" r="3.6"/>'  # santa
    '<path d="M-2.6-19C-1-25 5-25 8-21L3.4-18.6Z"/><circle cx="8.6" cy="-20.6" r="1.6"/>'  # hat + pom
)


def sleigh_svg():
    parts = []
    team = [(52, 76, SLEIGH, 1.0), (108, 60, DEER, 0.86), (152, 46, DEER, 0.86), (196, 32, DEER, 0.86)]
    reins = "M70 66 " + " ".join(f"L{x - 8} {y - 4}" for x, y, _s, _k in team[1:])
    for x, y, shape, k in team:
        parts.append(f'<g transform="translate({x} {y}) rotate(-16) scale({k})">{shape}</g>')
    rng = random.Random(7)
    trail = "".join(
        f'<circle cx="{f(34 - i * 6.2 + rng.uniform(-2, 2))}" cy="{f(84 + i * 1.9 + rng.uniform(-3, 3))}" r="{f(1.5 - i * 0.16)}" fill="{GOLD}" opacity="{f(0.85 - i * 0.11)}"/>'
        for i in range(7)
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 110">'
        f'{trail}<path d="{reins}" fill="none" stroke="{NIGHT}" stroke-width="1" opacity=".85"/>'
        f'<g fill="{NIGHT}" stroke="{NIGHT}">{"".join(parts)}</g>'
        f'<g fill="none" stroke="{GOLD}" stroke-opacity=".3" stroke-width=".7" stroke-linejoin="round">'
        + "".join(f'<g transform="translate({x} {y}) rotate(-16) scale({k})">{outline_only(shape)}</g>' for x, y, shape, k in team)
        + "</g></svg>"
    )


def outline_only(shape):
    # the rim uses the same geometry; strokes inside <g> keep their own widths, so drop them and keep closed paths
    import re
    closed = re.findall(r'<path d="[^"]*Z"/>|<circle [^>]*/>', shape)
    return "".join(closed)


# ── pine sprig with holly for the sidebar's top-right corner ──
def needles(pts, rng, length, spread=38, step=3.2, shades=("#1f6b4f", "#2b8763", "#17503c")):
    out = []
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        seg = math.hypot(x1 - x0, y1 - y0)
        ang = math.atan2(y1 - y0, x1 - x0)
        n = max(1, int(seg / step))
        for j in range(n):
            t = j / n
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            taper = 0.55 + 0.45 * (1 - (i + t) / (len(pts) - 1))
            for side in (-1, 1):
                a = ang + side * math.radians(spread + rng.uniform(-9, 9))
                ln = length * taper * rng.uniform(0.8, 1.15)
                out.append(
                    f'<path d="M{f(x)} {f(y)}L{f(x + math.cos(a) * ln)} {f(y + math.sin(a) * ln)}" stroke="{rng.choice(shades)}" stroke-width="{f(rng.uniform(0.9, 1.4))}"/>'
                )
    return "".join(out)


def bez(p0, p1, p2, n=16):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]


def holly(cx, cy, rot, s=1.0, tone="#1d7a55"):
    d = "M0 0C3-5 8-5 9-9 12-6 17-8 19-12 20-7 25-6 28-8 27-3 31 0 34 0 31 0 27 3 28 8 25 6 20 7 19 12 17 8 12 6 9 9 8 5 3 5 0 0Z"
    return (
        f'<g transform="translate({f(cx)} {f(cy)}) rotate({f(rot)}) scale({f(s)})">'
        f'<path d="{d}" fill="{tone}" stroke="#0f3f2d" stroke-width=".8" stroke-linejoin="round"/>'
        '<path d="M2 0H31" stroke="#49b98a" stroke-width=".8" stroke-opacity=".7" fill="none"/></g>'
    )


def berry(cx, cy, r=4.2):
    return (
        f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="#e5484d" stroke="#8f1c25" stroke-width=".7"/>'
        f'<circle cx="{f(cx - r * 0.3)}" cy="{f(cy - r * 0.35)}" r="{f(r * 0.3)}" fill="#ffd9d0" opacity=".85"/>'
    )


def sprig_svg():
    rng = random.Random(11)
    W = H = 132
    branches = [
        bez((W + 4, -2), (86, 20), (30, 26)),
        bez((W + 2, 0), (104, 44), (72, 82)),
        bez((W + 4, 6), (124, 60), (112, 112)),
        bez((96, 16), (74, 34), (44, 58)),
    ]
    g = []
    for i, b in enumerate(branches):
        ln = [9.5, 9, 8.5, 7.5][i]
        g.append(f'<path d="M{" L".join(f"{f(x)} {f(y)}" for x, y in b)}" fill="none" stroke="#5a3a22" stroke-width="{f(1.9 - i * 0.2)}" stroke-linecap="round"/>')
        g.append(f'<g stroke-linecap="round" fill="none">{needles(b, rng, ln)}</g>')
    # frost on a few needle tips
    frost = "".join(
        f'<circle cx="{f(x + rng.uniform(-5, 5))}" cy="{f(y + rng.uniform(-5, 5))}" r="{f(rng.uniform(0.7, 1.4))}" fill="#eef6ff" opacity="{f(rng.uniform(0.5, 0.9))}"/>'
        for b in branches for x, y in b[2::3]
    )
    deco = holly(62, 44, 150, 0.8) + holly(66, 48, 62, 0.74, "#218a5f") + holly(70, 40, 205, 0.62, "#18694a") + berry(67, 45) + berry(74, 49, 3.6) + berry(70, 52, 3.3)
    lights = "".join(
        f'<circle cx="{x}" cy="{y}" r="6" fill="{c}" opacity=".22"/><circle cx="{x}" cy="{y}" r="2" fill="{c}"/>'
        for x, y, c in [(52, 27, "#ffd98a"), (78, 70, "#ff8f7a"), (114, 92, "#ffd98a"), (62, 46, "#9af0c8")]
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{"".join(g)}{frost}{lights}{deco}</svg>'


# ── a bauble hanging on a thread (swings from its top) ──
def bauble_svg():
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 92">'
        '<defs><radialGradient id="b" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#ff8f7a"/><stop offset=".45" stop-color="#e5484d"/><stop offset="1" stop-color="#8f1c25"/></radialGradient>'
        '<linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0c2"/><stop offset=".5" stop-color="#f2b84b"/><stop offset="1" stop-color="#b47a16"/></linearGradient></defs>'
        '<path d="M14 0V58" stroke="#f2b84b" stroke-opacity=".6" stroke-width="1"/>'
        '<rect x="10.5" y="57" width="7" height="6" rx="1.4" fill="url(#c)"/><path d="M12 57.5a2 2.6 0 0 1 4 0" fill="none" stroke="#f2b84b" stroke-width="1"/>'
        '<circle cx="14" cy="75" r="12.5" fill="url(#b)"/>'
        '<path d="M2.6 72.5Q14 78 25.4 72.5M3.4 79Q14 84 24.6 79" fill="none" stroke="#ffd98a" stroke-width="1.1" stroke-opacity=".9"/>'
        '<path d="M14 71.2l1.1 2.5 2.7.3-2 1.8.6 2.6-2.4-1.4-2.4 1.4.6-2.6-2-1.8 2.7-.3Z" fill="#ffe6ad"/>'
        '<ellipse cx="9.4" cy="69" rx="2.6" ry="3.6" fill="#fff" opacity=".42" transform="rotate(-28 9.4 69)"/>'
        "</svg>"
    )


# ── two tiles of soft falling snow (they loop vertically) ──
def snow_svg(size, n, rmin, rmax, omin, omax, seed):
    rng = random.Random(seed)
    dots = []
    for _ in range(n):
        x, y, r, o = rng.uniform(0, size), rng.uniform(0, size), rng.uniform(rmin, rmax), rng.uniform(omin, omax)
        for dx in (-size, 0, size):
            for dy in (-size, 0, size):
                if -r <= x + dx <= size + r and -r <= y + dy <= size + r:
                    dots.append(f'<circle cx="{f(x + dx)}" cy="{f(y + dy)}" r="{f(r)}" opacity="{f(o)}"/>')
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
        '<defs><radialGradient id="s"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#eef6ff" stop-opacity=".8"/><stop offset="1" stop-color="#eef6ff" stop-opacity="0"/></radialGradient></defs>'
        f'<g fill="url(#s)">{"".join(dots)}</g></svg>'
    )


FILES = {
    "xm_sleigh.svg": sleigh_svg,
    "xm_sprig.svg": sprig_svg,
    "xm_bauble.svg": bauble_svg,
    "xm_snow_a.svg": lambda: snow_svg(360, 9, 1.5, 2.8, 0.4, 0.85, 3),
    "xm_snow_b.svg": lambda: snow_svg(520, 6, 3.2, 5.6, 0.2, 0.42, 5),
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(FILM, exist_ok=True)
    for name, fn in FILES.items():
        svg = fn()
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(svg)
        shutil.copy(os.path.join(OUT, name), os.path.join(FILM, name))
        print(f"{name}: {len(svg)} bytes")
