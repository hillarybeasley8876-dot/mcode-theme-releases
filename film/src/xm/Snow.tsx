import React from "react";
import { E, H, W, lerp, ramp, seeded } from "./T";

/** A six-armed snow crystal, drawn in vector so it stays crisp at any size. */
export const Flake: React.FC<{ size: number; color?: string; w?: number; style?: React.CSSProperties }> = ({ size, color = "#eef6ff", w = 1.4, style }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block", overflow: "visible", ...style }}>
    <g stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {[0, 60, 120].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0-10.6V10.6M-3.1-7.4 0-4.6 3.1-7.4M-3.1 7.4 0 4.6 3.1 7.4M-1.9-9.9 0-8.4 1.9-9.9M-1.9 9.9 0 8.4 1.9 9.9" />
      ))}
    </g>
  </svg>
);

type Layer = { n: number; r: [number, number]; v: [number, number]; sway: number; op: [number, number]; blur: number; seed: number };

// far, middle and near snow: the near flakes are large, quick and out of focus
const LAYERS: Layer[] = [
  { n: 70, r: [1.0, 2.0], v: [38, 70], sway: 10, op: [0.35, 0.75], blur: 0, seed: 11 },
  { n: 34, r: [2.0, 3.6], v: [86, 140], sway: 22, op: [0.5, 0.9], blur: 0, seed: 37 },
  { n: 9, r: [7, 12], v: [230, 330], sway: 40, op: [0.22, 0.4], blur: 3, seed: 61 },
];

/** Steady snowfall leaning into a light wind. `back` is the far and middle snow; `front` is a handful of
 * large out-of-focus flakes that stay in the outer thirds of the frame, so they never cross the character. */
export const Snowfall: React.FC<{ t: number; op?: number; wind?: number; layer?: "back" | "front" }> = ({ t, op = 1, wind = -14, layer = "back" }) => {
  if (op <= 0.003) return null;
  const set = layer === "back" ? LAYERS.slice(0, 2) : LAYERS.slice(2);
  return (
    <>
      {set.map((L) => (
        <svg key={L.seed} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op, filter: L.blur ? `blur(${L.blur}px)` : undefined }}>
          <defs>
            <radialGradient id={`xmSnow${L.seed}`}>
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.6" stopColor="#eef6ff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#eef6ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: L.n }, (_, i) => {
            const r1 = seeded(L.seed + i * 1.37), r2 = seeded(L.seed + i * 4.11), r3 = seeded(L.seed + i * 8.3), r4 = seeded(L.seed + i * 2.9);
            const v = lerp(L.v[0], L.v[1], r2);
            const y = ((r1 * (H + 60) + v * t) % (H + 60)) - 30;
            const drift = wind * t * (0.6 + 0.8 * r4) + Math.sin(t * (0.7 + r4) + i) * L.sway;
            const x = layer === "back" ? (((r3 * W + drift) % W) + W) % W : (r3 < 0.5 ? r3 * 2 * 470 : 1450 + (r3 - 0.5) * 2 * 470) + drift * 0.5;
            return <circle key={i} cx={x} cy={y} r={lerp(L.r[0], L.r[1], r4)} fill={`url(#xmSnow${L.seed})`} opacity={lerp(L.op[0], L.op[1], r3)} />;
          })}
        </svg>
      ))}
    </>
  );
};

const soft = "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(238,246,255,0.55) 45%, rgba(238,246,255,0))";

/** Snow bursting out of a point toward the camera: crystals and soft flakes grow and speed up as they pass.
 * Nothing is drawn right at the source (that is where she stands). `fast` clears the frame sooner. */
export const SnowBurst: React.FC<{ t: number; t0: number; cx: number; cy: number; n?: number; seed?: number; big?: boolean; fast?: boolean }> = ({ t, t0, cx, cy, n = 16, seed = 7, big, fast }) => {
  if (t < t0 || t > t0 + 1.6) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r1 = seeded(seed + i * 3.1), r2 = seeded(seed + i * 7.7), r3 = seeded(seed + i * 1.9);
        const ang = (i / n) * Math.PI * 2 + (r1 - 0.5) * 0.7;
        const dist = 900 + 700 * r2;
        const ta = t0 + 0.012 * i + 0.05 * r1;
        const tb = t0 + (fast ? 0.5 : big ? 0.62 : 0.85) + (fast ? 0.28 : big ? 0.3 : 0.45) * r3;
        if (t < ta || t > tb) return null;
        const k = ramp(t, ta, tb, (x) => Math.pow(x, 1.3));
        const x = lerp(cx + Math.cos(ang) * 22, cx + Math.cos(ang) * dist * 1.25, k);
        const y = lerp(cy + Math.sin(ang) * 15, cy + Math.sin(ang) * dist * 0.8, k);
        const away = Math.min(1, Math.max(0, (Math.hypot(x - cx, y - cy) - 80) / 120));
        const s = lerp((big ? 34 : 18) + 12 * r3, (big ? 190 : fast ? 100 : 130) + (fast ? 150 : 220) * r2, Math.pow(k, 1.5));
        const op = Math.min(1, (t - ta) / 0.1) * (1 - ramp(t, tb - 0.14, tb)) * away;
        if (op <= 0.003) return null;
        const rot = (t - ta) * (70 + 150 * r1) * (i % 2 ? 1 : -1);
        if (i % 3 === 0)
          return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: soft, opacity: op * 0.9, filter: `blur(${1 + k * 5}px)` }} />;
        return (
          <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, opacity: op, transform: `rotate(${rot}deg)`, filter: `blur(${k * 2.6}px) drop-shadow(0 0 ${6 + 10 * k}px rgba(255,255,255,0.6))` }}>
            <Flake size={s} w={1.1 + 0.5 * (1 - k)} color={i % 4 === 1 ? "#ffe9b0" : "#f4f9ff"} />
          </div>
        );
      })}
    </>
  );
};

/** A gust of snow sweeping across the frame (right -> left) — wipes one shot into the next. Sharp crystals
 * ride only in the top and bottom bands; the middle of the frame gets soft puffs. */
export const SnowGust: React.FC<{ t: number; t0: number; dur?: number; n?: number; seed?: number }> = ({ t, t0, dur = 0.62, n = 26, seed = 31 }) => {
  if (t < t0 - 0.05 || t > t0 + dur + 0.4) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r1 = seeded(seed + i * 2.3), r2 = seeded(seed + i * 5.9), r3 = seeded(seed + i * 9.1);
        const y0 = -80 + (H + 160) * ((i + r1) / n);
        const s = 90 + 330 * r2;
        const ta = t0 + 0.22 * r1 - 0.05;
        const tb = t0 + dur * (0.75 + 0.5 * r3);
        if (t < ta || t > tb) return null;
        const k = ramp(t, ta, tb, E.inOut);
        const x = lerp(W + s * 0.9 + 260 * r3, -s * 1.4 - 300 * r1, k);
        const y = y0 + (r3 - 0.5) * 240 * k + Math.sin((t - ta) * 5 + i) * 10;
        const op = Math.min(1, (t - ta) / 0.03) * (1 - ramp(t, tb - 0.12, tb));
        if (i % 3 !== 1 || (y0 > 190 && y0 < 810))
          return <div key={i} style={{ position: "absolute", left: x - s * 1.3, top: y - s * 0.45, width: s * 2.6, height: s * 0.9, borderRadius: "50%", background: soft, opacity: op * 0.85, filter: "blur(6px)" }} />;
        return (
          <div key={i} style={{ position: "absolute", left: x - s * 0.3, top: y - s * 0.3, opacity: op, transform: `rotate(${(t - ta) * 260}deg)`, filter: "blur(1.5px) drop-shadow(0 0 10px rgba(255,255,255,0.7))" }}>
            <Flake size={s * 0.6} w={1.2} />
          </div>
        );
      })}
    </>
  );
};
