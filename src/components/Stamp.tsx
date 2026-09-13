import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import "./Stamp.css";

/**
 * A rubber stamp pressed onto the paper.
 *
 * Statements get stamped when they have been checked; that is the mark the
 * buyer already trusts. Pressed in once when it scrolls into view, then still.
 */
export function Stamp({
  children,
  tone = "signal",
  className,
}: {
  children: ReactNode;
  tone?: "signal" | "ink" | "stop";
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.span
      className={`stamp stamp--${tone}${className ? ` ${className}` : ""}`}
      // A modest start: an oversized invisible stamp below the fold would still
      // widen the document on a phone.
      initial={reduced ? false : { opacity: 0, scale: 1.06, rotate: -2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.34, ease: [0.2, 0.9, 0.3, 1.15] }}
    >
      {children}
    </m.span>
  );
}
