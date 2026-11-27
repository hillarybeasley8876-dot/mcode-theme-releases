# -*- coding: utf-8 -*-
"""Christmas edition: stamp the installed launcher and assemble the shareable package.

    python make_xm_package.py <startup video (full range)> <film mp4 for sharing>

  1. updates launcher/build/MiniMaxCodeBoot (the launcher the desktop shortcut points at):
       media/startup.xm.mp4, launcher.xm.json (timing straight from film/src/xm/timing.json),
       launcher.json, skin/skin-setup.ps1, the .cmd helpers, 使用说明.txt
     Each theme keeps its own launcher.<theme>.json and video, so switching themes swaps the
     boot film, its handoff timing and the client skin together.
  2. builds deliver/xm/MiniMaxCodeBoot-圣诞节版/ (+ .zip): the Christmas theme only, no machine state.
"""
import json, os, shutil, sys, zipfile

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD = os.path.join(ROOT, "launcher", "build", "MiniMaxCodeBoot")
PKG_SRC = os.path.join(HERE, "pkg")
OUT_DIR = os.path.join(ROOT, "deliver", "xm")
NAME = "MiniMaxCodeBoot-圣诞节版"
DEST = os.path.join(OUT_DIR, NAME)
OLD = os.path.join(ROOT, ".cache", "old_xm", "build_old")
BS = chr(92)

NIGHT, GOLD, DEEP = "#07131F", "#F2B84B", "#132638"


def launcher_config(timing_file, video, background, accent, skip_bg):
    """Same fields as film/export-launcher.mjs, plus the theme's colours and the pre-launch skin guard."""
    T = json.load(open(timing_file, encoding="utf-8"))
    # The Christmas film brings its window to the full frame by itself before the handoff, so the live
    # client is dissolved in over the whole frame, in place (see windowRect in film/src/xm/T.ts).
    frame = {"X": 0, "Y": 0, "Width": 1, "Height": 1}
    return {
        "AutoReplaceEntrypoints": False,
        "ScanAllLocalDrives": False,
        "Video": video,
        "AppLaunch": "shell:AppsFolder" + BS + "com.minimax.agent.cn",
        "ProcessPathContains": BS + "MiniMax Code" + BS,
        "OfficialExecutable": "%LOCALAPPDATA%" + BS + "Programs" + BS + "MiniMax Code" + BS + "MiniMax Code.exe",
        "ProcessNames": ["MiniMax Code"],
        "HoldAt": T["holdAt"],
        "TransitionStart": T["transitionStart"],
        "TransitionEnd": T["transitionEnd"],
        "MaxWaitSeconds": 60,
        "Volume": 1,
        "PlayerWidth": 1920,
        "PlayerHeight": 1080,
        "MatchClientToPlayer": True,
        "ScreenFrames": [{"Time": T["transitionStart"], **frame}, {"Time": T["transitionEnd"], **frame}],
        "DisplayName": "MiniMax Code",
        "Background": background,
        "Accent": accent,
        "SkipBackground": skip_bg,
        "PreLaunchScript": "skin/guard.ps1",
        "PreLaunchTimeout": 15,
    }


def write_json(path, obj):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        f.write("\n")


def write_ps1(src, dst):
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
    "切换到圣诞节主题.cmd": cmd_text(SETUP, "-Action Theme -Theme xm"),
    "切换到万圣节主题.cmd": cmd_text(SETUP, "-Action Theme -Theme hw"),
    "切换到原版界面.cmd": cmd_text(SETUP, "-Action Theme -Theme oct"),
    "安装到快捷方式.cmd": cmd_text(LINKS, '-Action Install -AppRoot "%~dp0."'),
    "恢复原快捷方式.cmd": cmd_text(LINKS, '-Action Restore -AppRoot "%~dp0."'),
}
# helpers written by earlier editions; their names promise one theme but they all ran the same script
STALE = [
    "安装万圣节皮肤.cmd", "卸载万圣节皮肤.cmd", "打开万圣节皮肤.cmd", "关闭万圣节皮肤.cmd", "切换万圣节皮肤.cmd",
    "安装圣诞节皮肤.cmd", "卸载圣诞节皮肤.cmd", "打开圣诞节皮肤.cmd", "关闭圣诞节皮肤.cmd",
    "boot.mp4", "timing.json", "media/startup.mp4",
]


def stamp_build(startup):
    os.makedirs(OLD, exist_ok=True)
    for rel in STALE:
        p = os.path.join(BUILD, rel)
        if os.path.exists(p):
            shutil.move(p, os.path.join(OLD, rel.replace("/", "_")))
    shutil.copy2(startup, os.path.join(BUILD, "media", "startup.xm.mp4"))
    xm = launcher_config(os.path.join(ROOT, "film", "src", "xm", "timing.json"), "media/startup.xm.mp4", NIGHT, GOLD, DEEP)
    write_json(os.path.join(BUILD, "launcher.xm.json"), xm)
    write_json(os.path.join(BUILD, "launcher.json"), xm)
    # the two older themes: same settings as before, each pointing at its own video file
    for name, video in (("hw", "media/startup.hw.mp4"), ("oct", "media/startup.oct-v3.mp4")):
        p = os.path.join(BUILD, f"launcher.{name}.json")
        cfg = json.load(open(p, encoding="utf-8-sig"))
        assert os.path.exists(os.path.join(BUILD, video)), video
        cfg["Video"] = video
        write_json(p, cfg)
    write_ps1(os.path.join(PKG_SRC, "skin-setup.ps1"), os.path.join(BUILD, "skin", "skin-setup.ps1"))
    for name, body in CMDS.items():
        with open(os.path.join(BUILD, name), "w", encoding="ascii", newline="") as f:
            f.write(body)
    write_ps1(os.path.join(PKG_SRC, "使用说明.txt"), os.path.join(BUILD, "使用说明.txt"))  # BOM + CRLF, for any Notepad
    return xm


PACKAGE_FILES = [
    "MiniMaxCodeBoot.exe", "launcher.json", "launcher.xm.json", "使用说明.txt",
    "安装皮肤.cmd", "卸载皮肤.cmd", "打开皮肤.cmd", "关闭皮肤.cmd", "切换到圣诞节主题.cmd", "安装到快捷方式.cmd", "恢复原快捷方式.cmd",
    "media/startup.xm.mp4",
    "scripts/integrate-entrypoints.ps1", "scripts/install-start-menu.ps1", "scripts/Import-Animation.ps1",
    "skin/loader.js", "skin/preload.js", "skin/christmas.css", "skin/patch-asar.js", "skin/guard.ps1", "skin/skin-setup.ps1",
]


def build_package(film):
    if os.path.exists(DEST):
        shutil.rmtree(DEST)
    for rel in PACKAGE_FILES:
        dst = os.path.join(DEST, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(BUILD, rel), dst)
    for rel in ("LICENSE", "THIRD_PARTY_NOTICES.md"):
        shutil.copy2(os.path.join(ROOT, "launcher", rel), os.path.join(DEST, rel))
    # a clean switch file: Christmas skin on, dev channel off
    write_json(os.path.join(DEST, "skin", "skin.json"), {"enabled": True, "css": "christmas.css", "night": NIGHT, "forceDark": True, "dev": False})
    shutil.copy2(film, os.path.join(OUT_DIR, "MiniMaxCode_圣诞节开屏动画.mp4"))
    zpath = os.path.join(OUT_DIR, NAME + ".zip")
    if os.path.exists(zpath):
        os.remove(zpath)
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for base, _dirs, files in os.walk(DEST):
            for fn in files:
                full = os.path.join(base, fn)
                z.write(full, os.path.join(NAME, os.path.relpath(full, DEST)))
    n = sum(len(fs) for _b, _d, fs in os.walk(DEST))
    size = sum(os.path.getsize(os.path.join(b, f)) for b, _d, fs in os.walk(DEST) for f in fs)
    print(f"package: {DEST} ({size / 1e6:.1f} MB, {n} files)")
    print(f"zip: {zpath} ({os.path.getsize(zpath) / 1e6:.1f} MB)")


if __name__ == "__main__":
    startup, film = sys.argv[1], sys.argv[2]
    cfg = stamp_build(startup)
    print("launcher.xm.json:", {k: cfg[k] for k in ("Video", "HoldAt", "TransitionStart", "TransitionEnd", "Background")})
    build_package(film)
