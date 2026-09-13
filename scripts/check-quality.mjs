/**
 * The quality bar, enforced.
 *
 * Runs against the built site (npm run build first) and fails on any of:
 *   - first-route JavaScript over the gzipped budget
 *   - Largest Contentful Paint or Cumulative Layout Shift over budget
 *   - readable text resting at opacity 0 after load, with motion on or off
 *   - the paper grain darkening the ground by more than the budget
 *   - placeholder copy (lorem, Acme) anywhere in the source
 *   - any of the first forty focusable controls lacking a visible focus ring
 *
 *   npm run build && npm run check:quality
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { chromium } from "playwright";
import { preview } from "vite";

const BUDGET = {
  firstRouteJsGzipKb: 150,
  lcpMs: 2500,
  cls: 0.1,
  grainDarkeningPct: 5,
};

const problems = [];
const report = (ok, line) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${line}`);
  if (!ok) problems.push(line);
};

/* ---- 1. bundle budget ---- */
const assets = join("dist", "assets");
const gz = (file) => gzipSync(readFileSync(join(assets, file))).length / 1024;
const js = readdirSync(assets).filter((f) => f.endsWith(".js"));
const first = js.filter((f) => !f.startsWith("BelowFold") && !f.startsWith("motionFeatures") && !f.startsWith("method"));
const firstKb = first.reduce((n, f) => n + gz(f), 0);
report(firstKb <= BUDGET.firstRouteJsGzipKb,
  `first-route JS ${firstKb.toFixed(1)} KB gzipped (budget ${BUDGET.firstRouteJsGzipKb}) · ${first.join(", ")}`);
for (const f of js.filter((f) => !first.includes(f))) console.log(`     deferred ${f} ${gz(f).toFixed(1)} KB gzipped`);

/* ---- 2. placeholder copy ---- */
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const offenders = walk("src").filter((p) => /lorem ipsum|\bacme\b/i.test(readFileSync(p, "utf8")));
report(offenders.length === 0, `placeholder copy: ${offenders.length ? offenders.join(", ") : "none"}`);

/* ---- 3. in the browser ---- */
const server = await preview({ preview: { port: 4199, strictPort: true }, logLevel: "error" });
const url = "http://localhost:4199/";
const browser = await chromium.launch();

async function vitals(page) {
  return page.evaluate(() => new Promise((resolve) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve({ lcp, cls }), 2500);
  }));
}

/** Text that a reader can see nothing of: in the viewport, has words, opacity ≈ 0. */
async function hiddenText(page) {
  return page.evaluate(() => {
    const out = [];
    const vh = window.innerHeight;
    for (const el of document.querySelectorAll("h1,h2,h3,p,li,dt,dd,span,a,button")) {
      if (!el.textContent?.trim()) continue;
      // An alternate state that is deliberately hidden from everyone is not
      // text resting invisible; it is text that is not there yet.
      if (el.closest('[aria-hidden="true"]')) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width === 0) continue;
      let node = el, op = 1;
      while (node && node !== document.body) { op *= parseFloat(getComputedStyle(node).opacity); node = node.parentElement; }
      if (op < 0.1) out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}"`);
    }
    return [...new Set(out)].slice(0, 5);
  });
}

for (const reduced of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  const { lcp, cls } = await vitals(page);
  const label = reduced ? "reduced motion" : "motion on";
  report(lcp > 0 && lcp <= BUDGET.lcpMs, `${label}: LCP ${Math.round(lcp)} ms (budget ${BUDGET.lcpMs})`);
  report(cls <= BUDGET.cls, `${label}: CLS ${cls.toFixed(3)} (budget ${BUDGET.cls})`);

  // Text resting invisible: at the top, and again after scrolling to the middle
  // and the end, where scroll-driven reveals would leave anything they missed.
  const hidden = new Set(await hiddenText(page));
  for (const frac of [0.5, 1]) {
    await page.evaluate((f) => window.scrollTo(0, (document.body.scrollHeight - window.innerHeight) * f), frac);
    await page.waitForTimeout(700);
    for (const h of await hiddenText(page)) hidden.add(h);
  }
  report(hidden.size === 0, `${label}: text resting at opacity 0: ${hidden.size ? [...hidden].join(" | ") : "none"}`);
  await ctx.close();
}

/* ---- 3b. keyboard: the first forty focusables all show a ring ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(800);
  const noRing = [];
  let count = 0;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        label: `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`,
        ring: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
      };
    });
    if (!info) continue;
    count++;
    if (!info.ring) noRing.push(info.label);
  }
  report(count > 0 && noRing.length === 0,
    `keyboard: ${count} focusables tabbed, ${noRing.length} without a visible ring${noRing.length ? ` (${[...new Set(noRing)].slice(0, 5).join(", ")})` : ""}`);
  await page.close();
}

/* ---- 4. grain calibration: how much darker is the bare ground than --bg? ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(500);
  // Hide everything but the ground, then sample a large patch.
  await page.addStyleTag({ content: "#root{visibility:hidden}" });
  const png = await page.screenshot({ clip: { x: 100, y: 200, width: 600, height: 400 }, type: "png" });
  // Decode a PNG's mean luminance without a dependency: use the browser.
  const mean = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let sum = 0; for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    return sum / (d.length / 4);
  }, png.toString("base64"));
  const bgLum = 0.2126 * 0xfd + 0.7152 * 0xfc + 0.0722 * 0xf8;
  const darkening = (1 - mean / bgLum) * 100;
  report(darkening <= BUDGET.grainDarkeningPct,
    `grain darkens the ground by ${darkening.toFixed(2)}% on average (budget ${BUDGET.grainDarkeningPct}%)`);
  await page.close();
}

await browser.close();
await server.close();

console.log(problems.length ? `\n${problems.length} problem(s)` : "\nquality bar met");
process.exit(problems.length ? 1 : 0);
