import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pngPath = path.resolve(__dirname, "../public/og-image.png");
const pageUrl = process.env.OG_URL ?? "https://manaiakalani.github.io/destiny-code-finder/";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=metal"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(pageUrl, { waitUntil: "networkidle" });
await page.waitForSelector(".hero-sky canvas", { timeout: 20_000 });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  document.querySelector(".hero-loaded")?.remove();
  const hero = document.querySelector(".hero-sky");
  if (!hero) return;
  document.body.replaceChildren(hero);
  document.body.style.margin = "0";
  document.body.style.background = "#08090d";
  hero.style.height = "630px";
  hero.style.minHeight = "630px";
});
await page.waitForTimeout(700);
await page.screenshot({ path: pngPath, type: "png" });
await browser.close();
console.log("wrote", pngPath);
