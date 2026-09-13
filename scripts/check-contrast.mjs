/**
 * Every text colour on every surface must clear WCAG AA (4.5:1).
 *
 * Reads the tokens straight out of tokens.css so the audit cannot drift from
 * the palette. Also checks the inverted band's body text over the forest ink.
 *
 *   npm run check:contrast
 */
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/tokens.css", "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [m[1], m[2]]),
);

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (c) => {
  const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = c.map(f);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const la = lum(rgb(a)), lb = lum(rgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const mix = (top, under, alpha) => {
  const t = rgb(top), u = rgb(under);
  return "#" + t.map((v, i) => Math.round((v * alpha + u[i] * (1 - alpha)) * 255).toString(16).padStart(2, "0")).join("");
};

const texts = ["text", "text-mid", "text-dim", "brand", "warn", "stop"];
const grounds = ["bg", "bg-raised", "bg-sunken", "surface", "surface-hi", "surface-max"];
const AA = 4.5;
const failures = [];
let weakest = { r: Infinity };

console.log(`${"".padEnd(10)}${grounds.map((g) => g.padStart(12)).join("")}`);
for (const t of texts) {
  const row = grounds.map((g) => {
    const r = ratio(tokens[t], tokens[g]);
    if (r < AA) failures.push(`${t} on ${g}: ${r.toFixed(2)}`);
    if (r < weakest.r) weakest = { r, pair: `${t} on ${g}` };
    return r;
  });
  console.log(`${t.padEnd(10)}${row.map((r) => (r.toFixed(2) + (r < AA ? "!" : " ")).padStart(12)).join("")}`);
}

// The band: paper-coloured text at 74% over forest, and headings at 100%.
const bandBody = ratio(mix(tokens["on-brand"], tokens["brand"], 0.74), tokens["brand"]);
const bandHead = ratio(tokens["on-brand"], tokens["brand"]);
console.log(`\nband body (74% paper on forest): ${bandBody.toFixed(2)}   band heading: ${bandHead.toFixed(2)}`);
if (bandBody < AA) failures.push(`band body: ${bandBody.toFixed(2)}`);

console.log(`weakest text pairing: ${weakest.pair} at ${weakest.r.toFixed(2)}:1`);
if (failures.length) {
  console.log(`\nFAIL ${failures.length} pairing(s) under ${AA}:1\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("\ncontrast bar met");
