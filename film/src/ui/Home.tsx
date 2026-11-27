import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../T";
import { IconArrowUp, IconChevron, IconFolder, IconLaptop, IconLoop, IconMic, IconPlus } from "./icons";

/* The real MiniMax Code start page, measured from a recording of the installed client at
 * 1920x1080: greeting y349-376, input card 725,419 710x109, project strip to y567, chips y596-626,
 * "升级套餐" pill 1018,56 124x36, avatar d53 at (1080,308). */

export const HOME_INPUT = { x: 725, y: 419, w: 710, h: 109 };
export const AVATAR = { cx: 1080, cy: 308, d: 53 };

const t14: React.CSSProperties = { fontFamily: FONT.ui, fontSize: 14, color: C.ui.text, whiteSpace: "nowrap" };

export const HomeInput: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <div
    style={{
      position: "absolute", left: HOME_INPUT.x, top: HOME_INPUT.y, width: HOME_INPUT.w, height: HOME_INPUT.h,
      borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.ui.border}`,
      boxShadow: `0 4px 18px rgba(0,0,0,0.05), 0 0 0 ${3 * glow}px rgba(244,154,184,${0.35 * glow})`,
    }}
  >
    <div style={{ ...t14, position: "absolute", left: 16, top: 16, color: "#ACACAC" }}>输入 @ 引用插件、子 Agent、文件和文件夹</div>
    <div style={{ position: "absolute", left: 15, top: 77 }}><IconPlus /></div>
    <div style={{ position: "absolute", left: 46, top: 78 }}><IconLoop size={16} color="#666666" /></div>
    <div style={{ ...t14, position: "absolute", left: 66, top: 76, fontSize: 13, color: "#444444" }}>始终授权</div>
    <div style={{ ...t14, position: "absolute", left: 470, top: 76, fontSize: 13, color: "#333333" }}>
      M3.1-Flash-Preview <span style={{ color: C.ui.muted, fontSize: 11 }}>low</span>
    </div>
    <div style={{ position: "absolute", left: 610, top: 79 }}><IconChevron size={14} color="#ADADAD" /></div>
    <div style={{ position: "absolute", left: 644, top: 77 }}><IconMic size={18} color="#454545" /></div>
    <div style={{ position: "absolute", left: 672, top: 72, width: 28, height: 28, borderRadius: 14, background: "#ADADAD", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IconArrowUp size={15} color="#FFFFFF" />
    </div>
  </div>
);

export const ProjectStrip: React.FC = () => (
  <div style={{ position: "absolute", left: 725, top: 505, width: 710, height: 62, borderRadius: "0 0 18px 18px", background: "#FAFAFA" }}>
    <div style={{ position: "absolute", left: 16, top: 35 }}><IconFolder size={15} color="#555555" /></div>
    <div style={{ ...t14, position: "absolute", left: 37, top: 33, fontSize: 13 }}>游戏</div>
    <div style={{ position: "absolute", left: 87, top: 35 }}><IconLaptop size={15} color="#555555" /></div>
    <div style={{ ...t14, position: "absolute", left: 109, top: 33, fontSize: 13 }}>本地</div>
  </div>
);

const CHIPS: Array<{ x: number; w: number; label: string; tag?: string }> = [
  { x: 801, w: 128, label: "视频生成", tag: "H3" },
  { x: 938, w: 92, label: "金融投资" },
  { x: 1040, w: 94, label: "内容创作" },
  { x: 1142, w: 94, label: "文档办公" },
  { x: 1244, w: 115, label: "问问 MCode" },
];

export const Chips: React.FC<{ a: number }> = ({ a }) => (
  <>
    {CHIPS.map((c, i) => {
      const k = Math.max(0, Math.min(1, a * 1.6 - i * 0.12));
      return (
        <div
          key={c.label}
          style={{
            position: "absolute", left: c.x, top: 596, width: c.w, height: 30, borderRadius: 8, border: "1px solid #E8E8E8",
            background: "#FFFFFF", opacity: k, transform: `translateY(${(1 - k) * 6}px)`, display: "flex", alignItems: "center", gap: 6, paddingLeft: 10,
          }}
        >
          <div style={{ width: 13, height: 11, border: "1.3px solid #555", borderRadius: 3 }} />
          <div style={{ ...t14, fontSize: 13 }}>{c.label}</div>
          {c.tag && <div style={{ fontFamily: FONT.ui, fontSize: 11, color: "#9471B9", background: "#F3ECFA", borderRadius: 4, padding: "0 5px" }}>{c.tag}</div>}
        </div>
      );
    })}
  </>
);

export const UpgradePill: React.FC<{ a: number }> = ({ a }) => (
  <div
    style={{
      position: "absolute", left: 1018, top: 56, width: 124, height: 36, borderRadius: 18, background: "#E8F3FE", opacity: a,
      display: "flex", alignItems: "center", gap: 6, paddingLeft: 14,
    }}
  >
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="#4F7FE8" strokeWidth={1.3} strokeLinejoin="round">
      <path d="M7 1.8 8.3 5.6 12.2 7 8.3 8.4 7 12.2 5.7 8.4 1.8 7 5.7 5.6Z" />
      <path d="M12.6 10.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" />
    </svg>
    <div style={{ ...t14, fontSize: 13, color: "#4F7FE8" }}>升级套餐</div>
    <div style={{ ...t14, fontSize: 12, color: "#4F7FE8", marginLeft: 4 }}>✕</div>
  </div>
);

export const Greeting: React.FC<{ a: number }> = ({ a }) => (
  <>
    <div
      style={{
        position: "absolute", left: AVATAR.cx - 93, top: 302 - 93, width: 186, height: 186, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(0,0,0,0.018), rgba(0,0,0,0))", opacity: a,
      }}
    />
    <div
      style={{
        position: "absolute", left: 640, width: 880, top: 344, textAlign: "center", fontFamily: FONT.ui, fontWeight: 700,
        fontSize: 28, color: C.ui.text, opacity: a, transform: `translateY(${(1 - a) * 8}px)`, whiteSpace: "nowrap",
      }}
    >
      今天的第一行代码，就交给我吧
    </div>
  </>
);

/** Static avatar disc (her face) used once the plate has shrunk into the avatar slot. */
export const AvatarFace: React.FC<{ a: number }> = ({ a }) => (
  <div
    style={{
      position: "absolute", left: AVATAR.cx - AVATAR.d / 2, top: AVATAR.cy - AVATAR.d / 2, width: AVATAR.d, height: AVATAR.d,
      borderRadius: "50%", overflow: "hidden", opacity: a, boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
    }}
  >
    <Img src={staticFile("img/avatar.png")} style={{ width: AVATAR.d, height: AVATAR.d }} />
  </div>
);
