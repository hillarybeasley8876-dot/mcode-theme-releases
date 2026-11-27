import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Plate, remap } from "../layers/Plate";
import { CHAR_DT, E, FPS, H, TM, TYPE_T0, W, XC, lerp, ramp, seeded, spring01, windowRect } from "./T";
import { Flake, SnowBurst, SnowGust, Snowfall } from "./Snow";
import { Gift, GoldDust, NightWorld, Ornaments, SleighFly, Sprites } from "./Props";
import { CodeCard, CodeCurrents, CodeWall, DiffCard, TermCard } from "./CardsXM";
import { Captions, Disclaimer, INPUT, InputBox, Lockup, Sidebar, TITLE, TitleBar } from "./AppWindowXM";
import { AVATAR, AvatarSkin, Greeting, HOME_INPUT, HomeInput, HomePanelDecor, ProjectStrip, SidePanelButton, UpgradePill } from "./HomeXM";
import { SoundXM } from "./SoundXM";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };
const xm = (p: string) => staticFile(`xm/${p}`);
// the shared sparkle is peach (hue 30); nudge it to candle gold
const GOLDEN = "hue-rotate(12deg) saturate(1.6) brightness(1.2)";

/* ───────────────────── 0 · prompt → star orb → icon → Santa hat → tap ───────────────────── */

const PROMPT = "minimax code";
// The hat art is split in two layers (key/split_hat.py): the pale lining seen through the opening goes BEHIND the
// icon, the fur band and cone in front, so the icon's head sits inside the hat. Both layers share one transform.
const HAT_K = 0.22; // art px -> film px on the 210 px icon
const HAT_W = 760 * HAT_K;
const HAT_H = 660 * HAT_K;
const HAT_AX = 296 / 760; // centre of the fur brim inside the hat image
const HAT_AY = 590 / 660;

const PromptAndIcon: React.FC<{ t: number }> = ({ t }) => {
  if (t > TM.tap + 0.7) return null;
  const cx = 960;
  const cy = 548;
  const pin = ramp(t, 0.04, 0.42, E.out);
  const typed = t < TYPE_T0 ? 0 : Math.min(PROMPT.length, Math.floor((t - TYPE_T0) / CHAR_DT) + 1);
  const dtE = t - TM.enter;
  const press = dtE > 0 ? Math.exp(-dtE * 14) * Math.cos(dtE * 34) : 0;
  const morph = ramp(t, TM.enter + 0.06, TM.icon - 0.04, E.inOut);
  const pillW = lerp(520, 128, morph);
  const pillH = lerp(108, 128, morph);
  // after Enter the frosted pill gathers into a glowing star-lantern orb, which bursts into the app icon
  const orb = ramp(t, TM.enter + 0.02, TM.enter + 0.3, E.out);
  const orbPulse = 1 + 0.06 * Math.sin((t - TM.enter) * 26) * orb * (1 - ramp(t, TM.icon - 0.1, TM.icon));
  const textOp = 1 - ramp(t, TM.enter + 0.04, TM.enter + 0.2, E.soft);
  const caretOn = t < TYPE_T0 + PROMPT.length * CHAR_DT + 0.05 || Math.floor((t - 0.2) * 2.6) % 2 === 0;
  const burst = ramp(t, TM.icon, TM.icon + 0.34, E.out);
  const pillScale = (0.9 + 0.1 * spring01(t - 0.04, 2.4, 0.45)) * (1 - 0.035 * press) * (1 + 0.9 * burst) * orbPulse;

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

  // hat: tumbles down from above and settles, tilted, on the icon's crown.
  // It is two images: hat_back (the lining seen through the opening) is drawn BEHIND the icon and hat_front
  // (fur band + cone) in front, so the icon's head is inside the hat instead of lying under the whole thing.
  const fall = ramp(t, TM.hat - 0.4, TM.hat, E.in);
  const hatAnchorY = iconTop + 43.4 + 26 * (1 - iconS) + (dH > 0 ? -10 * hatSq : 0);
  const hatY = lerp(-HAT_H * HAT_AY - 160, hatAnchorY - HAT_H * HAT_AY, fall);
  const hatRot = lerp(-42, -6, fall) + (dH > 0 ? 5 * hatSq : 0);
  const hatScale = iconS * (1 + 0.12 * Math.max(0, hatSq));
  const hatStyle: React.CSSProperties = {
    position: "absolute", left: cx + 1.2 - HAT_W * HAT_AX, top: hatY, width: HAT_W, height: HAT_H,
    transformOrigin: `${HAT_AX * 100}% ${HAT_AY * 100}%`, transform: `rotate(${hatRot}deg) scale(${hatScale})`,
    opacity: 1 - ramp(t, TM.tap + 0.14, TM.tap + 0.42), filter: `blur(${melt * 10}px)`,
  };

  // tentacle rises from the bottom right, winds up, taps the icon's flank, retracts
  const tip0 = { x: 1380, y: 1320 };
  const tipA = { x: 1102, y: 676 };
  const tipW = { x: 1124, y: 708 };
  const tipC = { x: 1018, y: 596 };
  const a1 = ramp(t, TM.hat + 0.08, TM.hat + 0.4, E.out);
  const a2 = ramp(t, TM.hat + 0.4, TM.hat + 0.48, E.soft);
  const a3 = ramp(t, TM.hat + 0.48, contact, E.inOut);
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
          {/* warm light the pill throws on the snow below it */}
          <div
            style={{
              position: "absolute", left: cx - 420, top: cy + 30, width: 840, height: 170, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(242,184,75,0.26), rgba(242,184,75,0))",
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
                background: "linear-gradient(180deg, rgba(26,52,78,0.95) 0%, rgba(10,24,40,0.95) 100%)",
                border: "1.5px solid rgba(255,217,138,0.62)", boxSizing: "border-box",
                boxShadow: "0 0 0 1px rgba(242,184,75,0.16), 0 0 46px rgba(242,184,75,0.3), 0 22px 60px rgba(1,6,12,0.65), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            />
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: pillH / 2, opacity: orb,
                background: "radial-gradient(circle at 42% 36%, #fffbe6 0%, #ffe3a0 22%, #f2b84b 55%, #b9741a 100%)",
                boxShadow: `0 0 ${50 + 70 * orb}px rgba(242,184,75,0.8), 0 0 ${140 * orb}px rgba(229,72,77,0.42)`,
              }}
            />
            <div
              style={{
                position: "absolute", left: 40, top: 0, height: pillH, display: "flex", alignItems: "center",
                fontFamily: '"JetBrains Mono", monospace', fontSize: 40, color: "#fff6e2", opacity: textOp, whiteSpace: "pre",
                textShadow: "0 0 14px rgba(255,217,138,0.4)",
              }}
            >
              <span style={{ color: XC.gold, marginRight: 16 }}>›</span>
              <span>{PROMPT.slice(0, typed)}</span>
              <span style={{ display: "inline-block", width: 3, height: 44, marginLeft: 5, background: XC.gold, opacity: caretOn ? 1 : 0, boxShadow: `0 0 10px ${XC.gold}` }} />
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
              background: "radial-gradient(closest-side, rgba(242,184,75,0.34), rgba(242,184,75,0))",
              opacity: pop * (1 - melt), transform: `scale(${0.6 + 0.4 * pop - bob * 0.01})`,
            }}
          />
          {/* the lining seen through the hat's opening stays behind the icon's head */}
          {t > TM.hat - 0.4 && <Img src={xm("hat_back.png")} style={hatStyle} />}
          <Img
            src={staticFile("brand/homeLogo.8c4fa240.png")}
            style={{
              position: "absolute", left: cx - size / 2, top: iconTop, width: size, height: size, transformOrigin: "50% 80%",
              transform: `scale(${iconS * (1 + 0.2 * sq)}, ${iconS * (1 - 0.24 * sq)}) rotate(${4 * sq}deg)`,
              opacity: Math.min(1, pop * 3) * (1 - ramp(t, TM.tap + 0.14, TM.tap + 0.42)),
              filter: `blur(${melt * 10}px) drop-shadow(0 10px 26px rgba(242,184,75,${0.4 * (1 - melt)}))`,
            }}
          />
          {t > TM.hat - 0.4 && (
            <Img src={xm("hat_front.png")} style={{ ...hatStyle, filter: `${hatStyle.filter} drop-shadow(0 8px 14px rgba(1,6,12,0.5))` }} />
          )}
          <HatPoof t={t} x={cx} y={iconTop + 22} />
        </>
      )}
      {t > TM.hat + 0.08 && a4 < 1 && (
        <Img
          src={staticFile("img/tentacle_tap.png")}
          style={{
            position: "absolute", left: tx - 702 * TS, top: ty - 216 * TS, width: 1133 * TS, height: 1700 * TS,
            transformOrigin: `${702 * TS}px ${216 * TS}px`, transform: `rotate(${tRot}deg)`,
            filter: "drop-shadow(0 18px 30px rgba(1,6,12,0.45))",
          }}
        />
      )}
    </>
  );
};

/** The star orb bursting into the app icon: an expanding ring, a flash, sparks and snow crystals. */
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
          border: `${3 + 5 * (1 - k)}px solid rgba(255,217,138,${0.9 * (1 - k)})`, boxSizing: "border-box",
          boxShadow: `0 0 30px rgba(242,184,75,${0.6 * (1 - k)}), inset 0 0 30px rgba(242,184,75,${0.4 * (1 - k)})`,
        }}
      />
      <div
        style={{
          position: "absolute", left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", mixBlendMode: "screen",
          background: "radial-gradient(closest-side, rgba(255,250,230,0.95), rgba(242,184,75,0.5) 40%, rgba(242,184,75,0))",
          opacity: 1 - ramp(dt, 0.02, 0.32, E.soft),
        }}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const ang = (i / 12) * Math.PI * 2 + seeded(i + 40) * 0.4;
        const d = 60 + (220 + 120 * seeded(i + 9)) * k;
        const s = 26 + 18 * seeded(i + 21);
        const px = x + Math.cos(ang) * d;
        const py = y + Math.sin(ang) * d * 0.8;
        const op = 1 - ramp(dt, 0.25, 0.7);
        if (i % 2)
          return (
            <div key={i} style={{ position: "absolute", left: px - s * 0.45, top: py - s * 0.45, opacity: op, transform: `rotate(${dt * 200 + i * 25}deg)`, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))" }}>
              <Flake size={s * 0.9} />
            </div>
          );
        return (
          <Img
            key={i}
            src={staticFile("img/sparkle_pink.png")}
            style={{ position: "absolute", left: px - s / 2, top: py - s / 2, width: s, height: s, opacity: op, filter: GOLDEN, transform: `rotate(${dt * 160 + i * 25}deg)` }}
          />
        );
      })}
    </>
  );
};

/** A puff of snow where the hat lands. */
const HatPoof: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const dt = t - TM.hat;
  if (dt < 0 || dt > 0.6) return null;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const ang = -Math.PI * (0.06 + 0.88 * (i / 8));
        const d = 40 + 96 * ramp(dt, 0, 0.45, E.out);
        const s = 30 + 18 * seeded(i + 4);
        const a = (1 - ramp(dt, 0.15, 0.6)) * Math.min(1, dt / 0.05);
        const px = x + Math.cos(ang) * d * 1.5;
        const py = y + Math.sin(ang) * d;
        if (i % 3 === 1)
          return (
            <div key={i} style={{ position: "absolute", left: px - s * 0.4, top: py - s * 0.4, opacity: a, transform: `rotate(${dt * 180 + i * 30}deg)`, filter: "drop-shadow(0 0 5px rgba(255,255,255,0.7))" }}>
              <Flake size={s * 0.8} />
            </div>
          );
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: px - s / 2, top: py - s / 2, width: s, height: s, borderRadius: "50%", opacity: a * 0.9,
              background: "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(238,246,255,0.5) 50%, rgba(238,246,255,0))", transform: `scale(${1 + dt * 1.2})`,
            }}
          />
        );
      })}
    </>
  );
};

/* ───────────────────── 1 · snow flurry dive ───────────────────── */

const SpeedLines: React.FC<{ t: number; t0: number; cx: number; cy: number }> = ({ t, t0, cx, cy }) => {
  if (t < t0 || t > t0 + 0.75) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 34 }, (_, i) => {
        const r1 = seeded(i * 3.7 + 2), r2 = seeded(i * 6.1 + 5), r3 = seeded(i * 1.3 + 9);
        const ta = t0 + 0.3 * r1;
        const k = ramp(t, ta, ta + 0.3 + 0.12 * r2, E.in);
        if (k <= 0 || k >= 1) return null;
        const ang = (i / 34) * Math.PI * 2 + r3 * 0.2;
        const r0 = 90 + 1250 * k;
        const len = 40 + 420 * k;
        return (
          <line
            key={i} x1={cx + Math.cos(ang) * r0} y1={cy + Math.sin(ang) * r0 * 0.8} x2={cx + Math.cos(ang) * (r0 + len)} y2={cy + Math.sin(ang) * (r0 + len) * 0.8}
            stroke="#f4f9ff" strokeWidth={1.2 + 2.6 * k} strokeLinecap="round" opacity={0.75 * Math.sin(Math.PI * Math.min(1, k * 1.15))}
          />
        );
      })}
    </svg>
  );
};

const SnowDive: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.tap || t > TM.summon + 0.9) return null;
  const cx = 960;
  const cy = 560;
  const puff = ramp(t, TM.tap + 0.02, TM.summon - 0.2, E.out);
  const cloud = ramp(t, TM.tap + 0.1, TM.summon - 0.02, E.inOut);
  const dive = ramp(t, TM.tap + 0.15, TM.summon + 0.5, E.inOut);
  // the flurry parts from the centre outward over about half a second, with a fairly crisp edge
  const open = ramp(t, TM.summon - 0.36, TM.summon + 0.3, E.inOut);
  const R = 1500 * open;
  const hole = open > 0 ? `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 170}px)` : undefined;
  const glow = ramp(t, TM.tap, TM.tap + 0.25, E.soft) * (1 - open);
  const flare = ramp(open, 0, 0.06) * (1 - ramp(open, 0.1, 0.5, E.soft));
  // the generated clouds are coloured smoke; as snow only their billowing shape is kept, in white
  const icy = "brightness(0) invert(1) drop-shadow(0 0 40px rgba(210,230,255,0.7))";
  return (
    <>
      <div
        style={{
          ...full, opacity: glow, mixBlendMode: "screen",
          background: `radial-gradient(ellipse 48% 54% at ${cx}px ${cy}px, rgba(255,236,190,0.6), rgba(242,184,75,0.14) 55%, rgba(242,184,75,0) 75%)`,
        }}
      />
      <div style={{ ...full, WebkitMaskImage: hole, maskImage: hole }}>
        <div style={{ ...full, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.85 * dive})` }}>
          {/* the whiteout itself: a soft wall of snow that swells from the icon, a shade cooler than the billows on it */}
          <div
            style={{
              position: "absolute", left: cx - 1300, top: cy - 1300, width: 2600, height: 2600, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(238,245,253,0.98) 0%, rgba(218,232,248,0.95) 45%, rgba(198,218,242,0.62) 72%, rgba(198,218,242,0) 100%)",
              opacity: Math.min(1, cloud * 1.5), transform: `scale(${0.06 + 0.94 * cloud})`,
            }}
          />
          <Img
            src={xm("snow_b.png")}
            style={{
              position: "absolute", left: cx - 900, top: cy - 900, width: 1800, height: 1800, opacity: Math.min(1, puff * 2.4) * (1 - 0.35 * cloud),
              transform: `scale(${0.12 + 1.25 * puff}) rotate(${-4 + 26 * puff}deg)`, filter: icy,
            }}
          />
          <Img
            src={xm("snow_a.png")}
            style={{
              position: "absolute", left: cx - 1100, top: cy - 1100, width: 2200, height: 2200,
              opacity: Math.min(1, cloud * 2.2) * 0.9, transform: `scale(${0.14 + 1.75 * cloud}) rotate(${18 - 30 * cloud}deg)`, filter: icy,
            }}
          />
        </div>
        <SpeedLines t={t} t0={TM.tap + 0.1} cx={cx} cy={cy} />
      </div>
      {/* the parting edge is lit from inside by her lantern, so thinning snow reads as glowing, not grey */}
      {open > 0 && open < 1 && (
        <div
          style={{
            ...full, mixBlendMode: "screen", opacity: 1 - open * open,
            background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,240,205,0) ${Math.max(0, R - 40)}px, rgba(255,244,216,0.78) ${R + 70}px, rgba(255,255,255,0) ${R + 250}px)`,
          }}
        />
      )}
      {open > 0 && open < 0.5 && (
        <>
          <div
            style={{
              position: "absolute", left: cx - 300, top: cy - 300, width: 600, height: 600, borderRadius: "50%", mixBlendMode: "screen",
              background: "radial-gradient(closest-side, rgba(255,252,238,0.98), rgba(255,236,190,0.6) 45%, rgba(255,236,190,0))",
              opacity: flare, transform: `scale(${0.5 + 1.3 * open})`,
            }}
          />
          <Img
            src={staticFile("img/sparkle_big.png")}
            style={{
              position: "absolute", left: cx - 260, top: cy - 260, width: 520, height: 520, mixBlendMode: "screen", opacity: flare,
              transform: `scale(${0.7 + 2.2 * open}) rotate(${open * 50}deg)`, filter: "hue-rotate(28deg) saturate(1.2)",
            }}
          />
        </>
      )}
      <SnowBurst t={t} t0={TM.snow} cx={cx} cy={cy} n={20} big />
    </>
  );
};

/* ───────────────────── 2 · summon ───────────────────── */

const SUMMON_MAP: Array<[number, number]> = [[TM.summon, 0.95], [TM.summon + 0.75, 2.55], [TM.glint, 4.95]];

// hung clear of the moon (x 1625..1775) and of the space above her head
const SUMMON_ORNAMENTS = [
  { x: 262, len: 34, s: 0.44, i: 0, d: 0.0 },
  { x: 462, len: 6, s: 0.34, i: 4, blur: 0.8, d: 0.14 },
  { x: 646, len: 0, s: 0.25, i: 2, blur: 1.3, d: 0.26 },
  { x: 1540, len: 22, s: 0.42, i: 1, d: 0.07 },
  { x: 1368, len: 6, s: 0.34, i: 3, blur: 0.8, d: 0.2 },
  { x: 1250, len: 0, s: 0.25, i: 0, blur: 1.3, d: 0.32 },
  { x: 1862, len: 58, s: 0.36, i: 2, d: 0.12 },
];

const Summon: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.summon - 0.3 || t >= TM.glint) return null;
  const src = remap(SUMMON_MAP, t);
  const arrive = ramp(t, TM.summon - 0.3, TM.summon + 0.95, E.out);
  const s = lerp(1.32, 0.94, arrive) * (1 + 0.04 * ramp(t, TM.summon + 0.8, TM.glint, E.inOut));
  // while she rises out of the snow her lower half is soft; once she has arrived the whole outfit shows
  const settle = ramp(t, TM.summon + 0.55, TM.summon + 1.25, E.soft);
  const feather = `linear-gradient(to bottom, #000 0px, #000 ${lerp(800, 1034, settle)}px, transparent ${lerp(1050, 1079, settle)}px)`;
  // a breath of aurora light behind her as she arrives; it is gone once she has settled
  const aura = ramp(t, TM.summon - 0.3, TM.summon + 0.05) * (1 - ramp(t, TM.summon + 0.35, TM.summon + 1.3, E.soft));
  return (
    <>
      <div
        style={{
          ...full, opacity: aura, mixBlendMode: "screen",
          background: "radial-gradient(ellipse 38% 52% at 960px 560px, rgba(140,240,205,0.4), rgba(90,170,220,0.14) 58%, rgba(90,170,220,0) 84%)",
        }}
      />
      <Ornaments t={t} t0={TM.summon + 0.1} t1={TM.glint} set={SUMMON_ORNAMENTS} />
      <Sprites
        t={t}
        t0={TM.summon + 0.5}
        t1={TM.glint}
        set={[
          { x: 318, y: 560, s: 0.5, i: 0, dx: 12 },
          { x: 1612, y: 520, s: 0.46, i: 1, dx: -10, flip: true },
          { x: 548, y: 318, s: 0.28, i: 4, dx: 8, op: 0.8 },
        ]}
      />
      <CodeCurrents t={t} t0={TM.currents} t1={TM.glint} />
      <div style={{ ...full, transformOrigin: "960px 600px", transform: `scale(${s})`, WebkitMaskImage: feather, maskImage: feather, opacity: ramp(t, TM.summon - 0.3, TM.summon - 0.12) }}>
        <Plate dir="key/xm2_sd_summon_k4" ext="png" src={src} first={0} last={144} />
      </div>
      <GoldDust t={t} t0={TM.summon} t1={TM.glint} n={36} seed={5} />
      {/* presents in the snow at both corners, whole inside the frame */}
      <Gift i={2} x={184} y={932} h={248} t={t} blur={2.2} op={ramp(t, TM.summon + 0.1, TM.summon + 0.7)} rot={-4} />
      <Gift i={1} x={366} y={944} h={224} t={t} blur={1.4} op={ramp(t, TM.summon + 0.16, TM.summon + 0.76)} rot={2} />
      <Gift i={0} x={1766} y={932} h={248} t={t} blur={2.2} op={ramp(t, TM.summon + 0.2, TM.summon + 0.8)} rot={5} />
    </>
  );
};

/* ───────────────────── 3 · glint close-up ───────────────────── */

// xm3_sd_glint (take 4b): her fingertip is on the bridge from source 1.08 s, pushes the glasses up 1.75-2.00 s, the
// lenses flash from frame 49 (2.042 s) and her hand drops from 2.9 s. The flash lands on TM.glintFlash (the glint
// cue in SoundXM); before it the plate runs at real speed, so the push reads as one deliberate move.
const GLINT_MAP: Array<[number, number]> = [[TM.glint, 1.45], [TM.glintFlash, 2.06], [TM.weave, 3.05]];
const LENS = { x: 1020, y: 373 }; // centre of her left lens at the flash, clear of the pushing finger

const BOKEH = Array.from({ length: 16 }, (_, i) => {
  const r1 = seeded(i * 2.9 + 1), r2 = seeded(i * 5.3 + 2), r3 = seeded(i * 7.7 + 3);
  // fairy lights out of focus, kept to the sides so her face stays clear
  const side = i % 2 === 0;
  return {
    x: side ? 60 + 420 * r1 : 1440 + 420 * r1, y: 80 + 900 * r2, r: 26 + 58 * r3,
    c: ["255,214,130", "255,143,122", "143,227,176", "255,244,214"][i % 4], o: 0.14 + 0.2 * r2, ph: r3 * 6.28,
  };
});

const Glint: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.glint || t >= TM.weave) return null;
  const src = remap(GLINT_MAP, t);
  const z = 1 + 0.05 * ramp(t, TM.glint, TM.weave, E.soft);
  const f = ramp(t, TM.glintFlash - 0.06, TM.glintFlash + 0.05, E.out) * (1 - ramp(t, TM.glintFlash + 0.05, TM.glintFlash + 0.32, E.soft));
  return (
    <>
      <div style={{ ...full, background: "radial-gradient(ellipse 80% 80% at 50% 45%, rgba(18,42,72,0.94), rgba(4,11,22,0.98))" }} />
      {BOKEH.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: b.x - b.r + 14 * Math.sin(t * 0.8 + b.ph), top: b.y - b.r - 22 * (t - TM.glint), width: b.r * 2, height: b.r * 2, borderRadius: "50%",
            background: `radial-gradient(closest-side, rgba(${b.c},0.9), rgba(${b.c},0.55) 70%, rgba(${b.c},0))`, opacity: b.o * (0.75 + 0.25 * Math.sin(t * 5 + b.ph)), filter: "blur(5px)",
          }}
        />
      ))}
      <CodeWall t={t} />
      <div style={{ ...full, transformOrigin: `${LENS.x}px ${LENS.y}px`, transform: `scale(${z})` }}>
        <Plate dir="key/xm3_sd_glint_k4" ext="png" src={src} first={0} last={96} />
      </div>
      <Img
        src={staticFile("img/sparkle_big.png")}
        style={{
          position: "absolute", left: LENS.x - 260, top: LENS.y - 260, width: 520, height: 520, mixBlendMode: "screen",
          opacity: f, transform: `scale(${0.4 + 0.9 * f}) rotate(${(t - TM.glintFlash) * 40}deg)`, filter: "hue-rotate(28deg) saturate(1.3)",
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
      style={{ position: "absolute", left: x, top: 540 - 760, width: 2900 * 1.25, height: 1243 * 1.25, transform: "rotate(-7deg)", filter: "url(#xmHblur)" }}
    />
  );
};

/** The gust whites the frame out for an instant, which is where the close-up cuts to the spin. */
const GustVeil: React.FC<{ t: number }> = ({ t }) => {
  const a = ramp(t, TM.weave - 0.15, TM.weave - 0.01, E.in) * (1 - ramp(t, TM.weave + 0.02, TM.weave + 0.3, E.soft));
  if (a <= 0) return null;
  return <div style={{ ...full, opacity: 0.9 * a, background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.98), rgba(226,240,255,0.9))" }} />;
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
    case "code": return <CodeCard reveal={ramp(t, TM.weave + 0.25, TM.weave + 1.1, E.soft)} />;
    case "term": return <TermCard reveal={ramp(t, TM.weave + 0.35, TM.weave + 1.05, E.soft)} />;
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

// these only ever pass behind her; the terminal and the composer are the two that swing in front,
// and both ride below her waist, so nothing crosses her face or chest
const BEHIND_ONLY: CardId[] = ["code", "title", "diff", "sidebar"];

const cardState = (c: (typeof CARDS)[number], i: number, t: number) => {
  const spin = 230 * ramp(t, TM.weave + 0.065, L0 - 0.04, E.soft);
  const th = ((c.th0 + spin) * Math.PI) / 180;
  const cx = 960 + 91 * ramp(t, L0 - 0.63, L0 + 0.26, E.inOut);
  const cy = 540;
  const rx = 640;
  const rz = 460;
  const behind = BEHIND_ONLY.includes(c.id);
  const appear = spring01(t - (TM.weave + 0.12 + i * 0.07), 1.9, 0.5);
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

const SPIN_MAP: Array<[number, number]> = [[TM.weave, 0.5], [TM.lockup, 4.6]];

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
      <div style={{ ...full, transformOrigin: "960px 540px", transform: `translate(${x - 960}px, ${y - 540}px) scale(${s})` }}>
        <Plate dir="key/xm2_sd_spin_k4" ext="png" src={remap(SPIN_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

/* ───────────────────── 5 · window, lockup, handoff ───────────────────── */

const landed = (id: CardId, t: number) => t >= CARDS.find((x) => x.id === id)!.land![1];

/** An eight-pointed Christmas star growing from behind her: the window is revealed through it.
 * First a small whole star, then it sweeps out past the window's edges. */
const starPoints = (cx: number, cy: number, R: number, rot: number, n = 8, inner = 0.62) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = rot + (i * Math.PI) / n;
    const r = i % 2 === 0 ? R : R * inner;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
const STAR_END = TM.land + 0.56;
const starRadius = (t: number) => lerp(36, 430, ramp(t, TM.land - 0.02, TM.land + 0.14, E.out)) + 1950 * ramp(t, TM.land + 0.1, STAR_END, E.inOut);
const starRot = (t: number) => -Math.PI / 2 + 0.6 * ramp(t, TM.land - 0.02, STAR_END, E.soft);

const morphOf = (t: number) => ramp(t, TM.morph, TM.morph + 0.6, E.inOut);
// she shrinks into the avatar first, then the composer rises through the space she left (it never covers her)
const girlMorph = (t: number) => ramp(t, TM.morph, TM.morph + 0.42, E.inOut);
const inputMorph = (t: number) => ramp(t, TM.morph + 0.12, TM.morph + 0.6, E.inOut);

const MorphInput: React.FC<{ t: number }> = ({ t }) => {
  if (!landed("input", t)) return null;
  const m = inputMorph(t);
  const glow = ramp(t, TM.lockup - 0.05, TM.lockup + 0.15) * (1 - ramp(t, TM.lockup + 0.3, TM.lockup + 1.0, E.soft));
  if (m <= 0) return <InputBox glow={glow} />;
  if (m >= 1) return <HomeInput t={t} sprite={ramp(t, TM.morph + 0.62, TM.morph + 0.9, E.out)} block={ramp(t, TM.morph + 0.6, TM.morph + 0.8, E.soft)} />;
  const x = lerp(INPUT.x, HOME_INPUT.x, m), y = lerp(INPUT.y, HOME_INPUT.y, m);
  const w = lerp(INPUT.w, HOME_INPUT.w, m), h = lerp(INPUT.h, HOME_INPUT.h, m);
  const oldA = 1 - ramp(m, 0.05, 0.7), newA = ramp(m, 0.3, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 20, background: XC.ui.card, border: `1px solid ${XC.ui.border}`, boxSizing: "border-box", boxShadow: "0 18px 50px #01060c99", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -INPUT.x - 1, top: -INPUT.y - 1, opacity: oldA }}><InputBox /></div>
      <div style={{ position: "absolute", left: -HOME_INPUT.x - 1, top: -HOME_INPUT.y - 1, opacity: newA }}><HomeInput t={t} sprite={0} block={0} /></div>
    </div>
  );
};

const WindowFrame: React.FC<{ t: number; part: "base" | "front"; children?: React.ReactNode }> = ({ t, part, children }) => {
  if (t < TM.land) return null;
  const R = windowRect(t);
  const radius = 16 * (1 - R.a);
  const cxW = (1051 - R.x) / R.k;
  const cyW = (467 - R.y) / R.k;
  const pulse = t < TM.growStart ? 1 + 0.012 * Math.exp(-(t - TM.lockup) * 5) * (t > TM.lockup ? Math.sin((t - TM.lockup) * 14) : 0) : 1;
  // the star opens on the plain night panel (a clear graphic shape); the forest then comes up inside the
  // window as the star finishes, so by the lockup the window is already the start page's scene
  const decor = ramp(t, TM.land + 0.28, TM.lockup + 0.05, E.soft);
  const star = t < STAR_END ? starPoints(cxW, cyW, starRadius(t), starRot(t)) : null;
  const clip = star ? `polygon(${star.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})` : undefined;
  const ring = 1 / R.k;
  return (
    <div style={{ position: "absolute", left: R.x, top: R.y, width: W, height: H, transformOrigin: "0 0", transform: `scale(${R.k * pulse})` }}>
      {part === "base" ? (
        <>
          <div
            style={{
              ...full, borderRadius: radius / R.k, overflow: "hidden", background: XC.ui.main, clipPath: clip,
              boxShadow: `0 40px 120px rgba(242,184,75,${0.18 * (1 - R.a)}), 0 0 0 ${ring}px rgba(227,238,255,${0.12 * (1 - R.a)}), inset 0 0 0 ${ring}px rgba(227,238,255,${0.1 * (1 - R.a)})`,
            }}
          >
            <HomePanelDecor a={decor} t={t} />
            {star && (
              <div
                style={{
                  ...full, opacity: 1 - ramp(t, TM.land + 0.14, TM.land + 0.42),
                  background: `radial-gradient(circle at ${cxW}px ${cyW}px, rgba(255,214,130,0.5) 0px, rgba(242,184,75,0.2) 260px, rgba(242,184,75,0) 520px)`,
                }}
              />
            )}
            {landed("sidebar", t) && <Sidebar t={t} decor={decor} />}
            {landed("title", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.3) }}><TitleBar /></div>}
            <Captions />
            {children}
            {t >= TM.morph && <UpgradePill a={ramp(t, TM.morph + 0.3, TM.morph + 0.65, E.soft)} />}
            {t >= TM.morph && <SidePanelButton a={ramp(t, TM.morph + 0.3, TM.morph + 0.65, E.soft)} />}
            {t >= TM.morph && <Greeting a={ramp(t, TM.morph + 0.46, TM.morph + 0.8, E.out)} />}
          </div>
          {star && (
            // the star's gold rim (kept inside the window), bright while it is small and gone once it has opened
            <div style={{ ...full, borderRadius: radius / R.k, overflow: "hidden", opacity: 1 - ramp(t, TM.land + 0.22, TM.land + 0.52) }}>
              <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 0 14px rgba(242,184,75,0.9))" }}>
                <polygon points={star.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke={XC.candle} strokeWidth={4 / R.k} strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </>
      ) : (
        <div style={{ ...full, borderRadius: radius / R.k, overflow: "hidden" }}>
          {children}
          <MorphInput t={t} />
          {/* like the client's DOM order: the workspace strip paints over the composer's drop shadow */}
          {t >= TM.morph && <div style={{ opacity: ramp(t, TM.morph + 0.6, TM.morph + 0.8, E.soft) }}><ProjectStrip /></div>}
          {landed("input", t) && morphOf(t) < 1 && <div style={{ opacity: 1 - ramp(t, TM.morph, TM.morph + 0.25) }}><Disclaimer /></div>}
        </div>
      )}
    </div>
  );
};

// idle plate: full body; her face sits at (930, 212) in plate pixels
const FACE = { x: 930, y: 212, span: 205 };
const IDLE_MAP: Array<[number, number]> = [[TM.lockup, 0.3], [TM.duration, 0.3 + TM.duration - TM.lockup]];
const IDLE_S = 0.6;

const IdleGirl: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.lockup) return null;
  const m = girlMorph(t);
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
        ...full, opacity: fade, WebkitMaskImage: feather, maskImage: feather,
        clipPath: m > 0 ? `circle(${r}px at ${AVATAR.cx}px ${lerp(560, AVATAR.cy, m)}px)` : undefined,
      }}
    >
      <div style={{ ...full, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Plate dir="key/xm2_sd_idle_k4" ext="png" src={remap(IDLE_MAP, t)} first={0} last={120} />
      </div>
    </div>
  );
};

const AvatarIn: React.FC<{ t: number }> = ({ t }) => {
  const m = girlMorph(t);
  if (m < 0.82) return null;
  return <AvatarSkin a={ramp(m, 0.82, 1)} hat={ramp(t, TM.morph + 0.42, TM.morph + 0.62, E.out)} />;
};

const LockupLayer: React.FC<{ t: number }> = ({ t }) => {
  if (t < TM.lockup) return null;
  const word = ramp(t, TM.lockup + 0.08, TM.lockup + 0.58, E.out);
  const line = ramp(t, TM.lockup + 0.28, TM.lockup + 0.73, E.out);
  const out = ramp(t, TM.morph - 0.08, TM.morph + 0.16, E.in);
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
              transform: `scale(${0.5 + 0.5 * Math.min(1, dt / 0.2)}) rotate(${dt * 30}deg)`, filter: GOLDEN,
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
        background: "radial-gradient(ellipse 70% 70% at 1051px 470px, rgba(255,252,240,0.97) 0%, rgba(255,226,158,0.86) 30%, rgba(242,184,75,0.34) 68%, rgba(242,184,75,0) 100%)",
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
      <div style={{ ...full, opacity: 1 - clean, background: "radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 58%, rgba(1,6,14,0.45) 100%)" }} />
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

export const BootXM: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // when the window lands the forest behind it drops out of focus, so the window reads as the subject
  const pull = ramp(t, TM.land - 0.15, TM.land + 0.35, E.soft);
  return (
    // lang matters: Chrome picks the CJK fallback face by language, exactly like the client page (lang="zh")
    <AbsoluteFill lang="zh" style={{ background: XC.night, overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="xmHblur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22 0" />
        </filter>
      </svg>
      <div style={{ ...full, filter: pull > 0 ? `blur(${5 * pull}px) brightness(${1 - 0.38 * pull})` : undefined }}>
        <NightWorld t={t} />
        {t < TM.tap && <SleighFly t={t} />}
        <Snowfall t={t} layer="back" />
      </div>
      <PromptAndIcon t={t} />
      <Summon t={t} />
      <Glint t={t} />
      <SnowDive t={t} />
      {t >= TM.weave && t < TM.lockup + 0.6 && (
        <>
          <Sprites
            t={t}
            t0={TM.weave + 0.3}
            t1={TM.land + 0.25}
            set={[
              { x: 236, y: 300, s: 0.4, i: 2, dx: 20, op: 0.8 },
              { x: 1716, y: 770, s: 0.38, i: 3, dx: -18, op: 0.78, flip: true },
              { x: 1640, y: 262, s: 0.3, i: 1, dx: -10, op: 0.66, flip: true },
            ]}
          />
          <GoldDust t={t} t0={TM.weave} t1={TM.lockup + 0.4} n={28} seed={11} />
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
      <Snowfall t={t} layer="front" op={1 - ramp(t, TM.glint - 0.2, TM.glint) + ramp(t, TM.weave + 0.2, TM.weave + 0.6) * (1 - ramp(t, TM.land - 0.3, TM.land))} />
      <SnowGust t={t} t0={TM.weave - 0.36} />
      <TentacleWhip t={t} />
      <GustVeil t={t} />
      <SnowBurst t={t} t0={TM.lockup + 0.02} cx={1051} cy={470} n={10} seed={23} fast />
      <Bloom t={t} />
      <Finish t={t} frame={frame} />
      <SoundXM />
    </AbsoluteFill>
  );
};
