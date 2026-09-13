import { useEffect, useState, type RefObject } from "react";

/**
 * Is this sticky element currently pinned?
 *
 * A sticky box gives no signal of its own state, so a one-pixel sentinel is
 * placed just above it: while the sentinel is scrolled out above the viewport
 * and the tall parent is still on screen, the box is stuck. Chromium's
 * scroll-state container query would do this in CSS; this works everywhere.
 */
export function usePinned(
  sentinelRef: RefObject<HTMLElement | null>,
  parentRef: RefObject<HTMLElement | null>,
  offsetPx = 96,
  /** Re-subscribe when this flips, for components that mount the sticky
   *  layout only after measuring the viewport. */
  enabled = true,
): boolean {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const parent = parentRef.current;
    if (!enabled || !sentinel || !parent) {
      setPinned(false);
      return;
    }

    let above = false;
    let parentVisible = false;
    const update = () => setPinned(above && parentVisible);

    const s = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        above = !e.isIntersecting && e.boundingClientRect.top < offsetPx;
        update();
      },
      { rootMargin: `-${offsetPx}px 0px 0px 0px`, threshold: 0 },
    );
    const p = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        parentVisible = e.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    s.observe(sentinel);
    p.observe(parent);
    return () => {
      s.disconnect();
      p.disconnect();
    };
  }, [sentinelRef, parentRef, offsetPx, enabled]);

  return pinned;
}
