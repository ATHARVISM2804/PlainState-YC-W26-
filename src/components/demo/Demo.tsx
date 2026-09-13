import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { BY_KEY, DEFAULT_KEY } from "../../data/statement";
import { useTether } from "../../hooks/useTether";
import { Receipt } from "./Receipt";
import { Sheet } from "./Sheet";
import { Tether } from "./Tether";
import { Record } from "./Record";
import { track } from "../../lib/track";
import "./Demo.css";

/** How long the rest of the sheet stays dimmed after a figure is picked. */
const TRACE_MS = 1100;

/**
 * The micro-demo, placed where a reader meets it without scrolling for it.
 *
 * The page's claim is that every figure can be traced. Asserting that in prose
 * is weak; letting someone click a number and watch the source appear is the
 * argument itself. When a figure is picked, everything that is not on the
 * path from figure to source recedes for a moment, so the path is all there is.
 */
export function Demo({
  openingRowRef,
  onInteract,
}: {
  /** Receives the opening-balance row, so the hero can trace to it. */
  openingRowRef?: RefObject<HTMLButtonElement | null>;
  onInteract?: () => void;
}) {
  const [active, setActive] = useState(DEFAULT_KEY);
  const [tracing, setTracing] = useState(false);
  /** Statement: what the owner receives. Sources: every figure as its locator.
   *  Record: the canonical statement as the engine emits it. */
  const [view, setView] = useState<"statement" | "sources" | "record">("statement");
  const xray = view === "sources";
  const reduced = useReducedMotion();

  const frameRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLElement>(null);
  const activeRowRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (key: string) => {
    setActive(key);
    onInteract?.();
    if (reduced) return;
    setTracing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTracing(false), TRACE_MS);
  };

  const geometry = useTether(frameRef, receiptRef, activeRowRef, active);
  const figure = BY_KEY.get(active);
  if (!figure) return null;

  return (
    // The outer frame is the size container; a container query cannot read the
    // element it styles, so the columns are decided one level up.
    <div className="demo-frame">
      <div className={"demo" + (tracing ? " demo--tracing" : "")} ref={frameRef}>
        <Tether geometry={geometry} />
        <div className="demo__sheet">
          <div className="xray" role="group" aria-label="View">
            {(
              [
                ["statement", "Statement", "what the owner receives"],
                ["sources", "Sources", "every figure as the cell it was read from"],
                ["record", "Record", "the statement as the engine emits it"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={"xray__opt" + (view === key ? " is-on" : "")}
                aria-pressed={view === key}
                onClick={() => {
                  setView(key);
                  onInteract?.();
                  track("view_switched", { view: key });
                }}
              >
                {label}
              </button>
            ))}
            <span className="xray__hint">
              {view === "statement"
                ? "what the owner receives"
                : view === "sources"
                  ? "every figure as the cell it was read from"
                  : "the statement as the engine emits it"}
            </span>
          </div>
          {view === "record" ? (
            <Record />
          ) : (
            <Sheet
              active={active}
              onPick={pick}
              activeRowRef={activeRowRef}
              openingRowRef={openingRowRef}
              xray={xray}
            />
          )}
        </div>
        <Receipt figure={figure} ref={receiptRef} />
      </div>
    </div>
  );
}
