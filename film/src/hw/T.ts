import timing from "./timing.json";
import { lerp, smooth } from "../T";

export { E, clamp01, lerp, ramp, seeded, smooth, spring01 } from "../T";

export const TM = timing;
export const FPS = timing.fps;
export const W = 1920;
export const H = 1080;

/** Beat k of the 120 BPM score (music time == film time). */
export const beat = (k: number) => timing.beat0 + k * (60 / timing.bpm);

// Night palette: the character's pink / wine / cream + pumpkin, plum and moonlight.
// The `ui` and `code` sets mirror the Halloween skin installed in the live client.
export const HC = {
  night: "#130e19",
  plum: "#2a1a3d",
  violet: "#7b3fe0",
  lavender: "#d9c8ff",
  moon: "#efe6ff",
  pumpkin: "#ff8a1f",
  pumpkinHi: "#ffb066",
  ember: "#ffc285",
  pink: "#f49ab8",
  wine: "#8e1f45",
  ui: {
    side: "#130e19",
    main: "#130e19",
    card: "#261c31",
    line: "#ece0ff12",
    border: "#ece0ff15",
    text: "#eee5f5",
    sub: "#9d8db2",
    muted: "#6f5f84",
    faint: "#4b3d5c",
    sel: "#2e2140",
    chip: "#1b1423",
  },
  code: {
    kw: "#ff9e45",
    str: "#8be04e",
    fn: "#c29ff0",
    num: "#ffb066",
    com: "#6f5f84",
    txt: "#eee5f5",
    add: "#04b54b",
    del: "#f73646",
  },
};

/** Window rectangle in video pixels during the handoff. The launcher eases the progress once for
 * the live thumbnail's opacity and again inside Geometry.Dest for its rectangle, so the drawn window
 * follows smooth(smooth(u)) to sit exactly under the live client on every frame. */
export const windowRect = (t: number) => {
  const w0 = timing.window;
  const a = smooth(smooth((t - timing.transitionStart) / (timing.transitionEnd - timing.transitionStart)));
  return {
    x: lerp(w0.x * W, 0, a),
    y: lerp(w0.y * H, 0, a),
    k: lerp(w0.w, 1, a),
    a,
  };
};
