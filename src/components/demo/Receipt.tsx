import { forwardRef } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { FileText, Hash, ShieldCheck } from "lucide-react";
import type { Figure } from "../../data/statement";
import "./Receipt.css";

const SWAP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.19, ease: [0.2, 0.7, 0.3, 1] as const },
};

/**
 * The receipt for one figure: what it is, and exactly where it came from.
 *
 * The amount counts rather than cuts. On a product about numbers that is not
 * ornament — the movement shows which digits actually changed between one
 * figure and the next. Suppressed for anyone who asked for less motion.
 */
export const Receipt = forwardRef<HTMLElement, { figure: Figure }>(
  function Receipt({ figure }, ref) {
    const p = figure.provenance;
    const reduced = useReducedMotion();
    const swap = reduced
      ? { ...SWAP, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : SWAP;

    return (
      <aside className="receipt" ref={ref} aria-live="polite">
        <header className="receipt__head">
          <span className="receipt__title">
            <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
            Provenance
          </span>
          <span className="pill">
            <span className="pill__dot" />
            {p.method}
          </span>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <m.p key={`${figure.key}-label`} className="receipt__for" {...swap}>
            {figure.label}
          </m.p>
        </AnimatePresence>

        <div className="receipt__value">
          {reduced ? (
            figure.value
          ) : (
            <NumberFlow
              value={figure.amount}
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              transformTiming={{ duration: 620, easing: "cubic-bezier(.2,.7,.3,1)" }}
              willChange
            />
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.dl key={figure.key} className="receipt__fields" {...swap}>
            <dt>
              <FileText size={12} strokeWidth={2} aria-hidden="true" />
              source
            </dt>
            <dd className="is-strong">{p.source}</dd>

            <dt>
              <Hash size={12} strokeWidth={2} aria-hidden="true" />
              checksum
            </dt>
            <dd>{p.checksum}</dd>

            <dt>cell</dt>
            <dd className="is-brand">{p.cell}</dd>

            <dt>as printed</dt>
            <dd>{p.asPrinted}</dd>

            <dt>confidence</dt>
            <dd>{p.confidence}</dd>

            <dt>{p.noteKey}</dt>
            <dd>{p.noteValue}</dd>
          </m.dl>
        </AnimatePresence>
      </aside>
    );
  },
);
