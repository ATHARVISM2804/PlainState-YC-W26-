import { useEffect, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import NumberFlow from "@number-flow/react";
import "./ScrollLedger.css";

/**
 * The page's progress indicator is the rollforward itself.
 *
 * As the reader descends, the August statement's arithmetic fills in, term by
 * term, and the running balance rolls to each new value. It reaches
 * "off by 0.00" at the footer. Wide screens only; a reader who asked for less
 * motion does not get a moving strip in the corner.
 */
const STEPS = [
  { until: 0.2, running: 12480, term: "opening balance", sign: "" },
  { until: 0.4, running: 21605, term: "+ 9,125.00 income", sign: "+" },
  { until: 0.6, running: 18805, term: "− 2,800.00 expenses", sign: "−" },
  { until: 0.8, running: 3805, term: "− 15,000.00 owner draw", sign: "−" },
  { until: 0.97, running: 3305, term: "− 500.00 reserve", sign: "−" },
  { until: 1.01, running: 3305, term: "available · off by 0.00", sign: "=" },
];

function useWide(query = "(min-width: 64rem)") {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return wide;
}

export function ScrollLedger() {
  const reduced = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  if (!wide || reduced) return null;

  const idx = STEPS.findIndex((s) => progress < s.until);
  const step = STEPS[idx === -1 ? STEPS.length - 1 : idx] ?? STEPS[0]!;
  const visible = progress > 0.06 && progress < 0.995;
  const done = step === STEPS[STEPS.length - 1];

  return (
    <AnimatePresence>
      {visible ? (
        <m.aside
          className={"ledger" + (done ? " is-done" : "")}
          aria-hidden="true"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.2, 0.7, 0.3, 1] }}
        >
          <span className="ledger__bar" style={{ transform: `scaleX(${progress})` }} />
          <span className="ledger__label">Rollforward</span>
          <span className="ledger__running">
            <NumberFlow
              value={step.running}
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              transformTiming={{ duration: 520, easing: "cubic-bezier(.2,.7,.3,1)" }}
              willChange
            />
          </span>
          <span className="ledger__term">{step.term}</span>
        </m.aside>
      ) : null}
    </AnimatePresence>
  );
}
