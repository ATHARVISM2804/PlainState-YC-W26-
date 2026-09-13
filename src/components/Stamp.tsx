import type { ReactNode } from "react";
import "./Stamp.css";

/**
 * A rubber stamp pressed onto the paper.
 *
 * Statements get stamped when they have been checked; that is the mark the
 * buyer already trusts. The press-in is a CSS scroll-driven animation, so a
 * stamp already on screen starts in its finished state and never waits on
 * script. Browsers without view timelines, and readers who asked for less
 * motion, see it pressed.
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
  return (
    <span className={`stamp stamp--${tone}${className ? ` ${className}` : ""}`}>{children}</span>
  );
}
