import React from "react";
import { Img, staticFile } from "remotion";
import { HC } from "./T";
import { UI_FONT } from "./AppWindowHW";
import { IconChevron, IconFolder, IconLaptop, IconMic, IconPlus } from "../ui/icons";

/* The real MiniMax Code 3.1.7 start page at 1920x1080 with the Halloween skin installed.
 * Every position below was measured from the live client (DOM rects at a 1920x1080 client);
 * the decoration uses the very same background rules and images as halloween.css. */

export const HOME_INPUT = { x: 724.5, y: 384, w: 711, h: 110 };
export const AVATAR = { x: 1052, y: 245, d: 56, cx: 1080, cy: 273 };
const U = HC.ui;
const sk = (f: string) => `url(${staticFile(`hw/skin/${f}`)})`;
const ui = (size: number, color: string = U.text): React.CSSProperties => ({ fontFamily: UI_FONT, fontSize: size, fontWeight: 430, color, whiteSpace: "nowrap" });

/** Moon, bats, stars, fog and pumpkins behind the start page (== halloween.css home-panel-body). */
export const HomePanelDecor: React.FC<{ a?: number }> = ({ a = 1 }) => (
  <div
    style={{
      position: "absolute", left: 240, top: 40, width: 1680, height: 1040, opacity: a,
      backgroundImage: [
        sk("pumpkins.webp"),
        "radial-gradient(ellipse 260px 70px at calc(100% - 196px) calc(100% - 22px), #ff8a1f2e 0%, #ff8a1f00 100%)",
        "radial-gradient(ellipse 72% 26% at 50% 104%, #b9a2ff1f 0%, #b9a2ff00 70%)",
        sk("bats.svg"),
        sk("moon.webp"),
        "radial-gradient(ellipse 46% 40% at 50% 30%, #3a1d5a59 0%, #3a1d5a00 70%)",
        "radial-gradient(ellipse 70% 38% at 50% 100%, #ff8a1f14 0%, #ff8a1f00 70%)",
        sk("stars.svg"),
      ].join(", "),
      backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat",
      backgroundPosition: "right 30px bottom 14px, center, center, right 196px top 92px, right 52px top 44px, center, center, 0 0",
      backgroundSize: "344px auto, 100% 100%, 100% 100%, 230px auto, 210px 210px, 100% 100%, 100% 100%, 420px 300px",
    }}
  />
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
const IconVideo: React.FC = () => (
  <S>
    <rect x="2" y="4.6" width="9.6" height="8.8" rx="2" />
    <path d="M11.6 8l4-2.2v6.4l-4-2.2" />
  </S>
);
const IconBulb: React.FC = () => (
  <S>
    <path d="M6.4 11.6a5 5 0 1 1 5.2 0V13H6.4z" />
    <path d="M7 15.6h4" />
  </S>
);
const IconPen: React.FC = () => (
  <S>
    <path d="M3 15l1-3.6 7.8-7.8a1.8 1.8 0 0 1 2.6 2.6L6.6 14z" />
    <path d="M10.6 4.8l2.6 2.6" />
  </S>
);
const IconTerm: React.FC = () => (
  <S>
    <rect x="2.2" y="3" width="13.6" height="12" rx="2" />
    <path d="M5.4 7.4l2 1.6-2 1.6M9 11h3" />
  </S>
);
const IconCup: React.FC = () => (
  <S>
    <path d="M3.4 6.2h9v4.6a3.6 3.6 0 0 1-3.6 3.6H7a3.6 3.6 0 0 1-3.6-3.6z" />
    <path d="M12.4 7.4h1.2a1.8 1.8 0 0 1 0 3.6h-1.2M6 2.6v1.6M9 2.6v1.6" />
  </S>
);

/** The composer. `focus` is the skin's :focus-within look (the client focuses it on launch). */
export const HomeInput: React.FC<{ focus?: number; t?: number; ghost?: number }> = ({ focus = 0, t = 0, ghost = 1 }) => {
  const ph = (Math.sin((t / 4.6) * 2 * Math.PI) + 1) / 2;
  const rest = "0 0 0 1px #ff8a1f1c, 0 18px 50px #05020a99, 0 0 90px -20px #7b3fe04d";
  const lit = "0 0 0 1px #ff8a1f59, 0 0 24px #ff8a1f2e, 0 18px 50px #05020a99";
  return (
    <div style={{ position: "absolute", left: HOME_INPUT.x, top: HOME_INPUT.y, width: HOME_INPUT.w, height: HOME_INPUT.h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: U.card, border: "1px solid #ece0ff12", boxSizing: "border-box", boxShadow: rest }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, boxShadow: lit, opacity: focus }} />
      <div style={{ ...ui(14, "#7d6d92"), position: "absolute", left: 13, top: 13, lineHeight: "22.8px" }}>问任何问题...</div>
      <div style={{ position: "absolute", left: 15, top: 77 }}><IconPlus color={U.text} /></div>
      <div style={{ position: "absolute", left: 51, top: 77 }}><IconRedo color={U.sub} /></div>
      <div style={{ ...ui(13, U.sub), position: "absolute", left: 73, top: 76.7, lineHeight: "18.6px" }}>始终授权</div>
      <div style={{ ...ui(13), position: "absolute", left: 517.3, top: 76.7, lineHeight: "18.6px" }}>M3.1-Flash</div>
      <div style={{ ...ui(11, U.muted), position: "absolute", left: 584, top: 78, lineHeight: "16px" }}>max</div>
      <div style={{ position: "absolute", left: 610, top: 78 }}><IconChevron size={16} color={U.muted} /></div>
      <div style={{ position: "absolute", left: 644, top: 77 }}><IconMic size={18} color={U.text} /></div>
      <div style={{ position: "absolute", left: 673, top: 72, width: 28, height: 28, borderRadius: 14, background: "#3a2d4a" }} />
      <div style={{ position: "absolute", left: 678, top: 77 }}>
        <S color="#a493b8"><path d="M9 14V4M5 8l4-4 4 4" /></S>
      </div>
      {ghost > 0 && (
        <Img
          src={staticFile("hw/skin/ghost_peek.webp")}
          style={{
            position: "absolute", left: HOME_INPUT.w - 26 - 44, top: -50, width: 44, height: 59, opacity: ghost,
            filter: "drop-shadow(0 0 10px #d9c8ff59)", transform: `translateY(${-5 * ph}px) rotate(${-3 + 6 * ph}deg)`,
          }}
        />
      )}
    </div>
  );
};

export const ProjectStrip: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 739.5, top: 504 }}><IconFolder size={18} color={U.text} /></div>
    <div style={{ ...ui(13), position: "absolute", left: 764.5, top: 503, lineHeight: "20px" }}>游戏</div>
    <div style={{ position: "absolute", left: 810.5, top: 504 }}><IconLaptop size={18} color={U.sub} /></div>
    <div style={{ ...ui(13, U.sub), position: "absolute", left: 834.5, top: 503.7, lineHeight: "18.6px" }}>本地</div>
  </>
);

const CHIPS: Array<{ x: number; w: number; label: string; icon: React.ReactNode; tag?: string }> = [
  { x: 791, w: 129, label: "视频生成", icon: <IconVideo />, tag: "H3" },
  { x: 928, w: 94, label: "产品运营", icon: <IconBulb /> },
  { x: 1030, w: 94, label: "内容创作", icon: <IconPen /> },
  { x: 1132, w: 114.2, label: "Vibe Coding", icon: <IconTerm /> },
  { x: 1254.2, w: 114.8, label: "问问 MCode", icon: <IconCup /> },
];

export const Chips: React.FC<{ a: number }> = ({ a }) => (
  <>
    {CHIPS.map((c, i) => {
      const k = Math.max(0, Math.min(1, a * 1.6 - i * 0.12));
      return (
        <div
          key={c.label}
          style={{
            position: "absolute", left: c.x, top: 561, width: c.w, height: 30, borderRadius: 8, border: "1px solid #ece0ff12", boxSizing: "border-box",
            background: U.chip, opacity: k, transform: `translateY(${(1 - k) * 6}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 8, top: 5 }}>{c.icon}</div>
          <div style={{ ...ui(14), position: "absolute", left: 30, top: 3.5, lineHeight: "21px" }}>{c.label}</div>
          {c.tag && (
            <div style={{ ...ui(12, "#c29ff0"), position: "absolute", left: 92, top: 5, height: 18, lineHeight: "18px", padding: "0 6px", borderRadius: 6, background: "#9a55c21f" }}>
              {c.tag}
            </div>
          )}
        </div>
      );
    })}
  </>
);

export const UpgradePill: React.FC<{ a: number }> = ({ a }) => (
  <div
    style={{
      position: "absolute", left: 1018, top: 56, width: 124, height: 36, borderRadius: 18, background: "#ff8a1f1a", opacity: a,
      display: "flex", alignItems: "center", gap: 6, paddingLeft: 13, boxSizing: "border-box",
    }}
  >
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="#f07514" strokeWidth={1.3} strokeLinejoin="round">
      <path d="M7 1.8 8.3 5.6 12.2 7 8.3 8.4 7 12.2 5.7 8.4 1.8 7 5.7 5.6Z" />
      <path d="M12.6 10.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" />
    </svg>
    <div style={{ ...ui(13, "#f07514") }}>升级套餐</div>
    <div style={{ ...ui(12, "#f07514"), marginLeft: 4 }}>✕</div>
  </div>
);

/** The skin's fixed Halloween greeting (replaces the client's rotating line); 35px tall at y=309. */
export const Greeting: React.FC<{ a: number }> = ({ a }) => (
  <div style={{ position: "absolute", left: 640, width: 880, top: 309, height: 35, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
    <span
      style={{
        display: "inline-block", verticalAlign: "top", fontFamily: UI_FONT, fontSize: 28, lineHeight: "35px", fontWeight: 600, letterSpacing: 1,
        background: "linear-gradient(92deg, #ffc285 0%, #ff8a1f 42%, #f49ab8 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      }}
    >
      不给代码，就捣蛋！
    </span>
  </div>
);

/** The skinned home avatar (octopus witch + tilted hat). */
export const AvatarSkin: React.FC<{ a: number; hat?: number }> = ({ a, hat = 1 }) => (
  <div style={{ position: "absolute", left: AVATAR.x, top: AVATAR.y, width: AVATAR.d, height: AVATAR.d, opacity: a }}>
    <div
      style={{
        position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: sk("avatar_face.webp"), backgroundSize: "cover", backgroundPosition: "center",
        boxShadow: "0 0 0 1px #ff8a1f40, 0 0 18px #ff8a1f33",
      }}
    />
    <Img
      src={staticFile("hw/skin/hat_small.webp")}
      style={{ position: "absolute", left: 10, top: -30, width: 52, height: 39, objectFit: "contain", transform: `rotate(14deg) translateY(${(1 - hat) * -40}px)`, opacity: hat }}
    />
  </div>
);
