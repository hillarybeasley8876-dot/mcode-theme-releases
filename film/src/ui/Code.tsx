import React from "react";
import { C, FONT } from "../T";

// Minimal TS/shell highlighter — enough for the handful of lines the film shows.
const KW = new Set([
  "import", "from", "export", "default", "async", "await", "const", "let", "return", "function",
  "for", "of", "new", "if", "true", "false",
]);

type Tok = { s: string; c: string };

export const tokenize = (line: string): Tok[] => {
  const out: Tok[] = [];
  const re = /(\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [s, com, str, num, id] = m;
    if (com) out.push({ s, c: C.code.com });
    else if (str) out.push({ s, c: C.code.str });
    else if (num) out.push({ s, c: C.code.num });
    else if (id) {
      const next = line.slice(re.lastIndex).trimStart()[0];
      out.push({ s, c: KW.has(s) ? C.code.kw : next === "(" ? C.code.fn : C.code.txt });
    } else out.push({ s, c: C.code.txt });
  }
  return out;
};

export const CodeLine: React.FC<{ line: string; reveal?: number }> = ({ line, reveal = 1 }) => {
  const toks = tokenize(line);
  let budget = Math.round(line.length * reveal);
  return (
    <>
      {toks.map((t, i) => {
        if (budget <= 0) return null;
        const s = t.s.slice(0, budget);
        budget -= t.s.length;
        return (
          <span key={i} style={{ color: t.c }}>
            {s}
          </span>
        );
      })}
    </>
  );
};

export const CodeBlock: React.FC<{ lines: string[]; size?: number; lh?: number; reveal?: number; gutter?: boolean }> = ({
  lines,
  size = 15,
  lh = 1.7,
  reveal = 1,
  gutter = true,
}) => {
  const total = lines.reduce((a, l) => a + l.length, 0);
  let left = reveal * total;
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: size, lineHeight: lh, whiteSpace: "pre" }}>
      {lines.map((l, i) => {
        const r = l.length === 0 ? (left > 0 ? 1 : 0) : Math.max(0, Math.min(1, left / l.length));
        left -= l.length;
        return (
          <div key={i} style={{ display: "flex" }}>
            {gutter && <span style={{ width: size * 2.2, color: "#C9C9C9", flex: "none" }}>{i + 1}</span>}
            <span>
              <CodeLine line={l} reveal={r} />
            </span>
          </div>
        );
      })}
    </div>
  );
};
