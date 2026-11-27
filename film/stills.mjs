// node stills.mjs 0.8 1.4 ...   -> out/stills/t_<sec>.jpg  (bundle once, render many)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: "C:/Program Files/Google/Chrome/Application/chrome.exe", chromiumOptions: { gl: "angle" } });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "Boot", puppeteerInstance: browser });
fs.mkdirSync("out/stills", { recursive: true });
for (const t of times) {
  const frame = Math.round(t * composition.fps);
  const output = `out/stills/${process.env.COMP ? process.env.COMP + "_" : ""}t_${t.toFixed(2)}.${process.env.PNG ? "png" : "jpg"}`;
  const t0 = Date.now();
  await renderStill({ serveUrl, composition, frame, output, ...(process.env.PNG ? { imageFormat: "png" } : { imageFormat: "jpeg", jpegQuality: 88 }), puppeteerInstance: browser, browserExecutable: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  console.log("still", t, frame, `${Date.now() - t0}ms`);
}
await browser.close({ silent: true });
