import { Check, Circle, CircleDashed } from "lucide-react";
import {
  DATA,
  ENGINE,
  GLOSSARY,
  METHOD,
  PROVE,
  RUNS_OUT,
  STATUS,
  WHY,
} from "../../data/content";
import { Cite } from "../Cite";
import { Reveal } from "../Reveal";
import { Stamp } from "../Stamp";
import { Torn } from "./Torn";
import "./Story.css";

/* ------------------------------------------------------------ the change */

/** Why now: three shifts, before any argument for the product. */
export function Why() {
  return (
    <section className="section section--line" id="why">
      <span className="eyebrow">{WHY.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{WHY.heading}</h2>
        </Reveal>
        <Reveal>
          <ol className="shifts">
            {WHY.shifts.map((s) => (
              <li key={s.title} className="shift">
                <h3>{s.title}</h3>
                <p className="prose">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
      <Cite sources={WHY.sources} />
    </section>
  );
}

/* --------------------------------------------------------- the alternatives */

/** What managers do today, and honestly where each option stops. */
export function RunsOut() {
  return (
    <section className="section section--line" id="today">
      <span className="eyebrow">{RUNS_OUT.eyebrow}</span>
      <Reveal>
        <h2>{RUNS_OUT.heading}</h2>
      </Reveal>
      <Reveal>
        <div className="options">
          {RUNS_OUT.options.map((o) => (
            <article key={o.title} className="option">
              <h3>{o.title}</h3>
              <ul className="option__lines">
                {o.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="option__verdict">{o.verdict}</p>
            </article>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <p className="prose options__closer">{RUNS_OUT.closer}</p>
      </Reveal>
      <Torn />
      <Cite sources={RUNS_OUT.sources} />
    </section>
  );
}

/* ----------------------------------------------------------- the standard */

/** The perfect world, stated before the product is explained in detail. */
export function Prove() {
  return (
    <section className="section section--line prove" id="standard">
      <span className="eyebrow">{PROVE.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{PROVE.heading}</h2>
        </Reveal>
        <Reveal>
          <ul className="prove__lines">
            {PROVE.lines.map((l) => (
              <li key={l}>
                <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                {l}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the engine */

/** The pipeline as built: what each step does and what makes it stop. */
export function Engine() {
  return (
    <section className="section section--line" id="engine">
      <span className="eyebrow">{ENGINE.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{ENGINE.heading}</h2>
        </Reveal>
        <Reveal>
          <p className="prose">{ENGINE.body}</p>
        </Reveal>
      </div>

      <Reveal>
        <ol className="pipe">
          {ENGINE.stages.map((s, i) => (
            <li key={s.name} className="pipe__stage">
              <div className="pipe__head">
                <span className="pipe__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pipe__name">{s.name}</span>
              </div>
              <p className="pipe__does">{s.does}</p>
              <p className="pipe__stops">
                <span className="pipe__stopLabel">stops when</span>
                {s.stops}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="engine__grid">
        <Reveal>
          <div className="engine__panel">
            <span className="engine__title">Mapping confidence</span>
            <table className="conf">
              <tbody>
                {ENGINE.tiers.map((t) => (
                  <tr key={t.tier} className={t.tier === "mapped" ? "is-clear" : ""}>
                    <td className="conf__tier">{t.tier}</td>
                    <td className="conf__meaning">{t.meaning}</td>
                    <td className="conf__conf">{t.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="note">{ENGINE.tiersNote}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="engine__panel">
            <span className="engine__title">Refused outright</span>
            <ul className="refused">
              {ENGINE.refusals.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="note">{ENGINE.refusalsNote}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="engine__panel">
            <span className="engine__title">Exit codes, for close-day pipelines</span>
            <ul className="exits">
              {ENGINE.exit.map((e) => (
                <li key={e.code}>
                  <code>{e.code}</code>
                  <span>{e.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the method */

/** Six imperatives. Numbered because they are a method, in order. */
export function Method() {
  return (
    <section className="section section--line" id="method">
      <span className="eyebrow">{METHOD.eyebrow}</span>
      <Reveal>
        <h2>{METHOD.heading}</h2>
      </Reveal>
      <Reveal>
        <ol className="rules">
          {METHOD.rules.map((r, i) => (
            <li key={r.rule} className="rule">
              <span className="rule__n">{i + 1}</span>
              <div>
                <h3>{r.rule}</h3>
                <p className="prose">{r.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------- the status */

/** Built and planned, dated, with the most important gap stated plainly. */
export function Status() {
  return (
    <section className="section section--line" id="status">
      <span className="eyebrow">{STATUS.eyebrow}</span>
      <div className="status__head">
        <Reveal>
          <h2>{STATUS.heading}</h2>
        </Reveal>
        <span className="status__asof">{STATUS.asOf}</span>
      </div>
      <Reveal>
        <div className="status">
          <div className="status__col">
            <span className="engine__title">Built</span>
            <ul className="status__list">
              {STATUS.built.map((b) => (
                <li key={b}>
                  <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="status__col">
            <span className="engine__title">Planned</span>
            <ul className="status__list status__list--planned">
              {STATUS.planned.map((p) => (
                <li key={p.item}>
                  {p.when === "next" ? (
                    <Circle size={14} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <CircleDashed size={14} strokeWidth={2} aria-hidden="true" />
                  )}
                  <span>{p.item}</span>
                  <span className="status__when">{p.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="status__honest">
          <Stamp tone="ink">Synthetic data only</Stamp>
          <p className="prose">{STATUS.honest}</p>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------- the data */

/** How data is handled, in the plainest terms the buyer's lawyer would accept. */
export function Data() {
  return (
    <section className="section section--line" id="data">
      <span className="eyebrow">{DATA.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{DATA.heading}</h2>
        </Reveal>
        <Reveal>
          <ul className="nevers">
            {DATA.points.map((p) => (
              <li key={p.rule}>
                <b>{p.rule}</b>
                <span>{p.detail}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- the glossary */

export function Glossary() {
  return (
    <section className="section section--line" id="glossary">
      <span className="eyebrow">Glossary</span>
      <Reveal>
        <h2>The words on this page.</h2>
      </Reveal>
      <Reveal>
        <dl className="glossary">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="glossary__item">
              <dt>{g.term}</dt>
              <dd>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
