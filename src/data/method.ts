/**
 * The Method page: the six rules from the homepage, written out.
 *
 * A separate route because it is meant to be read, not skimmed. Everything
 * here is either how the engine behaves today or a rule the founder has
 * committed to. Nothing is a claim about customers or outcomes.
 */

export interface Chapter {
  n: string;
  title: string;
  paragraphs: string[];
  /** One line on how the rule shows up in the product as built. */
  inProduct: string;
}

export const METHOD_PAGE = {
  eyebrow: "The Plainstate method",
  title: "Rules for a number that has to be right.",
  lede:
    "Owner statements are trust-account records. The people who read them are sceptical by default, and they should be. These are the rules the engine is built on, written out so a property manager, an accountant or an investor can hold us to them.",
  updated: "September 2026",
  chapters: [
    {
      n: "1",
      title: "Reconcile first. Narrate second.",
      paragraphs: [
        "Every owner statement has the same skeleton. Beginning balance plus income minus expenses equals ending balance. Ending balance minus the owner's draw minus the reserve equals what is available, and what is available becomes next month's beginning balance. If any of those three relationships fails, nothing else on the statement matters.",
        "So the arithmetic comes first, and it comes exact. Money is decimal, never floating point, because a float fails on accumulation and the check has zero tolerance. A five-cent break is a break. The statement still renders, so a reviewer can see which figure broke it, but it does not go out.",
        "Only after the numbers tie does any sentence get written. An explanation of a figure that does not reconcile is not an explanation. It is a story.",
      ],
      inProduct: "Three checks on every statement, to the cent. Exit code 2 means a mismatch and the packet must not be sent.",
    },
    {
      n: "2",
      title: "Cite, or stay silent.",
      paragraphs: [
        "A figure that reaches a statement carries a record of where it came from: the file it was read out of, pinned to a checksum of that file; the cell or the page and box; the text exactly as the source printed it; how it was extracted; and how confident the reading is. A computed figure names its formula and every input.",
        "If a figure cannot be cited, it is not printed. There is no third case. This is the rule that makes the product possible for a buyer who handles other people's money, and it costs something: the engine will under-explain rather than guess. That is the right trade. A statement that says too little can be fixed next month. A statement with an invented number ends the account.",
        "The same rule will govern narrative when it exists. A sentence may only reference facts present in the normalised data, and every claim maps to a line item. If the model wants to say something it cannot cite, it says nothing.",
      ],
      inProduct: "Every figure on the homepage's demo can be asked where it came from, and answers with file, checksum, cell and as-printed text.",
    },
    {
      n: "3",
      title: "Ask. Do not guess.",
      paragraphs: [
        "Every company names its accounts differently. Plainstate maps them onto one category tree, and the company confirms that mapping once, at onboarding. Mapping confidence has four tiers: mapped, inferred, ambiguous, unmapped. Only mapped clears review.",
        "\"Repairs & Maintenance\" is the classic case. It is genuinely two categories. A system that picks one is quietly wrong on every statement afterwards. Plainstate flags it as ambiguous and asks. Expenses are never lumped into one line, because lumping is the single most common owner complaint about statements.",
        "The same instinct governs identification. A file is recognised by its content, never by its filename, and a file the engine cannot recognise is refused rather than skipped. Producing a statement while ignoring a supplied file is not allowed.",
      ],
      inProduct: "Chart-of-accounts drafting with a confidence tier on every account, and six kinds of input the engine refuses outright.",
    },
    {
      n: "4",
      title: "A person approves.",
      paragraphs: [
        "Plainstate drafts. A person on the property manager's team reviews and sends. It never auto-sends, and it never will. Anything uncertain routes to review: a confidence below 0.85, a rollforward that does not tie, a continuity check with no prior period to check against.",
        "The reason is not caution for its own sake. Only a small fraction of real-estate professionals say they trust software to make decisions for them, and this buyer has legal obligations around trust accounts. A product that asked for blind trust would be a product for a different buyer.",
        "Unverified is a state, and it is reported as one. Without last month's statement, continuity reads unverified. A computed total checked only against its own inputs is also unverified, because that proves nothing.",
      ],
      inProduct: "The public inspection endpoint returns no figures at all, so nothing a stranger uploads can come back as a number nobody approved.",
    },
    {
      n: "5",
      title: "Keep the source forever.",
      paragraphs: [
        "A citation that points at a deleted file is worthless. So the raw export is stored, content-addressed by its SHA-256 checksum, before anything parses it, and it is re-verified on every read. The same bytes are always the same document. If a file changed, every citation into it would say so.",
        "Storage is per account. Files are never pooled across customers and never used to train anything. They exist for one reason: so that a figure on a statement sent in August can still be traced in the audit that happens in March.",
        "The exception is the try-it endpoint on the homepage. It keeps nothing. Uploads live in a temporary directory and are deleted when the request ends.",
      ],
      inProduct: "A content-addressed source store, and a checksum on every citation.",
    },
    {
      n: "6",
      title: "Never move money.",
      paragraphs: [
        "There is no trust ledger in Plainstate, no disbursement, no bank connection and no payment rail. The ledger lives in the property management software and stays there. Plainstate reads what that software exports and produces a statement.",
        "That boundary is why there is nothing to migrate and nothing to rip out. It is also why a company can stop using Plainstate and find its accounting exactly where it left it. A vendor that logs into your accounting system with stored credentials is a hard sell to the exact buyer who cares most about provenance, so credential-based scraping is not done either.",
        "The other boundaries follow from the same idea. No tenant portal, no maintenance dispatch, no leasing, no owner login, no commercial reconciliation, no association reporting, no multi-currency. Each is a different product. They stay a no until there are twenty paying customers.",
      ],
      inProduct: "Read-only exports the customer schedules. No API credentials stored for any customer system.",
    },
  ] satisfies Chapter[],
};
