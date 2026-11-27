# -*- coding: utf-8 -*-
"""Dev client for the skin loader's cmd/ channel (works only while skin.json has "dev": true).

python skinctl.py list
python skinctl.py eval "<js expression>"        [--target <webContentsId>]
python skinctl.py evalf <file.js>               [--target <webContentsId>]
python skinctl.py capture <out.png>             [--target <webContentsId>]
python skinctl.py reload
"""
import json, os, sys, time, uuid

sys.stdout.reconfigure(encoding="utf-8")
# The cmd channel lives in the installed launcher package. Override with the
# MC_SKIN_CMD environment variable when working outside the default layout.
CMD = os.environ.get("MC_SKIN_CMD") or os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "launcher", "build", "MiniMaxCodeBoot", "skin", "cmd")


def send(op, timeout=30, **kw):
    os.makedirs(CMD, exist_ok=True)
    name = f"c{uuid.uuid4().hex[:10]}"
    tmp = os.path.join(CMD, name + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"op": op, **kw}, f, ensure_ascii=False)
    os.replace(tmp, os.path.join(CMD, name + ".json"))
    res = os.path.join(CMD, name + ".result.json")
    t0 = time.time()
    while time.time() - t0 < timeout:
        if os.path.exists(res):
            time.sleep(0.05)
            with open(res, encoding="utf-8") as f:
                r = json.load(f)
            os.remove(res)
            return r
        time.sleep(0.1)
    return {"ok": False, "error": "timeout (is MiniMax Code running with the skin loader and dev=true?)"}


if __name__ == "__main__":
    a = sys.argv[1:]
    kw = {}
    out = None
    if "--out" in a:
        i = a.index("--out")
        out = a[i + 1]
        del a[i:i + 2]
    if "--target" in a:
        i = a.index("--target")
        kw["target"] = int(a[i + 1])
        del a[i:i + 2]
    op = a[0]
    if op == "eval":
        r = send("eval", js=a[1], **kw)
    elif op == "evalf":
        r = send("eval", js=open(a[1], encoding="utf-8").read(), **kw)
    elif op == "capture":
        r = send("capture", out=os.path.abspath(a[1]), **kw)
    else:
        r = send(op, **kw)
    if out:
        with open(out, "w", encoding="utf-8") as f:
            json.dump(r, f, ensure_ascii=False, indent=1)
        print(f"ok={r.get('ok')} -> {out}")
    else:
        print(json.dumps(r, ensure_ascii=False, indent=1)[:20000])
