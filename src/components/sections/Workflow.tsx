import type { CSSProperties } from "react";
import { WORKFLOW } from "../../data/content";
import { Reveal } from "../Reveal";
import "./Workflow.css";

/**
 * The whole loop in one picture.
 *
 * Five stations, left to right: the property manager's software, the exports
 * it already produces, Plainstate, the reviewer, the owner. Cards and
 * connectors enter with CSS scroll-driven animations offset by their index,
 * so the eye is walked along the path in the order the month happens, and a
 * station already on screen starts finished. No script, no waiting.
 */
export function Workflow() {
  return (
    <section className="section section--line" id="workflow">
      <span className="eyebrow">{WORKFLOW.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{WORKFLOW.heading}</h2>
        </Reveal>
        <Reveal>
          <p className="prose">{WORKFLOW.body}</p>
        </Reveal>
      </div>

      <ol className="flow" aria-label="How a month moves through Plainstate">
        {WORKFLOW.steps.map((s, i) => (
          <li
            key={s.title}
            className={"flow__step" + (s.core ? " flow__step--core" : "")}
            style={{ "--i": i } as CSSProperties}
          >
            {i > 0 ? <span className="flow__link" aria-hidden="true" /> : null}
            <div className="flow__card">
              <span className="flow__who">{s.who}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.note ? <span className="flow__note">{s.note}</span> : null}
            </div>
          </li>
        ))}
      </ol>

      <Reveal>
        <ul className="flow__rules">
          {WORKFLOW.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
