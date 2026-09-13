import { Fragment, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { HERO, SIGNALS } from "../../data/content";
import { Demo } from "../demo/Demo";
import { SourceTrace } from "./SourceTrace";
import "./Hero.css";

const EASE = [0.2, 0.7, 0.3, 1] as const;

/** The headline rises word by word out of a mask. 30 ms apart, 420 ms each:
 *  the whole line is settled inside 600 ms and never runs again. */
function Words({ text, offset = 0, reduced }: { text: string; offset?: number; reduced: boolean }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        // The space lives outside the mask: trailing whitespace inside an
        // inline-block collapses, and the words would run together.
        <Fragment key={`${w}-${i}`}>
          <span className="hero__word">
            <m.span
              className="hero__wordInner"
              initial={reduced ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.42, delay: 0.05 + (offset + i) * 0.03, ease: EASE }}
            >
              {w}
            </m.span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Outcome in the headline, audience above it, one dominant action, and the
 * statement itself beside it — the artefact is the hero, not a picture of it.
 * On wide screens the promise in the headline is traced to the opening balance
 * on that statement, once, on load.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLElement>(null);
  const openingRowRef = useRef<HTMLButtonElement>(null);
  const [showTrace, setShowTrace] = useState(true);

  const group = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.02 } },
  };
  const item = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EASE } },
      };
  const headWords = HERO.headline.split(" ").length;

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__aura" aria-hidden="true" />
      <SourceTrace
        heroRef={heroRef}
        targetRef={accentRef}
        sourceRef={openingRowRef}
        show={showTrace}
      />

      <m.div className="hero__copy" variants={group} initial="hidden" animate="show">
        <m.span className="hero__kicker" variants={item}>
          {HERO.kicker}
        </m.span>

        <h1>
          <Words text={HERO.headline} reduced={!!reduced} />
          <em className="accent" ref={accentRef}>
            <Words text={HERO.headlineAccent} offset={headWords} reduced={!!reduced} />
          </em>
        </h1>

        <m.p className="lede" variants={item}>
          {HERO.lede}
        </m.p>

        <m.div className="btn-row" variants={item}>
          <a className="btn btn--primary" href="#start">
            {HERO.primary}
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <a className="btn btn--quiet" href="#how">
            {HERO.secondary}
          </a>
        </m.div>

        <m.ul className="hero__signals" variants={item}>
          {SIGNALS.map((s) => (
            <li key={s}>
              <Check className="hero__tick" size={14} strokeWidth={2.6} aria-hidden="true" />
              {s}
            </li>
          ))}
        </m.ul>
      </m.div>

      <m.div
        className="hero__demo"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, delay: reduced ? 0 : 0.28, ease: EASE }}
      >
        <Demo openingRowRef={openingRowRef} onInteract={() => setShowTrace(false)} />
        <p className="note hero__hint">{HERO.hint}</p>
      </m.div>
    </section>
  );
}
