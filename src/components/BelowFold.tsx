import { Faq } from "./sections/Faq";
import { Rollforward } from "./sections/Rollforward";
import { Sources } from "./sections/Sources";
import { TryIt } from "./sections/TryIt";
import { Film } from "./sections/Film";
import { Data, Engine, Method, RunsOut, Status } from "./sections/Story";
import { TraceScroll } from "./sections/TraceScroll";
import { FILMS } from "../data/content";
import {
  Boundaries,
  Checks,
  Close,
  Footer,
  How,
  Pricing,
  Principle,
} from "./sections/Sections";

/**
 * Everything after the first screen, in one split chunk.
 *
 * Grouped rather than split per section on purpose: a dozen small chunks cost
 * a dozen round trips, and these are always needed together the moment someone
 * scrolls.
 */
export default function BelowFold() {
  return (
    <>
      <RunsOut />
      <Rollforward />
      <Engine />
      <TraceScroll />
      <Principle />
      <How />
      <Film film={FILMS.review} />
      <Sources />
      <TryIt />
      <Checks />
      <Method />
      <Status />
      <Data />
      <Boundaries />
      <Pricing />
      <Faq />
      <Close />
      <Footer />
    </>
  );
}
