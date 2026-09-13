import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { Provenance } from "../data/statement";
import { track } from "../lib/track";
import "./Figure.css";

/** Fired when any figure opens, so only one receipt is ever open. */
const OPEN_EVENT = "plainstate:figure-open";

/**
 * Every number on the page goes through this.
 *
 * It fixes the register (mono, tabular numerals, never wraps) and carries the
 * figure's provenance. With `inspect`, the figure becomes a control: hover or
 * tap it and a small receipt appears with the file, cell, checksum and the
 * text exactly as printed. A figure that is only an estimate says so. This is
 * the product's promise made into the page's behaviour: ask any number where
 * it came from, and it answers.
 */
export function Figure({
  value,
  provenance,
  estimate,
  inspect = false,
  as: Tag = "span",
  className,
  children,
}: {
  value: string;
  provenance?: Provenance;
  /** For a number that is a founder estimate rather than a parsed figure. */
  estimate?: string;
  /** Make the figure a control that reveals its receipt. */
  inspect?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}) {
  const classes = "figure" + (className ? ` ${className}` : "");
  const data = { "data-source": provenance?.source, "data-cell": provenance?.cell };

  if (!inspect || (!provenance && !estimate)) {
    return (
      <Tag className={classes} {...data}>
        {children ?? value}
      </Tag>
    );
  }

  return (
    <Inspectable
      value={value}
      provenance={provenance}
      estimate={estimate}
      className={classes}
      data={data}
    >
      {children}
    </Inspectable>
  );
}

function Inspectable({
  value,
  provenance,
  estimate,
  className,
  data,
  children,
}: {
  value: string;
  provenance?: Provenance;
  estimate?: string;
  className: string;
  data: Record<string, string | undefined>;
  children?: ReactNode;
}) {
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [place, setPlace] = useState<{ y: "above" | "below"; x: "right" | "left" }>({
    y: "above",
    x: "right",
  });
  // Viewport coordinates for the slip. It renders at the document root so no
  // rounded card, clipped column or animated ancestor can cut it off.
  const [pos, setPos] = useState<CSSProperties>({});
  const reduced = useReducedMotion();

  const show = useCallback(() => {
    const r = wrapRef.current?.getBoundingClientRect();
    const narrow = window.matchMedia("(max-width: 40rem)").matches;
    if (r && !narrow) {
      const y = r.top < 280 ? "below" : "above";
      const x = r.right < 320 ? "left" : "right";
      setPlace({ y, x });
      setPos({
        ...(y === "above"
          ? { bottom: window.innerHeight - r.top + 10 }
          : { top: r.bottom + 10 }),
        ...(x === "right" ? { right: window.innerWidth - r.right } : { left: r.left }),
      });
    } else {
      setPos({});
    }
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
    setOpen(true);
    track("figure_inspected", { cell: provenance?.cell, source: provenance?.source, kind: provenance ? "parsed" : "estimate" });
  }, [id, provenance]);

  const hide = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  // Only one receipt open at a time, and Escape or an outside tap closes it.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !document.getElementById(id)?.contains(t)) hide();
    };
    // The slip is fixed to where the figure was; if the page moves, it goes.
    const onScroll = () => hide();
    window.addEventListener(OPEN_EVENT, onOther);
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onDown);
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener(OPEN_EVENT, onOther);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, id, hide]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <span className="figure-wrap" ref={wrapRef}>
      <button
        type="button"
        className={className + " figure--inspect" + (open ? " is-open" : "")}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${value}. Show where this figure came from.`}
        {...data}
        onPointerEnter={() => {
          if (!fine()) return;
          hoverTimer.current = window.setTimeout(show, 120);
        }}
        onPointerLeave={() => {
          window.clearTimeout(hoverTimer.current);
          if (!pinned) hide();
        }}
        onClick={() => {
          if (open && pinned) hide();
          else {
            setPinned(true);
            show();
          }
        }}
        onFocus={show}
        onBlur={() => {
          if (!pinned) hide();
        }}
      >
        <span aria-hidden="true" className="figure__dot" />
        {children ?? value}
      </button>

      {createPortal(
      <AnimatePresence>
        {open ? (
          <m.span
            id={id}
            role="tooltip"
            style={pos}
            className={`figure-pop figure-pop--${place.y} figure-pop--${place.x}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: place.y === "above" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.3, 1] }}
          >
            {provenance ? (
              <>
                <span className="figure-pop__head">
                  Provenance <b>{provenance.method}</b>
                </span>
                <dl className="figure-pop__fields">
                  <dt>source</dt>
                  <dd className="is-strong">{provenance.source}</dd>
                  <dt>checksum</dt>
                  <dd>{provenance.checksum}</dd>
                  <dt>cell</dt>
                  <dd className="is-brand">{provenance.cell}</dd>
                  <dt>as printed</dt>
                  <dd>{provenance.asPrinted}</dd>
                  <dt>confidence</dt>
                  <dd>{provenance.confidence}</dd>
                </dl>
              </>
            ) : (
              <>
                <span className="figure-pop__head figure-pop__head--estimate">
                  Estimate <b>unverified</b>
                </span>
                <p className="figure-pop__note">{estimate}</p>
              </>
            )}
          </m.span>
        ) : null}
      </AnimatePresence>,
      document.body,
      )}
    </span>
  );
}
