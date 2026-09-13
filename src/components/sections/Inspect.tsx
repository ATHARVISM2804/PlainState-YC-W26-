import "./Inspect.css";

/**
 * What the inspector prints for the sample exports.
 *
 * The same fields the read-only HTTP endpoint returns (file, checksum, report
 * type, source system, rows, statements with their balance roles, accounts
 * that still need a decision), laid out the way the command line shows them.
 * No figures: the inspector describes files and never produces a number.
 */
const LINES: Array<[string, string]> = [
  ["cmd", "$ plainstate inspect OwnerStatement_Aug.csv GeneralLedger_Aug.csv"],
  ["", ""],
  ["file", "OwnerStatement_Aug.csv    csv · owner_statement · buildium    #4125985d95c7"],
  ["dim", "  rows 21 · statements 1"],
  ["", "  Jane Rutherford · August 2026 · confidence 1.00"],
  ["dim", "  roles found     beginning · income · expenses · ending · draw · reserve · available"],
  ["dim", "  roles missing   none"],
  ["", ""],
  ["file", "GeneralLedger_Aug.csv     csv · general_ledger · buildium     #c1cce5b1ef3d"],
  ["dim", "  rows 48 · ledger rows 46 · debit/credit columns"],
  ["", "  accounts needing a decision   1"],
  ["warn", "    Repairs & Maintenance       ambiguous 0.50      repairs | maintenance"],
  ["", ""],
  ["ok", "ready: no · 1 account to confirm before ingest · exit 3"],
];

export function Inspect() {
  return (
    <figure className="inspect">
      <figcaption className="inspect__bar">
        <span>plainstate inspect</span>
        <span className="inspect__meta">read-only · returns no figures</span>
      </figcaption>
      <pre className="inspect__out" tabIndex={0}>
        {LINES.map(([kind, text], i) => (
          <span key={i} className={kind ? `is-${kind}` : undefined}>
            {text}
            {"\n"}
          </span>
        ))}
      </pre>
      <p className="inspect__note">
        The sample exports are synthetic. The fields are the ones the inspector returns for any file:
        what it is, where it came from, which balance roles it found, and which accounts a person
        still has to decide.
      </p>
    </figure>
  );
}
