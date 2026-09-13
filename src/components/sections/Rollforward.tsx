import { BY_KEY } from "../../data/statement";
import { Figure } from "../Figure";
import { Reveal } from "../Reveal";
import "./Rollforward.css";

interface ChainRow {
  label: string;
  /** Which figure on the demo statement this line is; the value comes from there. */
  key: string;
  /** The operator shown to the left; null on the opening line. */
  op: "+" | "−" | "=" | null;
  /** A subtotal: gets a rule above it and heavier weight. */
  rule?: boolean;
}

/** The August figures, read from the same record the demo uses, so the chain
 *  on screen is a real month and cannot drift from the statement. */
const CHAIN: ChainRow[] = [
  { label: "Beginning balance", key: "beg", op: null },
  { label: "Income", key: "inc", op: "+" },
  { label: "Expenses", key: "exp", op: "−" },
  { label: "Ending balance", key: "end", op: "=", rule: true },
  { label: "Owner draw", key: "draw", op: "−" },
  { label: "Reserve withheld", key: "res", op: "−" },
  { label: "Available balance", key: "avail", op: "=", rule: true },
];

/**
 * The one piece of domain the reader has to hold to understand the product.
 *
 * Most visitors know the arithmetic; very few have thought about the last
 * line, which is where the real failure lives. Explaining it earns the right
 * to make claims about checking it.
 */
export function Rollforward() {
  return (
    <section className="section section--line" id="rollforward">
      <span className="eyebrow">The shape of every owner statement</span>
      <div className="split">
        <Reveal>
          <div className="stack">
            <h2>Seven figures, and one that has to match next month.</h2>
            <p className="prose">
              Every owner statement in this industry is the same skeleton,
              whichever PMS produced it. Beginning balance, income, expenses,
              ending balance, then the draw and the reserve come off to leave
              what is available.
            </p>
            <p className="prose">
              The last line is the one that matters. <strong>Available balance
              becomes next month&rsquo;s beginning balance.</strong> If those two
              ever disagree, every statement after it is wrong, and the owner
              finds it before you do.
            </p>
            <p className="note">
              Plainstate checks all three relationships on every statement, to
              the cent, with no tolerance.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="chain" role="presentation">
            {CHAIN.map((row) => {
              const figure = BY_KEY.get(row.key);
              if (!figure) return null;
              return (
                <div
                  className={"chain__row" + (row.rule ? " chain__row--total" : "")}
                  key={row.key}
                >
                  <span className="chain__op" aria-hidden="true">
                    {row.op ?? ""}
                  </span>
                  <span className="chain__label">{row.label}</span>
                  <Figure className="chain__value" value={figure.value} provenance={figure.provenance} inspect />
                </div>
              );
            })}

            <p className="chain__hint">Ask any figure where it came from.</p>
            <div className="chain__carry">
              <span className="chain__arrow" aria-hidden="true" />
              <p>
                carries forward as September&rsquo;s <strong>beginning balance</strong>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
