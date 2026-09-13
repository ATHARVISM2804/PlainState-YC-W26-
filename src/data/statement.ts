/**
 * One real statement, with the provenance the pipeline actually emits.
 *
 * Every value, cell reference, checksum fragment and confidence below is
 * output from `plainstate ingest` on the August fixture — not illustrative
 * placeholders. If the parser changes what it emits, this file should change
 * with it, which is the point of keeping it separate from the components.
 */

export type ExtractionMethod = "parsed" | "derived";

export interface Provenance {
  /** File the figure was read out of, as the customer named it. */
  source: string;
  /** First twelve hex of the stored file's sha256, as the citation carries it. */
  checksum: string;
  /** A1 cell reference in that file. */
  cell: string;
  /** The untransformed text in the cell, before any normalisation. */
  asPrinted: string;
  method: ExtractionMethod;
  confidence: string;
  /** One extra fact worth surfacing for this particular figure. */
  noteKey: string;
  noteValue: string;
}

export interface Figure {
  key: string;
  label: string;
  /** Formatted for display. */
  value: string;
  /** The same figure as a number, for the animated counter. Kept alongside
   *  rather than parsed from the string: the string is what the document said,
   *  and deriving one from the other in either direction invites drift. */
  amount: number;
  provenance: Provenance;
  /** A total or balance rather than a detail line. */
  emphasis?: boolean;
  /** A ledger line sitting under a section heading. */
  indent?: boolean;
}

const STATEMENT = { source: "OwnerStatement_Aug.csv", checksum: "#4125985d95c7" };
const LEDGER = { source: "GeneralLedger_Aug.csv", checksum: "#c1cce5b1ef3d" };

const figure = (
  key: string,
  label: string,
  value: string,
  from: { source: string; checksum: string },
  cell: string,
  asPrinted: string,
  noteKey: string,
  noteValue: string,
  extra: { emphasis?: boolean; indent?: boolean } = {},
): Figure => ({
  key,
  label,
  value,
  amount: Number(value.replace(/,/g, "")),
  ...extra,
  provenance: {
    ...from,
    cell,
    asPrinted,
    method: "parsed",
    confidence: "1.00",
    noteKey,
    noteValue,
  },
});

export const FIGURES: Figure[] = [
  figure("beg", "Beginning Cash Balance", "12,480.00", STATEMENT, "B6", "'12,480.00'",
    "role", "opening balance for the period", { emphasis: true }),

  figure("rent1", "Rent — Oakwood Ave 4B", "4,500.00", LEDGER, "H2", "'4,500.00'",
    "account", "4000 Rent Income → INCOME / rent", { indent: true }),
  figure("rent2", "Rent — Oakwood Ave 2A", "4,500.00", LEDGER, "H3", "'4,500.00'",
    "account", "4000 Rent Income → INCOME / rent", { indent: true }),
  figure("late", "Late fee — 2A", "125.00", LEDGER, "H4", "'125.00'",
    "account", "4010 Late Fee Income → INCOME / late_fee", { indent: true }),
  figure("inc", "Total Income", "9,125.00", STATEMENT, "B10", "'9,125.00'",
    "reconciled", "three ledger lines sum to this", { emphasis: true }),

  // The ledger states expenses as negatives; the statement needs magnitudes.
  // "As printed" keeps what the document actually said, which is why the
  // transformation is visible rather than hidden.
  figure("rep", "Repairs", "1,840.00", LEDGER, "H5", "'(1,840.00)'",
    "detail", "HVAC compressor replacement · Kirby HVAC · 12 Aug", { indent: true }),
  figure("land", "Landscaping", "240.00", LEDGER, "H6", "'(240.00)'",
    "detail", "Monthly grounds maintenance · GreenEdge · 20 Aug", { indent: true }),
  figure("mgmt", "Management fee", "720.00", LEDGER, "H7", "'(720.00)'",
    "detail", "Management fee, 8 per cent · 31 Aug", { indent: true }),
  figure("exp", "Total Expenses", "2,800.00", STATEMENT, "B15", "'2,800.00'",
    "reconciled", "three ledger lines sum to this", { emphasis: true }),

  figure("end", "Ending Cash Balance", "18,805.00", STATEMENT, "B16", "'18,805.00'",
    "checked", "12,480.00 + 9,125.00 − 2,800.00", { emphasis: true }),
  figure("draw", "Owner Draw", "15,000.00", STATEMENT, "B17", "'15,000.00'",
    "role", "distribution to the owner"),
  figure("res", "Reserve Withheld", "500.00", STATEMENT, "B18", "'500.00'",
    "role", "held back against next month"),
  figure("avail", "Available Balance", "3,305.00", STATEMENT, "B19", "'3,305.00'",
    "carries to", "September's opening balance", { emphasis: true }),
];

/** Where the section headings and subtotal rules fall, by the key that follows. */
export const HEADINGS: Record<string, string> = {
  rent1: "Income",
  rep: "Expenses",
};
export const RULE_BEFORE = new Set(["end", "avail"]);

export const BY_KEY = new Map(FIGURES.map((f) => [f.key, f]));

export const DEFAULT_KEY = "beg";

export const STATEMENT_META = {
  owner: "Jane Rutherford",
  period: "August 2026",
  report: "Owner Cash Statement",
};
