import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import "./SourceTrace.css";

/** Below this hero content width the statement sits under the copy, not beside it. */
const MIN_WIDTH_TO_DRAW = 1000;

const EASE = [0.2, 0.7, 0.3, 1] as const;

interface Geometry {
  width: number;
  height: number;
  /** End of the promise in the headline. */
  tx: number;
  ty: number;
  /** The figure it traces to, on the real statement. */
  fx: number;
  fy: number;
  fw: number;
  fh: number;
}

/**
 * The brand's one set-piece: the promise in the headline traced to the opening
 * balance on the real statement beside it. It is the "trace precedents" gesture
 * every accountant already knows from a spreadsheet, drawn on paper.
 *
 * Runs once on load and rests. Goes away the first time someone clicks the
 * statement themselves, because at that point the demo has taken over.
 */
export function SourceTrace({
  heroRef,
  targetRef,
  sourceRef,
  show,
}: {
  heroRef: RefObject<HTMLElement | null>;
  targetRef: RefObject<HTMLElement | null>;
  sourceRef: RefObject<HTMLButtonElement | null>;
  show: boolean;
}) {
  const reduced = useReducedMotion();
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const measure = () => {
      const hero = heroRef.current;
      const target = targetRef.current;
      const row = sourceRef.current;
      const figure = row?.querySelector<HTMLElement>(".line__figure");
      if (!hero || !target || !figure) return setGeo(null);

      const box = hero.getBoundingClientRect();
      if (box.width < MIN_WIDTH_TO_DRAW) return setGeo(null);

      // The promise can wrap onto two lines; the trace leaves from the last one.
      const rects = target.getClientRects();
      const t = rects[rects.length - 1] ?? target.getBoundingClientRect();
      const f = figure.getBoundingClientRect();
      setGeo({
        width: box.width,
        height: box.height,
        tx: t.right - box.left + 12,
        ty: t.top + t.height * 0.55 - box.top,
        fx: f.left - box.left - 6,
        fy: f.top - box.top - 3,
        fw: f.width + 12,
        fh: f.height + 6,
      });
    };

    measure();
    // Webfonts reflow the headline, and the entrance animation moves it; measure
    // again once both have settled.
    document.fonts?.ready.then(measure);
    const settle = window.setTimeout(measure, 1000);
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [heroRef, targetRef, sourceRef]);

  if (!geo) return null;

  const { tx, ty, fx, fy, fw, fh } = geo;
  const ex = fx - 4;
  const ey = fy + fh / 2;
  const bend = tx + (ex - tx) * 0.5;
  const d = `M ${tx} ${ty} C ${bend} ${ty}, ${bend} ${ey}, ${ex} ${ey}`;

  // The headline and the statement settle first; then the trace draws.
  const dotDelay = 1.15;
  const lineDelay = dotDelay + 0.25;
  const cellDelay = lineDelay + 0.75;

  return (
    <AnimatePresence>
      {show ? (
        <m.svg
          className="trace"
          width={geo.width}
          height={geo.height}
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          aria-hidden="true"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <m.circle
            className="trace__dot"
            cx={tx}
            cy={ty}
            r={3.5}
            initial={reduced ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: dotDelay, ease: EASE }}
            style={{ transformOrigin: `${tx}px ${ty}px` }}
          />
          <m.path
            className="trace__path"
            d={d}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.75, delay: lineDelay, ease: EASE }}
          />
          {/* Arrowhead landing on the figure. */}
          <m.path
            className="trace__head"
            d={`M ${ex - 7} ${ey - 4} L ${ex} ${ey} L ${ex - 7} ${ey + 4}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: cellDelay - 0.08 }}
          />
          <m.rect
            className="trace__cell"
            x={fx}
            y={fy}
            width={fw}
            height={fh}
            rx={3}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: cellDelay, ease: EASE }}
          />
        </m.svg>
      ) : null}
    </AnimatePresence>
  );
}
