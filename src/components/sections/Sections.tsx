import { Ban, Check, FileLock2, Layers, UserCheck } from "lucide-react";
import {
  BOUNDARIES,
  CLOSE,
  FOOTER,
  GLOSSARY,
  PRICING_NOTE,
  PROVE,
  SITE,
  PRINCIPLE,
  REFUSALS,
  TIERS,
} from "../../data/content";
import { Reveal } from "../Reveal";
import { Stamp } from "../Stamp";
import { Walkthrough } from "./Walkthrough";
import "./Sections.css";

/** A torn receipt edge: a zigzag along the bottom of the strip. */
function torn(teeth = 26, depth = 7): string {
  const pts = ["0 0", "100% 0"];
  for (let i = teeth; i >= 0; i--) {
    const x = ((i / teeth) * 100).toFixed(3) + "%";
    pts.push(`${x} calc(100% - ${i % 2 ? depth : 0}px)`);
  }
  return `polygon(${pts.join(", ")})`;
}
const TORN = torn();

export function Principle() {
  return (
    <section className="section band">
      <span className="eyebrow">{PRINCIPLE.eyebrow}</span>
      <div className="split">
        <Reveal><h2>{PRINCIPLE.heading}</h2></Reveal>
        <Reveal>
          <div className="stack">
            {PRINCIPLE.paragraphs.map((t) => (
              <p className="prose" key={t.slice(0, 20)}>{t}</p>
            ))}
            <ul className="band__standard">
              {PROVE.lines.map((l) => (
                <li key={l}>
                  <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function How() {
  return (
    <section className="section section--line" id="how">
      <span className="eyebrow">Close day, start to finish</span>
      <div className="split how__intro">
        <Reveal><h2>Four steps, once a month.</h2></Reveal>
      </div>
      <Walkthrough />
    </section>
  );
}

export function Checks() {
  return (
    <section className="section section--line" id="checks">
      <span className="eyebrow">The check that matters</span>
      <div className="split">
        <Reveal>
          <div className="stack">
            <h2>It balances to the cent, or it does not go out.</h2>
            <p className="prose">
              Beginning plus income minus expenses equals ending. Ending minus the
              draw and the reserve equals available. Available equals next
              month&rsquo;s opening balance. Exact comparison, no tolerance.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <ul className="refusals">
            {REFUSALS.map((r) => (
              <li
                key={r.message.slice(0, 20)}
                className={`refusal refusal--${r.tone}`}
                style={{ clipPath: TORN }}
              >
                <span className="refusal__tag">{r.tone === "stop" ? "Refused" : "Needs a person"}</span>
                <code>{r.message}</code>
                <p>{r.why}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Boundaries() {
  return (
    <section className="section section--line">
      <span className="eyebrow">Boundaries</span>
      <div className="split">
        <Reveal>
          <div className="stack">
            <p className="pull">The job is explanation. The ledger stays yours.</p>
            <Stamp tone="ink">Hard boundaries · until 20 customers</Stamp>
          </div>
        </Reveal>
        <Reveal>
          <ul className="nevers">
            {BOUNDARIES.map((b, i) => {
              const Icon = [Ban, Layers, UserCheck, FileLock2][i] ?? Ban;
              return (
                <li key={b.rule}>
                  <b>
                    <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
                    {b.rule}
                  </b>
                  <span>{b.detail}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="section section--line" id="pricing">
      <span className="eyebrow">Pricing</span>
      <Reveal>
        <div className="pricing__intro">
          <h2>Priced by doors. Billed monthly.</h2>
          <p className="prose">
            A 500-door manager spends roughly thirty staff hours a month on this
            work. Built for third-party managers &mdash; if you own the buildings,
            there is no owner to report to and nothing here for you.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="tiers">
          {TIERS.map((t) => (
            <article
              key={t.doors}
              className={"tier" + (t.featured ? " tier--featured" : "")}
            >
              {t.featured ? <Stamp className="tier__tag">Most common</Stamp> : null}
              <span className="tier__doors">{t.doors} doors</span>
              <p className="tier__price">
                <span className="tier__currency">$</span>
                {t.price}
                <span className="tier__period">/mo</span>
              </p>
              <p className="tier__who">{t.typical}</p>
            </article>
          ))}
        </div>
      </Reveal>
      <p className="note pricing__note">{PRICING_NOTE}</p>
    </section>
  );
}

export function Close() {
  return (
    <section className="section section--line" id="start">
      <span className="eyebrow">{CLOSE.eyebrow}</span>
      <Reveal>
        <div className="close">
          <h2>{CLOSE.heading}</h2>
          <p className="prose close__body">{CLOSE.body}</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={`mailto:${SITE.contact}?subject=One%20export`}>
              {CLOSE.primary}
            </a>
            <a className="btn btn--quiet" href={SITE.calendar}>
              {CLOSE.secondary}
            </a>
          </div>
          <p className="note">{CLOSE.note}</p>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <img src="/wordmark.png" alt={SITE.name} width="536" height="128" />
          <p className="footer__blurb">{FOOTER.blurb}</p>
          <p className="footer__reads">{FOOTER.reads}</p>
        </div>
        {FOOTER.columns.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <span className="footer__title">{col.title}</span>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <details className="footer__glossary" id="glossary">
        <summary>Glossary · the words on this page</summary>
        <dl className="glossary">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="glossary__item">
              <dt>{g.term}</dt>
              <dd>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </details>
      <p className="footer__colophon">{FOOTER.colophon}</p>
      <p className="footer__legal">{FOOTER.legal}</p>
    </footer>
  );
}
