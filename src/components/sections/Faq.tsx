import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { FAQS } from "../../data/content";
import { Reveal } from "../Reveal";
import "./Faq.css";

/**
 * Radix rather than native <details>, for one reason: height.
 *
 * A native disclosure cannot animate open, so the answer appears in a jump.
 * Radix exposes the measured height as a CSS variable, which lets the panel
 * ease. Everything else native <details> gave for free — keyboard operation,
 * correct roles, focus handling — Radix also provides, so nothing is traded
 * away to get it.
 */
export function Faq() {
  return (
    <section className="section section--line" id="faq">
      <span className="eyebrow">Questions we actually get</span>
      <div className="split">
        <Reveal>
          <h2>The objections, answered plainly.</h2>
        </Reveal>
        <Reveal>
          <Accordion.Root type="single" collapsible className="faq">
            {FAQS.map((item, i) => (
              <Accordion.Item className="faq__item" value={`q${i}`} key={item.q}>
                <Accordion.Header className="faq__header">
                  <Accordion.Trigger className="faq__trigger">
                    <span>{item.q}</span>
                    <Plus className="faq__sign" size={16} strokeWidth={2} aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq__panel">
                  <p className="faq__answer">{item.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
