import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { useInView, useReducedMotion } from "motion/react";
import { PAIN, WHY } from "../../data/content";
import { Reveal } from "../Reveal";
import { Cite } from "../Cite";
import { Figure } from "../Figure";
import "./Problem.css";

/**
 * One figure that counts up when it first scrolls into view.
 *
 * The numbers are the argument in this section, so they get the emphasis. Some
 * carry a prefix ("3-5", "~30") that is part of the claim rather than the
 * value, so it is rendered beside the counter instead of being parsed away.
 */
function Stat({ figure, unit, caption }: { figure: string; unit: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  const match = /^([^\d]*)(\d+)(.*)$/.exec(figure);
  const prefix = match?.[1] ?? "";
  const target = Number(match?.[2] ?? 0);
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (inView) setShown(target);
  }, [inView, target]);

  return (
    <div className="pain__cell" ref={ref}>
      <dt>
        <Figure className="pain__figure" value={figure} estimate={PAIN.statsLabel} inspect>
          {prefix}
          {reduced ? target : <NumberFlow value={shown} willChange />}
          {suffix}
        </Figure>
        <span className="pain__unit">{unit}</span>
      </dt>
      <dd>{caption}</dd>
    </div>
  );
}

/** The month they already have, before any product is mentioned. */
export function Problem() {
  return (
    <section className="section section--line" id="problem">
      <span className="eyebrow">{PAIN.eyebrow}</span>
      <div className="split">
        <Reveal>
          <h2>{PAIN.heading}</h2>
        </Reveal>
        <Reveal>
          <div className="stack">
            <p className="prose">{PAIN.body}</p>
            <ul className="asks">
              {PAIN.asks.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <span className="pain__label">{PAIN.statsLabel}</span>
            <dl className="pain">
              {PAIN.stats.map((s) => (
                <Stat key={s.caption} {...s} />
              ))}
            </dl>
            <p className="prose">{PAIN.closer}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="why">
          <span className="why__title">{WHY.eyebrow}</span>
          <ol className="why__shifts">
            {WHY.shifts.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
      <Cite sources={[...PAIN.sources, ...WHY.sources]} />
    </section>
  );
}
