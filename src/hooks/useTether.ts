import { useCallback, useEffect, useState, type RefObject } from "react";

export interface TetherGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Below this container width the layout stacks and there is nothing to join. */
const MIN_WIDTH_TO_DRAW = 660;

/** Where on the card the tether should land: just below its header row. */
const CARD_ANCHOR_OFFSET = 42;

/**
 * Measures a curve from the selected row to the provenance card.
 *
 * Kept in a hook rather than inline because it is the one piece of this page
 * that reads layout: it has to re-measure on selection, on resize, and on
 * scroll (the card is sticky, so it moves relative to the row).
 */
export function useTether(
  containerRef: RefObject<HTMLElement | null>,
  cardRef: RefObject<HTMLElement | null>,
  rowRef: RefObject<HTMLElement | null>,
  dependency: string,
): TetherGeometry | null {
  const [geometry, setGeometry] = useState<TetherGeometry | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const row = rowRef.current;
    if (!container || !card || !row) {
      setGeometry(null);
      return;
    }

    const box = container.getBoundingClientRect();
    if (box.width < MIN_WIDTH_TO_DRAW) {
      setGeometry(null);
      return;
    }

    const r = row.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    setGeometry({
      x1: r.right - box.left,
      y1: r.top + r.height / 2 - box.top,
      x2: c.left - box.left,
      y2: c.top + CARD_ANCHOR_OFFSET - box.top,
    });
  }, [containerRef, cardRef, rowRef]);

  useEffect(() => {
    measure();

    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, { passive: true });

    // The card is sticky and the ledger is tall, so its own box changes size
    // as the page reflows. A ResizeObserver catches what scroll and resize do
    // not, such as a font finishing loading.
    const observer = new ResizeObserver(onChange);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange);
      observer.disconnect();
    };
  }, [measure, containerRef, dependency]);

  return geometry;
}
