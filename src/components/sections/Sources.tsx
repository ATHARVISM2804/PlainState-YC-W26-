import { SOURCES } from "../../data/content";
import { Reveal } from "../Reveal";
import "./Sources.css";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  next: "Researching",
  ask: "Ask us",
};

/** What it reads today, and — honestly — what it does not yet. */
export function Sources() {
  return (
    <section className="section section--line" id="sources">
      <span className="eyebrow">{SOURCES.eyebrow}</span>
      <div className="split">
        <Reveal>
          <div className="stack">
            <h2>{SOURCES.heading}</h2>
            <p className="prose">{SOURCES.body}</p>
            <ul className="formats">
              {SOURCES.formats.map((f) => (
                <li className="pill" key={f}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <ul className="systems">
            {SOURCES.systems.map((s) => (
              <li className="systems__row" key={s.name}>
                <span className="systems__name">{s.name}</span>
                <span className="systems__detail">{s.detail}</span>
                <span className={`tag tag--${s.status}`}>{STATUS_LABEL[s.status]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
