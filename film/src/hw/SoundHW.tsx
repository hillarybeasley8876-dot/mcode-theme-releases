import React from "react";
import { Html5Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS, TM } from "./T";

const CHAR_DT = 0.042;
const TYPE_T0 = 0.42;

// [start s, file, volume, clip length s (faded out over its last 0.3 s), envelope over clip seconds]
type Cue = [number, string, number, number?, ((s: number) => number)?];

const fadeOut = (len: number) => (s: number) => interpolate(s, [len - 0.3, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const CUES: Cue[] = [
  ...[0, 2, 4, 7, 9, 11].map((i, k): Cue => [TYPE_T0 + i * CHAR_DT, "sfx_n/key_tap", 0.28 + 0.06 * (k % 2)]),
  [TM.enter - 0.173, "sfx_n/enter_tap", 0.7],
  [TM.icon - 0.02, "sfx_n/bubbles", 0.32],
  [TM.hat - 0.06, "hw/sfx/hw_hat_poof", 0.55, 0.6],
  [TM.tap - 0.04 - 0.096, "sfx_n/squish_pop", 0.8],
  [TM.tap + 0.02, "hw/sfx/hw_cauldron_bloom", 0.42, 1.6, (s) => interpolate(s, [0, 0.25], [0, 1], { extrapolateRight: "clamp" })],
  [TM.bats - 0.12, "hw/sfx/hw_bats", 0.55, 1.4],
  [TM.summon + 0.25, "hw/sfx/hw_candle_twinkle", 0.32, 2.0],
  [TM.currents - 0.3, "sfx_n/swoosh_soft", 0.26],
  [TM.currents + 0.35, "hw/sfx/hw_ghost_whoosh", 0.16, 1.4],
  [TM.glintFlash - 0.01, "sfx_n/glint", 0.7],
  [TM.weave - 0.36, "hw/sfx/hw_bats", 0.4, 1.2],
  [TM.weave - 0.17, "sfx_n/swoosh_big", 0.55],
  [TM.land + 0.0 - 0.063, "sfx_n/panel_snap", 0.4],
  [TM.land + 0.08 - 0.063, "sfx_n/panel_snap", 0.36],
  [TM.lockup - 0.063, "sfx_n/panel_snap", 0.45],
  [TM.lockup - 0.74, "hw/sfx/hw_impact", 0.62, 3.2],
  [TM.lockup + 0.28, "hw/sfx/hw_pumpkin_ignite", 0.4, 0.7],
  [TM.morph - 0.1, "sfx_n/swoosh_soft", 0.28],
  [TM.morph + 0.42, "hw/sfx/hw_hat_poof", 0.32, 0.6],
  [TM.morph + 0.6 - 0.063, "sfx_n/panel_snap", 0.42],
  [TM.transitionStart - 0.08, "sfx_n/swoosh_soft", 0.36],
];

export const SoundHW: React.FC = () => {
  const end = TM.duration;
  return (
    <>
      <Html5Audio
        src={staticFile("hw/music.wav")}
        volume={(f) => 0.85 * interpolate(f / FPS, [end - 0.5, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
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
