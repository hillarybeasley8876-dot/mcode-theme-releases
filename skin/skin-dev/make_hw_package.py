# -*- coding: utf-8 -*-
"""Halloween edition: assemble the shareable package and zip it.

    python make_hw_package.py

Builds deliver/hw/MiniMaxCodeBoot-万圣节版/ (+ .zip) from the current launcher build
(launcher/build/MiniMaxCodeBoot), so the Halloween package carries every fix the
Christmas edition received on 11-11 / 11-12:

  * MiniMaxCodeBoot.exe  — the 11-12 handoff fix (the client window no longer flashes
    the video's last frame for one frame while the real window is brought to the front)
  * skin/loader.js       — per-theme "night" colour (skin.json) instead of a hard-coded one
  * skin/skin-setup.ps1  — theme switching (-Action Theme -Theme xm|hw|oct), and it now
    also removes the older "万圣节皮肤守护" / "圣诞节皮肤守护" scheduled tasks on install
  * skin/guard.vbs       — the scheduled task's silent runner

The package ships the Halloween theme only, with no machine state: launcher.hw.json
keeps the Halloween boot film, its handoff timing and the Halloween palette, and
skin.json starts on halloween.css with the dev channel off.
"""
import json
import os
import shutil
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD = os.path.join(ROOT, "launcher", "build", "MiniMaxCodeBoot")
PKG_SRC = os.path.join(HERE, "pkg")
OUT_DIR = os.path.join(ROOT, "deliver", "hw")
NAME = "MiniMaxCodeBoot-万圣节版"
DEST = os.path.join(OUT_DIR, NAME)
BS = chr(92)

NIGHT, PUMPKIN, PLUM = "#140F1B", "#FF8A1F", "#130E19"
SKIP_PLUM = "#261C31"


def write_json(path, obj):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        f.write("\n")


def write_text(src, dst):
    """Windows PowerShell 5.1 reads a script with Chinese text correctly only as UTF-8 with ONE BOM."""
    text = open(src, encoding="utf-8-sig").read().replace("\r\n", "\n").replace("\n", "\r\n")
    with open(dst, "w", encoding="utf-8-sig", newline="") as f:
        f.write(text)


def cmd_text(target, args):
    lines = ["@echo off", 'cd /d "%~dp0"', f'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0{target}" {args}', "echo.", "pause"]
    return "\r\n".join(lines) + "\r\n"


SETUP = "skin" + BS + "skin-setup.ps1"
LINKS = "scripts" + BS + "integrate-entrypoints.ps1"
CMDS = {
    "安装皮肤.cmd": cmd_text(SETUP, "-Action Install"),
    "卸载皮肤.cmd": cmd_text(SETUP, "-Action Uninstall"),
    "打开皮肤.cmd": cmd_text(SETUP, "-Action On"),
    "关闭皮肤.cmd": cmd_text(SETUP, "-Action Off"),
    "切换到万圣节主题.cmd": cmd_text(SETUP, "-Action Theme -Theme hw"),
    "安装到快捷方式.cmd": cmd_text(LINKS, '-Action Install -AppRoot "%~dp0."'),
    "恢复原快捷方式.cmd": cmd_text(LINKS, '-Action Restore -AppRoot "%~dp0."'),
}

PACKAGE_FILES = [
    "MiniMaxCodeBoot.exe", "launcher.json", "launcher.hw.json", "使用说明.txt",
    "安装皮肤.cmd", "卸载皮肤.cmd", "打开皮肤.cmd", "关闭皮肤.cmd", "切换到万圣节主题.cmd",
    "安装到快捷方式.cmd", "恢复原快捷方式.cmd",
    "media/startup.hw.mp4",
    "scripts/integrate-entrypoints.ps1", "scripts/install-start-menu.ps1", "scripts/Import-Animation.ps1",
    "skin/loader.js", "skin/preload.js", "skin/halloween.css", "skin/patch-asar.js",
    "skin/guard.ps1", "skin/skin-setup.ps1",
]
# skin/guard.vbs is NOT shipped: it is a scheduled-task runner that skin-setup.ps1 writes
# on install with this machine's absolute path, so it is machine state, not package content.


def build_package():
    if os.path.exists(DEST):
        shutil.rmtree(DEST)
    for rel in PACKAGE_FILES:
        src = os.path.join(BUILD, rel)
        if not os.path.exists(src):
            raise SystemExit("missing from the launcher build: " + rel)
        dst = os.path.join(DEST, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
    for rel in ("LICENSE", "THIRD_PARTY_NOTICES.md"):
        shutil.copy2(os.path.join(ROOT, "launcher", rel), os.path.join(DEST, rel))
    # the usage notes are written for this theme
    write_text(os.path.join(PKG_SRC, "使用说明-hw.txt"), os.path.join(DEST, "使用说明.txt"))
    # the .cmd helpers are generated, not copied
    for name, body in CMDS.items():
        with open(os.path.join(DEST, name), "w", encoding="ascii", newline="") as f:
            f.write(body)
    # a clean switch file: Halloween skin on, dev channel off
    write_json(os.path.join(DEST, "skin", "skin.json"),
               {"enabled": True, "css": "halloween.css", "night": NIGHT, "forceDark": True, "dev": False})
    # The build's launcher.json carries whichever theme is currently installed, so the package
    # gets the Halloween one for both names: launcher.json is what the launcher reads,
    # launcher.hw.json is what "-Action Theme -Theme hw" copies over it.
    hw = json.load(open(os.path.join(DEST, "launcher.hw.json"), encoding="utf-8-sig"))
    write_json(os.path.join(DEST, "launcher.json"), hw)
    write_json(os.path.join(DEST, "launcher.hw.json"), hw)
    # launcher.json must point at the Halloween film, and carry the Halloween palette
    cfg = json.load(open(os.path.join(DEST, "launcher.json"), encoding="utf-8-sig"))
    assert cfg["Video"] == "media/startup.hw.mp4", cfg["Video"]
    assert cfg["Background"].upper() == PLUM.upper(), cfg["Background"]
    assert cfg["Accent"].upper() == PUMPKIN.upper(), cfg["Accent"]
    assert cfg["SkipBackground"].upper() == SKIP_PLUM.upper(), cfg["SkipBackground"]
    assert cfg["PreLaunchScript"] == "skin/guard.ps1", cfg
    for rel in ("media/startup.hw.mp4", "skin/halloween.css", "skin/skin-setup.ps1"):
        if not os.path.exists(os.path.join(DEST, rel)):
            raise SystemExit("packaged file missing: " + rel)
    zpath = os.path.join(OUT_DIR, NAME + ".zip")
    if os.path.exists(zpath):
        os.remove(zpath)
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for base, _dirs, files in os.walk(DEST):
            for fn in files:
                full = os.path.join(base, fn)
                rel = os.path.relpath(full, DEST).replace(os.sep, "/")
                z.write(full, f"{NAME}/{rel}")
    n = sum(len(fs) for _b, _d, fs in os.walk(DEST))
    size = sum(os.path.getsize(os.path.join(b, f)) for b, _d, fs in os.walk(DEST) for f in fs)
    print(f"package: {DEST} ({size / 1e6:.1f} MB, {n} files)")
    print(f"zip: {zpath} ({os.path.getsize(zpath) / 1e6:.1f} MB)")
    return zpath


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    build_package()
