import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, FPS, H, TM, W, lerp, ramp, seeded, spring01, windowRect } from "./T";
import { Plate, remap } from "./layers/Plate";
import { CodeCurrents, CodeWall } from "./layers/Currents";
import { Captions, Disclaimer, InputBox, INPUT, Lockup, Sidebar, TitleBar, TITLE } from "./ui/AppWindow";
import { CodeCard, DiffCard, TermCard } from "./ui/Cards";
import { AVATAR, Chips, Greeting, HOME_INPUT, HomeInput, ProjectStrip, UpgradePill } from "./ui/Home";
import { Sound } from "./Sound";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };
const img = (p: string) => staticFile(`img/${p}`);

/* ───────────────────────── world ───────────────────────── */

const World: React.FC<{ t: number }> = ({ t }) => {
  const z = 1.04 + 0.03 * Math.sin(t * 0.35);
  return (
    <>
      <Img src={img("bg_milk.jpg")} style={{ ...full, objectFit: "cover", transform: `scale(${z})` }} />
      <Img
        src={img("caustics.jpg")}
        style={{
          ...full, objectFit: "cover", mixBlendMode: "screen", opacity: 0.1,
          transform: `translate(${-40 + 18 * t}px, ${-20 + 6 * t}px) scale(1.25) rotate(${-4 + t * 0.6}deg)`,
        }}
      />
    </>
  );
};

/* ───────────────────── 0 · prompt → icon → tap ───────────────────── */

const PROMPT = "minimax code";
const CHAR_DT = 0.042;
const TYPE_T0 = 0.42;

const PromptAndIcon: React.FC<{ t: number }> = ({ t }) => {
  if (t > TM.tap + 0.7) return null;
  const cx = 960;
  const cy = 540;
  const pin = ramp(t, 0.06, 0.5, E.out);
  const typed = t < TYPE_T0 ? 0 : Math.min(PROMPT.length, Math.floor((t - TYPE_T0) / CHAR_DT) + 1);
  const dtE = t - TM.enter;
  const press = dtE > 0 ? Math.exp(-dtE * 14) * Math.cos(dtE * 34) : 0;
  const morph = ramp(t, TM.enter + 0.06, TM.icon - 0.04, E.inOut);
  const pillW = lerp(392, 104, morph);
  const pillH = lerp(86, 104, morph);
  const textOp = 1 - ramp(t, TM.enter + 0.04, TM.enter + 0.2, E.soft);
  const caretOn = t < TYPE_T0 + PROMPT.length * CHAR_DT + 0.05 || Math.floor((t - 0.2) * 2.6) % 2 === 0;
  const burst = ramp(t, TM.icon, TM.icon + 0.34, E.out);
  const pillScale = (0.92 + 0.08 * pin) * (1 - 0.035 * press) * (1 + 0.9 * burst);

  // icon
  const dI = t - TM.icon;
  const pop = spring01(dI, 2.3, 0.36);
  const contact = TM.tap - 0.04;
  const dC = t - contact;
  const sq = dC > 0 ? Math.exp(-dC * 7.5) * Math.cos(dC * 2 * Math.PI * 3.1) : 0;
  const bob = Math.sin(dI * 2 * Math.PI * 0.85) * 7 * (1 - ramp(t, contact - 0.1, contact));
  const melt = ramp(t, TM.tap + 0.14, TM.tap + 0.55, E.in);
  const iconS = (0.3 + 0.7 * pop) * (1 - 0.55 * melt);
  const size = 210;

  // tentacle: rises from bottom right, winds up, taps the icon's lower-right flank, retracts
  const tip0 = { x: 1380, y: 1320 };
  const tipA = { x: 1102, y: 668 };
  const tipW = { x: 1124, y: 700 };
  const tipC = { x: 1018, y: 588 };
  const a1 = ramp(t, 1.74, 2.16, E.out);
  const a2 = ramp(t, 2.16, 2.3, E.soft);
  const a3 = ramp(t, 2.3, contact, E.inOut);
  const a4 = ramp(t, TM.tap + 0.1, TM.tap + 0.55, E.in);
  let tx = lerp(tip0.x, tipA.x, a1);
  let ty = lerp(tip0.y, tipA.y, a1);
  tx = lerp(tx, tipW.x, a2); ty = lerp(ty, tipW.y, a2);
  tx = lerp(tx, tipC.x, a3); ty = lerp(ty, tipC.y, a3);
  tx = lerp(tx, 1500, a4); ty = lerp(ty, 1400, a4);
  const tRot = lerp(-16, -4, a1) + 3 * a2 - 2 * a3 + 10 * a4;
  const TS = 0.56; // tentacle_tap 1133x1700, tip at (702,216)

  return (
    <>
      {/* pill */}
      {burst < 1 && (
        <div
          style={{
            position: "absolute", left: cx - pillW / 2, top: cy - pillH / 2, width: pillW, height: pillH,
            borderRadius: pillH / 2, background: "#FFFFFF", border: `1px solid ${C.ui.border}`,
            boxShadow: `0 14px 40px rgba(142,31,69,${0.1 * (1 - burst)}), 0 2px 6px rgba(0,0,0,0.05)`,
            opacity: pin * (1 - burst), transform: `scale(${pillScale})`, filter: `blur(${(1 - pin) * 8}px)`,
          }}
        >
          <div
            style={{
              position: "absolute", left: 34, top: 0, height: pillH, display: "flex", alignItems: "center",
              fontFamily: FONT.mono, fontSize: 34, color: C.ui.text, opacity: textOp, whiteSpace: "pre",
            }}
          >
            <span style={{ color: C.rose, marginRight: 14 }}>›</span>
            <span>{PROMPT.slice(0, typed)}</span>
            <span style={{ display: "inline-block", width: 3, height: 38, marginLeft: 4, background: C.ui.text, opacity: caretOn ? 1 : 0 }} />
          </div>
        </div>
      )}
      {/* icon */}
      {dI > 0 && (
        <>
          <div
            style={{
              position: "absolute", left: cx - 120, top: cy + 108, width: 240, height: 40, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(90,40,60,0.22), rgba(90,40,60,0))",
              opacity: pop * (1 - melt), transform: `scale(${0.6 + 0.4 * pop - bob * 0.01})`,
            }}
          />
          <Img
            src={staticFile("brand/homeLogo.8c4fa240.png")}
            style={{
              position: "absolute", left: cx - size / 2, top: cy - size / 2 + bob, width: size, height: size,
              transformOrigin: "50% 80%",
              transform: `scale(${iconS * (1 + 0.2 * sq)}, ${iconS * (1 - 0.24 * sq)}) rotate(${4 * sq}deg)`,
              opacity: Math.min(1, pop * 3) * (1 - ramp(t, TM.tap + 0.3, TM.tap + 0.62)),
              filter: `blur(${melt * 10}px) drop-shadow(0 10px 22px rgba(30,90,200,${0.18 * (1 - melt)}))`,
            }}
          />
        </>
      )}
      {/* tentacle */}
      {t > 1.78 && a4 < 1 && (
        <Img
          src={img("tentacle_tap.png")}
          style={{
            position: "absolute", left: tx - 702 * TS, top: ty - 216 * TS, width: 1133 * TS, height: 1700 * TS,
            transformOrigin: `${702 * TS}px ${216 * TS}px`, transform: `rotate(${tRot}deg)`,
            filter: "drop-shadow(0 18px 30px rgba(90,20,45,0.18))",
          }}
        />
      )}
    </>
  );
};

/* ───────────────────── 1 · ink dive ───────────────────── */

const InkDive: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.tap || t > TM.summon + 0.12) return null;
  const out = 1 - ramp(t, TM.summon - 0.05, TM.summon + 0.1, E.soft);
  const dive = ramp(t, TM.tap, TM.summon, E.in);
  const s = 1 + 2.1 * dive;
  const plume = ramp(t, TM.tap + 0.02, TM.summon, E.out);
  const cloud = ramp(t, TM.tap + 0.38, TM.summon + 0.02, E.inOut);
  return (
    <div style={{ ...full, opacity: out }}>
      <div style={{ ...full, transformOrigin: "960px 540px", transform: `scale(${s})`, mixBlendMode: "multiply" }}>
        <Plate dir="flat/sd_ink" ext="jpg" src={remap([[TM.tap, 1.05], [TM.summon, 2.87]], t)} first={0} last={120} />
      </div>
      <Img
        src={img("ink_b.png")}
        style={{
          position: "absolute", left: 960 - 1095, top: 548 - 260, width: 2200, height: 2200, mixBlendMode: "multiply",
          opacity: 0.85 * Math.min(1, plume * 2.5), transformOrigin: "1095px 260px", transform: `scale(${0.08 + 1.15 * plume}) rotate(${-6 + 22 * plume}deg)`,
        }}
      />
      <Img
        src={img("ink_a.png")}
        style={{
          position: "absolute", left: 960 - 1100, top: 540 - 1100, width: 2200, height: 2200, mixBlendMode: "multiply",
          opacity: cloud, transform: `scale(${0.45 + 1.7 * cloud}) rotate(${20 - 30 * cloud}deg)`,
        }}
      />
    </div>
  );
};

/* ───────────────────── 2 · summon ───────────────────── */

const SUMMON_MAP: Array<[number, number]> = [[TM.summon, 1.4], [TM.summon + 1.07, 3.0], [TM.glint, 4.79]];

const Bubbles: React.FC<{ t: number; t0: number; t1: number; seed: number; front?: boolean }> = ({ t, t0, t1, seed, front }) => {
  if (t < t0 || t > t1) return null;
  const k = (t - t0) / (t1 - t0);
  const op = ramp(t, t0, t0 + 0.4) * (1 - ramp(t, t1 - 0.4, t1));
  const s = front ? 1.1 : 0.55;
  return (
    <Img
      src={img("bubbles.png")}
      style={{
        position: "absolute", left: (front ? 1180 : 260) + seeded(seed) * 200, top: 640 - k * (front ? 900 : 520),
        width: 1100 * s, height: 1100 * s, opacity: op * (front ? 0.75 : 0.4),
        filter: front ? "blur(3px)" : "none", mixBlendMode: "screen",
      }}
    />
  );
};

const Summon: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.summon || t >= TM.glint) return null;
  const src = remap(SUMMON_MAP, t);
  const arrive = ramp(t, TM.summon, TM.summon + 1.0, E.out);
  const s = lerp(2.3, 0.84, arrive) * (1 + 0.03 * ramp(t, TM.summon + 0.85, TM.glint, E.soft));
  const swap = ramp(t, TM.summon + 0.9, TM.summon + 1.22, E.soft);
  const tf: React.CSSProperties = { ...full, transformOrigin: "960px 470px", transform: `scale(${s})` };
  const feather = "linear-gradient(to bottom, #000 0px, #000 700px, transparent 1000px)";
  // the flat plate's own frame edge must never show when it is scaled below 1: feather all sides
  const edge = "radial-gradient(ellipse 52% 47% at 50% 50%, #000 58%, transparent 100%)";
  return (
    <>
      <CodeCurrents t={t} t0={TM.currents} />
      {swap < 1 && (
        <div style={{ ...tf, mixBlendMode: "multiply", opacity: (1 - swap) * ramp(t, TM.summon - 0.06, TM.summon + 0.06, E.soft), WebkitMaskImage: s < 1.05 ? edge : undefined, maskImage: s < 1.05 ? edge : undefined }}>
          <Plate dir="flat/sd_summon_a" ext="jpg" src={src} first={0} last={144} />
        </div>
      )}
      {swap > 0 && (
        <div style={{ ...tf, opacity: swap, WebkitMaskImage: feather, maskImage: feather }}>
          <Plate dir="key/sd_summon_a" ext="png" src={src} first={24} last={144} />
        </div>
      )}
    </>
  );
};

/* ───────────────────── 3 · glint close-up ───────────────────── */

const Glint: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.glint || t >= TM.weave) return null;
  const src = remap([[TM.glint, 1.0], [TM.weave, 1.92]], t);
  const z = 1 + 0.05 * ramp(t, TM.glint, TM.weave, E.soft);
  const f = ramp(t, TM.glintFlash - 0.06, TM.glintFlash + 0.05, E.out) * (1 - ramp(t, TM.glintFlash + 0.05, TM.glintFlash + 0.32, E.soft));
  return (
    <>
      <CodeWall t={t} />
      <div style={{ ...full, transformOrigin: "1016px 483px", transform: `scale(${z})` }}>
        <Plate dir="key/sd_glint" ext="png" src={src} first={0} last={96} />
      </div>
      <Img
        src={img("sparkle_big.png")}
        style={{
          position: "absolute", left: 1016 - 260, top: 483 - 260, width: 520, height: 520, mixBlendMode: "screen",
          opacity: f, transform: `scale(${0.4 + 0.9 * f}) rotate(${(t - TM.glintFlash) * 40}deg)`,
        }}
      />
    </>
  );
};

const TentacleWhip: React.FC<{ t: number }> = ({ t }) => {
  const a = TM.weave - 0.2;
  const b = TM.weave + 0.2;
  if (t < a || t > b) return null;
  const k = ramp(t, a, b, E.inOut);
  const x = lerp(2050, -3150, k);
  return (
    <Img
      src={img("tentacle_sweep.png")}
      style={{
        position: "absolute", left: x, top: 540 - 760, width: 2900 * 1.25, height: 1243 * 1.25,
        transform: "rotate(-7deg)", filter: "url(#hblur)",
      }}
    />
  );
};

/* ───────────────────── 4 · weave: orbit → window ───────────────────── */

type CardId = "title" | "sidebar" | "input" | "code" | "term" | "diff";
const CARDS: Array<{ id: CardId; w: number; h: number; s: number; y0: number; th0: number; land?: [number, number]; exit?: number }> = [
  { id: "code", w: 560, h: 262, s: 0.96, y0: -170, th0: 18, exit: 9.52 },
  { id: "title", w: 300, h: 42, s: 1.25, y0: -360, th0: 317, land: [9.96, 10.42] },
  { id: "term", w: 430, h: 156, s: 0.98, y0: 190, th0: 140, exit: 9.6 },
  { id: "sidebar", w: 240, h: 1080, s: 0.5, y0: 0, th0: 290, land: [10.02, 10.52] },
  { id: "diff", w: 420, h: 168, s: 0.92, y0: -300, th0: 262, exit: 9.68 },
  { id: "input", w: 768, h: 96, s: 0.82, y0: 330, th0: 92, land: [10.1, 10.62] },
];

const slotOf = (id: CardId) => {
  if (id === "title") return { x: TITLE.x, y: TITLE.y, w: 300, h: 42 };
  if (id === "sidebar") return { x: 0, y: 0, w: 240, h: 1080 };
  return { x: INPUT.x, y: INPUT.y, w: INPUT.w, h: INPUT.h };
};

const cardBody = (id: CardId, t: number, chip: number) => {
  switch (id) {
    case "code": return <CodeCard reveal={ramp(t, 7.5, 8.9, E.soft)} />;
    case "term": return <TermCard reveal={ramp(t, 7.7, 8.8, E.soft)} />;
    case "diff": return <DiffCard />;
    case "sidebar": return <Sidebar />;
    case "input": return <InputBox />;
    case "title": return <div style={{ position: "absolute", left: -TITLE.x, top: -TITLE.y }}><TitleBar chip={chip} /></div>;
  }
};

const PERSP = 1700;
const MARGIN = 48;

/** Keep a card's projected box inside the frame (never cropped by the edge). */
const keepInFrame = (x: number, y: number, z: number, w: number, h: number, s: number) => {
  const f = PERSP / (PERSP - z);
  let sx = 960 + (x - 960) * f;
  let sy = 540 + (y - 540) * f;
  const hw = (w * s * f) / 2 + 6;
  const hh = (h * s * f) / 2 + 6;
  sx = Math.min(W - MARGIN - hw, Math.max(MARGIN + hw, sx));
  sy = Math.min(H - MARGIN - hh, Math.max(MARGIN + hh, sy));
  return { x: 960 + (sx - 960) / f, y: 540 + (sy - 540) / f };
};

// Cards that sit at her head / torso height always pass BEHIND her so nothing ever covers her face.
const BEHIND_ONLY: CardId[] = ["code", "title", "diff", "sidebar"];

const cardState = (c: (typeof CARDS)[number], i: number, t: number) => {
  const spin = 230 * ramp(t, 7.25, 10.2, E.soft);
  const th = ((c.th0 + spin) * Math.PI) / 180;
  const cx = 960 + 91 * ramp(t, 9.5, 10.6, E.inOut);
  const cy = 540;
  const rx = 640;
  const rz = 460;
  const behind = BEHIND_ONLY.includes(c.id);
  const appear = spring01(t - (7.32 + i * 0.11), 1.9, 0.5);
  let x = cx + rx * Math.cos(th);
  let y = cy + c.y0 + 16 * Math.sin(t * 1.7 + i * 1.3);
  let z = behind ? rz * 0.45 * Math.sin(th) - 300 : rz * Math.sin(th);
  let ry = -Math.cos(th) * 26;
  let s = c.s * appear;
  let op = Math.min(1, appear * 1.4);
  let blur = Math.max(0, -z / rz) * 2.2;
  let chip = 1;
  let landed = false;
  ({ x, y } = keepInFrame(x, y, z, c.w, c.h, c.s));
  if (c.exit !== undefined) {
    // dissolve in place (drift outward a little, toward camera) — never leave through the frame edge
    const e = ramp(t, c.exit, c.exit + 0.34, E.in);
    x += Math.sign(x - cx || 1) * 90 * e; z += 120 * e; s *= 1 + 0.08 * e; op *= 1 - e; blur += 5 * e;
    ({ x, y } = keepInFrame(x, y, z, c.w, c.h, s));
  }
  if (c.land) {
    const e = ramp(t, c.land[0], c.land[1], E.inOut);
    const R = windowRect(t);
    const sl = slotOf(c.id);
    const sx = R.x + (sl.x + sl.w / 2) * R.k;
    const sy = R.y + (sl.y + sl.h / 2) * R.k;
    x = lerp(x, sx, e); y = lerp(y, sy, e); z = lerp(z, 0, e); ry = lerp(ry, 0, e);
    s = lerp(s, R.k, e); blur = lerp(blur, 0, e); op = lerp(op, 1, e);
    chip = 1 - e;
    landed = t >= c.land[1];
    if (e > 0 && !behind) z = Math.max(z, 1);
  }
  const front = z > 0 && !behind;
  return { x, y, z, ry, s, op, blur, chip, landed, front };
};

const Orbit: React.FC<{ t: number; layer: "back" | "front" }> = ({ t, layer }) => {
  if (t < 7.3 || t > 10.7) return null;
  return (
    <div style={{ ...full, perspective: 1700, perspectiveOrigin: "960px 540px" }}>
      {CARDS.map((c, i) => {
        const st = cardState(c, i, t);
        if (st.landed || st.op <= 0.001) return null;
        if ((layer === "front") !== st.front) return null;
        return (
          <div
            key={c.id}
            style={{
              position: "absolute", left: st.x - c.w / 2, top: st.y - c.h / 2, width: c.w, height: c.h,
              transform: `translateZ(${st.z}px) rotateY(${st.ry}deg) scale(${st.s})`, opacity: st.op,
              filter: st.blur > 0.05 ? `blur(${st.blur}px)` : undefined,
            }}
          >
            {cardBody(c.id, t, st.chip)}
          </div>
        );
      })}
    </div>
  );
};

const SPIN_MAP: Array<[number, number]> = [[TM.weave, 0.6], [TM.lockup, 4.3]];

const SpinGirl: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.weave || t >= TM.lockup) return null;
  const e = ramp(t, 9.5, 10.6, E.inOut);
  const s = lerp(0.92, 0.66, e);
  const x = lerp(960, 1051, e);
  const y = lerp(540, 467, e);
  const clip = ramp(t, 10.25, 10.4) > 0 ? "inset(0 0 280px 0)" : undefined;
  return (
    <div style={{ ...full, clipPath: clip }}>
      <div style={{ ...full, transformOrigin: "952px 540px", transform: `translate(${x - 952}px, ${y - 540}px) scale(${s})` }}>
        <Plate dir="key/sd_spin_b" ext="png" src={remap(SPIN_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

/* ───────────────────── 5 · window, lockup, handoff ───────────────────── */

const landed = (id: CardId, t: number) => {
  const c = CARDS.find((x) => x.id === id)!;
  return t >= c.land![1];
};

const inkMask = (r: number, cx: number, cy: number): React.CSSProperties => {
  const S = 260 + 4500 * r;
  const m = `url(${staticFile("fx/ink_mask.png")})`;
  const pos = `${cx - 0.551 * S}px ${cy - 0.519 * S}px`;
  return { WebkitMaskImage: m, maskImage: m, WebkitMaskSize: `${S}px ${S}px`, maskSize: `${S}px ${S}px`, WebkitMaskPosition: pos, maskPosition: pos, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" };
};

/** 0 -> 1 while the lockup turns into the real start page, just before the live UI takes over. */
const morphOf = (t: number) => ramp(t, TM.morph, TM.morph + 0.6, E.inOut);

const MorphInput: React.FC<{ t: number }> = ({ t }) => {
  if (!landed("input", t)) return null;
  const m = morphOf(t);
  const glow = ramp(t, TM.lockup - 0.05, TM.lockup + 0.15) * (1 - ramp(t, TM.lockup + 0.3, TM.lockup + 1.0, E.soft));
  if (m <= 0) return <InputBox glow={glow} />;
  if (m >= 1) return <HomeInput />;
  const x = lerp(INPUT.x, HOME_INPUT.x, m), y = lerp(INPUT.y, HOME_INPUT.y, m);
  const w = lerp(INPUT.w, HOME_INPUT.w, m), h = lerp(INPUT.h, HOME_INPUT.h, m);
  const oldA = 1 - ramp(m, 0.05, 0.7), newA = ramp(m, 0.3, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.ui.border}`, boxShadow: "0 4px 18px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -INPUT.x - 1, top: -INPUT.y - 1, opacity: oldA }}><InputBox /></div>
      <div style={{ position: "absolute", left: -HOME_INPUT.x - 1, top: -HOME_INPUT.y - 1, opacity: newA }}><HomeInput /></div>
    </div>
  );
};

const WindowFrame: React.FC<{ t: number; part: "base" | "front"; children?: React.ReactNode }> = ({ t, part, children }) => {
  if (t < TM.land) return null;
  const R = windowRect(t);
  const reveal = ramp(t, TM.land - 0.02, TM.land + 0.62, E.out);
  const radius = 16 * (1 - R.a);
  const cxW = (1051 - R.x) / R.k;
  const cyW = (467 - R.y) / R.k;
  const pulse = t < TM.transitionStart ? 1 + 0.012 * Math.exp(-(t - TM.lockup) * 5) * (t > TM.lockup ? Math.sin((t - TM.lockup) * 14) : 0) : 1;
  return (
    <div
      style={{
        position: "absolute", left: R.x, top: R.y, width: W, height: H, transformOrigin: "0 0",
        transform: `scale(${R.k * pulse})`,
      }}
    >
      {part === "base" ? (
        <div
          style={{
            ...full, borderRadius: radius / R.k, overflow: "hidden", background: C.ui.main,
            ...(reveal < 1 ? inkMask(reveal, cxW, cyW) : {}),
            boxShadow: `0 40px 120px rgba(142,31,69,${0.22 * (1 - R.a)}), 0 0 0 ${1 / R.k}px rgba(0,0,0,${0.06 * (1 - R.a)})`,
          }}
        >
          {landed("sidebar", t) && <Sidebar />}
          {landed("title", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.3) }}><TitleBar /></div>}
          <Captions />
          {children}
          {t >= TM.morph && <UpgradePill a={ramp(t, TM.morph + 0.3, TM.morph + 0.65, E.soft)} />}
          {t >= TM.morph && <Greeting a={ramp(t, TM.morph + 0.46, TM.morph + 0.8, E.out)} />}
          {t >= TM.morph && <Chips a={ramp(t, TM.morph + 0.5, TM.morph + 0.9, E.out)} />}
        </div>
      ) : (
        <div style={{ ...full, borderRadius: radius / R.k, overflow: "hidden" }}>
          {children}
          {t >= TM.morph && <div style={{ opacity: ramp(t, TM.morph + 0.35, TM.morph + 0.6, E.soft) }}><ProjectStrip /></div>}
          <MorphInput t={t} />
          {landed("input", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.25) }}><Disclaimer /></div>}
        </div>
      )}
    </div>
  );
};

const IDLE_MAP: Array<[number, number]> = [[TM.lockup, 0.2], [TM.duration, 0.2 + TM.duration - TM.lockup]];

const IdleGirl: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.lockup) return null;
  const m = morphOf(t);
  const rise = (1 - spring01(t - TM.lockup, 1.5, 0.62)) * 300;
  // face centre in the idle plate is (965, 270); at m=1 it sits in the avatar slot
  const s = lerp(0.52, AVATAR.d / 220, m);
  const tx = lerp(1080 - 960 * 0.52, AVATAR.cx - 965 * s, m);
  const ty = lerp(339 + rise, AVATAR.cy - 270 * s, m);
  const r = lerp(1500, AVATAR.d / 2, E.in(m));
  const feather = "linear-gradient(to bottom, #000 0px, #000 812px, transparent 872px)";
  return (
    <div style={{ ...full, WebkitMaskImage: m > 0 ? undefined : feather, maskImage: m > 0 ? undefined : feather, clipPath: m > 0 ? `circle(${r}px at ${AVATAR.cx}px ${lerp(479, AVATAR.cy, m)}px)` : undefined }}>
      <div style={{ ...full, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Plate dir="key/sd_idle" ext="png" src={remap(IDLE_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

const LockupLayer: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.lockup) return null;
  const word = ramp(t, TM.lockup + 0.08, TM.lockup + 0.58, E.out);
  const line = ramp(t, TM.lockup + 0.28, TM.lockup + 0.73, E.out);
  const out = ramp(t, TM.morph, TM.morph + 0.32, E.in);
  const sparks = [
    { x: 738, y: 170, d: 0.18, s: 64 },
    { x: 1416, y: 166, d: 0.32, s: 48 },
    { x: 1452, y: 250, d: 0.5, s: 34 },
    { x: 706, y: 262, d: 0.62, s: 30 },
  ];
  return (
    <>
      <Lockup word={word} line={line} out={out} />
      {sparks.map((p, i) => {
        const dt = t - TM.lockup - p.d;
        if (dt < 0) return null;
        const a = 0.85 * Math.min(1, dt / 0.12) * Math.exp(-dt * 1.6) * (1 - out);
        return (
          <Img
            key={i}
            src={img("sparkle_pink.png")}
            style={{
              position: "absolute", left: p.x - p.s, top: p.y - p.s, width: p.s * 2, height: p.s * 2, opacity: a,
              transform: `scale(${0.5 + 0.5 * Math.min(1, dt / 0.2)}) rotate(${dt * 30}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

const Bloom: React.FC<{ t: number }> = ({ t }) => {
  const a = ramp(t, TM.lockup - 0.07, TM.lockup + 0.03, E.out) * (1 - ramp(t, TM.lockup + 0.03, TM.lockup + 0.5, E.soft));
  if (a <= 0) return null;
  return (
    <div
      style={{
        ...full, opacity: a,
        background: `radial-gradient(ellipse 70% 70% at 1051px 470px, rgba(255,255,255,0.98) 0%, rgba(255,240,245,0.92) 35%, rgba(251,211,223,0.55) 70%, rgba(251,211,223,0) 100%)`,
      }}
    />
  );
};

/* ───────────────────── finishing ───────────────────── */

const Finish: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const clean = windowRect(t).a; // final frames must match the real UI exactly: no grade
  if (clean >= 1) return null;
  return (
    <>
      <div
        style={{
          ...full, opacity: 1 - clean,
          background: "radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 60%, rgba(110,40,60,0.16) 100%)",
        }}
      />
      <Img
        src={staticFile("fx/grain.png")}
        style={{
          position: "absolute", left: -((frame * 137) % 512), top: -((frame * 71) % 512), width: W + 1024, height: H + 1024,
          objectFit: "none", objectPosition: "0 0", mixBlendMode: "overlay", opacity: 0.07 * (1 - clean),
        }}
      />
    </>
  );
};

export const Boot: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hblur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22 0" />
        </filter>
      </svg>
      <World t={t} />
      <Bubbles t={t} t0={TM.summon} t1={TM.glint} seed={1} />
      <InkDive t={t} />
      <PromptAndIcon t={t} />
      <Summon t={t} />
      <Glint t={t} />
      <WindowFrame t={t} part="base">
        <LockupLayer t={t} />
      </WindowFrame>
      <Orbit t={t} layer="back" />
      <SpinGirl t={t} />
      <WindowFrame t={t} part="front">
        <IdleGirl t={t} />
      </WindowFrame>
      <Orbit t={t} layer="front" />
      <TentacleWhip t={t} />
      <Bloom t={t} />
      <Finish t={t} frame={frame} />
      <Sound />
    </AbsoluteFill>
  );
};
