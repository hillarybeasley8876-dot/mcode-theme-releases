import React, { useEffect, useState } from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Boot } from "./Boot";
import { BootHW } from "./hw/BootHW";
import { BootXM } from "./xm/BootXM";
import hwTiming from "./hw/timing.json";
import xmTiming from "./xm/timing.json";
import { FPS, H, TM, W } from "./T";

const FACES: Array<[string, string, string]> = [
  ["JetBrains Mono", "fonts/JetBrainsMono-Variable.ttf", "100 800"],
  ["MiSans", "fonts/MiSans-Regular.otf", "400"],
  ["MiSans", "fonts/MiSans-Medium.otf", "500"],
  ["MiSans", "fonts/MiSans-Semibold.otf", "600"],
  ["MiSans", "fonts/MiSans-Bold.otf", "700"],
];

const Fonts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(
      FACES.map(([family, file, weight]) => {
        const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
        return f.load().then((l) => document.fonts.add(l));
      }),
    )
      // system UI faces used by the real client (Segoe UI / YaHei) are installed locally
      .then(() => Promise.all(["14px 'Segoe UI'", "14px 'Microsoft YaHei UI'", "600 15px 'Segoe UI'"].map((s) => document.fonts.load(s, "新建任务Aa"))))
      .then(() => continueRender(handle))
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
  return <>{children}</>;
};

const BootWithFonts: React.FC = () => (
  <Fonts>
    <Boot />
  </Fonts>
);

const BootHWWithFonts: React.FC = () => (
  <Fonts>
    <BootHW />
  </Fonts>
);

const BootXMWithFonts: React.FC = () => (
  <Fonts>
    <BootXM />
  </Fonts>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Boot" component={BootWithFonts} durationInFrames={Math.round(TM.duration * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="BootHW" component={BootHWWithFonts} durationInFrames={Math.round(hwTiming.duration * hwTiming.fps)} fps={hwTiming.fps} width={W} height={H} />
    <Composition id="BootXM" component={BootXMWithFonts} durationInFrames={Math.round(xmTiming.duration * xmTiming.fps)} fps={xmTiming.fps} width={W} height={H} />
  </>
);
