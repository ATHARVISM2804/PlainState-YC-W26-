import type { Source } from "../data/content";
import "./Cite.css";

/**
 * The sources behind a section, set small and in mono at its foot.
 *
 * A page whose whole argument is that numbers are verifiable cites its own.
 * Anything on the page that is not cited here is labelled a founder estimate.
 */
export function Cite({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <aside className="cite" aria-label="Sources">
      <span className="cite__label">Sources</span>
      <ol className="cite__list">
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
