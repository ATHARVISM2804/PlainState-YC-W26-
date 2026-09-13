import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { FIGURES } from "../../data/statement";
import "./Torn.css";

/** The export as it arrives: the ledger rows behind the August statement. */
const RAW = [
  "Date,Account,Memo,Debit,Credit,Ref",
  "2026-08-01,4000,Rent - Oakwood 4B,,4500.00,PMT-88012",
  "2026-08-01,4000,Rent - Oakwood 2A,,4500.00,PMT-88013",
  "2026-08-06,4010,Late fee 2A,,125.00,PMT-88041",
  "2026-08-12,6200,Kirby HVAC inv 2291,1840.00,,BILL-5510",
  "2026-08-20,6100,GreenEdge Aug grounds,240.00,,BILL-5534",
  "2026-08-31,5000,Mgmt fee 8%,720.00,,AUTO",
  "2026-08-31,JE-1183,Adjustment: Trust Reconciliation,0.00,0.00,JE",
];

const CLEAN_KEYS = ["beg", "inc", "exp", "end", "draw", "res", "avail"];

/** The zigzag right edge of the torn layer, at a given split. */
function tornEdge(pct: number, teeth = 18, depth = 0.9): string {
  const pts = ["0 0", `${pct}% 0`];
  for (let i = 1; i <= teeth; i++) {
    const y = ((i / teeth) * 100).toFixed(2);
    const x = (pct + (i % 2 ? -depth : 0)).toFixed(2);
    pts.push(`${x}% ${y}%`);
  }
  pts.push("0 100%");
  return `polygon(${pts.join(", ")})`;
}

/**
 * Before and after, torn.
 *
 * The export as it arrives lies over the statement an owner can read; a torn
 * edge between them moves with the pointer, or with the arrow keys. Nothing
 * here is a slider control from a component kit: it is the same receipt edge
 * the refusals are printed on.
 */
export function Torn() {
  const ref = useRef<HTMLDivElement>(null);
  // On a phone the tear starts further left so the statement's labels show.
  const [pct, setPct] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 40rem)").matches ? 34 : 56,
  );
  const [dragging, setDragging] = useState(false);

  const fromPointer = useCallback((e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    setPct(Math.min(96, Math.max(4, x)));
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") setPct((p) => Math.max(4, p - step));
    if (e.key === "ArrowRight") setPct((p) => Math.min(96, p + step));
    if (e.key === "Home") setPct(4);
    if (e.key === "End") setPct(96);
  };

  const rows = CLEAN_KEYS.map((k) => FIGURES.find((f) => f.key === k)!);

  return (
    <figure className="torn-wrap">
      <div
        className={"torn" + (dragging ? " is-dragging" : "")}
        ref={ref}
        onPointerDown={(e) => {
          setDragging(true);
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging && fromPointer(e)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {/* under: the statement */}
        <div className="torn__after" aria-label="The statement an owner can read">
          <span className="torn__tag torn__tag--after">Statement</span>
          <ul className="torn__stmt">
            {rows.map((r) => (
              <li key={r.key} className={r.emphasis ? "is-total" : ""}>
                <span>{r.label}</span>
                <span className="figure">{r.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* over: the export, torn away */}
        <div className="torn__before" style={{ clipPath: tornEdge(pct) }} aria-label="The export as it arrives">
          <span className="torn__tag torn__tag--before">Export</span>
          <pre className="torn__raw">{RAW.join("\n")}</pre>
        </div>

        <button
          type="button"
          className="torn__handle"
          style={{ left: `${pct}%` }}
          aria-label="Move the tear between the export and the statement"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          role="slider"
          onKeyDown={onKey}
        >
          <span className="torn__grip" aria-hidden="true" />
        </button>
      </div>
      <figcaption className="torn__cap">
        Drag the tear. On the left, the export as it arrives. On the right, the statement it becomes.
      </figcaption>
    </figure>
  );
}
