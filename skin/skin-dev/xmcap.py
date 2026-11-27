# -*- coding: utf-8 -*-
"""Capture the (possibly hidden) live client: the first frame after a change is stale, so grab twice.
    python xmcap.py <out.png> [x y w h [scale]]   -> full capture, plus <out>_crop.png when a box is given"""
import os, sys, time
from skinctl import send
from PIL import Image

def capture(out, tries=6):
    """A hidden page only catches up while it is being captured: repeat until two frames in a row match."""
    import hashlib
    last = None
    for _ in range(tries):
        r = send("capture", out=os.path.abspath(out))
        h = hashlib.md5(open(out, "rb").read()).hexdigest() if r.get("ok") else None
        if h and h == last:
            return r
        last = h
        time.sleep(0.7)
    return r

if __name__ == "__main__":
    out = sys.argv[1]
    r = capture(out)
    print("ok" if r.get("ok") else r)
    if len(sys.argv) >= 6:
        x, y, w, h = map(int, sys.argv[2:6]); k = float(sys.argv[6]) if len(sys.argv) > 6 else 1
        im = Image.open(out).crop((x, y, x + w, y + h))
        if k != 1: im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
        im.save(out.replace(".png", "_crop.png"))
