import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ApiError,
  apiConfigured,
  checkHealth,
  inspectFiles,
  type Health,
  type Inspection,
} from "../../lib/api";
import { Reveal } from "../Reveal";
import "./TryIt.css";

type Status =
  | { kind: "checking" }
  | { kind: "offline" }
  | { kind: "idle"; health: Health }
  | { kind: "working" }
  | { kind: "done"; result: Inspection }
  | { kind: "failed"; message: string };

/**
 * The claim, made testable.
 *
 * Every other section on this page asserts that Plainstate can read a real
 * export. This one lets a visitor prove it with their own file in about ten
 * seconds, which is worth more than any amount of copy.
 *
 * It calls the inspection endpoint, which reports structure and never returns
 * a figure — so nothing anyone uploads can come back as an unapproved number,
 * and nothing is retained after the request.
 */
export function TryIt() {
  const [status, setStatus] = useState<Status>({ kind: "checking" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    checkHealth(controller.signal).then((health) =>
      setStatus(health ? { kind: "idle", health } : { kind: "offline" }),
    );
    return () => controller.abort();
  }, []);

  const submit = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setStatus({ kind: "working" });
    try {
      setStatus({ kind: "done", result: await inspectFiles(files) });
    } catch (error) {
      setStatus({
        kind: "failed",
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong reading those files.",
      });
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      void submit(Array.from(e.dataTransfer.files));
    },
    [submit],
  );

  return (
    <section className="section section--line" id="try">
      <span className="eyebrow">Try it on your own data</span>
      <div className="split">
        <Reveal>
          <div className="stack">
            <h2>Drop in one real export.</h2>
            <p className="prose">
              We will tell you what we found: the report, the owner, the period,
              which of the seven balance roles we located, and every account that
              still needs a decision.
            </p>
            <p className="note">
              Inspection only — no figures are returned and nothing is stored.
              Your file is deleted when the request finishes.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="try">
            {status.kind === "offline" || !apiConfigured ? (
              <OfflinePanel />
            ) : (
              <>
                <div
                  className={"drop" + (dragging ? " drop--over" : "")}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="drop__input"
                    accept=".csv,.tsv,.txt,.xlsx,.xlsm,.pdf"
                    onChange={(e) => void submit(Array.from(e.target.files ?? []))}
                  />
                  <p className="drop__lead">
                    Drop your Owner Statement and General Ledger here
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => inputRef.current?.click()}
                    disabled={status.kind === "working"}
                  >
                    {status.kind === "working" ? "Reading…" : "Choose files"}
                  </button>
                  <p className="note drop__accepts">
                    {status.kind === "idle"
                      ? `${status.health.accepts.join("  ")} · up to ${
                          status.health.maxFiles
                        } files`
                      : "CSV · XLSX · PDF"}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {status.kind === "done" ? (
                    <Result key="done" result={status.result} />
                  ) : status.kind === "failed" ? (
                    <m.p
                      key="failed"
                      className="try__error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {status.message}
                    </m.p>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OfflinePanel() {
  return (
    <div className="offline">
      <p className="offline__lead">
        The live reader is not running on this deployment.
      </p>
      <p className="note">
        It is a small read-only service that describes an export without
        producing a statement. To run it against your own files:
      </p>
      <pre className="offline__code">
        <code>
          {`uvicorn plainstate.api:app --port 8000
VITE_API_URL=http://localhost:8000 npm run dev`}
        </code>
      </pre>
      <p className="note">
        Or send one export to <a href="mailto:hello@plainstate.com">hello@plainstate.com</a>{" "}
        and we will run it and write back.
      </p>
    </div>
  );
}

function Result({ result }: { result: Inspection }) {
  const unconfirmed = result.accounts.filter((a) => a.needsConfirming);
  const reduced = useReducedMotion();

  return (
    <m.div
      className="result"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <header className="result__head">
        <span className={"result__verdict" + (result.ready ? " is-ready" : "")}>
          {result.ready ? "Ready to ingest" : "Read, with decisions outstanding"}
        </span>
      </header>

      {result.files.map((file) => (
        <div className="result__file" key={file.filename + file.checksum}>
          <div className="result__row">
            <span className="result__name">{file.filename}</span>
            <span className="pill">{file.docType.replace(/_/g, " ")}</span>
          </div>
          <p className="result__meta">
            {file.rows} rows · read as {file.format} · sha256 {file.checksum}
          </p>

          {file.statements.map((s) => (
            <dl className="result__facts" key={(s.owner ?? "") + (s.period ?? "")}>
              <dt>owner</dt>
              <dd>{s.owner ?? "not named"}</dd>
              <dt>period</dt>
              <dd>{s.period ?? "not found"}</dd>
              <dt>roles</dt>
              <dd>
                {s.rolesFound.length}/7
                {s.rolesMissing.length > 0 ? ` · missing ${s.rolesMissing.join(", ")}` : ""}
              </dd>
              <dt>confidence</dt>
              <dd>{s.confidence}</dd>
            </dl>
          ))}

          {file.ledgerRows > 0 ? (
            <p className="result__meta">
              {file.ledgerRows} transactions ·{" "}
              {file.usesDebitCredit ? "debit/credit pair" : "signed amount column"}
            </p>
          ) : null}

          {file.problems.map((p) => (
            <p className="result__problem" key={p}>
              {p}
            </p>
          ))}
        </div>
      ))}

      {unconfirmed.length > 0 ? (
        <div className="result__accounts">
          <p className="result__accountsHead">
            {unconfirmed.length} account{unconfirmed.length === 1 ? "" : "s"} need a
            decision
          </p>
          <ul>
            {unconfirmed.slice(0, 6).map((a) => (
              <li key={a.name + (a.glAccount ?? "")}>
                <code>{a.glAccount ? `${a.glAccount} ` : ""}{a.name}</code>
                <span>
                  → {a.category}/{a.subcategory} · {a.method}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </m.div>
  );
}
