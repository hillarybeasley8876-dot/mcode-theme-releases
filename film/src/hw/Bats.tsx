import React from "react";
import { E, H, W, lerp, ramp, seeded } from "./T";

// One bat, drawn in vector so it stays crisp at any size. Wings hinge at the shoulders:
// `flap` is a phase in radians, the wing angle and foreshortening follow it.
const WING = "M4 -4 Q10 -14 20 -14 Q30 -16 38 -10 Q32 -5 34 0 Q27 -1 24 6 Q14 0 5 6 Z";
const EARS = "M-4.6 -10.5 L-6.4 -18.5 L-1.2 -12.2Z M4.6 -10.5 L6.4 -18.5 L1.2 -12.2Z";

export const Bat: React.FC<{ flap: number; size: number; rim?: number; eyes?: boolean; tone?: string }> = ({
  flap,
  size,
  rim = 0.3,
  eyes = true,
  tone = "#0d0814",
}) => {
  const a = 38 * Math.sin(flap);
  const sy = 0.72 + 0.28 * Math.cos(flap);
  const wing = `translate(4 -3) rotate(${-a}) scale(1 ${sy}) translate(-4 3)`;
  return (
    <svg width={size} height={size * 0.62} viewBox="-42 -26 84 52" style={{ overflow: "visible", display: "block" }}>
      <g fill={tone} stroke="#c9b3ff" strokeOpacity={rim} strokeWidth={0.9} strokeLinejoin="round">
        <path d={WING} transform={wing} />
        <path d={WING} transform={`scale(-1 1) ${wing}`} />
        <ellipse cx={0} cy={1} rx={5.6} ry={8.4} />
        <circle cx={0} cy={-8} r={5.2} />
        <path d={EARS} />
      </g>
      {eyes && (
        <g fill="#ff9e45">
          <circle cx={-2.1} cy={-8.4} r={1.05} />
          <circle cx={2.1} cy={-8.4} r={1.05} />
        </g>
      )}
    </svg>
  );
};

type Flight = { x0: number; y0: number; x1: number; y1: number; s0: number; s1: number; t0: number; t1: number; hz: number; ph: number; bank: number };

const place = (f: Flight, t: number, ease: (x: number) => number) => {
  const k = ramp(t, f.t0, f.t1, ease);
  const wob = Math.sin((t - f.t0) * 5.1 + f.ph) * 10 * (1 - k * 0.5);
  return {
    k,
    x: lerp(f.x0, f.x1, k),
    y: lerp(f.y0, f.y1, k) + wob,
    s: lerp(f.s0, f.s1, ease(k)),
    flap: (t - f.t0) * f.hz * 2 * Math.PI + f.ph,
  };
};

const FlightBat: React.FC<{ f: Flight; t: number; ease: (x: number) => number; blur?: number; fadeIn?: number; glow?: boolean }> = ({ f, t, ease, blur = 0, fadeIn = 0.12, glow }) => {
  if (t < f.t0 || t > f.t1) return null;
  const p = place(f, t, ease);
  const op = Math.min(1, (t - f.t0) / fadeIn) * (1 - ramp(t, f.t1 - 0.12, f.t1));
  return (
    <div
      style={{
        position: "absolute", left: p.x - p.s / 2, top: p.y - p.s * 0.31, opacity: op,
        transform: `rotate(${f.bank * (0.4 + 0.6 * p.k)}deg)`,
        filter: [blur > 0 ? `blur(${blur * p.k}px)` : "", glow ? "drop-shadow(0 0 10px rgba(255,138,31,0.55))" : ""].join(" ").trim() || undefined,
      }}
    >
      <Bat flap={p.flap} size={p.s} rim={0.22 + 0.2 * p.k} />
    </div>
  );
};

/** Bats bursting out of a point toward the camera (they grow and accelerate as they come close). */
export const BatBurst: React.FC<{ t: number; t0: number; cx: number; cy: number; n?: number; seed?: number; big?: boolean }> = ({ t, t0, cx, cy, n = 14, seed = 7, big }) => {
  if (t < t0 || t > t0 + 1.6) return null;
  const flights: Flight[] = Array.from({ length: n }, (_, i) => {
    const r1 = seeded(seed + i * 3.1), r2 = seeded(seed + i * 7.7), r3 = seeded(seed + i * 1.9);
    const ang = (i / n) * Math.PI * 2 + (r1 - 0.5) * 0.7;
    const dist = 900 + 700 * r2;
    return {
      x0: cx + Math.cos(ang) * 20, y0: cy + Math.sin(ang) * 14,
      x1: cx + Math.cos(ang) * dist * 1.25, y1: cy + Math.sin(ang) * dist * 0.8,
      s0: (big ? 46 : 22) + 14 * r3, s1: (big ? 230 : 170) + 260 * r2,
      t0: t0 + 0.012 * i + 0.05 * r1, t1: t0 + (big ? 0.62 : 0.85) + (big ? 0.3 : 0.45) * r3, hz: 6.5 + 3 * r1, ph: r2 * 6.28,
      bank: (Math.cos(ang) > 0 ? 1 : -1) * (8 + 14 * r3),
    };
  });
  return (
    <>
      {flights.map((f, i) => (
        <FlightBat key={i} f={f} t={t} ease={(x) => Math.pow(x, 1.5)} blur={2.5} glow={big} />
      ))}
    </>
  );
};

/** A wall of bats sweeping across the frame (right -> left) — used to wipe one shot into the next. */
export const BatSwarm: React.FC<{ t: number; t0: number; dur?: number; n?: number; seed?: number }> = ({ t, t0, dur = 0.62, n = 22, seed = 31 }) => {
  if (t < t0 - 0.05 || t > t0 + dur + 0.4) return null;
  const flights: Flight[] = Array.from({ length: n }, (_, i) => {
    const r1 = seeded(seed + i * 2.3), r2 = seeded(seed + i * 5.9), r3 = seeded(seed + i * 9.1);
    const y = -80 + (H + 160) * ((i + r1) / n);
    const s = 90 + 330 * r2;
    return {
      x0: W + s * 0.6 + 260 * r3, y0: y, x1: -s * 0.8 - 300 * r1, y1: y + (r3 - 0.5) * 240,
      s0: s * 0.8, s1: s, t0: t0 + 0.22 * r1 - 0.05, t1: t0 + dur * (0.75 + 0.5 * r3), hz: 7 + 3 * r2, ph: r3 * 6.28, bank: -6 + 12 * r2,
    };
  });
  return (
    <>
      {flights.map((f, i) => (
        <FlightBat key={i} f={f} t={t} ease={E.inOut} fadeIn={0.02} />
      ))}
    </>
  );
};

/** A few distant bats circling the moon. */
export const MoonBats: React.FC<{ t: number; cx: number; cy: number; op?: number }> = ({ t, cx, cy, op = 1 }) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const a = t * (0.55 + 0.12 * i) + i * 1.7;
      const rx = 150 + 46 * i, ry = 46 + 14 * i;
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry - 20;
      const s = 26 + 7 * Math.sin(a + 1) + 4 * i;
      return (
        <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s * 0.31, opacity: op * 0.85, transform: `scaleX(${Math.sin(a) > 0 ? -1 : 1})` }}>
          <Bat flap={t * (8 + i) * 2 * Math.PI + i} size={s} rim={0.35} eyes={false} />
        </div>
      );
    })}
  </>
);
