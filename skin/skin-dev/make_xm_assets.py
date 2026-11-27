# -*- coding: utf-8 -*-
"""Raster assets of the Christmas skin, cut from the generated art.

    python make_xm_assets.py  ->  assets/xm_home_bg.webp   night forest behind the start page (sleigh baked over the moon)
                                  assets/xm_avatar.webp    the home avatar (face of the key visual)
Both are copied to film/public/xm/skin/ so the film draws the very same pixels as the client.
"""
import os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(HERE, "assets")
FILM = os.path.join(ROOT, "film", "public", "xm")
CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"

MOON = (1672, 148)      # centre of the moon in bg_night.jpg
SLEIGH_W = 132          # px in the 1920 px wide image


def rasterize(svg, width, height, scale=4):
    """SVG -> RGBA via headless Chrome (transparent page), supersampled."""
    tmp = tempfile.mkdtemp(dir=os.path.join(ROOT, ".cache"))
    html = os.path.join(tmp, "r.html")
    png = os.path.join(tmp, "r.png")
    with open(html, "w", encoding="utf-8") as fh:
        fh.write(f'<!doctype html><body style="margin:0;background:transparent"><img src="file:///{svg.replace(os.sep, "/")}" style="width:{width * scale}px;height:{height * scale}px;display:block">')
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
                    f"--window-size={width * scale},{height * scale}", f"--screenshot={png}", "file:///" + html.replace(os.sep, "/")],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    im = Image.open(png).convert("RGBA").resize((width, height), Image.LANCZOS)
    shutil.rmtree(tmp, ignore_errors=True)
    return im


def home_bg():
    bg = Image.open(os.path.join(FILM, "bg_night.jpg")).convert("RGB")
    assert bg.size == (1920, 1080)
    h = round(SLEIGH_W * 110 / 240)
    sleigh = rasterize(os.path.join(ASSETS, "xm_sleigh.svg"), SLEIGH_W, h)
    k = SLEIGH_W / 240
    bg.paste(sleigh, (round(MOON[0] - 125 * k), round(MOON[1] - 55 * k)), sleigh)
    out = os.path.join(ASSETS, "xm_home_bg.webp")
    bg.save(out, "WEBP", quality=84, method=6)
    return out


def avatar():
    kv = Image.open(os.path.join(FILM, "kv_front.png")).convert("RGBA")
    cx, cy, half = 1092, 548, 236          # her face in the 2336x3504 key visual
    face = kv.crop((cx - half, cy - half, cx + half, cy + half))
    size = 168
    face = face.resize((size, size), Image.LANCZOS)
    # warm wine-to-night backdrop, like candle light on velvet
    back = Image.new("RGB", (size, size), "#132638")
    glow = Image.new("L", (size, size), 0)
    ImageDraw.Draw(glow).ellipse((size * 0.08, size * 0.02, size * 0.92, size * 0.86), fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.16))
    back.paste(Image.new("RGB", (size, size), "#5a1f2e"), (0, 0), glow)
    back.paste(face, (0, 0), face)
    out = os.path.join(ASSETS, "xm_avatar.webp")
    back.save(out, "WEBP", quality=90, method=6)
    return out


if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, ".cache"), exist_ok=True)
    os.makedirs(os.path.join(FILM, "skin"), exist_ok=True)
    for path in (home_bg(), avatar()):
        shutil.copy(path, os.path.join(FILM, "skin", os.path.basename(path)))
        print(os.path.basename(path), os.path.getsize(path), "bytes", Image.open(path).size)
