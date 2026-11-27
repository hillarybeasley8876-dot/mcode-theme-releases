import React from "react";
import { Html5Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS, TM } from "./T";

const CHAR_DT = 0.042;
const TYPE_T0 = 0.42;

// [start seconds, file, volume, optional volume envelope over the clip's own seconds]
type Cue = [number, string, number, ((s: number) => number)?];

const CUES: Cue[] = [
  ...[0, 2, 4, 7, 9, 11].map((i, k): Cue => [TYPE_T0 + i * CHAR_DT, "key_tap", 0.28 + 0.06 * (k % 2)]),
  [TM.enter - 0.173, "enter_tap", 0.7],
  [TM.icon - 0.02, "bubbles", 0.42],
  [TM.tap - 0.04 - 0.096, "squish_pop", 0.85],
  [TM.summon - 1.57, "ink_bloom", 0.75, (s) => interpolate(s, [0, 0.55, 0.75], [0, 0, 1], { extrapolateRight: "clamp" })],
  [TM.glintFlash - 0.01, "glint", 0.75],
  [TM.weave - 0.17, "swoosh_big", 0.9],
  [7.02, "swoosh_soft", 0.45],
  [8.9, "riser", 0.38, (s) => interpolate(s, [0, 1.6, 1.97, 2.1], [0.4, 1, 1, 0], { extrapolateRight: "clamp" })],
  [10.42 - 0.063, "panel_snap", 0.45],
  [10.52 - 0.063, "panel_snap", 0.4],
  [10.62 - 0.063, "panel_snap", 0.55],
  [TM.lockup - 0.03, "impact_bloom", 0.85],
  [TM.transitionStart - 0.08, "swoosh_soft", 0.4],
  [TM.morph - 0.1, "swoosh_soft", 0.3],
  [TM.morph + 0.6 - 0.063, "panel_snap", 0.45],
  [TM.currents - 0.3, "swoosh_soft", 0.28],
  [TM.currents - 0.05, "bubbles", 0.3],
  [5.35, "bubbles", 0.22],
  [TM.lockup + 0.06, "resolve_chime_f", 0.32],
];

export const Sound: React.FC = () => {
  const end = TM.duration;
  return (
    <>
      <Html5Audio
        src={staticFile("sfx_n/music.wav")}
        volume={(f) => 0.82 * interpolate(f / FPS, [end - 0.6, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {CUES.map(([t0, name, vol, env], i) => (
        <Sequence key={i} from={Math.round(t0 * FPS)} layout="none">
          <Html5Audio src={staticFile(`sfx_n/${name}.wav`)} volume={(f) => vol * (env ? env(f / FPS) : 1)} />
        </Sequence>
      ))}
    </>
  );
};
