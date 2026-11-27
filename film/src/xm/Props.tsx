import React from "react";
import { Img, staticFile } from "remotion";
import { E, H, W, lerp, ramp, seeded, spring01 } from "./T";

const xm = (p: string) => staticFile(`xm/${p}`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };

/** Snowy forest under the aurora: a slow push-in and ground mist drifting through the trees. */
export const NightWorld: React.FC<{ t: number }> = ({ t }) => {
  const z = 1.04 + 0.02 * Math.sin(t * 0.35);
  return (
    <>
      <Img src={xm("bg_night.jpg")} style={{ ...full, objectFit: "cover", transform: `scale(${z})` }} />
      <Img src={xm("mist.png")} style={{ position: "absolute", left: -420 + 26 * t, top: 330, width: 2600, height: 1114, opacity: 0.3 }} />
      <Img src={xm("mist.png")} style={{ position: "absolute", left: 300 - 34 * t, top: 470, width: 2200, height: 943, opacity: 0.22, transform: "scaleX(-1)" }} />
    </>
  );
};

/** Santa's sleigh crossing the moon while the prompt is being typed (the moon sits at 1700,132 in frame). */
export const SleighFly: React.FC<{ t: number }> = ({ t }) => {
  const x = 1700 + 290 * (t - 0.78);
  if (x > 2020) return null;
  const y = 132 - 110.5 * (t - 0.78);
  const w = 150, h = (w * 110) / 240;
  return <Img src={xm("skin/xm_sleigh.svg")} style={{ position: "absolute", left: x - w * 0.52, top: y - h * 0.5, width: w, height: h, opacity: Math.min(1, t / 0.3) }} />;
};

// cut from the generated art (see film/public/xm); every ornament carries the top of its own thread
const ORNAMENTS = [
  { f: "ornament_1.png", w: 253 }, // red bauble
  { f: "ornament_2.png", w: 290 }, // star lantern
  { f: "ornament_3.png", w: 227 }, // green bauble with a bow
  { f: "ornament_4.png", w: 264 }, // sleigh bells and holly
  { f: "ornament_5.png", w: 197 }, // glass lantern
];

/** Baubles, bells and lanterns dropping in on their threads from the top edge, then swinging gently. */
export const Ornaments: React.FC<{ t: number; t0: number; t1: number; set: Array<{ x: number; len: number; s: number; i: number; blur?: number; d?: number }> }> = ({ t, t0, t1, set }) => {
  if (t < t0 || t > t1) return null;
  return (
    <>
      {set.map((o, k) => {
        const sp = ORNAMENTS[o.i % ORNAMENTS.length];
        const h = 460 * o.s;
        const w = sp.w * o.s;
        const dt = t - t0 - (o.d ?? k * 0.07);
        if (dt <= 0) return null;
        const drop = spring01(dt, 1.5, 0.55);
        const out = ramp(t, t1 - 0.35, t1, E.in);
        const y = lerp(-h - o.len - 20, 0, drop) - out * (h + o.len + 40);
        const swing = Math.sin(t * 1.6 + k * 1.9) * 3.2 + Math.exp(-dt * 2.2) * Math.sin(dt * 9) * 7;
        const flick = 0.8 + 0.2 * Math.sin(t * 9 + k * 3.1) * Math.sin(t * 3.3 + k);
        return (
          <div key={k} style={{ position: "absolute", left: o.x - w / 2, top: y, width: w, height: o.len + h, transformOrigin: "50% 0", transform: `rotate(${swing}deg)`, filter: o.blur ? `blur(${o.blur}px)` : undefined }}>
            <div style={{ position: "absolute", left: w / 2 - 0.75, top: -400, width: 1.5, height: 400 + o.len + 26 * o.s, background: "linear-gradient(to bottom, rgba(242,184,75,0.3), rgba(242,184,75,0.7))" }} />
            <div
              style={{
                position: "absolute", left: w / 2 - 150 * o.s, top: o.len + h * 0.62 - 150 * o.s, width: 300 * o.s, height: 300 * o.s, borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(255,214,130,0.5), rgba(242,184,75,0.12) 55%, rgba(242,184,75,0))", opacity: flick, mixBlendMode: "screen",
              }}
            />
            <Img src={xm(sp.f)} style={{ position: "absolute", left: 0, top: o.len, width: w, height: h }} />
          </div>
        );
      })}
    </>
  );
};

const SPRITES = ["sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png"];
const SPRITE_W = [473, 376, 387, 480, 396];

/** Little snow spirits popping in at the edges and bobbing about. */
export const Sprites: React.FC<{ t: number; t0: number; t1: number; set: Array<{ x: number; y: number; s: number; i: number; dx?: number; op?: number; flip?: boolean }> }> = ({ t, t0, t1, set }) => {
  if (t < t0 || t > t1) return null;
  return (
    <>
      {set.map((g, k) => {
        const dt = t - t0 - k * 0.15;
        if (dt <= 0) return null;
        const a = ramp(dt, 0, 0.3, E.soft) * (1 - ramp(t, t1 - 0.35, t1));
        const pop = 0.55 + 0.45 * spring01(dt, 2.0, 0.5);
        const h = 300 * g.s;
        const w = (SPRITE_W[g.i] / 480) * h;
        const y = g.y + Math.sin(t * 2.1 + k * 2.3) * 16 * g.s;
        const x = g.x + (g.dx ?? 0) * (t - t0);
        return (
          <Img
            key={k}
            src={xm(SPRITES[g.i])}
            style={{
              position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: a * (g.op ?? 0.92),
              transform: `scale(${g.flip ? -pop : pop}, ${pop}) rotate(${Math.sin(t * 1.7 + k) * 6}deg)`, filter: "drop-shadow(0 0 18px rgba(255,243,201,0.5))",
            }}
          />
        );
      })}
    </>
  );
};

const GIFTS = [
  { f: "gift_1.png", w: 451, h: 560 }, // red box, gold ribbon
  { f: "gift_2.png", w: 232, h: 560 }, // star lantern
  { f: "gift_3.png", w: 560, h: 497 }, // cream-and-green box
];

/** A present (or the star lantern) sitting in the snow, with a breathing candle glow. */
export const Gift: React.FC<{ i: number; x: number; y: number; h: number; t: number; op?: number; blur?: number; rot?: number }> = ({ i, x, y, h, t, op = 1, blur, rot = 0 }) => {
  const p = GIFTS[i % GIFTS.length];
  const w = (p.w / p.h) * h;
  const glow = 0.75 + 0.25 * Math.sin(t * 9 + i * 2) * Math.sin(t * 3.7 + i);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: op, filter: blur ? `blur(${blur}px)` : undefined, transform: `rotate(${rot}deg)` }}>
      <div
        style={{
          position: "absolute", left: -w * 0.4, top: -h * 0.2, width: w * 1.8, height: h * 1.5, borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(255,205,110,${i === 1 ? 0.5 : 0.3}), rgba(242,184,75,0))`, opacity: glow, mixBlendMode: "screen",
        }}
      />
      <Img src={xm(p.f)} style={{ width: w, height: h, display: "block" }} />
    </div>
  );
};

/** Gold dust drifting up through the scene — tiny warm specks that twinkle and fade. */
export const GoldDust: React.FC<{ t: number; t0: number; t1: number; n?: number; seed?: number; cx?: number; spread?: number }> = ({ t, t0, t1, n = 40, seed = 3, cx = W / 2, spread = W }) => {
  if (t < t0 || t > t1) return null;
  const a = ramp(t, t0, t0 + 0.4) * (1 - ramp(t, t1 - 0.4, t1));
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: a, mixBlendMode: "screen" }}>
      {Array.from({ length: n }, (_, i) => {
        const r1 = seeded(seed + i * 1.37), r2 = seeded(seed + i * 4.11), r3 = seeded(seed + i * 8.3);
        const life = 2.2 + 1.6 * r2;
        const age = (t - t0 + r1 * life) % life;
        const k = age / life;
        const x = cx + (r3 - 0.5) * spread + Math.sin((t + i) * 1.3) * 18;
        const y = H + 20 - k * (H * 0.9) * (0.7 + 0.6 * r1);
        const s = 1.2 + 2.4 * r2;
        const o = Math.sin(Math.PI * k) * (0.5 + 0.5 * r3) * (0.7 + 0.3 * Math.sin(t * 11 + i * 2.7));
        return <circle key={i} cx={x} cy={y} r={s} fill={r3 > 0.72 ? "#fff3cf" : "#f7c259"} opacity={o} />;
      })}
    </svg>
  );
};
