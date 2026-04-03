import { chromium, devices } from "@playwright/test";
import { spawn } from "child_process";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCREENSHOTS = path.join(ROOT, "docs", "screenshots");
const FRAMES = path.join(SCREENSHOTS, "frames");
const SETTLE_MS = 3500; // let animations settle

mkdirSync(FRAMES, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse the actual local URL from Vite's stdout (handles port changes). */
function startViteAndGetUrl() {
  return new Promise((resolve, reject) => {
    const vite = spawn("npx", ["vite"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    let resolved = false;
    let outputBuf = "";
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.error("Accumulated output:", JSON.stringify(outputBuf.slice(0, 1000)));
        reject(new Error("Timed out waiting for Vite Local URL"));
      }
    }, 30_000);

    const processChunk = (text) => {
      if (resolved) return;
      outputBuf += text;
      const clean = outputBuf.replace(/\x1b\[[0-9;]*m/g, "");
      const m = clean.match(/Local:\s+(http:\/\/localhost:\d+\/\S*)/);
      if (m) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ url: m[1], vite });
      }
    };

    vite.stdout.on("data", (d) => { process.stdout.write(`  [vite] ${d}`); processChunk(d.toString()); });
    vite.stderr.on("data", (d) => { process.stderr.write(`  [vite] ${d}`); processChunk(d.toString()); });
    vite.on("error", reject);
    vite.on("exit", (code) => {
      if (!resolved) reject(new Error(`Vite exited with code ${code}`));
    });
  });
}

function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch { /* not ready yet */ }
      if (Date.now() - start > timeoutMs) return reject(new Error("Dev server timeout"));
      setTimeout(check, 500);
    };
    check();
  });
}

// ── start Vite dev server ────────────────────────────────────────────────────

console.log("🚀 Starting Vite dev server …");
const { url: BASE_URL, vite } = await startViteAndGetUrl();
console.log(`   Detected URL: ${BASE_URL}`);

async function cleanup() {
  console.log("\n🧹 Stopping dev server …");
  vite.kill("SIGTERM");
  // On Windows, also try taskkill for the child tree
  try {
    const { execSync } = await import("child_process");
    execSync(`taskkill /PID ${vite.pid} /T /F 2>NUL`, { stdio: "ignore" });
  } catch { /* best effort */ }
}

process.on("SIGINT", async () => { await cleanup(); process.exit(1); });
process.on("SIGTERM", async () => { await cleanup(); process.exit(1); });

try {
  console.log("⏳ Waiting for dev server at", BASE_URL);
  await waitForServer(BASE_URL);
  console.log("✅ Dev server is ready!\n");

  const browser = await chromium.launch();

  // ── a) Desktop hero screenshot (1280×800) ──────────────────────────────────
  {
    console.log("📸 1/5  Desktop hero screenshot …");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(SETTLE_MS + 2000);
    await page.screenshot({ path: path.join(SCREENSHOTS, "desktop-hero.png"), fullPage: false });
    console.log("   ✔ desktop-hero.png");
    await ctx.close();
  }

  // ── b) Search filter screenshot ────────────────────────────────────────────
  {
    console.log("📸 2/5  Search filter screenshot …");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(SETTLE_MS + 2000);
    // Scroll to the search/grid area and type the query
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await searchInput.click();
    await searchInput.fill("rainbow");
    await page.waitForTimeout(2000); // let filter results render
    // Position search bar ~60px from top so results are visible below
    await page.evaluate(() => {
      const el = document.querySelector('input[placeholder*="Search"]');
      if (el) {
        const rect = el.getBoundingClientRect();
        const absTop = rect.top + window.scrollY;
        window.scrollTo({ top: absTop - 60, behavior: "instant" });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS, "search-filter.png"), fullPage: false });
    console.log("   ✔ search-filter.png");
    await ctx.close();
  }

  // ── c) Mobile screenshot (iPhone 14 – 390×844) ────────────────────────────
  {
    console.log("📸 3/5  Mobile view screenshot …");
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: devices["iPhone 14"].userAgent,
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(SETTLE_MS + 2000);
    await page.screenshot({ path: path.join(SCREENSHOTS, "mobile-view.png"), fullPage: false });
    console.log("   ✔ mobile-view.png");
    await ctx.close();
  }

  // ── d) Dark theme with particles ──────────────────────────────────────────
  {
    console.log("📸 4/5  Dark theme screenshot …");
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(SETTLE_MS + 2000);
    // Simulate mouse movement to trigger particle effects
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(200 + i * 180, 300 + (i % 3) * 100);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS, "dark-theme.png"), fullPage: false });
    console.log("   ✔ dark-theme.png");
    await ctx.close();
  }

  // ── e) Demo frames (10 sequential screenshots) ────────────────────────────
  {
    console.log("📸 5/5  Recording demo frames …");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    let frame = 1;
    const snap = async (label) => {
      const name = `frame-${String(frame).padStart(2, "0")}.png`;
      await page.screenshot({ path: path.join(FRAMES, name), fullPage: false });
      console.log(`   ✔ ${name} — ${label}`);
      frame++;
    };

    // Frame 1-2: Page loading & initial view
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    await snap("page loading");
    await page.waitForTimeout(2500);
    await snap("page loaded — hero visible");

    // Frame 3-4: Scroll down to reveal the emblem grid
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1000);
    await snap("scrolled down — grid appearing");
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await snap("scrolled further — full grid");

    // Frame 5-7: Type a search query character by character
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await searchInput.click();
    await searchInput.pressSequentially("rai", { delay: 200 });
    await page.waitForTimeout(800);
    await snap("typing search — 'rai'");
    await searchInput.pressSequentially("nbow", { delay: 200 });
    await page.waitForTimeout(1200);
    await snap("search results — 'rainbow'");
    await page.waitForTimeout(500);
    await snap("search results settled");

    // Frame 8-10: Clear search and return to full grid
    await searchInput.fill("");
    await page.waitForTimeout(1500);
    await snap("search cleared — grid restored");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await snap("scrolled back to top");
    await page.waitForTimeout(500);
    await snap("final hero view");

    console.log(`\n   ℹ️  ffmpeg not found — skipping GIF creation.`);
    console.log(`   📁 Frames saved in docs/screenshots/frames/ (combine manually with ffmpeg or gifski)`);
    await ctx.close();
  }

  await browser.close();
  console.log("\n🎉 All screenshots captured successfully!");
  console.log("   📂 docs/screenshots/");

} catch (err) {
  console.error("❌ Error:", err);
  process.exitCode = 1;
} finally {
  await cleanup();
  process.exit(process.exitCode || 0);
}
