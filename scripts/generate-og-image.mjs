import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public");
mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(tmpdir(), "destiny-og.html");
const pngPath = path.join(outDir, "og-image.png");

writeFileSync(
  htmlPath,
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background: radial-gradient(ellipse at 20% 0%, #163a7a 0%, #071226 45%, #040810 100%);
      color: #f4f7ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      width: 1080px;
      height: 510px;
      border: 1px solid rgba(77, 208, 225, 0.28);
      border-radius: 28px;
      padding: 64px 72px;
      background: linear-gradient(180deg, rgba(11, 61, 145, 0.28), rgba(4, 8, 16, 0.2));
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .kicker { letter-spacing: 0.28em; text-transform: uppercase; color: #4dd0e1; font-size: 22px; font-weight: 700; }
    h1 { margin: 18px 0 0; font-size: 72px; line-height: 1.05; letter-spacing: 0.02em; }
    h1 span { color: #f97316; }
    p { margin: 18px 0 0; font-size: 28px; color: #c5d0e6; max-width: 900px; }
    .row { display: flex; gap: 16px; }
    .pill {
      border: 1px solid rgba(34, 197, 94, 0.35);
      background: rgba(34, 197, 94, 0.12);
      color: #86efac;
      border-radius: 999px;
      padding: 10px 18px;
      font-size: 20px;
      font-weight: 700;
    }
    .pill.cyan { border-color: rgba(77, 208, 225, 0.35); background: rgba(77, 208, 225, 0.12); color: #67e8f9; }
  </style>
</head>
<body>
  <div class="card">
    <div>
      <div class="kicker">Guardian Archives</div>
      <h1>Destiny 2 <span>Code Vault</span></h1>
      <p>49 verified emblem codes plus cosmetics. Copy, filter, and redeem on Bungie.net.</p>
    </div>
    <div class="row">
      <div class="pill">Bungie Day 2026 included</div>
      <div class="pill cyan">No tracking · Open source</div>
    </div>
  </div>
</body>
</html>`,
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
await page.screenshot({ path: pngPath, type: "png" });
await browser.close();
console.log("wrote", pngPath);
