import React from "react";
import { Img, staticFile } from "remotion";

const SRC_FPS = 24;

export type Remap = Array<[number, number]>; // [film seconds, source seconds] knots, piecewise linear

export const remap = (knots: Remap, t: number) => {
  if (t <= knots[0][0]) return knots[0][1];
  for (let i = 1; i < knots.length; i++) {
    const [t1, s1] = knots[i];
    const [t0, s0] = knots[i - 1];
    if (t <= t1) return s0 + ((t - t0) / (t1 - t0)) * (s1 - s0);
  }
  return knots[knots.length - 1][1];
};

/**
 * One frame of a 24 fps plate sequence (keyed RGBA png / flat-fielded jpg / raw jpg).
 * Source frames are held, never blended, so the character keeps clean animation-on-twos timing.
 */
export const Plate: React.FC<{
  dir: string;
  ext: "png" | "jpg";
  src: number; // source seconds
  first: number;
  last: number;
  style?: React.CSSProperties;
}> = ({ dir, ext, src, first, last, style }) => {
  const n = Math.max(first, Math.min(last, Math.floor(src * SRC_FPS + 1e-4)));
  return (
    <Img
      src={staticFile(`${dir}/${String(n).padStart(4, "0")}.${ext}`)}
      style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...style }}
    />
  );
};
