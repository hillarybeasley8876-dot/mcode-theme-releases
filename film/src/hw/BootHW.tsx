import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Plate, remap } from "../layers/Plate";
import { E, FPS, H, HC, TM, W, lerp, ramp, seeded, spring01, windowRect } from "./T";
import { BatBurst, BatSwarm, MoonBats } from "./Bats";
import { Candles, Embers, Ghosts, NightWorld, Pumpkin } from "./Props";
import { CodeCard, CodeCurrents, CodeWall, DiffCard, TermCard } from "./CardsHW";
import { Captions, Disclaimer, INPUT, InputBox, Lockup, Sidebar, TITLE, TitleBar } from "./AppWindowHW";
import { AVATAR, AvatarSkin, Chips, Greeting, HOME_INPUT, HomeInput, HomePanelDecor, ProjectStrip, UpgradePill } from "./HomeHW";
import { SoundHW } from "./SoundHW";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };
const hw = (p: string) => staticFile(`hw/${p}`);

/* ───────────────────── 0 · prompt → icon → witch hat → tap ───────────────────── */

const PROMPT = "minimax code";
const CHAR_DT = 0.042;
const TYPE_T0 = 0.42;
const HAT_W = 172;
const HAT_H = (HAT_W * 662) / 900;

const PromptAndIcon: React.FC<{ t: number }> = ({ t }) => {
  if (t > TM.tap + 0.7) return null;
  const cx = 960;
  const cy = 548;
  const pin = ramp(t, 0.06, 0.5, E.out);
  const typed = t < TYPE_T0 ? 0 : Math.min(PROMPT.length, Math.floor((t - TYPE_T0) / CHAR_DT) + 1);
  const dtE = t - TM.enter;
  const press = dtE > 0 ? Math.exp(-dtE * 14) * Math.cos(dtE * 34) : 0;
  const morph = ramp(t, TM.enter + 0.06, TM.icon - 0.04, E.inOut);
  const pillW = lerp(520, 128, morph);
  const pillH = lerp(108, 128, morph);
  // after Enter the glass pill gathers into a glowing lantern orb, which bursts into the app icon
  const orb = ramp(t, TM.enter + 0.02, TM.enter + 0.3, E.out); // lights up as the text fades, no empty pill in between
  const orbPulse = 1 + 0.06 * Math.sin((t - TM.enter) * 26) * orb * (1 - ramp(t, TM.icon - 0.1, TM.icon));
  const textOp = 1 - ramp(t, TM.enter + 0.04, TM.enter + 0.2, E.soft);
  const caretOn = t < TYPE_T0 + PROMPT.length * CHAR_DT + 0.05 || Math.floor((t - 0.2) * 2.6) % 2 === 0;
  const burst = ramp(t, TM.icon, TM.icon + 0.34, E.out);
  const pillScale = (0.9 + 0.1 * spring01(t - 0.06, 2.4, 0.45)) * (1 - 0.035 * press) * (1 + 0.9 * burst) * orbPulse;

  // icon pops, then the hat lands on it (squash), then the tentacle taps it
  const dI = t - TM.icon;
  const pop = spring01(dI, 2.3, 0.36);
  const dH = t - TM.hat;
  const hatSq = dH > 0 ? Math.exp(-dH * 9) * Math.cos(dH * 2 * Math.PI * 3.4) : 0;
  const contact = TM.tap - 0.04;
  const dC = t - contact;
  const tapSq = dC > 0 ? Math.exp(-dC * 7.5) * Math.cos(dC * 2 * Math.PI * 3.1) : 0;
  const sq = 0.7 * hatSq + tapSq;
  const bob = Math.sin(dI * 2 * Math.PI * 0.85) * 7 * (1 - ramp(t, contact - 0.1, contact));
  const melt = ramp(t, TM.tap + 0.08, TM.tap + 0.4, E.in);
  const iconS = (0.3 + 0.7 * pop) * (1 - 0.55 * melt);
  const size = 210;
  const iconTop = cy - size / 2 + bob;

  // hat: falls from above, spins a little, lands slightly tilted on the icon's crown
  const fall = ramp(t, TM.hat - 0.36, TM.hat, E.in);
  const hatY = lerp(-260, iconTop - HAT_H * 0.62 + 18 * (1 - iconS), fall) + (dH > 0 ? -10 * hatSq : 0);
  const hatRot = lerp(-38, -9, fall) + (dH > 0 ? 6 * hatSq : 0);
  const hatScale = iconS * (1 + 0.12 * Math.max(0, hatSq));

  // tentacle rises from the bottom right, winds up, taps the icon's flank, retracts
  const tip0 = { x: 1380, y: 1320 };
  const tipA = { x: 1102, y: 676 };
  const tipW = { x: 1124, y: 708 };
  const tipC = { x: 1018, y: 596 };
  const a1 = ramp(t, TM.hat + 0.05, TM.hat + 0.36, E.out);
  const a2 = ramp(t, TM.hat + 0.36, TM.hat + 0.43, E.soft);
  const a3 = ramp(t, TM.hat + 0.43, contact, E.inOut);
  const a4 = ramp(t, TM.tap + 0.05, TM.tap + 0.34, E.in);
  let tx = lerp(tip0.x, tipA.x, a1);
  let ty = lerp(tip0.y, tipA.y, a1);
  tx = lerp(tx, tipW.x, a2); ty = lerp(ty, tipW.y, a2);
  tx = lerp(tx, tipC.x, a3); ty = lerp(ty, tipC.y, a3);
  tx = lerp(tx, 1500, a4); ty = lerp(ty, 1400, a4);
  const tRot = lerp(-16, -4, a1) + 3 * a2 - 2 * a3 + 10 * a4;
  const TS = 0.56;

  return (
    <>
      {burst < 1 && (
        <>
          {/* warm light the pill throws on the mist below it */}
          <div
            style={{
              position: "absolute", left: cx - 420, top: cy + 30, width: 840, height: 170, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(255,138,31,0.28), rgba(255,138,31,0))",
              opacity: pin * (1 - burst) * (1 + 0.6 * orb),
            }}
          />
          <div
            style={{
              position: "absolute", left: cx - pillW / 2, top: cy - pillH / 2, width: pillW, height: pillH, borderRadius: pillH / 2,
              opacity: Math.min(1, pin * 1.4) * (1 - burst), transform: `scale(${pillScale})`, filter: `blur(${(1 - pin) * 8}px)`,
            }}
          >
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: pillH / 2, opacity: 1 - orb,
                background: "linear-gradient(180deg, rgba(48,34,66,0.95) 0%, rgba(26,19,36,0.95) 100%)",
                border: "1.5px solid rgba(255,176,102,0.6)", boxSizing: "border-box",
                boxShadow: "0 0 0 1px rgba(255,138,31,0.16), 0 0 46px rgba(255,138,31,0.34), 0 22px 60px rgba(5,2,10,0.65), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            />
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: pillH / 2, opacity: orb,
                background: "radial-gradient(circle at 42% 36%, #fff3dd 0%, #ffc285 22%, #ff8a1f 55%, #b9480d 100%)",
                boxShadow: `0 0 ${50 + 70 * orb}px rgba(255,138,31,0.75), 0 0 ${140 * orb}px rgba(123,63,224,0.45)`,
              }}
            />
            <div
              style={{
                position: "absolute", left: 40, top: 0, height: pillH, display: "flex", alignItems: "center",
                fontFamily: '"JetBrains Mono", monospace', fontSize: 40, color: "#fff1e2", opacity: textOp, whiteSpace: "pre",
                textShadow: "0 0 14px rgba(255,176,102,0.4)",
              }}
            >
              <span style={{ color: HC.pumpkin, marginRight: 16 }}>›</span>
              <span>{PROMPT.slice(0, typed)}</span>
              <span style={{ display: "inline-block", width: 3, height: 44, marginLeft: 5, background: HC.pumpkin, opacity: caretOn ? 1 : 0, boxShadow: `0 0 10px ${HC.pumpkin}` }} />
            </div>
          </div>
        </>
      )}
      <OrbBurst t={t} x={cx} y={cy} />
      {dI > 0 && (
        <>
          <div
            style={{
              position: "absolute", left: cx - 140, top: cy + 104, width: 280, height: 46, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(255,138,31,0.32), rgba(255,138,31,0))",
              opacity: pop * (1 - melt), transform: `scale(${0.6 + 0.4 * pop - bob * 0.01})`,
            }}
          />
          <Img
            src={staticFile("brand/homeLogo.8c4fa240.png")}
            style={{
              position: "absolute", left: cx - size / 2, top: iconTop, width: size, height: size, transformOrigin: "50% 80%",
              transform: `scale(${iconS * (1 + 0.2 * sq)}, ${iconS * (1 - 0.24 * sq)}) rotate(${4 * sq}deg)`,
              opacity: Math.min(1, pop * 3) * (1 - ramp(t, TM.tap + 0.14, TM.tap + 0.42)),
              filter: `blur(${melt * 10}px) drop-shadow(0 10px 26px rgba(123,63,224,${0.45 * (1 - melt)}))`,
            }}
          />
          {t > TM.hat - 0.36 && (
            <Img
              src={hw("witch_hat.png")}
              style={{
                position: "absolute", left: cx - HAT_W / 2 + 6, top: hatY, width: HAT_W, height: HAT_H, transformOrigin: "50% 85%",
                transform: `rotate(${hatRot}deg) scale(${hatScale})`, opacity: 1 - ramp(t, TM.tap + 0.14, TM.tap + 0.42),
                filter: `blur(${melt * 10}px) drop-shadow(0 8px 14px rgba(5,2,10,0.5))`,
              }}
            />
          )}
          <HatPoof t={t} x={cx} y={iconTop + 6} />
        </>
      )}
      {t > TM.hat + 0.05 && a4 < 1 && (
        <Img
          src={staticFile("img/tentacle_tap.png")}
          style={{
            position: "absolute", left: tx - 702 * TS, top: ty - 216 * TS, width: 1133 * TS, height: 1700 * TS,
            transformOrigin: `${702 * TS}px ${216 * TS}px`, transform: `rotate(${tRot}deg)`,
            filter: "drop-shadow(0 18px 30px rgba(5,2,10,0.45))",
          }}
        />
      )}
    </>
  );
};

/** The lantern orb bursting into the app icon: an expanding ring and a spray of sparks. */
const OrbBurst: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const dt = t - TM.icon;
  if (dt < 0 || dt > 0.7) return null;
  const k = ramp(dt, 0, 0.45, E.out);
  const r = 70 + 330 * k;
  return (
    <>
      <div
        style={{
          position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
          border: `${3 + 5 * (1 - k)}px solid rgba(255,176,102,${0.9 * (1 - k)})`, boxSizing: "border-box",
          boxShadow: `0 0 30px rgba(255,138,31,${0.6 * (1 - k)}), inset 0 0 30px rgba(255,138,31,${0.4 * (1 - k)})`,
        }}
      />
      <div
        style={{
          position: "absolute", left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", mixBlendMode: "screen",
          background: "radial-gradient(closest-side, rgba(255,236,206,0.95), rgba(255,138,31,0.5) 40%, rgba(255,138,31,0))",
          opacity: 1 - ramp(dt, 0.02, 0.32, E.soft),
        }}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const ang = (i / 12) * Math.PI * 2 + seeded(i + 40) * 0.4;
        const d = 60 + (220 + 120 * seeded(i + 9)) * k;
        const s = 26 + 18 * seeded(i + 21);
        return (
          <Img
            key={i}
            src={staticFile("img/sparkle_pink.png")}
            style={{
              position: "absolute", left: x + Math.cos(ang) * d - s / 2, top: y + Math.sin(ang) * d * 0.8 - s / 2, width: s, height: s,
              opacity: 1 - ramp(dt, 0.25, 0.7), filter: "hue-rotate(48deg) saturate(1.6) brightness(1.2)", transform: `rotate(${dt * 160 + i * 25}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/** A small burst of orange sparkles where the hat lands. */
const HatPoof: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const dt = t - TM.hat;
  if (dt < 0 || dt > 0.6) return null;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const ang = -Math.PI * (0.1 + 0.8 * (i / 6));
        const d = 40 + 90 * ramp(dt, 0, 0.45, E.out);
        const s = 34 + 14 * seeded(i + 4);
        const a = (1 - ramp(dt, 0.15, 0.6)) * Math.min(1, dt / 0.05);
        return (
          <Img
            key={i}
            src={staticFile("img/sparkle_pink.png")}
            style={{
              position: "absolute", left: x + Math.cos(ang) * d * 1.5 - s / 2, top: y + Math.sin(ang) * d - s / 2, width: s, height: s,
              opacity: a, filter: "hue-rotate(48deg) saturate(1.6) brightness(1.15)", transform: `rotate(${dt * 120 + i * 30}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ───────────────────── 1 · cauldron smoke dive + bats ───────────────────── */

const SmokeDive: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.tap || t > TM.summon + 0.9) return null;
  const cx = 960;
  const cy = 560;
  const plume = ramp(t, TM.tap + 0.02, TM.summon - 0.25, E.out);
  const cloud = ramp(t, TM.tap + 0.18, TM.summon - 0.05, E.inOut);
  const dive = ramp(t, TM.tap + 0.25, TM.summon + 0.5, E.inOut);
  // the smoke parts from the centre outward (visibly, over ~1 s) instead of fading as a whole
  const open = ramp(t, TM.summon - 0.3, TM.summon + 0.75, E.inOut);
  const R = 1850 * open;
  const hole = open > 0 ? `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 420}px)` : undefined;
  const glow = ramp(t, TM.tap, TM.tap + 0.3, E.soft) * (1 - open);
  const lift = "brightness(1.32) saturate(1.18) contrast(1.04)";
  return (
    <>
      <div
        style={{
          ...full, opacity: glow, mixBlendMode: "screen",
          background: `radial-gradient(ellipse 48% 54% at ${cx}px ${cy}px, rgba(150,84,255,0.5), rgba(123,63,224,0.12) 55%, rgba(123,63,224,0) 75%)`,
        }}
      />
      <div style={{ ...full, WebkitMaskImage: hole, maskImage: hole }}>
        <div style={{ ...full, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.85 * dive})` }}>
          <Img
            src={hw("smoke_b.png")}
            style={{
              position: "absolute", left: cx - 900, top: cy + 40 - 1500, width: 1800, height: 1800, opacity: Math.min(1, plume * 2.4) * (1 - 0.5 * cloud),
              transformOrigin: "900px 1500px", transform: `scale(${0.12 + 1.0 * plume}) rotate(${-4 + 10 * plume}deg)`, filter: lift,
              WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 84%)", maskImage: "linear-gradient(to bottom, #000 62%, transparent 84%)",
            }}
          />
          <Img
            src={hw("smoke_a.png")}
            style={{
              position: "absolute", left: cx - 1100, top: cy - 1100, width: 2200, height: 2200,
              opacity: Math.min(1, cloud * 2.2), transform: `scale(${0.14 + 1.75 * cloud}) rotate(${18 - 30 * cloud}deg)`, filter: lift,
            }}
          />
        </div>
      </div>
      <BatBurst t={t} t0={TM.bats} cx={cx} cy={cy} n={20} big />
    </>
  );
};

/* ───────────────────── 2 · summon ───────────────────── */

const SUMMON_MAP: Array<[number, number]> = [[TM.summon, 1.0], [TM.summon + 0.75, 2.6], [TM.glint, 4.6]];

const SUMMON_CANDLES = [
  { x: 330, y: 330, s: 0.5, i: 0 },
  { x: 1590, y: 290, s: 0.42, i: 1 },
  { x: 205, y: 700, s: 0.62, i: 2, blur: 1.5 },
  { x: 1720, y: 640, s: 0.58, i: 3, blur: 1.2 },
  { x: 560, y: 180, s: 0.32, i: 4, blur: 0.8 },
];

const Summon: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.summon - 0.3 || t >= TM.glint) return null;
  const src = remap(SUMMON_MAP, t);
  const arrive = ramp(t, TM.summon - 0.3, TM.summon + 0.95, E.out);
  const s = lerp(1.32, 0.92, arrive) * (1 - 0.1 * ramp(t, TM.summon + 0.9, TM.glint, E.soft));
  const feather = "linear-gradient(to bottom, #000 0px, #000 800px, transparent 1050px)";
  return (
    <>
      <MoonBats t={t} cx={1640} cy={140} op={ramp(t, TM.summon, TM.summon + 0.6)} />
      <Candles t={t} t0={TM.summon + 0.2} t1={TM.glint} set={SUMMON_CANDLES} />
      <Ghosts
        t={t}
        t0={TM.currents - 0.2}
        t1={TM.glint}
        set={[
          { x: 300, y: 520, s: 0.42, i: 0, dx: 14, op: 0.7 },
          { x: 1640, y: 470, s: 0.36, i: 4, dx: -12, op: 0.62 },
        ]}
      />
      <CodeCurrents t={t} t0={TM.currents} t1={TM.glint} />
      <div style={{ ...full, transformOrigin: "960px 600px", transform: `scale(${s})`, WebkitMaskImage: feather, maskImage: feather, opacity: ramp(t, TM.summon - 0.3, TM.summon - 0.12) }}>
        <Plate dir="key/hw_sd_summon_s" ext="png" src={src} first={0} last={144} />
      </div>
      <Embers t={t} t0={TM.summon} t1={TM.glint} n={36} seed={5} />
      <Pumpkin i={2} x={150} y={985} h={300} t={t} blur={3} op={ramp(t, TM.summon + 0.1, TM.summon + 0.7)} rot={-6} />
      <Pumpkin i={0} x={1790} y={1000} h={250} t={t} blur={3} op={ramp(t, TM.summon + 0.2, TM.summon + 0.8)} rot={8} />
    </>
  );
};

/* ───────────────────── 3 · glint close-up ───────────────────── */

const GLINT_MAP: Array<[number, number]> = [[TM.glint, 1.0], [TM.glintFlash, 1.625], [TM.weave, 2.6]];

const Glint: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.glint || t >= TM.weave) return null;
  const src = remap(GLINT_MAP, t);
  const z = 1 + 0.05 * ramp(t, TM.glint, TM.weave, E.soft);
  const f = ramp(t, TM.glintFlash - 0.06, TM.glintFlash + 0.05, E.out) * (1 - ramp(t, TM.glintFlash + 0.05, TM.glintFlash + 0.32, E.soft));
  return (
    <>
      <div style={{ ...full, background: "radial-gradient(ellipse 80% 80% at 50% 45%, rgba(58,29,90,0.9), rgba(19,14,25,0.96))" }} />
      <CodeWall t={t} />
      <div style={{ ...full, transformOrigin: "821px 529px", transform: `scale(${z})` }}>
        <Plate dir="key/hw_sd_glint_s" ext="png" src={src} first={0} last={96} />
      </div>
      <Img
        src={staticFile("img/sparkle_big.png")}
        style={{
          position: "absolute", left: 821 - 260, top: 529 - 260, width: 520, height: 520, mixBlendMode: "screen",
          opacity: f, transform: `scale(${0.4 + 0.9 * f}) rotate(${(t - TM.glintFlash) * 40}deg)`, filter: "hue-rotate(40deg) saturate(1.3)",
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
      src={staticFile("img/tentacle_sweep.png")}
      style={{ position: "absolute", left: x, top: 540 - 760, width: 2900 * 1.25, height: 1243 * 1.25, transform: "rotate(-7deg)", filter: "url(#hwHblur)" }}
    />
  );
};

/* ───────────────────── 4 · weave: orbit → window ───────────────────── */

type CardId = "title" | "sidebar" | "input" | "code" | "term" | "diff";
const L0 = TM.land;
const CARDS: Array<{ id: CardId; w: number; h: number; s: number; y0: number; th0: number; land?: [number, number]; exit?: number }> = [
  { id: "code", w: 560, h: 262, s: 0.96, y0: -170, th0: 18, exit: L0 - 0.6 },
  { id: "title", w: 300, h: 42, s: 1.25, y0: -360, th0: 317, land: [L0, L0 + 0.38] },
  { id: "term", w: 430, h: 156, s: 0.98, y0: 190, th0: 140, exit: L0 - 0.53 },
  { id: "sidebar", w: 240, h: 1080, s: 0.5, y0: 0, th0: 290, land: [L0 + 0.05, L0 + 0.45] },
  { id: "diff", w: 420, h: 168, s: 0.92, y0: -300, th0: 262, exit: L0 - 0.46 },
  { id: "input", w: 768, h: 96, s: 0.82, y0: 330, th0: 92, land: [L0 + 0.1, L0 + 0.5] },
];

const slotOf = (id: CardId) => {
  if (id === "title") return { x: TITLE.x, y: TITLE.y, w: 300, h: 42 };
  if (id === "sidebar") return { x: 0, y: 0, w: 240, h: 1080 };
  return { x: INPUT.x, y: INPUT.y, w: INPUT.w, h: INPUT.h };
};

const cardBody = (id: CardId, t: number, chip: number) => {
  switch (id) {
    case "code": return <CodeCard reveal={ramp(t, TM.weave + 0.3, TM.weave + 1.45, E.soft)} />;
    case "term": return <TermCard reveal={ramp(t, TM.weave + 0.45, TM.weave + 1.35, E.soft)} />;
    case "diff": return <DiffCard />;
    case "sidebar": return <Sidebar t={t} />;
    case "input": return <InputBox />;
    case "title": return <div style={{ position: "absolute", left: -TITLE.x, top: -TITLE.y }}><TitleBar chip={chip} /></div>;
  }
};

const PERSP = 1700;
const MARGIN = 48;

const keepInFrame = (x: number, y: number, z: number, w: number, h: number, s: number) => {
  const f = PERSP / (PERSP - z);
  let sx = 960 + (x - 960) * f;
  let sy = 540 + (y - 540) * f;
  const hw2 = (w * s * f) / 2 + 6;
  const hh = (h * s * f) / 2 + 6;
  sx = Math.min(W - MARGIN - hw2, Math.max(MARGIN + hw2, sx));
  sy = Math.min(H - MARGIN - hh, Math.max(MARGIN + hh, sy));
  return { x: 960 + (sx - 960) / f, y: 540 + (sy - 540) / f };
};

const BEHIND_ONLY: CardId[] = ["code", "title", "diff", "sidebar"];

const cardState = (c: (typeof CARDS)[number], i: number, t: number) => {
  const spin = 230 * ramp(t, TM.weave + 0.065, L0 - 0.04, E.soft);
  const th = ((c.th0 + spin) * Math.PI) / 180;
  const cx = 960 + 91 * ramp(t, L0 - 0.63, L0 + 0.26, E.inOut);
  const cy = 540;
  const rx = 640;
  const rz = 460;
  const behind = BEHIND_ONLY.includes(c.id);
  const appear = spring01(t - (TM.weave + 0.12 + i * 0.09), 1.9, 0.5);
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
    const e = ramp(t, c.exit, c.exit + 0.3, E.in);
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
  if (t < TM.weave + 0.1 || t > TM.lockup + 0.1) return null;
  return (
    <div style={{ ...full, perspective: PERSP, perspectiveOrigin: "960px 540px" }}>
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

const SPIN_MAP: Array<[number, number]> = [[TM.weave, 0.4], [TM.lockup, 4.7]];

const SpinGirl: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.weave - 0.05 || t >= TM.lockup) return null;
  const e = ramp(t, L0 - 0.75, TM.lockup + 0.25, E.inOut);
  const s = lerp(0.9, 0.66, e);
  const x = lerp(960, 1051, e);
  const y = lerp(540, 467, e);
  // her feet fade out above the composer as she settles into the window (no hard cut)
  const hide = ramp(t, L0 + 0.12, L0 + 0.4, E.soft);
  const fade = hide > 0 ? `linear-gradient(to bottom, #000 ${1080 - 360 * hide}px, transparent ${1080 - 280 * hide}px)` : undefined;
  return (
    <div style={{ ...full, WebkitMaskImage: fade, maskImage: fade }}>
      <div style={{ ...full, transformOrigin: "952px 540px", transform: `translate(${x - 952}px, ${y - 540}px) scale(${s})` }}>
        <Plate dir="key/hw_sd_spin_s" ext="png" src={remap(SPIN_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

/* ───────────────────── 5 · window, lockup, handoff ───────────────────── */

const landed = (id: CardId, t: number) => t >= CARDS.find((x) => x.id === id)!.land![1];

const inkMask = (r: number, cx: number, cy: number): React.CSSProperties => {
  const S = 260 + 4500 * r;
  const m = `url(${staticFile("fx/ink_mask.png")})`;
  const pos = `${cx - 0.551 * S}px ${cy - 0.519 * S}px`;
  return { WebkitMaskImage: m, maskImage: m, WebkitMaskSize: `${S}px ${S}px`, maskSize: `${S}px ${S}px`, WebkitMaskPosition: pos, maskPosition: pos, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" };
};

const morphOf = (t: number) => ramp(t, TM.morph, TM.morph + 0.6, E.inOut);

const MorphInput: React.FC<{ t: number }> = ({ t }) => {
  if (!landed("input", t)) return null;
  const m = morphOf(t);
  const glow = ramp(t, TM.lockup - 0.05, TM.lockup + 0.15) * (1 - ramp(t, TM.lockup + 0.3, TM.lockup + 1.0, E.soft));
  if (m <= 0) return <InputBox glow={glow} />;
  // no focus ring: during the handoff the launcher owns the foreground, so the live composer is unfocused
  if (m >= 1) return <HomeInput t={t} ghost={ramp(t, TM.morph + 0.6, TM.morph + 0.9, E.out)} />;
  const x = lerp(INPUT.x, HOME_INPUT.x, m), y = lerp(INPUT.y, HOME_INPUT.y, m);
  const w = lerp(INPUT.w, HOME_INPUT.w, m), h = lerp(INPUT.h, HOME_INPUT.h, m);
  const oldA = 1 - ramp(m, 0.05, 0.7), newA = ramp(m, 0.3, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 20, background: HC.ui.card, border: `1px solid ${HC.ui.border}`, boxSizing: "border-box", boxShadow: "0 18px 50px #05020a99", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -INPUT.x - 1, top: -INPUT.y - 1, opacity: oldA }}><InputBox /></div>
      <div style={{ position: "absolute", left: -HOME_INPUT.x - 1, top: -HOME_INPUT.y - 1, opacity: newA }}><HomeInput t={t} ghost={0} /></div>
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
  const decor = ramp(t, TM.lockup, TM.lockup + 0.7, E.soft);
  return (
    <div style={{ position: "absolute", left: R.x, top: R.y, width: W, height: H, transformOrigin: "0 0", transform: `scale(${R.k * pulse})` }}>
      {part === "base" ? (
        <div
          style={{
            ...full, borderRadius: radius / R.k, overflow: "hidden", background: HC.ui.main,
            ...(reveal < 1 ? inkMask(reveal, cxW, cyW) : {}),
            boxShadow: `0 40px 120px rgba(255,138,31,${0.18 * (1 - R.a)}), 0 0 0 ${1 / R.k}px rgba(236,224,255,${0.12 * (1 - R.a)})`,
          }}
        >
          <HomePanelDecor a={decor} />
          {landed("sidebar", t) && <Sidebar t={t} decor={decor} />}
          {landed("title", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.3) }}><TitleBar /></div>}
          <Captions />
          {children}
          {t >= TM.morph && <UpgradePill a={ramp(t, TM.morph + 0.3, TM.morph + 0.65, E.soft)} />}
          {t >= TM.morph && <Greeting a={ramp(t, TM.morph + 0.46, TM.morph + 0.8, E.out)} />}
        </div>
      ) : (
        <div style={{ ...full, borderRadius: radius / R.k, overflow: "hidden" }}>
          {children}
          <MorphInput t={t} />
          {/* like the client's DOM order: the strip and chips paint over the composer's drop shadow */}
          {t >= TM.morph && <div style={{ opacity: ramp(t, TM.morph + 0.35, TM.morph + 0.6, E.soft) }}><ProjectStrip /></div>}
          {t >= TM.morph && <Chips a={ramp(t, TM.morph + 0.5, TM.morph + 0.9, E.out)} />}
          {landed("input", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.25) }}><Disclaimer /></div>}
        </div>
      )}
    </div>
  );
};

// idle plate: full body; her face sits at (950, 228) in plate pixels
const FACE = { x: 950, y: 228, span: 190 };
const IDLE_MAP: Array<[number, number]> = [[TM.lockup, 0.3], [TM.duration, 0.3 + TM.duration - TM.lockup]];
const IDLE_S = 0.6;

const IdleGirl: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.lockup) return null;
  const m = morphOf(t);
  const rise = (1 - spring01(t - TM.lockup, 1.5, 0.62)) * 300;
  const sEnd = AVATAR.d / FACE.span;
  const s = lerp(IDLE_S, sEnd, m);
  const tx = lerp(1080 - 960 * IDLE_S, AVATAR.cx - FACE.x * s, m);
  const ty = lerp(326 + rise, AVATAR.cy - FACE.y * s, m);
  const r = lerp(1500, AVATAR.d / 2, E.in(m));
  const feather = "linear-gradient(to bottom, #000 0px, #000 770px, transparent 830px)";
  const fade = 1 - ramp(m, 0.82, 1);
  return (
    <div
      style={{
        ...full, opacity: fade, WebkitMaskImage: m > 0 ? undefined : feather, maskImage: m > 0 ? undefined : feather,
        clipPath: m > 0 ? `circle(${r}px at ${AVATAR.cx}px ${lerp(560, AVATAR.cy, m)}px)` : undefined,
      }}
    >
      <div style={{ ...full, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Plate dir="key/hw_sd_idle3_s" ext="png" src={remap(IDLE_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

const AvatarIn: React.FC<{ t: number }> = ({ t }) => {
  const m = morphOf(t);
  if (m < 0.82) return null;
  return <AvatarSkin a={ramp(m, 0.82, 1)} hat={ramp(t, TM.morph + 0.42, TM.morph + 0.62, E.out)} />;
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
        const a = 0.9 * Math.min(1, dt / 0.12) * Math.exp(-dt * 1.6) * (1 - out);
        return (
          <Img
            key={i}
            src={staticFile("img/sparkle_pink.png")}
            style={{
              position: "absolute", left: p.x - p.s, top: p.y - p.s, width: p.s * 2, height: p.s * 2, opacity: a,
              transform: `scale(${0.5 + 0.5 * Math.min(1, dt / 0.2)}) rotate(${dt * 30}deg)`, filter: "hue-rotate(48deg) saturate(1.6) brightness(1.1)",
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
        background: "radial-gradient(ellipse 70% 70% at 1051px 470px, rgba(255,236,214,0.96) 0%, rgba(255,176,102,0.85) 30%, rgba(123,63,224,0.55) 68%, rgba(123,63,224,0) 100%)",
      }}
    />
  );
};

/* ───────────────────── finishing ───────────────────── */

const Finish: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const clean = windowRect(t).a;
  if (clean >= 1) return null;
  return (
    <>
      <div style={{ ...full, opacity: 1 - clean, background: "radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 58%, rgba(10,4,20,0.42) 100%)" }} />
      <Img
        src={staticFile("fx/grain.png")}
        style={{
          position: "absolute", left: -((frame * 137) % 512), top: -((frame * 71) % 512), width: W + 1024, height: H + 1024,
          objectFit: "none", objectPosition: "0 0", mixBlendMode: "overlay", opacity: 0.08 * (1 - clean),
        }}
      />
    </>
  );
};

export const BootHW: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    // lang matters: Chrome picks the CJK fallback face by language, exactly like the client page (lang="zh")
    <AbsoluteFill lang="zh" style={{ background: HC.night, overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hwHblur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22 0" />
        </filter>
      </svg>
      <NightWorld t={t} />
      {t < TM.summon && <MoonBats t={t} cx={1640} cy={140} op={0.8} />}
      <PromptAndIcon t={t} />
      <Summon t={t} />
      <Glint t={t} />
      <SmokeDive t={t} />
      {t >= TM.weave && t < TM.lockup + 0.6 && (
        <>
          <MoonBats t={t} cx={1640} cy={140} op={1 - ramp(t, TM.land, TM.lockup)} />
          <Ghosts
            t={t}
            t0={TM.weave + 0.3}
            t1={TM.lockup + 0.4}
            set={[
              { x: 250, y: 300, s: 0.4, i: 2, dx: 20, op: 0.66 },
              { x: 1700, y: 760, s: 0.38, i: 3, dx: -18, op: 0.6 },
              { x: 1620, y: 250, s: 0.3, i: 1, dx: -10, op: 0.5 },
            ]}
          />
          <Embers t={t} t0={TM.weave} t1={TM.lockup + 0.4} n={28} seed={11} />
        </>
      )}
      <WindowFrame t={t} part="base">
        <LockupLayer t={t} />
      </WindowFrame>
      <Orbit t={t} layer="back" />
      <SpinGirl t={t} />
      <WindowFrame t={t} part="front">
        <IdleGirl t={t} />
        <AvatarIn t={t} />
      </WindowFrame>
      <Orbit t={t} layer="front" />
      <BatSwarm t={t} t0={TM.weave - 0.36} />
      <TentacleWhip t={t} />
      <BatBurst t={t} t0={TM.lockup + 0.02} cx={1051} cy={470} n={10} seed={23} />
      <Bloom t={t} />
      <Finish t={t} frame={frame} />
      <SoundHW />
    </AbsoluteFill>
  );
};
