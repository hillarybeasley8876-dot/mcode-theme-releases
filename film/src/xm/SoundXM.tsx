import React from "react";
import { Html5Audio, Sequence, interpolate, staticFile } from "remotion";
import { CHAR_DT, FPS, TM, TYPE_T0 } from "./T";

// [start s, file, volume, clip length s (faded out over its last 0.3 s), envelope over clip seconds]
type Cue = [number, string, number, number?, ((s: number) => number)?];

const fadeOut = (len: number) => (s: number) => interpolate(s, [len - 0.3, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Every cue is placed so that its attack (not the start of its file) lands on the picture.
// Pitched cues are kept to ones that agree with the score (E-flat major): the bell-and-organ hit is in E-flat.
const CUES: Cue[] = [
  ...[0, 2, 4, 7, 9, 11].map((i, k): Cue => [TYPE_T0 + i * CHAR_DT - 0.03, "sfx_n/key_tap", 0.26 + 0.06 * (k % 2)]),
  [TM.enter - 0.173, "sfx_n/enter_tap", 0.66],
  [TM.icon - 0.02, "sfx_n/bubbles", 0.28],
  [TM.hat - 0.056, "xm/sfx_n/xm_hat_poof", 0.6],
  [TM.tap - 0.04 - 0.096, "sfx_n/squish_pop", 0.78],
  [TM.tap + 0.02, "xm/sfx_n/xm_snow_bloom", 0.34, 1.7, (s) => interpolate(s, [0, 0.2], [0.3, 1], { extrapolateRight: "clamp" })],
  [TM.snow - 0.1, "xm/sfx_n/xm_bells_a", 0.42, 1.3],
  [TM.summon + 0.1, "xm/sfx_n/xm_twinkle", 0.5, 2.3],
  [TM.currents - 0.3, "sfx_n/swoosh_soft", 0.26],
  [TM.glintFlash - 0.01, "sfx_n/glint", 0.55],
  [TM.weave - 0.36, "xm/sfx_n/xm_bells_b", 0.36, 1.2],
  [TM.weave - 0.17, "sfx_n/swoosh_big", 0.52],
  [TM.land + 0.0 - 0.063, "sfx_n/panel_snap", 0.4],
  [TM.land + 0.08 - 0.063, "sfx_n/panel_snap", 0.36],
  [TM.lockup - 0.063, "sfx_n/panel_snap", 0.45],
  [TM.lockup - 0.74, "hw/sfx/hw_impact", 0.5, 3.2],
  [TM.morph - 0.1, "sfx_n/swoosh_soft", 0.28],
  [TM.morph + 0.42 - 0.056, "xm/sfx_n/xm_hat_poof", 0.3, 0.8],
  [TM.morph + 0.6 - 0.063, "sfx_n/panel_snap", 0.42],
  [TM.growStart - 0.08, "sfx_n/swoosh_soft", 0.34],
];

export const SoundXM: React.FC = () => {
  const end = TM.duration;
  return (
    <>
      <Html5Audio
        src={staticFile("xm/music.wav")}
        volume={(f) => 0.68 * interpolate(f / FPS, [end - 0.45, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {CUES.map(([t0, name, vol, len, env], i) => (
        <Sequence key={i} from={Math.round(t0 * FPS)} durationInFrames={len ? Math.round(len * FPS) : undefined} layout="none">
          <Html5Audio
            src={staticFile(`${name}.wav`)}
            volume={(f) => vol * (env ? env(f / FPS) : 1) * (len ? fadeOut(len)(f / FPS) : 1)}
          />
        </Sequence>
      ))}
    </>
  );
};
