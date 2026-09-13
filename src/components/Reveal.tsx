import type { ReactNode } from "react";

/**
 * One entrance, then quiet.
 *
 * The reveal is a CSS scroll-driven animation (see .reveal in base.css): it
 * runs on the compositor, costs no JavaScript, and its finished state is the
 * default state. A browser without view timelines, or a reader who asked for
 * less motion, simply sees the content. Nothing on the page ever rests at
 * opacity zero.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={"reveal" + (className ? ` ${className}` : "")}>{children}</div>;
}
