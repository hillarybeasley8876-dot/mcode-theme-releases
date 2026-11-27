import React from "react";
import { Img, staticFile } from "remotion";
import { XC } from "./T";
import {
  IconApps, IconArrowUp, IconBell, IconChevron, IconClock, IconCloud, IconFolder, IconLaptop, IconLoop, IconMic,
  IconPlus, IconPlusCircle, IconRemote, IconSite,
} from "../ui/icons";

/* The MiniMax Code client at 1920x1080 as it looks with the Christmas skin installed (winter-night
 * tokens, candle-gold accent). Positions were measured from the live 3.1.14 client; the sidebar's
 * project entries are placeholders. */

// the client's own font stack — CJK falls back to the system face exactly as in the live app
export const UI_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const SIDEBAR_W = 240;
export const INPUT = { x: 696, y: 822, w: 768, h: 96 };
export const TITLE = { x: 256, y: 48, w: 360, h: 30 };

const U = XC.ui;
const txt: React.CSSProperties = { fontFamily: UI_FONT, color: U.text, fontSize: 14, fontWeight: 430, whiteSpace: "nowrap" };

/** The client's own panel glyph (title bar and side-panel toggle): a rounded frame with one divider. */
export const PanelGlyph: React.FC<{ color: string; flip?: boolean }> = ({ color, flip }) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
    <path
      d={`M${flip ? 12.3684 : 7.63158} 3.33331V16.6666M5 16.6666H15C16.3807 16.6666 17.5 15.5474 17.5 14.1666V5.83331C17.5 4.4526 16.3807 3.33331 15 3.33331H5C3.61929 3.33331 2.5 4.4526 2.5 5.83331V14.1666C2.5 15.5474 3.61929 16.6666 5 16.6666Z`}
      stroke={color}
      strokeWidth={1.2}
    />
  </svg>
);

const SearchGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" style={{ display: "block" }}>
    <circle cx="9.18" cy="9.13" r="6" />
    <path d="M13.7 13.9l3.2 3.2" />
  </svg>
);

const Item: React.FC<{ y: number; icon: React.ReactNode; label: string; sel?: boolean; muted?: boolean }> = ({ y, icon, label, sel, muted }) => (
  <div style={{ position: "absolute", left: 8, top: y - 16, width: 223, height: 32, borderRadius: 8, background: sel ? U.sel : "transparent" }}>
    {icon && <div style={{ position: "absolute", left: 8, top: 7 }}>{icon}</div>}
    <div style={{ ...txt, position: "absolute", left: 34, top: 6.5, lineHeight: "19px", color: muted ? U.muted : U.text }}>{label}</div>
  </div>
);

/** Pine sprig with holly in the corner of the sidebar card and a bauble swinging on its thread (as drawn by the skin). */
export const SidebarDecor: React.FC<{ t: number; a?: number; part: "sprig" | "bauble" }> = ({ t, a = 1, part }) => {
  if (part === "sprig") return <Img src={staticFile("xm/skin/xm_sprig.svg")} style={{ position: "absolute", left: SIDEBAR_W - 132, top: 40, width: 132, height: 132, opacity: a }} />;
  const ang = -7 * Math.cos((t / 5.2) * 2 * Math.PI);
  return (
    <Img
      src={staticFile("xm/skin/xm_bauble.svg")}
      style={{ position: "absolute", left: SIDEBAR_W - 82 - 22, top: 40, width: 22, height: 72, transformOrigin: "50% 0", transform: `rotate(${ang}deg)`, opacity: a }}
    />
  );
};

export const Sidebar: React.FC<{ t?: number; decor?: number }> = ({ t = 0, decor = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SIDEBAR_W, height: 1080, background: U.side, borderRight: `1px solid ${U.line}`, boxSizing: "border-box" }}>
    {decor > 0 && <SidebarDecor t={t} a={decor} part="sprig" />}
    {/* title bar */}
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 12, top: 8, width: 24, height: 24 }} />
    <div style={{ position: "absolute", left: 50, top: 11 }}><PanelGlyph color={U.muted} /></div>
    <div style={{ position: "absolute", left: 82, top: 11 }}><SearchGlyph color={U.muted} /></div>
    {/* navigation */}
    <Item y={56} icon={<IconPlusCircle color={U.text} />} label="新建任务" />
    <div style={{ position: "absolute", left: 205, top: 48 }}><IconCloud size={16} color={U.muted} /></div>
    <Item y={89} icon={<IconApps color={U.text} />} label="插件・技能" />
    <Item y={122} icon={<IconClock color={U.text} />} label="定时" />
    <Item y={155} icon={<IconSite color={U.text} />} label="网站" />
    <Item y={188} icon={<IconRemote color={U.text} />} label="远程" />
    {/* local / cloud switch */}
    <div style={{ position: "absolute", left: 8, top: 224, width: 148, height: 30, borderRadius: 100, background: "#e3eeff0a" }}>
      <div style={{ position: "absolute", left: 2, top: 2, width: 72, height: 26, borderRadius: 100, background: U.sel }} />
      <div style={{ position: "absolute", left: 14, top: 7 }}><IconLaptop size={16} color={U.text} /></div>
      <div style={{ ...txt, position: "absolute", left: 34, top: 5.5, lineHeight: "19px", fontWeight: 500 }}>本地</div>
      <div style={{ position: "absolute", left: 86, top: 7 }}><IconCloud size={16} color={U.sub} /></div>
      <div style={{ ...txt, position: "absolute", left: 106, top: 5.5, lineHeight: "19px", color: U.sub }}>云端</div>
    </div>
    <div style={{ ...txt, position: "absolute", left: 16, top: 267.7, fontSize: 13, lineHeight: "18.6px", color: U.muted }}>项目</div>
    <Item y={308} icon={<IconFolder color={U.sub} />} label="minimax-code-boot" />
    <Item y={339} icon={null} label="制作圣诞节开屏动画" sel />
    <Item y={370} icon={null} label="给 MCode 换圣诞皮肤" />
    <Item y={401} icon={null} label="校准交接时间" />
    <Item y={432} icon={null} label="更多" muted />
    {/* account row */}
    <div style={{ position: "absolute", left: 0, top: 1023, width: SIDEBAR_W - 1, height: 1, background: U.border }} />
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 12, top: 1038, width: 28, height: 28 }} />
    <div style={{ ...txt, position: "absolute", left: 48, top: 1033.5, lineHeight: "19px" }}>MiniMax Code</div>
    <div style={{ ...txt, position: "absolute", left: 48, top: 1055.5, fontSize: 12, lineHeight: "16px", color: U.muted }}>本地工作区</div>
    <div style={{ position: "absolute", left: 201, top: 1042 }}><IconBell size={20} color={U.sub} /></div>
    {decor > 0 && <SidebarDecor t={t} a={decor} part="bauble" />}
  </div>
);

export const TitleBar: React.FC<{ chip?: number }> = ({ chip = 0 }) => (
  <div
    style={{
      position: "absolute", left: TITLE.x - 14 * chip, top: TITLE.y - 6 * chip, height: TITLE.h + 12 * chip,
      padding: `0 ${14 * chip}px`, borderRadius: 22, display: "flex", alignItems: "center", gap: 8,
      background: `rgba(19,38,56,${chip})`, boxShadow: chip ? `0 6px 24px rgba(242,184,75,${0.16 * chip})` : "none",
      border: chip ? `1px solid rgba(227,238,255,${0.1 * chip})` : "none",
    }}
  >
    <div style={{ ...txt, fontSize: 15, fontWeight: 600 }}>制作圣诞节开屏动画</div>
    <IconChevron size={16} color={U.sub} />
  </div>
);

const CaptionGlyph: React.FC<{ kind: "min" | "max" | "close" }> = ({ kind }) => (
  <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="#ffffff" strokeWidth={1}>
    {kind === "min" && <path d="M0 5.5h10" />}
    {kind === "max" && <rect x="0.5" y="0.5" width="9" height="9" />}
    {kind === "close" && <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" />}
  </svg>
);

export const Captions: React.FC = () => (
  <>
    {(["min", "max", "close"] as const).map((k, i) => (
      <div key={k} style={{ position: "absolute", left: 1920 - 138 + i * 46, top: 0, width: 46, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CaptionGlyph kind={k} />
      </div>
    ))}
  </>
);

/** The composer card as it lands during the weave (pre-morph). */
export const InputBox: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <div
    style={{
      position: "absolute", left: INPUT.x, top: INPUT.y, width: INPUT.w, height: INPUT.h, borderRadius: 20,
      background: U.card, border: `1px solid ${U.border}`,
      boxShadow: `0 0 0 1px #f2b84b1f, 0 18px 50px #01060c99, 0 0 0 ${3 * glow}px rgba(242,184,75,${0.35 * glow})`,
    }}
  >
    <div style={{ ...txt, position: "absolute", left: 14, top: 14, color: "#5f7c95" }}>问任何问题...</div>
    <div style={{ position: "absolute", left: 16, top: 60 }}><IconPlus color={U.text} /></div>
    <div style={{ position: "absolute", left: 48, top: 60 }}><IconLoop color={U.sub} /></div>
    <div style={{ ...txt, position: "absolute", left: 72, top: 58, color: U.sub }}>始终授权</div>
    <div style={{ position: "absolute", left: INPUT.w - 70, top: 60 }}><IconMic color={U.text} /></div>
    <div style={{ position: "absolute", left: INPUT.w - 44, top: 52, width: 32, height: 32, borderRadius: 16, background: "#52708d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IconArrowUp size={16} color={U.main} />
    </div>
  </div>
);

export const Disclaimer: React.FC = () => (
  <div style={{ ...txt, position: "absolute", left: 240, width: 1680, top: 928, textAlign: "center", fontSize: 11, color: U.muted }}>
    内容由AI生成，重要信息请务必核查
  </div>
);

/** Lockup: the official wordmark filled with a candle-gold-to-holly gradient, plus the night's line. */
export const Lockup: React.FC<{ word: number; line: number; out: number }> = ({ word, line, out }) => {
  const W0 = 600;
  const H0 = (W0 * 32) / 254.003;
  const cx = 240 + 1680 / 2;
  const mark = `url(${staticFile("brand/loginWordmark.8523d268.svg")})`;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - out, transform: `translateY(${-14 * out}px)` }}>
      <div
        style={{
          position: "absolute", left: cx - W0 / 2, top: 178, width: W0, height: H0,
          clipPath: `inset(-20% ${100 - 100 * word}% -20% 0)`, filter: `blur(${(1 - word) * 6}px) drop-shadow(0 0 22px rgba(242,184,75,0.4))`,
          transform: `translateY(${(1 - word) * 14}px)`,
        }}
      >
        <div
          style={{
            width: W0, height: H0, background: "linear-gradient(92deg, #fff1c9 0%, #f2b84b 38%, #ff8f7a 78%, #f49ab8 100%)",
            WebkitMaskImage: mark, maskImage: mark, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute", left: cx - 400, width: 800, top: 278, textAlign: "center", fontFamily: '"MiSans", "Microsoft YaHei UI", sans-serif',
          fontWeight: 500, fontSize: 30, letterSpacing: 10 - 6 * line, color: XC.candle, opacity: line, transform: `translateY(${(1 - line) * 16}px)`,
          textShadow: "0 0 18px rgba(242,184,75,0.6)",
        }}
      >
        圣诞快乐
      </div>
    </div>
  );
};
