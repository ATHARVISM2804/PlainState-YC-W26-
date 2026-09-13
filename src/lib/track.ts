/**
 * Analytics, provider-agnostic and privacy-plain.
 *
 * Five events matter on this page: a figure inspected, the demo view
 * switched, a film played, an export sent, a call booked. Nothing here
 * identifies a person. If Plausible is loaded it gets the event; if gtag is
 * loaded it gets the event; otherwise the event is logged in development and
 * dropped in production. Add the provider's script tag to index.html and
 * method.html and nothing else changes.
 */
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  if (window.plausible) window.plausible(event, { props });
  else if (window.gtag) window.gtag("event", event, props);
  else if (import.meta.env.DEV) console.debug("[track]", event, props);
}

/**
 * Delegated tracking for the links that matter: any mailto whose subject is
 * about an export counts as an export sent; any link to the booking address
 * counts as a call booked. Attach once per page.
 */
export function attachLinkTracking(calendarHref: string): () => void {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href") ?? "";
    if (href === calendarHref) track("call_booked", { from: a.closest("nav, footer, section")?.id || a.closest("nav, footer, section")?.tagName.toLowerCase() });
    else if (href.startsWith("mailto:") && /export/i.test(href)) track("export_sent", { from: a.closest("nav, footer, section")?.id || "page" });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
