import { forwardRef, type CSSProperties, type Ref, type RefObject } from "react";
import { m, useReducedMotion } from "motion/react";
import {
  DEFAULT_KEY,
  FIGURES,
  HEADINGS,
  RULE_BEFORE,
  STATEMENT_META,
} from "../../data/statement";
import { Stamp } from "../Stamp";
import { Figure } from "../Figure";
import "./Sheet.css";

interface SheetProps {
  active: string;
  onPick: (key: string) => void;
  activeRowRef: Ref<HTMLButtonElement>;
  /** Always points at the opening-balance row, whichever row is active. */
  openingRowRef?: RefObject<HTMLButtonElement | null>;
  /** Show each figure as its source locator instead of its value. */
  xray?: boolean;
}

function assign<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else (ref as { current: T | null }).current = value;
}

/** The statement itself. Every row is a control; every control cites a cell. */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  function Sheet({ active, onPick, activeRowRef, openingRowRef, xray = false }, ref) {
    const reduced = useReducedMotion();
    // The marker slides between rows so the eye can follow it. Asked to move
    // less, it simply appears in place.
    const markerTransition = reduced
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 540, damping: 44 };

    return (
      <div className={"sheet" + (xray ? " sheet--xray" : "")} ref={ref}>
        <header className="sheet__head">
          <span className="sheet__who">
            <b>{STATEMENT_META.owner}</b>
            <span className="sheet__sep">·</span>
            {STATEMENT_META.period}
          </span>
          <span className="sheet__kind">{STATEMENT_META.report}</span>
        </header>

        <ul className="sheet__rows">
          {FIGURES.map((figure, i) => {
            const heading = HEADINGS[figure.key];
            const isActive = figure.key === active;
            const isOpening = figure.key === DEFAULT_KEY;

            return (
              <li key={figure.key} className="sheet__item" style={{ "--i": i } as CSSProperties}>
                {heading ? <div className="sheet__group">{heading}</div> : null}
                {RULE_BEFORE.has(figure.key) ? <div className="sheet__rule" /> : null}

                <button
                  type="button"
                  ref={(el) => {
                    if (isActive) assign(activeRowRef, el);
                    if (isOpening) assign(openingRowRef, el);
                  }}
                  className={
                    "line" +
                    (figure.emphasis ? " line--total" : "") +
                    (isActive ? " line--on" : "")
                  }
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onPick(figure.key)}
                >
                  {isActive ? (
                    <m.span
                      className="line__marker"
                      layoutId="line-marker"
                      transition={markerTransition}
                    />
                  ) : null}
                  <span className={"line__name" + (figure.indent ? " line__name--sub" : "")}>
                    {figure.label}
                  </span>
                  <span className="line__cell">
                    <Figure className="line__figure" value={figure.value} provenance={figure.provenance} />
                    <span className="line__locator" aria-hidden={!xray}>
                      <b>{figure.provenance.cell}</b>
                      <span>{figure.provenance.source}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <footer className="sheet__foot">
          <span className="sheet__check">
            Rollforward checked to the cent · continuity <b>unverified</b> without
            July
          </span>
          <Stamp>Reconciled · off by 0.00</Stamp>
        </footer>
      </div>
    );
  },
);
