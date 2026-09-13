import { m, useReducedMotion } from "motion/react";
import type { TetherGeometry } from "../../hooks/useTether";
import "./Tether.css";

/**
 * The citation link, drawn.
 *
 * The one ornament on the page, and it earns its place by making the product's
 * whole claim visible without words: this number came from that source.
 */
export function Tether({ geometry }: { geometry: TetherGeometry | null }) {
  const reduced = useReducedMotion();
  if (!geometry) return null;

  const { x1, y1, x2, y2 } = geometry;
  const bend = x1 + (x2 - x1) * 0.55;
  const d = `M ${x1} ${y1} C ${bend} ${y1}, ${bend} ${y2}, ${x2} ${y2}`;

  return (
    <svg className="tether" aria-hidden="true">
      <m.path
        d={d}
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.2, 0.7, 0.3, 1] }}
      />
      <circle className="tether__end" cx={x1} cy={y1} r={3} />
      <circle className="tether__end" cx={x2} cy={y2} r={3} />
    </svg>
  );
}
