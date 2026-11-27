import React from "react";
import { Img, staticFile } from "remotion";
import { E, H, W, ramp, seeded } from "./T";

const hw = (p: string) => staticFile(`hw/${p}`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };

/** Moonlit violet sky with slow drifting mist. */
export const NightWorld: React.FC<{ t: number }> = ({ t }) => {
  const z = 1.04 + 0.025 * Math.sin(t * 0.35);
  return (
    <>
      <Img src={hw("bg_night.jpg")} style={{ ...full, objectFit: "cover", transform: `scale(${z})` }} />
      <Img
        src={hw("mist.png")}
        style={{ position: "absolute", left: -420 + 26 * t, top: 700, width: 2600, height: 1114, opacity: 0.22 }}
      />
      <Img
        src={hw("mist.png")}
        style={{ position: "absolute", left: 300 - 34 * t, top: 820, width: 2200, height: 943, opacity: 0.16, transform: "scaleX(-1)" }}
      />
    </>
  );
};

// sprite sheets cut from the generated art (see film/public/hw)
const CANDLES = [
  { f: "candle_1.png", w: 164 },
  { f: "candle_2.png", w: 124 },
  { f: "candle_3.png", w: 127 },
  { f: "candle_4.png", w: 154 },
  { f: "candle_5.png", w: 105 },
];

/** Floating candles drifting at different depths; flames breathe. */
export const Candles: React.FC<{ t: number; t0: number; t1: number; set: Array<{ x: number; y: number; s: number; i: number; blur?: number }> }> = ({ t, t0, t1, set }) => {
  if (t < t0 || t > t1) return null;
  const a = ramp(t, t0, t0 + 0.5, E.soft) * (1 - ramp(t, t1 - 0.3, t1));
  return (
    <>
      {set.map((c, k) => {
        const sp = CANDLES[c.i % CANDLES.length];
        const h = 420 * c.s;
        const w = sp.w * c.s;
        const bob = Math.sin(t * 1.3 + k * 1.7) * 12 * c.s;
        const rise = (1 - ramp(t, t0 + k * 0.08, t0 + 0.9 + k * 0.08, E.out)) * 60;
        const flick = 0.82 + 0.18 * Math.sin(t * 23 + k * 3.1) * Math.sin(t * 7.3 + k);
        return (
          <div key={k} style={{ position: "absolute", left: c.x - w / 2, top: c.y - h / 2 + bob + rise, width: w, height: h, opacity: a, filter: c.blur ? `blur(${c.blur}px)` : undefined }}>
            <div
              style={{
                position: "absolute", left: w / 2 - 70 * c.s, top: -40 * c.s, width: 140 * c.s, height: 140 * c.s, borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(255,196,110,0.55), rgba(255,138,31,0.12) 55%, rgba(255,138,31,0))",
                opacity: flick, mixBlendMode: "screen",
              }}
            />
            <Img src={hw(sp.f)} style={{ width: w, height: h, display: "block" }} />
          </div>
        );
      })}
    </>
  );
};

const GHOSTS = ["ghost_1.png", "ghost_2.png", "ghost_3.png", "ghost_4.png", "ghost_5.png"];
const GHOST_W = [273, 285, 260, 263, 226];

/** Little ghosts bobbing in and out at the edges. */
export const Ghosts: React.FC<{ t: number; t0: number; t1: number; set: Array<{ x: number; y: number; s: number; i: number; dx?: number; op?: number }> }> = ({ t, t0, t1, set }) => {
  if (t < t0 || t > t1) return null;
  return (
    <>
      {set.map((g, k) => {
        const a = ramp(t, t0 + k * 0.15, t0 + 0.5 + k * 0.15, E.soft) * (1 - ramp(t, t1 - 0.35, t1));
        const h = 300 * g.s;
        const w = GHOST_W[g.i] * g.s;
        const y = g.y + Math.sin(t * 2.1 + k * 2.3) * 16 * g.s;
        const x = g.x + (g.dx ?? 0) * (t - t0);
        return (
          <Img
            key={k}
            src={hw(GHOSTS[g.i])}
            style={{
              position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: a * (g.op ?? 0.86),
              transform: `rotate(${Math.sin(t * 1.7 + k) * 6}deg)`, filter: "drop-shadow(0 0 18px rgba(217,200,255,0.45))",
            }}
          />
        );
      })}
    </>
  );
};

const PUMPKINS = [
  { f: "pumpkin_1.png", w: 343 },
  { f: "pumpkin_2.png", w: 226 },
  { f: "pumpkin_3.png", w: 469 },
];

/** A jack-o'-lantern with a breathing inner glow. */
export const Pumpkin: React.FC<{ i: number; x: number; y: number; h: number; t: number; op?: number; blur?: number; rot?: number }> = ({ i, x, y, h, t, op = 1, blur, rot = 0 }) => {
  const p = PUMPKINS[i % PUMPKINS.length];
  const w = (p.w / 420) * h;
  const glow = 0.75 + 0.25 * Math.sin(t * 9 + i * 2) * Math.sin(t * 3.7 + i);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: op, filter: blur ? `blur(${blur}px)` : undefined, transform: `rotate(${rot}deg)` }}>
      <div
        style={{
          position: "absolute", left: -w * 0.35, top: -h * 0.2, width: w * 1.7, height: h * 1.5, borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,138,31,0.42), rgba(255,138,31,0))", opacity: glow, mixBlendMode: "screen",
        }}
      />
      <Img src={hw(p.f)} style={{ width: w, height: h, display: "block" }} />
    </div>
  );
};

/** Embers rising from below — warm specks that drift and fade. */
export const Embers: React.FC<{ t: number; t0: number; t1: number; n?: number; seed?: number; cx?: number; spread?: number }> = ({ t, t0, t1, n = 40, seed = 3, cx = W / 2, spread = W }) => {
  if (t < t0 || t > t1) return null;
  const a = ramp(t, t0, t0 + 0.4) * (1 - ramp(t, t1 - 0.4, t1));
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: a, mixBlendMode: "screen" }}>
      {Array.from({ length: n }, (_, i) => {
        const r1 = seeded(seed + i * 1.37), r2 = seeded(seed + i * 4.11), r3 = seeded(seed + i * 8.3);
        const life = 2.2 + 1.6 * r2;
        const age = ((t - t0) + r1 * life) % life;
        const k = age / life;
        const x = cx + (r3 - 0.5) * spread + Math.sin((t + i) * 1.3) * 18;
        const y = H + 20 - k * (H * 0.9) * (0.7 + 0.6 * r1);
        const s = 1.2 + 2.4 * r2;
        const o = Math.sin(Math.PI * k) * (0.5 + 0.5 * r3);
        return <circle key={i} cx={x} cy={y} r={s} fill={r3 > 0.75 ? "#ffd7ad" : "#ff9e45"} opacity={o} />;
      })}
    </svg>
  );
};
