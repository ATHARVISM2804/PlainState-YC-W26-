import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import type { Film as FilmData } from "../../data/content";
import { Reveal } from "../Reveal";
import { track } from "../../lib/track";
import "./Film.css";

/**
 * A framed film on the paper.
 *
 * With a source set it plays muted when it scrolls into view and pauses when
 * it leaves, with controls for anyone who wants sound or to scrub. Without one
 * it shows the frame, so the page can be laid out before the film exists.
 * Nothing autoplays for someone who asked for less motion.
 */
export function Film({ film }: { film: FilmData }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || !film.src || reduced) return;
    if (inView) v.play().catch(() => undefined);
    else v.pause();
  }, [inView, film.src, reduced]);

  return (
    <section className="section section--line film-section">
      <span className="eyebrow">{film.eyebrow}</span>
      <div className="split film__intro">
        <Reveal>
          <h2>{film.heading}</h2>
        </Reveal>
        <Reveal>
          <p className="prose">{film.body}</p>
        </Reveal>
      </div>

      <Reveal>
        <div className="film">
          {film.src ? (
            <video
              ref={ref}
              className="film__video"
              src={film.src}
              poster={film.poster}
              muted
              loop
              playsInline
              controls
              preload="metadata"
              onPlay={() => track("film_played", { film: film.eyebrow })}
            />
          ) : (
            <div className="film__empty" role="img" aria-label="Film coming">
              <img src="/apple-touch-icon.png" alt="" width="180" height="180" />
              <span className="film__label">
                <Play size={12} strokeWidth={2.2} aria-hidden="true" />
                Film coming
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
