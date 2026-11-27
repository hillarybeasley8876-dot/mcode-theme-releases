import { Easing, interpolate } from "remotion";
import timing from "./timing.json";

export const TM = timing;
export const FPS = timing.fps;
export const W = 1920;
export const H = 1080;

// Palette: character sheet (pink / wine / black / cream / tea-gold) + the real app's UI greys.
export const C = {
  cream: "#F3E6D8",
  ivory: "#FBF6F0",
  wine: "#8E1F45",
  rose: "#C2416F",
  pink: "#F49AB8",
  blush: "#FBD3DF",
  ink: "#241A1F",
  gold: "#B8916A",
  ui: {
    side: "#FAFAFA",
    line: "#F0F0F0",
    border: "#ECECEC",
    main: "#FFFFFF",
    text: "#171717",
    muted: "#ADADAD",
    sub: "#666666",
    sel: "#F0F0F0",
  },
  code: {
    kw: "#A3245A",
    str: "#9A6A2F",
    fn: "#1F6FEB",
    num: "#C2416F",
    com: "#ADADAD",
    txt: "#171717",
    add: "#1A7F37",
    del: "#CF222E",
  },
};

export const FONT = {
  ui: '"Segoe UI", "MiSans", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif',
  cjk: '"MiSans", "Microsoft YaHei UI", sans-serif',
  mono: '"JetBrains Mono", "Cascadia Mono", monospace',
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

// Shared easing vocabulary — every move in the film uses one of these.
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out: arrivals
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera / layout moves
  in: Easing.bezier(0.55, 0, 0.9, 0.3), // departures
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};

/** Map time t through [a,b] -> [0,1] with an easing (clamped). */
export const ramp = (t: number, a: number, b: number, ease: (x: number) => number = E.out) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Damped spring response (0 -> 1 with overshoot), time in seconds since start. */
export const spring01 = (dt: number, freq = 2.2, damp = 0.42) => {
  if (dt <= 0) return 0;
  const w = 2 * Math.PI * freq;
  return 1 - Math.exp(-damp * w * dt) * Math.cos(w * Math.sqrt(1 - damp * damp) * dt);
};

/** Window rectangle in video pixels. Before the handoff it is the fixed floating window; during
 * [transitionStart, transitionEnd] it grows with the same smoothstep the launcher uses for the
 * live DWM thumbnail, so the real client lands exactly on top of the drawn one. */
export const windowRect = (t: number) => {
  const w0 = timing.window;
  const a = smooth((t - timing.transitionStart) / (timing.transitionEnd - timing.transitionStart));
  return {
    x: lerp(w0.x * W, 0, a),
    y: lerp(w0.y * H, 0, a),
    k: lerp(w0.w, 1, a),
    a,
  };
};

export const seeded = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
