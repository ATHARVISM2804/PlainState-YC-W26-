import { LazyMotion, MotionConfig } from "motion/react";
import { Suspense, lazy, useEffect } from "react";
import { Nav } from "./components/nav/Nav";
import { Hero } from "./components/hero/Hero";
import { Ticker } from "./components/hero/Ticker";
import { Problem } from "./components/sections/Problem";
import { What } from "./components/sections/What";
import { Film } from "./components/sections/Film";
import { Why } from "./components/sections/Story";
import { ScrollLedger } from "./components/ScrollLedger";
import { FILMS, SITE } from "./data/content";
import { attachLinkTracking } from "./lib/track";

/**
 * Above the fold ships in the first bundle; the rest is fetched while the
 * visitor is still reading the hero.
 *
 * The hero carries the headline and the interactive demo, which is what the
 * page is judged on in the first seconds. Everything below it brings real
 * weight — the accordion primitives, the API client — that nobody needs before
 * they have scrolled, so it is split out rather than made part of the cost of
 * arriving.
 */
const BelowFold = lazy(() => import("./components/BelowFold"));
const loadMotion = () => import("./motionFeatures").then((mod) => mod.default);

export default function App() {
  useEffect(() => attachLinkTracking(SITE.calendar), []);
  return (
    <LazyMotion features={loadMotion} strict>
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <ScrollLedger />
      <main id="main" className="wrap">
        <Hero />
        <Ticker />
        <What />
        <Film film={FILMS.overview} />
        <Why />
        <Problem />
        {/* No spinner: the chunk lands long before anyone scrolls this far, and
            a flash of loading state would be worse than nothing. */}
        <Suspense fallback={null}>
          <BelowFold />
        </Suspense>
      </main>
    </MotionConfig>
    </LazyMotion>
  );
}
