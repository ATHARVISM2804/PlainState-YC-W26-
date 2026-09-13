import { useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { usePinned } from "../../hooks/usePinned";
import "./TraceScroll.css";

/* --- the drawing: a fixed coordinate space, real figures --- */
const W = 724;
const H = 468;

/** Ledger cells on the left, statement cells in the middle, September below. */
/* Rows sit 34px below a block's file line so the header never touches a cell. */
const LEDGER = [
  { cell: "H2", label: "Rent — Oakwood Ave 4B", value: "4,500.00", y: 110 },
  { cell: "H3", label: "Rent — Oakwood Ave 2A", value: "4,500.00", y: 150 },
  { cell: "H4", label: "Late fee — 2A", value: "125.00", y: 190 },
];
const LX = 24; // ledger block x
const LW = 276;
const SX = 392; // statement block x
const SW = 296;
const B10 = { cell: "B10", label: "Total Income", value: "9,125.00", y: 136 };
const B16 = { cell: "B16", label: "Ending Cash Balance", value: "18,805.00", y: 244 };
const B19 = { cell: "B19", label: "Available Balance", value: "3,305.00", y: 324 };
const STMT = [B10, B16, B19];
const SEPT = { cell: "B6", label: "Beginning Cash Balance", value: "3,305.00", y: 436 };

const HOPS = [
  { title: "Read", body: "Three ledger cells, each with a locator, a checksum and the text as printed." },
  { title: "Sum", body: "They total 9,125.00. The statement's own Total Income, cell B10, agrees to the cent." },
  { title: "Roll forward", body: "12,480.00 + 9,125.00 − 2,800.00 = 18,805.00. Exact, no tolerance." },
  { title: "Distribute", body: "18,805.00 − 15,000.00 − 500.00 = 3,305.00, the available balance." },
  { title: "Carry", body: "September opens at 3,305.00. If it did not, every statement after it would be wrong." },
];

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
 * One figure, traced end to end, with the reader's scroll as the pen.
 *
 * Five hops. Each range of the scroll draws one line and lights the cell it
 * lands on, so the reader controls the pace and can stop on any step. Under
 * reduced motion, or on a narrow screen, the finished drawing is shown still
 * beside the five steps.
 */
export function TraceScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wide = useWide();
  const live = wide && !reduced;
  const pinned = usePinned(sentinel, ref, 96, live);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(HOPS.length - 1, Math.max(0, Math.floor(v * HOPS.length))));
  });

  // Each hop owns a fifth of the scroll. A line draws across its fifth.
  const seg = (i: number) => useTransform(scrollYProgress, [i / 5, (i + 1) / 5], [0, 1]);
  const draw = [seg(0), seg(1), seg(2), seg(3), seg(4)];
  const p = (i: number) => (live ? draw[i] : 1);
  const lit = (i: number) => !live || active >= i;

  const cellRight = (x: number, w: number) => x + w - 14;
  const midY = (y: number) => y - 5;

  return (
    <section className={"section section--line trace-section" + (live ? "" : " is-static")} id="trace">
      <span className="eyebrow">One figure, end to end</span>
      <div className={"tracewalk" + (live ? " is-live" : "")} ref={ref}>
        <div className="tracewalk__sentinel" ref={sentinel} aria-hidden="true" />
        <div className="tracewalk__sticky">
          <span className={"pinned" + (pinned && live ? " is-on" : "")} aria-hidden="true">
            Pinned · hop <b>{active + 1}</b> of <b>{HOPS.length}</b>
          </span>
          <div className="tracewalk__text">
            <h2>Scroll, and watch a number prove itself.</h2>
            <ol className="hops">
              {HOPS.map((h, i) => (
                <li key={h.title} className={"hop" + (active === i || !live ? " is-on" : "")}>
                  <span className="hop__n">{i + 1}</span>
                  <div>
                    <h3>{h.title}</h3>
                    <p className="prose">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="tracewalk__diagram">
          <svg className="tracesvg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Three ledger cells summing to Total Income, rolling forward to Ending and Available balance, carried into September's beginning balance">
            {/* ledger block */}
            <g className="blk">
              <rect x={LX} y={52} width={LW} height={166} rx={10} />
              <text x={LX + 14} y={76} className="t-file">GeneralLedger_Aug.csv · #c1cce5b1ef3d</text>
              {LEDGER.map((r, i) => (
                <g key={r.cell} className={"cellrow" + (lit(0) ? " is-lit" : "")} style={{ transitionDelay: `${i * 60}ms` }}>
                  <rect x={LX + 10} y={r.y - 18} width={LW - 20} height={26} rx={4} className="cellbg" />
                  <text x={LX + 18} y={r.y} className="t-cell">{r.cell}</text>
                  <text x={LX + 52} y={r.y} className="t-label">{r.label}</text>
                  <text x={cellRight(LX, LW)} y={r.y} className="t-fig" textAnchor="end">{r.value}</text>
                </g>
              ))}
            </g>

            {/* statement block */}
            <g className="blk">
              <rect x={SX} y={52} width={SW} height={300} rx={10} />
              <text x={SX + 14} y={76} className="t-file">OwnerStatement_Aug.csv · #4125985d95c7</text>
              {STMT.map((r, i) => (
                <g key={r.cell} className={"cellrow" + (lit(i + 1) ? " is-lit" : "")}>
                  <rect x={SX + 10} y={r.y - 18} width={SW - 20} height={26} rx={4} className="cellbg" />
                  <text x={SX + 18} y={r.y} className="t-cell">{r.cell}</text>
                  <text x={SX + 56} y={r.y} className="t-label">{r.label}</text>
                  <text x={cellRight(SX, SW)} y={r.y} className="t-fig" textAnchor="end">{r.value}</text>
                </g>
              ))}
              <text x={SX + 18} y={194} className="t-op">+ 12,480.00 opening · − 2,800.00 expenses</text>
              <text x={SX + 18} y={288} className="t-op">− 15,000.00 draw · − 500.00 reserve</text>
            </g>

            {/* september */}
            <g className="blk blk--next">
              <rect x={SX} y={378} width={SW} height={78} rx={10} />
              <text x={SX + 14} y={400} className="t-file">September 2026</text>
              <g className={"cellrow" + (lit(4) ? " is-lit" : "")}>
                <rect x={SX + 10} y={SEPT.y - 18} width={SW - 20} height={26} rx={4} className="cellbg" />
                <text x={SX + 18} y={SEPT.y} className="t-cell">{SEPT.cell}</text>
                <text x={SX + 52} y={SEPT.y} className="t-label">{SEPT.label}</text>
                <text x={cellRight(SX, SW)} y={SEPT.y} className="t-fig" textAnchor="end">{SEPT.value}</text>
              </g>
            </g>

            {/* hop 1: three cells to B10 */}
            {LEDGER.map((r) => {
              const x1 = LX + LW, y1 = midY(r.y), x2 = SX + 10, y2 = midY(B10.y);
              const bend = x1 + (x2 - x1) * 0.5;
              return (
                <m.path
                  key={r.cell}
                  className="wire"
                  d={`M ${x1} ${y1} C ${bend} ${y1}, ${bend} ${y2}, ${x2} ${y2}`}
                  style={{ pathLength: p(0) }}
                  initial={false}
                />
              );
            })}
            {/* hop 2: B10 down to B16, hop 3: B16 to B19 */}
            {[
              { a: B10, b: B16, hop: 2 },
              { a: B16, b: B19, hop: 3 },
            ].map(({ a, b, hop }) => {
              // Leave the block on the left, bracket down, re-enter at the next cell.
              const x = SX + 10;
              const out = SX - 16;
              return (
                <m.path
                  key={b.cell}
                  className="wire"
                  d={`M ${x} ${midY(a.y)} C ${out} ${midY(a.y)}, ${out} ${midY(b.y)}, ${x} ${midY(b.y)}`}
                  style={{ pathLength: p(hop) }}
                  initial={false}
                />
              );
            })}
            {/* hop 4: B19 out and around into September */}
            <m.path
              className="wire"
              d={`M ${SX + SW} ${midY(B19.y)} C ${SX + SW + 22} ${midY(B19.y)}, ${SX + SW + 22} ${midY(SEPT.y)}, ${SX + SW - 4} ${midY(SEPT.y)}`}
              style={{ pathLength: p(4) }}
              initial={false}
            />
            <g className={"stamp-off" + (lit(4) && (!live || active === 4) ? " is-lit" : "")}>
              <rect x={LX} y={402} width={200} height={34} rx={5} />
              <text x={LX + 100} y={424} textAnchor="middle">Reconciled · off by 0.00</text>
            </g>
          </svg>
          <p className="tracewalk__pan" aria-hidden="true">Slide sideways to follow the whole trace.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
