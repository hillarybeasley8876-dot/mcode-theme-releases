import React from "react";
import { getLength } from "@remotion/paths";
import { C, FONT } from "../T";
import { tokenize } from "../ui/Code";
import { E, H, HC, W, ramp } from "./T";

// The shared tokenizer emits the light-theme palette; re-map it onto the skin's code colours.
const TONE: Record<string, string> = {
  [C.code.kw]: HC.code.kw,
  [C.code.str]: HC.code.str,
  [C.code.fn]: HC.code.fn,
  [C.code.num]: HC.code.num,
  [C.code.com]: HC.code.com,
  [C.code.txt]: HC.code.txt,
};
const tone = (c: string) => TONE[c] ?? c;

const Line: React.FC<{ line: string; reveal?: number }> = ({ line, reveal = 1 }) => {
  let budget = Math.round(line.length * reveal);
  return (
    <>
      {tokenize(line).map((tk, i) => {
        if (budget <= 0) return null;
        const s = tk.s.slice(0, budget);
        budget -= tk.s.length;
        return <span key={i} style={{ color: tone(tk.c) }}>{s}</span>;
      })}
    </>
  );
};

const Block: React.FC<{ lines: string[]; size?: number; lh?: number; reveal?: number }> = ({ lines, size = 15, lh = 1.62, reveal = 1 }) => {
  const total = lines.reduce((a, l) => a + l.length, 0);
  let left = reveal * total;
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: size, lineHeight: lh, whiteSpace: "pre" }}>
      {lines.map((l, i) => {
        const r = l.length === 0 ? (left > 0 ? 1 : 0) : Math.max(0, Math.min(1, left / l.length));
        left -= l.length;
        return (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ width: size * 2.2, color: HC.ui.faint, flex: "none" }}>{i + 1}</span>
            <span><Line line={l} reveal={r} /></span>
          </div>
        );
      })}
    </div>
  );
};

const shell: React.CSSProperties = {
  position: "absolute", left: 0, top: 0, borderRadius: 16, background: "rgba(27,20,35,0.94)",
  border: `1px solid ${HC.ui.border}`, boxShadow: "0 18px 50px rgba(5,2,10,0.6), 0 0 34px rgba(123,63,224,0.2)", overflow: "hidden",
};

const Tab: React.FC<{ name: string; dot: string }> = ({ name, dot }) => (
  <div style={{ height: 40, borderBottom: `1px solid ${HC.ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, background: "rgba(38,28,49,0.6)" }}>
    <div style={{ width: 8, height: 8, borderRadius: 4, background: dot, boxShadow: `0 0 8px ${dot}` }} />
    <div style={{ fontFamily: FONT.mono, fontSize: 13, color: HC.ui.sub }}>{name}</div>
  </div>
);

export const CODE_LINES = [
  'import { brew } from "minimax-code";',
  "",
  "export async function trickOrTreat() {",
  '  const cauldron = await brew("MiniMax Code");',
  "  await cauldron.bubble();",
  '  return cauldron.open({ view: "home" });',
  "}",
];

export const CodeCard: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => (
  <div style={{ ...shell, width: 560, height: 262 }}>
    <Tab name="src/halloween.ts" dot={HC.pumpkin} />
    <div style={{ padding: "14px 18px" }}>
      <Block lines={CODE_LINES} reveal={reveal} />
    </div>
  </div>
);

export const TermCard: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const lines: Array<[string, string]> = [
    ["$ minimax code --halloween", HC.ui.text],
    ["› 正在熬制工作区…", HC.ui.sub],
    ["✓ 南瓜灯已点亮  0.8s", HC.pumpkinHi],
  ];
  const shown = Math.ceil(reveal * lines.length);
  return (
    <div style={{ ...shell, width: 430, height: 156, background: "rgba(10,6,18,0.95)" }}>
      <div style={{ height: 34, display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: "#3a2d4a" }} />
        ))}
      </div>
      <div style={{ padding: "4px 18px", fontFamily: `${FONT.mono}, "MiSans", "Microsoft YaHei UI"`, fontSize: 15, lineHeight: 1.75 }}>
        {lines.slice(0, shown).map(([s, c], i) => (
          <div key={i} style={{ color: c }}>{s}</div>
        ))}
      </div>
    </div>
  );
};

export const DiffCard: React.FC = () => {
  const rows: Array<[string, string, string]> = [
    ["+", "<WitchHat glow={HC.pumpkin} />", HC.code.add],
    ["+", "await bats.fly(task);", HC.code.add],
    ["-", "showSplash(false);", HC.code.del],
  ];
  return (
    <div style={{ ...shell, width: 420, height: 168 }}>
      <div style={{ height: 40, borderBottom: `1px solid ${HC.ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: HC.ui.sub }}>Boot.tsx</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: HC.code.add }}>+31</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: HC.code.del }}>-10</div>
      </div>
      <div style={{ padding: "10px 0", fontFamily: FONT.mono, fontSize: 14, lineHeight: 1.85 }}>
        {rows.map(([m, s, c], i) => (
          <div key={i} style={{ display: "flex", padding: "0 16px", background: m === "+" ? "rgba(4,181,75,0.1)" : "rgba(247,54,70,0.1)" }}>
            <span style={{ width: 20, color: c }}>{m}</span>
            <span><Line line={s} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Code streaming along curves around her during the summon. Paths run left -> right.
const STREAMS: Array<{ d: string; text: string; delay: number; size: number; speed: number; dir: "in" | "out" }> = [
  { d: "M 60 230 C 460 280, 680 460, 900 560", text: 'await cauldron.stir("./minimax-code-boot");', delay: 0.0, size: 22, speed: 560, dir: "in" },
  { d: "M 1000 560 C 1210 470, 1400 290, 1860 210", text: "tentacles.forEach((t, i) => t.reach(pumpkins[i]));", delay: 0.12, size: 22, speed: 600, dir: "out" },
  { d: "M 20 880 C 430 900, 650 740, 880 700", text: 'git commit -m "feat: halloween boot animation"', delay: 0.22, size: 20, speed: 520, dir: "in" },
  { d: "M 1020 700 C 1270 740, 1500 900, 1900 880", text: "for (const bat of night.sky) bat.flap();", delay: 0.06, size: 20, speed: 540, dir: "out" },
  { d: "M -80 600 C 340 570, 600 600, 860 620", text: 'const potion = brew("#7B3FE0").glow({ embers: true });', delay: 0.3, size: 18, speed: 640, dir: "in" },
  { d: "M 1060 620 C 1320 600, 1580 560, 2000 560", text: 'export default defineConfig({ theme: "halloween" });', delay: 0.36, size: 18, speed: 620, dir: "out" },
];
const LENS = STREAMS.map((s) => getLength(s.d));

export const CodeCurrents: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  if (t < t0 || t > t1) return null;
  const op = ramp(t, t0, t0 + 0.35, E.soft) * (1 - ramp(t, t1 - 0.3, t1));
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op, filter: "drop-shadow(0 0 6px rgba(255,138,31,0.35))" }}>
      <defs>
        <radialGradient id="hwEdgeFade" cx="50%" cy="52%" r="62%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.52" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.76" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hwEdgeMask">
          <rect width={W} height={H} fill="url(#hwEdgeFade)" />
        </mask>
        {STREAMS.map((s, i) => (
          <path key={i} id={`hwStream${i}`} d={s.d} />
        ))}
      </defs>
      <g mask="url(#hwEdgeMask)">
        {STREAMS.map((s, i) => {
          const dt = t - t0 - s.delay;
          if (dt <= 0) return null;
          const textLen = s.text.length * s.size * 0.6;
          const off = s.dir === "out" ? dt * s.speed - textLen : LENS[i] - dt * s.speed;
          return (
            <text key={i} fontFamily={FONT.mono} fontSize={s.size} fontWeight={500} letterSpacing={0.4} opacity={0.88}>
              <textPath href={`#hwStream${i}`} startOffset={off}>
                {tokenize(s.text).map((tk, j) => (
                  <tspan key={j} fill={tone(tk.c)}>{tk.s}</tspan>
                ))}
              </textPath>
            </text>
          );
        })}
      </g>
    </svg>
  );
};

const WALL = [
  "export async function trickOrTreat() {",
  '  const cauldron = await brew("MiniMax Code");',
  "  await cauldron.bubble();",
  '  return cauldron.open({ view: "home" });',
  "}",
  "",
  "for (const bat of night.sky) bat.flap();",
];

/** Big defocused code behind the close-up. */
export const CodeWall: React.FC<{ t: number }> = ({ t }) => (
  <div
    style={{
      position: "absolute", left: -120, top: 60 - (t % 30) * 46, width: W + 400, transform: "rotate(-9deg)",
      fontFamily: FONT.mono, fontSize: 64, lineHeight: 1.5, whiteSpace: "pre", filter: "blur(3.2px)", opacity: 0.3,
    }}
  >
    {[...WALL, ...WALL].map((l, i) => (
      <div key={i}>
        <Line line={l} />
        {l === "" ? " " : null}
      </div>
    ))}
  </div>
);
