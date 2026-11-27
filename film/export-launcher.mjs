// Writes the launcher config from src/timing.json — the film and the launcher share one timeline.
import fs from "node:fs";

// node export-launcher.mjs [--timing src/hw/timing.json] out.json ...
const args = process.argv.slice(2);
const ti = args.indexOf("--timing");
const timingFile = ti >= 0 ? args.splice(ti, 2)[1] : "src/timing.json";
const T = JSON.parse(fs.readFileSync(timingFile, "utf8"));
const w = T.window;
const cfg = {
  AutoReplaceEntrypoints: false,
  ScanAllLocalDrives: false,
  Video: "media/startup.mp4",
  AppLaunch: "shell:AppsFolder\\com.minimax.agent.cn",
  ProcessPathContains: "\\MiniMax Code\\",
  OfficialExecutable: "%LOCALAPPDATA%\\Programs\\MiniMax Code\\MiniMax Code.exe",
  ProcessNames: ["MiniMax Code"],
  HoldAt: T.holdAt,
  TransitionStart: T.transitionStart,
  TransitionEnd: T.transitionEnd,
  MaxWaitSeconds: 60,
  Volume: 1,
  PlayerWidth: 1920,
  PlayerHeight: 1080,
  MatchClientToPlayer: true,
  // The film grows its window with the same smoothstep the launcher applies to the live thumbnail,
  // so a constant source rect makes the real client land exactly on the drawn one.
  ScreenFrames: [
    { Time: T.transitionStart, X: w.x, Y: w.y, Width: w.w, Height: w.h },
    { Time: T.transitionEnd, X: w.x, Y: w.y, Width: w.w, Height: w.h },
  ],
  DisplayName: "MiniMax Code",
};
for (const out of args) fs.writeFileSync(out, JSON.stringify(cfg, null, 2) + "\n");
console.log(JSON.stringify(cfg));
