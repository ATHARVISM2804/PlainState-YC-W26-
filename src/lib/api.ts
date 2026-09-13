/**
 * Client for the Plainstate ingestion API.
 *
 * The endpoint is inspection-only by design: it describes what is in a file
 * and never returns a figure. That is what makes it safe to put in front of a
 * stranger's browser — there is no path here that could publish a number
 * nobody approved.
 *
 * The base URL comes from VITE_API_URL so the page can be deployed statically
 * with no backend at all. When it is absent or unreachable the UI says so
 * plainly rather than pretending to work.
 */

const BASE = (import.meta.env["VITE_API_URL"] ?? "").replace(/\/$/, "");

export interface Health {
  ok: boolean;
  version: string;
  accepts: string[];
  maxBytes: number;
  maxFiles: number;
}

export interface SeenStatement {
  owner: string | null;
  period: string | null;
  confidence: string;
  rolesFound: string[];
  rolesMissing: string[];
  propertyPages: string[];
}

export interface SeenFile {
  filename: string;
  checksum: string;
  sourceType: string;
  docType: string;
  format: string;
  rows: number;
  ledgerRows: number;
  usesDebitCredit: boolean;
  notes: string[];
  problems: string[];
  statements: SeenStatement[];
}

export interface SeenAccount {
  name: string;
  glAccount: string | null;
  occurrences: number;
  category: string;
  subcategory: string;
  method: string;
  confidence: string;
  needsConfirming: boolean;
  explanation: string;
}

export interface Inspection {
  ready: boolean;
  problems: string[];
  files: SeenFile[];
  accounts: SeenAccount[];
}

export const apiConfigured = BASE.length > 0;

/** Returns null when no API is configured or it cannot be reached. */
export async function checkHealth(signal?: AbortSignal): Promise<Health | null> {
  if (!apiConfigured) return null;
  try {
    const res = await fetch(`${BASE}/api/health`, { signal });
    if (!res.ok) return null;
    return (await res.json()) as Health;
  } catch {
    return null;
  }
}

export class ApiError extends Error {}

export async function inspectFiles(files: File[]): Promise<Inspection> {
  if (!apiConfigured) {
    throw new ApiError("No ingestion API is configured for this deployment.");
  }

  const body = new FormData();
  for (const file of files) body.append("files", file);

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/inspect`, { method: "POST", body });
  } catch {
    throw new ApiError("Could not reach the ingestion service.");
  }

  if (!res.ok) {
    // FastAPI puts the readable reason in `detail`; fall back to the status
    // only when it has not.
    let detail = `The service returned ${res.status}.`;
    try {
      const payload = (await res.json()) as { detail?: unknown };
      if (typeof payload.detail === "string") detail = payload.detail;
    } catch {
      /* keep the status-based message */
    }
    throw new ApiError(detail);
  }

  return (await res.json()) as Inspection;
}
