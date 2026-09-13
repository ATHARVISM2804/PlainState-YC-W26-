import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { SITE } from "../../data/content";
import "./Nav.css";

const LINKS = [
  { href: "/#rollforward", label: "How statements work" },
  { href: "/#how", label: "How it works" },
  { href: "/#engine", label: "Under the hood" },
  { href: "/method", label: "Method" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Sticky header with a real mobile menu.
 *
 * The previous version simply hid its links below 52rem, which left phone
 * visitors with no navigation at all — the majority of traffic on a page like
 * this. Here the links collapse into a panel instead: Escape closes it, focus
 * returns to the trigger, and the page behind it cannot scroll while it is open.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className={"nav" + (lifted ? " nav--lifted" : "")}>
      <div className="nav__inner wrap">
        <a className="nav__mark" href="/#top" onClick={() => setOpen(false)}>
          <img src="/wordmark.png" alt={SITE.name} width="536" height="128" />
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="btn btn--quiet nav__cta" href="/#start">
            Send an export
          </a>
          <a className="btn btn--primary nav__cta" href={SITE.calendar}>
            {SITE.bookCall}
          </a>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={"nav__bar" + (open ? " is-x1" : "")} />
          <span className={"nav__bar" + (open ? " is-hidden" : "")} />
          <span className={"nav__bar" + (open ? " is-x2" : "")} />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="nav-panel"
            className="nav__panel"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <nav className="nav__panelLinks" aria-label="Sections">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a className="btn btn--primary" href={SITE.calendar} onClick={() => setOpen(false)}>
              {SITE.bookCall}
            </a>
            <a className="btn btn--quiet" href="/#start" onClick={() => setOpen(false)}>
              Send an export
            </a>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
