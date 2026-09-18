/**
 * Every string on the page.
 *
 * Kept out of the components so the copy can be read and edited as one voice,
 * and so changing a sentence never means touching JSX.
 *
 * There is deliberately no logo strip and no testimonial anywhere below.
 * Plainstate has no customers yet, and inventing them on a page whose whole
 * argument is that numbers are verifiable would be the one unrecoverable
 * mistake. Where social proof would normally sit, there are product facts that
 * are true today instead.
 */

export const SITE = {
  name: "Plainstate",
  tagline: "Month-end owner reporting for third-party property managers.",
  contact: "hello@buildplainstate.in",
  /** Every "Book a call" on the page reads this one value. */
  calendar: "https://cal.com/atharvgolait/plainstate",
  bookCall: "Book a call",
};

/**
 * The "send an export" link, pre-filled.
 *
 * An empty compose window is a blank page: the manager has to work out what to
 * attach and what we need to know. This says both, and leaves three lines to
 * fill in, which are the same three questions the booking form asks.
 */
const EXPORT_BODY = [
  "Attaching one month's exports from our property management software:",
  "",
  "  · Owner Statement",
  "  · General Ledger",
  "",
  "Redacted is fine. Tell us what you could and could not read.",
  "",
  "Company:",
  "Doors we manage:",
  "Software (Buildium / AppFolio / Rent Manager / Propertyware / Rentvine / other):",
  "",
].join("\n");

export const SEND_EXPORT = `mailto:${SITE.contact}?subject=${encodeURIComponent(
  "One month's export",
)}&body=${encodeURIComponent(EXPORT_BODY)}`;

export const HERO = {
  kicker: "For residential property managers · 200–800 doors",
  headline: "Month-end owner statements in",
  headlineAccent: "under an hour.",
  lede:
    "Not three to five days. Plainstate reads the exports your PMS already produces, reconciles them to the cent, and drafts every owner's packet — with the source cell behind every single figure.",
  primary: "Send us one export",
  secondary: "See how it works",
  hint: "Click any figure — this is exactly what a reviewer sees.",
};

export const SIGNALS = [
  "Reconciles to the cent or refuses to send",
  "Every figure cites its source cell",
  "Read-only — no money movement, ever",
];

/* --------------------------------------------------------- what it is */

export const WHAT = {
  eyebrow: "What Plainstate is",
  heading: "Software that drafts the monthly owner statement from the reports you already run.",
  body:
    "Plainstate is for third-party residential property managers. Each month it takes the Owner Statement and General Ledger exports out of your property management software, checks that every balance rolls forward to the cent, and drafts one statement per owner with the exact source cell recorded behind every figure. A person on your team reviews and sends. It never touches money and never replaces your PMS.",
  columns: [
    {
      title: "It reads",
      body: "Scheduled CSV, XLSX or PDF exports from Buildium and AppFolio today: the Owner Cash Statement, the General Ledger and the rent roll. No API keys, no plan upgrade.",
    },
    {
      title: "It produces",
      body: "One statement per owner, reconciled to the cent, every figure carrying its file, cell, checksum and the text exactly as printed. Anything uncertain is flagged for a person.",
    },
    {
      title: "You do",
      body: "Confirm your chart of accounts once. Then on close day, open the drafts, click any number to see its source, approve and send.",
    },
  ],
};

/* ------------------------------------------------------------ the workflow */

export const WORKFLOW = {
  eyebrow: "How a month moves",
  heading: "From your software to your owner's inbox, with a person in the middle.",
  body:
    "Nothing changes about how you run the month. Your PMS still keeps the books and still produces its reports. Plainstate sits between those reports and the statement an owner receives, and it never sends anything on its own.",
  steps: [
    {
      who: "Your PMS",
      title: "The month closes",
      body: "Buildium or AppFolio keeps the ledger, as it always has.",
      note: "Nothing to migrate",
    },
    {
      who: "Scheduled export",
      title: "Reports drop in",
      body: "The Owner Statement and General Ledger arrive as CSV, XLSX or PDF at an address we give you.",
      note: "Any plan tier",
    },
    {
      who: "Plainstate",
      title: "Reconcile and cite",
      body: "Every balance rolls forward to the cent. Every figure records the file, cell and checksum it came from. Anything uncertain is flagged.",
      note: "Refuses rather than guesses",
      core: true,
    },
    {
      who: "Your reviewer",
      title: "A person approves",
      body: "Opens the draft, clicks any figure to see its source, edits if needed, and sends.",
      note: "Never auto-sends",
    },
    {
      who: "Your owner",
      title: "A statement that explains itself",
      body: "The same numbers as before, now with the reasons and the receipts behind them.",
      note: "Fewer emails back",
    },
  ],
  rules: ["Read-only", "No bank connection", "Nothing sent without approval"],
};

/** The checks the engine ran on the demo statement, shown beside the receipt. */
export const DEMO_FLAGS = [
  { code: "rollforward", state: "ok", text: "reconciled to the cent" },
  { code: "totals", state: "ok", text: "three ledger lines sum to each total" },
  { code: "period_continuity", state: "warn", text: "unverified · no prior period" },
] as const;

/* -------------------------------------------------------------- the films */

export interface Film {
  eyebrow: string;
  heading: string;
  body: string;
  /** Path under public/, e.g. "/film-overview.mp4". Empty shows the frame. */
  src: string;
  poster?: string;
}

/** One film, the overview. Set `src` to a path under public/ to show it. */
export const FILMS: Record<"overview", Film> = {
  overview: {
    eyebrow: "In one take",
    heading: "Watch a month close.",
    body: "From the exports landing to the statement a reviewer approves.",
    src: "/film-overview.mp4",
    poster: "/film-overview-poster.jpg",
  },
};

/* ----------------------------------------------------------------- footer */

export const FOOTER = {
  blurb:
    "Month-end owner statements for third-party residential property managers, with the source cell behind every figure.",
  columns: [
    {
      title: "The product",
      links: [
        { label: "How statements work", href: "/#rollforward" },
        { label: "How it works", href: "/#how" },
        { label: "Under the hood", href: "/#engine" },
        { label: "The checks", href: "/#checks" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "The method", href: "/method" },
        { label: "Try it", href: "/#try" },
        { label: "Pricing", href: "/#pricing" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Talk to us",
      links: [
        { label: "Book a call", href: "https://cal.com/atharvgolait/plainstate" },
        { label: "Send an export", href: SEND_EXPORT },
      ],
    },
  ],
  reads: "Reads Buildium and AppFolio exports · CSV, XLSX and PDF · Never moves money",
  legal: "© 2026 Plainstate. Every figure on this page comes from a synthetic sample statement.",
  colophon:
    "Set in Newsreader, Instrument Sans and IBM Plex Mono. Built as a static site with no tracking of people. The paper is one tiled noise filter; the stamps and receipts are CSS.",
};

export interface Source {
  label: string;
  href: string;
}

/* ------------------------------------------------------------ the change */

export const WHY = {
  eyebrow: "Why now",
  heading: "Owners expect bank-statement clarity. They get a fifteen-page PDF.",
  shifts: [
    {
      title: "Portals made statements instant, not understandable.",
      body: "Every PMS now delivers the owner statement the moment the month closes. What it delivers is still the ledger's own table, with the explanation left to a person who types a note at the top.",
    },
    {
      title: "The exports are finally machine-readable.",
      body: "Buildium and AppFolio can schedule the Owner Statement and General Ledger as CSV, XLSX or PDF on a fixed date, on every plan tier. A statement can be rebuilt, checked and cited from files the manager already produces.",
    },
    {
      title: "Regulators audit the ledger, not the marketing.",
      body: "A state commission's published case study lists what it sanctions: owner ledgers that do not show the exact money on hand, lump-sum journal entries, no trial balance. Failures at any stage have a domino effect through every statement after them.",
    },
  ],
  sources: [
    { label: "Buildium, setting up automated monthly owner reports", href: "https://www.buildium.com/blog/how-to-set-up-automated-monthly-reports-for-owners/" },
    { label: "North Carolina Real Estate Commission, trust account violations case study", href: "https://bulletins.ncrec.gov/multiple-trust-account-violations-a-regulatory-affairs-division-case-study/" },
  ],
};

/* --------------------------------------------------------- the alternatives */

export const RUNS_OUT = {
  eyebrow: "What you do today",
  heading: "Three ways to get the statement out. Where each one runs out.",
  options: [
    {
      title: "Your PMS's own statement",
      lines: [
        "Produced from the ledger that also holds the errors. Nothing outside it checks the rollforward.",
        "Explanations are notes a person types at the top of each statement.",
        "Scheduled delivery and report automation sit on the higher plan tiers.",
        "Owner-level views across properties are a recurring complaint; the workaround is exporting to Excel.",
      ],
      verdict: "Right numbers, no proof, no explanation.",
    },
    {
      title: "A spreadsheet",
      lines: [
        "Rebuilt by hand from the export, forty times.",
        "A pasted figure carries no record of where it came from.",
        "A mistake becomes next month's opening balance, and the owner finds it first.",
      ],
      verdict: "Explanation possible, proof impossible.",
    },
    {
      title: "An outsourced bookkeeper",
      lines: [
        "Published ranges run roughly $9 to $25 per door per month for firms of 200 to 500 doors.",
        "Skilled people doing the transcription and the reconciliation by hand.",
        "The output is the same statement, still without the source behind each figure.",
      ],
      verdict: "Accurate, expensive, and still a table.",
    },
  ],
  closer:
    "Plainstate sits on top of the first, replaces the second, and gives the third something to review instead of something to rebuild.",
  sources: [
    { label: "Buildium pricing: reporting automation on Growth and Premium", href: "https://www.buildium.com/pricing/" },
    { label: "AppFolio pricing: minimum spend and 50-unit minimum", href: "https://www.appfolio.com/pricing" },
    { label: "Fondifi, AppFolio reporting limitations", href: "https://fondifi.com/2026/03/26/appfolio-reporting-hidden-limitations/" },
    { label: "Numetix, what property management accounting costs per door", href: "https://www.numetix.ai/resources/property-management-accounting-cost-what-you-should-expect-to-pay" },
  ],
};

/* ----------------------------------------------------------- the standard */

export const PROVE = {
  eyebrow: "The standard",
  heading: "A statement should prove itself.",
  lines: [
    "Every figure traceable to the cell it was read from.",
    "The rollforward proven to the cent, not asserted.",
    "Anything uncertain flagged to a person, never guessed.",
    "A human signs off before an owner sees it.",
  ],
};

/* ------------------------------------------------------------ the engine */

export const ENGINE = {
  eyebrow: "Under the hood",
  heading: "Seven steps from export to statement. Each one can stop the line.",
  body:
    "This is the engine as it exists today, driven from the command line and a read-only inspection API. Nothing here is a plan.",
  stages: [
    { name: "store", does: "The raw file is saved under its SHA-256 checksum before anything reads it.", stops: "The same bytes are always the same document; a citation can never point at a file that changed." },
    { name: "read", does: "CSV becomes A1 cells. XLSX is parsed from the sheet XML directly, so numbers stay exact. PDF words become lines and columns with a page and a box.", stops: "Spreadsheet libraries return floats; the precision loss would happen before anyone could detect it." },
    { name: "identify", does: "Which report is this, and which PMS produced it, decided from the content. Never from the filename.", stops: "A file it cannot recognise is refused, not ignored." },
    { name: "parse", does: "A dialect describes each PMS's layout. Buildium and AppFolio use one engine and differ only by configuration.", stops: "AppFolio's year-to-date column is known and skipped; read as the month, it reconciles perfectly and is wrong on every line." },
    { name: "normalise", does: "Figures map to one canonical statement. Accounts map to one category tree. Sign conventions are resolved and recorded.", stops: "An account that could be two categories is asked about at onboarding, not guessed at." },
    { name: "validate", does: "Beginning plus income minus expenses equals ending. Ending minus draw minus reserve equals available. Prior available equals this beginning. Exact, to the cent.", stops: "A five-cent break stops the statement. Without last month, continuity reports unverified, never a silent pass." },
    { name: "flag", does: "Rollforward mismatches and low-confidence extractions route the statement to review.", stops: "Confidence below 0.85 never passes on its own." },
  ],
  tiers: [
    { tier: "mapped", meaning: "confirmed by the company at onboarding", confidence: "1.00" },
    { tier: "inferred", meaning: "matched one category by keyword", confidence: "0.60" },
    { tier: "ambiguous", meaning: "matched more than one category", confidence: "0.50" },
    { tier: "unmapped", meaning: "nothing matched", confidence: "0.30" },
  ],
  tiersNote: "Only the first tier clears review. Everything else is a question for a person.",
  refusals: [
    "Last month's ledger beside this month's statement",
    "A combined export holding several owners, read as one",
    "AppFolio's year-to-date column read as the month",
    "Amounts in pounds or euros",
    "A file the system cannot recognise",
    "A property claimed by two owners",
  ],
  refusalsNote: "Each of these produces a statement that looks correct. That is why they are refused rather than warned about.",
  exit: [
    { code: "0", meaning: "reconciled" },
    { code: "1", meaning: "failed" },
    { code: "2", meaning: "rollforward mismatch, must not be sent" },
    { code: "3", meaning: "needs review" },
  ],
};

/* ------------------------------------------------------------ the method */

export const METHOD = {
  eyebrow: "What we believe",
  heading: "Six rules the engine is built on.",
  rules: [
    { rule: "Reconcile first. Narrate second.", why: "An explanation of a number that does not tie is a story. The arithmetic comes before any sentence." },
    { rule: "Cite, or stay silent.", why: "If a figure cannot be traced to a cell, it is not printed. There is no third case. Under-explaining is recoverable; an invented number ends the account." },
    { rule: "Ask. Do not guess.", why: "\"Repairs & Maintenance\" is two categories. It is flagged and asked about once, at onboarding, not resolved by a coin toss." },
    { rule: "A person approves.", why: "Plainstate drafts. It never sends. The low trust in software that handles other people's money is the reason this product exists, so it never asks for blind trust." },
    { rule: "Keep the source forever.", why: "A citation pointing at a deleted file is worthless. Every stored file is checksummed and re-verified on read." },
    { rule: "Never move money.", why: "No trust ledger, no disbursement, no bank connection. The ledger stays where it is, and stays yours." },
  ],
};

/* ------------------------------------------------------------- the status */

export const STATUS = {
  eyebrow: "Where it stands",
  heading: "What works today. What is next.",
  asOf: "As of September 2026",
  built: [
    "Buildium Owner Cash Statement and General Ledger",
    "AppFolio Owner Statement and General Ledger, including the year-to-date trap",
    "CSV, XLSX and PDF readers with cell and page locators",
    "Rent roll recognition",
    "Combined multi-owner exports split per owner",
    "The full rollforward, to the cent, zero tolerance",
    "Provenance on every figure: file, checksum, cell, as printed, confidence",
    "Two flags: rollforward mismatch, low-confidence extraction",
    "Command line, content-addressed source store, read-only inspection API",
    "500 automated tests, about 12,000 fuzz cases, six invariants",
  ],
  planned: [
    { item: "Plain-language narrative for each owner", when: "next" },
    { item: "Flags for maintenance spikes, repeat repairs, vacancy creep, late rent, uncleared funds", when: "next" },
    { item: "The owner packet as a PDF", when: "next" },
    { item: "The reviewer's queue: click a figure, see the source highlighted", when: "after" },
    { item: "Vendor invoices matched to ledger lines", when: "after" },
    { item: "Buildium API, then Rentvine, Rent Manager, Propertyware", when: "later" },
  ],
  honest:
    "Every sample on this page is synthetic. The engine has not yet met a real customer's export, and that is the next step: one design partner's files through the inspector.",
};

/* -------------------------------------------------------------- the data */

export const DATA = {
  eyebrow: "Your data",
  heading: "Your owners' money never touches Plainstate.",
  points: [
    { rule: "Read-only, from exports you schedule", detail: "Plainstate reads the reports your PMS already emits. There is no login to your accounting system, no stored credentials, no scraping." },
    { rule: "No bank connection. No money movement.", detail: "There is no trust ledger, no disbursement and no payment rail anywhere in the product." },
    { rule: "Your files are kept, for your account only", detail: "A citation must point at a file that still exists, so raw exports are stored, checksummed and re-verified on read. They are never pooled across customers and never used to train anything." },
    { rule: "Deleted on request", detail: "Ask, and your files and every derived record go. The inspection endpoint on this page keeps nothing at all; uploads are deleted when the request ends." },
    { rule: "NDA first", detail: "We sign before you send a single export. Redacted files are welcome." },
    { rule: "Certification", detail: "No formal security certification yet. This line will say so plainly until that changes." },
  ],
};

/* ----------------------------------------------------------- the glossary */

export const GLOSSARY = [
  { term: "Door", meaning: "One rental unit. Company size is measured in doors." },
  { term: "Third-party manager", meaning: "A company managing rental property on behalf of outside owners." },
  { term: "Owner statement", meaning: "The monthly report sent to each owner: what came in, what went out, what they are paid, what is held." },
  { term: "Rollforward", meaning: "The chain from beginning balance to available balance, carried into next month as its beginning balance." },
  { term: "Owner draw", meaning: "Money paid out to the owner. Also called the distribution." },
  { term: "Reserve", meaning: "Money held back from the owner, for example against future repairs." },
  { term: "General ledger", meaning: "The full list of transactions: every rent payment, every expense." },
  { term: "Chart of accounts", meaning: "A company's list of account names and numbers, such as 4000 Rent Income." },
  { term: "Trust account", meaning: "A regulated bank account holding owners' and tenants' money. Mishandling it is a legal violation." },
  { term: "Three-way reconciliation", meaning: "Bank balance equals the trust ledger equals the sum of every owner ledger. If one owner ledger is wrong, it fails." },
  { term: "Provenance", meaning: "The record of exactly where a figure came from: file, checksum, cell, the text as printed, and how confident the reading is." },
  { term: "Locator", meaning: "A cell address such as Sheet1!D42, or a PDF page and box, pinpointing a value." },
  { term: "Checksum", meaning: "A fingerprint of a file, proving its contents have not changed since it was stored." },
];

/* Facts about the engine that are true today, for the strip under the hero.
   This is where a logo strip would go. Every line is a fact about the built engine. */
export const FACTS = [
  "500 automated tests",
  "About 12,000 fuzz cases, six invariants",
  "Rollforward checked to the cent, zero tolerance",
  "Every citation resolves to a real cell",
  "Decimal arithmetic, never floating point",
  "Raw files checksummed and kept",
  "CSV, XLSX and PDF",
  "Buildium and AppFolio formats live",
  "Confidence under 0.85 goes to a person",
];

/* ---------------------------------------------------------------- the pain */

export const PAIN = {
  eyebrow: "The month you already have",
  heading: "The numbers are right. Nobody can tell.",
  body:
    "The ledger in your PMS is correct. The statement it prints is a table: \"Repairs and Maintenance: 3,200.00\" with no vendor, a line called \"Adjustment: Trust Reconciliation\" that reads like someone rewriting last month, a journal entry the owner has never heard of. So somebody rebuilds each packet by hand, writes the explanation from memory, and then spends the following week answering the questions the statement should have answered.",
  /** What owners actually write in, as property managers report it. */
  asks: [
    "Why don't these numbers add up to the payout I received?",
    "What are the journal-entry lines on my statement?",
    "It looks like something was charged twice.",
    "It says I have funds available, but I didn't receive a disbursement.",
  ],
  statsLabel: "Founder estimates from early research. To be confirmed with design partners.",
  stats: [
    { figure: "3–5", unit: "days", caption: "to get statements out the door" },
    { figure: "~30", unit: "hours", caption: "of staff time at 500 doors" },
    { figure: "40+", unit: "owners", caption: "each expecting their own packet" },
  ],
  closer:
    "None of that work is accounting. It is transcription, reconciliation and explanation, which is exactly the part a machine can do if it can prove where every number came from.",
  sources: [
    { label: "Numetix, owner statement templates and what owners call about", href: "https://www.numetix.ai/resources/property-management-owner-statements-templates" },
    { label: "ROOST Real Estate, owner statement FAQ", href: "https://roostrealestateco.com/appfolio-owner-statement-faqs-common-questions-from-roost-owners/" },
    { label: "Clearing, year-end owner statements", href: "https://www.getclearing.co/blog-posts/year-end-owner-statements" },
  ],
};

/* ------------------------------------------------------------- the product */

export const PRINCIPLE = {
  eyebrow: "Why it is trustworthy",
  heading: "The receipt travels with the figure.",
  paragraphs: [
    "A parsed figure names the file, the cell, and the untransformed text it was read from. A computed figure names its formula and every input that fed it. If a number cannot be cited, it is not printed — there is no third case.",
    "The source file is stored and checksummed, and the citation carries that checksum. A reference pointing at a file whose contents we can no longer prove is not a reference.",
  ],
};

export interface Step {
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    title: "Point your reports at us",
    body: "Schedule the Owner Statement and General Ledger to drop to an address we give you. Five minutes, once — and it works on any plan tier of any PMS.",
  },
  {
    title: "Confirm your chart of accounts",
    body: "We draft it from your own accounts with a best guess filled in. You correct it once. Anything we inferred rather than confirmed stays flagged until a person signs it off.",
  },
  {
    title: "Statements draft themselves",
    body: "On your close date, one packet per owner — split out of a combined export if that is how your PMS emits them. Every expense on its own line.",
  },
  {
    title: "You review and send",
    body: "Figures, flags and sources side by side. Click any number, see the cell. Approve, edit, send.",
  },
];

/* ------------------------------------------------------------ integrations */

export const SOURCES = {
  eyebrow: "What it reads",
  heading: "The exports you already have.",
  body:
    "No API keys, no plan upgrade, no migration. If your PMS can email or drop a scheduled report, Plainstate can read it — and format neutrality is exactly what your PMS has no incentive to build.",
  systems: [
    { name: "Buildium", detail: "Owner Cash Statement · General Ledger", status: "live" },
    { name: "AppFolio", detail: "Owner Statement · General Ledger", status: "live" },
    { name: "Rent Manager", detail: "Researching export formats", status: "next" },
    { name: "Propertyware", detail: "Researching export formats", status: "next" },
    { name: "Rentvine", detail: "Researching export formats", status: "next" },
    { name: "Anything else", detail: "Send one export and we will tell you", status: "ask" },
  ] as const,
  formats: ["CSV", "XLSX", "PDF"],
};

/* ----------------------------------------------------------------- refusals */

export interface Refusal {
  message: string;
  why: string;
  tone: "stop" | "warn";
}

export const REFUSALS: Refusal[] = [
  {
    tone: "stop",
    message: "ROLLFORWARD MISMATCH — off by (5.00). Must not be sent.",
    why: "A five-cent break stops the statement. The packet still renders, so a reviewer sees exactly which figure broke it.",
  },
  {
    tone: "stop",
    message:
      "GeneralLedger_Jul.csv covers 2026-07-01 to 07-31, but the period is 2026-08-01 to 08-31.",
    why: "Last month's ledger beside this month's statement. Those figures reconcile perfectly — they are simply the wrong month. Nothing else would catch it.",
  },
  {
    tone: "warn",
    message: "'Repairs & Maintenance' — ambiguous. Candidates: repairs, maintenance.",
    why: "An account that could go two ways is asked about, not guessed at. A guessed category is a line you cannot answer an owner's question about.",
  },
];

/* ---------------------------------------------------------------- boundaries */

export interface Boundary {
  rule: string;
  detail: string;
}

export const BOUNDARIES: Boundary[] = [
  {
    rule: "Never moves money",
    detail: "No trust accounting, no disbursement, no bank connection. We read reports and produce a packet.",
  },
  {
    rule: "Never replaces your PMS",
    detail: "We sit on top of Buildium, AppFolio and the rest. Nothing to migrate, nothing to rip out.",
  },
  {
    rule: "Never auto-sends",
    detail: "We draft, a person approves. Every statement passes a reviewer before an owner sees it.",
  },
  {
    rule: "Never invents a figure",
    detail: "A number that cannot be traced to a source cell is not emitted. Under-explaining is recoverable; a made-up number ends the account.",
  },
];

/* ------------------------------------------------------------------ pricing */

export interface Tier {
  doors: string;
  price: string;
  typical: string;
  featured?: boolean;
}

export const TIERS: Tier[] = [
  { doors: "200–350", price: "249", typical: "One reviewer, one close day" },
  { doors: "350–600", price: "449", typical: "Several managers, shared queue", featured: true },
  { doors: "600–900", price: "699", typical: "Dedicated accounting staff" },
];

export const PRICING_NOTE =
  "All owners, all properties, unlimited statements. No per-statement fees, no setup fee.";

/* ---------------------------------------------------------------------- FAQ */

export interface Question {
  q: string;
  a: string;
}

export const FAQS: Question[] = [
  {
    q: "Do you connect to our bank or move any money?",
    a: "No, and we never will. Plainstate is read-only. It ingests reports, reconciles them and produces a packet. There is no trust accounting, no disbursement and no bank connection anywhere in the product.",
  },
  {
    q: "Do we have to leave Buildium or AppFolio?",
    a: "No. Plainstate sits on top of whatever you already run. Nothing migrates, nothing is replaced, and if you stop using us your PMS is exactly where you left it.",
  },
  {
    q: "What if our chart of accounts is a mess?",
    a: "That is the normal case. We draft a mapping from your own account names with a best guess filled in, and you correct it once during onboarding. Anything we inferred rather than confirmed stays flagged until a person signs it off, so a guess never quietly reaches an owner.",
  },
  {
    q: "What happens when a statement does not balance?",
    a: "It stops. The rollforward is checked to the cent with no tolerance, and a break blocks the packet rather than shipping it. The statement still renders so a reviewer can see precisely which figure is wrong.",
  },
  {
    q: "Can we see where a number came from?",
    a: "That is the whole product. Every figure carries the file, the cell, the untransformed text in that cell, and a checksum of the stored source. Click any number and the citation is right there.",
  },
  {
    q: "Our PMS is not on your list.",
    a: "Send one month's exports anyway. We will tell you honestly what we could read and what we could not, usually within a day, and there is no charge for that.",
  },
  {
    q: "Does it replace our bookkeeper?",
    a: "No. It does the transcription and the reconciliation and records where every figure came from, which is the part of their month that is not judgement. Your bookkeeper reviews a statement that is already tied out instead of building one.",
  },
  {
    q: "Does it change any numbers in our PMS?",
    a: "It cannot. Plainstate reads exports you schedule. It has no login to your accounting system and writes nothing back.",
  },
  {
    q: "Which states' trust-account rules does it follow?",
    a: "It does not give legal advice and it does not move money. It produces a statement whose every figure is traceable and whose balances roll forward to the cent, which is the record an audit asks for whichever state you are in.",
  },
  {
    q: "What do you do with our data?",
    a: "We store the raw export files, because a citation pointing at a file we no longer hold is worthless. They are kept for your account only, never pooled, and never used to train anything. We sign an NDA before you send us a thing.",
  },
];

/* -------------------------------------------------------------------- close */

export const CLOSE = {
  eyebrow: "Getting started",
  heading: "Send us one real export.",
  body:
    "The fastest way to find out whether this works on your data is to give us one month's Owner Statement and General Ledger. We come back with the parsed statement, the source cell behind every figure, and an honest list of anything we could not read.",
  note: "Redacted exports welcome. We sign an NDA before you send anything.",
  primary: "Send an export",
  secondary: "Book fifteen minutes",
};
