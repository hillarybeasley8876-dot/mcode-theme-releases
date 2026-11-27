import React from "react";
import { C, FONT, H, W, ramp, E } from "../T";
import { tokenize } from "../ui/Code";
import { getLength } from "@remotion/paths";

// Real, syntactically valid lines — vector text, so no generated-glyph typos are possible.
// Every path runs left -> right so glyphs stay upright. "in" streams emerge at their right end
// (behind her) and travel left; "out" streams emerge at their left end and travel right.
const STREAMS: Array<{ d: string; text: string; delay: number; size: number; speed: number; dir: "in" | "out" }> = [
  { d: "M 60 230 C 460 280, 680 460, 900 560", text: 'await workspace.open("./minimax-code-boot");', delay: 0.0, size: 22, speed: 560, dir: "in" },
  { d: "M 1000 560 C 1210 470, 1400 290, 1860 210", text: "tentacles.forEach((t, i) => t.reach(tasks[i]));", delay: 0.12, size: 22, speed: 600, dir: "out" },
  { d: "M 20 880 C 430 900, 650 740, 880 700", text: 'git commit -m "feat: octopus boot animation"', delay: 0.22, size: 20, speed: 520, dir: "in" },
  { d: "M 1020 700 C 1270 740, 1500 900, 1900 880", text: "for (const file of project) agent.read(file);", delay: 0.06, size: 20, speed: 540, dir: "out" },
  { d: "M -80 600 C 340 570, 600 600, 860 620", text: 'const ink = drop("#8E1F45").bloom({ radius: 1 });', delay: 0.3, size: 18, speed: 640, dir: "in" },
  { d: "M 1060 620 C 1320 600, 1580 560, 2000 560", text: 'export default defineConfig({ app: "MiniMax Code" });', delay: 0.36, size: 18, speed: 620, dir: "out" },
];

const LENS = STREAMS.map((s) => getLength(s.d));

const tone = (c: string) => (c === C.code.txt ? "#5A3A46" : c);

export const CodeCurrents: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  if (t < t0) return null;
  const op = ramp(t, t0, t0 + 0.35, E.soft);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <defs>
        <radialGradient id="edgeFade" cx="50%" cy="52%" r="62%">
          <stop offset="0.0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.52" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.76" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="edgeMask">
          <rect width={W} height={H} fill="url(#edgeFade)" />
        </mask>
        {STREAMS.map((s, i) => (
          <path key={i} id={`stream${i}`} d={s.d} />
        ))}
      </defs>
      <g mask="url(#edgeMask)">
        {STREAMS.map((s, i) => {
          const dt = t - t0 - s.delay;
          if (dt <= 0) return null;
          const textLen = s.text.length * s.size * 0.6;
          const off = s.dir === "out" ? dt * s.speed - textLen : LENS[i] - dt * s.speed;
          return (
            <text key={i} fontFamily={FONT.mono} fontSize={s.size} fontWeight={500} letterSpacing={0.4} opacity={0.82}>
              <textPath href={`#stream${i}`} startOffset={off}>
                {tokenize(s.text).map((tk, j) => (
                  <tspan key={j} fill={tone(tk.c)}>
                    {tk.s}
                  </tspan>
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
  "export async function boot() {",
  '  const app = await launch("MiniMax Code");',
  "  await app.ready();",
  '  return app.open({ view: "home" });',
  "}",
  "",
  "tentacles.forEach((t, i) => t.reach(tasks[i]));",
];

/** Big defocused code behind the close-up: reads as "code" without competing with her face. */
export const CodeWall: React.FC<{ t: number }> = ({ t }) => (
  <div
    style={{
      position: "absolute", left: -120, top: 60 - (t % 30) * 46, width: W + 400, transform: "rotate(-9deg)",
      fontFamily: FONT.mono, fontSize: 64, lineHeight: 1.5, whiteSpace: "pre", filter: "blur(3.2px)", opacity: 0.26,
    }}
  >
    {[...WALL, ...WALL].map((l, i) => (
      <div key={i}>
        {tokenize(l).map((tk, j) => (
          <span key={j} style={{ color: tone(tk.c) }}>
            {tk.s}
          </span>
        ))}
        {l === "" ? " " : null}
      </div>
    ))}
  </div>
);
