import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../T";
import {
  Caption, IconApps, IconArrowUp, IconBell, IconChevron, IconClock, IconCloud, IconFolder, IconLaptop,
  IconLoop, IconMic, IconPanel, IconPlus, IconPlusCircle, IconRemote, IconSearch, IconSite,
} from "./icons";

/* Rebuild of the MiniMax Code client area at its real 1920x1080 layout (measured from a capture of
 * the installed app: 240px sidebar #FAFAFA with a #F0F0F0 rule, white main, 768x92 input card).
 * Copy strings are the app's own zh-CN locale strings. Every element is vector type / SVG. */

export const SIDEBAR_W = 240;
export const INPUT = { x: 696, y: 822, w: 768, h: 96 };
export const TITLE = { x: 256, y: 48, w: 360, h: 30 };

const txt: React.CSSProperties = { fontFamily: FONT.ui, color: C.ui.text, fontSize: 14, whiteSpace: "nowrap" };

const Item: React.FC<{ y: number; icon: React.ReactNode; label: string; sel?: boolean; indent?: number; muted?: boolean }> = ({
  y, icon, label, sel, indent = 0, muted,
}) => (
  <div
    style={{
      position: "absolute", left: 8, top: y - 15, width: SIDEBAR_W - 16, height: 30, borderRadius: 8,
      background: sel ? C.ui.sel : "transparent",
    }}
  >
    {icon && <div style={{ position: "absolute", left: 9 + indent, top: 6 }}>{icon}</div>}
    <div style={{ ...txt, position: "absolute", left: 34 + indent, top: 5, color: muted ? C.ui.muted : C.ui.text }}>{label}</div>
  </div>
);

export const Sidebar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SIDEBAR_W, height: 1080, background: C.ui.side, borderRight: `1px solid ${C.ui.line}` }}>
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 15, top: 10, width: 22, height: 22 }} />
    <div style={{ position: "absolute", left: 50, top: 11 }}><IconPanel color="#8A8A8A" /></div>
    <div style={{ position: "absolute", left: 82, top: 11 }}><IconSearch color="#8A8A8A" /></div>
    <Item y={56} icon={<IconPlusCircle />} label="新建任务" />
    <div style={{ position: "absolute", left: 204, top: 47 }}><IconCloud color="#ADADAD" /></div>
    <Item y={89} icon={<IconApps />} label="插件·技能" />
    <Item y={122} icon={<IconClock />} label="定时" />
    <Item y={155} icon={<IconSite />} label="网站" />
    <Item y={188} icon={<IconRemote />} label="远程" />
    <div style={{ position: "absolute", left: 10, top: 226, width: 146, height: 28, borderRadius: 14, background: "#F2F2F2" }}>
      <div style={{ position: "absolute", left: 2, top: 2, width: 66, height: 24, borderRadius: 12, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }} />
      <div style={{ position: "absolute", left: 12, top: 5 }}><IconLaptop size={16} /></div>
      <div style={{ ...txt, position: "absolute", left: 32, top: 4, fontSize: 13 }}>本地</div>
      <div style={{ position: "absolute", left: 84, top: 5 }}><IconCloud size={16} color="#ADADAD" /></div>
      <div style={{ ...txt, position: "absolute", left: 104, top: 4, fontSize: 13, color: C.ui.muted }}>云端</div>
    </div>
    <div style={{ ...txt, position: "absolute", left: 16, top: 268, fontSize: 12, color: C.ui.muted }}>项目</div>
    <Item y={308} icon={<IconFolder />} label="minimax-code-boot" />
    <Item y={339} icon={null} label="制作章鱼开屏动画" sel />
    <Item y={370} icon={null} label="接入启动器" />
    <Item y={401} icon={null} label="校准交接时间" />
    <Item y={432} icon={null} label="更多" muted />
    <div style={{ position: "absolute", left: 0, top: 1016, width: SIDEBAR_W, height: 1, background: C.ui.line }} />
    <Img src={staticFile("brand/desktopAppIcon.b34d45ee.png")} style={{ position: "absolute", left: 14, top: 1032, width: 28, height: 28 }} />
    <div style={{ ...txt, position: "absolute", left: 50, top: 1027 }}>MiniMax Code</div>
    <div style={{ ...txt, position: "absolute", left: 50, top: 1046, fontSize: 12, color: C.ui.muted }}>本地工作区</div>
    <div style={{ position: "absolute", left: 202, top: 1036 }}><IconBell /></div>
  </div>
);

export const TitleBar: React.FC<{ chip?: number }> = ({ chip = 0 }) => (
  <div
    style={{
      position: "absolute", left: TITLE.x - 14 * chip, top: TITLE.y - 6 * chip, height: TITLE.h + 12 * chip,
      padding: `0 ${14 * chip}px`, borderRadius: 22, display: "flex", alignItems: "center", gap: 8,
      background: `rgba(255,255,255,${chip})`, boxShadow: chip ? `0 6px 24px rgba(142,31,69,${0.12 * chip})` : "none",
      border: chip ? `1px solid rgba(236,236,236,${chip})` : "none",
    }}
  >
    <div style={{ ...txt, fontSize: 15, fontWeight: 600 }}>制作章鱼开屏动画</div>
    <IconChevron size={16} color="#8A8A8A" />
  </div>
);

export const Captions: React.FC = () => (
  <>
    {(["min", "max", "close"] as const).map((k, i) => (
      <div key={k} style={{ position: "absolute", left: 1920 - 138 + i * 46, top: 0, width: 46, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Caption kind={k} />
      </div>
    ))}
  </>
);

export const InputBox: React.FC<{ placeholder?: string; glow?: number }> = ({ placeholder = "问任何问题", glow = 0 }) => (
  <div
    style={{
      position: "absolute", left: INPUT.x, top: INPUT.y, width: INPUT.w, height: INPUT.h, borderRadius: 18,
      background: "#FFFFFF", border: `1px solid ${C.ui.border}`,
      boxShadow: `0 4px 18px rgba(0,0,0,0.05), 0 0 0 ${3 * glow}px rgba(244,154,184,${0.35 * glow})`,
    }}
  >
    <div style={{ ...txt, position: "absolute", left: 14, top: 14, color: C.ui.muted }}>{placeholder}</div>
    <div style={{ position: "absolute", left: 16, top: 60 }}><IconPlus /></div>
    <div style={{ position: "absolute", left: 48, top: 60 }}><IconLoop /></div>
    <div style={{ ...txt, position: "absolute", left: 72, top: 58 }}>始终授权</div>
    <div style={{ position: "absolute", left: INPUT.w - 70, top: 60 }}><IconMic color="#454545" /></div>
    <div style={{ position: "absolute", left: INPUT.w - 44, top: 52, width: 32, height: 32, borderRadius: 16, background: "#BDBDBD", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IconArrowUp size={16} color="#FFFFFF" />
    </div>
  </div>
);

export const Disclaimer: React.FC = () => (
  <div style={{ ...txt, position: "absolute", left: 240, width: 1680, top: 928, textAlign: "center", fontSize: 11, color: C.ui.muted }}>
    内容由AI生成，重要信息请务必核查
  </div>
);

/** Lockup: the app's own vector wordmark + its home-page line, centred in the main pane. */
export const Lockup: React.FC<{ word: number; line: number; out: number }> = ({ word, line, out }) => {
  const W0 = 600;
  const H0 = (W0 * 32) / 254.003;
  const cx = 240 + 1680 / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - out, transform: `translateY(${-14 * out}px)` }}>
      <div
        style={{
          position: "absolute", left: cx - W0 / 2, top: 178, width: W0, height: H0,
          clipPath: `inset(-20% ${100 - 100 * word}% -20% 0)`,
          filter: `blur(${(1 - word) * 6}px)`, transform: `translateY(${(1 - word) * 14}px)`,
        }}
      >
        <Img src={staticFile("brand/loginWordmark.8523d268.svg")} style={{ width: W0, height: H0, display: "block" }} />
      </div>
      <div
        style={{
          position: "absolute", left: cx - 400, width: 800, top: 278, textAlign: "center", fontFamily: FONT.cjk,
          fontWeight: 500, fontSize: 30, letterSpacing: 6 - 4 * line, color: "#6B5A60",
          opacity: line, transform: `translateY(${(1 - line) * 16}px)`,
        }}
      >
        让工作更简单。
      </div>
    </div>
  );
};
