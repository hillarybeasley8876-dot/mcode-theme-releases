import React from "react";
import { Img, staticFile } from "remotion";
import { HC } from "./T";
import {
  IconApps, IconArrowUp, IconBell, IconChevron, IconClock, IconCloud, IconFolder, IconLaptop, IconLoop, IconMic,
  IconPanel, IconPlus, IconPlusCircle, IconRemote, IconSearch, IconSite,
} from "../ui/icons";

/* The MiniMax Code client at 1920x1080 as it looks with the Halloween skin installed (dark plum
 * tokens, pumpkin accent). Layout is the real 3.1.7 layout; sidebar entries are placeholders. */

// the client's own font stack — CJK falls back to the system face exactly as in the live app
export const UI_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const SIDEBAR_W = 240;
export const INPUT = { x: 696, y: 822, w: 768, h: 96 };
export const TITLE = { x: 256, y: 48, w: 360, h: 30 };

const U = HC.ui;
const txt: React.CSSProperties = { fontFamily: UI_FONT, color: U.text, fontSize: 14, whiteSpace: "nowrap" };

const Item: React.FC<{ y: number; icon: React.ReactNode; label: string; sel?: boolean; indent?: number; muted?: boolean }> = ({ y, icon, label, sel, indent = 0, muted }) => (
  <div style={{ position: "absolute", left: 8, top: y - 16, width: SIDEBAR_W - 17, height: 32, borderRadius: 8, background: sel ? U.sel : "transparent" }}>
    {icon && <div style={{ position: "absolute", left: 9 + indent, top: 7 }}>{icon}</div>}
    <div style={{ ...txt, position: "absolute", left: 34 + indent, top: 6, color: muted ? U.muted : U.text }}>{label}</div>
  </div>
);

/** Corner cobweb + dangling spider, as drawn by the skin on the sidebar card. */
export const SidebarDecor: React.FC<{ t: number; a?: number }> = ({ t, a = 1 }) => {
  const ph = (Math.sin((t / 7) * 2 * Math.PI) + 1) / 2;
  return (
    <div style={{ opacity: a }}>
      <Img src={staticFile("hw/skin/web.svg")} style={{ position: "absolute", left: SIDEBAR_W - 116, top: 40, width: 116, height: 116 }} />
      <Img
        src={staticFile("hw/skin/spider.svg")}
        style={{ position: "absolute", left: SIDEBAR_W - 50 - 18, top: 40, width: 18, height: 72, transformOrigin: "50% 0", transform: `translateY(${-6 + 9 * ph}px) rotate(${-2 + 4 * ph}deg)` }}
      />
    </div>
  );
};

export const Sidebar: React.FC<{ t?: number; decor?: number }> = ({ t = 0, decor = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SIDEBAR_W, height: 1080, background: U.side, borderRight: `1px solid ${U.line}` }}>
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 15, top: 10, width: 22, height: 22 }} />
    <div style={{ position: "absolute", left: 50, top: 11 }}><IconPanel color={U.sub} /></div>
    <div style={{ position: "absolute", left: 82, top: 11 }}><IconSearch color={U.sub} /></div>
    <Item y={56} icon={<IconPlusCircle color={U.text} />} label="新建任务" />
    <div style={{ position: "absolute", left: 204, top: 47 }}><IconCloud color={U.muted} /></div>
    <Item y={89} icon={<IconApps color={U.text} />} label="插件·技能" />
    <Item y={122} icon={<IconClock color={U.text} />} label="定时" />
    <Item y={155} icon={<IconSite color={U.text} />} label="网站" />
    <Item y={188} icon={<IconRemote color={U.text} />} label="远程" />
    <div style={{ position: "absolute", left: 10, top: 226, width: 146, height: 28, borderRadius: 14, background: "#ece0ff0b" }}>
      <div style={{ position: "absolute", left: 2, top: 2, width: 66, height: 24, borderRadius: 12, background: U.card }} />
      <div style={{ position: "absolute", left: 12, top: 5 }}><IconLaptop size={16} color={U.text} /></div>
      <div style={{ ...txt, position: "absolute", left: 32, top: 4, fontSize: 13 }}>本地</div>
      <div style={{ position: "absolute", left: 84, top: 5 }}><IconCloud size={16} color={U.muted} /></div>
      <div style={{ ...txt, position: "absolute", left: 104, top: 4, fontSize: 13, color: U.muted }}>云端</div>
    </div>
    <div style={{ ...txt, position: "absolute", left: 16, top: 268, fontSize: 13, color: U.muted }}>项目</div>
    <Item y={308} icon={<IconFolder color={U.sub} />} label="minimax-code-boot" />
    <Item y={339} icon={null} label="制作万圣节开屏动画" sel />
    <Item y={370} icon={null} label="给 MCode 换万圣节皮肤" />
    <Item y={401} icon={null} label="校准交接时间" />
    <Item y={432} icon={null} label="更多" muted />
    <div style={{ position: "absolute", left: 0, top: 1023, width: SIDEBAR_W, height: 1, background: U.line }} />
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 14, top: 1036, width: 28, height: 28 }} />
    <div style={{ ...txt, position: "absolute", left: 50, top: 1030 }}>MiniMax Code</div>
    <div style={{ ...txt, position: "absolute", left: 50, top: 1050, fontSize: 12, color: U.muted }}>本地工作区</div>
    <div style={{ position: "absolute", left: 202, top: 1040 }}><IconBell color={U.sub} /></div>
    {decor > 0 && <SidebarDecor t={t} a={decor} />}
  </div>
);

export const TitleBar: React.FC<{ chip?: number }> = ({ chip = 0 }) => (
  <div
    style={{
      position: "absolute", left: TITLE.x - 14 * chip, top: TITLE.y - 6 * chip, height: TITLE.h + 12 * chip,
      padding: `0 ${14 * chip}px`, borderRadius: 22, display: "flex", alignItems: "center", gap: 8,
      background: `rgba(38,28,49,${chip})`, boxShadow: chip ? `0 6px 24px rgba(255,138,31,${0.16 * chip})` : "none",
      border: chip ? `1px solid rgba(236,224,255,${0.1 * chip})` : "none",
    }}
  >
    <div style={{ ...txt, fontSize: 15, fontWeight: 600 }}>制作万圣节开屏动画</div>
    <IconChevron size={16} color={U.sub} />
  </div>
);

const CaptionGlyph: React.FC<{ kind: "min" | "max" | "close" }> = ({ kind }) => (
  <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke={U.text} strokeWidth={1}>
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
      boxShadow: `0 0 0 1px #ff8a1f1c, 0 18px 50px #05020a99, 0 0 0 ${3 * glow}px rgba(255,138,31,${0.35 * glow})`,
    }}
  >
    <div style={{ ...txt, position: "absolute", left: 14, top: 14, color: "#7d6d92" }}>问任何问题...</div>
    <div style={{ position: "absolute", left: 16, top: 60 }}><IconPlus color={U.text} /></div>
    <div style={{ position: "absolute", left: 48, top: 60 }}><IconLoop color={U.sub} /></div>
    <div style={{ ...txt, position: "absolute", left: 72, top: 58, color: U.sub }}>始终授权</div>
    <div style={{ position: "absolute", left: INPUT.w - 70, top: 60 }}><IconMic color={U.text} /></div>
    <div style={{ position: "absolute", left: INPUT.w - 44, top: 52, width: 32, height: 32, borderRadius: 16, background: "#3a2d4a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IconArrowUp size={16} color="#a493b8" />
    </div>
  </div>
);

export const Disclaimer: React.FC = () => (
  <div style={{ ...txt, position: "absolute", left: 240, width: 1680, top: 928, textAlign: "center", fontSize: 11, color: U.muted }}>
    内容由AI生成，重要信息请务必核查
  </div>
);

/** Lockup: the official wordmark filled with a pumpkin-to-pink gradient, plus the night's line. */
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
          clipPath: `inset(-20% ${100 - 100 * word}% -20% 0)`, filter: `blur(${(1 - word) * 6}px) drop-shadow(0 0 22px rgba(255,138,31,0.35))`,
          transform: `translateY(${(1 - word) * 14}px)`,
        }}
      >
        <div
          style={{
            width: W0, height: H0, background: "linear-gradient(92deg, #ffc285 0%, #ff8a1f 40%, #f49ab8 100%)",
            WebkitMaskImage: mark, maskImage: mark, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute", left: cx - 400, width: 800, top: 278, textAlign: "center", fontFamily: '"MiSans", "Microsoft YaHei UI", sans-serif',
          fontWeight: 500, fontSize: 30, letterSpacing: 10 - 6 * line, color: HC.lavender, opacity: line, transform: `translateY(${(1 - line) * 16}px)`,
          textShadow: "0 0 18px rgba(123,63,224,0.6)",
        }}
      >
        万圣夜快乐
      </div>
    </div>
  );
};
