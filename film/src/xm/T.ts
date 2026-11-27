import timing from "./timing.json";
import { lerp, smooth } from "../T";

export { E, clamp01, lerp, ramp, seeded, smooth, spring01 } from "../T";

export const TM = timing;
export const FPS = timing.fps;
export const W = 1920;
export const H = 1080;

/** Beat k of the 97.8 BPM score (music time == film time); every cue in timing.json sits on one. */
export const beat = (k: number) => timing.beat0 + k * (60 / timing.bpm);

/** Typing of the opening prompt: first keystroke and the gap between keystrokes (shared by picture and sound). */
export const TYPE_T0 = 0.36;
export const CHAR_DT = 0.045;

// Christmas Eve palette: the navy of the forest sky, candle gold, holly red, and the character's pink.
// The `ui` and `code` sets mirror the Christmas skin installed in the live client (skin-dev/build_xm_css.py).
export const XC = {
  night: "#07131f",
  navy: "#0c1b2a",
  deep: "#132638",
  gold: "#f2b84b",
  goldHi: "#ffd98a",
  goldLo: "#e3a22c",
  candle: "#ffe9b0",
  red: "#e5484d",
  coral: "#ff8f7a",
  berry: "#b3262e",
  pine: "#1f6b4f",
  aurora: "#49e0a8",
  snow: "#f0efe9",
  ice: "#e3eeff",
  pink: "#f49ab8",
  wine: "#8e1f45",
  ui: {
    side: "#07131f",
    main: "#07131f",
    card: "#132638",
    line: "#e3eeff0a",
    border: "#e3eeff12",
    text: "#f0efe9",
    sub: "#8ba2b6",
    muted: "#5a7790",
    faint: "#34506a",
    sel: "#17324c",
    chip: "#0c1b2a",
  },
  code: {
    kw: "#ff8f7a",
    str: "#8fe3b0",
    fn: "#ffd98a",
    num: "#f7c259",
    com: "#5a7790",
    txt: "#f0efe9",
    add: "#04b54b",
    del: "#f73646",
  },
};

/** Window rectangle in video pixels. The film grows its own window to the full frame first
 * (growStart..growEnd); only then does the launcher dissolve the live client in, in place
 * (transitionStart..transitionEnd, ScreenFrames = the full frame). Nothing moves during the dissolve, so the
 * launcher's timer and the video's frames cannot drift apart and double-expose the small UI. */
export const windowRect = (t: number) => {
  const w0 = timing.window;
  const a = smooth(smooth((t - timing.growStart) / (timing.growEnd - timing.growStart)));
  return {
    x: lerp(w0.x * W, 0, a),
    y: lerp(w0.y * H, 0, a),
    k: lerp(w0.w, 1, a),
    a,
  };
};
