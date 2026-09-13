/**
 * Renders the page at three real widths and fails on horizontal overflow.
 *
 * This is not a nicety. Three genuine bugs shipped past every static audit and
 * were only found here: a background wash inset past the viewport edge, and two
 * grid children with the default min-width:auto refusing to shrink. All three
 * gave the page a sideways scroll that no amount of reading the CSS revealed.
 *
 *   npx playwright install chromium   # once
 *   node scripts/check-layout.mjs
 */
import { chromium } from "playwright";
import { createServer } from "vite";

const WIDTHS = [
  { name: "phone",   width: 390,  height: 1400 },
  { name: "tablet",  width: 820,  height: 1400 },
  { name: "desktop", width: 1440, height: 1500 },
];

const PAGES = ["/", "/method.html"];

const server = await createServer({ server: { port: 5199 }, logLevel: "error" });
await server.listen();

const browser = await chromium.launch();
const problems = [];

for (const path of PAGES)
for (const vp of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.goto("http://localhost:5199" + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  // Does the page body scroll sideways? That is the classic responsive bug.
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);

  // Anything sticking out past the viewport edge.
  const offenders = await page.evaluate((w) => {
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > w + 1 || r.left < -1)) {
        out.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(r.right)}`);
      }
    }
    return [...new Set(out)].slice(0, 6);
  }, vp.width);

  await page.screenshot({ path: `shot-${vp.name}.png`, fullPage: false });

  console.log(`${path.padEnd(13)} ${vp.name.padEnd(8)} ${vp.width}px  overflow=${overflow}px  jsErrors=${errors.length}`);
  if (offenders.length) console.log("   overflowing:", offenders.join(" | "));
  if (errors.length) console.log("   errors:", errors.slice(0, 3).join(" | "));
  if (overflow > 0 || errors.length) problems.push(`${path} ${vp.name}`);
  await page.close();
}

await browser.close();
await server.close();
console.log(problems.length ? `\nPROBLEMS at: ${problems.join(", ")}` : "\nno overflow, no JS errors at any width");
