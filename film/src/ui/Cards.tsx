import React from "react";
import { C, FONT } from "../T";
import { CodeBlock, CodeLine } from "./Code";

const shell: React.CSSProperties = {
  position: "absolute", left: 0, top: 0, borderRadius: 16, background: "rgba(255,255,255,0.94)",
  border: `1px solid ${C.ui.border}`, boxShadow: "0 18px 50px rgba(142,31,69,0.16), 0 2px 6px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

const Tab: React.FC<{ name: string; dot: string }> = ({ name, dot }) => (
  <div style={{ height: 40, borderBottom: `1px solid ${C.ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, background: "#FCFCFC" }}>
    <div style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />
    <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.ui.sub }}>{name}</div>
  </div>
);

export const CODE_LINES = [
  'import { launch } from "minimax-code";',
  "",
  "export async function boot() {",
  '  const app = await launch("MiniMax Code");',
  "  await app.ready();",
  '  return app.open({ view: "home" });',
  "}",
];

export const CodeCard: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => (
  <div style={{ ...shell, width: 560, height: 262 }}>
    <Tab name="src/boot.ts" dot={C.code.fn} />
    <div style={{ padding: "14px 18px" }}>
      <CodeBlock lines={CODE_LINES} size={15} lh={1.62} reveal={reveal} />
    </div>
  </div>
);
CodeCard.displayName = "CodeCard";

export const TermCard: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const lines: Array<[string, string]> = [
    ["$ minimax code", "#F4E9EE"],
    ["› 正在唤醒工作区…", "#C9AEB9"],
    ["✓ 已就绪  0.8s", C.pink],
  ];
  const shown = Math.ceil(reveal * lines.length);
  return (
    <div style={{ ...shell, width: 430, height: 156, background: "rgba(36,26,31,0.96)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ height: 34, display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
        {["#5A4650", "#5A4650", "#5A4650"].map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />
        ))}
      </div>
      <div style={{ padding: "4px 18px", fontFamily: FONT.mono, fontSize: 15, lineHeight: 1.75 }}>
        {lines.slice(0, shown).map(([s, c], i) => (
          <div key={i} style={{ color: c, fontFamily: i === 0 ? FONT.mono : `${FONT.mono}, ${FONT.cjk}` }}>{s}</div>
        ))}
      </div>
    </div>
  );
};

export const DiffCard: React.FC = () => {
  const rows: Array<[string, string, string]> = [
    ["+", "<Octopus ink={C.wine} />", C.code.add],
    ["+", "await tentacles.reach(task);", C.code.add],
    ["-", "showSplash(false);", C.code.del],
  ];
  return (
    <div style={{ ...shell, width: 420, height: 168 }}>
      <div style={{ height: 40, borderBottom: `1px solid ${C.ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.ui.sub }}>Boot.tsx</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.code.add }}>+42</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.code.del }}>-7</div>
      </div>
      <div style={{ padding: "10px 0", fontFamily: FONT.mono, fontSize: 14, lineHeight: 1.85 }}>
        {rows.map(([m, s, c], i) => (
          <div key={i} style={{ display: "flex", padding: "0 16px", background: m === "+" ? "rgba(26,127,55,0.07)" : "rgba(207,34,46,0.07)" }}>
            <span style={{ width: 20, color: c }}>{m}</span>
            <span><CodeLine line={s} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};
