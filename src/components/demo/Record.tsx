import { FIGURES, STATEMENT_META } from "../../data/statement";
import "./Record.css";

/**
 * The canonical statement record, as the engine emits it.
 *
 * Not an illustration of JSON: the same figures and provenance the demo sheet
 * is rendered from, serialised. A technical reader can see the shape of what
 * they would receive, and check it against the statement to the cent.
 */
const RECORD = {
  report: STATEMENT_META.report,
  owner: STATEMENT_META.owner,
  period: STATEMENT_META.period,
  sources: [
    { file: "OwnerStatement_Aug.csv", checksum: "#4125985d95c7", type: "csv" },
    { file: "GeneralLedger_Aug.csv", checksum: "#c1cce5b1ef3d", type: "csv" },
  ],
  checks: {
    income_less_expenses: "reconciled",
    distribution: "reconciled",
    period_continuity: "unverified: no prior period supplied",
  },
  figures: FIGURES.map((f) => ({
    key: f.key,
    label: f.label,
    amount: f.amount.toFixed(2),
    provenance: {
      source_ref: f.provenance.source,
      checksum: f.provenance.checksum,
      locator: f.provenance.cell,
      raw_value: f.provenance.asPrinted,
      extraction_method: f.provenance.method,
      confidence: Number(f.provenance.confidence),
    },
  })),
};

const TEXT = JSON.stringify(RECORD, null, 2);

export function Record() {
  return (
    <div className="record">
      <header className="record__head">
        <span>statement.json</span>
        <span className="record__meta">
          {FIGURES.length} figures · {TEXT.split("\n").length} lines
        </span>
      </header>
      <pre className="record__code" tabIndex={0}>
        <code>{TEXT}</code>
      </pre>
    </div>
  );
}
