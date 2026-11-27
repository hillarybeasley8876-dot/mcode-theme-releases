import React from "react";
import { Img, staticFile } from "remotion";
import { XC } from "./T";
import { PanelGlyph, UI_FONT } from "./AppWindowXM";
import { IconChevron, IconFolder, IconLaptop, IconMic, IconPlus } from "../ui/icons";

/* The real MiniMax Code 3.1.14 start page at 1920x1080 with the Christmas skin installed.
 * Every position below was measured from the live client (DOM rects at a 1920x1080 client);
 * the decoration uses the very same background rules and images as christmas.css. */

export const HOME_INPUT = { x: 724.5, y: 384, w: 711, h: 110 };
export const AVATAR = { x: 1052, y: 245, d: 56, cx: 1080, cy: 273 };
const U = XC.ui;
const sk = (f: string) => `url(${staticFile(`xm/skin/${f}`)})`;
const ui = (size: number, color: string = U.text): React.CSSProperties => ({ fontFamily: UI_FONT, fontSize: size, fontWeight: 430, color, whiteSpace: "nowrap" });

/** The night forest behind the start page: gifts and lantern, the sleigh on the moon, slow snow
 * (== christmas.css home-panel-body, including the two looping snow tiles). */
export const HomePanelDecor: React.FC<{ a?: number; t?: number }> = ({ a = 1, t = 0 }) => (
  <div
    style={{
      position: "absolute", left: 240, top: 40, width: 1680, height: 1040, opacity: a, overflow: "hidden",
      backgroundColor: U.main,
      backgroundImage: [
        sk("gifts.webp"),
        "radial-gradient(ellipse 300px 84px at calc(100% - 186px) calc(100% - 24px), #f2b84b38 0%, #f2b84b00 100%)",
        "linear-gradient(to bottom, #07131f 0px, #07131f00 110px)",
        "radial-gradient(ellipse 46% 36% at 50% 30%, #07131f99 0%, #07131f00 72%)",
        "linear-gradient(#07131f4d, #07131f4d)",
        sk("xm_home_bg.webp"),
      ].join(", "),
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 36px bottom 12px, center, center, center, center, right top",
      backgroundSize: "300px auto, 100% 100%, 100% 100%, 100% 100%, 100% 100%, cover",
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: -360, bottom: 0, background: `${sk("xm_snow_a.svg")} 0 0 / 360px 360px repeat`, transform: `translateY(${((t / 17) * 360) % 360}px)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: -520, bottom: 0, background: `${sk("xm_snow_b.svg")} 0 0 / 520px 520px repeat`, opacity: 0.85, transform: `translateY(${((t / 29) * 520) % 520}px)` }} />
  </div>
);

const S: React.FC<{ size?: number; color?: string; children: React.ReactNode }> = ({ size = 18, color = U.text, children }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const IconRedo: React.FC<{ color?: string }> = ({ color }) => (
  <S color={color}>
    <path d="M14.2 5.4A6 6 0 1 0 15 10" />
    <path d="M14.6 2.6v3.2h-3.2" />
  </S>
);

/** The composer on its night-coloured block (the client's message-input-home-container). No focus
 * ring and no placeholder: during the handoff the launcher owns the foreground, and the client's
 * placeholder line changes from launch to launch. */
export const HomeInput: React.FC<{ t?: number; sprite?: number; block?: number }> = ({ t = 0, sprite = 1, block = 1 }) => {
  const ph = (Math.sin((t / 4.6) * 2 * Math.PI) + 1) / 2;
  const rest = "0 0 0 1px #f2b84b1f, 0 18px 50px #01060c99, 0 0 90px -20px #f2b84b3d";
  return (
    <div style={{ position: "absolute", left: HOME_INPUT.x, top: HOME_INPUT.y, width: HOME_INPUT.w, height: HOME_INPUT.h }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: HOME_INPUT.w, height: 148, borderRadius: 20, background: U.main, opacity: block }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: U.card, border: `1px solid ${U.border}`, boxSizing: "border-box", boxShadow: rest }} />
      <div style={{ position: "absolute", left: 15, top: 77 }}><IconPlus color={U.text} /></div>
      <div style={{ position: "absolute", left: 51, top: 77 }}><IconRedo color={U.sub} /></div>
      <div style={{ ...ui(13, U.sub), position: "absolute", left: 73, top: 76.7, lineHeight: "18.6px" }}>始终授权</div>
      <div style={{ ...ui(13), position: "absolute", left: 517.3, top: 76.7, lineHeight: "18.6px" }}>M3.1-Flash</div>
      <div style={{ ...ui(11, U.muted), position: "absolute", left: 584, top: 78, lineHeight: "16px" }}>max</div>
      <div style={{ position: "absolute", left: 610, top: 78 }}><IconChevron size={16} color={U.muted} /></div>
      <div style={{ position: "absolute", left: 644, top: 77 }}><IconMic size={18} color={U.text} /></div>
      <div style={{ position: "absolute", left: 672, top: 71, width: 30, height: 30, borderRadius: 15, background: "#52708d" }} />
      <div style={{ position: "absolute", left: 678, top: 77 }}>
        <S color={U.main}><path d="M9 14V4M5 8l4-4 4 4" /></S>
      </div>
      {sprite > 0 && (
        <Img
          src={staticFile("xm/skin/sprite_peek.webp")}
          style={{
            position: "absolute", left: HOME_INPUT.w - 22 - 54, top: -50, width: 54, height: 55, objectFit: "contain", opacity: sprite,
            filter: "drop-shadow(0 0 10px #fff3c966)", transform: `translateY(${-5 * ph}px) rotate(${-3 + 6 * ph}deg)`,
          }}
        />
      )}
    </div>
  );
};

export const ProjectStrip: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 739.5, top: 504 }}><IconFolder size={18} color={U.text} /></div>
    <div style={{ ...ui(13), position: "absolute", left: 764.5, top: 503.7, lineHeight: "17px" }}>游戏</div>
    <div style={{ position: "absolute", left: 810.5, top: 504 }}><IconLaptop size={18} color={U.text} /></div>
    <div style={{ ...ui(13), position: "absolute", left: 834.5, top: 503.7, lineHeight: "17px" }}>本地</div>
  </>
);

export const UpgradePill: React.FC<{ a: number }> = ({ a }) => (
  <div style={{ position: "absolute", left: 1018, top: 56, width: 124, height: 36, borderRadius: 18, background: "#f2b84b1a", opacity: a }}>
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke={XC.goldLo} strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round" style={{ position: "absolute", left: 12, top: 8 }}>
      <path d="M9.5 2.6C9.9 6.6 12.9 9.6 16.9 10 12.9 10.4 9.9 13.4 9.5 17.4 9.1 13.4 6.1 10.4 2.1 10 6.1 9.6 9.1 6.6 9.5 2.6Z" />
      <path d="M15.8 2.3v3.2M14.2 3.9h3.2" />
    </svg>
    <div style={{ ...ui(13, XC.goldLo), fontWeight: 400, position: "absolute", left: 38, top: 9, lineHeight: "17px" }}>升级套餐</div>
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke={XC.goldLo} strokeWidth={1.1} strokeLinecap="round" style={{ position: "absolute", left: 97, top: 10 }}>
      <path d="M4.4 4.4l7.2 7.2M11.6 4.4l-7.2 7.2" />
    </svg>
  </div>
);

/** The side-panel toggle under the caption buttons. */
export const SidePanelButton: React.FC<{ a: number }> = ({ a }) => (
  <div style={{ position: "absolute", left: 1888, top: 54, opacity: a }}><PanelGlyph color={U.muted} flip /></div>
);

/** The skin's fixed Christmas greeting (replaces the client's rotating line); 35px tall at y=309. */
export const Greeting: React.FC<{ a: number }> = ({ a }) => (
  <div style={{ position: "absolute", left: 640, width: 880, top: 309, height: 35, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
    <span
      style={{
        display: "inline-block", verticalAlign: "top", fontFamily: UI_FONT, fontSize: 28, lineHeight: "35px", fontWeight: 600, letterSpacing: 1,
        background: "linear-gradient(92deg, #ffe9b0 0%, #f2b84b 36%, #ff8f7a 76%, #f49ab8 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      }}
    >
      圣诞快乐，许个愿吧！
    </span>
  </div>
);

/** The skinned home avatar (octopus girl + Santa hat). The hat inside the circle is part of xm_avatar.webp; the
 * pop hat adds the rest of her own hat (cone, pompom) outside it — see key/split_hat.py. */
export const AvatarSkin: React.FC<{ a: number; hat?: number }> = ({ a, hat = 1 }) => (
  <div style={{ position: "absolute", left: AVATAR.x, top: AVATAR.y, width: AVATAR.d, height: AVATAR.d, opacity: a }}>
    <div
      style={{
        position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: sk("xm_avatar.webp"), backgroundSize: "cover", backgroundPosition: "center",
        boxShadow: "0 0 0 1px #f2b84b73, 0 0 18px #f2b84b40",
      }}
    />
    <Img
      src={staticFile("xm/skin/hat_xm_pop.webp")}
      style={{ position: "absolute", left: 2, top: -32, width: 91, height: 65, objectFit: "contain", opacity: hat }}
    />
  </div>
);
