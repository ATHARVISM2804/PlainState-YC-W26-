import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Check, FileText, RotateCcw } from "lucide-react";
import { STEPS } from "../../data/content";
import { FIGURES, STATEMENT_META } from "../../data/statement";
import { Figure } from "../Figure";
import { usePinned } from "../../hooks/usePinned";
import "./Walkthrough.css";

const EASE = [0.2, 0.7, 0.3, 1] as const;

/* ------------------------------------------------------------- the stages */

const FILES = [
  { name: "OwnerStatement_Aug.csv", sum: "#4125985d95c7" },
  { name: "GeneralLedger_Aug.csv", sum: "#c1cce5b1ef3d" },
  { name: "RentRoll_Aug.xlsx", sum: "#8a03f1c2be47" },
];

function StageFiles() {
  return (
    <div className="stage stage--files">
      <ul className="files">
        {FILES.map((f, i) => (
          <m.li
            key={f.name}
            className="file"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.12, ease: EASE }}
          >
            <FileText size={14} strokeWidth={1.8} aria-hidden="true" />
            <span className="file__name">{f.name}</span>
            <span className="file__sum">{f.sum}</span>
          </m.li>
        ))}
      </ul>
      <div className="stage__foot">
        <span className="stage__label">drop address</span>
        <span className="stage__value">reports@drop.plainstate</span>
      </div>
    </div>
  );
}

const MAPPING = [
  { from: "4000 Rent Income", to: "INCOME / rent", tier: "mapped", conf: "1.00" },
  { from: "4010 Late Fee Income", to: "INCOME / late_fee", tier: "mapped", conf: "1.00" },
  { from: "6100 Landscaping", to: "EXPENSE / landscaping", tier: "inferred", conf: "0.60" },
  { from: "Repairs & Maintenance", to: "asked, not guessed", tier: "ambiguous", conf: "0.50" },
];

function StageChart() {
  return (
    <div className="stage stage--chart">
      <ul className="mapping">
        {MAPPING.map((row, i) => (
          <m.li
            key={row.from}
            className={`map map--${row.tier}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.08 + i * 0.1, ease: EASE }}
          >
            <span className="map__from">{row.from}</span>
            <span className="map__arrow" aria-hidden="true">→</span>
            <span className="map__to">{row.to}</span>
            <span className="map__tier">
              {row.tier} · {row.conf}
            </span>
          </m.li>
        ))}
      </ul>
      <div className="stage__foot">
        <span className="stage__label">clears review</span>
        <span className="stage__value">mapped only · one confirmation at onboarding</span>
      </div>
    </div>
  );
}

const DRAFT_KEYS = ["beg", "inc", "exp", "end", "draw", "res", "avail"];

function StageDraft() {
  const rows = DRAFT_KEYS.map((k) => FIGURES.find((f) => f.key === k)!);
  return (
    <div className="stage stage--draft">
      <div className="draft__head">
        <b>{STATEMENT_META.owner}</b>
        <span>{STATEMENT_META.period}</span>
      </div>
      <ul className="draft">
        {rows.map((r, i) => (
          <m.li
            key={r.key}
            className={"draft__row" + (r.emphasis ? " is-total" : "")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.06 + i * 0.09 }}
          >
            <span>{r.label}</span>
            <Figure className="draft__fig" value={r.value} provenance={r.provenance} inspect />
          </m.li>
        ))}
      </ul>
      <div className="stage__foot">
        <span className="stage__label">rollforward</span>
        <span className="stage__value is-ok">
          <Check size={12} strokeWidth={2.6} aria-hidden="true" />
          12,480.00 + 9,125.00 − 2,800.00 = 18,805.00 · off by 0.00
        </span>
      </div>
    </div>
  );
}

function StageReview() {
  return (
    <div className="stage stage--review">
      <ul className="flags">
        <m.li
          className="flag flag--ok"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.08, ease: EASE }}
        >
          <span className="flag__code">rollforward</span>
          <span>reconciled to the cent</span>
        </m.li>
        <m.li
          className="flag flag--warn"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.18, ease: EASE }}
        >
          <span className="flag__code">period_continuity</span>
          <span>UNVERIFIED · no prior period supplied</span>
        </m.li>
        <m.li
          className="flag flag--ok"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.28, ease: EASE }}
        >
          <span className="flag__code">low_confidence</span>
          <span>none · every figure cites a cell</span>
        </m.li>
      </ul>
      <m.div
        className="review__actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.42 }}
      >
        <span className="btn btn--primary review__btn">Approve and send</span>
        <span className="btn btn--quiet review__btn">Edit narrative</span>
      </m.div>
      <div className="stage__foot">
        <span className="stage__label">rule</span>
        <span className="stage__value">a person approves · nothing auto-sends</span>
      </div>
    </div>
  );
}

const STAGES = [StageFiles, StageChart, StageDraft, StageReview];

/* ----------------------------------------------------------- the walkthrough */

function useWide(query = "(min-width: 58rem)") {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return wide;
}

/**
 * The four steps, pinned, while the material on the right turns from files
 * into a statement a person approves. Scroll drives it, so the reader sets the
 * pace. On narrow screens and under reduced motion it is a plain list with the
 * same four stages laid out in order.
 */
export function Walkthrough() {
  const ref = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wide = useWide();
  const sticky = wide && !reduced;
  const pinned = usePinned(sentinel, ref, 96, sticky);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  /** A step under a fine pointer previews its stage without moving the page. */
  const [hover, setHover] = useState<number | null>(null);
  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const restart = () => ref.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length))));
  });

  if (!sticky) {
    return (
      <ol className="walk walk--static">
        {STEPS.map((step, i) => {
          const Stage = STAGES[i] ?? StageFiles;
          return (
            <li key={step.title} className="walk__item">
              <span className="walk__n">{String(i + 1).padStart(2, "0")}</span>
              <div className="walk__text">
                <h3>{step.title}</h3>
                <p className="prose">{step.body}</p>
              </div>
              <div className="walk__stage">
                <Stage />
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  const shown = hover ?? active;
  const Stage = STAGES[shown] ?? StageFiles;

  return (
    <div className="walk" ref={ref}>
      <div className="walk__sentinel" ref={sentinel} aria-hidden="true" />
      <div className="walk__sticky">
        <span className={"pinned" + (pinned ? " is-on" : "")} aria-hidden="true">
          Pinned · step <b>{active + 1}</b> of <b>{STEPS.length}</b>
        </span>
        <ol className="walk__steps">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={"walk__step" + (i === shown ? " is-on" : "")}
              onPointerEnter={() => fine() && setHover(i)}
              onPointerLeave={() => setHover(null)}
            >
              {i === shown ? (
                <m.span
                  className="walk__marker"
                  layoutId="walk-marker"
                  transition={{ type: "spring", stiffness: 420, damping: 40 }}
                />
              ) : null}
              <span className="walk__n">{String(i + 1).padStart(2, "0")}</span>
              <div className="walk__text">
                <h3>{step.title}</h3>
                <p className="prose">{step.body}</p>
              </div>
            </li>
          ))}
          <li className="walk__restart">
            <button type="button" className="walk__restartBtn" onClick={restart}>
              <RotateCcw size={13} strokeWidth={2.2} aria-hidden="true" />
              Restart
            </button>
            <span className="walk__stepHint">Hover a step to preview it</span>
          </li>
        </ol>

        <div className="walk__stage">
          <AnimatePresence mode="wait">
            <m.div
              key={shown}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <Stage />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
