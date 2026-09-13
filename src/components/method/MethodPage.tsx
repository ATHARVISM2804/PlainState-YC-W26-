import { useEffect } from "react";
import { METHOD_PAGE } from "../../data/method";
import { SITE } from "../../data/content";
import { attachLinkTracking } from "../../lib/track";
import { Nav } from "../nav/Nav";
import { Footer } from "../sections/Sections";
import "./MethodPage.css";

/**
 * The method, written out as a document.
 *
 * Numbered chapters with a table of contents that stays put while you read,
 * set in the serif at a reading measure. This page is for the reader who has
 * decided to take the product seriously and wants to know what it will and
 * will not do before a call.
 */
export function MethodPage() {
  const { chapters } = METHOD_PAGE;
  useEffect(() => attachLinkTracking(SITE.calendar), []);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="wrap">
        <article className="method">
          <header className="method__head">
            <span className="eyebrow">{METHOD_PAGE.eyebrow}</span>
            <h1>{METHOD_PAGE.title}</h1>
            <p className="lede">{METHOD_PAGE.lede}</p>
            <p className="note method__updated">Last revised {METHOD_PAGE.updated}</p>
          </header>

          <div className="method__body">
            <nav className="method__toc" aria-label="Chapters">
              <span className="method__tocTitle">Contents</span>
              <ol>
                {chapters.map((c) => (
                  <li key={c.n}>
                    <a href={`#rule-${c.n}`}>
                      <span className="method__tocN">{c.n}</span>
                      <span>{c.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="method__chapters">
              {chapters.map((c) => (
                <section key={c.n} id={`rule-${c.n}`} className="chapter">
                  <span className="chapter__n">{c.n}</span>
                  <h2>{c.title}</h2>
                  {c.paragraphs.map((p) => (
                    <p key={p.slice(0, 32)} className="chapter__p">
                      {p}
                    </p>
                  ))}
                  <p className="chapter__product">
                    <span>In the product today</span>
                    {c.inProduct}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
