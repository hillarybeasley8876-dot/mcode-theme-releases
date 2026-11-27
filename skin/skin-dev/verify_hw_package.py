# -*- coding: utf-8 -*-
"""Verify the built Halloween package: contents, freshness, and portability.

Checks that every packaged file is the current (post-11-12) one, that the config
points at the Halloween film, that no machine-specific path or credential leaked in,
and that the zip is readable with portable entry names.
"""
import hashlib
import json
import os
import re
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD = os.path.join(ROOT, "launcher", "build", "MiniMaxCodeBoot")
OUT = os.path.join(ROOT, "deliver", "hw")
NAME = "MiniMaxCodeBoot-万圣节版"
DEST = os.path.join(OUT, NAME)
ZIP = os.path.join(OUT, NAME + ".zip")

sys.stdout.reconfigure(encoding="utf-8")
fails = []


def check(cond, msg):
    print(("  OK   " if cond else "  FAIL ") + msg)
    if not cond:
        fails.append(msg)


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


print("1) packaged files are the current launcher build (post-11-12 fixes)")
for rel in ("MiniMaxCodeBoot.exe", "skin/loader.js", "skin/skin-setup.ps1", "skin/halloween.css",
            "skin/guard.ps1", "skin/preload.js", "skin/patch-asar.js",
            "scripts/integrate-entrypoints.ps1", "scripts/install-start-menu.ps1", "scripts/Import-Animation.ps1"):
    p = os.path.join(DEST, rel)
    b = os.path.join(BUILD, rel)
    check(os.path.exists(p) and sha(p) == sha(b), f"{rel} matches the launcher build")

print("2) the executable carries the 11-12 handoff fix")
check(sha(os.path.join(DEST, "MiniMaxCodeBoot.exe")) ==
      sha(os.path.join(OUT, "..", "xm", "MiniMaxCodeBoot-圣诞节版", "MiniMaxCodeBoot.exe")),
      "exe identical to the flash-fixed Christmas build")

print("3) config points at the Halloween film and palette")
cfg = json.load(open(os.path.join(DEST, "launcher.json"), encoding="utf-8-sig"))
check(cfg["Video"] == "media/startup.hw.mp4", f"launcher.json Video = {cfg['Video']}")
check(cfg["Background"].upper() == "#130E19", f"Background = {cfg['Background']}")
check(cfg["Accent"].upper() == "#FF8A1F", f"Accent = {cfg['Accent']}")
check(cfg["PreLaunchScript"] == "skin/guard.ps1", "PreLaunchScript = skin/guard.ps1")
hw = json.load(open(os.path.join(DEST, "launcher.hw.json"), encoding="utf-8-sig"))
check(hw == cfg, "launcher.hw.json matches launcher.json (theme switch is a no-op)")
check(os.path.exists(os.path.join(DEST, "media", "startup.hw.mp4")), "the Halloween film is packaged")
check(sha(os.path.join(DEST, "media", "startup.hw.mp4")) ==
      sha(os.path.join(BUILD, "media", "startup.hw.mp4")), "film identical to the launcher build")

print("4) skin switch file")
sj = json.load(open(os.path.join(DEST, "skin", "skin.json"), encoding="utf-8"))
check(sj == {"enabled": True, "css": "halloween.css", "night": "#140F1B", "forceDark": True, "dev": False},
      f"skin.json = {sj}")

print("5) helpers")
for name in ("安装皮肤.cmd", "卸载皮肤.cmd", "打开皮肤.cmd", "关闭皮肤.cmd", "切换到万圣节主题.cmd",
             "安装到快捷方式.cmd", "恢复原快捷方式.cmd"):
    p = os.path.join(DEST, name)
    check(os.path.exists(p), f"{name} present")
check(not os.path.exists(os.path.join(DEST, "skin", "guard.vbs")),
      "guard.vbs not shipped (it is machine state, written on install)")

print("6) no machine-specific paths, credentials or leftovers")
# A leaked local path is an absolute Windows path: a drive letter followed by a
# backslash. A URL such as "http://..." is not one, and neither is a %ENV_VAR%
# reference. A leaked credential is a GitHub token or a private key.
pat = re.compile(r"[A-Za-z]:\\[^\\\"'\r\n]*"
                  r"|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}"
                  r"|-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----")
for base, _d, files in os.walk(DEST):
    for fn in files:
        p = os.path.join(base, fn)
        if fn.lower().endswith((".mp4", ".exe", ".webp", ".png", ".jpg")):
            continue
        raw = open(p, "rb").read()
        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError:
            check(False, f"{fn} is not valid UTF-8")
            continue
        m = pat.search(text)
        check(m is None, f"{fn} clean" + (f" (found {m.group(0)!r})" if m else ""))

print("7) scripts that PowerShell 5.1 must read carry a BOM")
# PowerShell 5.1 misreads a BOM-less UTF-8 file only when it contains Chinese text.
# Scripts that are pure ASCII need no BOM; ones with Chinese must have exactly one.
for rel in ("skin/skin-setup.ps1", "skin/guard.ps1", "scripts/integrate-entrypoints.ps1",
            "scripts/install-start-menu.ps1", "scripts/Import-Animation.ps1", "使用说明.txt"):
    raw = open(os.path.join(DEST, rel), "rb").read()
    text = raw.decode("utf-8-sig")
    has_cn = bool(re.search(r"[\u4e00-\u9fff]", text))
    has_bom = raw[:3] == b"\xef\xbb\xbf"
    if has_cn:
        check(has_bom, f"{rel} has Chinese text and carries a UTF-8 BOM")
    else:
        check(not has_bom, f"{rel} is pure ASCII (BOM not required)")

print("8) the zip is portable and complete")
z = zipfile.ZipFile(ZIP)
names = z.namelist()
check(all("\\" not in n for n in names), "all zip entries use forward slashes")
check(all(n.startswith(NAME + "/") for n in names), "all entries live under one top folder")
on_disk = set()
for base, _d, files in os.walk(DEST):
    for fn in files:
        on_disk.add(f"{NAME}/" + os.path.relpath(os.path.join(base, fn), DEST).replace(os.sep, "/"))
check(set(names) == on_disk, f"zip holds exactly the {len(on_disk)} packaged files")
bad = z.testzip()
check(bad is None, "zip passes CRC check")
z.close()

print()
if fails:
    print(f"FAILED ({len(fails)}):")
    for f in fails:
        print("  - " + f)
    sys.exit(1)
print("PASS: package is current, self-consistent and portable.")
