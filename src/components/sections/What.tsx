import { WHAT } from "../../data/content";
import { Reveal } from "../Reveal";
import "./What.css";

/** The product, stated plainly, before any argument for it. */
export function What() {
  return (
    <section className="section section--line" id="what">
      <span className="eyebrow">{WHAT.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{WHAT.heading}</h2>
        </Reveal>
        <Reveal>
          <p className="prose what__body">{WHAT.body}</p>
        </Reveal>
      </div>
      <Reveal>
        <dl className="what__cols">
          {WHAT.columns.map((c) => (
            <div key={c.title} className="what__col">
              <dt>{c.title}</dt>
              <dd>{c.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
