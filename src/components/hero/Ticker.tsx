import { FACTS } from "../../data/content";
import "./Ticker.css";

/**
 * Where a logo strip would sit, a slow strip of engine facts that are true
 * today. It moves because a ticker is how a running system reports itself;
 * it stops the moment a pointer rests on it, and it does not move at all for
 * anyone who asked for less motion.
 */
export function Ticker() {
  return (
    <div className="ticker" aria-label="What the engine does today">
      <div className="ticker__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="ticker__list" aria-hidden={copy === 1 || undefined}>
            {FACTS.map((f) => (
              <li key={f} className="ticker__item">
                <span className="ticker__dot" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
